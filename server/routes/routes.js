var helpers = require('../util/helpers.js');
var app = require('../server.js');

module.exports = function(app, express) {
  var restRouter = express.Router();
  var yelpRouter = express.Router();

  // Serve static files
  app.use(express.static(__dirname + '/../../client'));//serving all static files to our client folder
  app.use('/node', express.static(__dirname + './../../node_modules/'));
  app.use('/bower', express.static(__dirname + './../../bower_components/'));

  // Route handling
  app.use('/api/rest/', restRouter);
  app.use('/api/yelp/', yelpRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('./restRoutes.js')(restRouter);
  require('./yelpRoutes.js')(yelpRouter);
};
