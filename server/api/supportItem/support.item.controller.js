'use strict';

var _ = require('lodash');
var SupportItem = require('./support.item.model');
var errorSender = require('../../util/errorSender');
var QueryBuilder = require('../../util/query.builder');
var helper = require('../../util/helper');
var Content = require('../content/content.model');
var Variant = require('../variant/variant.model');

exports.index = function(req, res) {
  console.log('test');
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

exports.search = function(req, res) {
  var searchStr = req.query.query || '';
  var query = {};
  query['sys.contentType.sys.id'] = 'supportItem';
  if (req.query.category) {
    query['fields.category.en-US'] = req.query.category;
  }
  var $or = [];
  $or.push({'fields.title.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.category.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.registrationGroup.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.description.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.tags.en-US': helper.wrapRegExp(searchStr)});
  query.$or = $or;
  var skip = Number(req.query.start) || 0;
  var limit = Number(req.query.number);
  if (limit < 0) {
    limit = undefined;
  }
  var request = Content.find(query)
    .skip(skip)
    .limit(limit)
    .exec();
  return Promise.props({data: request, count: Content.count(query)})
    .then(function(data) {
      return res.json(data);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.facets = function(req, res) {
  var searchStr = req.query.query || '';
  var $or = [];
  $or.push({'fields.title.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.category.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.registrationGroup.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.description.en-US': helper.wrapRegExp(searchStr)});
  $or.push({'fields.tags.en-US': helper.wrapRegExp(searchStr)});

  var categoies = Content.aggregate([
    {$match: {'sys.contentType.sys.id': 'supportItem'}},
    {$group: {_id: '$fields.category.en-US'}},
    {$project: {count: {$literal: 0}}}
  ]).exec();
  var counts = Content.aggregate([
    {$match: {'sys.contentType.sys.id': 'supportItem', $or: $or}},
    {$group: {_id: '$fields.category.en-US', count: {$sum: 1}}}
  ]).exec();
  Promise.props({categories: categoies, counts: counts}).then(function(data) {
    var indexedCounts = _.keyBy(data.counts, '_id');
    var result = _.map(data.categories, function(category) {
      category.count = _.get(indexedCounts, category._id + '.count', 0);
      return category;
    });
    return res.json(result);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.show = function(req, res) {
  if (!req.params.id) {
    throw errorSender.statusError(422);
  }
  Content.findOne({'sys.id': req.params.id}).then(function(supportItem) {
    if (!supportItem) {
      throw errorSender.statusError(404);
    }
    supportItem = supportItem.toObject();
    var ids = _.chain(_.get(supportItem, 'fields.relatedItems["en-US"]', [])).map('sys.id').compact().uniq().value();
    if (!ids.length) {
      supportItem.relatedItems = [];
      return supportItem;
    }
    return Content.find({'sys.id': {$in: ids}}).then(function(relatedItems) {
      supportItem.relatedItems = relatedItems;
      return supportItem;
    });
  }).then(function(supportItem) {
    var ids = _.chain(_.get(supportItem, 'fields.variantConfigurationList["en-US"]', [])).map('sys.id').compact().uniq().value();
    if (!ids.length) {
      supportItem.variantConfigurationList = [];
      return supportItem;
    }
    return Content.find({'sys.id': {$in: ids}}).then(function(variantConfigurationList) {
      supportItem.variantConfigurationList = variantConfigurationList;
      return supportItem;
    });
  }).then(function(supportItem) {
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