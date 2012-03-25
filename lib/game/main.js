ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.loot',
	'game.levels.puzzle1'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// set gravity for all entities
	gravity: 300,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	tileSize:16,
	scrolled: false,
	level:null,
	
	init: function() {
		
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.Z, 'tnt' );
		ig.input.bind( ig.KEY.X, 'explode' );
		
		// Load the level and set a reference to it
		this.loadLevel( LevelPuzzle1 );
		this.level = LevelPuzzle1;
		
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// screen follows the player up and down
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player && !this.scrolled) {
			this.screen.x = -48;
			this.screen.y = Math.min(
					Math.max(0, // the top
							(player.pos.y - ig.system.height*.25)), // the player position plus scroll offset
					(this.level.layer[2].height*16 - ig.system.height) // the bottom
			);
		}
		
		// up and down keys scroll screen
		if ( ig.input.state('up') && this.screen.y > 0) {
			this.screen.y--;
			this.scrolled = true;
		} else if ( ig.input.state('down') && this.screen.y < (this.level.layer[2].height*16 - ig.system.height) ) {
			this.screen.y++;
			this.scrolled = true;
		} else if ( ig.input.state('left') || ig.input.state('right') ) {
			this.scrolled = false;
		}
		
		// clean up explosions
		var explosions = this.getEntitiesByType(EntityExplosion);
		if (explosions.length > 0 && explosions[0].anims.explode.loopCount > 0) {
			for (var i=0;i<explosions.length;i++) {
				console.log(explosions[i]);
				explosions[i].kill();
				explosions[i] = null;
			}
		}	
		
	},
	
	draw: function() {
		
		// Draw all entities and BackgroundMaps
		this.parent();
		
		// list droppables
		var lineCounter=0;
		this.font.draw( "--ITEMS--", 2, 2+(6*lineCounter) );
		lineCounter++;lineCounter++;
		for (type in this.level.droppable) {
			this.font.draw( type+":"+this.level.droppable[type], 2, 2+(6*lineCounter) );
			lineCounter++;
		}
		
		// list loot
		lineCounter++;
		this.font.draw( "--LOOT--", 2, 2+(6*lineCounter) );
		lineCounter++;lineCounter++;
		for (type in this.level.loot) {
			this.font.draw(this.level.loot[type]["name"]+":"+this.level.loot[type]["has"]+"/"+this.level.loot[type]["needs"], 2, 2+(6*lineCounter));
			lineCounter++;
		}
		
		// temp exp counter 
		lineCounter++;
		var explosions = this.getEntitiesByType(EntityExplosion);
		this.font.draw(explosions.length, 2, 2+(6*lineCounter) );
		
	},
	
	// destroy a map tile
	destroyMapTile: function(y, x) {
		xOffset = Math.floor(Math.random()*11);
		this.spawnEntity( EntityLoot, x*16+xOffset, y*16+8, {lootType: this.getMapTileMaterial(y,x)});
	},
	
	// check a map tile's material
	getMapTileMaterial: function(y,x) {
		return this.level.layer[2].data[y][x];
	},
	
	// functions for manipulating inventory items
	takeLoot: function(lootEntity) {
		this.level.loot[lootEntity.lootType].has++;
		lootEntity.kill();
		lootEntity = null;
	},
	takeDroppable: function(droppableEntity) {
		// this.level.droppable[droppable.droppableType]++;
	},
	loseDroppable: function(droppable) {
		this.level.droppable[droppable]--;
	},
	countDroppable: function(droppable) {
		return this.level.droppable[droppable];
	},
	
});

// (canvas element, game object, fps, width, height, scale)
ig.main( '#canvas', MyGame, 60, 144, 128, 4);

});
