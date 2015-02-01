
class PageInfo {
    public title: string;

    public setTitle(title: string): void {
        this.title = title;
    }
}

angular.module('cheese')
    .service('PageInfo', PageInfo);