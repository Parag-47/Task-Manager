import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

async function generateAccessAndRefreshTokens(userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    const loggedInUser = await User.findByIdAndUpdate(userId, {
      $set: { refreshToken },
    }).select("-password -refreshToken -__v");

    return { accessToken, refreshToken, loggedInUser };
  } catch (error) {
    console.error("Error while generating tokens, Error: ", error);
    throw new ApiError(500, "Something Went Wrong While Generating Tokens!");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    console.error(
      "Error: Got Missing Fields From The User While Registering New User!"
    );
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser)
    throw new ApiError(409, "This Email Or User Name Already Exists!");

  const user = await User.create({
    userName,
    email,
    password,
  });

  if (!user) throw new ApiError(500, "Failed To Create User Account!");

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  if (!createdUser) 
    throw new ApiError(500, "Something Went Wrong While Registering New User!");

  console.log(`New User Created, UserId: ${createdUser._id}`);

  const response = new ApiResponse(
    201,
    true,
    "User Registered Successfully!",
    createdUser
  );
  res.status(201).json(response);
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!(userName || email))
    throw new ApiError(400, "Username or Email Id is Required!");

  if (!password) throw new ApiError(400, "Password is Required!");

  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) throw new ApiError(404, "User doesn't exist!");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(400, "Incorrect Password!");

  const cookieData = await generateAccessAndRefreshTokens(user._id);

  if (!cookieData)
    throw new ApiError(500, "Something Went Wrong While Generating Cookies!");
  //console.log("Cookie Data: ", cookieData.user);

  res
    .status(200)
    .cookie("accessToken", cookieData.accessToken, cookieOptions)
    .cookie("refreshToken", cookieData.refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, true, "User Logged In Successfully!", cookieData)
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const response = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  if(!response) throw new ApiError(500, "Failed To Logout!");

  res
    .status(301)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .redirect("/");
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, true, "Access Token Refreshed", {
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, "Something Went Wrong While Refreshing Tokens!");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, true, "User Fetched Successfully!", req?.user));
});

const updateAccountInfo = asyncHandler(async (req, res) => {
  const { userName, email } = req.body;

  if (!userName && !email)
    throw new ApiError(400, "At Least One Field Is Required!");

  const isUserNameOrEmailTaken = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  });

  if (isUserNameOrEmailTaken)
    throw new ApiError(400, "The Username Or Email Is Already Taken!");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken -__v");

  if (!user) throw new ApiError(500, "Can't Find The User!");

  const cookieData = await generateAccessAndRefreshTokens(user._id);

  if (!cookieData)
    throw new ApiError(500, "Something Went Wrong While Generating Cookies!");

  res
    .status(200)
    .cookie("accessToken", cookieData.accessToken, cookieOptions)
    .cookie("refreshToken", cookieData.refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        true,
        "User Details Updated Successfully!",
        cookieData
      )
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if ((!oldPassword, !newPassword, !confirmPassword))
    throw new ApiError(400, "Please Provide All The Passwords!");

  if (newPassword !== confirmPassword)
    throw new ApiError(400, "New Password And Confirm Password Didn't Match!");

  const user = await User.findById(req.user?._id);

  if (!user) throw new ApiError(400, "Can't Find The User!");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Old Password Didn't Match!");

  const isOldAndNewPasswordSame = await user.isPasswordCorrect(newPassword);

  if (isOldAndNewPasswordSame)
    throw new ApiError(400, "Old And New Password Can't Be The Same!");

  user.password = newPassword;
  const updatedUser = await user.save({ validateBeforeSave: false });

  if (!updatedUser)
    throw new ApiError(500, "Something Went Wrong While Updating Password!");

  res
    .status(200)
    .json(new ApiResponse(200, true, "Password Updated Successfully!"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findById(req.user?._id);
  if (!existingUser) throw new ApiError(404, "Cannot Find The Account!");

  const deletedUser = await User.findByIdAndDelete(req.user?._id);
  if (!deletedUser) throw new ApiError(500, "Failed To Delete User Account!");

  console.log(`User with ID: ${req.user?._id} deleted their account.`);

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, true, "Account Deleted!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountInfo,
  updatePassword,
  deleteUser,
};