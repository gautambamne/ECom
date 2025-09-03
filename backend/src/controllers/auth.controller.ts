import { ApiError } from "../advices/ApiError";
import { ApiResponse } from "../advices/ApiResponse";
import { prisma } from "../db/connectDb";
import type { Users } from "../generated/prisma";
import { UserRole } from "../generated/prisma";
import { LoginSchema, RegistrationSchema } from "../schema/auth.schema";
import asyncHandler from "../utils/asyncHandler";
import { passwordUtils, verificationUtils } from "../utils/auth-utils";
import { zodErrorFormatter } from "../utils/format-validation-error";

export const RegisterController = asyncHandler(async (req, res) => {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation Error",
      zodErrorFormatter(result.error)
    );
  }

  const { name, email, password } = result.data;

  const savedUser = await prisma.users.findUnique({
    where: { email },
  });
  if (savedUser?.is_verified) {
    throw new ApiError(409, `User already exist with this email: ${email}`);
  }
  let userToBeReturned: Users;
  let verification_code = verificationUtils();
  let hashedPassword = await passwordUtils.generatedHashPassword(password);
  let statusCode: number;

  if (!savedUser) {
    userToBeReturned = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verification_code,
        role: [UserRole.USER],
      },
    });
    statusCode = 201;
  } else {
    userToBeReturned = await prisma.users.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        verification_code,
        role: [UserRole.USER],
      },
    });
    statusCode = 200;
  }

  const {
    // password: _,
    verification_code: __,
    ...userWithoutSensitive
  } = userToBeReturned;
  return res.status(statusCode).json(
    new ApiResponse({
      user: userWithoutSensitive,
      message: "Account Successfullty Registered",
    })
  );
});









export const LoginController = asyncHandler(async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation Error",
      zodErrorFormatter(result.error)
    );
  }

  const { email, password } = result.data;
  const savedUser = await prisma.users.findUnique({
    where: { email },
  });
  if(!savedUser){
    throw new ApiError(401, "Invalid credentials");
  }
  if(!savedUser.is_verified){
    throw new ApiError(401, "Please verify your email to login");
  }
  const isPasswordValid = await passwordUtils.comparredPassword(password, savedUser.password);
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid credentials");
  }
  return res.status(200).json( new ApiResponse({message: "Login successful"}) );
});
