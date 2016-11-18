'use strict';

var contentful = require('contentful-management');
var config = require('../config/environment');
var _ = require('lodash');
var Promise = require('bluebird');

var client = contentful.createClient({
  accessToken: 'e5e9d13b410f65dd347aed496ad31bc3da695b7c19aa827c8dfe2450490dc595',
  locale: 'en-US'
});


var categories = ['Assistance with daily life (includes Supported Independent Living)',
  'Transport (auto payments)',
  'Consumables',
  'Assistance with social and community participation',
  'Assistive technology',
  'Home modifications',
  'Coordination of Supports',
  'Improved living arrangements',
  'Increased social and community participation',
  'Finding and keeping a job',
  'Improved relationships',
  'Improved health and wellbeing',
  'Improved learning',
  'Improved life choices',
  'Improved daily living skills'
];

function print(json) {
  console.log(JSON.stringify(json, null, 2));
}


//console.log('...');
//
//var id = 'iZG4tZCe1Gag6ogsweM6Q';
//
//client.getSpace(config.contentful.space).then(function(space) {
//  space.getEntry(id).then(function(data) {
//    print(data.toPlainObject());
//  });
//  var query = {};
//  query['content_type'] = 'supportItem';
//  space.getEntries(query).then(function(data) {
//    console.log(data);
////    print(data);
//  });
////  space.getEntry(id).then(function(data) {
////    print(data.toPlainObject());
////  });
//});

//client.getSpace(config.contentful.space).then(function(space) {
//  console.log('test');
//  return space.getContentType('supportItem').then(function(supportItem) {
//    var categoryField = _.find(supportItem.fields, {id: 'category'});
//    print(categoryField);
////    categoryField.name = 'Test';
//    categoryField.validations = [{in: categories}];
//    print(categoryField);
//    return supportItem.update().then(function() {
//      console.log('success');
//    }, function(err) {
//      console.log('Error:', err);
//    }).catch(function(err) {
//      console.log('Error:', err);
//    });
//
//
////    console.log(JSON.stringify(supportItem, null, 2));
//  });
//});


//client.getSpace(config.contentful.space).then(function(space) {
//  console.log('test');
//
//  var data = {
//    fields: {
//      title: {
//        "en-US": "Assistance with self care"
//      },
//      category: {
//        "en-US": "Assistance with daily life (includes Supported Independent Living)"
//      },
//      registrationGroup: {
//        "en-US": "Assist Personal Activities"
//      },
//      description: {
//        "en-US": "Assist participant to undertake and/or develop skills to maintain their home environment where the participant owns their own home & has sole or substantial responsibility for its maintenance. Includes assisting participant to do basic house & yard work.\n"
//      }
//    }
//  };
//  
//
//
//  return space.getEntries({'content_type': 'supportItem'}).then(function(entries) {
//    print(entries);
//    return space.createEntry('supportItem', data).then(e => console.log(e));
////    var categoryField = _.find(supportItem.fields, {id: 'category'});
////    print(categoryField);
//////    categoryField.name = 'Test';
////    categoryField.validations = [{in: categories}];
////    print(categoryField);
////    return supportItem.update().then(function() {
////      console.log('success');
////    }, function(err) {
////      console.log('Error:', err);
////    }).catch(function(err) {
////      console.log('Error:', err);
////    });
//
//
////    console.log(JSON.stringify(supportItem, null, 2));
//  });
//});



module.exports = client;
