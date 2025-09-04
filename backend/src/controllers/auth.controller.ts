import { ApiError } from "../advices/ApiError";
import { ApiResponse } from "../advices/ApiResponse";
import { prisma } from "../db/connectDb";
import type { Users } from "../generated/prisma";
import { UserRole } from "../generated/prisma";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegistrationSchema,
  VerifySchema,
} from "../schema/auth.schema";
import asyncHandler from "../utils/asyncHandler";
import {
  JwtUtils,
  passwordUtils,
  verificationUtils,
} from "../utils/auth-utils";
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
        verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
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
        verification_code_expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        role: [UserRole.USER],
      },
    });
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
    throw new ApiError(
      400,
      "validation Error",
      zodErrorFormatter(result.error)
    );
  }

  const { email, verification_code } = result.data;
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

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

  const userToBeReturned = await prisma.users.update({
    where: { email },
    data: {
      is_verified: true,
      verification_code: null,
      verification_code_expiry: null,
    },
  });

  const access_token = JwtUtils.generateAccesToken({
    id: userToBeReturned.id,
    name: userToBeReturned.name,
    email: userToBeReturned.email,
    role: userToBeReturned.role,
  });

  const refresh_token = JwtUtils.generateRefreshToken({
    id: userToBeReturned.id,
  });

  await prisma.sessions.create({
    data: {
      token: refresh_token,
      ip_address: req.ip || "",
      user_agent: req.headers["user-agent"] || "",
      expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: {
        connect: { id: userToBeReturned.id },
      },
    },
  });

  const {
    password: _,
    verification_code: __,
    verification_code_expiry: ___,
    ...userWithoutSenesitive
  } = userToBeReturned;

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
        message: "Email verified successfully and token set in cookie",
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
  if (!savedUser) {
    throw new ApiError(401, "Invalid credentials");
  }
  if (!savedUser.is_verified) {
    throw new ApiError(403, "Please verify your email to login");
  }
  const isPasswordValid = await passwordUtils.comparredPassword(
    password,
    savedUser.password
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const access_token = JwtUtils.generateAccesToken({
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
    role: savedUser.role,
  });

  const refresh_token = JwtUtils.generateRefreshToken({
    id: savedUser.id,
  });

  await prisma.sessions.create({
    data: {
      token: refresh_token,
      ip_address: req.ip || "",
      user_agent: req.headers["user-agent"] || "",
      expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: {
        connect: { id: savedUser.id },
      },
    },
  });

  const {
    password: _,
    verification_code: __,
    verification_code_expiry: ___,
    ...userWithoutSenesitive
  } = savedUser;

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
        message: "Login successfully ",
      })
    );
});


export const LogoutConroller = asyncHandler(async (req, res) => {
  const result = req.cookies?.refresh_token;

  if (result) {
    try {
      await prisma.sessions.delete({
        where: {
          token: result,
        },
      });
    } catch (error) {
      console.error(
        "session for token not found during logout, proceeding to clear cookies",
        error
      );
    }
  }

  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    .clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    .status(200)
    .json(new ApiResponse({ message: "Logout Successfully" }));
});


export const ForgotPasswordController = asyncHandler(async(req, res)=>{
  const result = ForgotPasswordSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation Error",
      zodErrorFormatter(result.error)
    );
  }
  const {email} = result.data;
  const existingUser = await prisma.users.findUnique({
    where: { email },
  })
  if(!existingUser){
    throw new ApiError(404, "User not exist with this email");
  }

})

