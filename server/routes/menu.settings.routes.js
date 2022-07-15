import { Router } from "express";
import * as menuSettingsControll from "../controllers/menu.settings.controllers";
const router = Router();

router.get('/', menuSettingsControll.getSettings);

export default router;