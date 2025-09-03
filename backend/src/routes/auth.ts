import { Router } from "express";
import { LoginController, RegisterController, VerifyUser } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', RegisterController);
authRouter.get('/verify-code',VerifyUser);
authRouter.post('/login', LoginController);

export default authRouter;