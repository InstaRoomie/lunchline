var helpers = require('../util/helpers.js');
var app = require('../server.js');

module.exports = function(app, express) {
  var restRouter = express.Router();
  var profileRouter = express.Router();

  // Serve static files
  app.use(express.static(__dirname + '/../../lunchline/www/'));
  app.use('/node', express.static(__dirname + './../../node_modules/'));
  app.use('/bower', express.static(__dirname + './../../bower_components/'));

  // Route handling
  app.use('/api/rest/', restRouter);
  app.use('/api/user/', profileRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('./restRoutes.js')(restRouter);
  require('./profileRoutes.js')(profileRouter);
};
