angular.module('shuffle.controllers', [])


    .controller('NavCtrl', function($scope, $state, $location, socket) {

        socket.on('connect', function(){
            console.log("connected")
        })

        $scope.buttonHidden = false;

        $scope.gotoSettings = function(){
            $scope.buttonHidden = true;
            $location.url('settings');
        }
    })

    .controller('SettingsCtrl', function($scope, $ionicNavBarDelegate, $location) {
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('tab/mood')
        }

         $scope.gotoAbout = function(){
            $scope.buttonHidden = true;
            $location.url('about');
        }

        $scope.gotoLists = function() {
            $location.url('lists');
        }
    })

    .controller('PlayerCtrl', function($scope, $ionicNavBarDelegate, $location) {
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('mood')
        }
    })

    .controller('MoodCtrl', function($scope) {})

    .controller('RoutinesCtrl', function($scope) {})

    .controller('IntroCtrl', function($scope, $state, $cordovaFacebook, $ionicPlatform) {

        $scope.facebookLogin = function(){

            $ionicPlatform.ready(function(){

                console.log("Cenas amarelas")

                $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                    .then(function(success) {
                        console.log(JSON.toString(success));
                        // { id: "634565435",
                        //   lastName: "bob"
                        //   ...
                        // }
                    }, function (error) {
                        // error
                    });
            })

        }

        $scope.enter = function(){
            $state.go('tab.mood')
        }
    })

    .controller('ChatsCtrl', function($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('WeatherCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('AboutCtrl', function($scope, $ionicNavBarDelegate, $location) {
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('settings')
        };
    })

    // NEW 
    .controller('PlaylistCtrl', function(){
        console.log("BULLSHIT");
    })

    .controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify) {
      var clientId = 'a8ca1abb7621448cb3a1216604f321c3';
      $scope.playlists = [];
     
        $scope.performLogin = function() {
          $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
            window.localStorage.setItem('spotify-token', result.access_token);
            Spotify.setAuthToken(result.access_token);
            $scope.updateInfo();
          }, function(error) {
              console.log("Error -> " + error);
          });
        };
     
        $scope.updateInfo = function() {
          Spotify.getCurrentUser().then(function (data) {
            $scope.getUserPlaylists(data.id);
          }, function(error) {
            $scope.performLogin();
          });
        };
     
        $ionicPlatform.ready(function() {
          var storedToken = window.localStorage.getItem('spotify-token');
          if (storedToken !== null) {
            Spotify.setAuthToken(storedToken);
            $scope.updateInfo();
          } else {
            $scope.performLogin();
          }
        });
     
        $scope.getUserPlaylists = function(userid) {
          Spotify.getUserPlaylists(userid).then(function (data) {
            $scope.playlists = data.items;
          });
        };
    // END OF NEW
    });