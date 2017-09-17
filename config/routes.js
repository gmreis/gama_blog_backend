const express = require('express')
const url = require('url')

module.exports = function(server) {

  server.use(function(req, res, next) {
    console.log("Olá Mundo...");
    next();
  })

  // API Routes
  const router = express.Router()

  server.use('/api/', router)

  const userService = require('../api/userService')

  // POST /api/user
  router.route('/user').post(userService.addUser)

/*
  // GET /urls/:urlId
  router.route('/urls/:urlId').get(urlService.redirectUrl)
  // GET /stats
  router.route('/stats').get(urlService.stats)
  // GET /stats/:urlId
  router.route('/stats/:urlId').get(urlService.statsOneUrl)
  // DELETE /urls/:urlId
  router.route('/urls/:urlId').delete(urlService.remove)

  const userService = require('../api/user/userService')
  // POST /users/:userId/urls
  router.route('/users/:userId/urls').post(userService.addUrl)
  //GET /users/:userId/stats
  router.route('/users/:userId/stats').get(userService.stats)
  //POST /users
  router.route('/users').post(userService.add)
  // DELETE /user/:userId
  router.route('/user/:userId').delete(userService.remove)
*/
}
