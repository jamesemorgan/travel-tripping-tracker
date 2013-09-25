app.service('GoogleMapService', function GoogleMapService($rootScope, $log, $http, Settings) {
    var self = this;

    var map; // Actual Map -> this is the baby, should it be a directive instead?

    var geocoder;

    var GEO_OK =  google.maps.GeocoderStatus.OK;
    var GEO_ZERO_RESULTS =  google.maps.GeocoderStatus.ZERO_RESULTS;
    var GEO_OVER_QUERY_LIMIT =  google.maps.GeocoderStatus.OVER_QUERY_LIMIT;
    var GEO_REQUEST_DENIED =  google.maps.GeocoderStatus.REQUEST_DENIED;
    var GEO_INVALID_REQUEST =  google.maps.GeocoderStatus.INVALID_REQUEST;

    var geocodeErrors = {
        GEO_OK: 'Geocode was a success.',
        GEO_ZERO_RESULTS: 'Geocode was successful but returned no results. Please check your location',
        GEO_OVER_QUERY_LIMIT: 'Over API quota.',
        GEO_REQUEST_DENIED: 'Request was denied for some reason.',
        GEO_INVALID_REQUEST: 'Address is missing.'
    };

    self.currentMarkers = [];
    self.currentTravelPath = {};


    self.initMap = function(mapElement){
        google.maps.visualRefresh = true; // enable fancy look
        map = new google.maps.Map(mapElement, {
            zoom: 1,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })
    }

    self.addInfoWindow = function(latitude, longitude, shouldCentreMap){
        var pos = new google.maps.LatLng(latitude, longitude);

        addUnboundInfoWindow(pos, "Location has been found")

        if(shouldCentreMap){
            map.setCenter(pos);
        }
    }

    self.geoCode = function(address, success, failure){
       if(geocoder == null){
           geocoder = new google.maps.Geocoder();
       }
        geocoder.geocode( {'address': address}, function(results, status) {
            if (status == GEO_OK) {
                $log.info("Success "  + results.length)
                success(results);
            } else {
                $log.error('Geocode was not successful for the following reason: ' + status);
                failure({
                    code:status,
                    reason: geocodeErrors[status]
                });
            }
        });
    }

    self.addMarkerWithInfoWindow = function(locationResult, shouldCentreMap){
        if (alreadyAddedMarker(locationResult)){
            $log.error("Not adding, marker already found!")
        } else {

            var marker = addMarker(locationResult.geometry.location, locationResult.formatted_address)

            addInfoWindowToMarker(marker, "You visited " + locationResult.formatted_address)

            if(shouldCentreMap){
                map.setCenter(locationResult.geometry.location);
            }
            map.setZoom(5);
        }
    }

    self.removeMarker = function(index){
        self.currentMarkers[index].setMap(null);// Clear map of marker
        self.currentMarkers.splice(index, 1);// Remove from current list
    }

    self.drawCurrentMarkers = function(){
        var flightPlanCoordinates = [];

        for (var i=0; i < self.currentMarkers.length; i++) {
            flightPlanCoordinates.push(self.currentMarkers[i].position)
        }

        self.currentTravelPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        self.currentTravelPath.setMap(map);
    }

    self.clear = function(){

        if(self.currentMarkers != null){
            for (var i=0; i < self.currentMarkers.length; i++) {
                self.currentMarkers[i].setMap(null)
            }
            self.currentMarkers = []
        }

        if(self.currentTravelPath != null && self.currentTravelPath.hasOwnProperty('setMap')){
            self.currentTravelPath.setMap(null);
            self.currentTravelPath = null;
        }
    }

    self.plotLocations = function(latLngMarkers){
        // TODO
    }

    function alreadyAddedMarker(marker){
        for (var i=0; i < self.currentMarkers.length; i++) {
            $log.warn("current pos = " + self.currentMarkers[i].position + " | new marker = " + marker.geometry.location)
            if (angular.equals(self.currentMarkers[i].position, marker.geometry.location)) {
                return true;
            }
        }
        return false;
    }

    function addMarker(location, title){
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: title
        });
        self.currentMarkers.push(marker)
        return marker;
    }

    function addInfoWindowToMarker(marker, content){
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
        });
    }

    function addUnboundInfoWindow(position, content){
        new google.maps.InfoWindow({
            map: map,
            position: position,
            content: content
        });
    }


});
