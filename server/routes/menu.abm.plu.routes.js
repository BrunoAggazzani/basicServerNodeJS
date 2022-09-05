import { Router } from "express";
import * as menuAbmPluControll from "../controllers/menu.abm.plu.controllers";
const router = Router();

router.get('/', menuAbmPluControll.getAbmPlu);
router.post('/', menuAbmPluControll.showTable);
router.post('/formEditGral', menuAbmPluControll.showFormEditGral);
router.get('/formEditGral/productImages', menuAbmPluControll.showProductImages);
router.post('/formEditGral/updateProductImages', menuAbmPluControll.updateProductImages);
router.get('/formEditGral/showTablePricelist', menuAbmPluControll.showTablePricelist);
router.post('/formEditGral/updatePricelist', menuAbmPluControll.updatePricelist);
router.get('/formEditGral/showTableDiscount', menuAbmPluControll.showTableDiscount);
router.post('/formEditGral/updateDiscount', menuAbmPluControll.updateDiscount);
router.post('/formEditGral/createDiscount', menuAbmPluControll.createDiscountSchemaLine);
router.post('/formEditGral/deleteDiscount', menuAbmPluControll.deleteDiscount);

export default router;