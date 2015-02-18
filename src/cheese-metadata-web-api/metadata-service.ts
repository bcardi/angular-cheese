///<reference path='references.ts' />

/**
 * Created by Bob on 5/4/2014.
 */

class MetadataService implements IMetadataService {

    public resource:any;
    public config: any;

    constructor($resource, $injector) {
        "use strict";
        this.config = $injector.get('ApplicationConfig');
        var resourcePath = this.config.apiBasePath + 'api/metadata/:resourceName/:resourceScope';
        this.resource = $resource(resourcePath,{ },{ } );
    }

    public get(params):ng.IPromise<any> {
        "use strict";
        return this.resource.get({resourceName: params.resourceName, resourceScope: params.resourceScope}).$promise;
    }
}

angular.module('cheese').factory('MetadataService', ['$resource', '$injector', ($resource, $injector) => new MetadataService($resource, $injector)]);
