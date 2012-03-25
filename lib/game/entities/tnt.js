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
	explosions:[],
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
			this.explosions.push(ig.game.spawnEntity( EntityExplosion, this.tile.x*ig.game.tileSize, this.tile.y*ig.game.tileSize));
			this.tntRecurse(this.tile.x, this.tile.y+1, ig.game.getMapTileMaterial(this.tile.y+1,this.tile.x));
			if (this.tile.x > 0)
				this.tntRecurse(this.tile.x-1, this.tile.y, ig.game.getMapTileMaterial(this.tile.y,this.tile.x-1));
			if (this.tile.y > 0)
				this.tntRecurse(this.tile.x, this.tile.y-1, ig.game.getMapTileMaterial(this.tile.y-1,this.tile.x));
			if (this.tile.x < 5)
				this.tntRecurse(this.tile.x+1, this.tile.y, ig.game.getMapTileMaterial(this.tile.y,this.tile.x+1));
			this.kill();
			return true;
		} else {
			return false;
		}
	},

	//TODO polish up
	tntRecurse: function(x,y, material) {
		if (material < 3) {
			//TODO will this explosion show up in emoty squares adjacent to vein?
			if (material == 0)
				this.explosions.push(ig.game.spawnEntity( EntityExplosion, x*16, y*16));
			return;
		}
		if (LevelPuzzle1.layer[2].data[y][x] != material) {
			return;
		}
		if (x < 0 || y < 0) {
			return;
		}
		if (x > 5) {
			return;
		}
		ig.game.destroyMapTile(y,x);
		LevelPuzzle1.layer[2].data[y][x] = 0; //TODO: some of this should be in ig.game.destroyMapTile()
		LevelPuzzle1.layer[1].data[y][x] = 0;
		this.explosions.push(ig.game.spawnEntity( EntityExplosion, x*16, y*16));
		this.tntRecurse(x+1,y,material);
		this.tntRecurse(x-1,y,material);
		this.tntRecurse(x,y+1,material);
		this.tntRecurse(x,y-1,material);
	}
	
	
});


});