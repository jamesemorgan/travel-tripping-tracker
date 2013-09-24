app.service('BrowserGeoService', function BrowserGeoService($rootScope, $log) {
    var self = this;

    var NOT_SUPPORTED = 99;
    var errors = {
        0: 'Unknown error',
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout',
        NOT_SUPPORTED: 'Browser Not Supported'
    };


    /*
     ## Property 	Description
     coords.latitude 	The latitude as a decimal number
     coords.longitude 	The longitude as a decimal number
     coords.accuracy 	The accuracy of position
     coords.altitude 	The altitude in meters above the mean sea level
     coords.altitudeAccuracy 	The altitude accuracy of position
     coords.heading 	The heading as degrees clockwise from North
     coords.speed 	The speed in meters per second
     timestamp 	The date/time of the response
     */

    self.onAttemptGeoLookup = function(callbackSuccess, callbackFailure) {

		if (navigator.geolocation) {

            $log.info("Looking up location");

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    $log.info("Location Found => Latitude: " + position.coords.latitude + " | Longitude: " + position.coords.longitude);
                    callbackSuccess(
                        {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            timestamp: new Date(position.timestamp).toLocaleString()
                        }
                    )
                },function(error) {
                    callbackFailure(
                        {
                            code: error.code,
                            reason: errors[error.code]
                        }
                    )
                },
                { enableHighAccuracy: false });
        } else {
			$log.warn("Geolocation is not supported by this browser.");
            callbackFailure({ code: NOT_SUPPORTED, reason: errors[NOT_SUPPORTED] });
		}
	}

});
