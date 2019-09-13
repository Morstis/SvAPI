import { Request, Response } from "express";
import { Waypoint } from "../entity/waypoint";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

class WaypointController {
  static newWaypoint = async (req: Request, res: Response) => {
    const waypoints: Waypoint[] = req.body.waypointObj;
    const wR = getRepository(Waypoint);



    for (let i = 0; i < Object.keys(waypoints).length; i++) {
      waypoints[i].gruppe = Object.keys(waypoints).length;

      const errors = await validate(waypoints[i]);
      if (errors.length > 0) {
        res.send({
          res: false,
          error: "something went wrong",
          desciption: errors
        });
        return;
      }
      waypoints[i].image =
        'url("../../../../assets/img/' +
        waypoints[i].linkTo.replace(/\s/g, "-") +
        '.png")';
      try {
        await wR.save(waypoints[i]);
      } catch (e) {
        res.send({
          res: false,
          error: "Beim speichern ist ein Fehler aufgetraten",
          desciption: e
        });
        return;
      }

    }



    res.send({ res: true, return: waypoints });

  };

  static getWaypoint = async (req: Request, res: Response) => {
    const url: string = req.params.url;


    const wR = getRepository(Waypoint);
    try {
      const waypoint_group = await wR.createQueryBuilder().select().where("refereToURL = :refereToURL", { refereToURL: "/" + url }).orderBy("id", "DESC").getOne();


      const waypoint = await wR.createQueryBuilder().select().where("refereToURL = :refereToURL", { refereToURL: "/" + url }).orderBy("id", "DESC").limit(waypoint_group.gruppe).getMany();
      res.send(waypoint);

    } catch (e) {
      res.status(404).send(e);

    }

  }
}
export default WaypointController;
