import { Router } from "express";
import { validateDto_Body } from "../middlewares/validateDto.middleware.js";
import { validateRegister, validateLogin, validateUpdateAccountInfo, validateUpdatePassword} from "../validation/userValidation.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updatePassword,
  updateAccountInfo,
  deleteUser
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", validateDto_Body(validateRegister), registerUser);
userRouter.post("/login", validateDto_Body(validateLogin), loginUser);
userRouter.get("/logout", verifyJWT, logoutUser);
userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);
userRouter.get("/refreshAccessToken", verifyJWT, refreshAccessToken);
userRouter.post("/updateAccountInfo", verifyJWT, validateDto_Body(validateUpdateAccountInfo), updateAccountInfo);
userRouter.post("/updatePassword", verifyJWT, validateDto_Body(validateUpdatePassword), updatePassword);
userRouter.get("/deleteAccount", verifyJWT, deleteUser);

export default userRouter;