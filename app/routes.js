// Dependencies
var mongoose        = require('mongoose');
var Location        = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all locations in the db
    app.get('/locations', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Location.find({});
        query.exec(function(err, locations){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all locations
            res.json(locations);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new locations in the db
    app.post('/locations', function(req, res){

        // Creates a new location based on the Mongoose schema and the post body
        var newlocation = new Location(req.body);

        // New Location is saved in the db.
        newlocation.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new location
            res.json(req.body);
        });
    });

    // Retrieves JSON records for all locations who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        console.log(req.body);

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var pokestop        = req.body.pokestop;
        var pokegym         = req.body.pokegym;
        var reqVerified     = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Location.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }

        // ...include filter by Location Type
        if(pokestop|| pokegym){
            query.or([{ 'gender': pokestop }, { 'gender': pokegym }]);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, locations){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of all locations that meet the criteria
            res.json(locations);
        });
    });
}    