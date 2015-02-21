///<reference path='cheese.d.ts' />
var ResourceService = (function () {
    function ResourceService($injector, $resource) {
        this.metadata = [];
        "use strict";
    }
    ResourceService.prototype.onGetListSuccess = function (httpResponse) {
        "use strict";
        return null;
    };

    ResourceService.prototype.onGetListError = function (httpResponse) {
        "use strict";
        return null;
    };

    ResourceService.prototype.getList = function (params) {
        "use strict";
        return null;
    };

    ResourceService.prototype.createItem = function (params, item) {
        "use strict";
        return null;
    };

    ResourceService.prototype.getItem = function (params) {
        "use strict";
        return null;
    };

    ResourceService.prototype.updateItem = function (params, item) {
        "use strict";
        return null;
    };

    ResourceService.prototype.deleteItem = function (params, item) {
        "use strict";
        return null;
    };

    ResourceService.prototype.setParameters = function (params) {
        "use strict";
    };
    return ResourceService;
})();

angular.module('cheese').factory('ResourceService', ['$injector', '$resource', ResourceService]);
