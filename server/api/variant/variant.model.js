'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariantSchema = new Schema({
  variantId: String,
  description: String,
  unit: String,
  validFrom: Date,
  price: Number,
  locations: [],
  attributes: {},
  supportItemId: Number
});

module.exports = mongoose.model('Variant', VariantSchema);
