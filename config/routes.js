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

  // POST /api/users/authenticate
  router.route('/users/authenticate').post(userService.authenticate)

  const postService = require('../api/postService')

  // POST /api/posts
  router.route('/posts').post(postService.addPost)

  // PUT /api/posts
  router.route('/posts').put(postService.editPost)

  // DELETE /api/posts
  router.route('/posts').delete(postService.deletePost)

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
