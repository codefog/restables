/**
 * resTables - jQuery plugin for responsive tables
 * Copyright (C) 2011-2016 Codefog
 * @author  Codefog <http://codefog.pl>
 * @author  Kamil Kuzminski <kamil.kuzminski@codefog.pl>
 * @license MIT
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Global
        factory(jQuery);
    }
})(function ($) {
    'use strict';

    // Plugin name
    var pluginName = 'resTables';

    // Defaults
    var defaults = {
        // The columns to be merged with the others.
        // Example: {1: [2, 3], 5: [6]}
        // Result:
        //  - column with index 1 will contain values from columns: 1, 2, 3.
        //  - column with index 5 will contain values from columns: 5, 6.
        merge: {},

        // The columns to be moved to the given position.
        // Example: {1: 0}
        // Result: column with index 1 will be placed at the top of the table (index 0).
        move: {},

        // The columns to be skipped.
        // Example: [3, 5]
        // Result: columns with indexes 3 and 5 will be skipped.
        skip: [],

        // The columns to be spanned.
        // Example: [2, 4]
        // Result: columns with indexes 2 and 4 will have only 1 column (value) and colspan=2 attribute.
        span: [],

        // The CSS classes that are added to the origin and cloned elements
        cssClassOrigin: 'restables-origin',
        cssClassClone: 'restables-clone',

        // The list of attributes that should remain unique.
        // Example: ['id']
        // Result: <div id="test"> will become <div id="test-restables-clone">
        uniqueAttributes: ['id', 'for'],

        // The attribute suffix to make it unique.
        // Example: -unique-clone
        // Result: <div id="test"> will become <div id="test-unique-clone">
        attributeSuffix: '-restables-clone',

        // The clone callback that is executed when cloning table element.
        // Usage example: function (clone) { clone.addClass('cloned-table') }
        cloneCallback: null
    };

    /**
     * Plugin constructor
     *
     * @param element
     * @param options
     * @constructor
     */
    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        /**
         * Initialize the plugin
         */
        init: function () {
            this.buildStructure();
            this.mergeColumns();

            // Span columns
            if (this.settings.span.length > 0) {
                this.spanColumns();
            }

            this.moveColumns();

            // Skip columns
            if (this.settings.skip.length > 0) {
                this.skipColumns();
            }

            this.generateTable();
        },

        /**
         * Build the structure
         */
        buildStructure: function () {
            var self = this;
            self.headers = [];

            // Collect the table headers
            self.element.find('thead').find('th').each(function () {
                self.headers.push($(this).html());
            });

            self.structure = [];

            // Build the basic structure
            self.element.find('tbody').find('tr').each(function () {
                var group = [];

                $(this).find('td').each(function (index) {
                    group.push([self.headers[index], $(this).html().trim()]);
                });

                self.structure.push(group);
            });
        },

        /**
         * Merge the columns
         */
        mergeColumns: function () {
            var self = this;

            for (var target in self.settings.merge) {
                self.structure.forEach(function (tmp, group) {
                    self.settings.merge[target].forEach(function (source) {
                        self.structure[group][target][1] += self.structure[group][source][1];
                        self.structure[group].splice(source, 1);
                    });
                });
            }
        },

        /**
         * Move the columns
         */
        moveColumns: function () {
            var self = this;

            for (var target in self.settings.move) {
                self.structure.forEach(function (tmp, group) {
                    self.structure[group].splice(
                        self.settings.move[target],
                        0,
                        self.structure[group].splice(target, 1)[0]
                    );
                });
            }
        },

        /**
         * Skip the columns
         */
        skipColumns: function () {
            var self = this;

            self.structure.forEach(function (tmp, group) {
                self.structure[group] = self.structure[group].filter(function (tmp, index) {
                    return $.inArray(index, self.settings.skip) === -1;
                });
            });
        },

        /**
         * Span the columns
         */
        spanColumns: function () {
            var self = this;

            self.structure.forEach(function (tmp, group) {
                self.settings.span.forEach(function (index) {
                    self.structure[group][index] = [self.structure[group][index][1]];
                });
            });
        },

        /**
         * Generate the table
         */
        generateTable: function () {
            var self = this;
            var clone = $(self.element[0].cloneNode(false));

            self.structure.forEach(function (group) {
                var tbody = $('<tbody/>');

                group.forEach(function (cells) {
                    var row = $('<tr/>');
                    var cell = $('<td/>').html(cells[0]).appendTo(row);

                    if (cells.hasOwnProperty(1)) {
                        row.append($('<td/>').html(cells[1]));
                    } else {
                        cell.attr('colspan', 2);
                    }

                    row.appendTo(tbody);
                });

                tbody.appendTo(clone);
            });

            // Make the attributes unique
            if (self.settings.uniqueAttributes.length > 0) {
                self.makeAttributesUnique(clone);
            }

            // Execute the clone callback
            if (typeof self.settings.cloneCallback === 'function') {
                self.settings.cloneCallback(clone);
            }

            clone.addClass(self.settings.cssClassClone).insertAfter(
                self.element.addClass(self.settings.cssClassOrigin)
            );
        },

        /**
         * Make the attributes unique
         *
         * @param {object} table
         */
        makeAttributesUnique: function (table) {
            var self = this;
            var query = [];

            self.settings.uniqueAttributes.forEach(function (attribute) {
                query.push('[' + attribute + ']');
            });

            table.find(query.join(',')).each(function () {
                var el = $(this);

                self.settings.uniqueAttributes.forEach(function (attribute) {
                    if (el.attr(attribute)) {
                        el.attr(attribute, el.attr(attribute) + self.settings.attributeSuffix);
                    }
                });
            });
        }
    });

    // Plugin wrapper around the constructor preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
});
