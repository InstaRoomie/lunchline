angular.module('lunchline.list', [])

.controller('listController', function(Data, $scope, Geolocation, $ionicLoading, $ionicHistory, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
   $scope.data = [];
   
   $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
     viewData.enableBack = false;
   });
   
   $scope.$on('$ionicView.leave', function(event, viewData) {
     // disable search icon on leave if showing
     if ($scope.locationBarShow === true) {
       $scope.showLocationBar();
     }
   });
   

   // go back updates when you hit back
   $scope.$root.GoBack = function() {
     Data.getRecentUpdate(function(data) {
       $ionicHistory.goBack();
     });
   };
   
   $scope.short_name = 'address, city, zip';
   $scope.foodAndLocation = {};
   $scope.search = {foodType: null, location:null};

   if (sessionStorage['locationStorage'] === undefined) {
     $scope.userLocation = {};
   } else {
     $scope.userLocation = JSON.parse(sessionStorage['locationStorage']);
     $scope.short_name = $scope.userLocation.city.short_name + ', ' + $scope.userLocation.state.short_name;
   }

   // get recent updates when you press back
   $scope.getCollection = function() {
     Data.getCollection(function(fetchedData) {
       if (fetchedData.length > 0) {
         $scope.data = fetchedData;
        }
       if (Data.getSearchCalled() === true) {
         console.log('this is the truth from back search ', Data.getSearchCalled());
         $scope.searchCalled = true;
       }
     });
   };

   $scope.getCollection();

   $scope.foodTypeChange = function(v) {
     $scope.search.foodType = v;
   };

   $scope.foodTypeChange = function(v) {
     $scope.search.location = v;
   };

   // Function called when a wait time is reported.  Saves to session storage for refresh/back cases
   // and updates database.
   $scope.transferEvent = function(obj) {
      Data.clickedItem = obj;
      sessionStorage['tempStorage'] = JSON.stringify(obj);
      // hides search button when a specific restaurant is clicked
      if ($scope.locationBarShow === true) {
        $scope.showLocationBar();
      }
   }

   // Order variable used for the sorting order
   $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
   };

   $scope.$root.restLocationInfo = function() {
     $scope.show();
     if ($scope.userLocation && $scope.search.location === null) {
       $scope.foodAndLocation.foodType = $scope.search.foodType;
       $scope.foodAndLocation.userLocation = $scope.userLocation;
       console.log('using geo location ', $scope.foodAndLocation);
       Data.getData($scope.foodAndLocation, function(fetchedData) {
          // Save fetched data to scope object
          $scope.searchCalled = true;
          $scope.data = fetchedData;
          console.log(fetchedData);
          // Remove loading gif animation
          $scope.hide();
        });
    } else {
      $scope.foodAndLocation.foodType = $scope.search.foodType;
      $scope.foodAndLocation.userLocation = $scope.userLocation;
      $scope.foodAndLocation.location = $scope.search.location;
      console.log('not using geo location ', $scope.foodAndLocation);
      Data.getData($scope.foodAndLocation, function(fetchedData) {
         // Save fetched data to scope object
         $scope.searchCalled = true;
         $scope.data = fetchedData;
         console.log(fetchedData);

         // Remove loading gif animation
         $scope.hide();
       });

     }
   }

   // Sets default order to be ascending
   $scope.reverse = true;
   $scope.order('restaurant.distance');

   // controls the location search bar and button showing up
   $scope.locationBarShow = false;
   $scope.$root.locationBarShow = false;

   $scope.showLocationBar = function() {
     if ($scope.locationBarShow === false) {
       $scope.locationBarShow = true;
       $scope.$root.locationBarShow = true;
     } else {
       $scope.locationBarShow = false;
       $scope.$root.locationBarShow = false;
     }
   }

   // loading
   $scope.show = function() {
     $ionicLoading.show({
       // The text to display in the loading indicator
       content: '<div><i class="ion-loading-c"></i></div>',
       
       // The animation to use
       animation: 'fade-in',
     });
   };

   $scope.hide = function(){
     $ionicLoading.hide();
   };

   $scope.$root.getRecentUpdate = function() {
     console.log('getRecentUpdate is called');
     Data.getRecentUpdate();
   };

})
