import { Router } from "express";
import * as menuAbmPluControll from "../controllers/menu.abm.plu.controllers";
const router = Router();

router.get('/', menuAbmPluControll.getAbmPlu);
router.post('/', menuAbmPluControll.getAbmPlu_formEdit);

export default router;