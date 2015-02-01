/*
 Todo: Define default metadata
 Todo: Edit list-metadata.json
 */

class CardholdersResourceService extends ResourceService implements IResourceService {
}

angular.module('app.cardholders')
    .factory('CardholdersResourceService', ['$resource', '$injector', ($resource, $injector) => new CardholdersResourceService($resource, $injector)]);
