/**
 * Created by e1040222 on 10/6/2014.
 */

interface IAuthService {
    name:string;
    type: string;
    resource: any;
    session: any;
    metadata: any[];
    config: any;

    login(credentials:any):ng.IPromise<any>;
    logout(credentials:any):ng.IPromise<any>;
    isAuthenticated():boolean;
    isAuthorized(authorizedRoles:string[]):boolean;
}