///<reference path='cheese.d.ts' />

class ResourceService implements IResourceService {

    public name:string;
    public type: string;
    public resource: any;
    public items: any[];
    public parent: any;
    public params: any[];
    public currentItem: any;
    public currentItemIndex: number;
    public searchModel: any;
    public getListTime: any;
    public metadata: any[] = [];
    public searchFilter: string;
    public config: any;
    public $injector: any;

    constructor($injector, $resource) {
        "use strict";
    }

    public onGetListSuccess(httpResponse:any):any {
        "use strict";
        return null;
    }

    public onGetListError(httpResponse:any):any {
        "use strict";
        return null;
    }

    public getList(params:any):ng.IPromise<any> {
        "use strict";
        return null;
    }

    public createItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        return null;
    }

    public getItem(params:any):ng.IPromise<any> {
        "use strict";
        return null;
    }

    public updateItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        return null;
    }

    public deleteItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        return null;
    }

    public setParameters(params:any) {
        "use strict";
    }
}

angular.module('cheese').factory('ResourceService', ['$injector', '$resource', ResourceService]);
