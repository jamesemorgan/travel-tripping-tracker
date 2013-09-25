app.controller('LookupController',

	function LookupController($scope, $rootScope, $log, BrowserGeoService, GoogleMapService) {

        var defaultSearch = "Please enter a location...";

        $scope.searchTerm = angular.copy(defaultSearch);
        $scope.lookupResults = [];
        $scope.selectedLookupResult = [];

        // Geo Look Up vars
        $scope.geoLookupFailed = {};

        $scope.currentMarkers = []

        // use a watch to observe changes to as I don't like putting service direct on page
        $scope.$watch(function() {
            return GoogleMapService.currentMarkers;
        }, function (markers) {
            $scope.currentMarkers = markers;
        });

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
            return $scope.searchTerm.length >= 3 && $scope.searchTerm != defaultSearch;
        }

        $scope.lookupMarker = function(){
            $scope.lookupResults = []; // reset
            geoCode(
                function(results){
                    $scope.$apply(function(){
                        $scope.lookupResults = results;
                    });
                },function(error){
                    $log.error("Failed, code = ["+error.code+"] reason = ["+error.reason+"]");
                });
        }

        function geoCode(success, failure){
            $log.info("GeoCode lookup " + $scope.searchTerm)
            GoogleMapService.geoCode($scope.searchTerm, success, failure);
        }

        $scope.addMarker = function(){
            GoogleMapService.addMarkerWithInfoWindow($scope.selectedLookupResult, true);
        }

        $scope.removeMarker = function(index){
            GoogleMapService.removeMarker(index);
        }

        $scope.drawRoute = function(){
            GoogleMapService.drawCurrentMarkers();
        }

        $scope.drawOurRoute = function() {
            $scope.clear();
            // TODO this does not work -> QUERY_LIMIT_EXCEED -> needs to based on promises and start next one on completion with delay
            var ourRoute = ['manchester','beijing','datong','xian','shanghai','hong kong','hanoi','halong bay','hue','hoi an','nha trang','da lat','mui ne','saigon'];

            for (var i=0; i <= ourRoute.length; i++) {

                $scope.searchTerm = ourRoute[i];
                $scope.lookupMarker();

                geoCode(
                    function(results){
                        $scope.$apply(function(){
                            $scope.lookupResults = results;
                            $scope.selectedLookupResult = $scope.lookupResults[0]
                            GoogleMapService.addMarkerWithInfoWindow($scope.selectedLookupResult, true);
                            $scope.addMarker();
                            GoogleMapService.drawCurrentMarkers();
                        });
                    },function(error){
                        $log.error("Failed, code = ["+error.code+"] reason = ["+error.reason+"]");
                    });
            }
            GoogleMapService.drawCurrentMarkers();
        }

        $scope.clear = function(){
            $scope.searchTerm = angular.copy(defaultSearch);
            $scope.lookupResults = [];
            $scope.selectedLookupResult = [];
            $scope.geoLookupFailed = {};
            $scope.currentMarkers = []

            GoogleMapService.clear();
        }
    }
);

app.controller('MapController',

    function MapController($scope, $rootScope, $log, GoogleMapService) {

        $scope.initMap = function(){
            GoogleMapService.initMap(document.getElementById('map-canvas'));
        }
    }
);
