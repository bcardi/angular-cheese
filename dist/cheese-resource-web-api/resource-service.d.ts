/// <reference path="../cheese/cheese.d.ts" />
/**
* Created by Bob on 5/4/2014.
*/
declare class ResourceService implements IResourceService {
    public name: string;
    public type: string;
    public resource: any;
    public items: any[];
    public parent: any;
    public params: any[];
    public currentItem: any;
    public currentItemIndex: number;
    public searchModel: any;
    public getListTime: any;
    public metadata: any[];
    public searchFilter: string;
    public config: any;
    public $injector: any;
    constructor($resource: any, $injector: any);
    public getList(params: any): ng.IPromise<any>;
    public createItem(params: any, item: any): ng.IPromise<any>;
    public getItem(params: any): ng.IPromise<any>;
    public updateItem(params: any, item: any): ng.IPromise<any>;
    public deleteItem(params: any, item: any): ng.IPromise<any>;
    public onDeleteItemSuccess(httpResponse: any): any;
    public onDeleteItemError(httpResponse: any): any;
    public onGetListSuccess(httpResponse: any): any;
    public onGetListError(httpResponse: any): any;
    public onGetItemSuccess(httpResponse: any): any;
    public onGetItemError(httpResponse: any): any;
    public onUpdateItemSuccess(httpResponse: any): any;
    public onUpdateItemError(httpResponse: any): any;
    public setParameters(params: any[]): void;
}
