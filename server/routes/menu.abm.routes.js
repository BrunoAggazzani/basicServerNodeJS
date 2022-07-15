import { Router } from "express";
import * as menuAbmControll from "../controllers/menu.abm.controllers";
const router = Router();

router.get('/', menuAbmControll.getAbm);

export default router;