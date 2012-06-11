ig.module( 'game.levels.sunset' )
.requires('impact.image','game.entities.player')
.defines(function(){
LevelSunset={
	
	// This is where all items in the players inventory should be listed
	"droppable":{
		"TNT":1
	},
	
	// This is where the loot goals of the level should be listed
	"loot":{
		"6":{"name":"Iron","has":0,"needs":2},
	},
	
	"entities":[{"type":"EntityPlayer","x":4,"y":18}],
	
	"layer":[
	
		{"name":"background",
		"width":6,
		"height":14, // The height of the level
		"linkWithCollision":false,
		"visible":1,
		"tilesetName":"media/minetiles2.png",
		"repeat":false,
		"preRender":false,
		"distance":"1",
		"tilesize":16,
		"foreground":false,
		"data":[
			// the background layer
			[16,17,18,19,20,5],
			[21,22,23,24,25,15],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,11,1,1,11,1],
			[1,1,1,1,1,1]
		]},
		
		{"name":"collision",
		"width":6,
		"height":14, // The height of the level again
		"linkWithCollision":false,
		"visible":1,
		"tilesetName":"",
		"repeat":false,
		"preRender":false,
		"distance":1,
		"tilesize":16,
		"foreground":false,
		"data":[
			// the collision layer
			// 0 = empty
			// 1 = solid
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[1,1,1,0,1,1],
			[1,1,1,0,1,1],
			[1,1,1,0,1,1],
			[1,1,1,0,0,1],
			[1,1,1,1,0,1],
			[1,1,1,1,0,1],
			[1,1,1,1,0,1],
			[0,1,0,0,0,1],
			[0,1,0,0,0,1],
			[0,1,1,1,1,1],
			[0,0,0,0,0,0],
			[1,1,1,1,1,1]
		]},
		
		{"name":"map",
		"width":6,
		"height":14, // The height of the level again
		"linkWithCollision":true,
		"visible":1,
		"tilesetName":"media/minetiles2.png",
		"repeat":false,
		"preRender":false,
		"distance":"1",
		"tilesize":16,
		"foreground":false,
		"data":[
			// the map layer
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[2,2,2,0,2,2],
			[2,2,2,0,2,2],
			[2,2,2,0,2,2],
			[2,2,2,0,0,2],
			[2,2,2,2,0,2],
			[2,2,2,2,0,2],
			[2,2,2,2,0,2],
			[0,6,0,0,0,2],
			[0,6,0,0,0,2],
			[0,2,2,2,2,2],
			[0,0,0,0,0,0],
			[2,2,2,2,2,2]
		]},
		
		
		{"name":"map",
		"width":6,
		"height":2, // The height of the level again
		"linkWithCollision":false,
		"visible":1,
		"tilesetName":"media/sunset.png",
		"repeat":false,
		"preRender":false,
		"distance":"1",
		"tilesize":16,
		"foreground":false,
		"data":[
			// the map layer
			[0,0,0,0,0,0],
			[0,0,0,0,0,0]
		]}
		
	]
};
LevelSunsetResources=[new ig.Image('media/minetiles2.png'), new ig.Image('media/sunset.png'),];
});