import { Router } from "express";
import auth from "./auth";
import user from "./user";
import articel from "./articel";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/articel", articel);

export default routes;
