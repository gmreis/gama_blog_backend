const connection = require('./../config/database')

// POST /api/post
function addPost(req, res) {

  var newUser = {
    "name": req.body.name,
    "login": req.body.login,
    "pass": req.body.pass
  };

  console.log(newUser);

  connection.insert(newUser, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    res.send("Hello " + newUser.name + "! I added you to the database.");
  });

}

// GET /api/posts/:limit/:page
function listPost(req, res) {
  res.send("Hello! I added you to the database.");
}

module.exports = { addUser, listPost }
