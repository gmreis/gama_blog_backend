var cfenv = require("cfenv");

// load local VCAP configuration  and service credentials
var connection;
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName = 'posts';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);

    var index_time = {name:'time-index', type:'json', index:{fields:['time']}}
    cloudant.db.use(dbName).index(index_time, function(er, response) {
      if (!er)
        console.log('Index %s creation result: %s', index_time.name, response.result);
    });
  });

  // Specify the database we are going to use (connection)...
  connection = cloudant.db.use(dbName);

}

module.exports = connection
