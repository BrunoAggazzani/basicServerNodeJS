import { Router } from "express";
import * as authControll from "../controllers/login.controllers";
const router = Router();

router.get('/', authControll.signin);
router.get('/api/sigin', authControll.signin);

export default router;