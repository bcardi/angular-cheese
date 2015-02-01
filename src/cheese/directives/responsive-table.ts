///<reference path='../references.ts' />
/**
 * Created by Dan Wnuk on 9/10/2014.
 */
/**
 * @area api
 * @module cheese
 * @ngdoc directive
 * @name cheeseResponsiveTable
 * @restrict E
 * @param {string} form-id Form ID.
 * @param {expression} items Array of objects to pull data from.
 * @param {expression} metadata List of fields to create rows for.
 * @param {expression} order The field you want to order by.
 * @param {expression} filter The field you want to filter by.
 * @description
 * Responsive table that will collapse into cards on smaller devices.
 */
angular.module('cheese')
    .directive('cheeseResponsiveTable', function() {
        var $this, fixedHeader;

        function resizeFixed() {
            fixedHeader.css('width', $this.outerWidth());
            fixedHeader.find("th").each(function (index) {
                $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
            });
        }

        return {
            restrict: "E",
            templateUrl: 'lib/angular-cheese/dist/cheese/directives/responsive-table.html',
            replace: true,
            scope: {
                items: '=',
                listFields: '=',
                searchModel: '=',
                allFields: '=',
                updatePath: '@',
                order: '@',
                filter: '=',
                show: '&',
                apply: '&'
            },
            controller: function($scope, Formatter, $http, $timeout, $sce, $filter) {
                $scope.$filter = $filter;
                $scope.drop = function (event, data, value) {
                    var listFields = $scope.listFields;
                    var dragIndex = -1,
                        dropIndex = -1;
                    for (var i = 0; i < listFields.length; i++) {
                        if (data === listFields[i].value) {
                            dragIndex = i;
                        } else if (value === listFields[i].value) {
                            dropIndex = i;
                        }
                    }
                    var dragNode = listFields.splice(dragIndex, 1);

                    listFields.splice(dropIndex, 0, dragNode[0]);

                    $scope.listFields = listFields;

                    var fields = [];
                    for (var x in $scope.listFields) {
                        fields.push($scope.listFields[x].value);
                    }
                    if ($scope.updatePathDefined) {
                        $http.post($scope.updatePath, {fields: fields});
                    }
                };

                function getProperty(obj, value) {
                    if (value) {
                        var arr = value.split(".");
                        while (arr.length && (obj = obj[arr.shift()]));
                    }
                    return obj;
                }

                $scope.format = function (fieldInfo, item) {
                    var value:any;
                    if (fieldInfo.value) {
                        value = getProperty(item, fieldInfo.value);
                        if (value instanceof Array) {
                            value = value.join(', ');
                        }
                        if (fieldInfo.values) {
                            var key = fieldInfo.values.key;
                            if (key && fieldInfo.values[getProperty(item, key)]) {
                                value = fieldInfo.values[getProperty(item, key)][value];
                            } else if (fieldInfo.values[value]) {
                                value = fieldInfo.values[value];
                            }
                        }
                        value = '' + Formatter.format(fieldInfo.type, fieldInfo.format, value);
                    }
                    if (fieldInfo.filter) {
                        value = $scope.$filter(fieldInfo.filter)(value, item);
                    }
                    return $sce.trustAsHtml(value === 'undefined' ? '' : value);
                };

                $scope.class = function (fieldInfo, value) {
                    return Formatter.formatClass(fieldInfo.type, value);
                };

                $scope.isSelected = function (value) {
                    for (var i = 0; i < $scope.listFields.length; i++) {
                        if ($scope.listFields[i].value === value) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.updateSelected = function (fieldsOrdered) {
                    var listFields = [];
                    for (var i = 0; i < fieldsOrdered.length; i++) {
                        var fieldDefinition = _.find($scope.allFields, {value: fieldsOrdered[i]});
                        listFields.push(angular.copy(fieldDefinition));
                    }
                    $scope.listFields = listFields;
                };

                $scope.updateColumns = function () {
                    var fields = [];
                    for (var x in $scope.fields) {
                        if ($scope.fields[x].checked) {
                            fields.push($scope.fields[x].value);
                        }
                    }
                    var fieldsOrdered = [];
                    for (var i = 0; i < $scope.listFields.length; i++) {
                        if (fields.indexOf($scope.listFields[i].value) > -1) {
                            fieldsOrdered.push($scope.listFields[i].value);
                        }
                    }
                    for (i = 0; i < fields.length; i++) {
                        if (fieldsOrdered.indexOf(fields[i]) == -1) {
                            fieldsOrdered.push(fields[i]);
                        }
                    }

                    $http.post($scope.updatePath, {fields: fieldsOrdered}).success(() => {
                        $scope.updateSelected(fieldsOrdered);
                    });
                };

                $scope.fields = [];
                $scope.searchFields = [];

                if (!!$scope.allFields) {
                    for (var i = 0; i < $scope.allFields.length; i++) {
                        $scope.fields.push({
                            label: $scope.allFields[i].label,
                            value: $scope.allFields[i].value,
                            checked: $scope.isSelected($scope.allFields[i].value)
                        });
                        if ($scope.allFields[i].searchable) {
                            $scope.searchFields.push($scope.allFields[i]);
                        }
                    }
            }
            },
            link: function(scope, element, attrs) {
                scope.search = !!attrs.searchModel;
                scope.allowColumnSelection = !!attrs.allFields;
                scope.updatePathDefined = !!attrs.updatePath;

                fixedHeader = element.find('table').eq(1);
                $this = element.find('table').eq(0);

                scope.$parent.$on('onRepeatLast', function() {
                    function scrollFixed() {
                        // the table isn't currently drawn - don't do anything
                        if ($this.height() == 0) return;

                        var offset = $(this).scrollTop(),
                            tableOffsetTop = $this.offset().top,
                            tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
                        if (offset < tableOffsetTop || offset > tableOffsetBottom)
                            fixedHeader.hide();
                        else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && fixedHeader.is(":hidden"))
                            fixedHeader.show();
                    }

                    $(window).resize(resizeFixed);
                    $(window).scroll(scrollFixed);
                    resizeFixed();
                });
            }
        }
    });

angular.module('cheese')
    .directive('repeatLast', function($timeout) {
        return function(scope, element, attrs) {
            if (scope.$last) {
                $timeout(function(){
                    scope.$parent.$emit('onRepeatLast', element, attrs);
                });
            }
        };
    });