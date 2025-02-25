import { Router } from "express";
import ArticelController from "../controller/ArticelController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.post(
  "/",
  [checkJwt, checkRole(["SV", "ADMIN"])],
  ArticelController.newArticel
);

router.get("/", [checkJwt], ArticelController.getArticel);

export default router;
