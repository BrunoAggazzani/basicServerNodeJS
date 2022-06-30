"use strict";

var express = require('express');

var router = express.Router();

var controller = require('./controller');

router.get('/', controller.inicio);
router.post('/queEsSaft', controller.queEsSaft);
module.exports = router;