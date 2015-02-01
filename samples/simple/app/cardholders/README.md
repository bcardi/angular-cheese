## Todo: Add to app/index.ts

    ///<reference path='cardholders/index.ts' />

## Todo: Add to index.html

    <li ng-class="{ active: nc.isActive('/cardholders')}"><a href="#/cardholders">Cardholders</a></li>

## Todo: Add to the 'var app = angular.module' statement in app/app.ts

    'app.cardholders'

## Todo: Add to your routing statement in the app/app.ts file

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
    
## Todo: Layout list page in app/cardholders/list.html

## Todo: Layout detail page in app/cardholders/detail.html

## Todo: Update test spec test/cardholders//list-controller-spec.js
