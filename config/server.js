var port = process.env.PORT || 3000

const bodyParser = require('body-parser');
const express = require('express');
const server = express();

// create application/x-www-form-urlencoded parser
server.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
server.use(bodyParser.json());


server.set('port', port);
server.listen(server.get('port'), function() {
  console.log(`Server is running on port ${port}`);
})

module.exports = server
