///<reference path='../cheese/cheese.d.ts' /> 
///<reference path='references.ts' />
/**
 * Created by Bob on 5/4/2014.
 */
var MetadataService = (function () {
    function MetadataService($resource, $injector) {
        "use strict";
        this.config = $injector.get('ApplicationConfig');
        var resourcePath = this.config.apiBasePath + 'api/metadata/:resourceName/:resourceScope';
        this.resource = $resource(resourcePath, {}, {});
    }
    MetadataService.prototype.get = function (params) {
        "use strict";
        return this.resource.get({ resourceName: params.resourceName, resourceScope: params.resourceScope }).$promise;
    };
    return MetadataService;
})();
angular.module('cheese').factory('MetadataService', ['$resource', '$injector', function ($resource, $injector) { return new MetadataService($resource, $injector); }]);
