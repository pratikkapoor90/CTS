var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
const bcrypt = require('bcrypt');
var path = require('path');
var db = require('../db_connection');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

router.get('/listPersonalIds/', function(req, res, next) {
  console.log('/listPersonalIds/');
  if (req.session.userName) {
    db.query('select * from user_proofs where user_id = (select user_id from user_info where user_name = ?);', [req.session.userName], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length > 0) {
          console.log("success");
          utilities.sendResponse(null, results, 200, res);
        } else {
          utilities.sendResponse(null, "no proofs found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }

});


router.get('/listUploadedIds/:imageName?', function(req, res, next) {
  var session = req.session;
  if (req.session.userName) {
    var file = "/user_uploads/" + req.params.imageName;
    // utilities.sendResponse(null, data, 200, res);
    // res.sendFile("./user_uploads/" + req.params.imageName);
    res.sendFile(req.params.imageName, {
      root: path.join(__dirname, '../user_uploads')
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

router.post('/addAPersonalId/', function(req, res, next) {
  console.log("/addAPersonalId");
  if (req.body && req.session.userName) {
    console.log(req.body);
    if (!req.files) {
      utilities.sendResponse(null, "nothing uploaded", 500, res);
    } else {
      console.log(req.files);
      console.log(req.files.proof.name);
      var new_file_name = req.files.proof.md5 + req.files.proof.name;
      console.log(new_file_name);
      req.files.proof.mv("user_uploads/" + new_file_name, function(err) {
        if (err) {
          console.log(err);
          utilities.sendResponse(err, "File not uploaded", 500, res);
        } else {
          var params = [req.session.userName, req.body.proofName, new_file_name];
          db.query('insert into user_proofs (user_id, user_proof_name, user_proof_image) values ((select user_id from user_info where user_name = ?), ?, ?)', params, function(error, results, fields) {
            if (error) {
              console.log(error);
              utilities.sendResponse(error, null, 500, res);
            } else {
              utilities.sendResponse(null, "success", 200, res);
            }
          });
        }
      });
    }
  } else {
    utilities.sendResponse(error, null, 500, res);
  }
});


module.exports = router;