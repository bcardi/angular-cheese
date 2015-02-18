/// <reference path="../cheese/cheese.d.ts" />
/**
 * Created by Bob on 5/4/2014.
 */
declare class AuthService implements IAuthService {
    name: string;
    type: string;
    resource: any;
    session: any;
    metadata: any[];
    config: any;
    constructor($resource: any, $injector: any, Session: any);
    login(credentials: any): ng.IPromise<any>;
    logout(credentials: any): ng.IPromise<any>;
    isAuthenticated(): boolean;
    isAuthorized(permissions: any): boolean;
}
