$(document).ready(function() {

	tutorials = {
	'Tutorial: Basics'		: "Use the A and D keys to move Gus left and right.  Use the W and S keys to scroll up and down.  if you get stuck, press R to restart the level.  To drop TNT in front of Gus, click the button on the right.  to detonate TNT, press the Space Bar.  TNT will blow up any veins of ore that are adjacent to it.  Gus can only drop one stick of TNT at a time.  The goal of each level is to reach the bottom with the required amount of loot.",
	'Tutorial: Gravel 1'	: "You have a new tool at your disposal: gravel.  You drop gravel by pressing the gravel button (under the TNT button), but when it reaches the ground it piles up to form a solid block that you can stand on.",
	'Tutorial: Gravel 2'	: "Gravel blocks can be blown up with dynamite just like ore can.  When you blow it up, you'll be able to pick it up and use it later.",
	'Tutorial: Gravel 3'	: "When you drop gravel on top of loot, that loot is gone, even if you later blow up the gravel blocks.",
	'Tutorial: Directional' : "You have access to a new kind of bomb: a directional charge.  A directional charge does not blow up an entire vein of ore like TNT.  It just blows up a single block  in the direction that it's pointing.  Directional bombs are so powerful that they can blow up stone, leaving gravel behind that you can pick up and use. It's safe to stand next to a Directional Charge when it explodes as long as it's not pointing at you.",
	'Tutorial: Megabomb'	: "A mega bomb is like a directional charge in that it doesn't blow up entire veins of ore like TNT.  But it's more powerful than a directional charge.  Rather than blowing up one block in one direction, it can blows up in every direction, destroying up to 8 blocks.",
	'Tutorial: Futuristic'	: "This level features mysterious futuristic blocks which are impervious to any kind of explosives",
	'Tutorial: Anti-grav'	: "This level features mysterious futuristic blocks that can be dropped like gravel but hover above the ground when you drop them."
	}

	editor = (RegExp('editor' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
	levelParam = decodeURIComponent(decodeURI((RegExp('level' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
	
	for (i in levels) {
		var newOption = $('<option>'+i+'</option>').val(levels[i]);
		$('select').append(newOption);
		if ((newOption).val() == levelParam) {
			$("select").val(levelParam);
			if (i in tutorials){
				$('#tutorial').html(tutorials[i]);
			} 
		}
	}
	if ($('#tutorial').html() == '') { 
		$('#tutorial').hide();
	}
	
	if (editor !== null) {
		$('.editor-only').show();
	}

	$('select').live("change", function(){
		if ($('select').val() != '') {
			if (editor === null) {
				window.location='gus.html?level='+encodeURIComponent($('select').val());
			} else {
				window.location='gus.html?editor=true&level='+encodeURIComponent($('select').val());
			}	
		}
	});
	
	$('button').live("click", function(){
		if (levelParam == 'null') {
			window.location='level-editor/';
		} else {
			window.location='level-editor/?level='+encodeURIComponent(levelParam);
		}
	});
	
	$('input').val(levelParam);
	$('input').live("click", function(){$('input').select();});

});