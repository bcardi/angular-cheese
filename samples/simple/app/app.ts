///<reference path='index.ts' />
///<reference path='references.ts' />

/*
 Todo: Set all @@ values
 */

var app = angular.module('simpleApp',[
    'ui.bootstrap',
    'xeditable',
    'ngRoute',
    'cheese',
    'app.cardholders',
    'ui.router',
])
    .config(["$routeProvider", "$locationProvider",
        function ($routeProvider, $locationProvider) {

            //commenting out this line (switching to hashbang mode) breaks the app
            //-- unless # is added to the templates
            //$locationProvider.html5Mode(true);

            $routeProvider
                .when('/cardholders/new', {
                    templateUrl: 'app/cardholders/detail.html',
                    controller: 'CardholdersNewController',
                    controllerAs: "dc"
                })
                .when('/cardholders/:id', {
                    templateUrl: 'app/cardholders/detail.html',
                    controller: 'CardholdersEditController',
                    controllerAs: "dc"
                })
                .when('/cardholders', {
                    templateUrl: 'app/cardholders/list.html',
                    controller: 'CardholdersListController',
                    controllerAs: "dc"
                })
                .when('/', {
                    templateUrl: 'app/home.html'
                })
        }])
    ;

app.run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
