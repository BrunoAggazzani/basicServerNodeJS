import { Router } from "express";
import * as menuPriceControll from "../controllers/menu.price.controllers";
const router = Router();

router.get('/search', menuPriceControll.getFormSearch);
router.post('/table', menuPriceControll.getTablePriceList);
router.post('/pagination', menuPriceControll.getTablePriceList);
router.post('/updateProductPrice', menuPriceControll.getTablePriceList);


//router.post('/tableChanged', menuPriceControll.getTableChanged);

export default router;