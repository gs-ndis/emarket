'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariantSchema = new Schema({
  variantId: {type: String, uniq: true},
  description: String,
  unit: String,
  validFrom: Date,
  price: Number,
  priceCap: [{location: [], price: Number, _id: false}],
  locations: [],
  attributes: {},
  supportItemId: Number
});

module.exports = mongoose.model('Variant', VariantSchema);
