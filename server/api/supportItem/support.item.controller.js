'use strict';

var _ = require('lodash');
var SupportItem = require('./support.item.model');
var errorSender = require('../../util/errorSender');
var QueryBuilder = require('../../util/query.builder');
var helper = require('../../util/helper');
var Content = require('../content/content.model');
var Variant = require('../variant/variant.model');
var elasticClient = require('../../util/elastic.client');

exports.index = function(req, res) {
  var queryBuilder = new QueryBuilder(req.query);

  queryBuilder.andString('description')
    .andString('registrationGroup')
    .andListBoolean('priceControlled')
    .andListBoolean('quoteNeeded')
    .andString('category')
    .andString('outcome')
    .andString('purpose');

  var data = SupportItem.find(queryBuilder.getQuery())
    .skip(queryBuilder.skip)
    .limit(queryBuilder.limit)
    .exec();
  return Promise.props({data: data, count: SupportItem.count(queryBuilder.getQuery())})
    .then(function(data) {
      return res.json(data);
    }).bind(res).catch(errorSender.handlePromiseError);
};

exports.search = function(req, res) {
  var query = req.query.query;
  var searchQuery = {bool: {}};
  if (query) {
    searchQuery.bool.minimum_number_should_match = 1;
    searchQuery.bool.boost = 1;
    searchQuery.bool.should = [];


    searchQuery.bool.should.push({
      match: {
        'fields.title': {
          query: query,
          fuzziness: 0,
          boost: 20,
          operator: 'and'
        }
      }
    });

    searchQuery.bool.should.push({
      match: {
        'fields.tags': {
          fuzziness: 0,
          boost: 10,
          query: query,
          operator: 'or'
        }
      }
    });

    searchQuery.bool.should.push({
      match: {
        'fields.description': {
          fuzziness: 0,
          boost: 10,
          query: query,
          operator: 'and'
        }
      }
    });

    searchQuery.bool.should.push({
      match: {
        'fields.title': {
          fuzziness: 1,
          boost: 0.5,
          query: query,
          operator: 'or'
        }
      }
    });

    searchQuery.bool.should.push({
      match: {
        'fields.description': {
          fuzziness: 1,
          boost: 0.5,
          query: query,
          operator: 'or'
        }
      }
    });
  }

  var filters = [];
  var postFilters = [];

  if (req.query.priceCap) {
    filters.push({term: {'fields.priceControlled': true}});
  }
  if (req.query.quote) {
    filters.push({term: {'fields.quoteNeeded': true}});
  }

  if (req.query.registrationGroup) {
    postFilters.push({term: {'fields.registrationGroup.keyword': req.query.registrationGroup}});
  }
  if (req.query.category) {
    postFilters.push({term: {'fields.category.keyword': req.query.category}});
  }

  searchQuery.bool.must = filters;

  elasticClient.search({
    type: 'supportItem',
    explain: true,
    body: {
      query: searchQuery,
      highlight: {
        fields: {
          'fields.title': {number_of_fragments: 0},
          'fields.description': {number_of_fragments: 0}
        }
      },
      aggs: {
        categories: {
          terms: {
            field: 'fields.category.keyword'
          },
          aggs: {
            registrationGroups: {
              terms: {
                field: 'fields.registrationGroup.keyword'
              }
            }
          }
        }
      },
      post_filter: {
        bool: {
          filter: postFilters
        }
      },
      from: req.query.start || 0,
      size: req.query.number || 10
    }
  }).then(function(result) {
    res.json(result);
  }).bind(res).catch(errorSender.handlePromiseError);
};

exports.show = function(req, res) {
  if (!req.params.slug) {
    throw errorSender.statusError(422);
  }
  Content.findOne({'fields.slug': req.params.slug}).then(function(supportItem) {
    if (!supportItem) {
      throw errorSender.statusError(404);
    }
    supportItem = supportItem.toObject();
    var ids = _.chain(_.get(supportItem, 'fields.relatedItems', [])).map('sys.id').compact().uniq().value();
    if (!ids.length) {
      supportItem.relatedItems = [];
      return supportItem;
    }
    return Content.find({'sys.id': {$in: ids}}).then(function(relatedItems) {
      supportItem.relatedItems = relatedItems;
      return supportItem;
    });
  }).then(function(supportItem) {
    var ids = _.chain(_.get(supportItem, 'fields.variantConfigurationList', [])).map('sys.id').compact().uniq().value();
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