/// <reference path="../cheese/cheese.d.ts" />
declare class ResourceService implements IResourceService {
    name: string;
    type: string;
    resource: any;
    items: any[];
    parent: any;
    params: any[];
    currentItem: any;
    currentItemIndex: number;
    searchModel: any;
    getListTime: any;
    metadata: any[];
    searchFilter: string;
    config: any;
    $injector: any;
    constructor($injector: any, $resource: any);
    getList(params: any): ng.IPromise<any>;
    createItem(params: any, item: any): ng.IPromise<any>;
    getItem(params: any): ng.IPromise<any>;
    updateItem(params: any, item: any): ng.IPromise<any>;
    deleteItem(params: any, item: any): ng.IPromise<any>;
    onDeleteItemSuccess(httpResponse: any): any;
    onDeleteItemError(httpResponse: any): any;
    onGetListSuccess(httpResponse: any): any;
    onGetListError(httpResponse: any): any;
    onGetItemSuccess(httpResponse: any): any;
    onGetItemError(httpResponse: any): any;
    onUpdateItemSuccess(httpResponse: any): any;
    onUpdateItemError(httpResponse: any): any;
    setParameters(params: any): void;
}
