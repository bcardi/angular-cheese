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
        var _this = this;
        this.name = "web-api";
        this.type = "service";
        this.config = $injector.get('ApplicationConfig');
        this.session = Session;
        this.resource =
            $resource(this.config.elasticsearchBasePath + 'users/_search?q=userId\::userId',
                { id: '@id' },
                {
                    login: {
                        method: 'GET',
                        transformResponse: function (response) {
                            response = angular.fromJson(response);
                            return {
                                data: {
                                    id: 'id',
                                    user: {
                                        id: response.hits.hits[0]._source.userId,
                                        roles: response.hits.hits[0]._source.roles
                                    }
                                }
                            }
                        }
                    },

                    logout: {
                        method: 'GET'
                    }
                }
            );
    }

    public login(credentials):ng.IPromise<any> {
        var session = this.session;
        return this.resource.login({action: 'login',userId: credentials.userId}, credentials).$promise.then(function (res) {
            session.create(res.data.id, res.data.user.id,
                res.data.user.roles);
            return res.data.user;
        });
    }

    public logout(credentials):ng.IPromise<any> {
        this.session.destroy();
        return this.resource.logout({action: 'logout', userId: credentials.userId}, credentials);
    }

    public isAuthenticated():boolean {
        return !!this.session && !!this.session.userId;
    }

    public isAuthorized(authorizedRoles):boolean {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        // only allow unauthenticated users if the 'guest' role is authorized
        if (!this.isAuthenticated() && authorizedRoles.indexOf("GUEST") > -1) {
            return true;
        }
        var hasAccess = _.find(this.session.roles, function(role) {
            return authorizedRoles.indexOf(role) > -1;
        }) != null;

        return this.isAuthenticated() && hasAccess;
    }
}

angular.module('cheese').factory('AuthService', ['$resource', '$injector', 'Session', ($resource, $injector, Session) => new AuthService($resource, $injector, Session)]);

angular.module('cheese').service('Session', function () {
    this.create = function (sessionId, userId, roles) {
        this.id = sessionId;
        this.userId = userId;
        this.roles = roles;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.roles = null;
    };
});