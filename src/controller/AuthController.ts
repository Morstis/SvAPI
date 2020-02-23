import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository, FindManyOptions } from 'typeorm';
import { validate } from 'class-validator';
import * as nodeMailer from 'nodemailer';

import { User } from '../entity/User';
import config from '../config/config';

class AuthController {
  static defaultResponse: FindManyOptions<User> = {
    select: [
      'id',
      'vorname',
      'nachname',
      'klasse',
      'email',
      'role',
      'uid',
      'verified'
    ]
  };

  static login = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.send({ res: false, error: 'user not found' });
      return;
    }
    if (user.verified === false) {
      console.log('not verified');
      res.send({ res: false, error: 'user is not verified' });
      return;
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.send({ res: false, error: 'wrong password' });
      return;
    }
    //Sing JWT, valid for 1 hour

    const token = jwt.sign(
      {
        userId: user.id,
        vorname: user.vorname,
        nachname: user.nachname,
        klasse: user.klasse,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Send the jwt in the response
    res.send({ res: true, token: token });
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { vorname, nachname, klasse, email, pw1, pw2, datenschutz } = req.body;
    let user = new User();
    user.vorname = vorname;
    user.nachname = nachname;
    user.klasse = klasse;
    user.email = email;
    user.password =
      pw1 === pw2 ? pw1 : res.send({ res: false, error: 'password missmatch' });
    user.createUID();
    user.role = 'SCHUELER';
    user.verified = false;
    user.datenschutz = datenschutz;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    const userRepository = getRepository(User);
    let existing: User;
    try {
      existing = await userRepository.findOneOrFail({
        where: { email: user.email }
      });
    } catch (e) {}
    if (existing !== undefined) {
      res.send({ res: false, error: 'email already in use' });
      return;
    }

    //send email
    let transporter = nodeMailer.createTransport({
      host: 'hag-iserv.de',
      port: 25,
      auth: {
        user: 'l.wiese',
        pass: 'Morstis_nex'
      }
    });

    let mailOptions = {
      from: 'Sv-Website <sv@hag-iserv.de>',
      to: user.email,
      subject: 'Verifiziere deine Email',
      html: config.mail(user)
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send({ res: false, error: 'email adress is not existing' });
        return console.log('Mail error ' + error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);

      //Hash the password, to securely store on DB
      user.hashPassword();

      //Try to save
      try {
        userRepository.save(user);
      } catch (e) {
        res.send({ res: false, error: 'saving failed', description: e });
        return;
      }
      //If all ok, send 201 response
      res.status(201).send({ res: true });
    });
  };

  // ####################### OLD LOGIN #######################################
  static loginOld = async (req: Request, res: Response) => {
    console.log('there');

    // Check if email and password are set
    let { email, password } = req.body;

    if (!password) {
      const userRepository = getRepository(User);
      let user: User;

      try {
        user = await userRepository.findOneOrFail({ where: { email } });
      } catch (error) {
        res.send({ res: false, error: 'user not found' });
      }
      if (user.verified === false) {
        console.log('not verified');
        res.send({ res: false, error: 'user is not verified' });
      }

      res.send({ res: true });
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.send({
        res: false,
        description: error,
        error: 'impossible case: user is wrong at the 2nd attempt'
      });
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.send({ res: false, error: 'wrong password' });
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {
        userId: user.id,
        vorname: user.vorname,
        nachname: user.nachname,
        klasse: user.klasse,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Send the jwt in the response
    res.send({ res: true, token: token });
  };

  static verify = async (req: Request, res: Response) => {
    let params: { email: string; uid: string } = req.body;

    if (!(params.email && params.uid)) {
      res.send({ res: false, error: 'params not valid' });
      return;
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { email: params.email }
      });
    } catch (error) {
      res.send({ res: false, error: 'User not found' });
      return;
    }

    if (user.verified) {
      res.send({ res: true });
      return;
    }
    if (user.uid !== params.uid) {
      res.send({ res: false, error: 'uid not matching' });
      return;
    }
    user.verified = true;
    user.uid = '';
    try {
      await userRepository.save(user);
    } catch (e) {
      res.send({ res: false, error: 'db writing failed', message: e });
    }

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
