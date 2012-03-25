/**
 *  class for player
 */

ig.module(
	'game.entities.player'
)
.requires(
	'game.entities.tiled',
	'game.entities.tnt'
)
.defines(function(){

EntityPlayer = EntityTiled.extend({
	
	// impact entity properties
	size: {x: 8, y:14},
	offset: {x: 4, y: 2},
	maxVel: {x: 50, y: 100},
	friction: {x: 0, y: 0},
	type: ig.Entity.TYPE.A, 
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16 ),	

	// !flip = facing right, flip = facing left
	flip: false,
	
	// initial tile settings
	startTile: {x: 0, y: 0},
	previousTile: {x: -1, y: -1},
	
	// walking stuff
	walkSensitivity: 0.15, // # of seconds between turning around and walking
	walkTimer: null, // the timer that times turning to walking
	speed:60, // walk speed
	
	// dropped items
	droppedBomb: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
		this.addAnim( 'jump', 1, [9] );
		this.addAnim( 'fall', 0.4, [6,7] );
		
	},
	
	update: function() {
		
		// set current coordinates
		this.setTileCoords();
		
		// if the player has just entered a new tile
		if (this.standing && (this.tile.x != this.previousTile.x || this.tile.y != this.previousTile.y)) {
			// pick up any takeable items
			drops = ig.game.getEntitiesByType( EntityDrop );
			for (var i=0;i<drops.length;i++) {
				if (drops[i].takeable && drops[i].tile.x == this.tile.x && drops[i].tile.y == this.tile.y) {
					ig.game.takeLoot(drops[i]);
				}	
			}
			// also set the previous tile
			this.previousTile.x = this.tile.x;
			this.previousTile.y = this.tile.y;
		}
	
		// if player is on solid ground and not moving
        if (this.standing && this.vel.x == 0) {

            // allow turning and walking
            if (ig.input.state('left')) {
            	if (this.flip && (this.walkTimer == null || this.walkTimer.delta() > this.walkSensitivity)) {
            		if (ig.game.getMapTileMaterial(this.tile.y,this.tile.x-1)  == 0) {
                        this.vel.x = -this.speed;
                        this.targetX = (this.tile.x-1)*16+8-(this.size.x/2);
            		}	
            	} else if (!this.flip) {
            		this.walkTimer = new ig.Timer();
            	}
                this.flip = true;
            }
            else if (ig.input.state('right')) {
            	if (!this.flip && (this.walkTimer == null || this.walkTimer.delta() > this.walkSensitivity)) {
            		if (ig.game.getMapTileMaterial(this.tile.y,this.tile.x+1)  == 0) {
                        this.vel.x = this.speed;
                        this.targetX = (this.tile.x+1)*16+8-(this.size.x/2);
            		}
            	} else if (this.flip) {
            		this.walkTimer = new ig.Timer();
            	}
                this.flip = false;
            }
        
        // else if player is in motion
        } else {

        	// if the player has passed the target, stop moving
            if (this.flip && this.pos.x <= this.targetX) {
                this.vel.x = 0;
            }
            else if (!this.flip && this.pos.x >= this.targetX) {
            	this.vel.x = 0;
            }
            
        }
		
        // dropping stuff!
		if( ig.input.pressed('tnt') ) {
			this.drop();
		} else if( ig.input.pressed('explode') ) {
			this.detonate();
		}
		
		// set the current animation, based on the player's speed
		if( this.vel.y > 0 ) {
			this.currentAnim = this.anims.fall;
		} else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}
		this.currentAnim.flip.x = this.flip;
		
		// move!
		this.parent();
	},	
	
	drop: function() {
		if  (ig.game.countDroppable("TNT") > 0 && this.droppedBomb == null) {
			if (ig.game.getMapTileMaterial(this.tile.y,(this.flip ? this.tile.x-1 : this.tile.x+1)) == 0) {
				this.droppedBomb = ig.game.spawnEntity( EntityTNT, 0, this.pos.y+4);
				this.droppedBomb.pos.x = (this.tile.x + (this.flip ? -1 : 1)) * 16 + 8 - (this.droppedBomb.size.x/2);
				ig.game.loseDroppable("TNT");
			}
		}	
	},

	detonate: function() {
		if (this.droppedBomb != null) {
			if (this.droppedBomb.detonate())
				this.droppedBomb = null;
		}	
	}
	
});

});