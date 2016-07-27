
// Declares the initial angular module "victoryRoadApp". Module grabs other controllers and services.
var app = angular.module('victoryRoadApp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Add a Location Control Panel
        $routeProvider.when('/add', {
            controller: 'addCtrl',
            templateUrl: 'partials/addForm.html',

        // Filter Locations Control Panel
        }).when('/find', {
        	controller: 'queryCtrl',
            templateUrl: 'partials/queryForm.html',


        // All else forward to the Add Location Control Panel
        }).otherwise({redirectTo:'/add'})
    });