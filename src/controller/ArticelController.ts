import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { Articel } from "../entity/articel";
import { validate } from "class-validator";
import * as fs from "fs";
import config from "../config/config";

class ArticelController {
  static newArticel = async (req: Request, res: Response) => {
    const articel: Articel = req.body;
    const aR = getRepository(Articel);

    const errors = await validate(articel);
    if (errors.length > 0) {
      res.send({
        res: false,
        error: "title already in use",
        decription: errors
      });
      return;
    }

    articel.image =
      'url("../../../../assets/img/' +
      articel.title.replace(/\s/g, "-") +
      '.png")';
    try {
      await aR.save(articel);
    } catch (e) {
      res.send({
        res: false,
        error: "title already in use",
        decription: e
      });
      return;
    }
    // Remove header
    let base64Image = articel.image.split(";base64,").pop();
    fs.writeFile(
      config.imagePath + articel.title.replace(/\s/g, "-") + ".png",
      base64Image,
      { encoding: "base64" },
      err => {
        console.log(err);

        if (err) {
          res.send({
            res: false,
            error: "can not write file",
            description: err
          });
          return;
        }
      }
    );
    res.send({ res: true, return: articel });
  };

  static getArticel = async (req: Request, res: Response) => {
    const aR = getRepository(Articel);
    const articel = await aR.find();
    res.send({ res: true, return: articel });
  };
}
export default ArticelController;
