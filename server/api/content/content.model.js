'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var elasticClient = require('../../util/elastic.client');

var ContentSchema = new Schema({
  sys: {},
//  space: {},
//  type: String,
//  contentType: {},
//  contentfulId: {type: String, uniq: true},
//  revision: Number,
//  createdAt: Date,
//  updatedAt: Date,
  fields: {}
});

ContentSchema.index({'sys.id': 1}, {unique: true});

ContentSchema.post('save', function(doc) {
  var data = doc.toObject();
  delete data._id;
  elasticClient.update({
    index: 'emarket',
    type: data.sys.contentType.sys.id,
    id: data.sys.id,
    body: {
      doc: data,
      doc_as_upsert: true
    }
  });
});

ContentSchema.post('remove', function(doc) {
  elasticClient.delete({
    index: 'emarket',
    type: doc.sys.contentType.sys.id,
    id: doc.sys.id
  });
});


module.exports = mongoose.model('Content', ContentSchema);
