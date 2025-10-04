import { ApiError } from "../advices/ApiError";
import { ApiResponse } from "../advices/ApiResponse";
import type { Users } from "../generated/prisma";
import { UserRole } from "../generated/prisma";
import { sessionRepository } from "../repositories/session.repositories";
import { UserRepository } from "../repositories/user.repositories";
import {
  CheckVerificationCodeSchema,
  ForgotPasswordSchema,
  LoginSchema,
  RegistrationSchema,
  ResendVerificationCodeSchema,
  ResetPasswordSchema,
  VerifySchema,
} from "../schema/auth.schema";
import asyncHandler from "../utils/asyncHandler";
import {
  JwtUtils,
  passwordUtils,
  verificationUtils,
} from "../utils/auth-utils";
import { zodErrorFormatter } from "../utils/format-validation-error";


export const sanitizeUser = (user: Users)=>{
   const{ password: _,
    verification_code: __,
    verification_code_expiry: ___,
    ...userWithoutSenesitive
  } = user;
  return userWithoutSenesitive;
}

const handleAuthSuccess = async(user: Users, message:string, req: any, res: any)=>{
    const access_token = JwtUtils.generateAccesToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,

  });

  const refresh_token = JwtUtils.generateRefreshToken({ id: user.id });

  await sessionRepository.createSession({
     token: refresh_token,
      ip_address: req.ip || "",
      user_agent: req.headers["user-agent"] || "",
      expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: {
        connect: { id: user.id },
      },
  })

  const userWithoutSenesitive = sanitizeUser(user);

  res
    .status(200)
    .cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    .cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    .json(
      new ApiResponse({
        user: userWithoutSenesitive,
        access_token: access_token,
        message: message,
      })
    );
}

export const RegisterController = asyncHandler(async (req, res) => {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400,"validation Error",zodErrorFormatter(result.error)
    );
  }

  const { name, email, password } = result.data;

  const savedUser = await UserRepository.getUserByEmail(email);
  if (savedUser?.is_verified) {
    throw new ApiError(409, `User already exist with this email: ${email}`);
  }
  let userToBeReturned: Users;
  let verification_code = verificationUtils();
  let hashedPassword = await passwordUtils.generatedHashPassword(password);
  let statusCode: number;

  if (!savedUser) {
    userToBeReturned = await UserRepository.createUser({
        name,
        email,
        password: hashedPassword,
        verification_code,
        verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        role: [UserRole.USER],
    });
    statusCode = 201;
  } else {
    userToBeReturned = await UserRepository.updateUserById(savedUser.id,{
        name,
        password: hashedPassword,
        verification_code,
        verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        role: [UserRole.USER],
    })
    statusCode = 200;
  }

  const {
    password: _,
    // verification_code: __,
    verification_code_expiry: ___,
    ...userWithoutSensitive
  } = userToBeReturned;

  return res.status(statusCode).json(
    new ApiResponse({
      user: userWithoutSensitive,
      message: "Account Successfullty Registered",
    })
  );
});


export const VerifyUser = asyncHandler(async (req, res) => {
  const result = VerifySchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400,"validation Error", zodErrorFormatter(result.error));
  }

  const { email, verification_code } = result.data;

  const existingUser = await UserRepository.getUserByEmail(email);

  if (!existingUser) {
    throw new ApiError(404, "User not exist with this email");
  }

  if (existingUser.verification_code != verification_code) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (
    !existingUser.verification_code_expiry ||
    existingUser.verification_code_expiry.getTime() < Date.now()
  ) {
    throw new ApiError(400, "Verification code expired");
  }

  const userToBeReturned = await UserRepository.updateUserById(existingUser.id,{
      is_verified: true,
      verification_code: null,
      verification_code_expiry: null,
  })
  
  res.status(200).json(
    new ApiResponse({
      message: "Email verified successfully"
    })
  );

});


export const LoginController = asyncHandler(async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError( 400, "validation Error", zodErrorFormatter(result.error));
  }

  const { email, password } = result.data;

  const savedUser = await UserRepository.getUserByEmail(email);
  if (!savedUser) {
    throw new ApiError(401, "Invalid credentials");
  }
  if (!savedUser.is_verified) {
    throw new ApiError(403, "Please verify your email to login");
  }
  const isPasswordValid = await passwordUtils.comparredPassword( password, savedUser.password );
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  await handleAuthSuccess(savedUser, "Login Successfully" ,req, res)

});


export const ForgotPasswordController = asyncHandler(async(req, res)=>{
  const result = ForgotPasswordSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "validation Error", zodErrorFormatter(result.error));
  }

  const {email} = result.data;

  const existingUser = await UserRepository.getUserByEmail(email);
  if(!existingUser || !existingUser.is_verified){
    throw new ApiError(404, "User not exist with this email");
  }

  const verification_code = verificationUtils();

  await UserRepository.updateUserById(existingUser.id,{
      verification_code,
      verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  });

  // TODO: Mail Functionality
  res.status(200).json(
  new ApiResponse({
    message: `Verification code sent to your email`
  }));
});


export const ResesndVerificationCodeController = asyncHandler(async(req, res)=>{
  const result = ResendVerificationCodeSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "validation Error", zodErrorFormatter(result.error));
  }

  const {email} = result.data;

  const existingUser = await UserRepository.getUserByEmail(email);
  if(!existingUser){
    throw new ApiError(404, "User not exist with this email");
  }
  if(existingUser.is_verified){
    throw new ApiError(400, "User already verified");
  }

  const verification_code = verificationUtils();

  await UserRepository.updateUserById(existingUser.id,{
      verification_code,
      verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes 
  });

  // TODO: Mail Functionality

  return res.status(200).json(
  new ApiResponse({
    message: "Verification code resent to your email"
    })
  )
});


export const CheckVerificationCodeController = asyncHandler(async(req, res)=>{
  const result = CheckVerificationCodeSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "validation Error", zodErrorFormatter(result.error));
  }

  const {email, verification_code} = result.data;

  const existingUser = await UserRepository.getUserByEmail(email);

  if(!existingUser){
    throw new ApiError(404, "User not exist with this email");
  }
  if(existingUser.verification_code != verification_code){
    throw new ApiError(400, "Invalid verification code");
  }
  if(!existingUser.verification_code_expiry || existingUser.verification_code_expiry.getTime() < Date.now()){
    throw new ApiError(400, "Verification code expired");
  }
  
  res.status(200).json(
  new ApiResponse({
    message: "Verification code is valid"
  }));
});


export const ResetPasswordController = asyncHandler(async(req, res)=>{
  const result = ResetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "validation Error", zodErrorFormatter(result.error));
  }

  const {email, verification_code, new_password} = result.data;

  const existingUser = await UserRepository.getUserByEmail(email);
  
  if(!existingUser){
    throw new ApiError(404, "User not exist with this email");
  }
  if(existingUser.verification_code != verification_code){
    throw new ApiError(400, "Invalid verification code");
  }
  if(!existingUser.verification_code_expiry || existingUser.verification_code_expiry.getTime() < Date.now()){
    throw new ApiError(400, "Verification code expired");
  }

  const hashedPassword = await passwordUtils.generatedHashPassword(new_password);

  await UserRepository.updateUserById(existingUser.id,{
      password: hashedPassword,
      verification_code: null,
      verification_code_expiry: null,
  })

  return res.status(200).json(
  new ApiResponse({
    message: "Password reset successful"
    })
  );  
});


export const RefreshTokenController = asyncHandler(async(req, res)=>{
  const refresh_token = req.cookies?.refresh_token;

  if(!refresh_token){
    throw new ApiError(401, "Refresh token not found");
  }

  const decoded = JwtUtils.verifyRefrshToken(refresh_token);
  
  const session = await sessionRepository.getSessionByToken(refresh_token);

  if(!session || session.expire_at.getTime() < Date.now()){
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await UserRepository.getUserById(decoded.id);

  if(!user){
    throw new ApiError(404, "User not found");
  }

  const access_token = JwtUtils.generateAccesToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.status(200)
  .cookie("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  }).json(
  new ApiResponse({
    access_token,
    message: "Access token refreshed successfully"
    })
  )
});

export const LogoutController = asyncHandler(async (req, res) => {
  const result = req.cookies?.refresh_token;

  if (result) {
    const session = await sessionRepository.getSessionByToken(result);
    if (session) {
      await sessionRepository.deleteSessionById(session.id);
    }
  }
  res.status(200)
  .clearCookie( "access_token", {path: '/'})
  .clearCookie("refresh_token", {path: '/'})
  .json(
  new ApiResponse({
    message: "Logout successful"
  }));
});


