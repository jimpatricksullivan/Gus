var height = 10;

getPosition = function(index, size) {
    var x = index * size;
    var y = parseInt(x/(size*6))*size;
    x = parseInt(x % (size*6) );
    return {x:x,y:y};
};

updateLevel = function(levelObject) {
    //"map":[[0,0,0,0,0,0],[2,9,9,9,9,2],[2,2,2,8,0,2],[2,2,2,8,0,2],[2,2,0,2,2,2],[0,0,0,2,2,2],[0,2,0,2,2,2],[0,2,2,2,2,2],[0,0,0,0,0,0],[2,2,2,2,2,2]]}
     $('div.block').remove();
    var droppables = levelObject.droppable;
    for (droppable in droppables) {
        $('input[data-droppable='+droppable+']').val(droppables[droppable]); 
    }
    var loots = levelObject.loot;
    for (loot in loots) {
        lootObject = loots[loot];
        if (lootObject !== null) {
            $('input[data-loot='+lootObject.name+']').val(lootObject.needs); 
        }
    }
    var map = levelObject.map;
    height = 0;
    var i = 0;
    for (y in map) {
        for (x in map[y]) {
            $('#level').append('<div class="block" data-block-id="'+i+'"></div>');
            var cell = $('div[data-block-id="'+i+'"]');
            var cellPosition = getPosition(i, 66);
            cell.css('left', cellPosition.x);
            cell.css('top', cellPosition.y);
            cell.css('background', 'url(media/'+map[y][x]+'.png)');
            cell.attr('data-tile', map[y][x]);
            cell.attr('data-y', y);
            cell.attr('data-x', x);    
            i++;
        }
        height++;
    }
}
 
    
updateJson = function() { 
    
    // make droppable array
    droppableObject = {};
    $('#droppables span input').each(function(i) {
        droppableObject[$(this).attr('data-droppable')] = $(this).val();
    });
    
    // make loot array
    lootArray = [null,null,null,null,null,null];
    $('#loot span input').each(function(i) {
        var lootObject = {
            name:$(this).attr('data-loot'),
            has:0,
            needs:$(this).val()
        };
        lootArray.push(lootObject);
    });
    
    // make tile map
    var tileMap = [];
    for (y=0;y<height;y++) {
        tileMap[y] = [];
        for (x=0;x<6;x++) {
            //console.log(y+','+x+':'+parseInt($('.block[data-x="'+x+'"][data-y="'+y+'"]').attr('data-tile')));
            //console.log($('.block[data-x="'+x+'"][data-y="'+y+'"]'));
            tileMap[y][x] = parseInt($('.block[data-x="'+x+'"][data-y="'+y+'"]').attr('data-tile'));
        }
    }
    
    // level object
    var levelObject = {
        droppable: droppableObject,
        loot: lootArray,
        map:  tileMap
    }
    
    $('#json-wrap input').val(JSON.stringify(levelObject));
    
};

$(document).ready(function() {
    
    var currentBrush = 0;
    var drawing = false;
    
    // droppable form
    var droppables = ['tnt','gravel','directional-up','directional-right','directional-down','directional-left','mega','anti-grav'];
    for (i=0; i<8; i++) {
        $('#droppables').append("<span>"+droppables[i]+": <input class='count' data-droppable='"+droppables[i]+"' type='text' value='0'></span>");
    }
        
    // loot form
    var loot = ['iron','copper','silver','gold','diamond'];
    for (i=0; i<5; i++) {
        $('#loot').append("<span>"+loot[i]+": <input class='count' data-loot='"+loot[i]+"' type='text' value='0'></span>");
    }
    
    // build palette
    for (i=0; i<18; i++) {
        var brushID = i;
        if (brushID > 0) brushID++;
        $('#palette').append('<div class="brush" brush-id="'+brushID+'"></div>');
        var cell = $('div[brush-id="'+brushID+'"]');
        var cellPosition = getPosition(i, 66);
        cell.css('left', cellPosition.x);
        cell.css('top', cellPosition.y);
        cell.css('background', 'url(media/'+brushID+'.png)')
      }

    // build level map
    var x = 0;
    var y = 0;
    for (i=0; i<60; i++) {
        $('#level').append('<div class="block" data-block-id="'+i+'"></div>');
        var cell = $('div[data-block-id="'+i+'"]');
        var cellPosition = getPosition(i, 66);
        cell.css('left', cellPosition.x);
        cell.css('top', cellPosition.y);
        cell.css('background', 'url(media/0.png)');
        cell.attr('data-tile', 0);
        cell.attr('data-y', y);
        cell.attr('data-x', x);
        x++;
        if (x > 5) {
            x = 0;
            y++;
        }
      }

    // painting actions
    $('div.brush').live("click", function(){
        $('div.brush').css('border', '1px solid black');
        $(this).css('border', '1px solid white');
        currentBrush = $(this).attr('brush-id');
    });
    $('div.block').live("mousedown", function(){
        $(this).css('background', 'url(media/'+currentBrush+'.png)');
        $(this).attr('data-tile', currentBrush);
        updateJson();
        drawing = true;
    });
    $('div.block').live("mouseenter", function(){
        if (drawing) {
            $(this).css('background', 'url(media/'+currentBrush+'.png)');
            $(this).attr('data-tile', currentBrush);
            updateJson();
        }
    });
    $(document).live("mouseup", function(){
        drawing = false;
    });
    
    // changing count fields
    $('input.count').live("keyup", function(){
        updateJson();
    });
        

    // changing count fields
    $('button#play-level').live("click", function(){

        var uri="../gus.html?editor=true&level="+encodeURIComponent($('#json-wrap input').val());
        window.location = uri;

    });
        
    // changing count fields
    $('#level-height button').live("click", function(){
        var newHeight = parseInt($('#level-height input').val());
        if (newHeight < height) {
            $(".block").each( function(i) {
                if ($(this).attr('data-block-id') > (newHeight*6)-1) {
                    $(this).remove();
                }
            })
        } else if (newHeight > height) {
            var x = 0;
            var y = height;
            for (i=(height*6); i<(newHeight*6); i++) {
                $('#level').append('<div class="block" data-block-id="'+i+'"></div>');
                var cell = $('div[data-block-id="'+i+'"]');
                var cellPosition = getPosition(i, 66);
                cell.css('left', cellPosition.x);
                cell.css('top', cellPosition.y);
                cell.css('background', 'url(media/0.png)');
                cell.attr('data-tile', 0);
                cell.attr('data-y', y);
                cell.attr('data-x', x);
                x++;
                if (x > 5) {
                    x = 0;
                    y++;
                }
              }            
        }
        height = newHeight;
    });

    // changing count fields
    $('#json-wrap button').live("click", function(){
        updateLevel(JSON.parse($('#json-wrap input').val()));
    });

    levelParam = decodeURIComponent(decodeURI((RegExp('level' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
    if (levelParam == 'null') {
        updateJson();
    } else {
        $('#json-wrap input').val(levelParam);
        updateLevel(JSON.parse(levelParam));
    }
    

});




