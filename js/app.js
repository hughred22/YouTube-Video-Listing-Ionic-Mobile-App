
(function() {

  //Make it expressive by introducing new variable app. App now in global space (bad practics)
  var app = angular.module('youtubevideo', ['ionic', 'youtube-embed', 'ngCordova']);

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
  // app.controller('mycontroller', function($scope, $http, $ionicModal){

  //   $scope.videos = [];

  //   $scope.appname = "";

  //   $scope.playerVars = {
  //     rel: 0,
  //     showinfo: 0,
  //     modestbranding: 0,
  //   }

  //   $scope.nextPageToken = null;

  //   $scope.youtubeParams = {
  //     key: 'AIzaSyAnAi9xKNqI_xNGDKHtFZrInz5l_QkMqNs',
  //     type: 'video',
  //     maxResults: '5',
  //     part: 'id,snippet',
  //     // q: 'ravetrain',
  //     q: 'creatorup',
  //     order: 'viewCount',
  //     // channelId: 'UCbtVfS6cflbIXTZ0nGeRWVA',
  //     channelId: 'UCeEqIv7lVwOOLnwxuuhQFuQ',
  //   }

  //   function loadVideos(params, callback) {
  //     $http.get('https://www.googleapis.com/youtube/v3/search', {params: params}).success(function(response){
        
  //       var videos = [];
  //       if(response.nextPageToken) {
  //         $scope.nextPageToken = response.nextPageToken;
  //         console.log ($scope.nextPageToken);
  //         angular.forEach(response.items, function(child){
  //           videos.push(child);
  //         });
  //       }
  //       callback(videos);
        
  //     });
  //   }

  //   $scope.loadOlderVideos = function() {
  //     var params = $scope.youtubeParams; 
  //     if ($scope.nextPageToken) {
  //       params['pageToken'] = $scope.nextPageToken;
  //     }
  //     loadVideos(params, function(olderVideos){
  //       if (olderVideos) {
  //         $scope.videos = $scope.videos.concat(olderVideos);
  //       }
  //       $scope.$broadcast('scroll.infiniteScrollComplete');
  //     });
  //   };

  //   $scope.loadNewerVideos = function() {
  //     var params = $scope.youtubeParams;
  //     params['pageToken'] = '';
  //     loadVideos(params, function(newerVideos) {
  //       $scope.videos = newerVideos;
  //       $scope.$broadcast('scroll.refreshComplete');
  //     });

  //   };

  //   $ionicModal.fromTemplateUrl('template/setting.html', function(modal){
  //       $scope.setting = modal;
  //   }, {
  //       scope: $scope,
  //       animation: 'slide-in-up',
  //   });

  //   $scope.settingClick = function(){    
  //       $scope.setting.show();
  //   };

  //   $scope.closeSetting = function(){
  //       $scope.setting.hide();
  //   };

  // });

  //**** Version 1: Simply display Data retrun from YouTube API V3 ***//
  app.controller('mycontroller', function($scope, $http, $ionicModal, $ionicActionSheet, $cordovaSocialSharing){

    // $scope.videos = [
    // {
    //   title: "My first video",
    //   date: "1-1-2015",
    //   thumbnails: "http://i.ytimg.com/vi/bJp1ptX4F3M/maxresdefault.jpg",
    // }, 
    // {
    //   title: "My second video",
    //   date: "5-7-2015",
    //   thumbnails: "http://i.ytimg.com/vi/NA2VerbOyt0/maxresdefault.jpg",
    // }
    // ]

    $scope.videos = [];

    $scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    }

    $scope.youtubeParams = {
      key: 'AIzaSyAnAi9xKNqI_xNGDKHtFZrInz5l_QkMqNs',
      type: 'video',
      maxResults: '5',
      part: 'id,snippet',
      q: 'creatorup',
      order: 'viewCount',
      channelId: 'UCeEqIv7lVwOOLnwxuuhQFuQ',
    }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams}).success(function(response){
      angular.forEach(response.items, function(child){
        $scope.videos.push(child);
      });
    });

    //WordPress intergation
    $scope.posts = [];
    var wordpressUrl = "http://ravetrain.tv/wp-json/posts?filter[category_name]=shows";
    $scope.wordpress = {
      show: false
    }
    $scope.wordpress.useWordpress = function() {
      $http.get(wordpressUrl)
        .success(function(response){
          console.log("Reveived getPosts via HTTP: ", response, status);
          angular.forEach(response, function(child){
            $scope.posts.push(child);
          });
        })
        .error(function(response, status){
          console.log("Error while received response. " + status + response);
        });
    }

    //Create an Modal for setting screen
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

    //**** Social Sharing Function ***//
    $scope.socialShare = function(message, image, link) {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
          titleText: 'Share Video',
          buttons: [
              { text: 'Share on Facebook' },
              { text: 'Share on Twitter' },
              { text: 'Share on other Apps'},
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) {
              if(index == '0') {
                $cordovaSocialSharing.shareViaFacebook(message, image, link)
                .then(function(result) {
                  // Success!
                }, function(err) {
                  alert("Error: " + err);
                });

              } else if(index == '1') {
                $cordovaSocialSharing.shareViaTwitter(message, image, link)
                .then(function(result) {
                  // Success!
                }, function(err) {
                  alert("Error: " + err);
                });
              } else {
                $cordovaSocialSharing.share(message, null, image, link)
                .then(function(result) {
                  // Success!
                }, function(err) {
                  alert("Error: " + err);
                });;
              }
              return true;
          }
      });
    };

  });
  //**** Version 1 End ***//

}()); // make app varialbe just for this scope and not global


