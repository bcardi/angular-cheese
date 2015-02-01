///<reference path='../references.ts' />

angular.module('cheese')
    .directive('cheeseSearchField', function() {
        return {
            restrict: "E",
            templateUrl: 'lib/angular-cheese/dist/cheese/directives/search-field.html',
            replace: true,
            scope: {
                label: '@',
                model: '=',
                field: '@'
            }
        }
    });