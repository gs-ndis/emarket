'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariantSchema = new Schema({
  variantId: String,
  unit: String,
  validFrom: Date,
  locations: [],
  attributes: [],
  _supportItem: {type: Schema.Types.ObjectId, ref: 'SupportItem'}
});

module.exports = mongoose.model('Variant', VariantSchema);
