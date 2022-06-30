import { Router } from 'express';

const router = Router();

import controller from './controller';

router.get('/', controller.inicio);
router.post('/queEsSaft', controller.queEsSaft);

export default router;