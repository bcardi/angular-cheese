// Karma configuration
// Generated on Mon Jul 07 2014 13:39:20 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],


        // list of files / patterns to load in the browser
        files: [
            "lib/jquery/dist/jquery.js",
            "lib/lodash/dist/lodash.js",
            "lib/angular/angular.js",
            "lib/angular-mocks/angular-mocks.js",
            "lib/angular-ui-router/release/angular-ui-router.js",
            "lib/angular-resource/angular-resource.js",
            "lib/bootstrap/dist/js/bootstrap.js",
            "lib/angular-bootstrap/ui-bootstrap.js",
            "lib/angular-bootstrap/ui-bootstrap-tpls.js",
            "lib/angular-strap/dist/angular-strap.js",
            "lib/angular-strap/dist/angular-strap.tpl.js",
            "lib/angular-xeditable/dist/js/xeditable.js",
            "lib/angular-smart-table/dist/smart-table.debug.js",
            "lib/jasmine-jquery/lib/jasmine-jquery.js",
            "src/cheese/cheese.js",
            "src/cheese-auth-web-api/auth-service.js",
            "src/cheese-metadata-web-api/metadata-service.js",
            "src/cheese-resource-web-api/resource-service.js",
            "test/**/*-spec.js"
        ],


        // list of files to exclude
        exclude: [

        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {

        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
