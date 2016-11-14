var _ = require('lodash');
var config = require('../config/environment');


var data = {};

function init() {
  data = require(config.contentfulFilePath);
}

//init();




function getHelpBlocks() {
  var items = _.cloneDeep(data.items);
  var result = _.filter(items, (i) => {
    return i.sys.contentType.sys.id === 'helpBlock';
  });
  result = _.map(result, function(i) {
    _.unset(i, 'fields.links');
    return i;
  });
  return result;
}

function getHelpBlockDetails(id) {
  var result = _.find(data.items, (item) => {
    return item.sys.id === id;
  });

  return result;
}
//
//
//var blocks = getHelpBlocks();
//
//console.log(blocks);
//console.log(_.head(blocks));
//var helpBlockId = '25z5FomrbiM8oCA2WW28im';
//
//console.log('helpBlock', getHelpBlockDetails(helpBlockId));
//

exports.getHelpBlocks = getHelpBlocks;
exports.getHelpBlockDetails = getHelpBlockDetails;
exports.getData = function() {
  return require(config.contentfulFilePath) || {};
};