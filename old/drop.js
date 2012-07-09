/**
 *  superclass for all items dropped by player or environment
 */

ig.module(
	'game.entities.drop'
)
.requires(
	'game.entities.tiled'
)
.defines(function(){
	
EntityDrop = EntityTiled.extend({

	// impact entity properties
	maxVel: {x: 200, y: 200},
	bounciness: 0.2, 
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	// custom properties and functions
	takeable:true,
	detonate: function() {},

	update: function() {
		this.setTileCoords();
		this.parent();
	}
	
});

});