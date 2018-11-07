var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');

router.post('/addMoneyToWallet', function(req, res, next) {
  if (req.body && req.session.userName) {
    console.log(req.body);
    db.query('select wallet_balance, wallet_id from user_wallet where user_id = (select user_id from user_info where user_name = ?);', req.session.userName, function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        console.log(results);
        var updatedBalance = parseFloat(results[0].wallet_balance) + parseFloat(req.body.amount);
        var params = [updatedBalance, results[0].wallet_id];
        db.query('update user_wallet set wallet_balance = ? where wallet_id = ?;', params, function(error, results, fields) {
          if (error) {
            console.log(error);
            utilities.sendResponse(error, null, 500, res);
          } else {
            utilities.sendResponse(null, "success", 200, res);
          }
        });
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.get('/getCurrentBalance', function(req, res, next) {
  console.log('/getCurrentBalance');
  if (req.session.userName) {
    db.query('select wallet_balance, wallet_id from user_wallet where user_id = (select user_id from user_info where user_name = ?);', req.session.userName, function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        utilities.sendResponse(null, results, 200, res);
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});

module.exports = router;