/// <reference path="../cheese/cheese.d.ts" />
/**
* Created by Bob on 5/4/2014.
*/
declare class AuthService implements IAuthService {
    public name: string;
    public type: string;
    public resource: any;
    public session: any;
    public metadata: any[];
    public config: any;
    constructor($resource: any, $injector: any, Session: any);
    public login(credentials: any): ng.IPromise<any>;
    public logout(credentials: any): ng.IPromise<any>;
    public isAuthenticated(): boolean;
    public isAuthorized(permissions: any): boolean;
}
