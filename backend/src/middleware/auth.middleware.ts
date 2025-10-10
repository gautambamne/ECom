import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../advices/ApiError";
import { JwtUtils } from "../utils/auth-utils";
import { StatusCodes } from "http-status-codes";


export const authMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    try {
        const accessToken = req.cookies?.access_token;
        const bearerToken = req.headers.authorization;

        let bearer_token : string | undefined;

        if(bearerToken && bearerToken.startsWith("Bearer")){
            const parts = bearerToken.split(" ");
            if(parts.length === 2){
                bearer_token = parts[1];
            }
        }

        if(!accessToken && !bearer_token){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Token not provided")
        }

        const parsedToken = accessToken || bearer_token

        const decoded = JwtUtils.verifyAccessToken(parsedToken!);

        req.user = decoded;
        next();

    } catch (error) {
        next(new ApiError(StatusCodes.UNAUTHORIZED,"Invalid or expire token"))
    }
}