import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { Articel } from "../entity/articel";
import { validate } from "class-validator";

class ArticelController {
  static newArticel = async (req: Request, res: Response) => {
    const articel: Articel = req.body;
    const aR = getRepository(Articel);

    const errors = await validate(articel);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    articel.image = 'url("../../../../assets/img/' + articel.image + '")';
    try {
      await aR.save(articel);
    } catch (e) {
      res.send({ res: false, error: "title already in use" });
      return;
    }
  };
}
export default ArticelController;
