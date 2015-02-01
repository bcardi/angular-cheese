///<reference path='references.ts' />

/**
 * Created by Bob on 5/4/2014.
 */

class AuthService implements IAuthService {

    public name:string;
    public type: string;
    public resource: any;
    public session: any;
    public metadata: any[] = [];
    public config: any;

    constructor($resource, $injector, Session) {
        "use strict";
        this.name = "web-api";
        this.type = "service";
        this.config = $injector.get('ApplicationConfig');
        this.session = Session;
        this.resource =
            $resource(this.config.apiBasePath + 'api/sessions',
                { id: '@id' },
                {
                    login: {
                        method: 'POST'
                    },

                    logout: {
                        method: 'POST',
                        url: this.config.apiBasePath + 'api/sessions/logout'
                    }
                }
            );
    }

    public login(credentials):ng.IPromise<any> {
        return this.resource.login({}, credentials).$promise.then((res) => {
            this.session.create(res.data.token, res.data.user.userId,
                res.data.user.roles, res.data.user.permissions, res.data.user.landingPage);
            res.data.user.session = this.session;
            return res.data.user;
        });
    }

    public logout(credentials):ng.IPromise<any> {
        this.session.destroy();
        return this.resource.logout({}, credentials);
    }

    public isAuthenticated():boolean {
        return !!this.session && !!this.session.userId;
    }

    public isAuthorized(permissions):boolean {
        if (!permissions) {
            return true;
        }
        if (!angular.isArray(permissions)) {
            permissions = [permissions];
        }

        var hasAccess = _.find(this.session.permissions, function(permission) {
            return permissions.indexOf(permission) > -1;
        }) != null;

        return this.isAuthenticated() && hasAccess;
    }
}

angular.module('cheese').factory('AuthService', ['$resource', '$injector', 'Session', ($resource, $injector, Session) => new AuthService($resource, $injector, Session)]);

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