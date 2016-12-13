'use strict';

var express = require('express');
var controller = require('./support.item.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/:slug', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
