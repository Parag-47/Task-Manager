import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    const decodedToken = await jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    const authenticatedUser = await User.findById(decodedToken?._id).select("-password -refreshToken -__v");

    if (!authenticatedUser) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = authenticatedUser;
    
    next();
  } catch (error) {
    //console.log("Error While Verifying Tokens!", error);
    throw new ApiError(401, error?.message || "Invalid Access Token!");
  }
});

export default verifyJWT;