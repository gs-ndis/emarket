'use strict';

var express = require('express');
var controller = require('./content.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.attachUser(), controller.index);
router.all('/refreshCache', controller.refreshCache);
router.all('/initData', controller.initData);
router.get('/:id', controller.show);

module.exports = router;