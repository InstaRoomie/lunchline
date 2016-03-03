angular.module('lunchline.services', [])
.factory('Auth', function($http, $state, $window, $firebaseAuth){
  var ref = new Firebase('https://instalunchline.firebaseio.com');
  var auth = $firebaseAuth(ref);
  var authRef = new Firebase("https://instalunchline.firebaseio.com/.info/authenticated");

  var checkAuth = function(){
    authRef.on("value", function(snap) {
      if (snap.val() === true) {
        console.log("authenticated");
        return true;
      } else {
        console.log("not authenticated");
        return false;
      }
    });
  }

  var logout = function(){
    ref.unauth();
  }

  var fbLogin = function(){
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

  return {
    auth: auth,
    checkAuth: checkAuth,
    fbLogin: fbLogin,
    logout: logout
  }
})
.factory('Data', function($http) {
  var getData = function(userLoc, callback) {
    $http({
      method: 'POST',
      url: 'http://localhost:8080/api/yelp/search',
      data: userLoc
    }).then(function success(data) {
        var collection = data.data.map(function(restaurant) {
          return {
            restaurant: restaurant
          };
        });
        callback(collection);
      },
      function error(response) {
        console.log("ERROR: ", response);
      });
  };
  // Storage of clicked item on listView so that restView can pull up data
  var clickedItem = {};
  return {
    getData: getData,
    clickedItem: clickedItem
  }
// Distance factory: calculates the distance of a lat/long from the user's lat/long
})

.factory('distance', function() {
  var calc = function(userLoc, destinLoc) {
    //Expects objects with properties 'lat & long'
    var lat1 = userLoc.lat,
      long1 = userLoc.long,
      lat2 = destinLoc.lat,
      long2 = destinLoc.long;
    var deg2rad = function(deg) {
      return deg * (Math.PI / 180)
    }
    var R = 6371; // Radius of Earth in meters
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(long2 - long1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (R * c) * 0.621371;
    return Math.round(d * 10) / 10
  }

  return {
    calc: calc
  }
// Update factory : updates the database on a reported restaurant wait time with put request
})

.factory('Update', function($http) {

  function updateWait(objToSend) {
    $http({
      method: 'PUT',
      url: 'http://localhost:8080/api/rest/update',
      data: objToSend
    }).then(function successCallback(response) {
      // console.log('PUT: Sent ' + JSON.stringify(objToSend) + ' successfully');
      // console.log('Response from server is : ', response);
    }, function errorCallback(response) {
      console.log('ERROR on Put Request!');
    });
  }

  return {
    updateWait: updateWait
  };
})

.factory('Geolocation', function() {

  // get userLocation for restaurantView address
  var userLocation = {};

  var locationInfo = function(callback) {
    var geocoder;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
    //Get the latitude and the longitude;
    function successFunction(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        codeLatLng(lat, lng)
    }

    function errorFunction(){
        alert('Geocoder failed');
    }

    function initialize() {
      geocoder = new google.maps.Geocoder();
    }

    function codeLatLng(lat, lng) {

      userLocation.lat = lat;
      userLocation.long = lng;

      var latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        console.log(results)
          if (results[1]) {
           //formatted address
           /*alert(results[0].formatted_address)*/
          //find country name
          for (var i = 0; i < results[0].address_components.length; i++) {
           for (var b = 0; b < results[0].address_components[i].types.length; b++) {
            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == 'locality') {
                //this is the object you are looking for
                city = results[0].address_components[i];
                break;
              }
              if (results[0].address_components[i].types[b] == 'administrative_area_level_1') {
                state = results[0].address_components[i];
                break;
              }
            }
          }
          //city data
          console.log('this is the city ', city.short_name);
          console.log('this is the state ', state.short_name);
          /*alert(city.short_name + ' ' + city.long_name)*/

          userLocation.city = city;
          userLocation.state = state;

          /*$scope.city = city;
          $scope.state = state;
          $scope.short_name = $scope.city.short_name + ', ' + $scope.state.short_name;*/

          callback(userLocation);

          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      });
     }
     initialize();
   };

   return {
     locationInfo: locationInfo,
     userLocation: userLocation
   }

})
