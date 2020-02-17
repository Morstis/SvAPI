import { Router } from 'express';
import NachhilfeController from '../controller/NachhilfeController';

const router = Router();

router.post('/', NachhilfeController.upload);
router.get('/', NachhilfeController.load);

export default router;
