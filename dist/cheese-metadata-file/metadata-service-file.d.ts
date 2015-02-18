/// <reference path="../cheese/cheese.d.ts" />
/**
 * Created by Bob on 5/4/2014.
 */
declare class MetadataService implements IMetadataService {
    resource: any;
    config: any;
    constructor($resource: any, $injector: any);
    get(params: any): ng.IPromise<any>;
}
