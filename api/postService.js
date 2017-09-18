const connection = require('./../config/database_posts')
const moment = require('moment-timezone');

// POST /api/posts
function addPost(req, res) {

  const date = new Date();
  const date_create = moment.tz(date, "America/Sao_Paulo").format();

  var newPost = {
    "title": req.body.title,
    "description": req.body.description,
    "author": req.body.author,
    "date_create": date_create,
    "time": date.getTime()
  };

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
      "author": data.author,
      "date_create": data.date_create
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(post));
  });

}

// GET /api/posts
// GET /api/posts/:page
function findAllPosts(req, res) {

  const limit = 2;

  var page = parseInt(req.params.page) || 1;
  page = page<1?1:page;

  const query = {
      "selector": {
        "_id": {
          "$gte": 0
        }
      },
      "sort": [{ "time": "asc" }],
      "limit": limit,
      "skip": ((page-1)*limit)
    };

  connection.find(query, function(err, data) {
    if (err) {
      res.status(400).end();
      return console.log('[posts.find] ', err.message);
    }

    var posts = [];
    for(var i=0; i<data.docs.length; i++) {
      var post = {
        "_id": data.docs[i]._id,
        "title": data.docs[i].title,
        "description": data.docs[i].description,
        "author": data.docs[i].author,
        "date_create": data.docs[i].date_create
      };

      posts.push(post);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(posts));
  });

}

module.exports = { addPost, findPostById, findAllPosts }
