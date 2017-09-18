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

  const limit = 10;

  var page = parseInt(req.params.page) || 1;
  page = page<1?1:page;

  const query = {
      "selector": {
        "time": {
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
        "description": data.docs[i].description.substring(0, 100),
        "author": data.docs[i].author,
        "date_create": data.docs[i].date_create,
        "time": data.docs[i].time
      };

      posts.push(post);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(posts));
  });

}

module.exports = { addPost, findPostById, findAllPosts, addImage }
