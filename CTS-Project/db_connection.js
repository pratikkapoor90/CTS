var mysql = require('mysql');
var connection = mysql.createPool({
  host: 'cloud-a3.cnuacuuti7fl.us-east-2.rds.amazonaws.com',
  user: 'vamshi',
  password: '599-5Me-SSV-7SU',
  database: 'CTS_user'
});
module.exports = connection;