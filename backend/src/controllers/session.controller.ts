import { ApiError } from "../advices/ApiError";
import { ApiResponse } from "../advices/ApiResponse";
import { prisma } from "../db/connectDb";
import { sessionRepository } from "../repositories/session.repositories";
import asyncHandler from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";


export const getAllSessionController = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated")
    }

    const {id} = req.user;

    const allSessions = await sessionRepository.getSessionsByUserId(id)

    return res.status(StatusCodes.OK).json(new ApiResponse({
        session: allSessions,
        message: "All session Retrived"
    }))
});


export const deleteSessionById = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated")
    }

    const {session_id} = req.params;

    if(!session_id){
       throw new ApiError(StatusCodes.BAD_REQUEST, "Session_id can not be empty")
    }

    const deletedSession = await sessionRepository.deleteSessionById(session_id)

    if(!deletedSession){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Requested session doesnot exist")
    }

    return res.status(StatusCodes.OK).json(new ApiResponse({
        message: "Session successfully deleted"
    }))
});

export const deleteAllSessionExceptCurrent = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not autheticated")
    }

    const refresh_token = req.cookies.refresh_token;

    await prisma.sessions.deleteMany({
        where:{
            token:{
                not: refresh_token
            }
        }
    });

    return res.json(new ApiResponse({
        message: "Session successfully deleted"
    }))
});




