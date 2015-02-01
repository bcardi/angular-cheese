///<reference path='../references.ts' />
/**
 * Created by Bob on 5/15/2014.
 */
/**
 * @area api
 * @module cheese
 * @ngdoc directive
 * @name cheeseEditableForm
 * @restrict E
 * @param {string} form-id Form ID.
 * @param {expression} cheese-show-editable If the expression is truthy, then the form will show in edit mode by default.
 * @param {expression} readonly If the expression is truthy, then the form will display in read only mode and the user will not be allowed to make changes.
 * @description
 * Extends the x-editable form. Provides standard layout and actions.
 */
angular.module('cheese')
    .directive('cheeseEditableForm', function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'lib/angular-cheese/dist/cheese/directives/editable-form.html',
            scope: {
                cheeseShowEditable: '&',
                formId: '@'
            },
            link: function (scope, element, attrs) {
                if (scope.formId && scope.formId != 'thisForm') {
                    scope.thisForm = scope[scope.formId];
                }
                var toggleEditableForm = function(value) {
                    "use strict";
                    var formId = scope.formId || 'thisForm';
                    var editableForm = scope[formId];
                    if (editableForm) {
                        if (angular.isDefined(value) && value) {
                            editableForm.$show();
                        } else {
                            editableForm.$cancel();
                        }
                    }
                }
                scope.$watch(scope.cheeseShowEditable, function (value) {
                    if (value) {
                        toggleEditableForm(value);
                    }
                }, true);
            }
        };
    });
