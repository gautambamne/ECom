import { Router } from "express";
import { deleteAllSessionExceptCurrent, deleteSessionById, getAllSessionController } from "../controllers/session.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const sessionRouter = Router()

sessionRouter.use(authMiddleware);

sessionRouter.get("", getAllSessionController)
sessionRouter.delete("/:session_id", deleteSessionById)
sessionRouter.delete("/all-except-current", deleteAllSessionExceptCurrent)

export default sessionRouter;