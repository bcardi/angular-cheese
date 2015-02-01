/**
 * Created by Bob on 7/14/2014.
 */
angular.module('cheese')
    .directive('cheeseSearchValues', [function () {
        "use strict";
        return {
            restrict: 'E',
            template: '<div ng-bind-html="searchText"></div>',
            scope: {
                searchModel: '=',
                labels: '=',
                noParens: '=',
                replaceValues: '=',
                order: '='
            },
            link: function (scope) {
                function processNode(prop) {

                }
                scope.$watch('searchModel', function (searchModel) {
                    if (searchModel) {
                        scope.searchText = "";
                        var delim = !scope.noParens ? "(" : "";

                        var clone = angular.copy(searchModel);
                        if (!!scope.order) {
                            for (var i = 0; i < scope.order.length; i++) {
                                var prop = scope.order[i];
                                if (!clone[prop]) continue;
                                var label = $("label[for='"+prop+"']").text() || (scope.labels?scope.labels[prop]:prop) || prop;
                                scope.searchText += delim + label + ": ";
                                if (clone[prop] && typeof clone[prop] === 'string') {
                                    scope.searchText += scope.replaceValues[searchModel[prop]] ? scope.replaceValues[clone[prop]] : clone[prop];
                                    delim = ", "
                                } else if (clone[prop] && typeof clone[prop] === 'object') {
                                    for (var key in clone[prop]) {
                                        scope.searchText += scope.replaceValues[key] ? scope.replaceValues[key] : key;
                                    }
                                }
                                delete clone[prop];
                            }
                        }
                        for (var prop in clone) {
                            var label = $("label[for='"+prop+"']").text() || (scope.labels?scope.labels[prop]:prop) || prop;
                            scope.searchText += delim + label + ": ";
                            if (clone[prop] && typeof clone[prop] === 'string') {
                                scope.searchText += scope.replaceValues[searchModel[prop]] ? scope.replaceValues[clone[prop]] : clone[prop];
                                delim = ", "
                            } else if (clone[prop] && typeof clone[prop] === 'object') {
                                for (var key in clone[prop]) {
                                    scope.searchText += scope.replaceValues[key] ? scope.replaceValues[key] : key;
                                }
                            }
                        }
                        if (scope.searchText) {
                            scope.searchText += !scope.noParens ? ")" : "";
                        }
                    }
                }, true);
            }
        };
    }]);