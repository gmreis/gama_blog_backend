const connection = require('./../config/database_users')
const moment = require('moment-timezone');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

// POST /api/users
function addUser(req, res) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  try {
    var decoded = jwt.verify(token, 'bqnepc123');
    if(!decoded || !decoded.hasOwnProperty('login')){
      throw 'Falha na autenticação do Token';
    }
  } catch(err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).end(JSON.stringify({ success: false, message: 'Falha na autenticação do Token' }));
    return console.log('[Users.Add]', err);
  }

  var newUser = {
    "_id": req.body.login,
    "name": req.body.name,
    "login": req.body.login,
    "pass": req.body.pass
  };

  //connection.insert({"user": newUser}, function(err, body, header) {
  connection.insert(newUser, function(err, body, header) {
    if (err) {
      res.status(400).end();
      return console.log('[mydb.insert] ', err.message);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify({name: newUser.name, login: newUser.login}));
  });

}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function validaAuthenticate(req, res) {
  var err = [];
  if(!req.body.hasOwnProperty('login') || isEmpty(req.body.login))
    err.push({login: "Campo Login não pode ser vazio."});

  if(!req.body.hasOwnProperty('pass') || isEmpty(req.body.pass))
    err.push({pass: "Campo Senha não pode ser vazio."});

  return err;
}

// POST /api/users/authenticate
function authenticate(req, res) {

  var err = validaAuthenticate(req, res);

  if(err.length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).end(JSON.stringify({ success: false, message: err }));
    return console.log('[Users.login]', err);
  }

  connection.get(req.body.login, function(err, user) {

    if (err) {
      res.status(400).end();
      return console.log('[User.authenticate] ', err.message);
    }

    console.log("Error:", err);
    console.log("Data:", user);

    if (!user || user.pass != req.body.pass) {

      res.setHeader('Content-Type', 'application/json');
      res.status(200).end(JSON.stringify({
        success: false,
        message: 'Authentication failed. Wrong password.'
      }));

    } else {

      // if user is found and password is right
      // create a token
      var token = jwt.sign({
        "name": user.name,
        "login": user.login
      }, 'bqnepc123', {
        expiresIn: 1440 // expires in 24 hours
      });

      // return the information including token as JSON
      res.setHeader('Content-Type', 'application/json');
      res.status(200).end(JSON.stringify({
        success: true,
        user: {name: user.name, login: user.login},
        message: 'Enjoy your token!',
        token: token
      }));

    }

  });

}

module.exports = { addUser, authenticate }
