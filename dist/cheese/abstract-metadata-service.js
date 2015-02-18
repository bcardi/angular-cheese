///<reference path='cheese.d.ts' />
var MetadataService = (function () {
    function MetadataService($resource) {
        "use strict";
    }
    MetadataService.prototype.get = function (params) {
        "use strict";
        return null;
    };
    return MetadataService;
})();
angular.module('cheese').factory('MetadataService', ['$resource', function ($resource) { return new MetadataService($resource); }]);
