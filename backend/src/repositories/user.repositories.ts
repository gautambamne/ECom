import { prisma } from "../db/connectDb";
import { Prisma, type Users } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const UserRepository = {
    createUser: async(data: Prisma.UsersCreateInput): Promise<Users>=>{
        const user = await prisma.users.create({data});
        await RedisService.set(`user:${user.id}`, user);
        await RedisService.set(`user:email:${user.email}`, user);
        return user;
    },


    getUserById: async(id: string):  Promise<Users | null> =>{
        const cacheKey = `user:${id}`;
        const cachedUser = await RedisService.getAndRefresh<Users>(cacheKey);

        if(cachedUser){
            // Revive Date objects from cache
            if (cachedUser.verification_code_expiry) {
                cachedUser.verification_code_expiry = new Date(cachedUser.verification_code_expiry);
            }
            cachedUser.created_at = new Date(cachedUser.created_at);
            cachedUser.updated_at = new Date(cachedUser.updated_at);
            return cachedUser
        }

        const user = await prisma.users.findUnique({ where: { id } });
        if (user) {
            await RedisService.set(cacheKey, user);
        }
        
        return user;

    },


    getUserByEmail: async(email: string): Promise<Users | null>=>{
        // Try to get from cache first
        const cacheKey = `user:email:${email}`;
        const cachedUser = await RedisService.getAndRefresh<Users>(cacheKey);
    
        if (cachedUser) {
            // Revive Date objects from cache
            if (cachedUser.verification_code_expiry) {
                cachedUser.verification_code_expiry = new Date(cachedUser.verification_code_expiry);
            }
            cachedUser.created_at = new Date(cachedUser.created_at);
            cachedUser.updated_at = new Date(cachedUser.updated_at);
            return cachedUser;
        }

        // If not in cache, get from database and cache it
        const user = await prisma.users.findUnique({ where: { email } });
        if (user) {
            await RedisService.set(cacheKey, user);
        }

        return user;

    },


    updateUserById: async(id: string, data: Prisma.UsersUpdateInput): Promise<Users>=>{
        const user = await prisma.users.update({ where: { id }, data });
        // Update cache
        await RedisService.set(`user:${user.id}`, user);
        await RedisService.set(`user:email:${user.email}`, user);

        return user;

    },

    deleteUserById: async(id: string): Promise<Users>=>{
        // Get user first to delete email cache
        const user = await prisma.users.findUnique({ where: { id } });

        if (user) {
            await RedisService.delete(`user:email:${user.email}`);
        }

        const deletedUser = await prisma.users.delete({where: {id}});
        // Deleted from cache
        await RedisService.delete(`user:${id}`);
        return deletedUser;
    }
}