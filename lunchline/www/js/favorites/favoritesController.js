angular.module('lunchline.favorites', [])

.controller('favoritesController', function($window, $scope, User, Favorites, Data) {
  var user = JSON.parse($window.localStorage['firebase:session::instalunchline'])

  $scope.data = [];

  $scope.transferEvent = function(obj) {
     Data.clickedItem = obj;
     sessionStorage['tempStorage'] = JSON.stringify(obj);
     // hides search button when a specific restaurant is clicked
     if ($scope.locationBarShow === true) {
       $scope.showLocationBar();
     }
  }

  $scope.getFavorites = function(){
    Data.getFavorites(user, function(item){
        console.log(item)
        $scope.data = item
      });
  }
  $scope.getFavorites();
})
