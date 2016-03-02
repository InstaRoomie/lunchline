var myApp = angular.module('lunchline', ['firebase', 'ui.router', 'mobile-angular-ui', 'ngMap', 'angular-loading-bar'])
//UI router setup
.config(function ($stateProvider, $urlRouterProvider) {


  $stateProvider
  .state('restView', {
    url: '/restaurant',
    templateUrl: './app/restView/rest.html',
    controller: 'restCtrl',
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$requireAuth();
      }]
    }
  })
  .state('listView', {
    url: '/list',
    templateUrl: './app/listView/list.html',
    controller: 'listCtrl',
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$requireAuth();
      }]
    }
  })
  .state('login', {
   url: '/login',
   templateUrl: './app/authView/login.html',
   controller: 'AuthController'
  })
  .state('signup', {
    templateUrl: './app/authView/signup.html',
    url: '/signup',
    controller: 'AuthController'
  })

  $urlRouterProvider.otherwise('/');

})
// Remove spinner in top left corner from angular loading bar
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);
