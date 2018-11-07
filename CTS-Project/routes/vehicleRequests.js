var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');

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

router.post('/addAVehicle/', function(req, res, next) {
  if (req.body && req.session.userName) {
    console.log(req.body);
    var params = [req.session.userName, req.body.vin, req.body.vehicleClass];
    console.log(params);
    db.query('insert into vehicle_info (user_id, vehicle_VIN, vehicle_class_type) values ((select user_id from user_info where user_name = ?), ?, ?)', params, function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        utilities.sendResponse(null, "success", 200, res);
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


module.exports = router;