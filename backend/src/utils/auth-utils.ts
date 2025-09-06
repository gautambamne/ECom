import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Users } from '../generated/prisma';

const passwordUtils = {
    generatedHashPassword: (password: string)=>{
        return bcrypt.hashSync(password, 10);
    },
    comparredPassword: (originalPassword: string, hashedPassword: string)=>{
        return bcrypt.compareSync(originalPassword, hashedPassword);
    }
}

const verificationUtils = ()=>{
    return String(Math.floor(100000 + Math.random() * 900000));
}

export interface IAccessPayload{
    id: Users['id'];
    name: Users['name'];
    email: Users['email'];
    role: Users['role'];
}

interface IRefreshPayload{
    id: Users['id'];
}

const JwtUtils = {
    generateAccesToken: (data: IAccessPayload): string =>{
        try {
            if(!process.env.ACCESS_TOKEN_SECRET){
                throw new Error("ACCESS_TOKEN_SECRET is not defined");
            }
        
            const access_token = jwt.sign(
                {data},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'} as any
            );
            return access_token;
        
        } catch (error) {
            console.error('jwt generation error', error);
            throw new Error('jwt generation failed');
        }
    },

    generateRefreshToken: (data: IRefreshPayload): string =>{
        try {
            if(!process.env.REFRESH_TOKEN_SECRET){
                throw new Error("REFRESH_TOKEN_SECRET is not defined");
            }
        
            const refresh_token = jwt.sign(
                {data},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d'} as any
            );
            return refresh_token;
        
        } catch (error) {
            console.error('jwt generation error', error);
            throw new Error('jwt generation failed');
        }
    },

    verifyAccessToken: (access_token: string): IAccessPayload =>{
        try {
            if(!process.env.ACCESS_TOKEN_SECRET){
                throw new Error("ACCESS_TOKEN_SECRET is not defined");
            }

            const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
            if(!decoded.data){
                throw new Error("Invalid access token payload");
            }
            return decoded.data as IAccessPayload;

        } catch (error) {
            console.error('Access token verification failed:', error);
            throw new Error('Invalid or expired access token');
        }
    },

    verifyRefrshToken: (refresh_token: string): IRefreshPayload =>{
        try {
            if(!process.env.REFRESH_TOKEN_SECRET){
                throw new Error("REFRESH_TOKEN_SECRET is not defined");
            }

            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET) as JwtPayload;
            if(!decoded.id){
                throw new Error("Invalid refresh token payload");
            }
            return {id:decoded.id};

        } catch (error) {
            console.error('Access token verification failed:', error);
            throw new Error('Invalid or expired access token');
        }
    },

}


export {passwordUtils, verificationUtils, JwtUtils };