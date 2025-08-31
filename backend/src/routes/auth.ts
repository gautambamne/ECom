import { Router } from "express";
import { LoginController, RegisterController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', RegisterController);
authRouter.post('/login', LoginController);

export default authRouter;