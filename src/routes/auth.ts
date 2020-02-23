import { Router } from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/checkJwt';
import UserController from '../controller/UserController';

const router = Router();
//Login route
router.post('/login', AuthController.login);

router.post('/loginOld', AuthController.loginOld);

//Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword);

// verify user
router.post('/verify', AuthController.verify);

//Create a new user
router.post('/register', AuthController.newUser);

export default router;
