
(function() {

  //Make it expressive by introducing new variable app. App now in global space (bad practics)
  var app = angular.module('youtubevideo', ['ionic', 'youtube-embed']);

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

  //**** Version 2: Refactory codes to use pull to refresh, and infinite scroll ***//
  app.controller('mycontroller', function($scope, $http, $ionicModal){

    $scope.videos = [];

    $scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    }

    $scope.nextPageToken = null;

    $scope.youtubeParams = {
      key: 'AIzaSyAnAi9xKNqI_xNGDKHtFZrInz5l_QkMqNs',
      type: 'video',
      maxResults: '5',
      part: 'id,snippet',
      q: 'creatorup',
      order: 'date',
      channelId: 'UCeEqIv7lVwOOLnwxuuhQFuQ',
    }

    function loadVideos(params, callback) {
      $http.get('https://www.googleapis.com/youtube/v3/search', {params: params}).success(function(response){
        
        var videos = [];
        if(response.nextPageToken) {
          $scope.nextPageToken = response.nextPageToken;
          console.log ($scope.nextPageToken);
          angular.forEach(response.items, function(child){
            videos.push(child);
          });
        }
        callback(videos);
        
      });
    }

    $scope.loadOlderVideos = function() {
      var params = $scope.youtubeParams; 
      if ($scope.nextPageToken) {
        params['pageToken'] = $scope.nextPageToken;
      }
      loadVideos(params, function(olderVideos){
        if (olderVideos) {
          $scope.videos = $scope.videos.concat(olderVideos);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.loadNewerVideos = function() {
      var params = $scope.youtubeParams;
      params['pageToken'] = '';
      loadVideos(params, function(newerVideos) {
        $scope.videos = newerVideos;
        $scope.$broadcast('scroll.refreshComplete');
      });

    };

    $ionicModal.fromTemplateUrl('template/setting.html', function(modal){
        $scope.setting = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
    });

    $scope.settingClick = function(){    
        $scope.setting.show();
    };

    $scope.closeSetting = function(){
        $scope.setting.hide();
    };

  });

  //**** Version 1: Simply display Data retrun from YouTube API V3 ***//
  // app.controller('mycontroller', function($scope, $http){

  //   $scope.videos = [];

  //   $scope.playerVars = {
  //     rel: 0,
  //     showinfo: 0,
  //     modestbranding: 0,
  //   }

  //   $scope.youtubeParams = {
  //     key: 'AIzaSyAnAi9xKNqI_xNGDKHtFZrInz5l_QkMqNs',
  //     type: 'video',
  //     maxResults: '5',
  //     part: 'id,snippet',
  //     q: 'creatorup',
  //     order: 'date',
  //     channelId: 'UCeEqIv7lVwOOLnwxuuhQFuQ',
  //   }

  //   $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams}).success(function(response){
  //     angular.forEach(response.items, function(child){
  //       $scope.videos.push(child);
  //     });
  //   });

  // });
  //**** Version 1 End ***//

}()); // make app varialbe just for this scope and not global


