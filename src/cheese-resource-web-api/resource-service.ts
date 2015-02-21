///<reference path='references.ts' />

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
        this.name = "web-api";
        this.type = "service";
        this.$injector = $injector;
        this.config = $injector.get('ApplicationConfig');
        this.resource = $resource(this.config.apiBasePath + 'api/:resourceName/:id',
            { id: '@id' },
            {
                update: {
                    url: this.config.apiBasePath + 'api/:resourceName/:id/:action',
                    method: 'POST',
                    interceptor: {
                        response: (httpResponse) => this.onUpdateItemSuccess(httpResponse),
                        responseError: (httpResponse) => this.onUpdateItemError(httpResponse)
                    }
                },
                query: {
                    url: this.config.apiBasePath + 'api/:resourceName/:id',
                    interceptor: {
                        response: (httpResponse) => this.onGetListSuccess(httpResponse),
                        responseError: (httpResponse) => this.onGetListError(httpResponse)
                    }
                },
                get: {
                    url: this.config.apiBasePath + 'api/:resourceName/:id',
                    interceptor: {
                        response: (httpResponse) => this.onGetItemSuccess(httpResponse),
                        responseError: (httpResponse) => this.onGetItemError(httpResponse)
                    }
                },
                create: {
                    url: this.config.apiBasePath + 'api/:resourceName/',
                    method: 'POST'
                },
                delete: {
                    url: this.config.apiBasePath + 'api/:resourceName/:id',
                    method: 'DELETE',
                    interceptor: {
                        response: (httpResponse) => this.onDeleteItemSuccess(httpResponse),
                        responseError: (httpResponse) => this.onDeleteItemError(httpResponse)
                    }
                }
            }
        );
    }

    public getList(params):ng.IPromise<any> {
        var queryParams: any = { resourceName: params.resourceName, __initial: params.initial };

        if (this.params && _.size(this.params) > 0) {
            for (var param in this.params) {
                queryParams[param] = this.params[param];
            }
        }
        _.merge(queryParams, params.searchModel);

        queryParams = _.omit(queryParams, function(value) {
            return value === '';
        });

        return this.resource.query(queryParams).$promise;
    }

    public createItem(params, item):ng.IPromise<any> {
        "use strict";
        return this.resource.create({resourceName: params.resourceName}, item).$promise;
    }

    public getItem(params):ng.IPromise<any> {
        "use strict";
        return this.resource.get({resourceName: params.resourceName}, { id: params.id }).$promise;
    }

    public updateItem(params, item):ng.IPromise<any> {
        "use strict";
        return this.resource.update(params, item).$promise;
    }

    public deleteItem(params, item):ng.IPromise<any> {
        "use strict";
        return this.resource.delete({resourceName: params.resourceName}, {id: item.userId}).$promise;
    }

    public onDeleteItemSuccess(httpResponse:any):any {
        return httpResponse;
    }

    public onDeleteItemError(httpResponse:any):any {
        return httpResponse;
    }

    public onGetListSuccess(httpResponse:any):any {
        this.items = httpResponse.data.data;
        return this.items;
    }

    public onGetListError(httpResponse:any):any {
        return httpResponse.data;
    }

    public onGetItemSuccess(httpResponse:any):any {
        this.currentItem = httpResponse.data.data;
        return this.currentItem;
    }

    public onGetItemError(httpResponse:any):any {
       return httpResponse.data;
    }

    public onUpdateItemSuccess(httpResponse:any):any {
        this.currentItem = httpResponse.data.data;
        return this.currentItem;
    }

    public onUpdateItemError(httpResponse:any):any {
        return httpResponse.data;
    }

    public setParameters(params:any): void {
        this.params = params;
    }
}

angular.module('cheese').factory('ResourceService', ['$injector', '$resource', ResourceService]);