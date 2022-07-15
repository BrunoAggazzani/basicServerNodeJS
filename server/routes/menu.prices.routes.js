import { Router } from "express";
import * as menuPriceControll from "../controllers/menu.price.controllers";
const router = Router();

router.get('/', menuPriceControll.getPrice);

export default router;