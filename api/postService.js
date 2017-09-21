const connection = require('./../config/database_posts')
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

function verifyUser(req, res) {

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
    return false;
  }

  return true;
}

// POST /api/posts
function addPost(req, res) {

  if(!verifyUser(req, res))
    return false;

  var err = validaPost(req, false);

  if(err.length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).end(JSON.stringify({err}));
    return console.log('[posts.insert.validacao] ', err);
  }

  const date = new Date();
  const date_create = moment.tz(date, "America/Sao_Paulo").format();

  var image = '';
  if(req.body.hasOwnProperty('image'))
    image = req.body.image;

  var newPost = {
    "title": req.body.title,
    "description": req.body.description,
    "keys": req.body.keys,
    "author": req.body.author,
    "image": image,
    "date_create": date_create,
    "time": date.getTime()
  };
  //console.log(newPost);

  connection.insert(newPost, function(err, body, header) {
    if (err) {
      res.status(400).end();
      return console.log('[posts.insert] ', err.message);
    }

    newPost._id = body.id;
    newPost._rev = body.rev,
    delete newPost.time;

    console.log('[posts.insert] ', newPost);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(newPost));
  });

}

// PUT /api/posts
function editPost(req, res) {

  if(!verifyUser(req, res))
    return false;

  var err = validaPost(req, true);

  if(err.length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).end(JSON.stringify({err}));
    return console.log('[posts.edit.validacao] ', err);
  }

  var post = {
    "_id": req.body._id,
    "_rev": req.body._rev,
    "title": req.body.title,
    "description": req.body.description,
    "keys": req.body.keys,
    "author": req.body.author,
    "image": req.body.image
  };

  connection.insert(post, function(err, body, header) {
    if (err) {
      res.status(400).end({ success: false, message: err.message });
      return console.log('[posts.insert] ', err.message);
    }

    console.log('posts.edit', body);
    post._rev = body.rev;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(post));
  });

}

// DELETE /api/posts
function deletePost(req, res) {

  if(!verifyUser(req, res))
    return false;

  try {
    if(!req.body.hasOwnProperty('_id') || isEmpty(req.body._id))
      throw 'Campo ID não pode ser vazio';

    if(!req.body.hasOwnProperty('_rev') || isEmpty(req.body._rev))
      throw 'Campo REV não pode ser vazio';
  } catch(err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).end(JSON.stringify({ success: false, message: err }));
    return false;
  }

  connection.destroy(req.body._id, req.body._rev, function(err, data) {
    if (err) {
      res.status(400).end({ success: false, message: err.message });
      return console.log('[posts.insert] ', err.message);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(data));
  });

}

function validaPost(req, oldPost) {
  var err = [];
  if(!req.body.hasOwnProperty('title') || isEmpty(req.body.title))
    err.push({title: "Campo Título não pode ser vazio."});

  if(!req.body.hasOwnProperty('description') || isEmpty(req.body.description))
    err.push({description: "Campo Descrição não pode ser vazio."});

  if(!req.body.hasOwnProperty('keys') || isEmpty(req.body.keys))
    err.push({keys: "Campo Chaves não pode ser vazio."});

  if(!req.body.hasOwnProperty('author') || isEmpty(req.body.author))
    err.push({author: "Campo Autor não pode ser vazio."});

  if(oldPost) {
    if(!req.body.hasOwnProperty('_id') || isEmpty(req.body._id))
      err.push({author: "Campo ID não pode ser vazio."});

    if(!req.body.hasOwnProperty('_rev') || isEmpty(req.body._rev))
      err.push({author: "Campo REV não pode ser vazio."});
  }

  return err;

}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

// GET /api/posts/find/:id
function findPostById(req, res) {
  const postId = req.params.id;

  connection.get(postId, function(err, data) {
    if (err) {
      res.status(400).end();
      return console.log('[posts.get] ', err.message);
    }

    console.log(data);

    var post = {
      "_id": data._id,
      "_rev": data._rev,
      "title": data.title,
      "description": data.description,
      "keys": data.keys,
      "author": data.author,
      "image": data.image,
      "date_create": data.date_create
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(post));
  });

}

// GET /api/posts
// GET /api/posts/:page
function findAllPosts(req, res) {

  const limit = 6;

  var page = parseInt(req.params.page) || 1;
  page = page<1?1:page;

  connection.view('viewPost', 'listAll',
                  {limit: limit, skip: ((page-1)*limit), reduce: false},
                  function(err, body) {
    if (err) {
      res.status(400).end();
      return console.log('[posts.find] ', err.message);
    }

    var posts = [];
    for(var i=0; i<body.rows.length; i++) {

      var post = {
        "_id": body.rows[i].key._id,
        "title": body.rows[i].key.title,
        "description": body.rows[i].key.description,
        "keys": body.rows[i].key.keys,
        "author": body.rows[i].key.author,
        "image": body.rows[i].key.image,
        "date_create": body.rows[i].key.date_create
      };

      if(typeof post.description === 'string') {
        post.description = post.description.substring(0, 100);
      }

      posts.push(post);
    }
    //console.log('POSTS:', posts);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({total_rows: body.total_rows, rows: posts}));
  });

}

module.exports = { addPost, editPost, deletePost, findPostById, findAllPosts }
