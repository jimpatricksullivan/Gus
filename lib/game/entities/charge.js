/**
 *  class for explosive type tnt
 */

ig.module(
	'game.entities.charge'
)
.requires(
	'game.entities.drop',
	'game.entities.explosion'
)
.defines(function(){

//TNT
EntityTNT = EntityDrop.extend({

	// impact entity properties
	size: {x: 4, y: 6},
	offset: {x: 2, y: 2},
	animSheet:null,
		
	// custom properties
	boom:null,
	takeable:false,
	//direction:null,
	
	init: function( x, y, settings ) {
		this.animSheet = new ig.AnimationSheet( 'media/tnt.png', 8, 8 ),
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.boom = new ig.Sound( 'media/sounds/boom2.*' );
		//this.direction = settings.direction;
	},
	
	detonate: function() {
		if (this.standing) {
			this.boom.play();
			ig.game.killAt(this.tile.y,this.tile.x);
			ig.game.spawnEntity( EntityExplosion, this.tile.x*ig.game.tileSize, this.tile.y*ig.game.tileSize);
			//right
			if (this.tile.x < 5)
				this.destroyBlock(this.tile.x+1, this.tile.y);
			this.kill();
			return true;
		} else {
			return false;
		}
	},

	destroyBlock: function(x,y) {
		// stop if it's off the map
		if (x < 0 || y < 0 || x > 5) {	
			return;
		}
		ig.game.destroyMapTile(y,x);
		ig.game.spawnEntity( EntityExplosion, x*16, y*16);
	}
	
	
});


});