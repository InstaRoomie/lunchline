var profileController = require('../controllers/profileController.js');
var jsonParser = require('body-parser').json();
module.exports = function(app) {

  app.post('/profile', jsonParser, profileController.getUser);
  app.post('/user', jsonParser, profileController.addUser);
  app.put('/favorite', jsonParser, profileController.addFavorites);
  app.post('/getFave', jsonParser, profileController.getFavorites);
  app.put('/removeFave', jsonParser, profileController.removeFavorites);
};
