/**
 *  class for gravel
 */

ig.module(
	'game.entities.gravel'
)
.requires(
	'game.entities.drop'
)
.defines(function(){

//TNT
EntityGravel = EntityDrop.extend({

	// impact entity properties
	size: {x: 16, y: 16},
	offset: {x: 0, y: 0},
	animSheet:null,
	bounciness: 0.0,
	timer:null,
		
	// custom properties
	takeable:false,
	
	init: function( x, y, settings ) {
		this.animSheet = new ig.AnimationSheet( 'media/gravel.png', 16, 16 ),
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},
	
	update: function() {
		
		this.parent();
		
		if (this.standing && this.timer == null) {
			this.timer = new ig.Timer();
		}
		
		if (this.timer != null && this.timer.delta() > 0.1) {
			ig.game.addGravelTile(this.tile.y,this.tile.x);
			this.kill();
		}
		

		
	}
	
});


});