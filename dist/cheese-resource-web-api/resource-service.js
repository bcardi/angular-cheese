///<reference path='../cheese/cheese.d.ts' /> 
///<reference path='references.ts' />
var ResourceService = (function () {
    function ResourceService($injector, $resource) {
        var _this = this;
        this.metadata = [];
        "use strict";
        this.name = "web-api";
        this.type = "service";
        this.$injector = $injector;
        this.config = $injector.get('ApplicationConfig');
        this.resource = $resource(this.config.apiBasePath + 'api/:resourceName/:id', { id: '@id' }, {
            update: {
                url: this.config.apiBasePath + 'api/:resourceName/:id/:action',
                method: 'POST',
                interceptor: {
                    response: function (httpResponse) { return _this.onUpdateItemSuccess(httpResponse); },
                    responseError: function (httpResponse) { return _this.onUpdateItemError(httpResponse); }
                }
            },
            query: {
                url: this.config.apiBasePath + 'api/:resourceName/:id',
                interceptor: {
                    response: function (httpResponse) { return _this.onGetListSuccess(httpResponse); },
                    responseError: function (httpResponse) { return _this.onGetListError(httpResponse); }
                }
            },
            get: {
                url: this.config.apiBasePath + 'api/:resourceName/:id',
                interceptor: {
                    response: function (httpResponse) { return _this.onGetItemSuccess(httpResponse); },
                    responseError: function (httpResponse) { return _this.onGetItemError(httpResponse); }
                }
            },
            create: {
                url: this.config.apiBasePath + 'api/:resourceName/',
                method: 'POST'
            },
            delete: {
                url: this.config.apiBasePath + 'api/:resourceName/:id/delete',
                method: 'POST',
                interceptor: {
                    response: function (httpResponse) { return _this.onDeleteItemSuccess(httpResponse); },
                    responseError: function (httpResponse) { return _this.onDeleteItemError(httpResponse); }
                }
            }
        });
    }
    ResourceService.prototype.getList = function (params) {
        var queryParams = { resourceName: params.resourceName, __initial: params.initial };
        if (this.params && _.size(this.params) > 0) {
            for (var param in this.params) {
                queryParams[param] = this.params[param];
            }
        }
        _.merge(queryParams, params.searchModel);
        queryParams = _.omit(queryParams, function (value) {
            return value === '';
        });
        return this.resource.query(queryParams).$promise;
    };
    ResourceService.prototype.createItem = function (params, item) {
        "use strict";
        return this.resource.create({ resourceName: params.resourceName }, item).$promise;
    };
    ResourceService.prototype.getItem = function (params) {
        "use strict";
        return this.resource.get({ resourceName: params.resourceName }, { id: params.id }).$promise;
    };
    ResourceService.prototype.updateItem = function (params, item) {
        "use strict";
        return this.resource.update(params, item).$promise;
    };
    ResourceService.prototype.deleteItem = function (params, item) {
        "use strict";
        return this.resource.delete({ resourceName: params.resourceName }, { id: item.userId }).$promise;
    };
    ResourceService.prototype.onDeleteItemSuccess = function (httpResponse) {
        return httpResponse;
    };
    ResourceService.prototype.onDeleteItemError = function (httpResponse) {
        return httpResponse;
    };
    ResourceService.prototype.onGetListSuccess = function (httpResponse) {
        this.items = httpResponse.data.data;
        return this.items;
    };
    ResourceService.prototype.onGetListError = function (httpResponse) {
        return httpResponse.data;
    };
    ResourceService.prototype.onGetItemSuccess = function (httpResponse) {
        this.currentItem = httpResponse.data.data;
        return this.currentItem;
    };
    ResourceService.prototype.onGetItemError = function (httpResponse) {
        return httpResponse.data;
    };
    ResourceService.prototype.onUpdateItemSuccess = function (httpResponse) {
        this.currentItem = httpResponse.data.data;
        return this.currentItem;
    };
    ResourceService.prototype.onUpdateItemError = function (httpResponse) {
        return httpResponse.data;
    };
    ResourceService.prototype.setParameters = function (params) {
        this.params = params;
    };
    return ResourceService;
})();
angular.module('cheese').factory('ResourceService', ['$injector', '$resource', ResourceService]);
