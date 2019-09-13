import { Router } from "express";
import WaypointController from "../controller/WaypointController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.post(
  "/",
  [checkJwt, checkRole(["SV", "ADMIN"])],
  WaypointController.newWaypoint
);
router.get("/:url", [checkJwt], WaypointController.getWaypoint)
export default router;
