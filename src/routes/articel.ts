import { Router } from "express";
import ArticelController from "../controller/ArticelController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.post("/", [checkJwt, checkRole(["SV"])], ArticelController.newArticel);

// router.get("/", ArticelController.getArticel);

export default router;
