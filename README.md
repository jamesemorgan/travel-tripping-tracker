Travel Tripping Tracker
===============

Simple little project which allows you to create a custom map of your travels.

The goal is to allow the markers to be joined with different modes of transport to highlight the route you may have taken when travelling or tripping around the world!

This project is simply a learning tool after travelling for 6 months myself.

The application is small and not polished, the more time I have and the more I learn the nicer it will look.

If you cant use it locally i.e. file:/// then try this:

1. Open a console in the project directory.
2. Install python if you dont have it installed already and run

        'python -m SimpleHTTPServer'

3. Navigate to http://localhost:8080 and you should get server index.html

## Built With

* AngularJS v1.2.0-rc.2
* Google Maps API V3


### TODO (If I get time and have enough interest)

* Change GeoCode look ups to use promises to remove callbacks!
* Look at Dropbox data store API to hold previous maps?
* Change colour of lines for every country
* Add ability to quickly lookup our route!
* Add input masks to input fields
* Add tooltips where necessary
* Add icons to lines
* Ability to animate route

* Add tooltips/mouse overs -> http://www.geocodezip.com/v3_SO_directionsWithTooltip.html
* Many markers -> http://www.geocodezip.com/v3_polyline_example_kmmarkers_0.html
* Investigate usage of OpenStreetMap http://www.openstreetmap.org

![Image](screenshots/current-look.png?raw=true)
