// File that launches server from root directory
var app = require('./server/server.js');
var port = 8080;

app.listen(port);

console.log('Listening on port : ', port);
