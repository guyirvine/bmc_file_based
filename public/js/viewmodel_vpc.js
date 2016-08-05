/*jslint browser: true*/
/*jslint nomen: true */
/*jslint node: true */

/*global $, _, jQuery, ko */
/*global vm, moment, FileReader */

"use strict";

function ViewModel() {
    var self = this;

    self.fields = ['designedfor', 'designedby', 'datecreated', 'iteration', 'productsandservices', 'gaincreators', 'painrelievers', 'customerjobs', 'gains', 'pains'];

    self.designedfor = ko.observable();
    self.designedby = ko.observable();
    self.datecreated = ko.observable();
    self.datecreated_fmt = ko.computed(function () {
        var d = Date.parse(self.datecreated());
        if (isNaN(d)) { return ""; }

        return moment(d).format("D MMM YYYY");
    });
    self.iteration = ko.observable();

    self.productsandservices = ko.observableArray();
    self.gaincreators = ko.observableArray();
    self.painrelievers = ko.observableArray();
    self.customerjobs = ko.observableArray();
    self.gains = ko.observableArray();
    self.pains = ko.observableArray();

    self.issues = ko.observableArray();
    self.issues_fmt = ko.computed(function () {
        return self.issues().join(",");
    });

    self.sectionclick = function (css) {
        $("." + css).toggleClass("showtips");
    };

    self.toggle_image = function () {
        $(".images-column").toggleClass('show-product-value');
    };

    self.load = function (obj) {
        _.each(Object.keys(obj), function (property_name) {
            if (vm.hasOwnProperty(property_name)) {
                if ($.isArray(vm[property_name]())) {
                    if ($.isArray(obj[property_name])) {
//                        vm[property_name](obj[property_name]);
                        _.each(obj[property_name], function (v) {
                            vm[property_name].push(v);
                        });
                    } else {
                        vm[property_name].push(obj[property_name]);
                    }
                } else {
                    vm[property_name](obj[property_name]);
                }
            } else {
                vm.issues.push('Could not find matching property, ' + property_name + '.');
            }
        });
    };

    self.file = null;

    self.clear = function () {
        _.each(self.fields, function (property_name) {
            self[property_name](null);
        });
    };

    self.load_file = function () {
        self.clear();
        if (!self.file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents, obj;
            contents = e.target.result;
            obj = JSON.parse(contents);
            self.load(obj);
        };
        reader.readAsText(self.file);
    };

    self.read_file = function (f) {
        self.file = f;
        self.load_file();
    };
}
