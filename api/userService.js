const connection = require('./../config/database')
var moment = require('moment-timezone');

// POST /api/user
function addUser(req, res) {

  var newUser = {
    "name": req.body.name,
    "login": req.body.login,
    "pass": req.body.pass
  };

  console.log(newUser);

/*
  mongodb.collection("users").insertOne( newUser, function(error, result) {
      if (error) {
        response.status(500).send(error);
      } else {
        response.send(result);
      }
    });
  */
  connection.insert({"user": newUser}, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }

    var datatime = new Date();
    var data = moment.tz(datatime, "America/Sao_Paulo").format();

    res.send("Hello " + newUser.name + "! I added you to the database. Hora servidor: " + datatime.toLocaleTimeString() + " - Hora Sao Paulo:" + data );
  });

}


function login(req, res) {

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

  res.send("Hello! I added you to the database.");
}

module.exports = { addUser, login }
