///<reference path='../references.ts' />

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
class BaseController {
    public ng: any;

    public context: IControllerContext = <IControllerContext>{};
    public resetFocus: boolean = true;
    public isModelLoaded: boolean = false;
    public showEditable: boolean = false;
    public isReadonly: boolean = true;
    public viewModel: any = {};
    public searchModel: any = {};
    public metadataBase: any = {"form":{"tabs":{},"sections":{}}};
    public metadata: any = {};
    public messages: string = "";
    public primaryGridOptions: any = {};
    public autoLoad: boolean = false;
    public $injector: any;
    private $scope: ng.IScope;
    public pathFields: any = ["this.context.resourceName", "item.id"];
    public activeTab: number = 0;

    public clearSearchModel():void {
        this.searchModel = {};
    }

    static addDependency(context, item){
        if (!context.dependencies){
            context.dependencies = [];
        }
        context.dependencies.push(item);
    }

    static $inject = ["$scope", "MyService"];

    constructor($injector:any, resourceService: IResourceService, metadataService: IMetadataService) {
        "use strict";

        this.$injector = $injector;

        this.context = this.context || <IControllerContext>{};

        this.context.resourceService = resourceService;
        this.context.metadataService = metadataService;

        this.context.viewId = this.context.viewId || "default";

        // Load required angular references
        var dependencies = _.union(['cheeseResourceName', 'cheeseResourceNameSingular', '$location', '$state', '$stateParams', 'Formatter'], this.context.dependencies);
        this.ng = {};
        _.forEach(dependencies, item => this.ng[item] = $injector.get(item));

        if (this.ng.cheeseResourceName) {
            this.context.resourceName = this.context.resourceName || this.ng.cheeseResourceName;
        }

        if (this.ng.cheeseResourceNameSingular) {
            this.context.resourceNameSingular = this.context.resourceNameSingular || this.ng.cheeseResourceNameSingular;
        }

        if (_.size(this.getParameters()) > 0) {
            this.autoLoad = true;
            this.context.resourceService.setParameters(this.getParameters());
        }

        this.init();

        this.setPageTitle(this.getDefaultPageTitle());

        //this.refreshMetadata({});
        this.loadData();
    }

    public getActiveTab(): number {
        if (this.activeTab < 0) this.activeTab = 0;
        return this.activeTab;
    }

    public init(): void {
        "use strict";
    }

    public loadData(): void {
        "use strict";
        this.getFormMetadata();
    }

    public getFormMetadata(): void {
        "use strict";

        var cachedMetadata = {};
        try {cachedMetadata = this.context.resourceService.metadata[this.context.resourceScope]} catch(e) {}
        if (_.isEmpty(cachedMetadata)){
            this.context.metadataService
                .get({resourceName: this.context.resourceName, resourceScope: this.context.resourceScope})
                .then(result => this.onGetFormMetadataSuccess(result))
                .catch(result => this.onGetFormMetadataError(result));
        } else {
            this.onGetFormMetadataSuccess(cachedMetadata);
        }
    }

    public onGetFormMetadataSuccess(result): void {
        "use strict";

        _.merge(this.metadataBase, result);
        this.metadata = {};
        this.refreshMetadata({});
        this.getData();
    }

    public isTrue(value, defaultValue): boolean {
        "use strict";
        return (value === undefined) ? defaultValue : value;
    }

    public collapseAll(): void {
        "use strict";
        //var _this = this;
        Object.keys(this.metadata.form.sections).forEach( (sectionKey) => {
            var section = this.metadata.form.sections[sectionKey];
            section.isOpen = false;
        });
    }

    public expandAll(): void {
        "use strict";
        //var _this = this;
        Object.keys(this.metadata.form.sections).forEach( (sectionKey) => {
            var section = this.metadata.form.sections[sectionKey];
            section.isOpen = true;
        });
    }

    public onGetFormMetadataError(result): void {
        "use strict";
        console.log('onGetFormMetadataError');
        this.getData();
    }

    public getData(): void {
        "use strict";
    }
/*
    getChoiceGroups(){
        "use strict";
        this.context.resourceService
            .getList({resourceName: 'choice-groups'})
            .then((result) => this.onGetChoiceGroupsSuccess(result))
            .catch((result) => this.onGetChoiceGroupsError(result));
    }

    onGetChoiceGroupsSuccess(result) {
        "use strict";
        this.choiceGroups = {};
        for(var i=0,len=result.length;i<len;i++){
            this.choiceGroups[result[i].key] = result[i].value;
        }
    }

    onGetChoiceGroupsError(result) {
        "use strict";
        this.messages = 'Error'
    }
*/
    public getList(): void {
        "use strict";
        this.viewModel = [];
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.context.resourceService
            .getList({resourceName: this.context.resourceName, searchModel: this.searchModel})
            .then((result) => this.onGetListSuccess(result))
            .catch((result) => this.onGetListError(result));
    }

    public onGetListSuccess(result:any): void {
        "use strict";
        this.messages = 'Success';
        this.context.resourceService.items = result;
        this.context.resourceService.searchModel = _.cloneDeep(this.searchModel);
        this.context.resourceService.getListTime = Date.now();
        this.context.resourceService.searchFilter = "";
        this.viewModel = this.context.resourceService.items;
        this.resetFocus = true;
        this.isModelLoaded = false;
        try {this.metadata.form.sections.search.isOpen = false} catch(e) {}
        this.primaryGridOptions = { data: '[{"a":"1", "b":2}]' };
    }

    public onGetListError(result:any): void {
        "use strict";
        this.messages = 'Error'
    }

    public createItem(item): void {
        "use strict";
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.showEditable = false;
        this.isReadonly = true;
        this.context.resourceService
            .createItem({resourceName: this.context.resourceName}, item)
            .then((item) => this.onCreateSuccess(item))
            .catch((item) => this.onCreateError(item));
    }

    public onCreateSuccess(result): void {
        "use strict";
        this.messages = 'Success'
        this.isModelLoaded = false;
        this.showEditable = true;
        this.isReadonly = false;
        //this.context.$location.path(this.context.resourceName);
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
    }

    public onCreateError(result): void {
        "use strict";
        this.messages = 'Error'
        this.resetFocus = true;
    }
    public getProperty(obj: any, value: string): any {
        var arr = value.split(".");
        while(arr.length && (obj = obj[arr.shift()]));
        return obj;
    }

    public getNewPath(item: any): string {
        var newPath = '';
        for (var i = 0; i < this.pathFields.length; i++) {
            var field = this.pathFields[i];
            if (newPath.length > 0) {
                newPath += '/';
            }
            if (field.indexOf("this") == 0) {
                newPath += this.getProperty(this, field.substring(5));
            } else {
                newPath += this.getProperty(item, field.substring(5));
            }
        }
        return newPath;
    }

    public showItem(item): void {
        this.ng.$location.path(this.getNewPath.call(this, item));
        try {
            this.context.resourceService.currentItem = null;
            var index = _.indexOf(this.context.resourceService.items, item);
            if (index > -1) {
                this.context.resourceService.currentItemIndex = index;
            }
        } catch(e) {
            //
        }
    }

    public showPreviousItem() {
        try {
            if (this.context.resourceService.currentItemIndex > 0) {
                this.context.resourceService.currentItemIndex--;
                var newItem = this.context.resourceService.items[this.context.resourceService.currentItemIndex];

                this.ng.$location.path(this.getNewPath.call(this, newItem));
            }
        } catch(e) {

        }
    }

    public hasPreviousItem() {
        return this.context.resourceService.currentItemIndex > 0;
    }

    public showNextItem() {
        try {
            if (this.context.resourceService.currentItemIndex < this.context.resourceService.items.length-1) {
                this.context.resourceService.currentItemIndex++;
                var newItem = this.context.resourceService.items[this.context.resourceService.currentItemIndex];

                this.ng.$location.path(this.getNewPath.call(this, newItem));
            }
        } catch(e) {

        }
    }

    public hasNextItem() {
        return this.context.resourceService.items !== undefined && this.context.resourceService.currentItemIndex < this.context.resourceService.items.length - 1;
    }

    public getItem(id): void {
        "use strict";
        this.resetFocus = false;
        this.isModelLoaded = false;
        this.showEditable = false;
        this.isReadonly = true;
        this.context.resourceService
            .getItem({resourceName: this.context.resourceName, id: id})
            .then((result) => this.onGetItemSuccess(result))
            .catch((result) => this.onGetItemError(result));
    }

    public onGetItemSuccess(result): void {
        "use strict";
        try {
            this.context.resourceService.currentItem = result;
            this.viewModel = this.context.resourceService.currentItem;
        } catch(e) {
            this.viewModel = result;
        }
        this.resetFocus = true;
        this.isModelLoaded = true;
        this.showEditable = true;
        this.isReadonly = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
    }

    public refreshMetadata(metadata): void{
        "use strict";
        if (metadata != undefined) {
            this.metadata = {};
            _.merge(this.metadata, this.metadataBase, metadata);
        }
        try {this.context.resourceService.metadata[this.context.resourceScope] = this.metadata} catch(e) {};
    }

    public onGetItemError(result): void {
        "use strict";
        this.messages = 'Error'
    }

    public updateItem(item, params?): void {
        "use strict";
        if (!params) {
            params = {};
        }
        params['resourceName'] = this.context.resourceName;
        this.isModelLoaded = false;
        this.context.resourceService
            .updateItem(params, item)
            .then((result) => this.onUpdateItemSuccess(result))
            .catch((result) => this.onUpdateItemError(result));
    }

    public onUpdateItemSuccess(result): void {
        "use strict";
        this.messages = 'Success';
        this.isModelLoaded = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
        this.showItem(result);
    }

    public onUpdateItemError(result): void {
        "use strict";
        this.messages = 'Error'
    }

    public deleteItem(item): void {
        "use strict";
        this.isModelLoaded = false;
        this.context.resourceService
            .deleteItem({resourceName: this.context.resourceName}, item)
            .then( (result) => this.onDeleteItemSuccess(result))
            .catch((result) => this.onDeleteItemError(result));
    }

    public onDeleteItemSuccess(result): void {
        "use strict";
        this.messages = 'Success'
        this.isModelLoaded = false;
        if (result.metadata != undefined) {
            this.refreshMetadata(result.metadata);
        }
        var removed = _.remove(this.viewModel, (item) => {
            return (item.id === result.id);
        });
    }

    public onDeleteItemError(result): void {
        "use strict";
        this.messages = 'Error'
    }

    public doSubmit(isValid: any): void {
        "use strict";
    }

    public validateForm(thisForm): string {
        "use strict";
        var haveError = false;
        if (thisForm && thisForm.$error && thisForm.$error.required) {
            for (var i = 0, len = thisForm.$error.required.length; i < len; i++) {
                var requiredItem = thisForm.$error.required[i];
                if (requiredItem.$invalid) {
                    haveError = true;
                    thisForm.$setError(requiredItem.$name, 'Required');
                }
            }
        }
        return thisForm.$invalid ? 'error' : null;
    }

    /**
     * Checks if the given string is a resolve for the current state. If it is,
     * it will return the resolved data.
     *
     * @param resolveName: The name of the resolve
     * @returns data from the resolve, or undefined if none exists
     */
    public resolves(resolveName: string): any {
        var resolve = this.ng.$state.$current.locals.globals[resolveName];
        if (resolve) {
            if (resolve.applies) {
                if (!_.isArray(resolve.applies)) resolve.applies = [resolve.applies];
                if (!_.contains(resolve.applies, this.context.resourceName)) {
                    return undefined;
                }
            }
        }
        return resolve;
    }

    public getParameters() {
        var resolves = this.ng.$state.$current.locals.globals;
        var params = {};
        for (var resolveName in resolves) {
            if (resolveName.indexOf('param.') == 0) {
                var paramName = resolveName.substring(6);
                if (resolves[resolveName].applies) {
                    if (!_.isArray(resolves[resolveName].applies)) resolves[resolveName].applies = [resolves[resolveName].applies];
                    if (_.contains(resolves[resolveName].applies, this.context.resourceName)) {
                        params[paramName] = resolves[resolveName].value;
                    }
                } else {
                    params[paramName] = resolves[resolveName].value;
                }
            }
        }
        return params;
    }

    public format(fieldInfo: any, value: any): string {
        return this.ng.Formatter.format(fieldInfo.type, fieldInfo.format, value);
    }

    public class(fieldInfo: any, value: any): string {
        return this.ng.Formatter.formatClass(fieldInfo.type, value);
    }

    public getDefaultPageTitle(): string {
        if (this.context.pageTitle) {
            return this.context.pageTitle;
        }
        var resource = this.context.resourceName.substring(0, 1).toUpperCase() + this.context.resourceName.substring(1, this.context.resourceName.length-1);
        var type = this.context.resourceScope.substring(0, 1).toUpperCase() + this.context.resourceScope.substring(1);
        var pageTitle;
        switch (type) {
            case 'List':
                pageTitle = resource + ' Search';
                break;
            case 'Detail':
                pageTitle = resource + ' Detail';
                break;
            default:
                pageTitle = resource;

        }
        return pageTitle;
    }

    public setPageTitle(pageName: string): void {
        this.$injector.get('PageInfo').setTitle(pageName);
    }

    private layoutBeforeEdit: any;

    public toggleArrangeTiles() {
        this.$injector.get('cheeseTileService').arrangeTilesMode = !this.$injector.get('cheeseTileService').arrangeTilesMode;

        if (this.$injector.get('cheeseTileService').arrangeTilesMode) {
            this.layoutBeforeEdit = angular.copy(this.metadata.views[this.context.viewId].layout);
        }
    }

    public isArrangeTilesMode() {
        return this.$injector.get('cheeseTileService').arrangeTilesMode;
    }

    public saveTileLayout() {
        this.toggleArrangeTiles();
        var field = 'views.'+this.context.viewId+'.layout';
        var object = {
            views: {

            }
        };
        object['views'][this.context.viewId] = {
            layout: this.metadata.views[this.context.viewId].layout
        };

        this.$injector.get('$http').post(this.$injector.get('ApplicationConfig').apiBasePath + 'api/metadata/' + this.context.resourceName + '/' + this.context.resourceScope, object);
    }

    public cancelTileLayout() {
        this.metadata.views[this.context.viewId].layout = this.layoutBeforeEdit;

        this.toggleArrangeTiles();
    }

    public resetTileLayout() {
        this.metadata.views[this.context.viewId].layout = this.metadata.unfiltered.views[this.context.viewId].layout;

        this.toggleArrangeTiles();
        var field = 'views.'+this.context.viewId+'.layout';
        var object = {};
        object[field] = this.metadata.views[this.context.viewId].layout;
        this.$injector.get('$http').post(this.$injector.get('ApplicationConfig').apiBasePath + 'api/metadata/' + this.context.resourceName + '/' + this.context.resourceScope, object);
    }

}