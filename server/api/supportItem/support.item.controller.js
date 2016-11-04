'use strict';

var _ = require('lodash');
var SupportItem = require('./support.item.model');
var errorSender = require('../../util/errorSender');
var QueryBuilder = require('../../util/query.builder');

exports.index = function(req, res) {
  var queryBuilder = new QueryBuilder(req.query);

  queryBuilder.andString('description')
    .andString('registrationGroup')
    .andListBoolean('priceControlled')
    .andListBoolean('quoteNeeded')
    .andString('category')
    .andString('outcome')
    .andString('purpose');

  var request = SupportItem.find(queryBuilder.getQuery())
    .skip(queryBuilder.skip)
    .limit(queryBuilder.limit)
    .exec();
  return Promise.props({data: request, count: SupportItem.count(queryBuilder.getQuery())})
    .then(function(data) {
      return res.json(data);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.show = function(req, res) {
  if (!req.params.id) {
    throw errorSender.statusError(422);
  }
  SupportItem.findById(req.params.id)
    .then(function(supportItem) {
      if (!supportItem) {
        throw errorSender.statusError(404);
      }
      return res.json(supportItem);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.create = function(req, res) {
  var supportItem = new SupportItem(req.body);
  supportItem._user = req.user._id;
  supportItem.source = 'manual';
  supportItem.save().then(function(contact) {
    return res.json(201, contact);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  SupportItem.findById(req.params.id).then(function(supportItem) {
    if (!supportItem) {
      throw errorSender.statusError(404, 'NotFound');
    }
    var updated = _.merge(supportItem, req.body);
    return updated.save();
  }).then(function(supportItem) {
    return res.json(200, supportItem);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.destroy = function(req, res) {
  SupportItem.findById(req.params.id).then(function(contact) {
    if (!contact) {
      throw errorSender.statusError(404);
    }
    return contact.remove();
  }).then(function() {
    return res.send(204);
  }).bind(res).catch(errorSender.handlePromiseError);
};