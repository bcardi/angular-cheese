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
        this.config = $injector.get('ApplicationConfig');
        this.name = "elastic";
        this.type = "nosql";
        this.$injector = $injector;
        this.resource =
            $resource(
                '',
                { },
                {
                    create: {
                        url: this.config.elasticsearchBasePath + ':resourceName/:id',
                        method: 'POST',
                        params: { docId: '@id' }
                    },
                    update: {
                        url: this.config.elasticsearchBasePath + ':resourceName/:id',
                        method: 'PUT',
                        params: { docId: '@id' },
                        transformResponse: function(data){
                            var response = angular.fromJson(data);
                            //console.log(response);
                        }
                    },
                    delete: {
                        url: this.config.elasticsearchBasePath + ':resourceName/:id',
                        method: 'DELETE',
                        params: { docId: '@id' },
                        transformResponse: function(data){
                            var response = angular.fromJson(data);
                            response.id = response._id;
                            return response;
                        }
                    },
                    query: {
                        url: this.config.elasticsearchBasePath + ':resourceName/_search',
                        method: 'GET',
                        isArray: true,
                        transformResponse: function(data){
                            //console.log(data);
                            var response = angular.fromJson(data);
                            //console.log(response);
                            var result = [];
                            for(var i=0,max=response.hits.total;i<max;i++){
                                var item = response.hits.hits[i];
                                if (item) {
                                    var source = item._source;
                                    if (source) {
                                        source["id"] = item._id;
                                        result.push(source);
                                    }
                                }
                            }
                            return result;
                        },
                        interceptor: {
                            response: (httpResponse) => {
                                return this.onGetListSuccess(httpResponse);
                            },
                            responseError: function(httpResponse) {
                                return this.onGetListError(httpResponse);
                            }
                        }
                    },
                    get: {
                        url: this.config.elasticsearchBasePath + ':resourceName/:docId',
                        method: 'GET',
                        params: { docId: '@id' },
                        transformResponse: function(data){
                            var response = angular.fromJson(data);
                            var result = response._source;
                            result["id"] = response._id;
                            //console.log(result);
                            return result;
                        }
                    },
                    counter: {
                        url: this.config.elasticsearchBasePath + 'counters/:resourceName',
                        method: 'PUT',
                        params: { resourceName: '@resourceName' }
                    }
                }
            );
    }

    public onGetListSuccess(httpResponse:any):any {
        this.items = httpResponse.data;
        return this.items;
    }

    public onGetListError(httpResponse:any):any {
        return httpResponse.data;
    }

    public getList(params:any):ng.IPromise<any> {
        "use strict";
        var q = "";
        if (params.searchModel){
            for (var prop in params.searchModel) {
                if (params.searchModel[prop]) {
                    q += "+" + prop + ":" + params.searchModel[prop] + " ";
                }
            }
        }
        //console.log("q="+q);
        var queryParams = {resourceName: params.resourceName};
        if (q) {
            queryParams["q"] = q;
        }
        queryParams["size"] = 1000000;
        return this.resource.query(queryParams).$promise;
    }

    public createItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        //var _this = this;
        if (item.id){
            return this.resource.create({resourceName: params.resourceName}, item).$promise;
        } else {
            return this.resource
                .counter({}, {resourceName: params.resourceName}).$promise
                .then( (data) => {
                    item.id = '' + data._version;
                    return this.resource.create({resourceName: params.resourceName}, item).$promise;
                });
        }
    }

    public getItem(params:any):ng.IPromise<any> {
        "use strict";
        return this.resource.get({resourceName: params.resourceName}, { id: params.id }).$promise;
    }

    public updateItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        return this.resource.update({resourceName: params.resourceName}, item).$promise;
    }

    public deleteItem(params:any, item:any):ng.IPromise<any> {
        "use strict";
        return this.resource.delete({resourceName: params.resourceName}, item).$promise;
    }

    public setParameters(params:any) {
        "use strict";
        this.params = params;
    }
}

angular.module('cheese')
    .factory('ResourceService', ['$injector', '$resource', ResourceService]);



/*
 Create "_design/api" document in database

 curl -X PUT http://127.0.0.1:5984/work-requests
 curl -X PUT http://127.0.0.1:5984/work-requests/_design/api --data-binary @mydesign.json

 {
 "_id": "_design/api",
 "lists": {
 "all": "function(head, req) { var values = []; while (row = getRow()) { values.push(row.value); } return JSON.stringify(values); }"
 },
 "shows": {
 "detail": "function(doc, req) { var myDoc = JSON.parse(JSON.stringify( doc )); delete myDoc['_revisions']; myDoc.id = myDoc._id; return { 'json': myDoc }; }"
 },
 "views": {
 "default": {
 "map": "function (doc){ var myDoc = JSON.parse(JSON.stringify( doc )); myDoc.id = myDoc._id; emit(myDoc._id, myDoc); }"
 }
 }
 }
 */
