var helpers = require('../util/helpers.js');
var Profile = require('../models/profileModel.js');
var Restaurant = require('../models/restModel.js');
var _ = require('underscore');
var https = require('https');


exports.addUser = function(req, res) {
  var profile = new Profile({
    uid: req.body.uid,
    favorites: req.body.favorites,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    image_url: req.body.image_url
  });

  profile.save(function(err) {
    if (err) {
      console.log("user profile not saved");
      throw err;
    }
    // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
    res.sendStatus(200);
  });
};

exports.getUser = function(req, res){
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if (err) {
      throw err;
    }
    res.json(profile);
  });
};

exports.addFavorites = function(req, res) {
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if(err) {
      throw err;
    }
    var fave = profile.favorites;
    var duplicate = false;
    for(var i = 0; i < fave.length; i++) {
      if(fave[i]["id"] === req.body.favorite.id) {
        duplicate = true;
      }
    }
    if(duplicate === false) {
      fave.push({id: req.body.favorite.id});
    }
    console.log(fave);
    Profile.findOneAndUpdate({uid: req.body.uid}, {favorites: fave}, {upsert: true}, function(err, profile) {
      if (err) {
        console.log("user favorites not saved");
        throw err;
      }
      res.sendStatus(200);
    });
  });
};

exports.removeFavorites = function(req, res) {
  console.log('removeFavorites')
  console.log(req.body)
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if(err) {
      throw err;
    }
    var fave = profile.favorites;
    console.log(fave)
    for(var i = 0; i < fave.length; i++) {
      if(fave[i]["id"] === req.body.favorite.id) {
        fave.splice(i,1);
      }
    }
    console.log(fave)
    Profile.findOneAndUpdate({uid: req.body.uid}, {favorites: fave}, {upsert: true}, function(err, profile) {
      if(err) {
        console.log("user favorites not removed");
        throw err;
      }
      res.sendStatus(200);
    });
  });
};

exports.getFavorites = function(req, res) {
  console.log(req.body.location);
  var lat = req.body.location.lat;
  var lng = req.body.location.lng;
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if(err) {
      throw err;
    }
    var results = [];
    // JSON.parse(profile.favorites);
    _.each(profile.favorites, function(item) {
      Restaurant.findOne(item, function(err, obj) {
        helpers.avgTime(obj, function(color){
          if (lat || lng) {
            obj.distance = helpers.distance(lat, lng, obj.geometry.location.lat, obj.geometry.location.lng);
          }
          obj.wait = color;
          results.push(obj);
          if(results.length === profile.favorites.length) {
            res.json(results);
          }
        });
      });
    });
  });
};
