import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "../advices/ApiError";
import { UserRole } from "../generated/prisma";

export const checkRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = req.user?.role || [];
        
        const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!hasAllowedRole) {
            throw new ApiError(403, `Access denied. Required roles: ${allowedRoles.join(", ")}`);
        }
        
        next();
    };
};

// Predefined middleware for common role checks
export const isVendor = checkRole([UserRole.VENDOR, UserRole.ADMIN]);
export const isAdmin = checkRole([UserRole.ADMIN]);