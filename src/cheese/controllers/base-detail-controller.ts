///<reference path='../references.ts' />

/**
 * Created by Bob on 5/6/2014.
 */

//import BaseController = require('./base-controller');

class BaseDetailController extends BaseController {

    init(){
        "use strict";
        this.context.resourceScope = "item";
        super.init();
    }

/*    constructor($injector, context) {
        "use strict";
        BaseController.addDependency(context,'$stateParams');
        super($injector, context);
        this.getItem(this.ng.$stateParams.id);
    }*/

    doSubmit(isValid){
        "use strict";
        this.updateItem(this.viewModel);

    }
}