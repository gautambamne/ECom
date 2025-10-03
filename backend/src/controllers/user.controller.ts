import { StatusCodes } from "http-status-codes";
import { ApiError } from "../advices/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { sanitizeUser } from "./auth.controller";
import { UserRepository } from "../repositories/user.repositories";
import { ApiResponse } from "../advices/ApiResponse";
import { PasswordChangeSchema, UpdateUserSchema } from "../schema/user.schema";
import { zodErrorFormatter } from "../utils/format-validation-error";
import { passwordUtils } from "../utils/auth-utils";

export const meController = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not autheticated")
    }

    const {id} = req.user;

    const user = await UserRepository.getUserById(id)

    if(!user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated")
    }

    const sanatizedUser = sanitizeUser(user)

    res.status(StatusCodes.OK).json(new ApiResponse({
        user: sanatizedUser
    }))

});

export const updateUserController = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not autheticated")
    }
    const {id} = req.user;
    const result = UpdateUserSchema.safeParse(req.body)

    if(!result.success){
        throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error))
    }

    const {name} = result.data;

    const user = await UserRepository.getUserById(id)
    if(!user){
        throw new ApiError(StatusCodes.UNAUTHORIZED , "User not authenticated") 
    }

    const updatedUser = await UserRepository.updateUserById(id, {
        name
    })

    const sanatizedUser = sanitizeUser(updatedUser)

    res.status(StatusCodes.OK).json(new ApiResponse({
        user:sanatizedUser
    }))
});

export const updatePasswordController = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not autheticated")
    }
    const {id} = req.user;
    const result = PasswordChangeSchema.safeParse(req.body)

    if(!result.success){
        throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error))
    }

    const {currrentPassword, newPassword } = result.data;

    const user = await UserRepository.getUserById(id)
      if(!user){
         throw new ApiError(StatusCodes.UNAUTHORIZED , "User not authenticated")
    }

    const isPassValid = await passwordUtils.comparredPassword(currrentPassword, user.password);

    if(!isPassValid){
         throw new ApiError(StatusCodes.UNAUTHORIZED , "The Password isnt match with your current password try to reset")
    }

    const hashedPassword = await passwordUtils.generatedHashPassword(newPassword)

    const updateUser = await UserRepository.updateUserById(id,{
        password: hashedPassword
    })

    const sanatizedUser = sanitizeUser(updateUser)
    
    res.status(StatusCodes.OK).json(new ApiResponse({
        user : sanatizedUser
   }))
});
