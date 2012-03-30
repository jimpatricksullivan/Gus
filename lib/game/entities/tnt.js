/**
 *  class for explosive type tnt
 */

ig.module(
	'game.entities.tnt'
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
	
	init: function( x, y, settings ) {
		this.animSheet = new ig.AnimationSheet( 'media/tnt.png', 8, 8 ),
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.boom = new ig.Sound( 'media/sounds/boom2.*' );
	},
	
	detonate: function() {
		if (this.standing) {
			this.boom.play();
			ig.game.killAt(this.tile.y,this.tile.x);
			ig.game.spawnEntity( EntityExplosion, this.tile.x*ig.game.tileSize, this.tile.y*ig.game.tileSize);
			// spread down
			this.destroyVein(this.tile.x, this.tile.y+1, ig.game.getMapTileMaterial(this.tile.y+1,this.tile.x));
			// spread left
			if (this.tile.x > 0)
				this.destroyVein(this.tile.x-1, this.tile.y, ig.game.getMapTileMaterial(this.tile.y,this.tile.x-1));
			// spread up
			if (this.tile.y > 0)
				this.destroyVein(this.tile.x, this.tile.y-1, ig.game.getMapTileMaterial(this.tile.y-1,this.tile.x));
			// spread right
			if (this.tile.x < 5)
				this.destroyVein(this.tile.x+1, this.tile.y, ig.game.getMapTileMaterial(this.tile.y,this.tile.x+1));
			this.kill();
			return true;
		} else {
			return false;
		}
	},

	destroyVein: function(x,y, material) {
		// stop if this is not an explodable material
		if (material < 3) {			
			// if it's an empty space, show an explosion and potentially kill the player
			if (material == 0) {
				ig.game.spawnEntity( EntityExplosion, x*16, y*16);
				ig.game.killAt(y,x);
			}
			return;
		}
		// stop if it's a new material
		if (ig.game.getMapTileMaterial(y,x) != material) {
			return;
		}
		// stop if it's off the map
		if (x < 0 || y < 0 || x > 5) {	
			return;
		}
		ig.game.destroyMapTile(y,x);
		ig.game.spawnEntity( EntityExplosion, x*16, y*16);
		this.destroyVein(x+1,y,material);
		this.destroyVein(x-1,y,material);
		this.destroyVein(x,y+1,material);
		this.destroyVein(x,y-1,material);
	}
	
	
});


});