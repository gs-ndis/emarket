'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupportItemSchema = new Schema({
  itemId: String,
  description: String,
  registrationGroup: {},
  priceController: Boolean,
  quoteNeeded: Boolean,
  category: {},
  outcome: {},
  purpose: {},
  disability: [],
  variants: [{type: Schema.Types.ObjectId, ref: 'Variant'}]
});

module.exports = mongoose.model('SupportItem', SupportItemSchema);
