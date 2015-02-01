/**
 * Created by Bob on 6/17/2014.
 */
interface IMetadataService{
    resource: any;
    get(params: any): ng.IPromise<any>;
}
