'use strict';

angular.module('btcApp')

  .controller('TitleCltr', function ($scope, Page) {
    $scope.Page = Page;
  })

  .controller('MainCtrl', function ($scope, $http, $timeout, Page) {
    $scope.ticker = [];
    $scope.lastTick=0;
    $scope.timestamp=0;
    $scope.lastAsk = "";
    $scope.lastBid = "";
    $scope.volume = "";
    $scope.donate=false;

     $scope.emo = function() {
          $("#price").removeClass("green");
          $("#price").removeClass("red");
          $("#price").removeClass("glyphicon-arrow-down");
          $("#price").removeClass("glyphicon-arrow-up");
        
        if ($scope.lastTick < $scope.ticker[$scope.ticker.length-1]) {
            $("#price").addClass("green");
            $("#price").addClass("glyphicon-arrow-up");
        }
        
        if ($scope.lastTick > $scope.ticker[$scope.ticker.length-1]) {
            $("#price").addClass("red");
            $("#price").addClass("glyphicon-arrow-down");
        }
      };

     $scope.updateBTC = function() {
          $http({method: 'get', url: 'http://bittopia.ca/dev/btc/php/bitstamp.php'}). //https://www.bitstamp.net/api/
             
            success(function(data) {
   
              if (data.timestamp != $scope.timestamp) {
                $scope.lastAsk = data.ask;
                $scope.lastBid = data.bid;
                $scope.volume = data.volume;
                $scope.ticker.push(data.last);  
                $scope.emo();
                $scope.lastTick = data.last;
                $scope.timestamp = data.timestamp;
                $scope.Page.setTitle(data.last);
              }
            }).
            error(function(data) {
              console.log("FAIL "+data);
            });
          $timeout($scope.updateBTC,5000);
      };

      $scope.updateBTC();

});



