import { Router } from "express";
import * as menuAbmPluControll from "../controllers/menu.abm.plu.controllers";
const router = Router();

router.get('/', menuAbmPluControll.getAbmPlu);
router.post('/', menuAbmPluControll.showTable);
router.post('/formEditGral', menuAbmPluControll.showFormEditGral);
router.get('/formEditGral/productImages', menuAbmPluControll.showProductImages);

export default router;