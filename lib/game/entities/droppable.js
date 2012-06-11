/**
 * class for all items dropped by player or environment
 * including: tnt, directionals, mega bombs, gravel, anti-gravity blocks
 * It would be more OO to make this a super class and each of those subclasses, 
 * but having it all in one class turned out to be easier to work with
 */

ig.module(
	'game.entities.droppable'
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
	
	// custom properties
	sound:null,
	takeable:false,
	type:null,

	init: function( x, y, settings ) {
		this.type = settings.type;
		this.sound = new ig.Sound( 'media/sounds/boom2.*' ); //TODO different sound effect for each type
		this.animSheet = new ig.AnimationSheet( 'media/droppable-'+ this.type +'.png', 8, 8 ), 
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
	},
	
	update: function() {

		this.setTileCoords();
		this.parent();
		
		if (this.standing) {
			if (this.type == "gravel") {
				this.sound.play();
				ig.game.createGravelBlock(this.tile.x, this.tile.x);
				this.kill(); 
			} else if (this.type == "anti-grav") {
				this.sound.play();
				//TODO animate block hovering into place
				ig.game.createAntigravBlock(this.tile.x, this.tile.x);
				this.kill(); 
			}	
		}	
		
	},
	

	detonate: function() {
		if (this.standing) {
			this.sound.play();
			if (this.type == "tnt") {	
				ig.game.destroyBlock( this.tile.x, this.tile.y );		
				ig.game.startDestroyingVein( this.tile.x-1, this.tile.y );
				ig.game.startDestroyingVein( this.tile.x, this.tile.y-1 );
				ig.game.startDestroyingVein( this.tile.x, this.tile.y+1 );
				ig.game.startDestroyingVein( this.tile.x+1, this.tile.y );	
				this.kill();
				return true;
			} else if (this.type == "mega") {
				for ( var x=-1 ; x < 2 ; x++) {
					for ( var y=-1 ; y < 2 ; y++) {
						ig.game.destroyBlock( this.tile.x+x, this.tile.y+y );
					}
				}
				this.kill();
				return true;
			} else if (this.type == "directional-up") {
				ig.game.destroyBlock( this.tile.x, this.tile.y );	
				ig.game.destroyBlock( this.tile.x, this.tile.y-1 );
				this.kill();
				return true;
			} else if (this.type == "directional-right") {
				ig.game.destroyBlock( this.tile.x, this.tile.y );	
				ig.game.destroyBlock( this.tile.x+1, this.tile.y );
				this.kill();
				return true;
			} else if (this.type == "directional-down") {
				ig.game.destroyBlock( this.tile.x, this.tile.y );	
				ig.game.destroyBlock( this.tile.x, this.tile.y+1 );
				this.kill();
				return true;
			} else if (this.type == "directional-left") {
				ig.game.destroyBlock( this.tile.x, this.tile.y );	
				ig.game.destroyBlock( this.tile.x-1, this.tile.y );
				this.kill();
				return true;
			}
		}
		return false;
	},
	
});

});