/**
 *  class for all loot items dropped by environment
 */

ig.module(
	'game.entities.loot'
)
.requires(
	'game.entities.drop'
)
.defines(function(){
	
EntityLoot = EntityDrop.extend({
	
	// impact entity properties
	size: {x: 4, y: 6},
	offset: {x: 2, y: 2},
	animSheet:null,
	
	// custom properties
	lootType:0,
	
	init: function( x, y, settings ) {
		this.lootType = settings.lootType;
		this.animSheet = new ig.AnimationSheet( 'media/loot_'+this.lootType+'.png?x', 8, 8 ),
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},
	
});

});