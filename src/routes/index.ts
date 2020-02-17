import { Router } from 'express';
import auth from './auth';
import user from './user';
import articel from './articel';
import waypoint from './waypoints';
import nachhilfe from './nachhilfe';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/articel', articel);
routes.use('/waypoints', waypoint);
routes.use('/nachhilfe', nachhilfe);

export default routes;
