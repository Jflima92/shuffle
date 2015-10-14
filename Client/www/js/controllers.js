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

    .controller('SettingsCtrl', function($scope, $ionicNavBarDelegate, $location, $ionicPlatform, $cordovaFacebook) {
        console.log("fds")
        $ionicNavBarDelegate.showBar('false');


            $scope.logout = function(){
                console.log("crl");
                $ionicPlatform.ready(function(){
                    console.log("crl");
                $cordovaFacebook.logout();
            })
        }


        $scope.gotoHome = function(){
            $location.url('tab/mood')
        }

    })

    .controller('MoodCtrl', function($scope) {

    })

    .controller('RoutinesCtrl', function($scope) {


    })

    .controller('IntroCtrl', function($scope, $state, $cordovaFacebook, $ionicPlatform, $location, $rootScope) {

        $scope.facebookLogin = function(){

            $ionicPlatform.ready(function(){

                $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                    .then(function(success) {
                        console.log(JSON.toString(success));
                        $cordovaFacebook.api("me", ["public_profile"])
                            .then(function(user) {
                                $scope.user = user;
                                $rootScope.userPic = 'http://graph.facebook.com/' + user.id + '/picture?width=270&height=270'
                            })
                    }, function (error) {
                        // error
                    });
            })
            $location.url('tab/mood')

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
    });
