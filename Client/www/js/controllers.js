angular.module('shuffle.controllers', [])


    .controller('NavCtrl', function($scope, $state, $location) {

        $scope.buttonHidden = false;

        $scope.gotoSettings = function(){
            $scope.buttonHidden = true;
            $location.url('settings');
        }
    })

    .controller('SettingsCtrl', function($scope, $ionicNavBarDelegate, $location) {
        console.log("fds")
        $ionicNavBarDelegate.showBar('false');

        $scope.gotoHome = function(){
            $location.url('tab/mood')
        }

    })

    .controller('MoodCtrl', function($scope) {})

    .controller('RoutinesCtrl', function($scope) {


    })

    .controller('IntroCtrl', function($scope, $state) {
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
