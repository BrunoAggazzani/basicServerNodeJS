import { Router } from "express";
import * as authControll from "../controllers/test.controllers";
const router = Router();

router.post('/', authControll.sqlServerConnect);

export default router;