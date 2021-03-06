// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('shuffle', ['ionic', 'shuffle.controllers', 'shuffle.services', 'btford.socket-io', 'ngCordova', 'spotify'])

    .run(function($ionicPlatform, $cordovaGeolocation, geoLocation) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log(position);
                    geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude)
                }, function (err) {
                    geoLocation.setGeolocation(41.1783982, -8.5951453)
                });
        })
    })

    .config(function($cordovaFacebookProvider){

        //this.browserInit = function(id, version) {
        //    if (!window.cordova) { //Comment for browser testing, uncomment to deploy
        //        var appID = 367156356826931;
        //        var version = "v2.0";
        //        $cordovaFacebookProvider.browserInit(appID, version);
        //    }
        //}

        this.browserInit = function(id, version) {
            ionic.Platform.ready(function () {

                var appID = 1476479009327244;
                var version = "v2.0"; // or leave blank and default is v2.0

                $cordovaFacebookProvider.browserInit(appID, version);
            })
        }
    })

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $ionicConfigProvider
            .tabs.position('bottom');

        $stateProvider
            .state('Intro', {
                url: '/intro',
                templateUrl: 'templates/intro.html',
                controller: 'IntroCtrl'
            })

            .state('Settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            })

            .state('About', {
                url: '/about',
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            })

            .state('Player', {
                url: '/player',
                templateUrl: 'templates/player.html',
                controller: 'PlayerCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                controller: 'NavCtrl',
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:
            .state('tab.mood', {
                url: '/mood',
                views: {
                    'tab-mood': {
                        templateUrl: 'templates/tab-mood.html',
                        controller: 'MoodCtrl'
                    }
                }
            })

            .state('tab.routines', {
                url: '/routines',
                views: {
                    'tab-routines': {
                        templateUrl: 'templates/tab-routines.html',
                        controller: 'RoutinesCtrl'
                    }
                }
            })

            /*.state('tab.chats', {
             url: '/chats',
             views: {
             'tab-chats': {
             templateUrl: 'templates/tab-chats.html',
             controller: 'ChatsCtrl'
             }
             }
             })*/

            .state('tab.weather', {
                url: '/weather',
                views: {
                    'tab-weather': {
                        templateUrl: 'templates/tab-weather.html',
                        controller: 'WeatherCtrl',
                    }
                }
            })

            .state('playlist', {
                url: '/playlist/:keywords',
                templateUrl: 'templates/playlist.html',
                controller: 'PlaylistCtrl'
            })

            .state('lists', {
                url: '/lists/:keywords',
                templateUrl: 'templates/lists.html',
                controller: 'ListsCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/intro');

    });
