var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');


router.get('/vehicles/:id?', function(req, res, next) {
  if (req.body && req.session.userName) {
    console.log(req.body);
    db.query('select * from vehicle_info where user_id = (select user_id from user_info where user_name = ?);', [req.params.id], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length > 0) {
          console.log("success");
          utilities.sendResponse(results, "success", 200, res);
        } else {
          utilities.sendResponse(null, "no vehicles found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});



router.get('/getAllVehicles', function(req, res, next) {
  console.log("/getAllVehicles");
  if (req.session.userName) {
    db.query('select * from vehicle_info where user_id = (select user_id from user_info where user_name = ?);', [req.session.userName], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length > 0) {
          console.log("success");
          utilities.sendResponse(null, results, 200, res);
        } else {
          utilities.sendResponse(null, "no vehicles found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.get('/requests/:id?', function(req, res, next) {
  if (req.body && req.session.userName) {
    console.log(req.body);
    // db.query('select * from vehicle_info where user_id = (select user_id from user_info where user_name = ?);', [req.params.id], function(error, results, fields) {
    //   if (error) {
    //     console.log(error);
    //     utilities.sendResponse(error, null, 500, res);
    //   } else {
    //     if (results.length > 0) {
    //       console.log("success");
    //       utilities.sendResponse(results, "success", 200, res);
    //     } else {
    //       utilities.sendResponse(null, "no vehicles found", 200, res);
    //     }
    //   }
    // });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});

router.post('/vehicles/:id?', function(req, res, next) {
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
          var params = [req.session.userName, req.body.vin, new_file_name];
          db.query('insert into vehicle_info (user_id, vehicle_VIN, vehicle_proof_image) values ((select user_id from user_info where user_name = ?), ?, ?)', params, function(error, results, fields) {
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