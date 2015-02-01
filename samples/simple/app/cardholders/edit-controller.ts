///<reference path='../references.ts' />

/*
    Todo: Define default metadata
    Todo: Edit detail-metadata.json
 */

class CardholdersEditController extends BaseEditController {

    public init(): void {
        /* @@Default metadata@@ */
        this.metadataBase = {
            "form": {
                "tabs": {
                },
                "sections": {
                }
            }
        }
        super.init();
    }

    public onGetItemSuccess(result): void {
        "use strict";
        super.onGetItemSuccess(result);
        this.showEditable = !this.viewModel.isReadonly;
        this.isReadonly = this.viewModel.isReadonly;
    }

    public validateForm(thisForm): string {
        "use strict";
        return super.validateForm(thisForm);
    }

    public updateItem(item): void {
        "use strict";
        /***** Special processing for couchdb sample app *****/
        item.metadata.form.tabs.functionality.isDisabled = false;
        /***** Special processing for couchdb sample app *****/
        super.updateItem(item);
    }
}

angular.module('app.cardholders')
    .controller('CardholdersEditController', ['$injector', 'CardholdersResourceService', 'MetadataService',
        ($injector, ResourceService, MetadataService) => new CardholdersEditController(
            $injector,
            {
                resourceName: "cardholders",
                formTag: "detail",
                ngRefs: [],
                resourceService: ResourceService,
                metadataService: MetadataService
            }
        )]);