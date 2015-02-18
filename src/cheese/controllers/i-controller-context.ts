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
