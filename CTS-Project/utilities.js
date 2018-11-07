var utilities = {};
var mysql = require("mysql");
var db = require('./db_connection');
var request = require('request');

utilities.sendResponse = function(error, response, status, res) {
  res.send(JSON.stringify({
    "status": status,
    "error": error,
    "response": response
  }));
};

module.exports = utilities;