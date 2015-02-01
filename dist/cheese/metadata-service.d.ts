/// <reference path="cheese.d.ts" />
declare class MetadataService implements IMetadataService {
    public resource: any;
    constructor($resource: any);
    public get(params: any): ng.IPromise<any>;
}
