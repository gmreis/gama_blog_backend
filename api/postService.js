const connection = require('./../config/database_posts')
const moment = require('moment-timezone');

// POST /api/posts
function addPost(req, res) {

  //validaPost(req, res);

  const date = new Date();
  const date_create = moment.tz(date, "America/Sao_Paulo").format();

  var newPost = {
    "title": req.body.title,
    "description": req.body.description,
    "keys": req.body.keys,
    "author": req.body.author,
    "image": req.body.image,
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
    console.log('POSTS:', posts);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({total_rows: body.total_rows, rows: posts}));
  });
/*
  const query = {
    "selector": {
      "time": {
        "$gte": 0
      }
    },
    "sort": [{ "time": "desc" }],
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
        "description": data.docs[i].description.substring(0, 100),
        "keys": data.docs[i].keys,
        "author": data.docs[i].author,
        "image": data.docs[i].image,
        "date_create": data.docs[i].date_create,
        "time": data.docs[i].time
      };

      posts.push(post);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(posts));

  });
*/
}



var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}


function addImage(req, res) {

  var formidable = require('formidable')
  , http = require('http');

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    var image = files.image
      , image_upload_path_old = image.path
      , image_upload_path_new = './upload/'
      , image_upload_name = image.name
      , image_upload_path_name = image_upload_path_new + image_upload_name;

    if (fs.existsSync(image_upload_path_new)) {


      // convert image to base64 encoded string
      var base64str = base64_encode(image_upload_path_old);
      console.log(base64str);
      // convert base64 string back to image
      base64_decode(base64str, image_upload_path_name);

      /*
      fs.rename(
        image_upload_path_old,
        image_upload_path_name,
        function (err) {
          if (err) {
            console.log('Err: ', err);
            res.end('Deu merda na hora de mover a imagem!');
          }
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
          console.log(msg);
          res.end(msg);
        });
        */
    } else {
      fs.mkdir(image_upload_path_new, function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de criar o diretório!');
        }
/*
        fs.rename(
          image_upload_path_old,
          image_upload_path_name,
          function(err) {
            var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
            console.log(msg);
            res.end(msg);
          });
          */
      });
    }
  });




  const id = "d0b265f12f3f7c14926c721354fdb499";

  //console.log(req);

  //res.status(201).end(JSON.stringify("OK"));

/*
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
*/
}


module.exports = { addPost, findPostById, findAllPosts, addImage }
