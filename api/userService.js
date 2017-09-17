const connection = require('./../config/database')

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
    var data = datatime.getDate();
    data += "/" + datatime.getMonth();
    data += "/" + datatime.getFullYear();
    data += " " + datatime.getHours();
    data += ":" + datatime.getMinutes();
    data += ":" + datatime.getSeconds();

    res.send("Hello " + newUser.name + "! I added you to the database. " + data );
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
