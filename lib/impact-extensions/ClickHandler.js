/**
 * A module which can listen for clicks on any object that has the following properties: pos.x, pos.y, size.x, size.y
 *
 * usage:
 * myClickHandler.addClickListener(myObject, myCallback); // any time a click event on an object needs to be registered
 * clickHandler.update(); // every tick, presumably from an impact object's update() function
 *
 * If, when update() is called, a click is registered inside the object, (the x position of the click is between
 * between object.pos.x and object.pos.x+object.size.x, and the y position of the click is between between object.pos.y
 * and object.pos.y+object.size.y) the callback will be called.
 */
var ClickHandler;
ig.module(
        'impact-extensions.ClickHandler'
    ).requires(
        'impact.game',
        'impact.font'
    ).defines(function() {

        ClickHandler = ig.Class.extend({

            _listeners: [],

            init: function() {
                ig.input.bind(ig.KEY.MOUSE1, 'click');
            },

            addClickListener: function(entity, callback) {
                this._listeners.push({
                    entity: entity,
                    callback: callback
                })
            },

            update: function() {
                var self = this;
                if( ig.input.pressed('click') ) {
                    _.each(this._listeners, function(listener) {
                        if (self._isClicked(listener.entity)) {
                            listener.callback();
                        }
                    });
                }
            },

            _isClicked: function(entity) {
                return entity.pos.x <= ig.input.mouse.x
                    && ig.input.mouse.x <= entity.pos.x + entity.size.x
                    && entity.pos.y <= ig.input.mouse.y
                    && ig.input.mouse.y <= entity.pos.y + entity.size.y;
            }
        })
    });