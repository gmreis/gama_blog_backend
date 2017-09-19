const connection = require('./../config/database_leads')
const moment = require('moment-timezone');
const fs = require('fs');

// POST /api/leads
function addLead(req, res) {

  const ip = (req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];

  const datatime = new Date();
  var data_format = moment.tz(datatime, "America/Sao_Paulo").format();
  data_format = data_format.substring(0, 19);
  data_format = data_format.replace('T', ' ');

  var newLead = {
    "_id": req.body.email,
    "name": req.body.name,
    "email": req.body.email,
    "ip": ip,
    "score": 'B2C',
    "date_create":data_format,
    "time": datatime.getTime()
  };

  connection.insert(newLead, function(err, body, header) {
    if (err) {
      res.status(400).end(JSON.stringify({ "err": err.message }));
      return console.log('[leads.list] ', err.message);
    }

    newLead._id = body.id;
    delete newLead.time;

    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(newLead));
  });

}

function listLeads(req, res) {

  const query = {
      "selector": {
        "name": {
          "$gte": 0
        }
      },
      "sort": [{ "name": "asc" }]
    };

  connection.find(query, function(err, data) {
    if (err) {
      res.status(400).end({ "err": err.message });
      return console.log('[leads.list] ', err.message);
    }

    var leads = [];
    for(var i=0; i<data.docs.length; i++) {

      var lead = {
        "_id": data.docs[i]._id,
        "name": data.docs[i].name,
        "email": data.docs[i].email,
        "ip": data.docs[i].ip,
        "score": data.docs[i].score,
        "date_create": data.docs[i].date_create,
      };

      leads.push(lead);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(leads));

  });

}

function listLeadsCSV(req, res) {

  const query = {
      "selector": {
        "name": {
          "$gte": 0
        }
      },
      "sort": [{ "name": "asc" }]
    };

    const arq = new Date().getTime() + ".csv";
    var writeStream = fs.createWriteStream(arq, {flags: 'w', autoClose: false});

    writeStream.on('finish', () => { // Quando fechar o arquivo
      res.download(arq, () => { //Envia o arquivo para download
        fs.unlink(arq);  //Após o download, é excluido o arquivo...
      });
    });

  connection.find(query, function(err, data) {
    if (err) {
      res.status(400).end();
      return console.log('[leads.list] ', err.message);
    }

    var leads = [];
    for(var i=0; i<data.docs.length; i++) {

      var line = data.docs[i].email+','+data.docs[i].name+','+data.docs[i].ip+','+data.docs[i].score+','+data.docs[i].date_create+'\r\n';
      writeStream.write(line);
    }

    writeStream.end();

  });

}

module.exports = { addLead, listLeads, listLeadsCSV }
