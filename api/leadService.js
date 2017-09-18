const connection = require('./../config/database_leads')
const moment = require('moment-timezone');
const fs = require('fs');

// POST /api/Lead
function addLead(req, res) {

  var datatime = new Date();
  //var data = moment.tz(datatime, "America/Sao_Paulo").format();

  var newLead = {
    "name": req.body.name,
    "email": req.body.email,
    "ip": req.body.ip,
    "score": req.body.score,
    "date_create": moment.tz(datatime, "America/Sao_Paulo").format()
  };

  console.log(newLead);

  connection.insert(newLead, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }

    newLead._id = body.id;

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
      res.status(400).end();
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

      var line = data.docs[i].name+';'+data.docs[i].ip+';'+data.docs[i].score+';'+data.docs[i].date_create+'\r\n';
      writeStream.write(line);
    }

    writeStream.end();

  });

}

module.exports = { addLead, listLeads, listLeadsCSV }
