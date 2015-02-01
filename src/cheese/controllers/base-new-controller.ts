///<reference path='../references.ts' />

/**
 * Created by Bob on 5/6/2014.
 */

//import BaseController = require('./base-controller');

class BaseNewController extends BaseController {

    init(){
        "use strict";
        this.showEditable = true;
        this.isReadonly = false;
        super.init();
    }

    doSubmit(isValid){
        "use strict";
        this.createItem(this.viewModel);
    }
}
