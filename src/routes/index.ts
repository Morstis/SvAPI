import { Router } from "express";
import auth from "./auth";
import user from "./user";
import articel from "./articel";
import waypoint from "./waypoints"

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/articel", articel);
routes.use("/waypoints", waypoint);

export default routes;
