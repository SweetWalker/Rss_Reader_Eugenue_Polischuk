'use strict';
    var app = angular.module('rssModule', ['ngResource','chart.js','ngSanitize','angular.filter']);

    app.factory('RssFact', function ($resource) {
            return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
                fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
            });
        });

    app.service('RssService', function ($rootScope, RssFact, $q) {
        this.rssSrc = [
            {title: 'Slash', url:     'http://rss.slashdot.org/Slashdot/slashdot'},
            {title: 'StackAngular', url: 'http://stackoverflow.com/feeds/tag?tagnames=angularjs&sort=newest'},
            {title: 'Books', url: 'http://bookz.ru/rss/new_books_fantasy.xml'},
            
        ];
    
        this.get = function() {
            var feeds = [];
            var deffered = $q.defer();
            if (feeds.length === 0) {
                for (var i=0; i<this.rssSrc.length; i++) {
                    RssFact.fetch({q: this.rssSrc[i].url, num: this.rssSrc[i].url.length}, {}, function (data) {
                        var feed = data.responseData.feed;
                        feeds.push(feed);
                        deffered.resolve(feeds);
                    });

                }
            }

           return deffered.promise;
        };

        this.addSource = function(url, title) {
            var index = this.rssSrc.push({
                url: url,
                title: 'newRss'
            });
        };

    });

    app.controller('RssCtrl', function($scope, RssService, $timeout, $window){

        
      
        this.getFeeds = function(){
            RssService.get().then(function(data){     
            $scope.feeds = data;
            });
        };

        this.getFeeds();
        var _this = this;
        
        $scope.addSource = function(url) {
            RssService.addSource(url);
            _this.getFeeds();
        };

        $scope.removeSource = function(feed) {
            $scope.feeds.splice( $scope.feeds.indexOf(feed), 1 );
            $scope.main = [];
        };
        

        $scope.showMess = function (feed) {
            $scope.symbKey = [];
            $scope.symbVal = [];
            $scope.mesarr = [];
            $scope.mesarr.push(feed);
            var chartMess = [];
            chartMess.push(feed);
            var chartMessf = chartMess[0].replace(/<\/?[^>]+(>|$)/g, "").toLowerCase().replace(/[^a-z-а-я]/g, '');
            var messSymb = [];

            for(var i = 0 ; i < chartMessf.length; i++) {
                messSymb.push(chartMessf[i]);
            };


            var counts = {};
            messSymb.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });


            for(var key in counts) {
                $scope.symbKey.push(key)
                $scope.symbVal.push(counts[key]);
            };
            $window.scrollTo(0,0);   
        };
      
        $scope.showStat = function (feed) {
            $scope.main = [];
            $scope.main.push(feed);
            $window.scrollTo(0,0);
        };
 });