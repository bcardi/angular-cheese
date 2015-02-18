/// <reference path="cheese.d.ts" />
declare class MetadataService implements IMetadataService {
    resource: any;
    constructor($resource: any);
    get(params: any): ng.IPromise<any>;
}
