var helpers = require('../util/helpers.js');
var Restaurant = require('../restaurant/restModel.js');
var Yelp = require('yelp');
var _ = require('underscore');

if (!process.env.YELP_CONSUMER_KEY) {
  var config = require('../config.js');
}

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY || config.yelp_consumer_key,
  consumer_secret: process.env.YELP_CONSUMER_SECRET || config.yelp_consumer_secret,
  token: process.env.YELP_TOKEN || config.yelp_token,
  token_secret: process.env.YELP_TOKEN_SECRET || config.yelp_token_secret,
});

exports.search = function (req, res, next) {
    console.log('this is the req.body in yelp controller! ', req.body);
    var foodType = 'food'

    if (req.body.foodType !== 'food') {
      foodType = req.body.foodType + ' ' + 'food';
    }

    if (req.body.userLocation && req.body.location) {
      var lat = req.body.userLocation.lat;
      var lng = req.body.userLocation.long;

      yelp.search({ term: foodType, location: req.body.location })
        .then(function(data) {
          console.log('+++line32+++ this is the data! ', data);
            exports.parseResults(data, lat, lng, function(results) {
                res.json(results);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
    } else if (req.body.userLocation && !req.body.location) {
      var lat = req.body.userLocation.lat;
      var lng = req.body.userLocation.long;
      var latLongString = lat + ',' + lng;
      console.log(' this is the foodType', foodType);

      yelp.search({ term: foodType, ll: latLongString })
        .then(function(data) {
          console.log('+++line45+++ this is the data! ', data);
            exports.parseResults(data, lat, lng, function(results) {
               res.json(results);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
    } else if (!req.body.userLocation && req.body.location) {
      yelp.search({ term: foodType, location: req.body.location })
        .then(function(data) {
          console.log('+++line54+++ this is the data! ', data);
            exports.parseResults(data, null, null, function(results) {
                res.json(results);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
    }


      // sample JSON from YELP !!!
      /*{ region:
   { span:
      { latitude_delta: 0.03161762999999951,
        longitude_delta: 0.04567019456558796 },
     center: { latitude: 34.01382135, longitude: -118.48086597934801 } },
  total: 1082,
  businesses: [ { is_claimed: true,
    rating: 4,
    mobile_url: 'http://m.yelp.com/biz/the-misfit-restaurant-bar-santa-monica?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=95eZS34IPxiGl7KNoJlj_A',
    rating_img_url: 'http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png',
    review_count: 2349,
    name: 'The Misfit Restaurant + Bar',
    snippet_image_url: 'http://s3-media3.fl.yelpcdn.com/photo/h4vtJRUOWE0XeOGLnVuC0A/ms.jpg',
    rating_img_url_small: 'http://s3-media4.fl.yelpcdn.com/assets/2/www/img/f62a5be2f902/ico/stars/v1/stars_small_4.png',
    url: 'http://www.yelp.com/biz/the-misfit-restaurant-bar-santa-monica?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=95eZS34IPxiGl7KNoJlj_A',
    categories: [Object],
    menu_date_updated: 1426629117,
    phone: '3106569800',
    snippet_text: 'This is a long overdue review as I\'ve been coming here for a while!\nDelicious food and fabulous service! It\'s hard to make up my mind when placing an...',
    image_url: 'http://s3-media4.fl.yelpcdn.com/bphoto/Dvb6PZA56JLYRA-SNl5Ivw/ms.jpg',
    location: [Object],
    display_phone: '+1-310-656-9800',
    rating_img_url_large: 'http://s3-media2.fl.yelpcdn.com/assets/2/www/img/ccf2b76faa2c/ico/stars/v1/stars_large_4.png',
    menu_provider: 'yelp',
    id: 'the-misfit-restaurant-bar-santa-monica',
    is_closed: false,
    distance: 478.5760194036798 }]
    }*/
    /* data.businesses[0].location
    { city: 'Santa Monica',
  display_address:
   [ '225 Santa Monica Blvd',
     'Santa Monica',
     'Santa Monica, CA 90401' ],
  geo_accuracy: 9.5,
  neighborhoods: [ 'Santa Monica' ],
  postal_code: '90401',
  country_code: 'US',
  address: [ '225 Santa Monica Blvd' ],
  coordinate: { latitude: 34.015401, longitude: -118.496658 },
  state_code: 'CA' }*/
  /*console.log(latLongString);

   yelp.search({ term: 'bar', ll: latLongString })
   .then(function (data) {
     // randomize which bar you get!
     var randomNumber = Math.floor(Math.random() * (20 - 0)) + 0;
     console.log(data.businesses[0].location);
     res.status(200).send(data.businesses[randomNumber]);
    })
    .catch(function (err) {
      console.error(err);
    });*/

  },

  exports.parseResults = function(data, lat, lng, callback) {
    console.log('this is the lat ', lat);
    console.log('this is the lng ', lng);
    results = [];
    _.each(data.businesses, function(item) {
      Restaurant.findOne({
        id: item.id
      }, function(err, obj) {
        console.log(obj);
        if (obj === null) {
          var restaurant = new Restaurant({
            wait: "3_grey",
            geometry: {
              location: {
                lat: item.location.coordinate.latitude,
                lng: item.location.coordinate.longitude
              }
            },
            id: item.id,
            name: item.name,
            place_id: item.is_closed,
            price_level: item.price_level,
            rating: item.rating,
            types: item.categories[0],
            vicinity: item.location.display_address[0] + ', ' + item.location.display_address[2],
            distance: 0
          });
          if (lat || lng) {
            restaurant.distance = helpers.distance(lat, lng, restaurant.geometry.location.lat, restaurant.geometry.location.lng);
          }
          restaurant.save(function(err) {
            if (err) {
              console.log("not saved");
              throw err;
            }
            // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
            results.push(restaurant);
            console.log('RESULTS LENGTH : ', results.length);
            if (results.length === 20) {
              callback(results);
            }
          });
        } else {
          console.log("objjjjjj", obj);
          helpers.avgTime(obj, function(color){
            if (lat || lng) {
              obj.distance = helpers.distance(lat, lng, obj.geometry.location.lat, obj.geometry.location.lng);
            }
            obj.wait = color;
            results.push(obj);
            // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
            console.log('RESULTS LENGTH : ', results.length);
            if (results.length === 20) {
              callback(results);
            }
          });
        }
      });
    });
  }
