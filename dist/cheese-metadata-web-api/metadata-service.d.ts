/// <reference path="../cheese/cheese.d.ts" />
/**
* Created by Bob on 5/4/2014.
*/
declare class MetadataService implements IMetadataService {
    public resource: any;
    public config: any;
    constructor($resource: any, $injector: any);
    public get(params: any): ng.IPromise<any>;
}
