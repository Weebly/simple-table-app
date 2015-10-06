/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var SimpleTable = PlatformElement.extend({
        // a lot of setup is here; setting the sizes of the columns,
        // normalizing styles, and making the table resizable.
        initialize: function() {
            this.setSizes();
            $.when(
                $.getScript(this.assets_path + 'colResizable-1.5.min.js')
            ).done(function() {
                this.listenForPlaceholderReplacement();      
            }.bind(this));
        },

        /**
         * Lots of styles are applied by default to editable areas of
         * the editor. To make the element looks how you want, some styles
         * need to be overwritten.
         */
        fixStyles: function() {
            this.$('.element').each(function(index, value) {
                // only change their stuff if it's not the default.
                if ($(value).text() == 'Value') {
                    $(value).attr('style', '');
                }
            });
        },

        // since there's no good way of handling when all the placeholders have been replaced...
        listenForPlaceholderReplacement: function() {
            var view = this;
            this.placeholderTimeout = setInterval(function() {
                if (this.$('.platform-element-child-placeholder').length == 0) {
                    this.fixStyles();
                    this.setUpResizable();
                    clearInterval(this.placeholderTimeout);
                }
            }.bind(this), 100);
        },

        // set the sizes for the table
        setSizes: function() {
            var sizes = this.settings.get('tableSizes');
            if (sizes && sizes != "default") {
                // if the # of columns isn't the size of the array of lengths, ignore it.
                if (this.settings.get('columns') == sizes.length) {
                    var columns = this.$('tr:first-child td').map(function(index, value) {
                        $(value).css('width', sizes[index] + '%');
                    });
                } else {
                    this.settings.unset('tableSizes');
                    this.settings.save();
                }
            }
        },

        // set up the resizable table
        setUpResizable: function() {
            this.$('table').colResizable({
                liveDrag: true,
                hoverCursor: 'ew-resize',
                dragCursor: 'ew-resize',
                onResize: function(e) {
                    // store the widths
                    e.stopPropagation();
                    var widths = this.$('tr:first-child td').map(function(index, value) {
                        return parseInt($(value).css('width'));
                    }).get();
                    var totalWidth = widths.reduce(function(a, b) {
                        return a + b;
                    });
                    // in percentage value
                    percentages = widths.map(function(a) {
                        return Math.floor((a / totalWidth) * 100);
                    });
                    this.settings.set('tableSizes', percentages);
                    this.settings.save();
                }.bind(this)
            });
        }
    });

    return SimpleTable;
})();