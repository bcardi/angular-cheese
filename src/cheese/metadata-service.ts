///<reference path='cheese.d.ts' />

class MetadataService implements IMetadataService {

    public resource:any;

    constructor($resource) {
        "use strict";
    }

    public get(params):ng.IPromise<any> {
        "use strict";
        return null;
    }
}

angular.module('cheese').factory('MetadataService', ['$resource', ($resource) => new MetadataService($resource)]);
