'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupportItemSchema = new Schema({
  description: String,
  registrationGroup: String,
  priceControlled: Boolean,
  quoteNeeded: Boolean,
  category: String,
  outcome: String,
  purpose: String,
  disability: [],
  variantConfigurations: [{type: Schema.Types.ObjectId, ref: 'VariantConfiguration'}],
  variants: [{type: Schema.Types.ObjectId, ref: 'Variant'}]
});

module.exports = mongoose.model('SupportItem', SupportItemSchema);
