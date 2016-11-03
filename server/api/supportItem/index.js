'use strict';

var express = require('express');
var controller = require('./support.item.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);

module.exports = router;
