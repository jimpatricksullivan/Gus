/**
 * A module responsible for calculating the size of the game and loading up the splash screen.
 */
var Launcher;
ig.module(
        'game.main'
    ).requires(
        'impact.game',
        'game.screens.SplashScreen'
    ).defines(function(){

        // some constants for this game
        var PIXEL_WIDTH_OF_GAME = 320;
        var PIXEL_HEIGHT_OF_GAME = 240;
        var FPS_OF_GAME = 60;

        // get scale for game that allows maximum size on screen
        var scale = 4;
        var aspectRatio = $(window).width()/$(window).height();
        if (aspectRatio > 4/3) {
            scale = Math.floor($(window).height() / PIXEL_HEIGHT_OF_GAME)
        } else {
            scale = Math.floor($(window).width() / PIXEL_WIDTH_OF_GAME)
        }

        // A simple game class that redirects to the first screen we are interested in
        Launcher = ig.Game.extend({
            update: function() {
                ig.system.setGame(SplashScreen);
            }
        });

        // launch the game
        ig.main('#canvas', Launcher, FPS_OF_GAME, PIXEL_WIDTH_OF_GAME, PIXEL_HEIGHT_OF_GAME, scale);
    });
