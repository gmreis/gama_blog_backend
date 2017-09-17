

//console.log(moment.tz.names());


/*
var data = datatime.getDate();
data += "/" + datatime.getMonth();
data += "/" + datatime.getFullYear();
data += " " + datatime.getHours();
data += ":" + datatime.getMinutes();
data += ":" + datatime.getSeconds();
*/

//console.log(datatime.toLocaleTimeString());
//console.log(data);

/*
datatime.setTimezone('UTC');
data = datatime.getDate();
data += "/" + datatime.getMonth();
data += "/" + datatime.getFullYear();
data += " " + datatime.getHours();
data += ":" + datatime.getMinutes();
data += ":" + datatime.getSeconds();
*/
//var data = moment.tz(datatime, "America/Vancouver").format();
//console.log(datatime.toLocaleTimeString());
//console.log(data);



const server = require('./config/server')
require('./config/routes')(server)
