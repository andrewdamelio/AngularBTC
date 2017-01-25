'use strict';

angular
  .module('btcApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })



  .factory('Page', function(){
    var title = 'default';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle; }
    };
  })
     
  .directive('ticker', [function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        source: "@"
        
      },
      template: "<div><img src='assets/{{logo}}' alt='BTC logo' height='30px'><sup> {{price | currency}}</sup></br><span class='chart-{{source}}' ></span></br><sup>({{text}})</sup></div>",      
       controller: function($scope, $http, $timeout) {

        $scope.price="0";
        $scope.pricePrev="0";
        $scope.ticker=[];
        $scope.text="";
        var sourceUrl="";

        if ($scope.source === "btce" || $scope.source === "ltc" ) {
            $scope.source==="btce" ? sourceUrl="http://bittopia.ca/dev/btc/php/btce.php" : sourceUrl="http://bittopia.ca/dev/btc/php/btcelite.php";
            $scope.text = "BTC-e";
            $scope.source==="btce" ? $scope.logo = "bitcoin.png": $scope.logo = "litecoin.png";;
        }
        else {
            sourceUrl="http://bittopia.ca/dev/btc/php/bitstamp.php";
            $scope.text = "Bitstamp";
            $scope.logo = "bitcoin.png";
        }

        $scope.updateBTC = function() {
           $http({method: 'get', url: sourceUrl}). //https://www.bitstamp.net/api/
                 
           success(function(data) {
            if ($scope.source === 'btce' || $scope.source === 'ltc') {
                $scope.price=data.ticker.last;                    
            }
            else {
                $scope.price=data.last;                      
            }
          
            if ($scope.price != $scope.pricePrev) {
            
                if ($scope.ticker.length>=55) {
                    $scope.ticker.shift();
                }
          
                if ($scope.price >=0) {
                  $scope.ticker.push($scope.price);  
                  $scope.pricePrev = $scope.price;
                  $('.chart-'+$scope.source).sparkline($scope.ticker);
                }
      
            }
          }).
          error(function(data) {
            console.log("FAIL "+data);
          });
          $timeout($scope.updateBTC, 5000);
        }
        $scope.updateBTC();



       },


    };
  }])


 

