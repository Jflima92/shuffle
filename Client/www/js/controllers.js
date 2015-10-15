angular.module('shuffle.controllers', [])


    .controller('NavCtrl', function($scope, $state, $location, socket, $localstorage, $rootScope) {




        $scope.buttonHidden = false;

        $scope.gotoSettings = function(){
            $scope.buttonHidden = true;
            $location.url('settings');
        }
    })


    .controller('SettingsCtrl', function($scope, $localstorage, $ionicNavBarDelegate, $location,$rootScope, $cordovaFacebook, $ionicPlatform) {

        $ionicNavBarDelegate.showBar('false');
        
        $scope.logout = function(){

            $ionicPlatform.ready(function(){
                console.log("try to logout");
                $cordovaFacebook.logout()
                    .then(function(success) {
                        console.log("logged out");
                        $localstorage.clear();
                        $rootScope.$broadcast("logout", null);

                    }, function (error) {
                        console.log("erro: " + error)
                        $rootScope.$broadcast("logout", null);
                    });


            })
        }


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

    .controller('MoodCtrl', function($scope) {
        $scope.gotoPlaylist = function(type){
            console.log(type);
        }

    })

    .controller('RoutinesCtrl', function($scope) {
        $scope.gotoPlaylist = function(type){
            console.log(type);
        }
    })

    .controller('IntroCtrl', function($scope, $state, $cordovaFacebook, $ionicPlatform, socket, $location, $rootScope, $localstorage) {

        socket.on('connect', function(){
            console.log("connected")
        })

        if($localstorage.get('loggedIn') == 'true'){
            $rootScope.userPic = $localstorage.get('userPic');
            $rootScope.userName = $localstorage.getObject('user').name;
            $location.url('tab/mood');
        }

        $scope.facebookLogin = function(){

            $ionicPlatform.ready(function(){

                $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                    .then(function(success) {
                        console.log(JSON.toString(success));
                        $cordovaFacebook.api("me", ["public_profile"])
                            .then(function(user) {
                                var userInfo = user;
                                console.log(JSON.stringify(userInfo));
                                var picture = 'http://graph.facebook.com/' + user.id + '/picture?width=270&height=270';
                                $localstorage.setObject('user', user);
                                $localstorage.set('loggedIn', 'true');
                                $localstorage.set('userPic', 'http://graph.facebook.com/' + user.id + '/picture?width=270&height=270');
                                $rootScope.userPic = picture;
                                $rootScope.userName = userInfo.name;
                            })
                    }, function (error) {
                        // error
                    });
            })

            $location.url('tab/mood')

        }

        $scope.enter = function(){
            $rootScope.userPic = "img/profile.png";
            $rootScope.userName = "Deolindo Antonio";
            $state.go('tab.mood');
        }

        $rootScope.$on("logout", function(event, response){
            $rootScope.userPic = "img/profile.png";
            $rootScope.userName = "Deolindo Antonio";
            $location.url("/intro");

        })
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

        $scope.gotoPlaylist = function(type){
            console.log(type);
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
