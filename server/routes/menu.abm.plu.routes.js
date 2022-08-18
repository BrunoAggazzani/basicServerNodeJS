import { Router } from "express";
import * as menuAbmPluControll from "../controllers/menu.abm.plu.controllers";
const router = Router();

router.get('/', menuAbmPluControll.getAbmPlu);
router.get('/:id', menuAbmPluControll.getAbmPlu);

export default router;