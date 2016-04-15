angular.module('lunchline.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    abstract: true,
    controller: 'authController'
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
  .state('menu.favorites', {
    url: '/favorites',
    views: {
      'side-menu': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$requireAuth();
      }]
    }
  })
  .state('menu.profile', {
    url: '/profile',
    views: {
      'side-menu': {
        templateUrl: 'templates/profile.html',
        controller: 'profileController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$requireAuth();
      }]
    }
  })
  .state('menu.login', {
    url: '/login',
    views: {
      'side-menu': {
        templateUrl: 'templates/login.html',
        controller: 'authController'
      }
    }
  })
  .state('menu.signup', {
    url: '/signup',
    views: {
      'side-menu': {
        templateUrl: 'templates/signup.html',
        controller: 'authController'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu/list')

})
