'use strict';

var config = require('../../config/environment');
var errorSender = require('../../util/errorSender');
var fs = require('fs');
var Baby = require('babyparse');
var path = require('path');
var SupportItem = require('../supportItem/support.item.model');
var Variant = require('../variant/variant.model');
var mongoose = require('mongoose');

var client = require('../../util/contentful.management.client');


var updateSupportItemType = Promise.method(function(supportCategories, registrationGroups) {
  console.log('update supportItem');
  return client.getSpace(config.contentful.space).then(function(space) {
    return space.getContentType('supportItem').then(function(supportItem) {
      var categoryField = _.find(supportItem.fields, {id: 'category'});
      categoryField.validations = [{in: supportCategories}];

      var registrationGroupField = _.find(supportItem.fields, {id: 'registrationGroup'});
      registrationGroupField.validations = [{in: registrationGroups}];
      return supportItem.update();
    });
  });
});

var createSupportItemEntry = Promise.method(function(supportItemData) {
  console.log('create supportItem...');
  return client.getSpace(config.contentful.space).then(function(space) {
    return space.createEntry('supportItem', supportItemData);
  });
});



exports.index = function(req, res) {
  var csvPath = path.normalize(config.root + '/docs/201617-VIC-NSW-QLD-TAS-Price-Guide-New structure.csv');
  var options = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  };
  var parsed = Baby.parseFiles(csvPath, options);
  var supportItemsGroups = _.groupBy(parsed.data, 'Support Item');

  var registrationGroups = _.chain(parsed.data).map('Registration Group').map(_.trim).uniq().compact().value();
  var supportCategories = _.chain(parsed.data).map('Support Categories').map(_.trim).uniq().compact().value();

  console.log(registrationGroups);
  console.log('---------------------');
  console.log(supportCategories);
  Promise.resolve().then(function() {
//    return updateSupportItemType(supportCategories, registrationGroups);
//  }).then(function() {
//    console.log('next...');
//    return Promise.each(_.keys(supportItemsGroups), function(key) {
//      if (!key.length) {
//        return;
//      }
//      var item = _.head(supportItemsGroups[key]);
//      var newSupportItem = {
//        fields: {
//          supportItemId: {'en-US': Number(item['Support Item ID'])},
//          title: {'en-US': _.trim(key)},
//          category: {'en-US': _.trim(item['Support Categories'])},
//          registrationGroup: {'en-US': _.trim(item['Registration Group'])},
//          description: {'en-US': _.trim(item['Support Item Description'])}
//        }
//      };
//      return createSupportItemEntry(newSupportItem);
//    });
    return Variant.remove({}).exec();
  }).then(function() {
    console.log('create variants...');
    return Promise.each(parsed.data, function(variantData) {
      if (_.isEmpty(_.trim(variantData['Support Item']))) {
        return;
      }
      var newVariant = new Variant({
        variantId: variantData['Variant ID'],
        description: variantData['Variant Description'],
        unit: variantData['Unit of Measure'],
        price: Number(String(variantData.Price).replace(/[^\d\.]*/ig, '')),
        supportItemId: Number(variantData['Support Item ID'])
      });
      return newVariant.save();
    });
  }).then(function() {
    console.log('done...');
    res.send(200);
  });





//  if (true) {
//    res.send(200);
//    return;
//  }
//
//  var newSupportItems = [];
//  var newVariants = [];
//  _.each(supportItemsGroups, function(supportItemGroup, key) {
//    if (!key.length) {
//      return;
//    }
//    var firstItem = _.head(supportItemGroup);
//    var newSupportItem = new SupportItem({
//      name: _.trim(key),
//      registrationGroup: _.trim(firstItem['Registration Group']),
//      description: _.trim(firstItem['Support Item Description']),
//      category: _.trim(firstItem['Support Categories'])
//    });
//
//    newSupportItems.push(newSupportItem);
//    _.each(supportItemGroup, function(variant) {
//      var newVariant = new Variant({
//        variantId: variant['Variant ID'],
//        description: variant['Variant Description'],
//        unit: variant['Unit of Measure'],
//        price: Number((variant.Price + '').replace(',', '')),
//        _supportItem: newSupportItem
//      });
//      newVariants.push(newVariant);
//      newSupportItem.variants.push(newVariant);
//    });
//
//    var priceControlled = _.keys(_.groupBy(supportItemGroup, 'Price Control'));
//    var quoteNeeded = _.keys(_.groupBy(supportItemGroup, 'Quote'));


//    if (priceControlled.length > 1) {
//      console.log('------------------', key);
//      console.log('Price Control', priceControlled);
//      console.log('Quote', quoteNeeded);
//      console.log(supportItemGroup);
//      console.log('------------------');
//    }
//  });



//  res.send(200);




//  Promise.each(_.concat(newVariants, newSupportItems), function(item) {
//    return item.save();
//  }).then(function() {
//    res.send(200);
//  }).catch(function(err) {
//    console.error(err);
//    res.json(500, err);
//  });
};
