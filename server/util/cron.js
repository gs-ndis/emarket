'use strict';

var CronJob = require('cron').CronJob;
var Agenda = require('agenda');
var config = require('../config/environment');
var Promise = require('bluebird');

function initScheduler() {
  var agenda = new Agenda({db: {address: config.mongo.uri}});
  config.agenda = agenda;
  agenda.on('ready', function() {
    agenda.start();
  });
  exports.agenda = agenda;
}




function init() {
  initScheduler();
}


exports.init = init;