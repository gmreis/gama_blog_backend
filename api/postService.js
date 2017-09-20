const connection = require('./../config/database_posts')
const moment = require('moment-timezone');

// POST /api/posts
function addPost(req, res) {
/*
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
    return console.log('[Post.Add]', err);
  }
*/
  var err = validaPost(req, res);

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
    delete newPost.time;

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(newPost));
  });

}

function validaPost(req, res) {
  var err = [];
  if(!req.body.hasOwnProperty('title') || isEmpty(req.body.title))
    err.push({title: "Campo Título não pode ser vazio."});

  if(!req.body.hasOwnProperty('description') || isEmpty(req.body.description))
    err.push({description: "Campo Descrição não pode ser vazio."});

  if(!req.body.hasOwnProperty('keys') || isEmpty(req.body.keys))
    err.push({keys: "Campo Chaves não pode ser vazio."});

  if(!req.body.hasOwnProperty('author') || isEmpty(req.body.author))
    err.push({author: "Campo Autor não pode ser vazio."});

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

    var post = {
      "_id": data._id,
      "title": data.title,
      "description": data.description,
      "keys": data.keys,
      "author": data.author,
      "image": data.image,
      "date_create": data.date_create
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(post));
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

module.exports = { addPost, findPostById, findAllPosts }
