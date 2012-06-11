ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.loot',
	'game.levels.sunset',
	'game.levels.tutorial',
	'game.levels.1',
	'game.levels.2',
	'game.levels.3'
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
	levelNumber:3,
	levelArray:null,
	player:null,
	timer:null,
	tutorial:false,
	tutorialStep:0,
	tutorialText:null,
	finishedDemo:false,
	inventoryButtons:null,
	inventoryButtonHeight:12,
	inventoryButtonSpace:4,
	
	
	init: function() {
		
		this.levelNumber = parseInt(location.search.substring(1));
		
			var torch = new ig.AnimationSheet( 'media/minetiles2.png', 16, 16 );
			this.backgroundAnims['media/minetiles2.png'] = {
				10: new ig.Animation( torch, 0.1, [10,11,12,13] )
			};
		
		// Bind keys
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.Z, 'tnt' );
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY.X, 'explode' );
		ig.input.bind( ig.KEY.C, 'gravel' );
		ig.input.bind( ig.KEY.SPACE, 'restart' );
		
		// set up array of levels
		this.levelArray = [LevelTutorial, Level1, Level2, Level3];
		
		// load level
		this.loadMine();
		
		//this.invtest = new ig.Image( 'media/tnt_icon.png' );
		console.log(EntityLoot);

	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// define player
		if (!this.player) {
			this.player = this.getEntitiesByType( EntityPlayer )[0];
		}
		
		// screen follows the player up and down
		if( this.player && !this.scrolled) {
			this.screen.x = 0;
			this.screen.y = Math.min(
					Math.max(0, // the top
							(this.player.pos.y - ig.system.height*.25)), // the player position plus scroll offset
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

		// button click
		if ( ig.input.state('click')) {
			if (100 < ig.input.mouse.x && ig.input.mouse.x < 140) {
				var buttonCounter = 0;
				var buttonStart = 0;
				for (droppable in this.inventoryButtons) {
					buttonStart = this.inventoryButtonSpace+(buttonCounter*(this.inventoryButtonHeight+this.inventoryButtonSpace));
					if (buttonStart < ig.input.mouse.y && ig.input.mouse.y < buttonStart+this.inventoryButtonHeight) {
						console.log(this.inventoryButtons[droppable][2]);
					}
					buttonCounter++;
				}
				
			}
		}

		// clean up explosions
		var explosions = this.getEntitiesByType(EntityExplosion);
		if (explosions.length > 0 && explosions[0].anims.explode.loopCount > 0) {
			for (var i=0;i<explosions.length;i++) {
				explosions[i].kill();
				explosions[i] = null;
			}
		}	
		
		// check for death
		if (this.player.health == 0 && explosions.length == 0) {
			alert("You have blown yourself up.");
			this.loadMine();
		}
		
		// check for end
		if (this.player.standing && this.player.tile.y == this.level.layer[2].data.length-2) {
			if (this.timer == null) {
				this.timer = new ig.Timer();
			} else if (this.timer.delta() > 0.3) {
				var wonLevel = true;
				for (type in this.level.loot) {
					if (this.level.loot[type]["has"] < this.level.loot[type]["needs"]) {
						var wonLevel = false;
					}
				}
				if (wonLevel) {
					if (this.tutorial) {
						//alert("You finished the tutorial.  Congrats!  This demo has three more levels for you to play, each a bit more piuzzling than the last.  Click OK to proceed to the next level."); //You finished the tutorial.  Congrats!  In later levels you will get new types of explosives and other tools.  When you get to those levels, more instruction boxes like this one will pop up to help you out.  Until then, good luck!  Press ENTER to proceed to the next level. 				
						//this.levelNumber++;
						//this.loadMine();
					} else {
						//if (this.levelNumber < this.levelArray.length-1) {
							//alert("Well done!  Click ok to proceed to the next level.");
							//this.levelNumber++;
							//this.loadMine();	
						/*} else*/ if (!this.finishedDemo) {
							//alert("You have finished the alpha demo!  Good job!  Be sure to give Jim any feedback you might have.");
							alert("success");
							this.finishedDemo = true;
							this.player.kill();
						}
					}
				} else {
					alert("you reached the bottom but you didn't collect everything you needed.  Try again.");
					this.loadMine();
				}
			}
		}
		
		if (this.tutorial) {
			this.doTutorial();
		}
		
		if (ig.input.state('restart')) {
			this.loadMine();
		}
		
		//TODO if dropped object is dead, nullify it
		
	},
	
	draw: function() {
		
		// Draw all entities and BackgroundMaps
		this.parent();
		
		// list droppables
		/* var lineCounter=0;
		this.font.draw( "--ITEMS--", 98, 2+(6*lineCounter) );
		lineCounter++;lineCounter++;
		for (type in this.level.droppable) {
			this.font.draw( type+":"+this.level.droppable[type], 98, 2+(6*lineCounter) );
			lineCounter++;
		}*/
		
		//this.invtest.draw( 100, 4 );
		//for (type in this.level.droppable) {
		//	this.font.draw( "x "+this.level.droppable[type], 117, 8 );
		//}
		//this.font.draw( "x 4", 117, 8);
		
		var sideBarY = this.inventoryButtonSpace;
		
		for (droppable in this.inventoryButtons) {
			this.inventoryButtons[droppable][0].draw(100, sideBarY);
			this.inventoryButtons[droppable][1].draw(107, sideBarY+2);
			this.font.draw( "x "+this.level.droppable[droppable], 117, sideBarY+4 );
			var sideBarY = sideBarY + this.inventoryButtonHeight + this.inventoryButtonSpace;
		}
		
		// list loot
		var lineCounter=3;
		lineCounter++;
		this.font.draw( "--LOOT--", 98, sideBarY+(6*lineCounter) );
		lineCounter++;lineCounter++;
		for (type in this.level.loot) {
			this.font.draw(this.level.loot[type]["name"]+":"+this.level.loot[type]["has"]+"/"+this.level.loot[type]["needs"], 98, sideBarY+(6*lineCounter));
			lineCounter++;
		}
		
		
		
	},
	
	// destroy a map tile
	destroyMapTile: function(y, x) {
		// drop 
		xOffset = Math.floor(Math.random()*11+1);
		this.spawnEntity( EntityLoot, x*16+xOffset, y*16+8, {lootType: this.getMapTileMaterial(y,x)});
		// modify tilemap and collision map
		this.level.layer[2].data[y][x] = 0;
		this.level.layer[1].data[y][x] = 0;
	},
	
	// add gravel
	addGravelTile: function(y, x) {
		console.log(x+" "+y);
		this.level.layer[2].data[y][x] = 3;
		this.level.layer[1].data[y][x] = 1;
	},
	
	// kill the player if they are at the given coordinates
	killAt: function(y,x) {
		if (this.player && this.player.tile.y == y && this.player.tile.x == x) {
			this.player.receiveDamage( 10, null);
		}
	},
	
	// check a map tile's material
	getMapTileMaterial: function(y,x) {
		return this.level.layer[2].data[y][x];
	},
	
	// functions for manipulating inventory items
	takeLoot: function(lootEntity) {
		if (this.level.loot.hasOwnProperty(lootEntity.lootType)) {
			this.level.loot[lootEntity.lootType].has++;
		}
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
	
	// function for loading a level
	loadMine: function() {
		
		// tutorial for first level
		if (this.levelNumber == 0) {
			//this.tutorial = true;
		} else {
			this.tutorial = false;
		}
		
		// reset everything
		this.timer = null;
		this.player = null;
		this.scrolled = false;
		
		// copy and load level
		this.level = jQuery.extend(true, {}, this.levelArray[this.levelNumber]); // create a copy of the current level
		this.loadLevelDeferred( this.level );
		
		// create inventory buttons
		this.inventoryButtons = new Object();
		for (droppable in this.level.droppable) {
			this.inventoryButtons[droppable] = [
				new ig.Image( 'media/button.png' ),
				new ig.Image( 'media/drop_'+droppable+'.png' ),
				droppable
			];
		}
		
		// prep tutorial
		if (this.tutorial) {
			this.tutorialText = [
				"Welcome to the alpha demo for this as-of-yet unnamed puzzle game!  That guy at the top of the screen is The Miner.  For now he looks suspiciously like Mario.  That will change in the finished version of this game.  In fact almost everything will change except the core gameplay, which you are about to experience!  Anyway, back to The Miner.  All he wants to do is dig down, down, down and collect precious ore and gems.",
				"Before he can dig, he must learn to walk.  The left and right arrow keys will move the miner.  Use the right arrow key to make him walk all the way to the other side of the screen.",
				"Good! Tapping the left or right arrow key when the miner is facing the other direction will turn him around without walking.  Tap the left arrow key to turn around without walking.",
				"The dark gray squares are granite rock, which is impervious to your current explosives.  The lighter gray squares are veins of Iron!  Move the miner so he is standing next to the iron and facing it.",
				"The miner wants to collect some precious iron ore!  To collect ore, first you need to blow it up.  Press the Z key to drop a stick of dynamite in the square that you are facing.",
				"To the left, under the ITEMS heading, it shows you how much TNT you have left.  You started with 5.  Now you have 4.  On each level you will have different numbers (and, later, different types) of explosives.  Use them wisely!",
				"Next you need to detonate the TNT.  But if you stand next to it when it explodes, you will get all blowed up.  Walk away so you are not next to it anymore.",
				"Ok here we go!  Press the X key to detonate the TNT!",
				"The TNT exploded and some iron ore dropped down from where the vein was.  Go ahead and walk over the hole.  You will fall down but that's ok, falling doesn't hurt you.  You will automatically pick up the iron ore when you reach the bottom.",
				"Over on the left, under LOOT, it now says iron:1/8.  That means you have collected 1 iron out of the 8 that you need to win this board.  It also says copper: 0/3.  Different levels will have different ore requirements, so when you start a new level, make sure to check that out.  For this level, if you reach the bottom with at least 8 iron and 3 copper, you win!  If you reach the bottom and you haven't collected enough ore, you will have to start over!",
				"But where is the bottom?  Use the down arrow to scroll all the way down to the bottom",
				"That empty row near the bottom is your destination.  Now use up arrow to scroll all the way back up to the top.",
				"You could walk to your right and fall in the hole.  But then you will be stuck with nowhere to go and nowhere to place dynamite!  Instead, try facing right and dropping dynamite down the hole.  Then detonate it.  (this is a good time to mention that, if you ever get stuck, press the space bar to restart the level)",
				"Nice!  Notice that, with just one stick of dynamite, you blew up the entire vein of iron!  That's how dynamite works: any vein directly below, above or next to the dynamite gets completely blown up. But the dynamite didn't blow up the any of that orange copper vein.  To do that you will need to place dynamite in the square next to it.  Go down and get all that iron ore, then blow up the copper vein without blowing yourself up.",
				"Sweet.  Now collect the copper ore.",
				"You should have all the ore you need to win this level!  But you still need to get to the bottom.  That shouldn't be too hard for you."
				];
		} else {
			this.tutorialText = null;
		}
		
	},
	
	// tutorial function
	doTutorial: function() {
		
		if (this.tutorialStep == 15 && this.player.tile.y == 7) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 14 && this.getMapTileMaterial(5,1) == 0) {
			this.tutorialTimer();
		} else if (this.tutorialStep <= 13 && this.getMapTileMaterial(4,2) == 0) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 12 && !ig.input.state('up') && !ig.input.state('down') && this.screen.y == 0) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 11 && !ig.input.state('up') && !ig.input.state('down') && this.screen.y == (this.level.layer[2].height*16 - ig.system.height)) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 10) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 9 && this.player.tile.y == 2) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 8 && this.player.droppedBomb == null) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 7 && this.player.tile.x == 3) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 6) {
			this.tutorialTimer();
		} else if (this.tutorialStep <= 5 && this.player.droppedBomb != null && this.player.droppedBomb.tile.x == 1) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 4 && this.player.tile.x == 2 && this.player.flip) {
			this.tutorialTimer();
		} else if (this.tutorialStep <= 3 && this.player.tile.x == 5 && this.player.flip) {
			this.tutorialTimer();
		} else if (this.tutorialStep <= 2 && this.player.tile.x == 5) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 1) {
			this.tutorialTimer();
		} else if (this.tutorialStep == 0) {
			this.tutorialTimer();
		}
	},
	
	tutorialTimer: function() {
		if (this.timer == null) {
			this.timer = new ig.Timer();
		} else if (this.timer.delta() > 0.5) {
			alert(this.tutorialText[this.tutorialStep]);
			this.tutorialStep++;
			this.timer = null;
		}
	}
	
});

// (canvas element, game object, fps, width, height, scale)
ig.main( '#canvas', MyGame, 60, 144, 128, 4);

});
