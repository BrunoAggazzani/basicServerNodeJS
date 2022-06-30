import { Router } from "express";
import * as prodControll from "../controllers/product.controllers";
const router = Router();

router.get('/', prodControll.getProduct);

export default router;