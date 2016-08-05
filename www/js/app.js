// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','Kp.Factory', 'ngCordova', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

     .state('tab', {
    url: '/tab',
    abstract:true,
    templateUrl: 'templates/tabs.html'
  })
     
  .state('tab.login', {
    url: '/login',   
    cache:false,
    views: {
      'tab-login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('tab.signup', {
    url: '/signup', 
    cache:false,  
    views: {
      'tab-signup': {
        templateUrl: 'templates/signup.html',
	      controller: 'SignupCtrl'
      }
    }
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.map', {
      url: '/map',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'GeoCtrl'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.friends_near_me', {
      url: '/friends_near_me',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/friends_near_me.html',
          controller: 'FNMCtrl'
        }
      }
    })
    // .state('app.find_a_friend', {
    //   url: '/find_a_friend',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/find_a_friend.html',
    //       controller: 'FAFCtrl'
    //     }
    //   }
    // })
    // .state('app.history', {
    //   url: '/history',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/history.html',
    //       controller: 'HistoryCtrl'
    //     }
    //   }
    // })
    // .state('app.leaderboard', {
    //   url: '/leaderboard',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/leaderboard.html',
    //       controller: 'LBCtrl'
    //     }
    //   }
    // })

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');
});
