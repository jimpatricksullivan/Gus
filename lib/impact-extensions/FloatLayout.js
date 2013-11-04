/**
 * FloatLayouts are for laying out Image and Font objects (and potentially subclasses of Image and Font objects)
 * that don't change much, e.g. splash screens, game menus, buttons, etc.
 *
 * Construct a FloatLayout in a game's init() function. Then draw() the layout in a game's draw() function.
 *
 * You can add elements to a layout by calling spliceElements(). While LayoutElement.draw() is pretty fast,
 * init() and spliceElement() cause a bunch of work to be done. Not so much that you'll notice if you use them
 * liberally, but if you find yourself calling init() or spliceElement() often (like every tick), you probably
 * shouldn't be using this class.
 * (not entirely true - draw is slow if it hasn't been called since init or spliceElement)
 *
 * TODO elements need their own class? It would make classes that use this class more readable.
 */
var FloatLayout;
ig.module(
        'impact-extensions.FloatLayout'
    ).requires(
        'impact.game',
        'impact.font'
    ).defines(function() {
        FloatLayout = ig.Class.extend({

            _options: {
                floatFrom: 'top',
                align: 'left',
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0
            },

            _positionsCalculated: false,
            _elements: [],
            size: {
                x: 0,
                y: 0
            },

            /**
             * TODO more docs
             * @param options TODO improve descrip
             * @param elements
             *     item: Font object or Image object (maybe subclass)
             *     margin: (optional) number of scaled pixels between previous element and this one
             *     text: (include this property if and only if element is a Font object) text to write
             */
            init: function(options, elements) {
                var self = this;
                _.extend(this._options, options || {});

                // push elements into layout
                _.each(elements, function(element) {
                    self._elements.push(element);
                });
            },

            /**
             * This method will add/remove elements in your layout. It takes the exact same arguments as Array.splice().
             * In fact, it uses Array.splice() under the hood to splice the elements array. Your layout will then be
             * re-laid-out on the next call to draw().
             */
            spliceElements: function() {
                Array.prototype.splice.apply(this._elements, arguments);
                this._positionsCalculated = false;
            },
            
            /**
             * Draws each element as per the options passed into the constructor.
             */
            draw: function() {
                if (!this._positionsCalculated) {
                    this._calculateWidthAndHeightForEachElement();
                    this._calculateTotalWidthAndHeight();
                    this._calculateCoordinatesForEachElement();
                    this._positionsCalculated = true;
                }
                _.each(this._elements, function(element) {
                    if (element.text) {
                        element.item.draw(element.text, element.pos.x, element.pos.y, ig.Font.ALIGN.LEFT);
                    } else {
                        element.item.draw(element.pos.x, element.pos.y);
                    }
                });
            },

            _calculateWidthAndHeightForEachElement: function() {
                _.each(this._elements, function(element) {
                    element.size = {};
                    element.size.x = (element.text) ? element.item.widthForString(element.text) : element.item.width;
                    element.size.y = element.item.height;
                    if (element.size.y == 0 || element.size.x == 0) {
                        throw "Invalid Layout Element Dimensions";
                    }
                });
            },

            _calculateTotalWidthAndHeight: function() {
                var self = this;
                _.each(this._elements, function(element) {
                    if (self._options.floatFrom == "top" || self._options.floatFrom == "bottom") {
                        // for vertical layouts, we need the maximum width plus the total of heights and margins
                        self.size.x = Math.max(self.size.x, element.size.x);
                        self.size.y += element.margin + element.size.y;
                    } else {
                        // for horizontal layouts, we need the maximum height plus the total of widths and margins
                        self.size.x += element.margin + element.size.x;
                        self.size.y = Math.max(self.size.y, element.size.y);
                    }
                });
            },

            _calculateCoordinatesForEachElement: function() {
                var self = this;

                // The floatPixelIndex tracks the increasing number of pixels from the float edge.
                // For example, if float is "right", floatPixelIndex is the increasing number of pixels to the left
                // of marginRight
                var floatPixelIndex = 0;

                // initialize the floatPixelIndex with the distance away from the edge we are floating from
                switch(this._options.floatFrom) {
                    case "top":
                        floatPixelIndex += this._options.marginTop;
                        break;
                    case "right":
                        floatPixelIndex += this._options.marginRight;
                        break;
                    case "bottom":
                        floatPixelIndex += this._options.marginBottom;
                        break;
                    case "left":
                        floatPixelIndex += this._options.marginLeft;
                        break;
                }

                _.each(this._elements, function(element) {
                    element.pos = {};

                    // add the element's margin to the index
                    floatPixelIndex += element.margin || 0;

                    // get the coordinate parallel to the float (x for horizontal, y for vertical)
                    switch(self._options.floatFrom) {
                        // for top or left, this is just the index
                        case "top":
                            element.pos.y = floatPixelIndex;
                            break;
                        case "left":
                            element.pos.x = floatPixelIndex;
                            break;
                        // for right or bottom, start from the end and subtract the index plus the element's dimension
                        case "right":
                            element.pos.x = ig.system.width - (floatPixelIndex + element.size.x);
                            break;
                        case "bottom":
                            element.pos.y = ig.system.height - (floatPixelIndex + element.size.y);
                            break;
                    }

                    // get the coordinate perpendicular to the float (y for horizontal, x for vertical)
                    if (self._options.floatFrom == "top" || self._options.floatFrom == "bottom") {
                        element.pos.x = self._getPerpendicularCoordinate(self._options.marginLeft,
                            self._options.marginRight, element.size.x, self.size.x, ig.system.width)
                    } else {
                        element.y = self._getPerpendicularCoordinate(self._options.marginTop,
                            self._options.marginBottom, element.size.y, self.size.y, ig.system.height)
                    }

                    // add this object's parallel dimension to the index
                    if (self._options.floatFrom == "top" || self._options.floatFrom == "bottom") {
                        floatPixelIndex += element.size.y;
                    } else {
                        floatPixelIndex += element.size.x;
                    }
                });
            },

            /**
             * Gets the coordinate perpendicular to the float direction for a given element. For example, if you are
             * floating left-to-right, this returns the Y coordinate for an element.
             *
             * @param closeMargin the perpendicular margin closer to the origin
             * @param farMargin the perpendicular margin farther from the origin
             * @param elementDimension the perpendicular dimension of this element
             * @param layoutDimension the perpendicular dimension of the entire layout
             * @param gameDimension the perpendicular dimension of the entire game
             */
            _getPerpendicularCoordinate: function(closeMargin, farMargin, elementDimension,
                                                  layoutDimension, gameDimension) {
                if (this._options.align == "bottom" || this._options.align == "right") {
                    // if we are aligning away from the origin, start from the far end and go back margin + element size
                    return gameDimension - (farMargin + elementDimension);
                } else if (this._options.align == "center") {
                    // for center align, we get to the middle of the layout and then go back half the element size
                    var halfLayoutDimension = ((gameDimension - farMargin) - closeMargin) / 2;
                    return (closeMargin + halfLayoutDimension) - elementDimension/2;
                } else {
                    // for alignment towards the origin, we just hug the closer margin
                    return closeMargin;
                }
            }

        })
    });