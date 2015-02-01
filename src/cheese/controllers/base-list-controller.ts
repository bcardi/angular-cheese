///<reference path='../references.ts' />

/**
 * Created by Bob on 5/6/2014.
 */

//import BaseController = require('base-controller');

class BaseListController extends BaseController {

    getData(){
        "use strict";
        this.searchModel = !!this.context.resourceService.searchModel? this.context.resourceService.searchModel: this.searchModel;
        this.viewModel = !!this.context.resourceService.items? this.context.resourceService.items: this.viewModel;

        if (this.viewModel.length > 0) {
            try {
                this.metadata.form.sections.search.isOpen = false;
            } catch(e) {

            }
        }

        if (this.autoLoad) {
            this.getList();
        }
    }
}