angular.module('shuffle.services', [])

    .factory('Chats', function() {
      // Might use a resource here that returns a JSON array

      // Some fake testing data
      var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
      }];

      return {
        all: function() {
          return chats;
        },
        remove: function(chat) {
          chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
          for (var i = 0; i < chats.length; i++) {
            if (chats[i].id === parseInt(chatId)) {
              return chats[i];
            }
          }
          return null;
        }
      };
    })

  /*.factory('socket', function(socketFactory){
   var mySocket = io.connect("http://localhost:3000");

   var mySocket = socketFactory({
   ioSocket: mySocket
   });

   return mySocket;
   })*/

    .factory('$localstorage', ['$window', function($window) {
      return {
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
          return JSON.parse($window.localStorage[key] || '{}');
        },
        clear: function () {
          $window.localStorage.clear();
        }
      }
    }])

    .factory('geoLocation', function ($localstorage, $cordovaGeolocation) {
      return {
        setGeolocation: function (latitude, longitude) {
          var _position = {
            latitude: latitude,
            longitude: longitude
          }
          $localstorage.setObject('geoLocation', _position);
        },
        getGeolocation: function () {
          var geo = $localstorage.getObject('geoLocation');
          return glocation = {
            lat: geo.latitude,
            lng: geo.longitude
          }
        },

        getPosition: function () {
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $ionicPlatform.ready(function () {
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                  var lat = position.coords.latitude;
                  var long = position.coords.longitude;
                  return lat, long;

                },
                function (err) {
                  console.log(err);
                });
          })
        }
      }
    });

