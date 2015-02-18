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
    title: string;
    setTitle(title: string): void;
}
/**
 * Created by Bob on 6/17/2014.
 */
interface IControllerContext {
    resourceName: string;
    formTag: string;
    ngRefs: string[];
    resourceService: any;
    metadataService: any;
    title?: string;
    viewId?: string;
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
    ng: any;
    context: IControllerContext;
    resetFocus: boolean;
    isModelLoaded: boolean;
    showEditable: boolean;
    isReadonly: boolean;
    viewModel: any;
    searchModel: any;
    metadataBase: any;
    metadata: any;
    messages: string;
    primaryGridOptions: any;
    autoLoad: boolean;
    $injector: any;
    private $scope;
    pathFields: any;
    activeTab: number;
    clearSearchModel(): void;
    static addNgRef(context: any, item: any): void;
    constructor($injector: any, context: IControllerContext);
    getActiveTab(): number;
    init(): void;
    loadData(): void;
    getFormMetadata(): void;
    onGetFormMetadataSuccess(result: any): void;
    isTrue(value: any, defaultValue: any): boolean;
    collapseAll(): void;
    expandAll(): void;
    onGetFormMetadataError(result: any): void;
    getData(): void;
    getList(): void;
    onGetListSuccess(result: any): void;
    onGetListError(result: any): void;
    createItem(item: any): void;
    onCreateSuccess(result: any): void;
    onCreateError(result: any): void;
    getProperty(obj: any, value: string): any;
    getNewPath(item: any): string;
    showItem(item: any): void;
    showPreviousItem(): void;
    hasPreviousItem(): boolean;
    showNextItem(): void;
    hasNextItem(): boolean;
    getItem(id: any): void;
    onGetItemSuccess(result: any): void;
    refreshMetadata(metadata: any): void;
    onGetItemError(result: any): void;
    updateItem(item: any, params?: any): void;
    onUpdateItemSuccess(result: any): void;
    onUpdateItemError(result: any): void;
    deleteItem(item: any): void;
    onDeleteItemSuccess(result: any): void;
    onDeleteItemError(result: any): void;
    doSubmit(isValid: any): void;
    validateForm(thisForm: any): string;
    /**
     * Checks if the given string is a resolve for the current state. If it is,
     * it will return the resolved data.
     *
     * @param resolveName: The name of the resolve
     * @returns data from the resolve, or undefined if none exists
     */
    resolves(resolveName: string): any;
    getParameters(): {};
    format(fieldInfo: any, value: any): string;
    class(fieldInfo: any, value: any): string;
    getDefaultPageTitle(): string;
    setPageTitle(pageName: string): void;
    private layoutBeforeEdit;
    toggleArrangeTiles(): void;
    isArrangeTilesMode(): any;
    saveTileLayout(): void;
    cancelTileLayout(): void;
    resetTileLayout(): void;
}
/**
 * Created by Bob on 5/6/2014.
 */
declare class BaseDetailController extends BaseController {
    constructor($injector: any, context: any);
    doSubmit(isValid: any): void;
}
/**
 * Created by Bob on 5/6/2014.
 */
declare class BaseEditController extends BaseController {
    constructor($injector: any, context: any);
    getData(): void;
    doSubmit(isValid: any): void;
}
/**
 * Created by Bob on 5/6/2014.
 */
declare class BaseListController extends BaseController {
    getData(): void;
}
/**
 * Created by Bob on 5/6/2014.
 */
declare class BaseNewController extends BaseController {
    init(): void;
    doSubmit(isValid: any): void;
}
/**
 * Created by Bob on 5/6/2014.
 */
declare class BaseShowController extends BaseController {
    constructor($injector: any, context: any);
    getData(): void;
    doSubmit(isValid: any): void;
}
/**
 * Created by Bob on 5/13/2014.
 */
declare class NavigationController {
    private $location;
    constructor($location: any);
    isActive(viewLocation: string): boolean;
}
