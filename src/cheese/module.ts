///<reference path='references.ts' />
/**
 * Created by Bob on 5/23/2014.
 *//**
 * @ngdoc module
 * @name cheese
 * @description
 *
 * # cheese (core module)
 * The cheese module ????
 *
 * <div doc-module-components="cheese"></div>
 */
angular.module('cheese',['ngResource', 'angularMoment', 'ang-drag-drop'])

.provider('ApplicationConfig', function () {

        // esBasePath = http://localhost:9200/ipp/

        this.config = {
            'apiBasePath': '',
            'esBasePath': '',
            'couchDBBasePath': ''
        };

        this.$get = function() {
            var config = this.config;
            return config;
        };

        this.setConfig = function(config) {
            this.config = config;
        };
    })
;
