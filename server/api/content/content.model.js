'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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


module.exports = mongoose.model('Content', ContentSchema);
