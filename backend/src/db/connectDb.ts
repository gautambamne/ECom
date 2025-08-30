import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const connectDb = () => {
    return new Promise<void>((resolve, reject)=>{
        prisma.$connect()
        .then(()=>{
            console.log("Database connected");
            resolve();
        }).catch((error)=>{
            prisma.$disconnect();
            console.error("Database connection error: ", error);
            console.log(error);
            reject(error);
        });

    })
} 

const gracefulShutdown = async() => {
    console.log("Shutting down database connection...");
    await prisma.$disconnect()
    console.log("Database connection closed...");
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export { prisma, connectDb };