import { Router } from "express";
import * as authControll from "../controllers/auth.controllers";
const router = Router();

router.get('/', authControll.signin);

export default router;