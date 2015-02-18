///<reference path='typings/angularjs/angular.d.ts' />
///<reference path='typings/lodash/lodash.d.ts' /> 
///<reference path='references.ts' />
/**
 * Created by Bob on 5/23/2014.
 */ /**
* @ngdoc module
* @name cheese
* @description
*
* # cheese (core module)
* The cheese module ????
*
* <div doc-module-components="cheese"></div>
*/
angular.module('cheese', ['ngResource', 'angularMoment', 'ang-drag-drop']).provider('ApplicationConfig', function () {
    // esBasePath = http://localhost:9200/ipp/
    this.config = {
        'apiBasePath': '',
        'esBasePath': '',
        'couchDBBasePath': ''
    };
    this.$get = function () {
        var config = this.config;
        return config;
    };
    this.setConfig = function (config) {
        this.config = config;
    };
});
/**
 * Created by Bob on 5/17/2014.
 */
var filters = angular.module('cheese');
filters.filter('booleanAsYesNo', function () {
    return function (input) {
        return input ? 'Yes' : 'No';
    };
}).filter('metadata', function () {
    return function (value, fieldInfo) {
        if (fieldInfo && fieldInfo[value]) {
            value = fieldInfo[value];
        }
        return value;
    };
}).filter('time', function ($filter) {
    return function (value) {
        if (value.length == 6) {
            var hours = parseInt(value.substring(0, 2));
            var minutes = parseInt(value.substring(2, 4));
            var seconds = parseInt(value.substring(4, 6));
            var date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            value = $filter('date')(date, 'h:mma');
        }
        return value;
    };
}).filter('choiceGroup', function () {
    return function (value, fieldInfo, descriptionOnly, key) {
        if (fieldInfo && fieldInfo[value]) {
            if (typeof fieldInfo[value] === 'object' && typeof key !== 'undefined') {
                if (typeof descriptionOnly !== 'undefined' && descriptionOnly) {
                    value = fieldInfo[value][key];
                }
                else {
                    value = (value.trim() ? value + ' - ' : '') + fieldInfo[value][key];
                }
            }
            else {
                if (typeof descriptionOnly !== 'undefined' && descriptionOnly) {
                    value = fieldInfo[value];
                }
                else {
                    value = (value.trim() ? value + ' - ' : '') + fieldInfo[value];
                }
            }
        }
        return value;
    };
}).filter('earningsType', function ($filter) {
    return function (value, earningsType) {
        if (!value)
            value = 0;
        if (earningsType == 'CASH') {
            return $filter('currency')(value, '$', 2);
        }
        else {
            return $filter('number')(value, 0);
        }
    };
}).filter('emptyAsNA', function () {
    return function (value) {
        return (!value || (typeof value === 'string' && value.trim().length == 0) ? 'N/A' : value);
    };
}).filter('phone', function () {
    return function (value) {
        return typeof value === 'string' && value.trim().length == 10 ? value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10) : value;
    };
}).filter('titlecase', function () {
    return function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    };
}).filter('tileTemplate', function ($templateCache) {
    return function (input, object) {
        if (object.expanded) {
            var detailTemplate = object.template.replace('.html', '-detail.html');
            if ($templateCache.get(detailTemplate) != null) {
                return detailTemplate;
            }
        }
        return object.template;
    };
});
///<reference path='filters.ts' /> 
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
angular.module('cheese').directive('cheeseAutofocus', ['$timeout', function ($timeout) {
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
angular.module('cheese').directive('cheeseEditableForm', function () {
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
            var toggleEditableForm = function (value) {
                "use strict";
                var formId = scope.formId || 'thisForm';
                var editableForm = scope[formId];
                if (editableForm) {
                    if (angular.isDefined(value) && value) {
                        editableForm.$show();
                    }
                    else {
                        editableForm.$cancel();
                    }
                }
            };
            scope.$watch(scope.cheeseShowEditable, function (value) {
                if (value) {
                    toggleEditableForm(value);
                }
            }, true);
        }
    };
});
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/5/2014.
 */
angular.module('cheese').directive('cheeseShowEditableForm', ['$timeout', function ($timeout) {
    "use strict";
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.cheeseShowEditableForm, function (value, element) {
                if (angular.isDefined(value) && value) {
                    var editableForm = scope.$eval(attrs.cheeseEditableForm);
                    editableForm.$show();
                }
                else {
                    editableForm.$cancel();
                }
            }, true);
        }
    };
}]);
/**
 * Created by Bob on 7/14/2014.
 */
angular.module('cheese').directive('cheeseSearchValues', [function () {
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
                            if (!clone[prop])
                                continue;
                            var label = $("label[for='" + prop + "']").text() || (scope.labels ? scope.labels[prop] : prop) || prop;
                            scope.searchText += delim + label + ": ";
                            if (clone[prop] && typeof clone[prop] === 'string') {
                                scope.searchText += scope.replaceValues[searchModel[prop]] ? scope.replaceValues[clone[prop]] : clone[prop];
                                delim = ", ";
                            }
                            else if (clone[prop] && typeof clone[prop] === 'object') {
                                for (var key in clone[prop]) {
                                    scope.searchText += scope.replaceValues[key] ? scope.replaceValues[key] : key;
                                }
                            }
                            delete clone[prop];
                        }
                    }
                    for (var prop in clone) {
                        var label = $("label[for='" + prop + "']").text() || (scope.labels ? scope.labels[prop] : prop) || prop;
                        scope.searchText += delim + label + ": ";
                        if (clone[prop] && typeof clone[prop] === 'string') {
                            scope.searchText += scope.replaceValues[searchModel[prop]] ? scope.replaceValues[clone[prop]] : clone[prop];
                            delim = ", ";
                        }
                        else if (clone[prop] && typeof clone[prop] === 'object') {
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
angular.module('cheese').directive('cheeseResponsiveTable', function () {
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
        controller: function ($scope, Formatter, $http, $timeout, $sce, $filter) {
            $scope.$filter = $filter;
            $scope.drop = function (event, data, value) {
                var listFields = $scope.listFields;
                var dragIndex = -1, dropIndex = -1;
                for (var i = 0; i < listFields.length; i++) {
                    if (data === listFields[i].value) {
                        dragIndex = i;
                    }
                    else if (value === listFields[i].value) {
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
                    $http.post($scope.updatePath, { fields: fields });
                }
            };
            function getProperty(obj, value) {
                if (value) {
                    var arr = value.split(".");
                    while (arr.length && (obj = obj[arr.shift()]))
                        ;
                }
                return obj;
            }
            $scope.format = function (fieldInfo, item) {
                var value;
                if (fieldInfo.value) {
                    value = getProperty(item, fieldInfo.value);
                    if (value instanceof Array) {
                        value = value.join(', ');
                    }
                    if (fieldInfo.values) {
                        var key = fieldInfo.values.key;
                        if (key && fieldInfo.values[getProperty(item, key)]) {
                            value = fieldInfo.values[getProperty(item, key)][value];
                        }
                        else if (fieldInfo.values[value]) {
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
                    var fieldDefinition = _.find($scope.allFields, { value: fieldsOrdered[i] });
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
                $http.post($scope.updatePath, { fields: fieldsOrdered }).success(function () {
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
        link: function (scope, element, attrs) {
            scope.search = !!attrs.searchModel;
            scope.allowColumnSelection = !!attrs.allFields;
            scope.updatePathDefined = !!attrs.updatePath;
            fixedHeader = element.find('table').eq(1);
            $this = element.find('table').eq(0);
            scope.$parent.$on('onRepeatLast', function () {
                function scrollFixed() {
                    // the table isn't currently drawn - don't do anything
                    if ($this.height() == 0)
                        return;
                    var offset = $(this).scrollTop(), tableOffsetTop = $this.offset().top, tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
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
    };
});
angular.module('cheese').directive('repeatLast', function ($timeout) {
    return function (scope, element, attrs) {
        if (scope.$last) {
            $timeout(function () {
                scope.$parent.$emit('onRepeatLast', element, attrs);
            });
        }
    };
});
///<reference path='../references.ts' />
angular.module('cheese').directive('cheeseSearchField', function () {
    return {
        restrict: "E",
        templateUrl: 'lib/angular-cheese/dist/cheese/directives/search-field.html',
        replace: true,
        scope: {
            label: '@',
            model: '=',
            field: '@'
        }
    };
});
///<reference path='../references.ts' />
angular.module('cheese').directive('cheeseTileContainer', function () {
    return {
        restrict: "E",
        templateUrl: 'lib/angular-cheese/dist/cheese/directives/tile-container.html',
        replace: true,
        scope: {
            tiles: '=',
            layout: '=',
            defaultState: '=',
            templatePaths: '=',
            dc: '='
        },
        controller: function ($scope, PageInfo, $state, $stateParams, $templateCache, $rootScope, cheeseTileService) {
            $scope.maximizedTiles = [];
            for (var tile in this.tiles) {
                tile.expanded = false;
            }
            var tilesUnexpanded = false;
            $scope.$watch('tiles', function (newValue) {
                if (!tilesUnexpanded && newValue) {
                    for (var key in newValue) {
                        newValue[key].expanded = false;
                    }
                    tilesUnexpanded = true;
                }
            });
            $scope.isArrangeTilesMode = function () {
                return cheeseTileService.arrangeTilesMode;
            };
            $scope.drop = function (event, data, child) {
                // data is the tile ID - it wlil go and remove the tile from whereever it previously was
                // and then add it to the child drop location
                $scope.removeTile($scope.layout, data);
                if (!child.tiles) {
                    child.tiles = [data];
                }
                else {
                    child.tiles.push(data);
                }
            };
            $scope.dropNew = function (event, data, location) {
                $scope.removeTile($scope.layout, data);
                var child = {
                    css: 'row',
                    children: [
                        {
                            css: 'col-' + $scope.getCurrentWindowSize() + '-12',
                            tiles: [data]
                        }
                    ]
                };
                if (location == 'top') {
                    $scope.layout.children.splice(0, 0, child);
                }
                else if (location == 'bottom') {
                    $scope.layout.children.push(child);
                }
            };
            $scope.dropTile = function (event, data, child, index, location) {
                $scope.removeTile($scope.layout, data);
                if (location == 'top') {
                    child.tiles.splice(index, 0, data);
                }
                else if (location == 'bottom') {
                    child.tiles.splice(index + 1, 0, data);
                }
            };
            $scope.split = function (child, event) {
                var currentColumns = $scope.getCurrentColumns(child.css);
                var newChild1 = {
                    css: 'col-' + $scope.getCurrentWindowSize() + '-' + Math.floor(currentColumns / 2),
                    tiles: [
                    ]
                };
                var newChild2 = {
                    css: 'col-' + $scope.getCurrentWindowSize() + '-' + Math.ceil(currentColumns / 2),
                    children: child.children,
                    tiles: child.tiles
                };
                $scope.removeChild($scope.layout, child, [newChild2, newChild1]);
                event.preventDefault();
            };
            $scope.delete = function (child, event) {
                $scope.removeChild($scope.layout, child);
                event.preventDefault();
            };
            $scope.removeTile = function (object, tileId) {
                var removed = false;
                if (object.tiles) {
                    var length = object.tiles.length;
                    object.tiles = _.filter(object.tiles, function (tile) {
                        return !(tile === tileId);
                    });
                    if (length > object.tiles.length) {
                        removed = true;
                    }
                }
                if (!removed && object.children) {
                    for (var j = 0; j < object.children.length; j++) {
                        $scope.removeTile(object.children[j], tileId);
                    }
                }
            };
            $scope.removeChild = function (object, child) {
                var removed = false;
                if (object.children) {
                    var length = object.children.length;
                    var index = object.children.indexOf(child);
                    object.children = _.filter(object.children, function (c) {
                        return !(child === c);
                    });
                    if (length > object.children.length) {
                        removed = true;
                        if (index > -1 && arguments.length > 2 && arguments[2] != null) {
                            object.children.splice.apply(object.children, [index, 0].concat(arguments[2]));
                        }
                    }
                }
                if (!removed && object.children) {
                    for (var j = 0; j < object.children.length; j++) {
                        $scope.removeChild(object.children[j], child, arguments[2]);
                    }
                }
            };
            $rootScope.$on('ANGULAR_DRAG_START', function ($event, $channel) {
                if ($channel == 'tile') {
                    $scope.$apply(function () {
                        cheeseTileService.arrangeTilesMode = true;
                        $scope.dragging = true;
                    });
                }
            });
            $rootScope.$on('ANGULAR_DRAG_END', function ($event, $channel) {
                if ($channel == 'tile') {
                    $scope.$apply(function () {
                        $scope.dragging = false;
                    });
                }
            });
            var hovered;
            $scope.enter = function (child, $event) {
                if (!$scope.isArrangeTilesMode() || !$scope.dragging)
                    return;
                child.hovered = true;
                if (hovered != null && hovered != child) {
                    hovered.hovered = false;
                }
                hovered = child;
                if ($event.pageX - $($event.currentTarget).offset().left > ($event.currentTarget.clientWidth / 2)) {
                    child.hoveredPast50 = true;
                }
                else {
                    child.hoveredPast50 = false;
                }
                $event.stopPropagation();
            };
            $scope.leave = function (child, $event) {
                if (!$scope.isArrangeTilesMode() || !$scope.dragging)
                    return;
                child.hovered = false;
                child.hoveredPast50 = false;
                hovered = null;
                $event.stopPropagation();
                $(document).off('mousemove');
            };
            $scope.getCurrentWindowSize = function () {
                var width = $(window).width();
                var size;
                if (width >= 1200) {
                    size = 'lg';
                }
                else if (width < 1200 && width >= 992) {
                    size = 'md';
                }
                else if (width < 992 && width >= 768) {
                    size = 'sm';
                }
                else {
                    size = 'xs';
                }
                return size;
            };
            $scope.getTemplatePath = function (tileId) {
                var tile = $scope.tiles[tileId];
                var resolvedTemplate;
                for (var i = 0; i < $scope.templatePaths.length; i++) {
                    var template = $scope.templatePaths[i] + (tile.template ? tile.template : tileId) + '.html';
                    if (tile.expanded) {
                        var detailTemplate = template.replace('.html', '-detail.html');
                        if ($templateCache.get(detailTemplate) != null) {
                            resolvedTemplate = detailTemplate;
                            break;
                        }
                    }
                    if ($templateCache.get(template) != null) {
                        resolvedTemplate = template;
                        break;
                    }
                }
                return resolvedTemplate;
            };
            $scope.minimize = function (tileId) {
                var tile = $scope.tiles[tileId];
                tile.expanded = false;
                var tileTemplate = tile.template ? tile.template : tileId;
                $scope.maximizedTiles = _.filter($scope.maximizedTiles, function (object) {
                    return !(($scope.tiles[object].template ? $scope.tiles[object].template : object) == tileTemplate);
                });
                if ($scope.defaultState != $state.current.name) {
                    $state.go($scope.defaultState, $stateParams);
                }
            };
            $scope.maximize = function (tileId) {
                var tile = $scope.tiles[tileId];
                tile.expanded = true;
                $scope.maximizedTiles.push(tileId);
                if (tile.state) {
                    $state.go(tile.state, $stateParams);
                    findActiveState(tile.state);
                }
            };
            $scope.getMaximizedClass = function (tileId) {
                var tile = $scope.tiles[tileId];
                if ($scope.maximizedTiles.length > 1 && tile.options && tile.options.maximizeClass != null) {
                    return tile.options.maximizeClass;
                }
                else {
                    return "col-lg-12 col-md-12 col-xs-12";
                }
            };
            $scope.containsBootstrapColumns = function (css) {
                if (css.indexOf('col-') == 0) {
                    return true;
                }
                return false;
            };
            $scope.isNotOneColumn = function (css) {
                return $scope.getCurrentColumns() != 1;
            };
            $scope.getCurrentColumns = function (css) {
                var getLG = new RegExp('col\\-' + $scope.getCurrentWindowSize() + '\\-(\\d\\d?)');
                if (!getLG.test(css)) {
                    return '12';
                }
                return getLG.exec(css)[1];
            };
            function findActiveState(state) {
                for (var tileId in $scope.tiles) {
                    var tile = $scope.tiles[tileId];
                    if (tile.state === state && !tile.expanded) {
                        tile.expanded = true;
                        $scope.maximizedTiles.push(tileId);
                    }
                }
            }
            if ($state.current.name != $scope.defaultState) {
                findActiveState($state.current.name);
            }
        }
    };
}).directive('cheeseTile', function () {
    return {
        restrict: "E",
        templateUrl: 'lib/angular-cheese/dist/cheese/directives/tile.html',
        replace: true,
        scope: {
            title: '@',
            template: '@',
            dc: '=',
            maximize: '&',
            minimize: '&',
            expanded: '=',
            options: '=',
            tileId: '@'
        },
        controller: function ($scope, $element, $interpolate) {
            $scope.$on('$includeContentLoaded', function () {
                if ($element.find('title').length == 1) {
                    var title = $element.find('title')[0].innerHTML;
                    // only add a watch if the title contains an angular expression
                    if (title.indexOf('{') > -1) {
                        $scope.$watch(function () {
                            return $element.find('title')[0].innerHTML;
                        }, function (data) {
                            $scope.title = data;
                        });
                    }
                    else {
                        $scope.title = title;
                    }
                }
            });
            $scope.isVisible = function () {
                return $scope.options.show ? $interpolate('{{' + $scope.options.show + '}}')($scope) === 'true' : true;
            };
            $scope.isMaximizeEnabled = function () {
                if (typeof $scope.options !== 'undefined' && typeof $scope.options.maximize !== 'undefined') {
                    return $scope.options.maximize;
                }
                return true;
            };
            $scope.isCollapseEnabled = function (isExpanded) {
                if (isExpanded) {
                    return false;
                }
                if (typeof $scope.options !== 'undefined' && typeof $scope.options.collapse !== 'undefined') {
                    return $scope.options.collapse;
                }
                return true;
            };
            $scope.toggle = function ($event) {
                $event.preventDefault();
                $scope.expanded = !$scope.expanded;
            };
        },
        compile: function (element, attrs) {
            if (!attrs.noBackground)
                attrs.noBackground = false;
            if (!attrs.expanded)
                attrs.expanded = false;
        }
    };
}).service('cheeseTileService', function () {
    this.arrangeTilesMode = false;
}).directive('cheeseTileResizer', function ($document) {
    return {
        restrict: "E",
        template: '<div style="position: absolute; right: 0px; top: 0px; height: 100%; width: 10px; cursor: ew-resize">&nbsp;</div>',
        replace: true,
        scope: {
            child: '='
        },
        link: function ($scope, $element, $attrs) {
            $element.on('mousedown', function (event) {
                event.preventDefault();
                $document.on('mouseup', mouseup);
            });
            function mouseup() {
                $document.unbind('mouseup', mouseup);
                var windowSize = $scope.$parent.getCurrentWindowSize();
                var currentColumns = $scope.$parent.getCurrentColumns($scope.child.css);
                var widthPerColumn = $element.parent().width() / currentColumns;
                var numberOfColumnsResized = Math.round((event.clientX - $element.parent().offset().left) / widthPerColumn);
                if (numberOfColumnsResized > 12)
                    numberOfColumnsResized = 12;
                if (numberOfColumnsResized < 1)
                    numberOfColumnsResized = 1;
                if (currentColumns != numberOfColumnsResized) {
                    $scope.child.css = $scope.child.css.replace('col-' + windowSize + '-' + currentColumns, 'col-' + windowSize + '-' + numberOfColumnsResized);
                }
            }
        }
    };
});
///<reference path='autofocus.ts' />
///<reference path='editable-form.ts' />
///<reference path='show-editable-form.ts' />
///<reference path='search-values.ts' />
///<reference path='responsive-table.ts' />
///<reference path='search-field.ts' />
///<reference path='tiles.ts' /> 
/**
 * Created by e1040222 on 10/6/2014.
 */
angular.module('cheese').constant('Formats', {
    DATE: 'date',
    CIRCLE: 'circle',
    AMOUNT: 'amount'
}).service('Formatter', ["Formats", "moment", function (Formats, moment) {
    var pad = function (value) {
        if (new String(value).length == 1) {
            return '0' + value;
        }
        return value;
    };
    return {
        format: function (type, format, data) {
            if (!type || !data)
                return data;
            if (type === Formats.DATE && !!format) {
                var date = moment.utc(data).toDate();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                switch (format) {
                    case 'yyyy-mm-dd':
                        data = year + '-' + pad(month) + '-' + pad(day);
                        break;
                    case 'mm/dd/yyyy':
                        data = pad(month) + '/' + pad(day) + '/' + year;
                        break;
                }
            }
            else if (type === Formats.CIRCLE) {
                return data.substring(0, 1).toUpperCase();
            }
            else if (type === Formats.AMOUNT) {
                if (data) {
                    if (typeof data === 'string') {
                        data = parseFloat(data);
                    }
                    if (typeof data === 'number') {
                        data = (data < 100 ? data * 100 : data);
                        data = '' + data.toFixed(2);
                        var temp = data.split('.')[0];
                        var decimal = data.split('.')[1];
                        data = '';
                        if (temp.length > 3) {
                            var i = temp.length - 3;
                            for (; i >= 0; i = i - 3) {
                                data = (i > 0 ? ',' : '') + temp.substring(i, i + 3) + data;
                            }
                        }
                        data = temp.substring(0, temp.length % 3 == 0 ? 3 : temp.length % 3) + data;
                        data = '$' + data + '.' + decimal;
                    }
                }
            }
            return data;
        },
        formatClass: function (type, data) {
            if (!type || !data)
                return data;
            switch (type) {
                case Formats.CIRCLE:
                    switch (data.toUpperCase()) {
                        case 'LOYALTY':
                            data = 'red';
                            break;
                        case 'CREDIT':
                            data = 'blue';
                            break;
                        case 'DEBIT':
                            data = 'green';
                            break;
                    }
                    break;
            }
            return data;
        }
    };
}]);
var PageInfo = (function () {
    function PageInfo() {
    }
    PageInfo.prototype.setTitle = function (title) {
        this.title = title;
    };
    return PageInfo;
})();
angular.module('cheese').service('PageInfo', PageInfo);
///<reference path='i-metadata-service.ts' />
///<reference path='i-resource-service.ts' />
///<reference path='i-auth-service.ts' />
///<reference path='formatter-service.ts' />
///<reference path='page-info-service.ts' /> 
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/5/2014.
 */
/**
 * @area api
 * @module cheese
 * @ngdoc type
 * @name BaseController
 * @param {object} context ????.
 * @description
 * ????
 */
var BaseController = (function () {
    function BaseController($injector, context) {
        var _this = this;
        this.resetFocus = true;
        this.isModelLoaded = false;
        this.showEditable = false;
        this.isReadonly = true;
        this.viewModel = {};
        this.searchModel = {};
        this.metadataBase = { "form": { "tabs": {}, "sections": {} } };
        this.metadata = {};
        this.messages = "";
        this.primaryGridOptions = {};
        this.autoLoad = false;
        this.pathFields = ["this.context.resourceName", "item.id"];
        this.activeTab = 0;
        "use strict";
        this.$injector = $injector;
        this.context = context;
        this.setPageTitle(this.getDefaultPageTitle());
        // Load required angular references
        var ngRefs = _.union(['$location', '$state', '$stateParams', 'Formatter'], this.context.ngRefs);
        this.ng = {};
        _.forEach(ngRefs, function (item) { return _this.ng[item] = $injector.get(item); });
        if (_.size(this.getParameters()) > 0) {
            this.autoLoad = true;
            this.context.resourceService.setParameters(this.getParameters());
        }
        this.init();
        //this.refreshMetadata({});
        this.loadData();
    }
    BaseController.prototype.clearSearchModel = function () {
        this.searchModel = {};
    };
    BaseController.addNgRef = function (context, item) {
        if (!context.ngRefs) {
            context.ngRefs = [];
        }
        context.ngRefs.push(item);
    };
    BaseController.prototype.getActiveTab = function () {
        if (this.activeTab < 0)
            this.activeTab = 0;
        return this.activeTab;
    };
    BaseController.prototype.init = function () {
        "use strict";
    };
    BaseController.prototype.loadData = function () {
        "use strict";
        this.getFormMetadata();
    };
    BaseController.prototype.getFormMetadata = function () {
        "use strict";
        var _this = this;
        var cachedMetadata = {};
        try {
            cachedMetadata = this.context.resourceService.metadata[this.context.formTag];
        }
        catch (e) {
        }
        if (_.isEmpty(cachedMetadata)) {
            this.context.metadataService.get({ resourceName: this.context.resourceName, formTag: this.context.formTag }).then(function (result) { return _this.onGetFormMetadataSuccess(result); }).catch(function (result) { return _this.onGetFormMetadataError(result); });
        }
        else {
            this.onGetFormMetadataSuccess(cachedMetadata);
        }
    };
    BaseController.prototype.onGetFormMetadataSuccess = function (result) {
        "use strict";
        _.merge(this.metadataBase, result);
        this.metadata = {};
        this.refreshMetadata({});
        this.getData();
    };
    BaseController.prototype.isTrue = function (value, defaultValue) {
        "use strict";
        return (value === undefined) ? defaultValue : value;
    };
    BaseController.prototype.collapseAll = function () {
        "use strict";
        var _this = this;
        //var _this = this;
        Object.keys(this.metadata.form.sections).forEach(function (sectionKey) {
            var section = _this.metadata.form.sections[sectionKey];
            section.isOpen = false;
        });
    };
    BaseController.prototype.expandAll = function () {
        "use strict";
        var _this = this;
        //var _this = this;
        Object.keys(this.metadata.form.sections).forEach(function (sectionKey) {
            var section = _this.metadata.form.sections[sectionKey];
            section.isOpen = true;
        });
    };
    BaseController.prototype.onGetFormMetadataError = function (result) {
        "use strict";
        console.log('onGetFormMetadataError');
        this.getData();
    };
    BaseController.prototype.getData = function () {
        "use strict";
    };
    /*
        getChoiceGroups(){
            "use strict";
            this.context.resourceService
                .getList({resourceName: 'choice-groups'})
                .then((result) => this.onGetChoiceGroupsSuccess(result))
                .catch((result) => this.onGetChoiceGroupsError(result));
        }
    
        onGetChoiceGroupsSuccess(result) {
            "use strict";
            this.choiceGroups = {};
            for(var i=0,len=result.length;i<len;i++){
                this.choiceGroups[result[i].key] = result[i].value;
            }
        }
    
        onGetChoiceGroupsError(result) {
            "use strict";
            this.messages = 'Error'
        }
    */
    BaseController.prototype.getList = function () {
        "use strict";
        var _this = this;
        this.viewModel = [];
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.context.resourceService.getList({ resourceName: this.context.resourceName, searchModel: this.searchModel }).then(function (result) { return _this.onGetListSuccess(result); }).catch(function (result) { return _this.onGetListError(result); });
    };
    BaseController.prototype.onGetListSuccess = function (result) {
        "use strict";
        this.messages = 'Success';
        this.context.resourceService.items = result;
        this.context.resourceService.searchModel = _.cloneDeep(this.searchModel);
        this.context.resourceService.getListTime = Date.now();
        this.context.resourceService.searchFilter = "";
        this.viewModel = this.context.resourceService.items;
        this.resetFocus = true;
        this.isModelLoaded = false;
        try {
            this.metadata.form.sections.search.isOpen = false;
        }
        catch (e) {
        }
        this.primaryGridOptions = { data: '[{"a":"1", "b":2}]' };
    };
    BaseController.prototype.onGetListError = function (result) {
        "use strict";
        this.messages = 'Error';
    };
    BaseController.prototype.createItem = function (item) {
        "use strict";
        var _this = this;
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.showEditable = false;
        this.isReadonly = true;
        this.context.resourceService.createItem({ resourceName: this.context.resourceName }, item).then(function (item) { return _this.onCreateSuccess(item); }).catch(function (item) { return _this.onCreateError(item); });
    };
    BaseController.prototype.onCreateSuccess = function (result) {
        "use strict";
        this.messages = 'Success';
        this.isModelLoaded = false;
        this.showEditable = true;
        this.isReadonly = false;
        //this.context.$location.path(this.context.resourceName);
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
    };
    BaseController.prototype.onCreateError = function (result) {
        "use strict";
        this.messages = 'Error';
        this.resetFocus = true;
    };
    BaseController.prototype.getProperty = function (obj, value) {
        var arr = value.split(".");
        while (arr.length && (obj = obj[arr.shift()]))
            ;
        return obj;
    };
    BaseController.prototype.getNewPath = function (item) {
        var newPath = '';
        for (var i = 0; i < this.pathFields.length; i++) {
            var field = this.pathFields[i];
            if (newPath.length > 0) {
                newPath += '/';
            }
            if (field.indexOf("this") == 0) {
                newPath += this.getProperty(this, field.substring(5));
            }
            else {
                newPath += this.getProperty(item, field.substring(5));
            }
        }
        return newPath;
    };
    BaseController.prototype.showItem = function (item) {
        this.ng.$location.path(this.getNewPath.call(this, item));
        try {
            this.context.resourceService.currentItem = null;
            var index = _.indexOf(this.context.resourceService.items, item);
            if (index > -1) {
                this.context.resourceService.currentItemIndex = index;
            }
        }
        catch (e) {
        }
    };
    BaseController.prototype.showPreviousItem = function () {
        try {
            if (this.context.resourceService.currentItemIndex > 0) {
                this.context.resourceService.currentItemIndex--;
                var newItem = this.context.resourceService.items[this.context.resourceService.currentItemIndex];
                this.ng.$location.path(this.getNewPath.call(this, newItem));
            }
        }
        catch (e) {
        }
    };
    BaseController.prototype.hasPreviousItem = function () {
        return this.context.resourceService.currentItemIndex > 0;
    };
    BaseController.prototype.showNextItem = function () {
        try {
            if (this.context.resourceService.currentItemIndex < this.context.resourceService.items.length - 1) {
                this.context.resourceService.currentItemIndex++;
                var newItem = this.context.resourceService.items[this.context.resourceService.currentItemIndex];
                this.ng.$location.path(this.getNewPath.call(this, newItem));
            }
        }
        catch (e) {
        }
    };
    BaseController.prototype.hasNextItem = function () {
        return this.context.resourceService.items !== undefined && this.context.resourceService.currentItemIndex < this.context.resourceService.items.length - 1;
    };
    BaseController.prototype.getItem = function (id) {
        "use strict";
        var _this = this;
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.showEditable = false;
        this.isReadonly = true;
        this.context.resourceService.getItem({ resourceName: this.context.resourceName, id: id }).then(function (result) { return _this.onGetItemSuccess(result); }).catch(function (result) { return _this.onGetItemError(result); });
    };
    BaseController.prototype.onGetItemSuccess = function (result) {
        "use strict";
        try {
            this.context.resourceService.currentItem = result;
            this.viewModel = this.context.resourceService.currentItem;
        }
        catch (e) {
            this.viewModel = result;
        }
        this.resetFocus = true;
        this.isModelLoaded = true;
        this.showEditable = true;
        this.isReadonly = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
    };
    BaseController.prototype.refreshMetadata = function (metadata) {
        "use strict";
        if (metadata != undefined) {
            this.metadata = {};
            _.merge(this.metadata, this.metadataBase, metadata);
        }
        try {
            this.context.resourceService.metadata[this.context.formTag] = this.metadata;
        }
        catch (e) {
        }
        ;
    };
    BaseController.prototype.onGetItemError = function (result) {
        "use strict";
        this.messages = 'Error';
    };
    BaseController.prototype.updateItem = function (item, params) {
        "use strict";
        var _this = this;
        if (!params) {
            params = {};
        }
        params['resourceName'] = this.context.resourceName;
        this.isModelLoaded = false;
        this.context.resourceService.updateItem(params, item).then(function (result) { return _this.onUpdateItemSuccess(result); }).catch(function (result) { return _this.onUpdateItemError(result); });
    };
    BaseController.prototype.onUpdateItemSuccess = function (result) {
        "use strict";
        this.messages = 'Success';
        this.isModelLoaded = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
        this.showItem(result);
    };
    BaseController.prototype.onUpdateItemError = function (result) {
        "use strict";
        this.messages = 'Error';
    };
    BaseController.prototype.deleteItem = function (item) {
        "use strict";
        var _this = this;
        this.isModelLoaded = false;
        this.context.resourceService.deleteItem({ resourceName: this.context.resourceName }, item).then(function (result) { return _this.onDeleteItemSuccess(result); }).catch(function (result) { return _this.onDeleteItemError(result); });
    };
    BaseController.prototype.onDeleteItemSuccess = function (result) {
        "use strict";
        this.messages = 'Success';
        this.isModelLoaded = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
        var removed = _.remove(this.viewModel, function (item) {
            return (item.id === result.id);
        });
    };
    BaseController.prototype.onDeleteItemError = function (result) {
        "use strict";
        this.messages = 'Error';
    };
    BaseController.prototype.doSubmit = function (isValid) {
        "use strict";
    };
    BaseController.prototype.validateForm = function (thisForm) {
        "use strict";
        var haveError = false;
        if (thisForm && thisForm.$error && thisForm.$error.required) {
            for (var i = 0, len = thisForm.$error.required.length; i < len; i++) {
                var requiredItem = thisForm.$error.required[i];
                if (requiredItem.$invalid) {
                    haveError = true;
                    thisForm.$setError(requiredItem.$name, 'Required');
                }
            }
        }
        return thisForm.$invalid ? 'error' : null;
    };
    /**
     * Checks if the given string is a resolve for the current state. If it is,
     * it will return the resolved data.
     *
     * @param resolveName: The name of the resolve
     * @returns data from the resolve, or undefined if none exists
     */
    BaseController.prototype.resolves = function (resolveName) {
        var resolve = this.ng.$state.$current.locals.globals[resolveName];
        if (resolve) {
            if (resolve.applies) {
                if (!_.isArray(resolve.applies))
                    resolve.applies = [resolve.applies];
                if (!_.contains(resolve.applies, this.context.resourceName)) {
                    return undefined;
                }
            }
        }
        return resolve;
    };
    BaseController.prototype.getParameters = function () {
        var resolves = this.ng.$state.$current.locals.globals;
        var params = {};
        for (var resolveName in resolves) {
            if (resolveName.indexOf('param.') == 0) {
                var paramName = resolveName.substring(6);
                if (resolves[resolveName].applies) {
                    if (!_.isArray(resolves[resolveName].applies))
                        resolves[resolveName].applies = [resolves[resolveName].applies];
                    if (_.contains(resolves[resolveName].applies, this.context.resourceName)) {
                        params[paramName] = resolves[resolveName].value;
                    }
                }
                else {
                    params[paramName] = resolves[resolveName].value;
                }
            }
        }
        return params;
    };
    BaseController.prototype.format = function (fieldInfo, value) {
        return this.ng.Formatter.format(fieldInfo.type, fieldInfo.format, value);
    };
    BaseController.prototype.class = function (fieldInfo, value) {
        return this.ng.Formatter.formatClass(fieldInfo.type, value);
    };
    BaseController.prototype.getDefaultPageTitle = function () {
        if (this.context.title) {
            return this.context.title;
        }
        var resource = this.context.resourceName.substring(0, 1).toUpperCase() + this.context.resourceName.substring(1, this.context.resourceName.length - 1);
        var type = this.context.formTag.substring(0, 1).toUpperCase() + this.context.formTag.substring(1);
        var title;
        switch (type) {
            case 'List':
                title = resource + ' Search';
                break;
            case 'Detail':
                title = resource + ' Detail';
                break;
            default:
                title = resource;
        }
        return title;
    };
    BaseController.prototype.setPageTitle = function (pageName) {
        this.$injector.get('PageInfo').setTitle(pageName);
    };
    BaseController.prototype.toggleArrangeTiles = function () {
        this.$injector.get('cheeseTileService').arrangeTilesMode = !this.$injector.get('cheeseTileService').arrangeTilesMode;
        if (this.$injector.get('cheeseTileService').arrangeTilesMode) {
            this.layoutBeforeEdit = angular.copy(this.metadata.views[this.context.viewId].layout);
        }
    };
    BaseController.prototype.isArrangeTilesMode = function () {
        return this.$injector.get('cheeseTileService').arrangeTilesMode;
    };
    BaseController.prototype.saveTileLayout = function () {
        this.toggleArrangeTiles();
        var field = 'views.' + this.context.viewId + '.layout';
        var object = {
            views: {}
        };
        object['views'][this.context.viewId] = {
            layout: this.metadata.views[this.context.viewId].layout
        };
        this.$injector.get('$http').post(this.$injector.get('ApplicationConfig').apiBasePath + 'api/metadata/' + this.context.resourceName + '/' + this.context.formTag, object);
    };
    BaseController.prototype.cancelTileLayout = function () {
        this.metadata.views[this.context.viewId].layout = this.layoutBeforeEdit;
        this.toggleArrangeTiles();
    };
    BaseController.prototype.resetTileLayout = function () {
        this.metadata.views[this.context.viewId].layout = this.metadata.unfiltered.views[this.context.viewId].layout;
        this.toggleArrangeTiles();
        var field = 'views.' + this.context.viewId + '.layout';
        var object = {};
        object[field] = this.metadata.views[this.context.viewId].layout;
        this.$injector.get('$http').post(this.$injector.get('ApplicationConfig').apiBasePath + 'api/metadata/' + this.context.resourceName + '/' + this.context.formTag, object);
    };
    return BaseController;
})();
///<reference path='../references.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Bob on 5/6/2014.
 */
//import BaseController = require('./base-controller');
var BaseDetailController = (function (_super) {
    __extends(BaseDetailController, _super);
    function BaseDetailController($injector, context) {
        "use strict";
        BaseController.addNgRef(context, '$stateParams');
        _super.call(this, $injector, context);
        this.getItem(this.ng.$stateParams.id);
    }
    BaseDetailController.prototype.doSubmit = function (isValid) {
        "use strict";
        this.updateItem(this.viewModel);
    };
    return BaseDetailController;
})(BaseController);
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/6/2014.
 */
//import BaseController = require('./base-controller');
var BaseEditController = (function (_super) {
    __extends(BaseEditController, _super);
    function BaseEditController($injector, context) {
        "use strict";
        BaseController.addNgRef(context, '$stateParams');
        _super.call(this, $injector, context);
    }
    BaseEditController.prototype.getData = function () {
        "use strict";
        this.getItem(this.ng.$stateParams.id);
    };
    BaseEditController.prototype.doSubmit = function (isValid) {
        "use strict";
        this.updateItem(this.viewModel);
    };
    return BaseEditController;
})(BaseController);
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/6/2014.
 */
//import BaseController = require('base-controller');
var BaseListController = (function (_super) {
    __extends(BaseListController, _super);
    function BaseListController() {
        _super.apply(this, arguments);
    }
    BaseListController.prototype.getData = function () {
        "use strict";
        this.searchModel = !!this.context.resourceService.searchModel ? this.context.resourceService.searchModel : this.searchModel;
        this.viewModel = !!this.context.resourceService.items ? this.context.resourceService.items : this.viewModel;
        if (this.viewModel.length > 0) {
            try {
                this.metadata.form.sections.search.isOpen = false;
            }
            catch (e) {
            }
        }
        if (this.autoLoad) {
            this.getList();
        }
    };
    return BaseListController;
})(BaseController);
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/6/2014.
 */
//import BaseController = require('./base-controller');
var BaseNewController = (function (_super) {
    __extends(BaseNewController, _super);
    function BaseNewController() {
        _super.apply(this, arguments);
    }
    BaseNewController.prototype.init = function () {
        "use strict";
        this.showEditable = true;
        this.isReadonly = false;
        _super.prototype.init.call(this);
    };
    BaseNewController.prototype.doSubmit = function (isValid) {
        "use strict";
        this.createItem(this.viewModel);
    };
    return BaseNewController;
})(BaseController);
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/6/2014.
 */
//import BaseController = require('./base-controller');
var BaseShowController = (function (_super) {
    __extends(BaseShowController, _super);
    function BaseShowController($injector, context) {
        "use strict";
        BaseController.addNgRef(context, '$stateParams');
        _super.call(this, $injector, context);
    }
    BaseShowController.prototype.getData = function () {
        "use strict";
        this.getItem(this.ng.$stateParams.id);
    };
    BaseShowController.prototype.doSubmit = function (isValid) {
        "use strict";
        this.updateItem(this.viewModel);
    };
    return BaseShowController;
})(BaseController);
///<reference path='../references.ts' />
/**
 * Created by Bob on 5/13/2014.
 */
var NavigationController = (function () {
    function NavigationController($location) {
        this.$location = $location;
    }
    NavigationController.prototype.isActive = function (viewLocation) {
        return viewLocation === this.$location.path();
    };
    return NavigationController;
})();
angular.module('cheese').controller('NavigationController', ['$location', function ($location) { return new NavigationController($location); }]);
///<reference path='i-controller-context.ts' />
///<reference path='base-controller.ts' />
///<reference path='base-detail-controller.ts' />
///<reference path='base-edit-controller.ts' />
///<reference path='base-list-controller.ts' />
///<reference path='base-new-controller.ts' />
///<reference path='base-show-controller.ts' />
///<reference path='navigation-controller.ts' /> 
///<reference path='module.ts' />
///<reference path='filters/index.ts' />
///<reference path='directives/index.ts' />
///<reference path='services/index.ts' />
///<reference path='controllers/index.ts' /> 
//# sourceMappingURL=cheese.js.map