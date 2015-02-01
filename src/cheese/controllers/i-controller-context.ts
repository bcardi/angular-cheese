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
