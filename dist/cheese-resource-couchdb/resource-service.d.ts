/// <reference path="../cheese/cheese.d.ts" />
/**
 * Created by e1009811 on 5/1/2014.
 */
declare class ResourceService implements IResourceService {
    name: string;
    type: string;
    resource: any;
    items: any[];
    currentItem: any;
    currentItemIndex: number;
    searchModel: any;
    getListTime: any;
    metadata: any[];
    searchFilter: string;
    config: any;
    $injector: any;
    constructor($resource: any, $injector: any);
    getList(params: any): ng.IPromise<any>;
    createItem(params: any, item: any): ng.IPromise<any>;
    getItem(params: any): ng.IPromise<any>;
    updateItem(params: any, item: any): ng.IPromise<any>;
    deleteItem(params: any, item: any): ng.IPromise<any>;
}
