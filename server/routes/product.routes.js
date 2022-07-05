import { Router } from "express";
import * as prodControll from "../controllers/product.controllers";
const router = Router();

router.post('/', prodControll.getAbm);

export default router;