/**
 * Created by Bob on 5/17/2014.
 */
var filters = angular.module('cheese');

filters
    .filter('booleanAsYesNo', function () {
        return function (input) {
            return input ? 'Yes' : 'No';
        }
    })
    .filter('metadata', function() {
        return function (value, fieldInfo) {
            if (fieldInfo && fieldInfo[value]) {
                value = fieldInfo[value];
            }
            return value;
        }
    })
    .filter('time', function($filter) {
        return function(value) {
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
        }
    })
    .filter('choiceGroup', function() {
        return function (value, fieldInfo, descriptionOnly, key) {
            if (fieldInfo && fieldInfo[value]) {
                if (typeof fieldInfo[value] === 'object' && typeof key !== 'undefined') {
                    if (typeof descriptionOnly !== 'undefined' && descriptionOnly) {
                        value = fieldInfo[value][key];
                    } else {
                        value = (value.trim()?value + ' - ':'') + fieldInfo[value][key];
                    }
                } else {
                    if (typeof descriptionOnly !== 'undefined' && descriptionOnly) {
                        value = fieldInfo[value];
                    } else {
                        value = (value.trim()?value + ' - ':'')  + fieldInfo[value];
                    }
                }
            }
            return value;
        }
    })
    .filter('earningsType', function($filter) {
        return function(value, earningsType) {
            if (!value) value = 0;
            if (earningsType == 'CASH') {
                return $filter('currency')(value, '$', 2);
            } else {
                return $filter('number')(value, 0);
            }
        }
    })
    .filter('emptyAsNA', function() {
        return function(value) {
            return (!value || (typeof value === 'string' && value.trim().length == 0) ? 'N/A' : value);
        }
    })
    .filter('phone', function() {
        return function(value) {
            return typeof value === 'string' && value.trim().length == 10 ? value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10) : value;
        }
    })
    .filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    })
    .filter('tileTemplate', function($templateCache) {
        return function(input, object) {
            if (object.expanded) {
                var detailTemplate = object.template.replace('.html', '-detail.html');
                if ($templateCache.get(detailTemplate) != null) {
                    return detailTemplate;
                }
            }
            return object.template;
        }
    });