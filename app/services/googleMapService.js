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


    self.initMap = function(mapElement){
        google.maps.visualRefresh = true; // enable fancy look
        map = new google.maps.Map(mapElement, {
            zoom: 1,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })
    }

    self.addInfoWindow = function(latitube, longitude, shouldCentreMap){
        var pos = new google.maps.LatLng(position.latitude, position.longitude);

        new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'Location has been found.'
        });

        if(shouldCentreMap){
            map.setCenter(pos);
        }
    }

    self.geoCode = function(address, success, failure){
       if(geocoder == null){
           geocoder = new google.maps.Geocoder();
       }
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == GEO_OK) {
                $log.info("Success "  + results.length)
                success(results);
            } else {
                $log.error('Geocode was not successful for the following reason: ' + status);
                failure( {code:status, reason: geocodeErrors[status]});
            }
        });
    }

    self.addMarkerWithInfoWindow = function(locationResult, shouldCentreMap){

        if ( alreadyAddedMarker(locationResult)){
            $log.error("Not adding, marker already found!")
        } else {

            var marker = new google.maps.Marker({
                map: map,
                position: locationResult.geometry.location,
                title: locationResult.formatted_address
            });
            self.currentMarkers.push(marker)

            var infoWindow = new google.maps.InfoWindow({
                content: "You visited " + locationResult.formatted_address
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
            });

            if(shouldCentreMap){
                map.setCenter(locationResult.geometry.location);
            }
            map.setZoom(5);
        }
    }

    self.removeMarker = function(index){
        self.currentMarkers[index].setMap(null);
        self.currentMarkers.splice(index, 1);
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

});
