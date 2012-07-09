/**
 *  class for all loot items dropped by environment
 */

ig.module(
	'game.entities.loot'
)
.requires(
	'game.entities.tiled'
)
.defines(function(){
	
EntityLoot = EntityTiled.extend({
	
	// impact entity properties
	size: {x: 4, y: 6},
	offset: {x: 2, y: 2},
	animSheet:null,
	maxVel: {x: 200, y: 200},
	bounciness: 0.2, 
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	// custom properties
	lootType:0,
	takeable:true,
	
	init: function( x, y, settings ) {
		this.lootType = settings.lootType;
		if (this.lootType == 2) {
			this.animSheet = new ig.AnimationSheet( 'media/droppable-gravel.png', 8, 8 );
		} else {
			this.animSheet = new ig.AnimationSheet( 'media/loot_'+this.lootType+'.png?x', 8, 8 );	
		}
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},
		
	update: function() {
		this.setTileCoords();
		this.parent();
	}
	
	
});

});