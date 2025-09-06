import { ApiResponse } from "../advices/ApiResponse";
import { sessionRepository } from "../repositories/session.repositories";
import asyncHandler from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";

export const getAllSessionController = asyncHandler(async(req, res)=>{
    if(!req.user){
        return res.status(401).json({error: "User not authenticated"})
    }

    console.log(req.user)

    const {id} = req.user;

    const allSessions = await sessionRepository.getSessionsByUserId(id)

    return res.status(StatusCodes.OK).json(new ApiResponse({
        session: allSessions,
        message: "All session Retrived"
    }))
})