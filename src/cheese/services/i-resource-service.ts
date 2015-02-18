/**
 * Created by Bob on 7/8/2014.
 */
interface IResourceService{

    name:string;
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

    getList(params:any):ng.IPromise<any>;
    createItem(params:any, item:any):ng.IPromise<any>;
    getItem(params:any):ng.IPromise<any>;
    updateItem(params:any, item:any):ng.IPromise<any>;
    deleteItem(params:any, item:any):ng.IPromise<any> ;
    setParameters(params:any);
}
