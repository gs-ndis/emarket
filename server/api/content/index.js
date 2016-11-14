'use strict';

var express = require('express');
var controller = require('./content.controller');

var router = express.Router();

router.get('/', controller.index);
router.all('/refreshCache', controller.refreshCache);

module.exports = router;