import { Router } from 'express';
import NachhilfeController from '../controller/NachhilfeController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

router.post('/', [checkJwt], NachhilfeController.upload);
router.get('/', [checkJwt], NachhilfeController.load);

export default router;
