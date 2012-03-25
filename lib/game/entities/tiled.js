/**
 *  superclass for all items that need to reference what tile they are in
 */

ig.module(
	'game.entities.tiled'
)
.requires(
	'impact.entity'
)
.defines(function(){

/**
 * extends entity with a little code to track what tile it's in
 */
EntityTiled = ig.Entity.extend({

	tile: {x: 0, y: 0},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	}, 
	
	/**
	 * This should be called every update
	 * It would just extend the update function, but there needs to be code between this
	 * and the parent update function
	 */
	setTileCoords: function() {
		this.tile.x = Math.floor((this.pos.x+4)/ig.game.tileSize);
		this.tile.y = Math.floor((this.pos.y+1)/ig.game.tileSize);
	}
	
});

});