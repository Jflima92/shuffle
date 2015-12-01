angular.module('shuffle.controllers', [])


    .controller('NavCtrl', function($scope, $state, $location, $localstorage, $rootScope) {




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
            $location.url('playlist');
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
            $state.go('playlist', {keywords: type});
        }

    })

    .controller('RoutinesCtrl', function($scope, $state) {
        $scope.gotoPlaylist = function(type){
            console.log(type);
            $state.go('playlist', {keywords: type});
        }
    })

    .controller('IntroCtrl', function($scope, $state, $cordovaFacebook, $ionicPlatform, $location, $rootScope, $localstorage) {


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

    .controller('WeatherCtrl', function($scope, $timeout, $state, $http, geoLocation, $ionicPlatform, $ionicLoading) {

        var lati = 0;
        var longi = 0;

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        lati = geoLocation.getGeolocation().lat;
        longi = geoLocation.getGeolocation().lng;

        $http({
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather?lat='+lati+'&lon='+longi+'&APPID=7ce75d26c184e8a46d2e6e0c47c6f4c3'
        }).then(function successCallback(response) {
            $scope.weather = response.data.weather[0].description;
            $scope.city = response.data.name;
            $scope.country = response.data.sys.country;
            $scope.temperature = Math.round(response.data.main.temp-272.15);

            var code = response.data.weather[0].id;

            if (code == 800)
                $scope.image = "sunny";
            else {
                code = code / 100;
                if (code == 2)
                    $scope.image = "stormy";
                else if (code == 3 || code == 5)
                    $scope.image = "rainy";
                else if (code == 6)
                    $scope.image = "snow";
                else
                    $scope.image = "cloudy";
            }

        }, function errorCallback(response) {
            console.log("openweathermapAPI failed");
        });



        $timeout(function () {

            $ionicLoading.hide();
        }, 500);



        $scope.gotoPlaylist = function(){
            console.log($scope.image);
            $state.go('playlist', {keywords: $scope.image});
        };

    })

    .controller('AboutCtrl', function($scope, $ionicNavBarDelegate, $location) {
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('settings')
        };
    })

    // NEW 
    .controller('PlaylistCtrl', function($scope, $http, $location,   $state, $stateParams, $timeout, $ionicLoading, $http, $cordovaOauth, $ionicPlatform, $localstorage, Spotify, $cordovaMedia){

        var clientId = '0117240bd6d743c98064d7765e69da76';
        var secret = '8550fc1bc6104c3bb755d8dc1db2cd43';
        console.log("params before: " + $stateParams.keywords);

        var spotToken = $localstorage.get('spotify-token');



        $scope.performLogin = function() {
            $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
                console.log(JSON.stringify(result));
                $localstorage.set('spotify-token', result.access_token);
                Spotify.setAuthToken(result.access_token);
                $state.go('playlist', {keywords: $stateParams.keywords});
                $location.url('tab/playlist/'+$stateParams.keywords);
            }, function(error) {
                console.log("Error -> " + error);
            });
        };

        /*var postData = {
         'grant_type': 'refresh_token',
         'refresh_token': $localstorage.get('spotify-token')
         }*/

        if(spotToken != null){
            /*console.log("AUWIEQW");
             $http({
             url: 'https://accounts.spotify.com/api/token',
             method: 'POST',
             data: postData,
             headers: {'Authorization': 'Basic ' +  buffer}
             }).success(function (data, status, headers, config) {
             console.log(JSON.stringify(data));
             }).error(function (data, status, headers, config) {
             //handle error
             });*/
            Spotify.setAuthToken(spotToken)
        }
        else {
            $scope.performLogin();
        }



        // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.

        $scope.$on('$ionicView.beforeEnter', function() {
            var playlists;
            var keys =
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

            $scope.tracks = null;
            console.log("params: " + $stateParams.keywords);
            $http.get("https://api.spotify.com/v1/search?q=%22" + $stateParams.keywords + "%22&type=playlist&limit=50", {})
                .success(function (data) {
                    playlists = data.playlists.items;

                    var getPlaylist = null;
                    var random = (Math.ceil(Math.random() * playlists.length-1));
                    getPlaylist = playlists[random];


                    var owner_id = getPlaylist.owner.id;
                    var playlist_id = getPlaylist.id;
                    $scope.listname =getPlaylist.name;



                    Spotify.getPlaylistTracks(owner_id, playlist_id, {"limit": 30}).then(function (data) {
                        $scope.tracks = data.items;
                    }, function (error) {
                        var spotToken = $localstorage.get('spotify-token');
                        if (spotToken != null) {
                            Spotify.setAuthToken(spotToken)
                        }
                        else {
                            $scope.performLogin();
                        }
                    });
                })
                .error(function (data) {
                    alert("ERROR");

                });

            $timeout(function () {

                $ionicLoading.hide();
            }, 1200);



        })


        $scope.audio = null;
        $scope.playTrack = function(trackInfo) {

            /*ionic.Platform.ready(function(){
             $scope.audio = new Media(trackInfo.track.preview_url,  onSuccess, onError);
             })

             $scope.audio.play();1200
             console.log("quase");*/

            ionic.Platform.ready(function() {
                var audio = $cordovaMedia.newMedia(trackInfo.track.preview_url);

                console.log(trackInfo.track.preview_url+".mp3");
                if($scope.audio != null)
                    $scope.audio.stop();

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

        $http.get("https://api.spotify.com/v1/search?q=%22" + $stateParams.keywords + "%22&type=playlist&limit=50", { })
            .success(function(data)
            {
                $scope.playlistsID = data.playlists.items;
                console.log($scope.playlistsID.length);
            })
            .error(function(data) {
                alert("ERROR");
            });

        https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

            $scope.enterPlaylist = function(owner_id, playlist_id){

                $state.go('playlist', {owner_id: owner_id, playlist_id: playlist_id});
            }

    });
