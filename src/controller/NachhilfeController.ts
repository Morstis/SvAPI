import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { NachhilfeUser } from '../entity/nachhilfe';
import { validate } from 'class-validator';

class NachhilfeController {
  static upload = async (req: Request, res: Response) => {
    // connect to db
    const nR = getRepository(NachhilfeUser);
    // get data
    let nachhilfeUser: NachhilfeUser = req.body;

    // validate user
    const e = await validate(nachhilfeUser);
    if (e.length > 0) {
      // send error
      res.status(400).send(e);
    }
    // catch creation errors
    try {
      // save user
      await nR.save(nachhilfeUser);
    } catch (e) {
      res.status(400).send({ error: 'error: ' + e });
    }
    // if no errors are thrown send 201 (user created) + return of user for the push based systems
    res.status(201).send(nachhilfeUser);
  };

  static load = async (req: Request, res: Response) => {
    const nR = getRepository(NachhilfeUser);
    const nachhilfeUsers = await nR.find();

    res.send(nachhilfeUsers);
  };
}
export default NachhilfeController;
