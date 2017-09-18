const connection = require('./../config/database_users')
const moment = require('moment-timezone');

// POST /api/users
function addUser(req, res) {

  var newUser = {
    "_id": req.body.login,
    "name": req.body.name,
    "login": req.body.login,
    "pass": req.body.pass
  };

  console.log(newUser);

  //connection.insert({"user": newUser}, function(err, body, header) {
  connection.insert(newUser, function(err, body, header) {
    if (err) {
      res.status(400).end();
      return console.log('[mydb.insert] ', err.message);
    }

    var datatime = new Date();
    var data = moment.tz(datatime, "America/Sao_Paulo").format();

    console.log(body);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify({name: newUser.name, login: newUser.login}));
  });

}

// POST /api/users/login
function login(req, res) {

  var user = {
    "login": req.body.login,
    "pass": req.body.pass
  };

  connection.get("qqq", function(err, data) {
    console.log("Error:", err);
    console.log("Data:", data);
    // keep a copy of the doc so we know its revision token
    //doc = data;
    //callback(err, data);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(data));
  });

  /*

  {
    "selector": {
      "user.name": "antonio"
    },
    "fields": [
      "user.name",
      "user.login"
    ],
    "sort": [
      {
        "user.name": "asc"
      }
    ]
  }

  */

}

module.exports = { addUser, login }
