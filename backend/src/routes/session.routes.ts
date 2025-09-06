import { Router } from "express";
import { getAllSessionController } from "../controllers/session.controller";

const sessionRouter = Router()

sessionRouter.get("", getAllSessionController)

export default sessionRouter;