/**
 * an ig.Game module representing the main menu screen. It shows a logo and. after a second, shows links to start or
 * continue playing.
 */
var Menu;
ig.module(
        'game.screens.Menu'
    ).requires(
        'impact.game',
        'impact.font',
        'impact-extensions.FloatLayout',
        'impact-extensions.ClickHandler'
    ).defines(function() {
        Menu = ig.Game.extend({

            timer: null,

            init: function() {

                // create a layout with a logo and some text
                this.layout = new FloatLayout(
                    {
                        align: "center",
                        floatFrom: "top",
                        marginTop: 100
                    },
                    [
                        {
                            item: new ig.Image( 'media/alpha_logo.png' )
                        },
                        {
                            margin:5,
                            item: new ig.Font('media/04b03.font.png'),
                            text: "pre-alpha demo"
                        }

                    ]
                );

                // start the timer
                this.timer = new ig.Timer();

                // links to be added later
                this.startLink = {
                    margin:25,
                    item: new ig.Font('media/04b03.font.png'),
                    text: "Start"
                };
                this.continueLink = {
                    margin:5,
                    item: new ig.Font('media/04b03.font.png'),
                    text: "Continue"
                };

                // listen for clicks on the links
                this.clickHandler = new ClickHandler();
                this.clickHandler.addClickListener(this.startLink, _.bind(this._startClick, this));
                this.clickHandler.addClickListener(this.continueLink, _.bind(this._continueClick, this));
            },

            draw: function() {
                this.parent();
                this.layout.draw();
            },

            update: function() {
                this.parent();

                // add links to the layout after 1 second
                if (this.timer.delta() >= 1) {
                    this.layout.spliceElements(2, 0, this.startLink, this.continueLink);
                    this.timer.reset();
                    this.timer.pause();
                }

                // update the click handler
                this.clickHandler.update();
            },

            _startClick: function() {
                console.log("start");
            },

            _continueClick: function() {
                console.log("continue");
            }
        })
    });