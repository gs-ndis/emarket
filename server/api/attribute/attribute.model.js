'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttributeSchema = new Schema({
  name: String,
  value: String
});

AttributeSchema.index({name: 1, value: 1}, {unique: true});

module.exports = mongoose.model('Attribute', AttributeSchema);
