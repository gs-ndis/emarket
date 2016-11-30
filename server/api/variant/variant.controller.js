'use strict';

var _ = require('lodash');
var Variant = require('./variant.model');
var errorSender = require('../../util/errorSender');
var QueryBuilder = require('../../util/query.builder');

exports.index = function(req, res) {
  var queryBuilder = new QueryBuilder(req.query);

  queryBuilder.andString('variantId')
    .andString('description')
    .andListString('unit')
    .andNumber('supportItemId');

  var request = Variant.find(queryBuilder.getQuery())
    .skip(queryBuilder.skip)
    .limit(queryBuilder.limit)
    .sort('variantId')
    .exec();
  return Promise.props({data: request, count: Variant.count(queryBuilder.getQuery())})
    .then(function(data) {
      return res.json(data);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.show = function(req, res) {
  if (!req.params.id) {
    throw errorSender.statusError(422);
  }
  Variant.findById(req.params.id)
    .then(function(variant) {
      if (!variant) {
        throw errorSender.statusError(404);
      }
      return res.json(variant);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.create = function(req, res) {
  var supportItem = new Variant(req.body);
  supportItem._user = req.user._id;
  supportItem.source = 'manual';
  supportItem.save().then(function(variant) {
    return res.json(201, variant);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Variant.findById(req.params.id).then(function(variant) {
    if (!variant) {
      throw errorSender.statusError(404, 'NotFound');
    }
    _.extend(variant, req.body);
    return variant.save();
  }).then(function(supportItem) {
    return res.json(200, supportItem);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.destroy = function(req, res) {
  Variant.findById(req.params.id).then(function(variant) {
    if (!variant) {
      throw errorSender.statusError(404);
    }
    return variant.remove();
  }).then(function() {
    return res.send(204);
  }).bind(res).catch(errorSender.handlePromiseError);
};