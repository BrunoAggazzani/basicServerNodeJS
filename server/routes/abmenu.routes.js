import { Router } from "express";
import * as abmenuControll from "../controllers/abmenu.controllers";
const router = Router();

router.post('/', abmenuControll.getAbm);

export default router;