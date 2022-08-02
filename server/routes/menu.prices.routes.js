import { Router } from "express";
import * as menuPriceControll from "../controllers/menu.price.controllers";
const router = Router();

router.get('/search', menuPriceControll.getFormSearch);
router.post('/table', menuPriceControll.getTablePriceList);
//router.post('/pagination', menuPriceControll.getTablePriceList);
//router.post('/updateProductPrice', menuPriceControll.getTablePriceList);
//router.post('/orderTable', menuPriceControll.getTablePriceList);

router.get('/searchMassiveModif', menuPriceControll.getFormModif);
router.post('/tableMassiveModif', menuPriceControll.getTableModif);


export default router;