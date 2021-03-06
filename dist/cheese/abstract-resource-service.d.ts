/// <reference path="cheese.d.ts" />
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
    constructor($injector: any, $resource: any);
    public onGetListSuccess(httpResponse: any): any;
    public onGetListError(httpResponse: any): any;
    public getList(params: any): ng.IPromise<any>;
    public createItem(params: any, item: any): ng.IPromise<any>;
    public getItem(params: any): ng.IPromise<any>;
    public updateItem(params: any, item: any): ng.IPromise<any>;
    public deleteItem(params: any, item: any): ng.IPromise<any>;
    public setParameters(params: any): void;
}
