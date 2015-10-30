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

    .controller('MoodCtrl', function($scope, $location, $state) {
        $scope.gotoPlaylist = function(type){
            console.log(type);
            $state.go('lists', {keywords: type});
        }

    })

    .controller('RoutinesCtrl', function($scope, $state) {
        $scope.gotoPlaylist = function(type){
            console.log(type);
            $state.go('lists', {keywords: type});
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

    .controller('WeatherCtrl', function($scope, $state, $http) {
        $scope.settings = {
            enableFriends: true
        };

        $scope.gotoPlaylist = function(type){
            console.log(type);
            $state.go('lists', {keywords: type});
        };

        $http({
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID=7ce75d26c184e8a46d2e6e0c47c6f4c3'
        }).then(function successCallback(response) {
            $scope.weather = response.data.weather[0].description;
            $scope.city = response.data.name;
            $scope.country = response.data.sys.country; 
        }, function errorCallback(response) {
            console.log("openweathermapAPI failed");
        });



    })

    .controller('AboutCtrl', function($scope, $ionicNavBarDelegate, $location) {
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('settings')
        };
    })

    // NEW 
    .controller('PlaylistCtrl', function($scope, $cordovaOauth, $ionicPlatform, $localstorage, Spotify, $cordovaMedia, $stateParams){
        console.log("BULLSHIT");
        var clientId = 'a8ca1abb7621448cb3a1216604f321c3';

        var owner_id = $stateParams.owner_id;
        var playlist_id = $stateParams.playlist_id;
        var spotToken = $localstorage.get('spotify-token');
        console.log("https://api.spotify.com/v1/users/" + owner_id + "/playlists/" + playlist_id + "/tracks");

        $scope.performLogin = function() {
            $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
                $localstorage.set('spotify-token', result.access_token);
                Spotify.setAuthToken(result.access_token);
            }, function(error) {
                console.log("Error -> " + error);
            });
        };

        if(spotToken != null){
            Spotify.setAuthToken(spotToken)
        }
        else {
            $scope.performLogin();
        }




        Spotify.getPlaylist(owner_id, playlist_id,{"limit": "10"}).then(function (data) {
            $scope.tracks = data.tracks.items;
        }, function(error){
            var spotToken = $localstorage.get('spotify-token');
            if(spotToken != null){
                Spotify.setAuthToken(spotToken)
            }
            else {
                $scope.performLogin();
            }
        });

        $scope.audio = null;
        $scope.playTrack = function(trackInfo) {

            console.log(trackInfo.track.preview_url);
            /*ionic.Platform.ready(function(){
                $scope.audio = new Media(trackInfo.track.preview_url,  onSuccess, onError);
            })

            $scope.audio.play();
            console.log("quase");*/

            ionic.Platform.ready(function() {
                var audio = $cordovaMedia.newMedia(trackInfo.track.preview_url);

                console.log(trackInfo.track.preview_url+".mp3");
                $scope.audio = $cordovaMedia.newMedia(trackInfo.track.preview_url+".mp3");

                $scope.audio.play();
            })

        };
        function onSuccess() {
            console.log("playAudio():Audio Success");
        }

        function onError(err) {
            console.log("playAudio():Audio Error " + err);
        }
        $scope.openSpotify = function(link) {
            window.open(link, '_blank', 'location=yes');
        };

        $scope.stop = function() {
            if ($scope.audio) {
                $scope.audio.pause();
            }
        };

        $scope.play = function() {
            if ($scope.audio) {
                $scope.audio.play();
            }
        };
    })

    .controller('ListsCtrl', function($scope, $http, $stateParams, $state, $ionicPlatform, $cordovaOauth, $localstorage, Spotify) {
        var clientId = 'a8ca1abb7621448cb3a1216604f321c3';
        $scope.playlists = [];

        $http.get("https://api.spotify.com/v1/search?q=%22" + $stateParams.keywords + "%22&type=playlist", { })
            .success(function(data)
            {
                $scope.playlistsID = data.playlists.items;
            })
            .error(function(data) {
                alert("ERROR");
            });

        https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

            $scope.enterPlaylist = function(owner_id, playlist_id){

                $state.go('playlist', {owner_id: owner_id, playlist_id: playlist_id});
            }

        /*$scope.performLogin = function() {
         $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
         $localstorage.set('spotify-token', result.access_token);
         Spotify.setAuthToken(result.access_token);
         $scope.updateInfo();
         }, function(error) {
         console.log("Error -> " + error);
         });
         };

         $scope.updateInfo = function() {

         Spotify.getCurrentUser().then(function (data) {
         // $scope.getUserPlaylists(data.id);
         $scope.getPlaylistBasedOnID();
         }, function(error) {
         $scope.performLogin();
         });
         };

         $ionicPlatform.ready(function() {
         var storedToken = $localstorage.get('spotify-token');
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
         }

         $scope.getPlaylistBasedOnID = function(){
         Spotify.getPlaylist('1176458919', '6Df19VKaShrdWrAnHinwVO').then(function (data) {
         console.log(data);
         $scope.playlistsID = data.items;
         });
         };*/
        // END OF NEW
    });
