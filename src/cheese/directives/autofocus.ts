///<reference path='../references.ts' />

/**
 * Created by Bob on 5/5/2014.
 */

/**
 * @area api
 * @module cheese
 * @ngdoc directive
 * @name cheeseAutofocus
 * @element input
 * @restrict A
 * @param {expression} cheeseAutofocus If the expression is truthy, then the control will gain focus when the view is ready.
 * @description
 * Helper directive to place focus on the first form field. If multiple fields are marked with this attribute, then focus
 * will be placed on the first field.
 */
angular.module('cheese')
    .directive('cheeseAutofocus', ['$timeout', function ($timeout) {
        "use strict";
        /* hello world from milwaukee */
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.cheeseAutofocus, function (value) {
                    if (angular.isDefined(value) && value) {
                        element[0].focus();
                        element[0].select();
                    }
                }, true);
            }
        };
    }]);