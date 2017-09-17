const connection = require('./../config/database')

// POST /api/Lead
function addLead(req, res) {

  var newLead = {
    "name": req.body.name,
    "email": req.body.login,
    "ip": req.body.pass,
    "score": req.body.pass,
    "datetime": "now"
  };

  console.log(newUser);

  connection.insert(newUser, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    res.send("Hello " + newUser.name + "! I added you to the database.");
  });

}

module.exports = { addUser }
