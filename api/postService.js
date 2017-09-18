const connection = require('./../config/database_posts')
const moment = require('moment-timezone');

// POST /api/posts
function addPost(req, res) {

  var data = moment.tz(new Date(), "America/Sao_Paulo").format();

  var newPost = {
    "title": req.body.title,
    "description": req.body.description,
    "author": req.body.author,
    "date_create": data
  };

  connection.insert(newPost, function(err, body, header) {
    if (err) {
      res.status(400).end();
      return console.log('[posts.insert] ', err.message);
    }

    newPost._id = body.id;
    //console.log(newPost);

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

// GET /api/posts/:page
function findAllPosts(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end("OK");
}

module.exports = { addPost, findPostById, findAllPosts }
