/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />
/**
* Created by Bob on 5/17/2014.
*/
declare var filters: ng.IModule;
/**
* Created by Bob on 6/17/2014.
*/
interface IMetadataService {
    resource: any;
    get(params: any): ng.IPromise<any>;
}
/**
* Created by Bob on 7/8/2014.
*/
interface IResourceService {
    name: string;
    type: string;
    resource: any;
    items: any[];
    parent: any;
    params: any[];
    currentItem: any;
    currentItemIndex: number;
    searchModel: any;
    getListTime: any;
    metadata: any[];
    searchFilter: string;
    config: any;
    $injector: any;
    getList(params: any): ng.IPromise<any>;
    createItem(params: any, item: any): ng.IPromise<any>;
    getItem(params: any): ng.IPromise<any>;
    updateItem(params: any, item: any): ng.IPromise<any>;
    deleteItem(params: any, item: any): ng.IPromise<any>;
    setParameters(params: any): any;
}
/**
* Created by e1040222 on 10/6/2014.
*/
interface IAuthService {
    name: string;
    type: string;
    resource: any;
    session: any;
    metadata: any[];
    config: any;
    login(credentials: any): ng.IPromise<any>;
    logout(credentials: any): ng.IPromise<any>;
    isAuthenticated(): boolean;
    isAuthorized(authorizedRoles: string[]): boolean;
}
declare class PageInfo {
    public title: string;
    public setTitle(title: string): void;
}
/**
* Created by Bob on 6/17/2014.
*/
interface IControllerContext {
    resourceName: string;
    resourceNameSingular: string;
    resourceScope: string;
    resourceService: IResourceService;
    metadataService: IMetadataService;
    pageTitle: string;
    viewId: string;
    dependencies: any;
}
/**
* Created by Bob on 5/5/2014.
*/
/**
* @area api
* @module cheese
* @ngdoc type
* @name BaseController
* @param {object} context ????.
* @description
* ????
*/
declare class BaseController {
    public ng: any;
    public context: IControllerContext;
    public resetFocus: boolean;
    public isModelLoaded: boolean;
    public showEditable: boolean;
    public isReadonly: boolean;
    public viewModel: any;
    public searchModel: any;
    public metadataBase: any;
    public metadata: any;
    public messages: string;
    public primaryGridOptions: any;
    public autoLoad: boolean;
    public $injector: any;
    private $scope;
    public pathFields: any;
    public activeTab: number;
    public clearSearchModel(): void;
    static addDependency(context: any, item: any): void;
    static $inject: string[];
    constructor($injector: any, resourceService: IResourceService, metadataService: IMetadataService);
    public getActiveTab(): number;
    public init(): void;
    public loadData(): void;
    public getFormMetadata(): void;
    public onGetFormMetadataSuccess(result: any): void;
    public isTrue(value: any, defaultValue: any): boolean;
    public collapseAll(): void;
    public expandAll(): void;
    public onGetFormMetadataError(result: any): void;
    public getData(): void;
    public getList(): void;
    public onGetListSuccess(result: any): void;
    public onGetListError(result: any): void;
    public createItem(item: any): void;
    public onCreateSuccess(result: any): void;
    public onCreateError(result: any): void;
    public getProperty(obj: any, value: string): any;
    public getNewPath(item: any): string;
    public showItem(item: any): void;
    public showPreviousItem(): void;
    public hasPreviousItem(): boolean;
    public showNextItem(): void;
    public hasNextItem(): boolean;
    public getItem(id: any): void;
    public onGetItemSuccess(result: any): void;
    public refreshMetadata(metadata: any): void;
    public onGetItemError(result: any): void;
    public updateItem(item: any, params?: any): void;
    public onUpdateItemSuccess(result: any): void;
    public onUpdateItemError(result: any): void;
    public deleteItem(item: any): void;
    public onDeleteItemSuccess(result: any): void;
    public onDeleteItemError(result: any): void;
    public doSubmit(isValid: any): void;
    public validateForm(thisForm: any): string;
    /**
    * Checks if the given string is a resolve for the current state. If it is,
    * it will return the resolved data.
    *
    * @param resolveName: The name of the resolve
    * @returns data from the resolve, or undefined if none exists
    */
    public resolves(resolveName: string): any;
    public getParameters(): {};
    public format(fieldInfo: any, value: any): string;
    public class(fieldInfo: any, value: any): string;
    public getDefaultPageTitle(): string;
    public setPageTitle(pageName: string): void;
    private layoutBeforeEdit;
    public toggleArrangeTiles(): void;
    public isArrangeTilesMode(): any;
    public saveTileLayout(): void;
    public cancelTileLayout(): void;
    public resetTileLayout(): void;
}
declare class BaseDetailController extends BaseController {
    public init(): void;
    public doSubmit(isValid: any): void;
}
declare class BaseEditController extends BaseController {
    public init(): void;
    public getData(): void;
    public doSubmit(isValid: any): void;
}
declare class BaseListController extends BaseController {
    public init(): void;
    public getData(): void;
}
declare class BaseNewController extends BaseController {
    public init(): void;
    public doSubmit(isValid: any): void;
}
declare class BaseShowController extends BaseController {
    public init(): void;
    public getData(): void;
    public doSubmit(isValid: any): void;
}
/**
* Created by Bob on 5/13/2014.
*/
declare class NavigationController {
    private $location;
    constructor($location: any);
    public isActive(viewLocation: string): boolean;
}
