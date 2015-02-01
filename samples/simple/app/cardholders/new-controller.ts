///<reference path='../references.ts' />

/*
 Todo: Define default metadata
 Todo: Edit list-metadata.json
 */

class CardholdersNewController extends BaseNewController {

    constructor($injector, context) {
        "use strict";
        super($injector, context);
        this.viewModel.tabStatus = "";
        this.viewModel.isReadonly = false;
    }

    createItem(item) {
        "use strict";
        super.createItem(item);
    }
}

angular.module('app.cardholders')
    .controller('CardholdersNewController', ['$injector', 'CardholdersResourceService', 'MetadataService',
        ($injector, ResourceService, MetadataService) => new CardholdersNewController(
            $injector,
            {
                resourceName: "cardholders",
                formTag: "detail",
                ngRefs: [],
                resourceService: ResourceService,
                metadataService: MetadataService
            }
        )]);
