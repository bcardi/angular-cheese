///<reference path='../cheese/cheese.d.ts' />
///<reference path='references.ts' />
var ResourceService = (function () {
    function ResourceService($injector, $resource) {
        var _this = this;
        this.metadata = [];
        "use strict";
        this.config = $injector.get('ApplicationConfig');
        this.name = "elastic";
        this.type = "nosql";
        this.$injector = $injector;
        this.resource = $resource('', {}, {
            create: {
                url: this.config.elasticsearchBasePath + ':resourceName/:id',
                method: 'POST',
                params: { docId: '@id' }
            },
            update: {
                url: this.config.elasticsearchBasePath + ':resourceName/:id',
                method: 'PUT',
                params: { docId: '@id' },
                transformResponse: function (data) {
                    var response = angular.fromJson(data);
                    //console.log(response);
                }
            },
            delete: {
                url: this.config.elasticsearchBasePath + ':resourceName/:id',
                method: 'DELETE',
                params: { docId: '@id' },
                transformResponse: function (data) {
                    var response = angular.fromJson(data);
                    response.id = response._id;
                    return response;
                }
            },
            query: {
                url: this.config.elasticsearchBasePath + ':resourceName/_search',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    //console.log(data);
                    var response = angular.fromJson(data);

                    //console.log(response);
                    var result = [];
                    for (var i = 0, max = response.hits.total; i < max; i++) {
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
                    response: function (httpResponse) {
                        return _this.onGetListSuccess(httpResponse);
                    },
                    responseError: function (httpResponse) {
                        return this.onGetListError(httpResponse);
                    }
                }
            },
            get: {
                url: this.config.elasticsearchBasePath + ':resourceName/:docId',
                method: 'GET',
                params: { docId: '@id' },
                transformResponse: function (data) {
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
        });
    }
    ResourceService.prototype.onGetListSuccess = function (httpResponse) {
        this.items = httpResponse.data;
        return this.items;
    };

    ResourceService.prototype.onGetListError = function (httpResponse) {
        return httpResponse.data;
    };

    ResourceService.prototype.getList = function (params) {
        "use strict";
        var q = "";
        if (params.searchModel) {
            for (var prop in params.searchModel) {
                if (params.searchModel[prop]) {
                    q += "+" + prop + ":" + params.searchModel[prop] + " ";
                }
            }
        }

        //console.log("q="+q);
        var queryParams = { resourceName: params.resourceName };
        if (q) {
            queryParams["q"] = q;
        }
        queryParams["size"] = 1000000;
        return this.resource.query(queryParams).$promise;
    };

    ResourceService.prototype.createItem = function (params, item) {
        var _this = this;
        "use strict";

        //var _this = this;
        if (item.id) {
            return this.resource.create({ resourceName: params.resourceName }, item).$promise;
        } else {
            return this.resource.counter({}, { resourceName: params.resourceName }).$promise.then(function (data) {
                item.id = '' + data._version;
                return _this.resource.create({ resourceName: params.resourceName }, item).$promise;
            });
        }
    };

    ResourceService.prototype.getItem = function (params) {
        "use strict";
        return this.resource.get({ resourceName: params.resourceName }, { id: params.id }).$promise;
    };

    ResourceService.prototype.updateItem = function (params, item) {
        "use strict";
        return this.resource.update({ resourceName: params.resourceName }, item).$promise;
    };

    ResourceService.prototype.deleteItem = function (params, item) {
        "use strict";
        return this.resource.delete({ resourceName: params.resourceName }, item).$promise;
    };

    ResourceService.prototype.setParameters = function (params) {
        "use strict";
        this.params = params;
    };
    return ResourceService;
})();

angular.module('cheese').factory('ResourceService', ['$injector', '$resource', ResourceService]);
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
