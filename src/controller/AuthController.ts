import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, FindManyOptions } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static defaultResponse: FindManyOptions<User> = {
    select: [
      "id",
      "firstName",
      "name",
      "klasse",
      "email",
      "role",
      "uid",
      "verified"
    ]
  };
  static login = async (req: Request, res: Response) => {
    //Check if email and password are set
    let { email, password } = req.body;

    if (!password) {
      const userRepository = getRepository(User);
      let user: User;
      try {
        user = await userRepository.findOneOrFail({ where: { email } });
      } catch (error) {
        res.send({ res: false, error: "user not found" });
      }
      if (user.verified === false) {
        console.log("not verified");
        res.send({ res: false, error: "user is not verified" });
      }
      res.send({ res: true });
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.send({
        res: false,
        description: error,
        error: "impossible case: user is wrong at the 2nd attempt"
      });
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.send({ res: false, error: "wrong password" });
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        name: user.name,
        class: user.klasse,
        email: user.email
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send({ res: true, token: token });
  };

  static verify = async (req: Request, res: Response) => {
    let { uid, id } = req.body;
    if (!(uid && id)) {
      res.send({ res: false, error: "params not valid" });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(
        id,
        AuthController.defaultResponse
      );
    } catch (error) {
      res.send({ res: false, error: "User not found" });
    }

    if (user.uid !== uid) {
      res.send({ res: false, error: "uid not matching" });
    }
    user.verified = true;
    user.uid = "";
    userRepository.save(user);

    res.send({ res: true });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
