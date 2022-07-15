import { Router } from "express";
import * as menuReportsControll from "../controllers/menu.reports.controllers";
const router = Router();

router.get('/', menuReportsControll.getReports);

export default router;