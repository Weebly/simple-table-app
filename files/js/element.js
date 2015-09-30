/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var SimpleTable = PlatformElement.extend({
        initialize: function() {
            // we normalize the styles on initial load.
            $(document).ready(function() {
                this.fixStyles();
            }.bind(this));

            this.fixStyles();
        },

        /**
         * Lots of styles are applied by default to editable areas of
         * the editor. To make the element looks how you want, some styles
         * need to be overwritten.
         */
        fixStyles: function() {
            this.$('.element').each(function(index, value) {
                $(value).attr('style', '');
            });
        }
    });

    return SimpleTable;
})();