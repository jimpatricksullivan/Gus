/**
 *  class for explosion effect
 */

ig.module(
	'game.entities.explosion'
)
.requires(
	'impact.entity'
)
.defines(function(){

	//explosion
	EntityExplosion = ig.Entity.extend({
		size: {x: 16, y: 16},
		offset: {x: 0, y: 0},
		maxVel: {x: 200, y: 200},
		gravityFactor: 0,
		
		
		// The fraction of force with which this entity bounces back in collisions
		bounciness: 0.2, 
		
		type: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
			
		animSheet: new ig.AnimationSheet( 'media/explosion.png', 16, 16 ),
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'explode', .05, [0,1,2,3,4,5], true );
		},
			
	});


});