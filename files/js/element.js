/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 *
 * handles the logic of determining which table template to keep around, as well as swapping cells in and out from old tables to new ones.
 */
(function() {
	var SimpleTable = PlatformElement.extend({
		initialize: function() { }
	});

	return SimpleTable;
})()