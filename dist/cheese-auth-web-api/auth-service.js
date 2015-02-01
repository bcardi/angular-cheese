///<reference path='../cheese/cheese.d.ts' />
///<reference path='references.ts' />
/**
* Created by Bob on 5/4/2014.
*/
var AuthService = (function () {
    function AuthService($resource, $injector, Session) {
        this.metadata = [];
        "use strict";
        this.name = "web-api";
        this.type = "service";
        this.config = $injector.get('ApplicationConfig');
        this.session = Session;
        this.resource = $resource(this.config.apiBasePath + 'api/sessions', { id: '@id' }, {
            login: {
                method: 'POST'
            },
            logout: {
                method: 'POST',
                url: this.config.apiBasePath + 'api/sessions/logout'
            }
        });
    }
    AuthService.prototype.login = function (credentials) {
        var _this = this;
        return this.resource.login({}, credentials).$promise.then(function (res) {
            _this.session.create(res.data.token, res.data.user.userId, res.data.user.roles, res.data.user.permissions, res.data.user.landingPage);
            res.data.user.session = _this.session;
            return res.data.user;
        });
    };

    AuthService.prototype.logout = function (credentials) {
        this.session.destroy();
        return this.resource.logout({}, credentials);
    };

    AuthService.prototype.isAuthenticated = function () {
        return !!this.session && !!this.session.userId;
    };

    AuthService.prototype.isAuthorized = function (permissions) {
        if (!permissions) {
            return true;
        }
        if (!angular.isArray(permissions)) {
            permissions = [permissions];
        }

        var hasAccess = _.find(this.session.permissions, function (permission) {
            return permissions.indexOf(permission) > -1;
        }) != null;

        return this.isAuthenticated() && hasAccess;
    };
    return AuthService;
})();

angular.module('cheese').factory('AuthService', ['$resource', '$injector', 'Session', function ($resource, $injector, Session) {
        return new AuthService($resource, $injector, Session);
    }]);

angular.module('cheese').service('Session', function () {
    this.create = function (sessionId, userId, roles, permissions, landingPage) {
        this.id = sessionId;
        this.userId = userId;
        this.roles = roles;
        this.permissions = permissions;
        this.landingPage = landingPage;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.roles = null;
        this.permissions = null;
        this.landingPage = null;
    };
});
//# sourceMappingURL=auth-service.js.map
