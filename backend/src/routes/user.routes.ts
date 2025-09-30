import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { meController, updatePasswordController, updateUserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/me", meController);
userRouter.put("/update", updateUserController);
userRouter.put("/update-password", updatePasswordController);

export default userRouter;