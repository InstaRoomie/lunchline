myApp.factory('Auth', function($http, $state, $window, $firebaseAuth){
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
      fbLogin: fbLogin
    }

  })
