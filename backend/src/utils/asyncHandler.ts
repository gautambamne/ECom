// We use asyncHandler to catch async errors automatically and forward them to Express’s error middleware, so we don’t have to write try/catch in every single route.

import type { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

const asyncHandler = (fn: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req,res,next))
        .catch(error=> next(error)); // passes error to Express error middleware
    }

}

export default asyncHandler;