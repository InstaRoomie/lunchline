myApp.controller('AuthController', function($scope, Auth, $firebaseAuth){
    var ref = new Firebase('https://instalunchline.firebaseio.com');
    var authRef = new Firebase("https://instalunchline.firebaseio.com/.info/authenticated");

    $scope.user = {};

    $scope.login = function(){
      ref.authWithPassword({
        email: $scope.email,
        password: $scope.password
      }, function(error, authData){
        if (error) {
          switch (error.code) {
            case "INVALID_EMAIL":
              console.log("The specified user account email is invalid.");
              break;
            case "INVALID_PASSWORD":
              console.log("The specified user account password is incorrect.");
              break;
            case "INVALID_USER":
              console.log("The specified user account does not exist.");
              break;
            default:
              console.log("Error logging user in:", error);
          }
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      })
    }

    $scope.signup = function(){
      ref.createUser({email: $scope.email, password: $scope.password}, function(error, user){
        if (error === null) {
          console.log("User created successfully:", user);
        } else {
          console.log("Error creating user:", error);
        }
      })
    }

    $scope.auth = function(){
      Auth.checkAuth();
    }

    $scope.fbLogin = function(){
      Auth.fbLogin()
    }

    $scope.logout = function(){
      ref.unauth();
    }
  });
