/// <reference path="../../../src/cheese/cheese.d.ts" />
/// <reference path="../../../src/cheese/resource-service.d.ts" />
/// <reference path="../../../src/cheese/metadata-service.d.ts" />
declare class CardholdersResourceService extends ResourceService implements IResourceService {
}
declare class CardholdersListController extends BaseListController {
}
declare class CardholdersNewController extends BaseNewController {
    constructor($injector: any, context: any);
    public createItem(item: any): void;
}
declare class CardholdersEditController extends BaseEditController {
    public init(): void;
    public onGetItemSuccess(result: any): void;
    public validateForm(thisForm: any): string;
    public updateItem(item: any): void;
}
declare var app: ng.IModule;
