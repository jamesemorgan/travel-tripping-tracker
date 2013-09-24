app.controller('LookupController',

	function LookupController($scope, $rootScope, $log, BrowserGeoService, GoogleMapService) {

        var defaultSearch = "Please enter a location...";

        $scope.searchTerm = angular.copy(defaultSearch);
        $scope.lookupResults = [];
        $scope.selectedLookupResult = null;

        // Geo Look Up vars
        $scope.geoLookupFailed = {};

        $scope.currentMarkers = []

        $scope.onGeoLookup = function(){
            $scope.geoLookupFailed = {}; // reset
            BrowserGeoService.onAttemptGeoLookup(
                function(position){
                    GoogleMapService.addInfoWindow(position.latitude, position.longitude, true);
                },
                function(error){
                    $log.error("Failed, code = ["+error.code+"] reason = ["+error.reason+"]");
                    $scope.$apply(function(){
                        $scope.geoLookupFailed = error;
                    });
                }
            );
        }

        $scope.canLookup = function (){
            return $scope.searchTerm.length >= 4 && $scope.searchTerm != defaultSearch;
        }

        $scope.lookupMarker = function(){
            $scope.lookupResults = [];
            GoogleMapService.geoCode($scope.searchTerm,
                function(results){
                    $scope.$apply(function(){
                        $scope.lookupResults = results;
                    });
                },function(error){
                    $log.error("Failed, code = ["+error.code+"] reason = ["+error.reason+"]");
                });
        }

        $scope.addMarker = function(){
            GoogleMapService.addMarkerWithInfoWindow($scope.selectedLookupResult, true);
        }

        $scope.removeMarker = function(index){
            GoogleMapService.removeMarker(index);
        }

        // use a watch to observe changes to as I don't like putting service direct on page
        $scope.$watch(function() {
            return GoogleMapService.currentMarkers;
        }, function (markers) {
            $scope.currentMarkers = markers;
        });

    }
);

app.controller('MapController',

    function MapController($scope, $rootScope, $log, GoogleMapService) {

        $scope.initMap = function(){
            GoogleMapService.initMap(document.getElementById('map-canvas'));
        }
    }
);
