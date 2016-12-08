'use strict';

var config = require('../../config/environment');
var errorSender = require('../../util/errorSender');
var contentfulClient = require('../../util/contentful.client');
var contentfulManagementClient = require('../../util/contentful.management.client');
var helper = require('../../util/helper');
var elasticClient = require('../../util/elastic.client');

var Content = require('./content.model');
var fs = require('fs');

exports.index = function(req, res) {
  var query = {};
  if (req.query['sys.contentType.sys.id']) {
    query['sys.contentType.sys.id'] = req.query['sys.contentType.sys.id'];
  }
  if (!req.user || req.user.role !== 'admin') {
    query.$or = [
      {'fields.adminOnly': {$exists: false}},
      {'fields.adminOnly': {$in: [null, false]}}
    ];
  }

  Content.find(query)
    .sort(req.query.sortBy)
    .limit(Number(req.query.limit) || 0)
    .then(function(results) {
      if (req.query.includeRelated) {
        return Promise.map(results, function(content) {
          content = content.toObject();
          var ids = _.chain(_.get(content, 'fields.' + req.query.includeRelated, [])).map('sys.id').compact().uniq().value();
          if (!ids.length) {
            content[req.query.includeRelated] = [];
            return content;
          }
          var displayFields = {};
          if (req.query.fields) {
            _.each(_.flatten([req.query.fields]), function(field) {
              displayFields['fields.' + field] = 1;
            });
            displayFields['sys.id'] = 1;
          }

          return Content.find({'sys.id': {$in: ids}}, displayFields).then(function(relatedItems) {
            content[req.query.includeRelated] = relatedItems;
            return content;
          });
        });
      }
      return results;
    }).then(function(results) {
    res.json(results);
  }).bind(res).catch(errorSender.handlePromiseError);
};

var actions = {
  publish: 'ContentManagement.Entry.publish',
  unpublish: 'ContentManagement.Entry.unpublish'
};

var saveOrUpdate = Promise.method(function(data) {
  return Content.findOne({'sys.id': data.sys.id}).then(function(oldContent) {
    if (oldContent) {
      _.extend(oldContent, data);
      return oldContent.save();
    }
    var content = new Content(data);
    return content.save();
  });
});

var remove = Promise.method(function(data) {
  return Content.findOne({'sys.id': data.sys.id}).then(function(content) {
    if (!content) {
      throw new Error('Content with id "' + data.sys.id + '" not found.');
    }
    return content.remove();
  });
});

var doAction = Promise.method(function(action, data) {
  if (action === actions.publish) {
    return saveOrUpdate(data);
  }
  if (action === actions.unpublish) {
    return remove(data);
  }
  throw new Error('Unprocessable Entity');
});

exports.refreshCache = function(req, res) {
  var action = req.headers['x-contentful-topic'];
  doAction(action, req.body).then(function() {
    res.send(200);
  }).bind(res).catch(errorSender.handlePromiseErrorUnprocessable);
};

exports.show = function(req, res) {
  if (!req.params.id) {
    throw errorSender.statusError(422);
  }

  Content.findOne({'sys.id': req.params.id}).then(function(content) {
    if (!content) {
      throw errorSender.statusError(404);
    }

    if (req.query.includeRelated) {
      content = content.toObject();
      var ids = _.chain(_.get(content, 'fields.' + req.query.includeRelated, [])).map('sys.id').compact().uniq().value();
      if (!ids.length) {
        content[req.query.includeRelated] = [];
        return content;
      }
      var displayFields = {};
      if (req.query.fields) {
        _.each(req.query.fields, function(field) {
          displayFields['fields.' + field] = 1;
        });
      }

      return Content.find({'sys.id': {$in: ids}}, displayFields).then(function(relatedItems) {
        content[req.query.includeRelated] = relatedItems;
        return content;
      });
    }

    return res.json(content);
  }).bind(res).catch(errorSender.handlePromiseError);
};

var getData = Promise.method(function(space, index) {
  console.log('Request items...', {skip: index * 100, limit: 100});
  return space.getEntries({skip: index * 100, limit: 100});
});

var getItemsAsync = Promise.coroutine(function *(space, index, results) {
  if (!index) {
    index = 0;
  }
  if (!results) {
    results = [];
  }
  var result = yield getData(space, index).tap((i) => {
    console.log('Recieved', i.items.length, 'items...');
  });
  if (result && result.items && result.items.length) {
    results.push(result.items);
    return getItemsAsync(space, index + 1, results);
  } else {
    return _.flatten(results);
  }
});

exports.initData = function(req, res) {
  elasticClient.deleteByQuery({index: 'emarket', body: {}}).finally(function() {
    return Content.remove({});
  }).then(function() {
    return contentfulManagementClient.getSpace(config.contentful.space).then(function(space) {
//      return space.getEntries();
      return getItemsAsync(space);
    });
//    return contentfulClient.getEntries({resolveLinks: false});
  }).then(function(data) {
    return Promise.each(data, function(entry) {
      return new Content(helper.removeContentfulLocale(entry)).save();
    });
  }).then(function() {
    if (res) {
      res.send(200);
    }
  }).bind(res).catch(errorSender.handlePromiseError);
};


