import { Router } from "express";
import * as menuControll from "../controllers/menu.controllers";
const router = Router();

router.get('/', menuControll.ReturnGetMenu);
router.post('/', menuControll.getMenu);
//router.get('/abm', menuControll.getAbm);

export default router;