import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  // console.log(token);

  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const newToken = jwt.sign(
    {
      userId: jwtPayload.id,
      firstName: jwtPayload.firstName,
      name: jwtPayload.name,
      class: jwtPayload.klasse,
      email: jwtPayload.email,
      role: jwtPayload.role
    },
    config.jwtSecret,
    {
      expiresIn: "1h"
    }
  );
  res.setHeader("auth", newToken);

  //Call the next middleware or controller
  next();
};
