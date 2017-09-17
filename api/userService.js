const connection = require('./../config/database')

// POST /api/user
function addUser(req, res) {

  var newUser = {
    "name": req.body.name,
    "login": req.body.login,
    "pass": req.body.pass
  };

  console.log(newUser);
  console.log((new Date()).getTime());

  connection.insert({"user": newUser}, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    res.send("Hello " + newUser.name + "! I added you to the database."+(new Date()).getTime() );
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
