const express = require('express')
const url = require('url')

module.exports = function(server) {

  server.use(function(req, res, next) {
    //console.log("Olá Mundo...");
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow

    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  })

  // API Routes
  const router = express.Router()

  server.use('/api/', router)

  const userService = require('../api/userService')

  // POST /api/users
  router.route('/users').post(userService.addUser)

  // POST /api/users/login
  router.route('/users/login').post(userService.login)

  const postService = require('../api/postService')

  // POST /api/posts
  router.route('/posts').post(postService.addPost)

  // POST /api/posts/addImage
  router.route('/posts/addImage').post(postService.addImage)
  router.route('/posts/addImage').get(function (req, res){
    res.end(
      "<html>"
        +"<body>"
          +"<form action='/api/posts/addImage' method='post' enctype='multipart/form-data'>"
            +"<input name='image' type='file'/>"
            +"<input type='submit'>"
          +"</form>"
        +"</body>"
      +"</html>");
  })

  // GET /api/posts/find/:id
  router.route('/posts/find/:id').get(postService.findPostById)

  // GET /api/posts
  // GET /api/posts/:page
  router.route('/posts').get(postService.findAllPosts)
  router.route('/posts/:page').get(postService.findAllPosts)

  const leadService = require('../api/leadService')

  // POST /api/leads
  router.route('/leads').post(leadService.addLead)

  // GET /api/leads
  router.route('/leads').get(leadService.listLeads)

  // GET /api/leadsCSV
  router.route('/leadsCSV').get(leadService.listLeadsCSV)

}
