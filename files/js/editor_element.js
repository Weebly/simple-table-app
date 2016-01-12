/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var SimpleTable = PlatformElement.extend({
        // default/minimum column width, in a percentage-based format
        minColumnWidth: 5,

        // a lot of setup is here; setting the sizes of the columns,
        // normalizing styles, and making the table resizable.
        initialize: function() {
            this.setSizes();
            $.when(
                $.getScript(this.assets_path + 'colResizable-1.5.min.js')
            ).done(function() {
                this.fixStyles();
                this.setUpResizable();
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

        // set the sizes for the table
        setSizes: function() {
            var sizes = this.settings.get('tableSizes');
            if (sizes && sizes != "default") {
                if (this.settings.get('columns') > sizes.length) {
                    // we need to make more columns.
                    // to do this, we take each existing column and proportionally remove a bit of width to make room.
                    // no columns will ever go under the minimum column size.
                    // new columns will have the minimum column size.

                    // get normalized total width
                    // i.e., [45, 5, 50] => [40, 0, 45] => 95
                    var normalizedTotalWidth = sizes.reduce(function(a, b) { return a + b; }, 0) - sizes.length * this.minColumnWidth;

                    // the number of columns we have to add
                    var diff = this.settings.get('columns') - sizes.length;

                    // then subtract porportionally to make room for the new columns
                    // i.e. [45, 5, 50] => [42.74, 5, 47.26]
                    // (more was taken out of 50 than of 45, and the total sum is now 95 instead of 100)
                    sizes.map(function(a) {
                        return a - ((a - this.minColumnWidth) * ((diff * this.minColumnWidth) / normalizedTotalWidth));
                    }.bind(this));

                    // then add new columns.
                    for (var i = 0; i < diff; i++) {
                        sizes.push(this.minColumnWidth);
                    }

                    // save the new array of widths.
                    this.settings.set('tableSizes', sizes);
                    this.settings.save();
                } else if (this.settings.get('columns') < sizes.length) {
                    // we need to remove the extra columns.
                    // proportionally redistribute the columns that will get deleted;
                    // i.e., [40, 20, 20, 20] would become [50, 25, 25] if the last column got deleted

                    // get total size of elements being removed
                    var size = 0;
                    while (this.settings.get('columns') != sizes.length) {
                        size += sizes.pop();
                    }

                    // get total sizes of remaining widths
                    var totalWidth = sizes.reduce(function(a, b) { return a + b; }, 0);

                    // then redistribute sizes accordingly
                    sizes.map(function(a) {
                        a += size * (a / totalWidth);
                    });

                    // save the new array of widths
                    this.settings.set('tableSizes', sizes);
                    this.settings.save();
                }

                // now sizes is an array w/ the proper number of columns
                // apply the sizes!
                var columns = this.$('tr:first-child td').map(function(index, value) {
                    $(value).css('width', sizes[index] + '%');
                });
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