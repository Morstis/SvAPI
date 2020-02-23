import { Request, Response } from 'express';
import { getRepository, FindManyOptions } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entity/User';
import config from '../config/config';

class UserController {
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
    ] //We dont want to send the passwords on response
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
      res.send(user);
    } catch (error) {
      res.status(404).send('User not found');
    }
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
      res.status(404).send('User not found');
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
      res.status(409).send(e);
      return;
    }

    user = await userRepository.findOneOrFail(
      id,
      UserController.defaultResponse
    );
    res.send({ res: true, return: user });
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
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
