/**
 * an ig.Game module representing everything that happens when the game fist starts, before the main menu appears.
 * For now it just says "iffy pixel" for 2 seconds.
 */
var SplashScreen;
ig.module(
        'game.screens.SplashScreen'
).requires(
    'impact.game',
    'impact.font',
    'impact-extensions.FloatLayout',
    'game.screens.Menu'
).defines(function() {
    SplashScreen = ig.Game.extend({

        timer: null,
        layout: null,

        init: function() {

            // create a font object
            var font = new ig.Font('media/04b03.font.png');

            // create a simple layout
            this.layout = new FloatLayout(
                {
                    align: "center",
                    floatFrom: "top",
                    marginTop: ig.system.height/2 - font.height/2
                },
                [
                    {
                        item: font,
                        text: "iffy pixel"
                    }
                ]
            );

            // start the timer
            this.timer = new ig.Timer();
        },

        draw: function() {
            this.parent();
            this.layout.draw();
        },

        update: function() {
            if (this.timer.delta() >= 2) {
                ig.system.setGame(Menu);
            }
        }

    })
});