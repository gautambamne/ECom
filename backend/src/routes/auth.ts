import { Router } from "express";
import { RegisterController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', RegisterController);

export default authRouter;