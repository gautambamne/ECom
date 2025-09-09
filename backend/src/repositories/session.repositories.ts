import { prisma } from "../db/connectDb";
import { Prisma, type Sessions } from "../generated/prisma";

export const sessionRepository = {
    createSession: async(data: Prisma.SessionsCreateInput): Promise<Sessions>=>{
        return await prisma.sessions.create({data});
    },
    getSessionById: async(id: string): Promise<Sessions | null>=>{
        return await prisma.sessions.findUnique({where: { id }});
    },
    getSessionByToken: async(token: string): Promise<Sessions | null>=>{
        return await prisma.sessions.findUnique({where: { token }});
    },
    getSessionsByUserId: async(userId: string): Promise<Sessions[]>=>{
        return await prisma.sessions.findMany({where: { user_id: userId }});
    },
    updateSessionById: async(id: string, data: Prisma.SessionsUpdateInput): Promise<Sessions>=>{
        return await prisma.sessions.update({where: { id }, data});
    },
    deleteSessionById: async(id: string): Promise<boolean>=>{
         try {
            await prisma.sessions.delete({where: { id }});
            return true;
         } catch (error) {
            return false;
         }
    }

}