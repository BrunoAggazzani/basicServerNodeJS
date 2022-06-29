const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.inicio);
router.post('/queEsSaft', controller.queEsSaft);

module.exports = router;