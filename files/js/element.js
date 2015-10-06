/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var SimpleTable = PlatformElement.extend({
        initialize: function() {
            this.setSizes();
        },

        setSizes: function() {
            var sizes = this.settings.get('tableSizes');
            // if the # of columns isn't the size of the array of lengths, ignore it.
            if (sizes && sizes != "default" && this.settings.get('columns') == sizes.length) {
                var columns = this.$('tr').each(function(index, value) {
                    var cells = $(value).find('td').each(function(index2, value2) {
                        $(value2).css('width', sizes[index2] + '%');   
                    });
                });
            }
        }
    });

    return SimpleTable;
})();