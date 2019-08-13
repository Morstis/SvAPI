import { Request, Response } from "express";
import { getRepository, FindManyOptions } from "typeorm";
import { validate } from "class-validator";
import * as nodeMailer from "nodemailer";
import { User } from "../entity/User";
import config from "../config/config";

class UserController {
  static defaultResponse: FindManyOptions<User> = {
    select: ["id", "firstName", "name", "klasse", "email", "role"] //We dont want to send the passwords on response
  };

  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find(UserController.defaultResponse);

    //Send the users object
    res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(
        id,
        UserController.defaultResponse
      );
    } catch (error) {
      res.status(404).send("User not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { firstName, name, klasse, email, password, uid } = req.body;
    let user = new User();
    user.firstName = firstName;
    user.name = name;
    user.klasse = klasse;
    user.email = email;
    user.password = password;
    user.uid = uid;
    user.role = "Schüler";
    user.uid = createUID();
    user.verified = false;

    function createUID() {
      let dt = new Date().getTime();
      const uuid: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        c => {
          // tslint:disable-next-line: no-bitwise
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);

          // tslint:disable-next-line: no-bitwise
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the email is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.send({ res: false, error: "email already in use" });
      return;
    }

    //send email
    let transporter = nodeMailer.createTransport({
      host: "hag-iserv.de",
      port: 25,
      auth: {
        // should be replaced with real sender's account
        user: "l.wiese",
        pass: "Morstis_nex"
      }
    });

    let mailOptions = {
      // should be replaced with real recipient's account
      from: "Sv-Website <sv@hag-iserv.de>",
      to: "lucas.wiese@gmx.de",
      subject: "Verifiziere deine Email",
      html: config.mail(user)
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Mail error " + error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
      //If all ok, send 201 response
      res.status(201).send({ res: true });
    });
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { email, role } = req.body;

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }

    //Validate the new values on model
    user.email = email;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, that means email already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("email already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);

    userRepository.delete({});

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
