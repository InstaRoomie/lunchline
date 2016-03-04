angular.module('lunchline.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('menu.home', {
    url: '/home',
    views: {
      'side-menu': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('menu.list', {
    url: '/list',
    views: {
      'side-menu': {
        templateUrl: 'templates/list.html',
        controller: 'listController'
      }
    }
  })
  .state('menu.restaurant', {
    url: '/restaurant',
    views: {
      'side-menu': {
        templateUrl: 'templates/restaurant.html',
        controller: 'restaurantController'
      }
    }
  })
  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    abstract:true,
    controller: 'homeController',
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$requireAuth();
      }]
    }
  })
  .state('menu.favorites', {
    url: '/favorites',
    views: {
      'side-menu': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesController'
      }
    }
  })
  .state('menu.profile', {
    url: '/profile',
    views: {
      'side-menu': {
        templateUrl: 'templates/profile.html',
        controller: 'profileController'
      }
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'authController'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'authController'
  })

$urlRouterProvider.otherwise('/login')

})
