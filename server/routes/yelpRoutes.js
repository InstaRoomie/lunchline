var yelpController = require('../controllers/yelpController.js');
var jsonParser = require('body-parser').json();

module.exports = function (app) {
  // app === yelpRouter injected from request-helper.js

  app.post('/search', jsonParser, yelpController.search);
};
