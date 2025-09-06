import { Router } from "express";
import {
  RegisterController,
  VerifyUser,
  LoginController,
  ForgotPasswordController,
  CheckVerificationCodeController,
  ResetPasswordController,
  RefreshTokenController,
  LogoutController,
  ResesndVerificationCodeController
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", RegisterController);
authRouter.post("/verify", VerifyUser);
authRouter.post("/login", LoginController);
authRouter.post("/resend-verification-code", ResesndVerificationCodeController);
authRouter.post("/forgot-password", ForgotPasswordController);
authRouter.post("/check-verification-code", CheckVerificationCodeController);
authRouter.post("/reset-password", ResetPasswordController);
authRouter.post("/refresh-token", RefreshTokenController);
authRouter.post("/logout", LogoutController);

export default authRouter;