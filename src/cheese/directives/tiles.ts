///<reference path='../references.ts' />

angular.module('cheese')
    .directive('cheeseTileContainer', function() {
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
            controller: function($scope, PageInfo, $state, $stateParams, $templateCache, $rootScope, cheeseTileService) {
                $scope.maximizedTiles = [];
                for (var tile in this.tiles) {
                    tile.expanded = false;
                }
                var tilesUnexpanded = false;
                $scope.$watch('tiles', function(newValue) {
                    if (!tilesUnexpanded && newValue) {
                        for (var key in newValue) {
                            newValue[key].expanded = false;
                        }
                        tilesUnexpanded = true;
                    }
                });

                $scope.isArrangeTilesMode = function() {
                    return cheeseTileService.arrangeTilesMode;
                };

                $scope.drop = function (event, data, child) {
                    // data is the tile ID - it wlil go and remove the tile from whereever it previously was
                    // and then add it to the child drop location
                    $scope.removeTile($scope.layout, data);
                    if (!child.tiles) {
                        child.tiles = [data];
                    } else {
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
                    } else if (location == 'bottom') {
                        $scope.layout.children.push(child);
                    }
                };

                $scope.dropTile = function (event, data, child, index, location) {
                    $scope.removeTile($scope.layout, data);

                    if (location == 'top') {
                        child.tiles.splice(index, 0, data);
                    } else if (location == 'bottom') {
                        child.tiles.splice(index+1, 0, data);
                    }
                };

                $scope.split = function(child, event) {
                    var currentColumns: any = $scope.getCurrentColumns(child.css);

                    var newChild1 = {
                        css: 'col-' + $scope.getCurrentWindowSize() + '-' + Math.floor(currentColumns/2),
                        tiles: [

                        ]
                    };

                    var newChild2 = {
                        css: 'col-' + $scope.getCurrentWindowSize() + '-' + Math.ceil(currentColumns/2),
                        children: child.children,
                        tiles: child.tiles
                    };

                    $scope.removeChild($scope.layout, child, [newChild2, newChild1]);

                    event.preventDefault();
                };

                $scope.delete = function(child, event) {
                    $scope.removeChild($scope.layout, child);

                    event.preventDefault();
                };

                $scope.removeTile = function(object, tileId) {
                    var removed = false;
                    if (object.tiles) {
                        var length = object.tiles.length;
                        object.tiles = _.filter(object.tiles, function(tile) {
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

                $scope.removeChild = function(object, child) {
                    var removed = false;
                    if (object.children) {
                        var length = object.children.length;
                        var index = object.children.indexOf(child);
                        object.children = _.filter(object.children, function(c) {
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

                $rootScope.$on('ANGULAR_DRAG_START', function($event, $channel) {
                    if ($channel == 'tile') {
                        $scope.$apply(function() {
                            cheeseTileService.arrangeTilesMode = true;
                            $scope.dragging = true;
                        });
                    }
                });

                $rootScope.$on('ANGULAR_DRAG_END', function($event, $channel) {
                    if ($channel == 'tile') {
                        $scope.$apply(function() {
                            $scope.dragging = false;
                        });
                    }
                });
                var hovered;

                $scope.enter = function(child, $event) {
                    if (!$scope.isArrangeTilesMode() || !$scope.dragging) return;
                    child.hovered = true;
                    if (hovered != null && hovered != child) { hovered.hovered = false; }
                    hovered = child;

                    if ($event.pageX - $($event.currentTarget).offset().left > ($event.currentTarget.clientWidth/2)) {
                        child.hoveredPast50 = true;
                    } else {
                        child.hoveredPast50 = false;
                    }
                    $event.stopPropagation();
                };

                $scope.leave = function(child, $event) {
                    if (!$scope.isArrangeTilesMode() || !$scope.dragging) return;
                    child.hovered = false;
                    child.hoveredPast50 = false;
                    hovered = null;
                    $event.stopPropagation();

                    $(document).off('mousemove');
                };

                $scope.getCurrentWindowSize = function() {
                    var width = $(window).width();
                    var size;
                    if (width >= 1200) {
                        size = 'lg';
                    } else if (width < 1200 && width >= 992) {
                        size = 'md';
                    } else if (width < 992 && width >= 768) {
                        size = 'sm';
                    } else {
                        size = 'xs';
                    }

                    return size;
                }

                $scope.getTemplatePath = function(tileId) {
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
                $scope.minimize = function(tileId) {
                    var tile = $scope.tiles[tileId];
                    tile.expanded = false;
                    var tileTemplate = tile.template ? tile.template : tileId;
                   $scope.maximizedTiles = _.filter($scope.maximizedTiles, function(object: any) {
                       return !(($scope.tiles[object].template ? $scope.tiles[object].template : object) == tileTemplate);
                    });
                    if ($scope.defaultState != $state.current.name) {
                        $state.go($scope.defaultState, $stateParams);
                    }
                };
                $scope.maximize = function(tileId) {
                    var tile = $scope.tiles[tileId];
                    tile.expanded = true;
                    $scope.maximizedTiles.push(tileId);
                    if (tile.state) {
                        $state.go(tile.state, $stateParams);
                        findActiveState(tile.state);
                    }
                };

                $scope.getMaximizedClass = function(tileId) {
                    var tile = $scope.tiles[tileId];
                    if ($scope.maximizedTiles.length > 1 && tile.options && tile.options.maximizeClass != null)  {
                        return tile.options.maximizeClass;
                    } else {
                        return "col-lg-12 col-md-12 col-xs-12";
                    }
                };

                $scope.containsBootstrapColumns = function(css) {
                    if (css.indexOf('col-') == 0) {
                        return true;
                    }
                    return false;
                };

                $scope.isNotOneColumn = function(css) {
                    return $scope.getCurrentColumns() != 1;
                };

                $scope.getCurrentColumns = function(css) {
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
        }
    })
    .directive('cheeseTile', function() {
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
            controller: function($scope, $element, $interpolate) {
                $scope.$on('$includeContentLoaded', function() {
                    if ($element.find('title').length == 1) {
                        var title = $element.find('title')[0].innerHTML;
                        // only add a watch if the title contains an angular expression
                        if (title.indexOf('{') > -1) {
                            $scope.$watch(function () {
                                return $element.find('title')[0].innerHTML;
                            }, function (data) {
                                $scope.title = data;
                            });
                        } else {
                            $scope.title = title;
                        }
                    }
                });

                $scope.isVisible = function() {
                    return $scope.options.show ? $interpolate('{{' + $scope.options.show + '}}')($scope) === 'true' : true;
                };

                $scope.isMaximizeEnabled = function() {
                    if (typeof $scope.options !== 'undefined'
                        && typeof $scope.options.maximize !== 'undefined') {
                        return $scope.options.maximize;
                    }
                    return true;
                };

                $scope.isCollapseEnabled = function(isExpanded) {
                    if (isExpanded) {
                        return false;
                    }
                    if (typeof $scope.options !== 'undefined'
                        && typeof $scope.options.collapse !== 'undefined') {
                        return $scope.options.collapse;
                    }
                    return true;
                };

                $scope.toggle = function($event) {
                    $event.preventDefault();
                    $scope.expanded = !$scope.expanded;
                }
            },
            compile: function (element, attrs) {
                if (!attrs.noBackground)
                    attrs.noBackground = false;
                if (!attrs.expanded)
                    attrs.expanded = false;
            }
        };
    })
    .service('cheeseTileService', function() {
        this.arrangeTilesMode = false;
    })
    .directive('cheeseTileResizer', function($document) {
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

                    var currentColumns: any = $scope.$parent.getCurrentColumns($scope.child.css);
                    var widthPerColumn: any = $element.parent().width()/currentColumns;

                    var numberOfColumnsResized = Math.round((event.clientX-$element.parent().offset().left)/widthPerColumn);
                    if (numberOfColumnsResized > 12) numberOfColumnsResized = 12;
                    if (numberOfColumnsResized < 1) numberOfColumnsResized = 1;

                    if (currentColumns != numberOfColumnsResized) {
                        $scope.child.css = $scope.child.css.replace('col-' + windowSize + '-' + currentColumns, 'col-' + windowSize + '-' + numberOfColumnsResized);
                    }
                }
            }
        }
    });
