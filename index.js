var app = require('./server/server.js');
var https = require('https');
var http = require('http');
var fs = require('fs');
var httpPort = 8080;
var httpsPort = 8081;

var ca = [];
var chain = fs.readFileSync('ssl-bundle.crt', 'utf8');
chain = chain.split('\n');
var cert = [];

for (var i = 0; i < chain.length; i++) {
  var line = chain[i];
  if (!(line.length !== 0)) {
    continue;
  }
  cert.push(line);
  if (line.match(/-END CERTIFICATE-/)) {
    ca.push(cert.join('\n'));
    cert = [];
  }
}

var options = {
  ca: ca,
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('instalunchline_com.crt'),
  requestCert:        true,
  rejectUnauthorized: false
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);
httpServer.listen(httpPort, console.log('http Express server listening on port ', httpPort));
httpsServer.listen(httpsPort, console.log('https Express server listening on port ', httpsPort));