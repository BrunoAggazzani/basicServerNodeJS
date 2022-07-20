import { Router } from "express";
import * as menuPriceControll from "../controllers/menu.price.controllers";
const router = Router();

router.get('/search', menuPriceControll.getSearchPriceList);
router.post('/table', menuPriceControll.getTablePriceList);
router.post('/tableChanged', menuPriceControll.getTableChanged);

export default router;