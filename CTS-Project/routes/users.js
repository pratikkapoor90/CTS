var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
const bcrypt = require('bcrypt');
var db = require('../db_connection');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/userRegistration/', function(req, res, next) {
  if (req.body) {
    console.log(req.body);
    bcrypt.hash(req.body.userPassword, 10, function(err, hash) {
      // Store hash in database
      if (!err) {
        console.log(hash);
        var params = [req.body.userName, hash, req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber];
        db.query('INSERT INTO user_info (user_name, password_hash, user_first_name, user_last_name, user_email, user_phone) VALUES (?, ?, ?, ?, ?, ?);', params,
          function(error, results, fields) {
            if (error) {
              console.log(error);
              utilities.sendResponse(error, null, 500, res);
            } else {
              console.log("success");
              utilities.sendResponse(null, "success", 200, res);
            }
          });
      } else {
        utilities.sendResponse(null, "password hash error", 200, res);
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.post('/userAuthenticate/', function(req, res, next) {
  if (req.body) {
    console.log(req.body);
    db.query('select password_hash from user_info where user_name = ?', [req.body.userName], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length > 0) {
          console.log(results[0].password_hash);
          bcrypt.compare(req.body.userPassword, results[0].password_hash, function(err, resp) {
            if (resp) {
              // Passwords match
              console.log("success");
              console.log(req.session);
              var session = req.session;
              session.userName = req.body.userName;
              utilities.sendResponse(null, "success", 200, res);
            } else {
              // Passwords don't match
              console.log("failure");
              utilities.sendResponse(null, "wrong password", 200, res);
            }
          });
        } else {
          utilities.sendResponse(null, "no user found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.get('/logout/', function(req, res, next) {
  var session = req.session;
  if (session.userName) {
    session.destroy(function(err) {
      if (err) {
        utilities.sendResponse(error, null, 500, res);
      } else {
        console.log("successfully logged out");
        utilities.sendResponse(null, "success", 200, res);
      }
    });
  } else {
    utilities.sendResponse(null, "failure", 500, res);
  }
});


router.post('/changeUserPassword/', function(req, res, next) {
  if (req.body && req.session) {
    console.log(req.body);
    bcrypt.hash(req.body.userPassword, 10, function(err, hash) {
      // Store hash in database
      if (!err) {
        console.log(hash);
        var params = [hash, req.session.userName];
        db.query('UPDATE user_info set password_hash = ? where user_name = ?;', params,
          function(error, results, fields) {
            if (error) {
              console.log(error);
              utilities.sendResponse(error, null, 500, res);
            } else {
              console.log("success");
              utilities.sendResponse(null, "success", 200, res);
            }
          });
      } else {
        utilities.sendResponse(null, "password hash error", 200, res);
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


module.exports = router;