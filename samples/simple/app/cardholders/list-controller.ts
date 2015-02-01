///<reference path='../references.ts' />

/*
 Todo: Define default metadata
 Todo: Edit list-metadata.json
 */

class CardholdersListController extends BaseListController {
}

angular.module('app.cardholders')
    .controller('CardholdersListController', ['$injector', 'CardholdersResourceService', 'MetadataService',
        ($injector, ResourceService, MetadataService) => new CardholdersListController(
            $injector,
            {
                resourceName: "cardholders",
                formTag: "list",
                ngRefs: [],
                resourceService: ResourceService,
                metadataService: MetadataService
            }
        )]);