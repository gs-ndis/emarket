'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariantConfigurationSchema = new Schema({
  attributeName: String,
  attributeType: String,
  description: String,
  values: [],
  validation: String,
  isRequired: Boolean
});

module.exports = mongoose.model('VariantConfiguration', VariantConfigurationSchema);
