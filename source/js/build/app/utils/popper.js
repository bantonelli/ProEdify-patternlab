define(['module'], function (module) {
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    /**
     * @fileOverview Kickass library to create and place poppers near their reference elements.
     * @version {{version}}
     * @license
     * Copyright (c) 2016 Federico Zivolo and contributors
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */

    //
    // Cross module loader
    // Supported: Node, AMD, Browser globals
    //
    ;(function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(factory);
        } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like environments that support module.exports,
            // like Node.
            module.exports = factory();
        } else {
            // Browser globals (root is window)
            root.Popper = factory();
        }
    })(undefined, function () {

        'use strict';

        var root = window;

        // default options
        var DEFAULTS = {
            // placement of the popper
            placement: 'bottom',

            gpuAcceleration: true,

            // shift popper from its origin by the given amount of pixels (can be negative)
            offset: 0,

            // the element which will act as boundary of the popper
            boundariesElement: 'viewport',

            // amount of pixel used to define a minimum distance between the boundaries and the popper
            boundariesPadding: 5,

            // popper will try to prevent overflow following this order,
            // by default, then, it could overflow on the left and on top of the boundariesElement
            preventOverflowOrder: ['left', 'right', 'top', 'bottom'],

            // the behavior used by flip to change the placement of the popper
            flipBehavior: 'flip',

            arrowElement: '[x-arrow]',

            // list of functions used to modify the offsets before they are applied to the popper
            modifiers: ['shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],

            modifiersIgnored: [],

            forceAbsolute: false
        };

        /**
         * Create a new Popper.js instance
         * @constructor Popper
         * @param {HTMLElement} reference - The reference element used to position the popper
         * @param {HTMLElement|Object} popper
         *      The HTML element used as popper, or a configuration used to generate the popper.
         * @param {String} [popper.tagName='div'] The tag name of the generated popper.
         * @param {Array} [popper.classNames=['popper']] Array of classes to apply to the generated popper.
         * @param {Array} [popper.attributes] Array of attributes to apply, specify `attr:value` to assign a value to it.
         * @param {HTMLElement|String} [popper.parent=window.document.body] The parent element, given as HTMLElement or as query string.
         * @param {String} [popper.content=''] The content of the popper, it can be text, html, or node; if it is not text, set `contentType` to `html` or `node`.
         * @param {String} [popper.contentType='text'] If `html`, the `content` will be parsed as HTML. If `node`, it will be appended as-is.
         * @param {String} [popper.arrowTagName='div'] Same as `popper.tagName` but for the arrow element.
         * @param {Array} [popper.arrowClassNames='popper__arrow'] Same as `popper.classNames` but for the arrow element.
         * @param {String} [popper.arrowAttributes=['x-arrow']] Same as `popper.attributes` but for the arrow element.
         * @param {Object} options
         * @param {String} [options.placement=bottom]
         *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
         *      left(-start, -end)`
         *
         * @param {HTMLElement|String} [options.arrowElement='[x-arrow]']
         *      The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of
         *      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its
         *      reference element.
         *      By default, it will look for a child node of the popper with the `x-arrow` attribute.
         *
         * @param {Boolean} [options.gpuAcceleration=true]
         *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
         *      browser to use the GPU to accelerate the rendering.
         *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
         *
         * @param {Number} [options.offset=0]
         *      Amount of pixels the popper will be shifted (can be negative).
         *
         * @param {String|Element} [options.boundariesElement='viewport']
         *      The element which will define the boundaries of the popper position, the popper will never be placed outside
         *      of the defined boundaries (except if `keepTogether` is enabled)
         *
         * @param {Number} [options.boundariesPadding=5]
         *      Additional padding for the boundaries
         *
         * @param {Array} [options.preventOverflowOrder=['left', 'right', 'top', 'bottom']]
         *      Order used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,
         *      this means that the last ones will never overflow
         *
         * @param {String|Array} [options.flipBehavior='flip']
         *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
         *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
         *      its axis (`right - left`, `top - bottom`).
         *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
         *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
         *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
         *
         * @param {Array} [options.modifiers=[ 'shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle']]
         *      List of functions used to modify the data before they are applied to the popper, add your custom functions
         *      to this array to edit the offsets and placement.
         *      The function should reflect the @params and @returns of preventOverflow
         *
         * @param {Array} [options.modifiersIgnored=[]]
         *      Put here any built-in modifier name you want to exclude from the modifiers list
         *      The function should reflect the @params and @returns of preventOverflow
         *
         * @param {Boolean} [options.removeOnDestroy=false]
         *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
         */
        function Popper(reference, popper, options) {
            this._reference = reference.jquery ? reference[0] : reference;
            this.state = {};

            // if the popper variable is a configuration object, parse it to generate an HTMLElement
            // generate a default popper if is not defined
            var isNotDefined = typeof popper === 'undefined' || popper === null;
            var isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';
            if (isNotDefined || isConfig) {
                this._popper = this.parse(isConfig ? popper : {});
            }
            // otherwise, use the given HTMLElement as popper
            else {
                    this._popper = popper.jquery ? popper[0] : popper;
                }

            // with {} we create a new object with the options inside it
            this._options = Object.assign({}, DEFAULTS, options);

            // refactoring modifiers' list
            this._options.modifiers = this._options.modifiers.map(function (modifier) {
                // remove ignored modifiers
                if (this._options.modifiersIgnored.indexOf(modifier) !== -1) return;

                // set the x-placement attribute before everything else because it could be used to add margins to the popper
                // margins needs to be calculated to get the correct popper offsets
                if (modifier === 'applyStyle') {
                    this._popper.setAttribute('x-placement', this._options.placement);
                }

                // return predefined modifier identified by string or keep the custom one
                return this.modifiers[modifier] || modifier;
            }.bind(this));

            // make sure to apply the popper position before any computation
            this.state.position = this._getPosition(this._popper, this._reference);
            setStyle(this._popper, { position: this.state.position, top: 0 });

            // fire the first update to position the popper in the right place
            this.update();

            // setup event listeners, they will take care of update the position in specific situations
            this._setupEventListeners();
            return this;
        }

        //
        // Methods
        //
        /**
         * Destroy the popper
         * @method
         * @memberof Popper
         */
        Popper.prototype.destroy = function () {
            this._popper.removeAttribute('x-placement');
            this._popper.style.left = '';
            this._popper.style.position = '';
            this._popper.style.top = '';
            this._popper.style[getSupportedPropertyName('transform')] = '';
            this._removeEventListeners();

            // remove the popper if user explicity asked for the deletion on destroy
            if (this._options.removeOnDestroy) {
                this._popper.remove();
            }
            return this;
        };

        /**
         * Updates the position of the popper, computing the new offsets and applying the new style
         * @method
         * @memberof Popper
         */
        Popper.prototype.update = function () {
            var data = { instance: this, styles: {} };

            // store placement inside the data object, modifiers will be able to edit `placement` if needed
            // and refer to _originalPlacement to know the original value
            data.placement = this._options.placement;
            data._originalPlacement = this._options.placement;

            // compute the popper and reference offsets and put them inside data.offsets
            data.offsets = this._getOffsets(this._popper, this._reference, data.placement);

            // get boundaries
            data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);

            data = this.runModifiers(data, this._options.modifiers);

            if (typeof this.state.updateCallback === 'function') {
                this.state.updateCallback(data);
            }
        };

        /**
         * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
         * @method
         * @memberof Popper
         * @param {Function} callback
         */
        Popper.prototype.onCreate = function (callback) {
            // the createCallbacks return as first argument the popper instance
            callback(this);
            return this;
        };

        /**
         * If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
         * used to style popper and its arrow.
         * NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!
         * @method
         * @memberof Popper
         * @param {Function} callback
         */
        Popper.prototype.onUpdate = function (callback) {
            this.state.updateCallback = callback;
            return this;
        };

        /**
         * Helper used to generate poppers from a configuration file
         * @method
         * @memberof Popper
         * @param config {Object} configuration
         * @returns {HTMLElement} popper
         */
        Popper.prototype.parse = function (config) {
            var defaultConfig = {
                tagName: 'div',
                classNames: ['popper'],
                attributes: [],
                parent: root.document.body,
                content: '',
                contentType: 'text',
                arrowTagName: 'div',
                arrowClassNames: ['popper__arrow'],
                arrowAttributes: ['x-arrow']
            };
            config = Object.assign({}, defaultConfig, config);

            var d = root.document;

            var popper = d.createElement(config.tagName);
            addClassNames(popper, config.classNames);
            addAttributes(popper, config.attributes);
            if (config.contentType === 'node') {
                popper.appendChild(config.content.jquery ? config.content[0] : config.content);
            } else if (config.contentType === 'html') {
                popper.innerHTML = config.content;
            } else {
                popper.textContent = config.content;
            }

            if (config.arrowTagName) {
                var arrow = d.createElement(config.arrowTagName);
                addClassNames(arrow, config.arrowClassNames);
                addAttributes(arrow, config.arrowAttributes);
                popper.appendChild(arrow);
            }

            var parent = config.parent.jquery ? config.parent[0] : config.parent;

            // if the given parent is a string, use it to match an element
            // if more than one element is matched, the first one will be used as parent
            // if no elements are matched, the script will throw an error
            if (typeof parent === 'string') {
                parent = d.querySelectorAll(config.parent);
                if (parent.length > 1) {
                    console.warn('WARNING: the given `parent` query(' + config.parent + ') matched more than one element, the first one will be used');
                }
                if (parent.length === 0) {
                    throw 'ERROR: the given `parent` doesn\'t exists!';
                }
                parent = parent[0];
            }
            // if the given parent is a DOM nodes list or an array of nodes with more than one element,
            // the first one will be used as parent
            if (parent.length > 1 && parent instanceof Element === false) {
                console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
                parent = parent[0];
            }

            // append the generated popper to its parent
            parent.appendChild(popper);

            return popper;

            /**
             * Adds class names to the given element
             * @function
             * @ignore
             * @param {HTMLElement} target
             * @param {Array} classes
             */
            function addClassNames(element, classNames) {
                classNames.forEach(function (className) {
                    element.classList.add(className);
                });
            }

            /**
             * Adds attributes to the given element
             * @function
             * @ignore
             * @param {HTMLElement} target
             * @param {Array} attributes
             * @example
             * addAttributes(element, [ 'data-info:foobar' ]);
             */
            function addAttributes(element, attributes) {
                attributes.forEach(function (attribute) {
                    element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
                });
            }
        };

        /**
         * Helper used to get the position which will be applied to the popper
         * @method
         * @memberof Popper
         * @param config {HTMLElement} popper element
         * @param reference {HTMLElement} reference element
         * @returns {String} position
         */
        Popper.prototype._getPosition = function (popper, reference) {
            var container = getOffsetParent(reference);

            if (this._options.forceAbsolute) {
                return 'absolute';
            }

            // Decide if the popper will be fixed
            // If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together
            var isParentFixed = isFixed(reference, container);
            return isParentFixed ? 'fixed' : 'absolute';
        };

        /**
         * Get offsets to the popper
         * @method
         * @memberof Popper
         * @access private
         * @param {Element} popper - the popper element
         * @param {Element} reference - the reference element (the popper will be relative to this)
         * @returns {Object} An object containing the offsets which will be applied to the popper
         */
        Popper.prototype._getOffsets = function (popper, reference, placement) {
            placement = placement.split('-')[0];
            var popperOffsets = {};

            popperOffsets.position = this.state.position;
            var isParentFixed = popperOffsets.position === 'fixed';

            //
            // Get reference element position
            //
            var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed);

            //
            // Get popper sizes
            //
            var popperRect = getOuterSizes(popper);

            //
            // Compute offsets of popper
            //

            // depending by the popper placement we have to compute its offsets slightly differently
            if (['right', 'left'].indexOf(placement) !== -1) {
                popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
                if (placement === 'left') {
                    popperOffsets.left = referenceOffsets.left - popperRect.width;
                } else {
                    popperOffsets.left = referenceOffsets.right;
                }
            } else {
                popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
                if (placement === 'top') {
                    popperOffsets.top = referenceOffsets.top - popperRect.height;
                } else {
                    popperOffsets.top = referenceOffsets.bottom;
                }
            }

            // Add width and height to our offsets object
            popperOffsets.width = popperRect.width;
            popperOffsets.height = popperRect.height;

            return {
                popper: popperOffsets,
                reference: referenceOffsets
            };
        };

        /**
         * Setup needed event listeners used to update the popper position
         * @method
         * @memberof Popper
         * @access private
         */
        Popper.prototype._setupEventListeners = function () {
            // NOTE: 1 DOM access here
            this.state.updateBound = this.update.bind(this);
            root.addEventListener('resize', this.state.updateBound);
            // if the boundariesElement is window we don't need to listen for the scroll event
            if (this._options.boundariesElement !== 'window') {
                var target = getScrollParent(this._reference);
                // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
                if (target === root.document.body || target === root.document.documentElement) {
                    target = root;
                }
                target.addEventListener('scroll', this.state.updateBound);
            }
        };

        /**
         * Remove event listeners used to update the popper position
         * @method
         * @memberof Popper
         * @access private
         */
        Popper.prototype._removeEventListeners = function () {
            // NOTE: 1 DOM access here
            root.removeEventListener('resize', this.state.updateBound);
            if (this._options.boundariesElement !== 'window') {
                var target = getScrollParent(this._reference);
                // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
                if (target === root.document.body || target === root.document.documentElement) {
                    target = root;
                }
                target.removeEventListener('scroll', this.state.updateBound);
            }
            this.state.updateBound = null;
        };

        /**
         * Computed the boundaries limits and return them
         * @method
         * @memberof Popper
         * @access private
         * @param {Object} data - Object containing the property "offsets" generated by `_getOffsets`
         * @param {Number} padding - Boundaries padding
         * @param {Element} boundariesElement - Element used to define the boundaries
         * @returns {Object} Coordinates of the boundaries
         */
        Popper.prototype._getBoundaries = function (data, padding, boundariesElement) {
            // NOTE: 1 DOM access here
            var boundaries = {};
            var width, height;
            if (boundariesElement === 'window') {
                var body = root.document.body,
                    html = root.document.documentElement;

                height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

                boundaries = {
                    top: 0,
                    right: width,
                    bottom: height,
                    left: 0
                };
            } else if (boundariesElement === 'viewport') {
                var offsetParent = getOffsetParent(this._popper);
                var scrollParent = getScrollParent(this._popper);
                var offsetParentRect = getOffsetRect(offsetParent);

                // Thanks the fucking native API, `document.body.scrollTop` & `document.documentElement.scrollTop`
                var getScrollTopValue = function getScrollTopValue(element) {
                    return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
                };
                var getScrollLeftValue = function getScrollLeftValue(element) {
                    return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
                };

                // if the popper is fixed we don't have to substract scrolling from the boundaries
                var scrollTop = data.offsets.popper.position === 'fixed' ? 0 : getScrollTopValue(scrollParent);
                var scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : getScrollLeftValue(scrollParent);

                boundaries = {
                    top: 0 - (offsetParentRect.top - scrollTop),
                    right: root.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
                    bottom: root.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
                    left: 0 - (offsetParentRect.left - scrollLeft)
                };
            } else {
                if (getOffsetParent(this._popper) === boundariesElement) {
                    boundaries = {
                        top: 0,
                        left: 0,
                        right: boundariesElement.clientWidth,
                        bottom: boundariesElement.clientHeight
                    };
                } else {
                    boundaries = getOffsetRect(boundariesElement);
                }
            }
            boundaries.left += padding;
            boundaries.right -= padding;
            boundaries.top = boundaries.top + padding;
            boundaries.bottom = boundaries.bottom - padding;
            return boundaries;
        };

        /**
         * Loop trough the list of modifiers and run them in order, each of them will then edit the data object
         * @method
         * @memberof Popper
         * @access public
         * @param {Object} data
         * @param {Array} modifiers
         * @param {Function} ends
         */
        Popper.prototype.runModifiers = function (data, modifiers, ends) {
            var modifiersToRun = modifiers.slice();
            if (ends !== undefined) {
                modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
            }

            modifiersToRun.forEach(function (modifier) {
                if (isFunction(modifier)) {
                    data = modifier.call(this, data);
                }
            }.bind(this));

            return data;
        };

        /**
         * Helper used to know if the given modifier depends from another one.
         * @method
         * @memberof Popper
         * @param {String} requesting - name of requesting modifier
         * @param {String} requested - name of requested modifier
         * @returns {Boolean}
         */
        Popper.prototype.isModifierRequired = function (requesting, requested) {
            var index = getArrayKeyIndex(this._options.modifiers, requesting);
            return !!this._options.modifiers.slice(0, index).filter(function (modifier) {
                return modifier === requested;
            }).length;
        };

        //
        // Modifiers
        //

        /**
         * Modifiers list
         * @namespace Popper.modifiers
         * @memberof Popper
         * @type {Object}
         */
        Popper.prototype.modifiers = {};

        /**
         * Apply the computed styles to the popper element
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by `update` method
         * @returns {Object} The same data object
         */
        Popper.prototype.modifiers.applyStyle = function (data) {
            // apply the final offsets to the popper
            // NOTE: 1 DOM access here
            var styles = {
                position: data.offsets.popper.position
            };

            // round top and left to avoid blurry text
            var left = Math.round(data.offsets.popper.left);
            var top = Math.round(data.offsets.popper.top);

            // if gpuAcceleration is set to true and transform is supported, we use `translate3d` to apply the position to the popper
            // we automatically use the supported prefixed version if needed
            var prefixedProperty;
            if (this._options.gpuAcceleration && (prefixedProperty = getSupportedPropertyName('transform'))) {
                styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
                styles.top = 0;
                styles.left = 0;
            }
            // othwerise, we use the standard `left` and `top` properties
            else {
                    styles.left = left;
                    styles.top = top;
                }

            // any property present in `data.styles` will be applied to the popper,
            // in this way we can make the 3rd party modifiers add custom styles to it
            // Be aware, modifiers could override the properties defined in the previous
            // lines of this modifier!
            Object.assign(styles, data.styles);

            setStyle(this._popper, styles);

            // set an attribute which will be useful to style the tooltip (use it to properly position its arrow)
            // NOTE: 1 DOM access here
            this._popper.setAttribute('x-placement', data.placement);

            // if the arrow modifier is required and the arrow style has been computed, apply the arrow style
            if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
                setStyle(data.arrowElement, data.offsets.arrow);
            }

            return data;
        };

        /**
         * Modifier used to shift the popper on the start or end of its reference element side
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by `update` method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.shift = function (data) {
            var placement = data.placement;
            var basePlacement = placement.split('-')[0];
            var shiftVariation = placement.split('-')[1];

            // if shift shiftVariation is specified, run the modifier
            if (shiftVariation) {
                var reference = data.offsets.reference;
                var popper = getPopperClientRect(data.offsets.popper);

                var shiftOffsets = {
                    y: {
                        start: { top: reference.top },
                        end: { top: reference.top + reference.height - popper.height }
                    },
                    x: {
                        start: { left: reference.left },
                        end: { left: reference.left + reference.width - popper.width }
                    }
                };

                var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';

                data.offsets.popper = Object.assign(popper, shiftOffsets[axis][shiftVariation]);
            }

            return data;
        };

        /**
         * Modifier used to make sure the popper does not overflows from it's boundaries
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by `update` method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.preventOverflow = function (data) {
            var order = this._options.preventOverflowOrder;
            var popper = getPopperClientRect(data.offsets.popper);

            var check = {
                left: function left() {
                    var left = popper.left;
                    if (popper.left < data.boundaries.left) {
                        left = Math.max(popper.left, data.boundaries.left);
                    }
                    return { left: left };
                },
                right: function right() {
                    var left = popper.left;
                    if (popper.right > data.boundaries.right) {
                        left = Math.min(popper.left, data.boundaries.right - popper.width);
                    }
                    return { left: left };
                },
                top: function top() {
                    var top = popper.top;
                    if (popper.top < data.boundaries.top) {
                        top = Math.max(popper.top, data.boundaries.top);
                    }
                    return { top: top };
                },
                bottom: function bottom() {
                    var top = popper.top;
                    if (popper.bottom > data.boundaries.bottom) {
                        top = Math.min(popper.top, data.boundaries.bottom - popper.height);
                    }
                    return { top: top };
                }
            };

            order.forEach(function (direction) {
                data.offsets.popper = Object.assign(popper, check[direction]());
            });

            return data;
        };

        /**
         * Modifier used to make sure the popper is always near its reference
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by _update method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.keepTogether = function (data) {
            var popper = getPopperClientRect(data.offsets.popper);
            var reference = data.offsets.reference;
            var f = Math.floor;

            if (popper.right < f(reference.left)) {
                data.offsets.popper.left = f(reference.left) - popper.width;
            }
            if (popper.left > f(reference.right)) {
                data.offsets.popper.left = f(reference.right);
            }
            if (popper.bottom < f(reference.top)) {
                data.offsets.popper.top = f(reference.top) - popper.height;
            }
            if (popper.top > f(reference.bottom)) {
                data.offsets.popper.top = f(reference.bottom);
            }

            return data;
        };

        /**
         * Modifier used to flip the placement of the popper when the latter is starting overlapping its reference element.
         * Requires the `preventOverflow` modifier before it in order to work.
         * **NOTE:** This modifier will run all its previous modifiers everytime it tries to flip the popper!
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by _update method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.flip = function (data) {
            // check if preventOverflow is in the list of modifiers before the flip modifier.
            // otherwise flip would not work as expected.
            if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
                console.warn('WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!');
                return data;
            }

            if (data.flipped && data.placement === data._originalPlacement) {
                // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
                return data;
            }

            var placement = data.placement.split('-')[0];
            var placementOpposite = getOppositePlacement(placement);
            var variation = data.placement.split('-')[1] || '';

            var flipOrder = [];
            if (this._options.flipBehavior === 'flip') {
                flipOrder = [placement, placementOpposite];
            } else {
                flipOrder = this._options.flipBehavior;
            }

            flipOrder.forEach(function (step, index) {
                if (placement !== step || flipOrder.length === index + 1) {
                    return;
                }

                placement = data.placement.split('-')[0];
                placementOpposite = getOppositePlacement(placement);

                var popperOffsets = getPopperClientRect(data.offsets.popper);

                // this boolean is used to distinguish right and bottom from top and left
                // they need different computations to get flipped
                var a = ['right', 'bottom'].indexOf(placement) !== -1;

                // using Math.floor because the reference offsets may contain decimals we are not going to consider here
                if (a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) || !a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])) {
                    // we'll use this boolean to detect any flip loop
                    data.flipped = true;
                    data.placement = flipOrder[index + 1];
                    if (variation) {
                        data.placement += '-' + variation;
                    }
                    data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;

                    data = this.runModifiers(data, this._options.modifiers, this._flip);
                }
            }.bind(this));
            return data;
        };

        /**
         * Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
         * The offsets will shift the popper on the side of its reference element.
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by _update method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.offset = function (data) {
            var offset = this._options.offset;
            var popper = data.offsets.popper;

            if (data.placement.indexOf('left') !== -1) {
                popper.top -= offset;
            } else if (data.placement.indexOf('right') !== -1) {
                popper.top += offset;
            } else if (data.placement.indexOf('top') !== -1) {
                popper.left -= offset;
            } else if (data.placement.indexOf('bottom') !== -1) {
                popper.left += offset;
            }
            return data;
        };

        /**
         * Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the reference element
         * It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed
         * @method
         * @memberof Popper.modifiers
         * @argument {Object} data - The data object generated by _update method
         * @returns {Object} The data object, properly modified
         */
        Popper.prototype.modifiers.arrow = function (data) {
            var arrow = this._options.arrowElement;

            // if the arrowElement is a string, suppose it's a CSS selector
            if (typeof arrow === 'string') {
                arrow = this._popper.querySelector(arrow);
            }

            // if arrow element is not found, don't run the modifier
            if (!arrow) {
                return data;
            }

            // the arrow element must be child of its popper
            if (!this._popper.contains(arrow)) {
                console.warn('WARNING: `arrowElement` must be child of its popper element!');
                return data;
            }

            // arrow depends on keepTogether in order to work
            if (!this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
                console.warn('WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!');
                return data;
            }

            var arrowStyle = {};
            var placement = data.placement.split('-')[0];
            var popper = getPopperClientRect(data.offsets.popper);
            var reference = data.offsets.reference;
            var isVertical = ['left', 'right'].indexOf(placement) !== -1;

            var len = isVertical ? 'height' : 'width';
            var side = isVertical ? 'top' : 'left';
            var altSide = isVertical ? 'left' : 'top';
            var opSide = isVertical ? 'bottom' : 'right';
            var arrowSize = getOuterSizes(arrow)[len];

            //
            // extends keepTogether behavior making sure the popper and its reference have enough pixels in conjuction
            //

            // top/left side
            if (reference[opSide] - arrowSize < popper[side]) {
                data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
            }
            // bottom/right side
            if (reference[side] + arrowSize > popper[opSide]) {
                data.offsets.popper[side] += reference[side] + arrowSize - popper[opSide];
            }

            // compute center of the popper
            var center = reference[side] + reference[len] / 2 - arrowSize / 2;

            var sideValue = center - popper[side];

            // prevent arrow from being placed not contiguously to its popper
            sideValue = Math.max(Math.min(popper[len] - arrowSize, sideValue), 0);
            arrowStyle[side] = sideValue;
            arrowStyle[altSide] = ''; // make sure to remove any old style from the arrow

            data.offsets.arrow = arrowStyle;
            data.arrowElement = arrow;

            return data;
        };

        //
        // Helpers
        //

        /**
         * Get the outer sizes of the given element (offset size + margins)
         * @function
         * @ignore
         * @argument {Element} element
         * @returns {Object} object containing width and height properties
         */
        function getOuterSizes(element) {
            // NOTE: 1 DOM access here
            var _display = element.style.display,
                _visibility = element.style.visibility;
            element.style.display = 'block';element.style.visibility = 'hidden';
            var calcWidthToForceRepaint = element.offsetWidth;

            // original method
            var styles = root.getComputedStyle(element);
            var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
            var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
            var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };

            // reset element styles
            element.style.display = _display;element.style.visibility = _visibility;
            return result;
        }

        /**
         * Get the opposite placement of the given one/
         * @function
         * @ignore
         * @argument {String} placement
         * @returns {String} flipped placement
         */
        function getOppositePlacement(placement) {
            var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
            return placement.replace(/left|right|bottom|top/g, function (matched) {
                return hash[matched];
            });
        }

        /**
         * Given the popper offsets, generate an output similar to getBoundingClientRect
         * @function
         * @ignore
         * @argument {Object} popperOffsets
         * @returns {Object} ClientRect like output
         */
        function getPopperClientRect(popperOffsets) {
            var offsets = Object.assign({}, popperOffsets);
            offsets.right = offsets.left + offsets.width;
            offsets.bottom = offsets.top + offsets.height;
            return offsets;
        }

        /**
         * Given an array and the key to find, returns its index
         * @function
         * @ignore
         * @argument {Array} arr
         * @argument keyToFind
         * @returns index or null
         */
        function getArrayKeyIndex(arr, keyToFind) {
            var i = 0,
                key;
            for (key in arr) {
                if (arr[key] === keyToFind) {
                    return i;
                }
                i++;
            }
            return null;
        }

        /**
         * Get CSS computed property of the given element
         * @function
         * @ignore
         * @argument {Eement} element
         * @argument {String} property
         */
        function getStyleComputedProperty(element, property) {
            // NOTE: 1 DOM access here
            var css = root.getComputedStyle(element, null);
            return css[property];
        }

        /**
         * Returns the offset parent of the given element
         * @function
         * @ignore
         * @argument {Element} element
         * @returns {Element} offset parent
         */
        function getOffsetParent(element) {
            // NOTE: 1 DOM access here
            var offsetParent = element.offsetParent;
            return offsetParent === root.document.body || !offsetParent ? root.document.documentElement : offsetParent;
        }

        /**
         * Returns the scrolling parent of the given element
         * @function
         * @ignore
         * @argument {Element} element
         * @returns {Element} offset parent
         */
        function getScrollParent(element) {
            var parent = element.parentNode;

            if (!parent) {
                return element;
            }

            if (parent === root.document) {
                // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
                // greater than 0 and return the proper element
                if (root.document.body.scrollTop) {
                    return root.document.body;
                } else {
                    return root.document.documentElement;
                }
            }

            // Firefox want us to check `-x` and `-y` variations as well
            if (['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
                // If the detected scrollParent is body, we perform an additional check on its parentNode
                // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
                // fixes issue #65
                return parent;
            }
            return getScrollParent(element.parentNode);
        }

        /**
         * Check if the given element is fixed or is inside a fixed parent
         * @function
         * @ignore
         * @argument {Element} element
         * @argument {Element} customContainer
         * @returns {Boolean} answer to "isFixed?"
         */
        function isFixed(element) {
            if (element === root.document.body) {
                return false;
            }
            if (getStyleComputedProperty(element, 'position') === 'fixed') {
                return true;
            }
            return element.parentNode ? isFixed(element.parentNode) : element;
        }

        /**
         * Set the style to the given popper
         * @function
         * @ignore
         * @argument {Element} element - Element to apply the style to
         * @argument {Object} styles - Object with a list of properties and values which will be applied to the element
         */
        function setStyle(element, styles) {
            function is_numeric(n) {
                return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
            }
            Object.keys(styles).forEach(function (prop) {
                var unit = '';
                // add unit if the value is numeric and is one of the following
                if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
                    unit = 'px';
                }
                element.style[prop] = styles[prop] + unit;
            });
        }

        /**
         * Check if the given variable is a function
         * @function
         * @ignore
         * @argument {*} functionToCheck - variable to check
         * @returns {Boolean} answer to: is a function?
         */
        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }

        /**
         * Get the position of the given element, relative to its offset parent
         * @function
         * @ignore
         * @param {Element} element
         * @return {Object} position - Coordinates of the element and its `scrollTop`
         */
        function getOffsetRect(element) {
            var elementRect = {
                width: element.offsetWidth,
                height: element.offsetHeight,
                left: element.offsetLeft,
                top: element.offsetTop
            };

            elementRect.right = elementRect.left + elementRect.width;
            elementRect.bottom = elementRect.top + elementRect.height;

            // position
            return elementRect;
        }

        /**
         * Get bounding client rect of given element
         * @function
         * @ignore
         * @param {HTMLElement} element
         * @return {Object} client rect
         */
        function getBoundingClientRect(element) {
            var rect = element.getBoundingClientRect();

            // whether the IE version is lower than 11
            var isIE = navigator.userAgent.indexOf("MSIE") != -1;

            // fix ie document bounding top always 0 bug
            var rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top;

            return {
                left: rect.left,
                top: rectTop,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.right - rect.left,
                height: rect.bottom - rectTop
            };
        }

        /**
         * Given an element and one of its parents, return the offset
         * @function
         * @ignore
         * @param {HTMLElement} element
         * @param {HTMLElement} parent
         * @return {Object} rect
         */
        function getOffsetRectRelativeToCustomParent(element, parent, fixed) {
            var elementRect = getBoundingClientRect(element);
            var parentRect = getBoundingClientRect(parent);

            if (fixed) {
                var scrollParent = getScrollParent(parent);
                parentRect.top += scrollParent.scrollTop;
                parentRect.bottom += scrollParent.scrollTop;
                parentRect.left += scrollParent.scrollLeft;
                parentRect.right += scrollParent.scrollLeft;
            }

            var rect = {
                top: elementRect.top - parentRect.top,
                left: elementRect.left - parentRect.left,
                bottom: elementRect.top - parentRect.top + elementRect.height,
                right: elementRect.left - parentRect.left + elementRect.width,
                width: elementRect.width,
                height: elementRect.height
            };
            return rect;
        }

        /**
         * Get the prefixed supported property name
         * @function
         * @ignore
         * @argument {String} property (camelCase)
         * @returns {String} prefixed property (camelCase)
         */
        function getSupportedPropertyName(property) {
            var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

            for (var i = 0; i < prefixes.length; i++) {
                var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
                if (typeof root.document.body.style[toCheck] !== 'undefined') {
                    return toCheck;
                }
            }
            return null;
        }

        /**
         * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source
         * objects to a target object. It will return the target object.
         * This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway
         * Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
         * @function
         * @ignore
         */
        if (!Object.assign) {
            Object.defineProperty(Object, 'assign', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function value(target) {
                    if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert first argument to object');
                    }

                    var to = Object(target);
                    for (var i = 1; i < arguments.length; i++) {
                        var nextSource = arguments[i];
                        if (nextSource === undefined || nextSource === null) {
                            continue;
                        }
                        nextSource = Object(nextSource);

                        var keysArray = Object.keys(nextSource);
                        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                            var nextKey = keysArray[nextIndex];
                            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                            if (desc !== undefined && desc.enumerable) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                    return to;
                }
            });
        }

        return Popper;
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9wb3BwZXIuanMiXSwibmFtZXMiOlsicm9vdCIsImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiUG9wcGVyIiwid2luZG93IiwiREVGQVVMVFMiLCJwbGFjZW1lbnQiLCJncHVBY2NlbGVyYXRpb24iLCJvZmZzZXQiLCJib3VuZGFyaWVzRWxlbWVudCIsImJvdW5kYXJpZXNQYWRkaW5nIiwicHJldmVudE92ZXJmbG93T3JkZXIiLCJmbGlwQmVoYXZpb3IiLCJhcnJvd0VsZW1lbnQiLCJtb2RpZmllcnMiLCJtb2RpZmllcnNJZ25vcmVkIiwiZm9yY2VBYnNvbHV0ZSIsInJlZmVyZW5jZSIsInBvcHBlciIsIm9wdGlvbnMiLCJfcmVmZXJlbmNlIiwianF1ZXJ5Iiwic3RhdGUiLCJpc05vdERlZmluZWQiLCJpc0NvbmZpZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIl9wb3BwZXIiLCJwYXJzZSIsIl9vcHRpb25zIiwiYXNzaWduIiwibWFwIiwibW9kaWZpZXIiLCJpbmRleE9mIiwic2V0QXR0cmlidXRlIiwiYmluZCIsInBvc2l0aW9uIiwiX2dldFBvc2l0aW9uIiwic2V0U3R5bGUiLCJ0b3AiLCJ1cGRhdGUiLCJfc2V0dXBFdmVudExpc3RlbmVycyIsImRlc3Ryb3kiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzdHlsZSIsImxlZnQiLCJnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJyZW1vdmVPbkRlc3Ryb3kiLCJyZW1vdmUiLCJkYXRhIiwiaW5zdGFuY2UiLCJzdHlsZXMiLCJfb3JpZ2luYWxQbGFjZW1lbnQiLCJvZmZzZXRzIiwiX2dldE9mZnNldHMiLCJib3VuZGFyaWVzIiwiX2dldEJvdW5kYXJpZXMiLCJydW5Nb2RpZmllcnMiLCJ1cGRhdGVDYWxsYmFjayIsIm9uQ3JlYXRlIiwiY2FsbGJhY2siLCJvblVwZGF0ZSIsImNvbmZpZyIsImRlZmF1bHRDb25maWciLCJ0YWdOYW1lIiwiY2xhc3NOYW1lcyIsImF0dHJpYnV0ZXMiLCJwYXJlbnQiLCJkb2N1bWVudCIsImJvZHkiLCJjb250ZW50IiwiY29udGVudFR5cGUiLCJhcnJvd1RhZ05hbWUiLCJhcnJvd0NsYXNzTmFtZXMiLCJhcnJvd0F0dHJpYnV0ZXMiLCJkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzTmFtZXMiLCJhZGRBdHRyaWJ1dGVzIiwiYXBwZW5kQ2hpbGQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImFycm93IiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImNvbnNvbGUiLCJ3YXJuIiwiRWxlbWVudCIsImVsZW1lbnQiLCJmb3JFYWNoIiwiY2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYXR0cmlidXRlIiwic3BsaXQiLCJjb250YWluZXIiLCJnZXRPZmZzZXRQYXJlbnQiLCJpc1BhcmVudEZpeGVkIiwiaXNGaXhlZCIsInBvcHBlck9mZnNldHMiLCJyZWZlcmVuY2VPZmZzZXRzIiwiZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9DdXN0b21QYXJlbnQiLCJwb3BwZXJSZWN0IiwiZ2V0T3V0ZXJTaXplcyIsImhlaWdodCIsIndpZHRoIiwicmlnaHQiLCJib3R0b20iLCJ1cGRhdGVCb3VuZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJnZXRTY3JvbGxQYXJlbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicGFkZGluZyIsImh0bWwiLCJNYXRoIiwibWF4Iiwic2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2Nyb2xsV2lkdGgiLCJvZmZzZXRXaWR0aCIsImNsaWVudFdpZHRoIiwib2Zmc2V0UGFyZW50Iiwic2Nyb2xsUGFyZW50Iiwib2Zmc2V0UGFyZW50UmVjdCIsImdldE9mZnNldFJlY3QiLCJnZXRTY3JvbGxUb3BWYWx1ZSIsInNjcm9sbFRvcCIsImdldFNjcm9sbExlZnRWYWx1ZSIsInNjcm9sbExlZnQiLCJlbmRzIiwibW9kaWZpZXJzVG9SdW4iLCJzbGljZSIsInVuZGVmaW5lZCIsImdldEFycmF5S2V5SW5kZXgiLCJpc0Z1bmN0aW9uIiwiaXNNb2RpZmllclJlcXVpcmVkIiwicmVxdWVzdGluZyIsInJlcXVlc3RlZCIsImluZGV4IiwiZmlsdGVyIiwiYXBwbHlTdHlsZSIsInJvdW5kIiwicHJlZml4ZWRQcm9wZXJ0eSIsInNoaWZ0IiwiYmFzZVBsYWNlbWVudCIsInNoaWZ0VmFyaWF0aW9uIiwiZ2V0UG9wcGVyQ2xpZW50UmVjdCIsInNoaWZ0T2Zmc2V0cyIsInkiLCJzdGFydCIsImVuZCIsIngiLCJheGlzIiwicHJldmVudE92ZXJmbG93Iiwib3JkZXIiLCJjaGVjayIsIm1pbiIsImRpcmVjdGlvbiIsImtlZXBUb2dldGhlciIsImYiLCJmbG9vciIsImZsaXAiLCJmbGlwcGVkIiwicGxhY2VtZW50T3Bwb3NpdGUiLCJnZXRPcHBvc2l0ZVBsYWNlbWVudCIsInZhcmlhdGlvbiIsImZsaXBPcmRlciIsInN0ZXAiLCJhIiwiX2ZsaXAiLCJxdWVyeVNlbGVjdG9yIiwiY29udGFpbnMiLCJhcnJvd1N0eWxlIiwiaXNWZXJ0aWNhbCIsImxlbiIsInNpZGUiLCJhbHRTaWRlIiwib3BTaWRlIiwiYXJyb3dTaXplIiwiY2VudGVyIiwic2lkZVZhbHVlIiwiX2Rpc3BsYXkiLCJkaXNwbGF5IiwiX3Zpc2liaWxpdHkiLCJ2aXNpYmlsaXR5IiwiY2FsY1dpZHRoVG9Gb3JjZVJlcGFpbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwicGFyc2VGbG9hdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsInJlc3VsdCIsImhhc2giLCJyZXBsYWNlIiwibWF0Y2hlZCIsImFyciIsImtleVRvRmluZCIsImkiLCJrZXkiLCJnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkiLCJwcm9wZXJ0eSIsImNzcyIsInBhcmVudE5vZGUiLCJpc19udW1lcmljIiwibiIsImlzTmFOIiwiaXNGaW5pdGUiLCJrZXlzIiwicHJvcCIsInVuaXQiLCJmdW5jdGlvblRvQ2hlY2siLCJnZXRUeXBlIiwiZWxlbWVudFJlY3QiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0VG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmVjdCIsImlzSUUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJyZWN0VG9wIiwiZml4ZWQiLCJwYXJlbnRSZWN0IiwicHJlZml4ZXMiLCJ0b0NoZWNrIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInZhbHVlIiwiVHlwZUVycm9yIiwidG8iLCJhcmd1bWVudHMiLCJuZXh0U291cmNlIiwia2V5c0FycmF5IiwibmV4dEluZGV4IiwibmV4dEtleSIsImRlc2MiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBRSxXQUFVQSxJQUFWLEVBQWdCQyxPQUFoQixFQUF5QjtBQUN2QixZQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE9BQU9DLEdBQTNDLEVBQWdEO0FBQzVDO0FBQ0FELG1CQUFPRCxPQUFQO0FBQ0gsU0FIRCxNQUdPLElBQUksUUFBT0csTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QkEsT0FBT0MsT0FBekMsRUFBa0Q7QUFDckQ7QUFDQTtBQUNBO0FBQ0FELG1CQUFPQyxPQUFQLEdBQWlCSixTQUFqQjtBQUNILFNBTE0sTUFLQTtBQUNIO0FBQ0FELGlCQUFLTSxNQUFMLEdBQWNMLFNBQWQ7QUFDSDtBQUNKLEtBYkMsYUFhTSxZQUFZOztBQUVoQjs7QUFFQSxZQUFJRCxPQUFPTyxNQUFYOztBQUVBO0FBQ0EsWUFBSUMsV0FBVztBQUNYO0FBQ0FDLHVCQUFXLFFBRkE7O0FBSVhDLDZC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QUF3QnpCLFdBQVcsSUFBdkMsRUFBNkM7QUFDekMsOEJBQU0sSUFBSThILFNBQUosQ0FBYyx5Q0FBZCxDQUFOO0FBQ0g7O0FBRUQsd0JBQUlDLEtBQUt2TixPQUFPd0YsTUFBUCxDQUFUO0FBQ0EseUJBQUssSUFBSTJGLElBQUksQ0FBYixFQUFnQkEsSUFBSXFDLFVBQVUxSixNQUE5QixFQUFzQ3FILEdBQXRDLEVBQTJDO0FBQ3ZDLDRCQUFJc0MsYUFBYUQsVUFBVXJDLENBQVYsQ0FBakI7QUFDQSw0QkFBSXNDLGVBQWV4RyxTQUFmLElBQTRCd0csZUFBZSxJQUEvQyxFQUFxRDtBQUNqRDtBQUNIO0FBQ0RBLHFDQUFhek4sT0FBT3lOLFVBQVAsQ0FBYjs7QUFFQSw0QkFBSUMsWUFBWTFOLE9BQU82TCxJQUFQLENBQVk0QixVQUFaLENBQWhCO0FBQ0EsNkJBQUssSUFBSUUsWUFBWSxDQUFoQixFQUFtQmhFLE1BQU0rRCxVQUFVNUosTUFBeEMsRUFBZ0Q2SixZQUFZaEUsR0FBNUQsRUFBaUVnRSxXQUFqRSxFQUE4RTtBQUMxRSxnQ0FBSUMsVUFBVUYsVUFBVUMsU0FBVixDQUFkO0FBQ0EsZ0NBQUlFLE9BQU83TixPQUFPOE4sd0JBQVAsQ0FBZ0NMLFVBQWhDLEVBQTRDRyxPQUE1QyxDQUFYO0FBQ0EsZ0NBQUlDLFNBQVM1RyxTQUFULElBQXNCNEcsS0FBS1gsVUFBL0IsRUFBMkM7QUFDdkNLLG1DQUFHSyxPQUFILElBQWNILFdBQVdHLE9BQVgsQ0FBZDtBQUNIO0FBQ0o7QUFDSjtBQUNELDJCQUFPTCxFQUFQO0FBQ0g7QUEzQm1DLGFBQXhDO0FBNkJIOztBQUVELGVBQU83TyxNQUFQO0FBQ0gsS0EvdENDLENBQUQiLCJmaWxlIjoiYXBwL3V0aWxzL3BvcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyBLaWNrYXNzIGxpYnJhcnkgdG8gY3JlYXRlIGFuZCBwbGFjZSBwb3BwZXJzIG5lYXIgdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnRzLlxuICogQHZlcnNpb24ge3t2ZXJzaW9ufX1cbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgRmVkZXJpY28gWml2b2xvIGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICovXG5cbi8vXG4vLyBDcm9zcyBtb2R1bGUgbG9hZGVyXG4vLyBTdXBwb3J0ZWQ6IE5vZGUsIEFNRCwgQnJvd3NlciBnbG9iYWxzXG4vL1xuOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5Qb3BwZXIgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcm9vdCA9IHdpbmRvdztcblxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgIHZhciBERUZBVUxUUyA9IHtcbiAgICAgICAgLy8gcGxhY2VtZW50IG9mIHRoZSBwb3BwZXJcbiAgICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcblxuICAgICAgICBncHVBY2NlbGVyYXRpb246IHRydWUsXG5cbiAgICAgICAgLy8gc2hpZnQgcG9wcGVyIGZyb20gaXRzIG9yaWdpbiBieSB0aGUgZ2l2ZW4gYW1vdW50IG9mIHBpeGVscyAoY2FuIGJlIG5lZ2F0aXZlKVxuICAgICAgICBvZmZzZXQ6IDAsXG5cbiAgICAgICAgLy8gdGhlIGVsZW1lbnQgd2hpY2ggd2lsbCBhY3QgYXMgYm91bmRhcnkgb2YgdGhlIHBvcHBlclxuICAgICAgICBib3VuZGFyaWVzRWxlbWVudDogJ3ZpZXdwb3J0JyxcblxuICAgICAgICAvLyBhbW91bnQgb2YgcGl4ZWwgdXNlZCB0byBkZWZpbmUgYSBtaW5pbXVtIGRpc3RhbmNlIGJldHdlZW4gdGhlIGJvdW5kYXJpZXMgYW5kIHRoZSBwb3BwZXJcbiAgICAgICAgYm91bmRhcmllc1BhZGRpbmc6IDUsXG5cbiAgICAgICAgLy8gcG9wcGVyIHdpbGwgdHJ5IHRvIHByZXZlbnQgb3ZlcmZsb3cgZm9sbG93aW5nIHRoaXMgb3JkZXIsXG4gICAgICAgIC8vIGJ5IGRlZmF1bHQsIHRoZW4sIGl0IGNvdWxkIG92ZXJmbG93IG9uIHRoZSBsZWZ0IGFuZCBvbiB0b3Agb2YgdGhlIGJvdW5kYXJpZXNFbGVtZW50XG4gICAgICAgIHByZXZlbnRPdmVyZmxvd09yZGVyOiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddLFxuXG4gICAgICAgIC8vIHRoZSBiZWhhdmlvciB1c2VkIGJ5IGZsaXAgdG8gY2hhbmdlIHRoZSBwbGFjZW1lbnQgb2YgdGhlIHBvcHBlclxuICAgICAgICBmbGlwQmVoYXZpb3I6ICdmbGlwJyxcblxuICAgICAgICBhcnJvd0VsZW1lbnQ6ICdbeC1hcnJvd10nLFxuXG4gICAgICAgIC8vIGxpc3Qgb2YgZnVuY3Rpb25zIHVzZWQgdG8gbW9kaWZ5IHRoZSBvZmZzZXRzIGJlZm9yZSB0aGV5IGFyZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAgICAgICAgbW9kaWZpZXJzOiBbICdzaGlmdCcsICdvZmZzZXQnLCAncHJldmVudE92ZXJmbG93JywgJ2tlZXBUb2dldGhlcicsICdhcnJvdycsICdmbGlwJywgJ2FwcGx5U3R5bGUnXSxcblxuICAgICAgICBtb2RpZmllcnNJZ25vcmVkOiBbXSxcblxuICAgICAgICBmb3JjZUFic29sdXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgUG9wcGVyLmpzIGluc3RhbmNlXG4gICAgICogQGNvbnN0cnVjdG9yIFBvcHBlclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlZmVyZW5jZSAtIFRoZSByZWZlcmVuY2UgZWxlbWVudCB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fE9iamVjdH0gcG9wcGVyXG4gICAgICogICAgICBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyLCBvciBhIGNvbmZpZ3VyYXRpb24gdXNlZCB0byBnZW5lcmF0ZSB0aGUgcG9wcGVyLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9wcGVyLnRhZ05hbWU9J2RpdiddIFRoZSB0YWcgbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIHBvcHBlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbcG9wcGVyLmNsYXNzTmFtZXM9Wydwb3BwZXInXV0gQXJyYXkgb2YgY2xhc3NlcyB0byBhcHBseSB0byB0aGUgZ2VuZXJhdGVkIHBvcHBlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbcG9wcGVyLmF0dHJpYnV0ZXNdIEFycmF5IG9mIGF0dHJpYnV0ZXMgdG8gYXBwbHksIHNwZWNpZnkgYGF0dHI6dmFsdWVgIHRvIGFzc2lnbiBhIHZhbHVlIHRvIGl0LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8U3RyaW5nfSBbcG9wcGVyLnBhcmVudD13aW5kb3cuZG9jdW1lbnQuYm9keV0gVGhlIHBhcmVudCBlbGVtZW50LCBnaXZlbiBhcyBIVE1MRWxlbWVudCBvciBhcyBxdWVyeSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtwb3BwZXIuY29udGVudD0nJ10gVGhlIGNvbnRlbnQgb2YgdGhlIHBvcHBlciwgaXQgY2FuIGJlIHRleHQsIGh0bWwsIG9yIG5vZGU7IGlmIGl0IGlzIG5vdCB0ZXh0LCBzZXQgYGNvbnRlbnRUeXBlYCB0byBgaHRtbGAgb3IgYG5vZGVgLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9wcGVyLmNvbnRlbnRUeXBlPSd0ZXh0J10gSWYgYGh0bWxgLCB0aGUgYGNvbnRlbnRgIHdpbGwgYmUgcGFyc2VkIGFzIEhUTUwuIElmIGBub2RlYCwgaXQgd2lsbCBiZSBhcHBlbmRlZCBhcy1pcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3BvcHBlci5hcnJvd1RhZ05hbWU9J2RpdiddIFNhbWUgYXMgYHBvcHBlci50YWdOYW1lYCBidXQgZm9yIHRoZSBhcnJvdyBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtwb3BwZXIuYXJyb3dDbGFzc05hbWVzPSdwb3BwZXJfX2Fycm93J10gU2FtZSBhcyBgcG9wcGVyLmNsYXNzTmFtZXNgIGJ1dCBmb3IgdGhlIGFycm93IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtwb3BwZXIuYXJyb3dBdHRyaWJ1dGVzPVsneC1hcnJvdyddXSBTYW1lIGFzIGBwb3BwZXIuYXR0cmlidXRlc2AgYnV0IGZvciB0aGUgYXJyb3cgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wbGFjZW1lbnQ9Ym90dG9tXVxuICAgICAqICAgICAgUGxhY2VtZW50IG9mIHRoZSBwb3BwZXIgYWNjZXB0ZWQgdmFsdWVzOiBgdG9wKC1zdGFydCwgLWVuZCksIHJpZ2h0KC1zdGFydCwgLWVuZCksIGJvdHRvbSgtc3RhcnQsIC1yaWdodCksXG4gICAgICogICAgICBsZWZ0KC1zdGFydCwgLWVuZClgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fFN0cmluZ30gW29wdGlvbnMuYXJyb3dFbGVtZW50PSdbeC1hcnJvd10nXVxuICAgICAqICAgICAgVGhlIERPTSBOb2RlIHVzZWQgYXMgYXJyb3cgZm9yIHRoZSBwb3BwZXIsIG9yIGEgQ1NTIHNlbGVjdG9yIHVzZWQgdG8gZ2V0IHRoZSBET00gbm9kZS4gSXQgbXVzdCBiZSBjaGlsZCBvZlxuICAgICAqICAgICAgaXRzIHBhcmVudCBQb3BwZXIuIFBvcHBlci5qcyB3aWxsIGFwcGx5IHRvIHRoZSBnaXZlbiBlbGVtZW50IHRoZSBzdHlsZSByZXF1aXJlZCB0byBhbGlnbiB0aGUgYXJyb3cgd2l0aCBpdHNcbiAgICAgKiAgICAgIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgICAqICAgICAgQnkgZGVmYXVsdCwgaXQgd2lsbCBsb29rIGZvciBhIGNoaWxkIG5vZGUgb2YgdGhlIHBvcHBlciB3aXRoIHRoZSBgeC1hcnJvd2AgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ncHVBY2NlbGVyYXRpb249dHJ1ZV1cbiAgICAgKiAgICAgIFdoZW4gdGhpcyBwcm9wZXJ0eSBpcyBzZXQgdG8gdHJ1ZSwgdGhlIHBvcHBlciBwb3NpdGlvbiB3aWxsIGJlIGFwcGxpZWQgdXNpbmcgQ1NTMyB0cmFuc2xhdGUzZCwgYWxsb3dpbmcgdGhlXG4gICAgICogICAgICBicm93c2VyIHRvIHVzZSB0aGUgR1BVIHRvIGFjY2VsZXJhdGUgdGhlIHJlbmRlcmluZy5cbiAgICAgKiAgICAgIElmIHNldCB0byBmYWxzZSwgdGhlIHBvcHBlciB3aWxsIGJlIHBsYWNlZCB1c2luZyBgdG9wYCBhbmQgYGxlZnRgIHByb3BlcnRpZXMsIG5vdCB1c2luZyB0aGUgR1BVLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9mZnNldD0wXVxuICAgICAqICAgICAgQW1vdW50IG9mIHBpeGVscyB0aGUgcG9wcGVyIHdpbGwgYmUgc2hpZnRlZCAoY2FuIGJlIG5lZ2F0aXZlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IFtvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50PSd2aWV3cG9ydCddXG4gICAgICogICAgICBUaGUgZWxlbWVudCB3aGljaCB3aWxsIGRlZmluZSB0aGUgYm91bmRhcmllcyBvZiB0aGUgcG9wcGVyIHBvc2l0aW9uLCB0aGUgcG9wcGVyIHdpbGwgbmV2ZXIgYmUgcGxhY2VkIG91dHNpZGVcbiAgICAgKiAgICAgIG9mIHRoZSBkZWZpbmVkIGJvdW5kYXJpZXMgKGV4Y2VwdCBpZiBga2VlcFRvZ2V0aGVyYCBpcyBlbmFibGVkKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmJvdW5kYXJpZXNQYWRkaW5nPTVdXG4gICAgICogICAgICBBZGRpdGlvbmFsIHBhZGRpbmcgZm9yIHRoZSBib3VuZGFyaWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5wcmV2ZW50T3ZlcmZsb3dPcmRlcj1bJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddXVxuICAgICAqICAgICAgT3JkZXIgdXNlZCB3aGVuIFBvcHBlci5qcyB0cmllcyB0byBhdm9pZCBvdmVyZmxvd3MgZnJvbSB0aGUgYm91bmRhcmllcywgdGhleSB3aWxsIGJlIGNoZWNrZWQgaW4gb3JkZXIsXG4gICAgICogICAgICB0aGlzIG1lYW5zIHRoYXQgdGhlIGxhc3Qgb25lcyB3aWxsIG5ldmVyIG92ZXJmbG93XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gW29wdGlvbnMuZmxpcEJlaGF2aW9yPSdmbGlwJ11cbiAgICAgKiAgICAgIFRoZSBiZWhhdmlvciB1c2VkIGJ5IHRoZSBgZmxpcGAgbW9kaWZpZXIgdG8gY2hhbmdlIHRoZSBwbGFjZW1lbnQgb2YgdGhlIHBvcHBlciB3aGVuIHRoZSBsYXR0ZXIgaXMgdHJ5aW5nIHRvXG4gICAgICogICAgICBvdmVybGFwIGl0cyByZWZlcmVuY2UgZWxlbWVudC4gRGVmaW5pbmcgYGZsaXBgIGFzIHZhbHVlLCB0aGUgcGxhY2VtZW50IHdpbGwgYmUgZmxpcHBlZCBvblxuICAgICAqICAgICAgaXRzIGF4aXMgKGByaWdodCAtIGxlZnRgLCBgdG9wIC0gYm90dG9tYCkuXG4gICAgICogICAgICBZb3UgY2FuIGV2ZW4gcGFzcyBhbiBhcnJheSBvZiBwbGFjZW1lbnRzIChlZzogYFsncmlnaHQnLCAnbGVmdCcsICd0b3AnXWAgKSB0byBtYW51YWxseSBzcGVjaWZ5XG4gICAgICogICAgICBob3cgYWx0ZXIgdGhlIHBsYWNlbWVudCB3aGVuIGEgZmxpcCBpcyBuZWVkZWQuIChlZy4gaW4gdGhlIGFib3ZlIGV4YW1wbGUsIGl0IHdvdWxkIGZpcnN0IGZsaXAgZnJvbSByaWdodCB0byBsZWZ0LFxuICAgICAqICAgICAgdGhlbiwgaWYgZXZlbiBpbiBpdHMgbmV3IHBsYWNlbWVudCwgdGhlIHBvcHBlciBpcyBvdmVybGFwcGluZyBpdHMgcmVmZXJlbmNlIGVsZW1lbnQsIGl0IHdpbGwgYmUgbW92ZWQgdG8gdG9wKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMubW9kaWZpZXJzPVsgJ3NoaWZ0JywgJ29mZnNldCcsICdwcmV2ZW50T3ZlcmZsb3cnLCAna2VlcFRvZ2V0aGVyJywgJ2Fycm93JywgJ2ZsaXAnLCAnYXBwbHlTdHlsZSddXVxuICAgICAqICAgICAgTGlzdCBvZiBmdW5jdGlvbnMgdXNlZCB0byBtb2RpZnkgdGhlIGRhdGEgYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciwgYWRkIHlvdXIgY3VzdG9tIGZ1bmN0aW9uc1xuICAgICAqICAgICAgdG8gdGhpcyBhcnJheSB0byBlZGl0IHRoZSBvZmZzZXRzIGFuZCBwbGFjZW1lbnQuXG4gICAgICogICAgICBUaGUgZnVuY3Rpb24gc2hvdWxkIHJlZmxlY3QgdGhlIEBwYXJhbXMgYW5kIEByZXR1cm5zIG9mIHByZXZlbnRPdmVyZmxvd1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMubW9kaWZpZXJzSWdub3JlZD1bXV1cbiAgICAgKiAgICAgIFB1dCBoZXJlIGFueSBidWlsdC1pbiBtb2RpZmllciBuYW1lIHlvdSB3YW50IHRvIGV4Y2x1ZGUgZnJvbSB0aGUgbW9kaWZpZXJzIGxpc3RcbiAgICAgKiAgICAgIFRoZSBmdW5jdGlvbiBzaG91bGQgcmVmbGVjdCB0aGUgQHBhcmFtcyBhbmQgQHJldHVybnMgb2YgcHJldmVudE92ZXJmbG93XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJlbW92ZU9uRGVzdHJveT1mYWxzZV1cbiAgICAgKiAgICAgIFNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIHRoZSBwb3BwZXIgd2hlbiB5b3UgY2FsbCB0aGUgYGRlc3Ryb3lgIG1ldGhvZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fcmVmZXJlbmNlID0gcmVmZXJlbmNlLmpxdWVyeSA/IHJlZmVyZW5jZVswXSA6IHJlZmVyZW5jZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xuXG4gICAgICAgIC8vIGlmIHRoZSBwb3BwZXIgdmFyaWFibGUgaXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCwgcGFyc2UgaXQgdG8gZ2VuZXJhdGUgYW4gSFRNTEVsZW1lbnRcbiAgICAgICAgLy8gZ2VuZXJhdGUgYSBkZWZhdWx0IHBvcHBlciBpZiBpcyBub3QgZGVmaW5lZFxuICAgICAgICB2YXIgaXNOb3REZWZpbmVkID0gdHlwZW9mIHBvcHBlciA9PT0gJ3VuZGVmaW5lZCcgfHwgcG9wcGVyID09PSBudWxsO1xuICAgICAgICB2YXIgaXNDb25maWcgPSBwb3BwZXIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBvcHBlcikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICAgICAgICBpZiAoaXNOb3REZWZpbmVkIHx8IGlzQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3BwZXIgPSB0aGlzLnBhcnNlKGlzQ29uZmlnID8gcG9wcGVyIDoge30pO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSwgdXNlIHRoZSBnaXZlbiBIVE1MRWxlbWVudCBhcyBwb3BwZXJcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wb3BwZXIgPSBwb3BwZXIuanF1ZXJ5ID8gcG9wcGVyWzBdIDogcG9wcGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2l0aCB7fSB3ZSBjcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgaW5zaWRlIGl0XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUUywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gcmVmYWN0b3JpbmcgbW9kaWZpZXJzJyBsaXN0XG4gICAgICAgIHRoaXMuX29wdGlvbnMubW9kaWZpZXJzID0gdGhpcy5fb3B0aW9ucy5tb2RpZmllcnMubWFwKGZ1bmN0aW9uKG1vZGlmaWVyKXtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBpZ25vcmVkIG1vZGlmaWVyc1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMubW9kaWZpZXJzSWdub3JlZC5pbmRleE9mKG1vZGlmaWVyKSAhPT0gLTEpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSB4LXBsYWNlbWVudCBhdHRyaWJ1dGUgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZSBiZWNhdXNlIGl0IGNvdWxkIGJlIHVzZWQgdG8gYWRkIG1hcmdpbnMgdG8gdGhlIHBvcHBlclxuICAgICAgICAgICAgLy8gbWFyZ2lucyBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIHRvIGdldCB0aGUgY29ycmVjdCBwb3BwZXIgb2Zmc2V0c1xuICAgICAgICAgICAgaWYgKG1vZGlmaWVyID09PSAnYXBwbHlTdHlsZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3BwZXIuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHRoaXMuX29wdGlvbnMucGxhY2VtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV0dXJuIHByZWRlZmluZWQgbW9kaWZpZXIgaWRlbnRpZmllZCBieSBzdHJpbmcgb3Iga2VlcCB0aGUgY3VzdG9tIG9uZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kaWZpZXJzW21vZGlmaWVyXSB8fCBtb2RpZmllcjtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBtYWtlIHN1cmUgdG8gYXBwbHkgdGhlIHBvcHBlciBwb3NpdGlvbiBiZWZvcmUgYW55IGNvbXB1dGF0aW9uXG4gICAgICAgIHRoaXMuc3RhdGUucG9zaXRpb24gPSB0aGlzLl9nZXRQb3NpdGlvbih0aGlzLl9wb3BwZXIsIHRoaXMuX3JlZmVyZW5jZSk7XG4gICAgICAgIHNldFN0eWxlKHRoaXMuX3BvcHBlciwgeyBwb3NpdGlvbjogdGhpcy5zdGF0ZS5wb3NpdGlvbiwgdG9wOiAwIH0pO1xuXG4gICAgICAgIC8vIGZpcmUgdGhlIGZpcnN0IHVwZGF0ZSB0byBwb3NpdGlvbiB0aGUgcG9wcGVyIGluIHRoZSByaWdodCBwbGFjZVxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIC8vIHNldHVwIGV2ZW50IGxpc3RlbmVycywgdGhleSB3aWxsIHRha2UgY2FyZSBvZiB1cGRhdGUgdGhlIHBvc2l0aW9uIGluIHNwZWNpZmljIHNpdHVhdGlvbnNcbiAgICAgICAgdGhpcy5fc2V0dXBFdmVudExpc3RlbmVycygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gTWV0aG9kc1xuICAgIC8vXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgcG9wcGVyXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fcG9wcGVyLnJlbW92ZUF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKTtcbiAgICAgICAgdGhpcy5fcG9wcGVyLnN0eWxlLmxlZnQgPSAnJztcbiAgICAgICAgdGhpcy5fcG9wcGVyLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgIHRoaXMuX3BvcHBlci5zdHlsZS50b3AgPSAnJztcbiAgICAgICAgdGhpcy5fcG9wcGVyLnN0eWxlW2dldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyldID0gJyc7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBwb3BwZXIgaWYgdXNlciBleHBsaWNpdHkgYXNrZWQgZm9yIHRoZSBkZWxldGlvbiBvbiBkZXN0cm95XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJlbW92ZU9uRGVzdHJveSkge1xuICAgICAgICAgICAgdGhpcy5fcG9wcGVyLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyLCBjb21wdXRpbmcgdGhlIG5ldyBvZmZzZXRzIGFuZCBhcHBseWluZyB0aGUgbmV3IHN0eWxlXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHsgaW5zdGFuY2U6IHRoaXMsIHN0eWxlczoge30gfTtcblxuICAgICAgICAvLyBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCwgbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxuICAgICAgICAvLyBhbmQgcmVmZXIgdG8gX29yaWdpbmFsUGxhY2VtZW50IHRvIGtub3cgdGhlIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgIGRhdGEucGxhY2VtZW50ID0gdGhpcy5fb3B0aW9ucy5wbGFjZW1lbnQ7XG4gICAgICAgIGRhdGEuX29yaWdpbmFsUGxhY2VtZW50ID0gdGhpcy5fb3B0aW9ucy5wbGFjZW1lbnQ7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgcG9wcGVyIGFuZCByZWZlcmVuY2Ugb2Zmc2V0cyBhbmQgcHV0IHRoZW0gaW5zaWRlIGRhdGEub2Zmc2V0c1xuICAgICAgICBkYXRhLm9mZnNldHMgPSB0aGlzLl9nZXRPZmZzZXRzKHRoaXMuX3BvcHBlciwgdGhpcy5fcmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCk7XG5cbiAgICAgICAgLy8gZ2V0IGJvdW5kYXJpZXNcbiAgICAgICAgZGF0YS5ib3VuZGFyaWVzID0gdGhpcy5fZ2V0Qm91bmRhcmllcyhkYXRhLCB0aGlzLl9vcHRpb25zLmJvdW5kYXJpZXNQYWRkaW5nLCB0aGlzLl9vcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50KTtcblxuICAgICAgICBkYXRhID0gdGhpcy5ydW5Nb2RpZmllcnMoZGF0YSwgdGhpcy5fb3B0aW9ucy5tb2RpZmllcnMpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdGF0ZS51cGRhdGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGVDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBpbml0aWFsaXphdGlvbiBvZiBwb3BwZXIgd2l0aCBhcyBmaXJzdCBhcmd1bWVudCB0aGUgUG9wcGVyIGluc3RhbmNlLlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLm9uQ3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy8gdGhlIGNyZWF0ZUNhbGxiYWNrcyByZXR1cm4gYXMgZmlyc3QgYXJndW1lbnQgdGhlIHBvcHBlciBpbnN0YW5jZVxuICAgICAgICBjYWxsYmFjayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGFmdGVyIGVhY2ggdXBkYXRlIG9mIHBvcHBlciB3aXRoIGFzIGZpcnN0IGFyZ3VtZW50IHRoZSBzZXQgb2YgY29vcmRpbmF0ZXMgYW5kIGluZm9ybWF0aW9uc1xuICAgICAqIHVzZWQgdG8gc3R5bGUgcG9wcGVyIGFuZCBpdHMgYXJyb3cuXG4gICAgICogTk9URTogaXQgZG9lc24ndCBnZXQgZmlyZWQgb24gdGhlIGZpcnN0IGNhbGwgb2YgdGhlIGBQb3BwZXIudXBkYXRlKClgIG1ldGhvZCBpbnNpZGUgdGhlIGBQb3BwZXJgIGNvbnN0cnVjdG9yIVxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLm9uVXBkYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGVscGVyIHVzZWQgdG8gZ2VuZXJhdGUgcG9wcGVycyBmcm9tIGEgY29uZmlndXJhdGlvbiBmaWxlXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKiBAcGFyYW0gY29uZmlnIHtPYmplY3R9IGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IHBvcHBlclxuICAgICAqL1xuICAgIFBvcHBlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgICAgICB0YWdOYW1lOiAnZGl2JyxcbiAgICAgICAgICAgIGNsYXNzTmFtZXM6IFsgJ3BvcHBlcicgXSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxuICAgICAgICAgICAgcGFyZW50OiByb290LmRvY3VtZW50LmJvZHksXG4gICAgICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICBhcnJvd1RhZ05hbWU6ICdkaXYnLFxuICAgICAgICAgICAgYXJyb3dDbGFzc05hbWVzOiBbICdwb3BwZXJfX2Fycm93JyBdLFxuICAgICAgICAgICAgYXJyb3dBdHRyaWJ1dGVzOiBbICd4LWFycm93J11cbiAgICAgICAgfTtcbiAgICAgICAgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcblxuICAgICAgICB2YXIgZCA9IHJvb3QuZG9jdW1lbnQ7XG5cbiAgICAgICAgdmFyIHBvcHBlciA9IGQuY3JlYXRlRWxlbWVudChjb25maWcudGFnTmFtZSk7XG4gICAgICAgIGFkZENsYXNzTmFtZXMocG9wcGVyLCBjb25maWcuY2xhc3NOYW1lcyk7XG4gICAgICAgIGFkZEF0dHJpYnV0ZXMocG9wcGVyLCBjb25maWcuYXR0cmlidXRlcyk7XG4gICAgICAgIGlmIChjb25maWcuY29udGVudFR5cGUgPT09ICdub2RlJykge1xuICAgICAgICAgICAgcG9wcGVyLmFwcGVuZENoaWxkKGNvbmZpZy5jb250ZW50LmpxdWVyeSA/IGNvbmZpZy5jb250ZW50WzBdIDogY29uZmlnLmNvbnRlbnQpO1xuICAgICAgICB9ZWxzZSBpZiAoY29uZmlnLmNvbnRlbnRUeXBlID09PSAnaHRtbCcpIHtcbiAgICAgICAgICAgIHBvcHBlci5pbm5lckhUTUwgPSBjb25maWcuY29udGVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcHBlci50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5hcnJvd1RhZ05hbWUpIHtcbiAgICAgICAgICAgIHZhciBhcnJvdyA9IGQuY3JlYXRlRWxlbWVudChjb25maWcuYXJyb3dUYWdOYW1lKTtcbiAgICAgICAgICAgIGFkZENsYXNzTmFtZXMoYXJyb3csIGNvbmZpZy5hcnJvd0NsYXNzTmFtZXMpO1xuICAgICAgICAgICAgYWRkQXR0cmlidXRlcyhhcnJvdywgY29uZmlnLmFycm93QXR0cmlidXRlcyk7XG4gICAgICAgICAgICBwb3BwZXIuYXBwZW5kQ2hpbGQoYXJyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhcmVudCA9IGNvbmZpZy5wYXJlbnQuanF1ZXJ5ID8gY29uZmlnLnBhcmVudFswXSA6IGNvbmZpZy5wYXJlbnQ7XG5cbiAgICAgICAgLy8gaWYgdGhlIGdpdmVuIHBhcmVudCBpcyBhIHN0cmluZywgdXNlIGl0IHRvIG1hdGNoIGFuIGVsZW1lbnRcbiAgICAgICAgLy8gaWYgbW9yZSB0aGFuIG9uZSBlbGVtZW50IGlzIG1hdGNoZWQsIHRoZSBmaXJzdCBvbmUgd2lsbCBiZSB1c2VkIGFzIHBhcmVudFxuICAgICAgICAvLyBpZiBubyBlbGVtZW50cyBhcmUgbWF0Y2hlZCwgdGhlIHNjcmlwdCB3aWxsIHRocm93IGFuIGVycm9yXG4gICAgICAgIGlmICh0eXBlb2YgcGFyZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFyZW50ID0gZC5xdWVyeVNlbGVjdG9yQWxsKGNvbmZpZy5wYXJlbnQpO1xuICAgICAgICAgICAgaWYgKHBhcmVudC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiB0aGUgZ2l2ZW4gYHBhcmVudGAgcXVlcnkoJyArIGNvbmZpZy5wYXJlbnQgKyAnKSBtYXRjaGVkIG1vcmUgdGhhbiBvbmUgZWxlbWVudCwgdGhlIGZpcnN0IG9uZSB3aWxsIGJlIHVzZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiB0aGUgZ2l2ZW4gYHBhcmVudGAgZG9lc25cXCd0IGV4aXN0cyEnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50WzBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZSBnaXZlbiBwYXJlbnQgaXMgYSBET00gbm9kZXMgbGlzdCBvciBhbiBhcnJheSBvZiBub2RlcyB3aXRoIG1vcmUgdGhhbiBvbmUgZWxlbWVudCxcbiAgICAgICAgLy8gdGhlIGZpcnN0IG9uZSB3aWxsIGJlIHVzZWQgYXMgcGFyZW50XG4gICAgICAgIGlmIChwYXJlbnQubGVuZ3RoID4gMSAmJiBwYXJlbnQgaW5zdGFuY2VvZiBFbGVtZW50ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiB5b3UgaGF2ZSBwYXNzZWQgYXMgcGFyZW50IGEgbGlzdCBvZiBlbGVtZW50cywgdGhlIGZpcnN0IG9uZSB3aWxsIGJlIHVzZWQnKTtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFwcGVuZCB0aGUgZ2VuZXJhdGVkIHBvcHBlciB0byBpdHMgcGFyZW50XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChwb3BwZXIpO1xuXG4gICAgICAgIHJldHVybiBwb3BwZXI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgY2xhc3MgbmFtZXMgdG8gdGhlIGdpdmVuIGVsZW1lbnRcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFkZENsYXNzTmFtZXMoZWxlbWVudCwgY2xhc3NOYW1lcykge1xuICAgICAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBhdHRyaWJ1dGVzIHRvIHRoZSBnaXZlbiBlbGVtZW50XG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGFkZEF0dHJpYnV0ZXMoZWxlbWVudCwgWyAnZGF0YS1pbmZvOmZvb2JhcicgXSk7XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbihhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUuc3BsaXQoJzonKVswXSwgYXR0cmlidXRlLnNwbGl0KCc6JylbMV0gfHwgJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgdXNlZCB0byBnZXQgdGhlIHBvc2l0aW9uIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKiBAcGFyYW0gY29uZmlnIHtIVE1MRWxlbWVudH0gcG9wcGVyIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gcmVmZXJlbmNlIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBwb3NpdGlvblxuICAgICAqL1xuICAgIFBvcHBlci5wcm90b3R5cGUuX2dldFBvc2l0aW9uID0gZnVuY3Rpb24ocG9wcGVyLCByZWZlcmVuY2UpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGdldE9mZnNldFBhcmVudChyZWZlcmVuY2UpO1xuXG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmZvcmNlQWJzb2x1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnYWJzb2x1dGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVjaWRlIGlmIHRoZSBwb3BwZXIgd2lsbCBiZSBmaXhlZFxuICAgICAgICAvLyBJZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgaW5zaWRlIGEgZml4ZWQgY29udGV4dCwgdGhlIHBvcHBlciB3aWxsIGJlIGZpeGVkIGFzIHdlbGwgdG8gYWxsb3cgdGhlbSB0byBzY3JvbGwgdG9nZXRoZXJcbiAgICAgICAgdmFyIGlzUGFyZW50Rml4ZWQgPSBpc0ZpeGVkKHJlZmVyZW5jZSwgY29udGFpbmVyKTtcbiAgICAgICAgcmV0dXJuIGlzUGFyZW50Rml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IG9mZnNldHMgdG8gdGhlIHBvcHBlclxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHJlZmVyZW5jZSAtIHRoZSByZWZlcmVuY2UgZWxlbWVudCAodGhlIHBvcHBlciB3aWxsIGJlIHJlbGF0aXZlIHRvIHRoaXMpXG4gICAgICogQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLl9nZXRPZmZzZXRzID0gZnVuY3Rpb24ocG9wcGVyLCByZWZlcmVuY2UsIHBsYWNlbWVudCkge1xuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgdmFyIHBvcHBlck9mZnNldHMgPSB7fTtcblxuICAgICAgICBwb3BwZXJPZmZzZXRzLnBvc2l0aW9uID0gdGhpcy5zdGF0ZS5wb3NpdGlvbjtcbiAgICAgICAgdmFyIGlzUGFyZW50Rml4ZWQgPSBwb3BwZXJPZmZzZXRzLnBvc2l0aW9uID09PSAnZml4ZWQnO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEdldCByZWZlcmVuY2UgZWxlbWVudCBwb3NpdGlvblxuICAgICAgICAvL1xuICAgICAgICB2YXIgcmVmZXJlbmNlT2Zmc2V0cyA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQ3VzdG9tUGFyZW50KHJlZmVyZW5jZSwgZ2V0T2Zmc2V0UGFyZW50KHBvcHBlciksIGlzUGFyZW50Rml4ZWQpO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEdldCBwb3BwZXIgc2l6ZXNcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHBvcHBlclJlY3QgPSBnZXRPdXRlclNpemVzKHBvcHBlcik7XG5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gQ29tcHV0ZSBvZmZzZXRzIG9mIHBvcHBlclxuICAgICAgICAvL1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBieSB0aGUgcG9wcGVyIHBsYWNlbWVudCB3ZSBoYXZlIHRvIGNvbXB1dGUgaXRzIG9mZnNldHMgc2xpZ2h0bHkgZGlmZmVyZW50bHlcbiAgICAgICAgaWYgKFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHBvcHBlck9mZnNldHMudG9wID0gcmVmZXJlbmNlT2Zmc2V0cy50b3AgKyByZWZlcmVuY2VPZmZzZXRzLmhlaWdodCAvIDIgLSBwb3BwZXJSZWN0LmhlaWdodCAvIDI7XG4gICAgICAgICAgICBpZiAocGxhY2VtZW50ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJPZmZzZXRzLmxlZnQgPSByZWZlcmVuY2VPZmZzZXRzLmxlZnQgLSBwb3BwZXJSZWN0LndpZHRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJPZmZzZXRzLmxlZnQgPSByZWZlcmVuY2VPZmZzZXRzLnJpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9wcGVyT2Zmc2V0cy5sZWZ0ID0gcmVmZXJlbmNlT2Zmc2V0cy5sZWZ0ICsgcmVmZXJlbmNlT2Zmc2V0cy53aWR0aCAvIDIgLSBwb3BwZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIGlmIChwbGFjZW1lbnQgPT09ICd0b3AnKSB7XG4gICAgICAgICAgICAgICAgcG9wcGVyT2Zmc2V0cy50b3AgPSByZWZlcmVuY2VPZmZzZXRzLnRvcCAtIHBvcHBlclJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJPZmZzZXRzLnRvcCA9IHJlZmVyZW5jZU9mZnNldHMuYm90dG9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHdpZHRoIGFuZCBoZWlnaHQgdG8gb3VyIG9mZnNldHMgb2JqZWN0XG4gICAgICAgIHBvcHBlck9mZnNldHMud2lkdGggICA9IHBvcHBlclJlY3Qud2lkdGg7XG4gICAgICAgIHBvcHBlck9mZnNldHMuaGVpZ2h0ICA9IHBvcHBlclJlY3QuaGVpZ2h0O1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBvcHBlcjogcG9wcGVyT2Zmc2V0cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlT2Zmc2V0c1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFNldHVwIG5lZWRlZCBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5fc2V0dXBFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxuICAgICAgICB0aGlzLnN0YXRlLnVwZGF0ZUJvdW5kID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnN0YXRlLnVwZGF0ZUJvdW5kKTtcbiAgICAgICAgLy8gaWYgdGhlIGJvdW5kYXJpZXNFbGVtZW50IGlzIHdpbmRvdyB3ZSBkb24ndCBuZWVkIHRvIGxpc3RlbiBmb3IgdGhlIHNjcm9sbCBldmVudFxuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCAhPT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBnZXRTY3JvbGxQYXJlbnQodGhpcy5fcmVmZXJlbmNlKTtcbiAgICAgICAgICAgIC8vIGhlcmUgaXQgY291bGQgYmUgYm90aCBgYm9keWAgb3IgYGRvY3VtZW50RWxlbWVudGAgdGhhbmtzIHRvIEZpcmVmb3gsIHdlIHRoZW4gY2hlY2sgYm90aFxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gcm9vdC5kb2N1bWVudC5ib2R5IHx8IHRhcmdldCA9PT0gcm9vdC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSByb290O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc3RhdGUudXBkYXRlQm91bmQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgICAgICAgcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnN0YXRlLnVwZGF0ZUJvdW5kKTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYm91bmRhcmllc0VsZW1lbnQgIT09ICd3aW5kb3cnKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0U2Nyb2xsUGFyZW50KHRoaXMuX3JlZmVyZW5jZSk7XG4gICAgICAgICAgICAvLyBoZXJlIGl0IGNvdWxkIGJlIGJvdGggYGJvZHlgIG9yIGBkb2N1bWVudEVsZW1lbnRgIHRoYW5rcyB0byBGaXJlZm94LCB3ZSB0aGVuIGNoZWNrIGJvdGhcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IHJvb3QuZG9jdW1lbnQuYm9keSB8fCB0YXJnZXQgPT09IHJvb3QuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gcm9vdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnN0YXRlLnVwZGF0ZUJvdW5kKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlLnVwZGF0ZUJvdW5kID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZWQgdGhlIGJvdW5kYXJpZXMgbGltaXRzIGFuZCByZXR1cm4gdGhlbVxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBPYmplY3QgY29udGFpbmluZyB0aGUgcHJvcGVydHkgXCJvZmZzZXRzXCIgZ2VuZXJhdGVkIGJ5IGBfZ2V0T2Zmc2V0c2BcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFkZGluZyAtIEJvdW5kYXJpZXMgcGFkZGluZ1xuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQgLSBFbGVtZW50IHVzZWQgdG8gZGVmaW5lIHRoZSBib3VuZGFyaWVzXG4gICAgICogQHJldHVybnMge09iamVjdH0gQ29vcmRpbmF0ZXMgb2YgdGhlIGJvdW5kYXJpZXNcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLl9nZXRCb3VuZGFyaWVzID0gZnVuY3Rpb24oZGF0YSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpIHtcbiAgICAgICAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgICAgICAgdmFyIGJvdW5kYXJpZXMgPSB7fTtcbiAgICAgICAgdmFyIHdpZHRoLCBoZWlnaHQ7XG4gICAgICAgIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICAgIHZhciBib2R5ID0gcm9vdC5kb2N1bWVudC5ib2R5LFxuICAgICAgICAgICAgICAgIGh0bWwgPSByb290LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5tYXgoIGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodCApO1xuICAgICAgICAgICAgd2lkdGggPSBNYXRoLm1heCggYm9keS5zY3JvbGxXaWR0aCwgYm9keS5vZmZzZXRXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5vZmZzZXRXaWR0aCApO1xuXG4gICAgICAgICAgICBib3VuZGFyaWVzID0ge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogd2lkdGgsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3ZpZXdwb3J0Jykge1xuICAgICAgICAgICAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudCh0aGlzLl9wb3BwZXIpO1xuICAgICAgICAgICAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudCh0aGlzLl9wb3BwZXIpO1xuICAgICAgICAgICAgdmFyIG9mZnNldFBhcmVudFJlY3QgPSBnZXRPZmZzZXRSZWN0KG9mZnNldFBhcmVudCk7XG5cblx0XHRcdC8vIFRoYW5rcyB0aGUgZnVja2luZyBuYXRpdmUgQVBJLCBgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BgICYgYGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BgXG5cdFx0XHR2YXIgZ2V0U2Nyb2xsVG9wVmFsdWUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudCA9PSBkb2N1bWVudC5ib2R5ID8gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIDogZWxlbWVudC5zY3JvbGxUb3A7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZ2V0U2Nyb2xsTGVmdFZhbHVlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQgPT0gZG9jdW1lbnQuYm9keSA/IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIDogZWxlbWVudC5zY3JvbGxMZWZ0O1xuXHRcdFx0fVxuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcG9wcGVyIGlzIGZpeGVkIHdlIGRvbid0IGhhdmUgdG8gc3Vic3RyYWN0IHNjcm9sbGluZyBmcm9tIHRoZSBib3VuZGFyaWVzXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gZGF0YS5vZmZzZXRzLnBvcHBlci5wb3NpdGlvbiA9PT0gJ2ZpeGVkJyA/IDAgOiBnZXRTY3JvbGxUb3BWYWx1ZShzY3JvbGxQYXJlbnQpO1xuICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSBkYXRhLm9mZnNldHMucG9wcGVyLnBvc2l0aW9uID09PSAnZml4ZWQnID8gMCA6IGdldFNjcm9sbExlZnRWYWx1ZShzY3JvbGxQYXJlbnQpO1xuXG4gICAgICAgICAgICBib3VuZGFyaWVzID0ge1xuICAgICAgICAgICAgICAgIHRvcDogMCAtIChvZmZzZXRQYXJlbnRSZWN0LnRvcCAtIHNjcm9sbFRvcCksXG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJvb3QuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC0gKG9mZnNldFBhcmVudFJlY3QubGVmdCAtIHNjcm9sbExlZnQpLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogcm9vdC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gKG9mZnNldFBhcmVudFJlY3QudG9wIC0gc2Nyb2xsVG9wKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwIC0gKG9mZnNldFBhcmVudFJlY3QubGVmdCAtIHNjcm9sbExlZnQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGdldE9mZnNldFBhcmVudCh0aGlzLl9wb3BwZXIpID09PSBib3VuZGFyaWVzRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGJvdW5kYXJpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IGJvdW5kYXJpZXNFbGVtZW50LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGJvdW5kYXJpZXNFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvdW5kYXJpZXMgPSBnZXRPZmZzZXRSZWN0KGJvdW5kYXJpZXNFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib3VuZGFyaWVzLmxlZnQgKz0gcGFkZGluZztcbiAgICAgICAgYm91bmRhcmllcy5yaWdodCAtPSBwYWRkaW5nO1xuICAgICAgICBib3VuZGFyaWVzLnRvcCA9IGJvdW5kYXJpZXMudG9wICsgcGFkZGluZztcbiAgICAgICAgYm91bmRhcmllcy5ib3R0b20gPSBib3VuZGFyaWVzLmJvdHRvbSAtIHBhZGRpbmc7XG4gICAgICAgIHJldHVybiBib3VuZGFyaWVzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIExvb3AgdHJvdWdoIHRoZSBsaXN0IG9mIG1vZGlmaWVycyBhbmQgcnVuIHRoZW0gaW4gb3JkZXIsIGVhY2ggb2YgdGhlbSB3aWxsIHRoZW4gZWRpdCB0aGUgZGF0YSBvYmplY3RcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxuICAgICAqIEBhY2Nlc3MgcHVibGljXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmRzXG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5ydW5Nb2RpZmllcnMgPSBmdW5jdGlvbihkYXRhLCBtb2RpZmllcnMsIGVuZHMpIHtcbiAgICAgICAgdmFyIG1vZGlmaWVyc1RvUnVuID0gbW9kaWZpZXJzLnNsaWNlKCk7XG4gICAgICAgIGlmIChlbmRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyc1RvUnVuID0gdGhpcy5fb3B0aW9ucy5tb2RpZmllcnMuc2xpY2UoMCwgZ2V0QXJyYXlLZXlJbmRleCh0aGlzLl9vcHRpb25zLm1vZGlmaWVycywgZW5kcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kaWZpZXJzVG9SdW4uZm9yRWFjaChmdW5jdGlvbihtb2RpZmllcikge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obW9kaWZpZXIpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IG1vZGlmaWVyLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhlbHBlciB1c2VkIHRvIGtub3cgaWYgdGhlIGdpdmVuIG1vZGlmaWVyIGRlcGVuZHMgZnJvbSBhbm90aGVyIG9uZS5cbiAgICAgKiBAbWV0aG9kXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0aW5nIC0gbmFtZSBvZiByZXF1ZXN0aW5nIG1vZGlmaWVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RlZCAtIG5hbWUgb2YgcmVxdWVzdGVkIG1vZGlmaWVyXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5pc01vZGlmaWVyUmVxdWlyZWQgPSBmdW5jdGlvbihyZXF1ZXN0aW5nLCByZXF1ZXN0ZWQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gZ2V0QXJyYXlLZXlJbmRleCh0aGlzLl9vcHRpb25zLm1vZGlmaWVycywgcmVxdWVzdGluZyk7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX29wdGlvbnMubW9kaWZpZXJzLnNsaWNlKDAsIGluZGV4KS5maWx0ZXIoZnVuY3Rpb24obW9kaWZpZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RpZmllciA9PT0gcmVxdWVzdGVkO1xuICAgICAgICB9KS5sZW5ndGg7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gTW9kaWZpZXJzXG4gICAgLy9cblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVycyBsaXN0XG4gICAgICogQG5hbWVzcGFjZSBQb3BwZXIubW9kaWZpZXJzXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5tb2RpZmllcnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHRoZSBjb21wdXRlZCBzdHlsZXMgdG8gdGhlIHBvcHBlciBlbGVtZW50XG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXIubW9kaWZpZXJzXG4gICAgICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzYW1lIGRhdGEgb2JqZWN0XG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5tb2RpZmllcnMuYXBwbHlTdHlsZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy8gYXBwbHkgdGhlIGZpbmFsIG9mZnNldHMgdG8gdGhlIHBvcHBlclxuICAgICAgICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxuICAgICAgICB2YXIgc3R5bGVzID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IGRhdGEub2Zmc2V0cy5wb3BwZXIucG9zaXRpb25cbiAgICAgICAgfTtcblxuICAgICAgICAvLyByb3VuZCB0b3AgYW5kIGxlZnQgdG8gYXZvaWQgYmx1cnJ5IHRleHRcbiAgICAgICAgdmFyIGxlZnQgPSBNYXRoLnJvdW5kKGRhdGEub2Zmc2V0cy5wb3BwZXIubGVmdCk7XG4gICAgICAgIHZhciB0b3AgPSBNYXRoLnJvdW5kKGRhdGEub2Zmc2V0cy5wb3BwZXIudG9wKTtcblxuICAgICAgICAvLyBpZiBncHVBY2NlbGVyYXRpb24gaXMgc2V0IHRvIHRydWUgYW5kIHRyYW5zZm9ybSBpcyBzdXBwb3J0ZWQsIHdlIHVzZSBgdHJhbnNsYXRlM2RgIHRvIGFwcGx5IHRoZSBwb3NpdGlvbiB0byB0aGUgcG9wcGVyXG4gICAgICAgIC8vIHdlIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgdmVyc2lvbiBpZiBuZWVkZWRcbiAgICAgICAgdmFyIHByZWZpeGVkUHJvcGVydHk7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmdwdUFjY2VsZXJhdGlvbiAmJiAocHJlZml4ZWRQcm9wZXJ0eSA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJykpKSB7XG4gICAgICAgICAgICBzdHlsZXNbcHJlZml4ZWRQcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIGxlZnQgKyAncHgsICcgKyB0b3AgKyAncHgsIDApJztcbiAgICAgICAgICAgIHN0eWxlcy50b3AgPSAwO1xuICAgICAgICAgICAgc3R5bGVzLmxlZnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aHdlcmlzZSwgd2UgdXNlIHRoZSBzdGFuZGFyZCBgbGVmdGAgYW5kIGB0b3BgIHByb3BlcnRpZXNcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdHlsZXMubGVmdCA9bGVmdDtcbiAgICAgICAgICAgIHN0eWxlcy50b3AgPSB0b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbnkgcHJvcGVydHkgcHJlc2VudCBpbiBgZGF0YS5zdHlsZXNgIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLFxuICAgICAgICAvLyBpbiB0aGlzIHdheSB3ZSBjYW4gbWFrZSB0aGUgM3JkIHBhcnR5IG1vZGlmaWVycyBhZGQgY3VzdG9tIHN0eWxlcyB0byBpdFxuICAgICAgICAvLyBCZSBhd2FyZSwgbW9kaWZpZXJzIGNvdWxkIG92ZXJyaWRlIHRoZSBwcm9wZXJ0aWVzIGRlZmluZWQgaW4gdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIGxpbmVzIG9mIHRoaXMgbW9kaWZpZXIhXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGVzLCBkYXRhLnN0eWxlcyk7XG5cbiAgICAgICAgc2V0U3R5bGUodGhpcy5fcG9wcGVyLCBzdHlsZXMpO1xuXG4gICAgICAgIC8vIHNldCBhbiBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSB1c2VmdWwgdG8gc3R5bGUgdGhlIHRvb2x0aXAgKHVzZSBpdCB0byBwcm9wZXJseSBwb3NpdGlvbiBpdHMgYXJyb3cpXG4gICAgICAgIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXG4gICAgICAgIHRoaXMuX3BvcHBlci5zZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JywgZGF0YS5wbGFjZW1lbnQpO1xuXG4gICAgICAgIC8vIGlmIHRoZSBhcnJvdyBtb2RpZmllciBpcyByZXF1aXJlZCBhbmQgdGhlIGFycm93IHN0eWxlIGhhcyBiZWVuIGNvbXB1dGVkLCBhcHBseSB0aGUgYXJyb3cgc3R5bGVcbiAgICAgICAgaWYgKHRoaXMuaXNNb2RpZmllclJlcXVpcmVkKHRoaXMubW9kaWZpZXJzLmFwcGx5U3R5bGUsIHRoaXMubW9kaWZpZXJzLmFycm93KSAmJiBkYXRhLm9mZnNldHMuYXJyb3cpIHtcbiAgICAgICAgICAgIHNldFN0eWxlKGRhdGEuYXJyb3dFbGVtZW50LCBkYXRhLm9mZnNldHMuYXJyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVyIHVzZWQgdG8gc2hpZnQgdGhlIHBvcHBlciBvbiB0aGUgc3RhcnQgb3IgZW5kIG9mIGl0cyByZWZlcmVuY2UgZWxlbWVudCBzaWRlXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXIubW9kaWZpZXJzXG4gICAgICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLm1vZGlmaWVycy5zaGlmdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xuICAgICAgICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB2YXIgc2hpZnRWYXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcblxuICAgICAgICAvLyBpZiBzaGlmdCBzaGlmdFZhcmlhdGlvbiBpcyBzcGVjaWZpZWQsIHJ1biB0aGUgbW9kaWZpZXJcbiAgICAgICAgaWYgKHNoaWZ0VmFyaWF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVmZXJlbmNlID0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZTtcbiAgICAgICAgICAgIHZhciBwb3BwZXIgPSBnZXRQb3BwZXJDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xuXG4gICAgICAgICAgICB2YXIgc2hpZnRPZmZzZXRzID0ge1xuICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICB7IHRvcDogcmVmZXJlbmNlLnRvcCB9LFxuICAgICAgICAgICAgICAgICAgICBlbmQ6ICAgIHsgdG9wOiByZWZlcmVuY2UudG9wICsgcmVmZXJlbmNlLmhlaWdodCAtIHBvcHBlci5oZWlnaHQgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogIHsgbGVmdDogcmVmZXJlbmNlLmxlZnQgfSxcbiAgICAgICAgICAgICAgICAgICAgZW5kOiAgICB7IGxlZnQ6IHJlZmVyZW5jZS5sZWZ0ICsgcmVmZXJlbmNlLndpZHRoIC0gcG9wcGVyLndpZHRoIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgYXhpcyA9IFsnYm90dG9tJywgJ3RvcCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xID8gJ3gnIDogJ3knO1xuXG4gICAgICAgICAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gT2JqZWN0LmFzc2lnbihwb3BwZXIsIHNoaWZ0T2Zmc2V0c1theGlzXVtzaGlmdFZhcmlhdGlvbl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHN1cmUgdGhlIHBvcHBlciBkb2VzIG5vdCBvdmVyZmxvd3MgZnJvbSBpdCdzIGJvdW5kYXJpZXNcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcbiAgICAgKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICAgICAqL1xuICAgIFBvcHBlci5wcm90b3R5cGUubW9kaWZpZXJzLnByZXZlbnRPdmVyZmxvdyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIG9yZGVyID0gdGhpcy5fb3B0aW9ucy5wcmV2ZW50T3ZlcmZsb3dPcmRlcjtcbiAgICAgICAgdmFyIHBvcHBlciA9IGdldFBvcHBlckNsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XG5cbiAgICAgICAgdmFyIGNoZWNrID0ge1xuICAgICAgICAgICAgbGVmdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnQgPSBwb3BwZXIubGVmdDtcbiAgICAgICAgICAgICAgICBpZiAocG9wcGVyLmxlZnQgPCBkYXRhLmJvdW5kYXJpZXMubGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gTWF0aC5tYXgocG9wcGVyLmxlZnQsIGRhdGEuYm91bmRhcmllcy5sZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogbGVmdCB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IHBvcHBlci5sZWZ0O1xuICAgICAgICAgICAgICAgIGlmIChwb3BwZXIucmlnaHQgPiBkYXRhLmJvdW5kYXJpZXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgubWluKHBvcHBlci5sZWZ0LCBkYXRhLmJvdW5kYXJpZXMucmlnaHQgLSBwb3BwZXIud2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geyBsZWZ0OiBsZWZ0IH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gcG9wcGVyLnRvcDtcbiAgICAgICAgICAgICAgICBpZiAocG9wcGVyLnRvcCA8IGRhdGEuYm91bmRhcmllcy50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgocG9wcGVyLnRvcCwgZGF0YS5ib3VuZGFyaWVzLnRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHRvcDogdG9wIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm90dG9tOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gcG9wcGVyLnRvcDtcbiAgICAgICAgICAgICAgICBpZiAocG9wcGVyLmJvdHRvbSA+IGRhdGEuYm91bmRhcmllcy5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4ocG9wcGVyLnRvcCwgZGF0YS5ib3VuZGFyaWVzLmJvdHRvbSAtIHBvcHBlci5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geyB0b3A6IHRvcCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG9yZGVyLmZvckVhY2goZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gT2JqZWN0LmFzc2lnbihwb3BwZXIsIGNoZWNrW2RpcmVjdGlvbl0oKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNb2RpZmllciB1c2VkIHRvIG1ha2Ugc3VyZSB0aGUgcG9wcGVyIGlzIGFsd2F5cyBuZWFyIGl0cyByZWZlcmVuY2VcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcbiAgICAgKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgX3VwZGF0ZSBtZXRob2RcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5tb2RpZmllcnMua2VlcFRvZ2V0aGVyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgcG9wcGVyICA9IGdldFBvcHBlckNsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XG4gICAgICAgIHZhciByZWZlcmVuY2UgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xuICAgICAgICB2YXIgZiA9IE1hdGguZmxvb3I7XG5cbiAgICAgICAgaWYgKHBvcHBlci5yaWdodCA8IGYocmVmZXJlbmNlLmxlZnQpKSB7XG4gICAgICAgICAgICBkYXRhLm9mZnNldHMucG9wcGVyLmxlZnQgPSBmKHJlZmVyZW5jZS5sZWZ0KSAtIHBvcHBlci53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9wcGVyLmxlZnQgPiBmKHJlZmVyZW5jZS5yaWdodCkpIHtcbiAgICAgICAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIubGVmdCA9IGYocmVmZXJlbmNlLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9wcGVyLmJvdHRvbSA8IGYocmVmZXJlbmNlLnRvcCkpIHtcbiAgICAgICAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIudG9wID0gZihyZWZlcmVuY2UudG9wKSAtIHBvcHBlci5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvcHBlci50b3AgPiBmKHJlZmVyZW5jZS5ib3R0b20pKSB7XG4gICAgICAgICAgICBkYXRhLm9mZnNldHMucG9wcGVyLnRvcCA9IGYocmVmZXJlbmNlLmJvdHRvbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9kaWZpZXIgdXNlZCB0byBmbGlwIHRoZSBwbGFjZW1lbnQgb2YgdGhlIHBvcHBlciB3aGVuIHRoZSBsYXR0ZXIgaXMgc3RhcnRpbmcgb3ZlcmxhcHBpbmcgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgICAqIFJlcXVpcmVzIHRoZSBgcHJldmVudE92ZXJmbG93YCBtb2RpZmllciBiZWZvcmUgaXQgaW4gb3JkZXIgdG8gd29yay5cbiAgICAgKiAqKk5PVEU6KiogVGhpcyBtb2RpZmllciB3aWxsIHJ1biBhbGwgaXRzIHByZXZpb3VzIG1vZGlmaWVycyBldmVyeXRpbWUgaXQgdHJpZXMgdG8gZmxpcCB0aGUgcG9wcGVyIVxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyLm1vZGlmaWVyc1xuICAgICAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBfdXBkYXRlIG1ldGhvZFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLm1vZGlmaWVycy5mbGlwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvLyBjaGVjayBpZiBwcmV2ZW50T3ZlcmZsb3cgaXMgaW4gdGhlIGxpc3Qgb2YgbW9kaWZpZXJzIGJlZm9yZSB0aGUgZmxpcCBtb2RpZmllci5cbiAgICAgICAgLy8gb3RoZXJ3aXNlIGZsaXAgd291bGQgbm90IHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICAgIGlmICghdGhpcy5pc01vZGlmaWVyUmVxdWlyZWQodGhpcy5tb2RpZmllcnMuZmxpcCwgdGhpcy5tb2RpZmllcnMucHJldmVudE92ZXJmbG93KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBwcmV2ZW50T3ZlcmZsb3cgbW9kaWZpZXIgaXMgcmVxdWlyZWQgYnkgZmxpcCBtb2RpZmllciBpbiBvcmRlciB0byB3b3JrLCBiZSBzdXJlIHRvIGluY2x1ZGUgaXQgYmVmb3JlIGZsaXAhJyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLmZsaXBwZWQgJiYgZGF0YS5wbGFjZW1lbnQgPT09IGRhdGEuX29yaWdpbmFsUGxhY2VtZW50KSB7XG4gICAgICAgICAgICAvLyBzZWVtcyBsaWtlIGZsaXAgaXMgdHJ5aW5nIHRvIGxvb3AsIHByb2JhYmx5IHRoZXJlJ3Mgbm90IGVub3VnaCBzcGFjZSBvbiBhbnkgb2YgdGhlIGZsaXBwYWJsZSBzaWRlc1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgdmFyIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgICAgICAgdmFyIHZhcmlhdGlvbiA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMV0gfHwgJyc7XG5cbiAgICAgICAgdmFyIGZsaXBPcmRlciA9IFtdO1xuICAgICAgICBpZih0aGlzLl9vcHRpb25zLmZsaXBCZWhhdmlvciA9PT0gJ2ZsaXAnKSB7XG4gICAgICAgICAgICBmbGlwT3JkZXIgPSBbXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50LFxuICAgICAgICAgICAgICAgIHBsYWNlbWVudE9wcG9zaXRlXG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmxpcE9yZGVyID0gdGhpcy5fb3B0aW9ucy5mbGlwQmVoYXZpb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmbGlwT3JkZXIuZm9yRWFjaChmdW5jdGlvbihzdGVwLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKHBsYWNlbWVudCAhPT0gc3RlcCB8fCBmbGlwT3JkZXIubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XG4gICAgICAgICAgICBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICAgICAgICAgIHZhciBwb3BwZXJPZmZzZXRzID0gZ2V0UG9wcGVyQ2xpZW50UmVjdChkYXRhLm9mZnNldHMucG9wcGVyKTtcblxuICAgICAgICAgICAgLy8gdGhpcyBib29sZWFuIGlzIHVzZWQgdG8gZGlzdGluZ3Vpc2ggcmlnaHQgYW5kIGJvdHRvbSBmcm9tIHRvcCBhbmQgbGVmdFxuICAgICAgICAgICAgLy8gdGhleSBuZWVkIGRpZmZlcmVudCBjb21wdXRhdGlvbnMgdG8gZ2V0IGZsaXBwZWRcbiAgICAgICAgICAgIHZhciBhID0gWydyaWdodCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xuXG4gICAgICAgICAgICAvLyB1c2luZyBNYXRoLmZsb29yIGJlY2F1c2UgdGhlIHJlZmVyZW5jZSBvZmZzZXRzIG1heSBjb250YWluIGRlY2ltYWxzIHdlIGFyZSBub3QgZ29pbmcgdG8gY29uc2lkZXIgaGVyZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGEgJiYgTWF0aC5mbG9vcihkYXRhLm9mZnNldHMucmVmZXJlbmNlW3BsYWNlbWVudF0pID4gTWF0aC5mbG9vcihwb3BwZXJPZmZzZXRzW3BsYWNlbWVudE9wcG9zaXRlXSkgfHxcbiAgICAgICAgICAgICAgICAhYSAmJiBNYXRoLmZsb29yKGRhdGEub2Zmc2V0cy5yZWZlcmVuY2VbcGxhY2VtZW50XSkgPCBNYXRoLmZsb29yKHBvcHBlck9mZnNldHNbcGxhY2VtZW50T3Bwb3NpdGVdKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gd2UnbGwgdXNlIHRoaXMgYm9vbGVhbiB0byBkZXRlY3QgYW55IGZsaXAgbG9vcFxuICAgICAgICAgICAgICAgIGRhdGEuZmxpcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGF0YS5wbGFjZW1lbnQgPSBmbGlwT3JkZXJbaW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGxhY2VtZW50ICs9ICctJyArIHZhcmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IHRoaXMuX2dldE9mZnNldHModGhpcy5fcG9wcGVyLCB0aGlzLl9yZWZlcmVuY2UsIGRhdGEucGxhY2VtZW50KS5wb3BwZXI7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5ydW5Nb2RpZmllcnMoZGF0YSwgdGhpcy5fb3B0aW9ucy5tb2RpZmllcnMsIHRoaXMuX2ZsaXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9kaWZpZXIgdXNlZCB0byBhZGQgYW4gb2Zmc2V0IHRvIHRoZSBwb3BwZXIsIHVzZWZ1bCBpZiB5b3UgbW9yZSBncmFudWxhcml0eSBwb3NpdGlvbmluZyB5b3VyIHBvcHBlci5cbiAgICAgKiBUaGUgb2Zmc2V0cyB3aWxsIHNoaWZ0IHRoZSBwb3BwZXIgb24gdGhlIHNpZGUgb2YgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyLm1vZGlmaWVyc1xuICAgICAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBfdXBkYXRlIG1ldGhvZFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAgICAgKi9cbiAgICBQb3BwZXIucHJvdG90eXBlLm1vZGlmaWVycy5vZmZzZXQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vcHRpb25zLm9mZnNldDtcbiAgICAgICAgdmFyIHBvcHBlciAgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xuXG4gICAgICAgIGlmIChkYXRhLnBsYWNlbWVudC5pbmRleE9mKCdsZWZ0JykgIT09IC0xKSB7XG4gICAgICAgICAgICBwb3BwZXIudG9wIC09IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnBsYWNlbWVudC5pbmRleE9mKCdyaWdodCcpICE9PSAtMSkge1xuICAgICAgICAgICAgcG9wcGVyLnRvcCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5wbGFjZW1lbnQuaW5kZXhPZigndG9wJykgIT09IC0xKSB7XG4gICAgICAgICAgICBwb3BwZXIubGVmdCAtPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5wbGFjZW1lbnQuaW5kZXhPZignYm90dG9tJykgIT09IC0xKSB7XG4gICAgICAgICAgICBwb3BwZXIubGVmdCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVyIHVzZWQgdG8gbW92ZSB0aGUgYXJyb3dzIG9uIHRoZSBlZGdlIG9mIHRoZSBwb3BwZXIgdG8gbWFrZSBzdXJlIHRoZW0gYXJlIGFsd2F5cyBiZXR3ZWVuIHRoZSBwb3BwZXIgYW5kIHRoZSByZWZlcmVuY2UgZWxlbWVudFxuICAgICAqIEl0IHdpbGwgdXNlIHRoZSBDU1Mgb3V0ZXIgc2l6ZSBvZiB0aGUgYXJyb3cgZWxlbWVudCB0byBrbm93IGhvdyBtYW55IHBpeGVscyBvZiBjb25qdWN0aW9uIGFyZSBuZWVkZWRcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcbiAgICAgKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgX3VwZGF0ZSBtZXRob2RcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXG4gICAgICovXG4gICAgUG9wcGVyLnByb3RvdHlwZS5tb2RpZmllcnMuYXJyb3cgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBhcnJvdyAgPSB0aGlzLl9vcHRpb25zLmFycm93RWxlbWVudDtcblxuICAgICAgICAvLyBpZiB0aGUgYXJyb3dFbGVtZW50IGlzIGEgc3RyaW5nLCBzdXBwb3NlIGl0J3MgYSBDU1Mgc2VsZWN0b3JcbiAgICAgICAgaWYgKHR5cGVvZiBhcnJvdyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGFycm93ID0gdGhpcy5fcG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYXJyb3cgZWxlbWVudCBpcyBub3QgZm91bmQsIGRvbid0IHJ1biB0aGUgbW9kaWZpZXJcbiAgICAgICAgaWYgKCFhcnJvdykge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGUgYXJyb3cgZWxlbWVudCBtdXN0IGJlIGNoaWxkIG9mIGl0cyBwb3BwZXJcbiAgICAgICAgaWYgKCF0aGlzLl9wb3BwZXIuY29udGFpbnMoYXJyb3cpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IGBhcnJvd0VsZW1lbnRgIG11c3QgYmUgY2hpbGQgb2YgaXRzIHBvcHBlciBlbGVtZW50IScpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcnJvdyBkZXBlbmRzIG9uIGtlZXBUb2dldGhlciBpbiBvcmRlciB0byB3b3JrXG4gICAgICAgIGlmICghdGhpcy5pc01vZGlmaWVyUmVxdWlyZWQodGhpcy5tb2RpZmllcnMuYXJyb3csIHRoaXMubW9kaWZpZXJzLmtlZXBUb2dldGhlcikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignV0FSTklORzoga2VlcFRvZ2V0aGVyIG1vZGlmaWVyIGlzIHJlcXVpcmVkIGJ5IGFycm93IG1vZGlmaWVyIGluIG9yZGVyIHRvIHdvcmssIGJlIHN1cmUgdG8gaW5jbHVkZSBpdCBiZWZvcmUgYXJyb3chJyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcnJvd1N0eWxlICA9IHt9O1xuICAgICAgICB2YXIgcGxhY2VtZW50ICAgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB2YXIgcG9wcGVyICAgICAgPSBnZXRQb3BwZXJDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xuICAgICAgICB2YXIgcmVmZXJlbmNlICAgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xuICAgICAgICB2YXIgaXNWZXJ0aWNhbCAgPSBbJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xuXG4gICAgICAgIHZhciBsZW4gICAgICAgICA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gICAgICAgIHZhciBzaWRlICAgICAgICA9IGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgdmFyIGFsdFNpZGUgICAgID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICB2YXIgb3BTaWRlICAgICAgPSBpc1ZlcnRpY2FsID8gJ2JvdHRvbScgOiAncmlnaHQnO1xuICAgICAgICB2YXIgYXJyb3dTaXplICAgPSBnZXRPdXRlclNpemVzKGFycm93KVtsZW5dO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGV4dGVuZHMga2VlcFRvZ2V0aGVyIGJlaGF2aW9yIG1ha2luZyBzdXJlIHRoZSBwb3BwZXIgYW5kIGl0cyByZWZlcmVuY2UgaGF2ZSBlbm91Z2ggcGl4ZWxzIGluIGNvbmp1Y3Rpb25cbiAgICAgICAgLy9cblxuICAgICAgICAvLyB0b3AvbGVmdCBzaWRlXG4gICAgICAgIGlmIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93U2l6ZSA8IHBvcHBlcltzaWRlXSkge1xuICAgICAgICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtPSBwb3BwZXJbc2lkZV0gLSAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd1NpemUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJvdHRvbS9yaWdodCBzaWRlXG4gICAgICAgIGlmIChyZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd1NpemUgPiBwb3BwZXJbb3BTaWRlXSkge1xuICAgICAgICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSArPSAocmVmZXJlbmNlW3NpZGVdICsgYXJyb3dTaXplKSAtIHBvcHBlcltvcFNpZGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29tcHV0ZSBjZW50ZXIgb2YgdGhlIHBvcHBlclxuICAgICAgICB2YXIgY2VudGVyID0gcmVmZXJlbmNlW3NpZGVdICsgKHJlZmVyZW5jZVtsZW5dIC8gMikgLSAoYXJyb3dTaXplIC8gMik7XG5cbiAgICAgICAgdmFyIHNpZGVWYWx1ZSA9IGNlbnRlciAtIHBvcHBlcltzaWRlXTtcblxuICAgICAgICAvLyBwcmV2ZW50IGFycm93IGZyb20gYmVpbmcgcGxhY2VkIG5vdCBjb250aWd1b3VzbHkgdG8gaXRzIHBvcHBlclxuICAgICAgICBzaWRlVmFsdWUgPSBNYXRoLm1heChNYXRoLm1pbihwb3BwZXJbbGVuXSAtIGFycm93U2l6ZSwgc2lkZVZhbHVlKSwgMCk7XG4gICAgICAgIGFycm93U3R5bGVbc2lkZV0gPSBzaWRlVmFsdWU7XG4gICAgICAgIGFycm93U3R5bGVbYWx0U2lkZV0gPSAnJzsgLy8gbWFrZSBzdXJlIHRvIHJlbW92ZSBhbnkgb2xkIHN0eWxlIGZyb20gdGhlIGFycm93XG5cbiAgICAgICAgZGF0YS5vZmZzZXRzLmFycm93ID0gYXJyb3dTdHlsZTtcbiAgICAgICAgZGF0YS5hcnJvd0VsZW1lbnQgPSBhcnJvdztcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG5cbiAgICAvL1xuICAgIC8vIEhlbHBlcnNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvdXRlciBzaXplcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudCAob2Zmc2V0IHNpemUgKyBtYXJnaW5zKVxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRPdXRlclNpemVzKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgICAgICAgdmFyIF9kaXNwbGF5ID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5LCBfdmlzaWJpbGl0eSA9IGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIHZhciBjYWxjV2lkdGhUb0ZvcmNlUmVwYWludCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgLy8gb3JpZ2luYWwgbWV0aG9kXG4gICAgICAgIHZhciBzdHlsZXMgPSByb290LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIHZhciB4ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkJvdHRvbSk7XG4gICAgICAgIHZhciB5ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5SaWdodCk7XG4gICAgICAgIHZhciByZXN1bHQgPSB7IHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoICsgeSwgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCArIHggfTtcblxuICAgICAgICAvLyByZXNldCBlbGVtZW50IHN0eWxlc1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBfZGlzcGxheTsgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gX3Zpc2liaWxpdHk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvcHBvc2l0ZSBwbGFjZW1lbnQgb2YgdGhlIGdpdmVuIG9uZS9cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudFxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gICAgICAgIHZhciBoYXNoID0ge2xlZnQ6ICdyaWdodCcsIHJpZ2h0OiAnbGVmdCcsIGJvdHRvbTogJ3RvcCcsIHRvcDogJ2JvdHRvbScgfTtcbiAgICAgICAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24obWF0Y2hlZCl7XG4gICAgICAgICAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gdGhlIHBvcHBlciBvZmZzZXRzLCBnZW5lcmF0ZSBhbiBvdXRwdXQgc2ltaWxhciB0byBnZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDbGllbnRSZWN0IGxpa2Ugb3V0cHV0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UG9wcGVyQ2xpZW50UmVjdChwb3BwZXJPZmZzZXRzKSB7XG4gICAgICAgIHZhciBvZmZzZXRzID0gT2JqZWN0LmFzc2lnbih7fSwgcG9wcGVyT2Zmc2V0cyk7XG4gICAgICAgIG9mZnNldHMucmlnaHQgPSBvZmZzZXRzLmxlZnQgKyBvZmZzZXRzLndpZHRoO1xuICAgICAgICBvZmZzZXRzLmJvdHRvbSA9IG9mZnNldHMudG9wICsgb2Zmc2V0cy5oZWlnaHQ7XG4gICAgICAgIHJldHVybiBvZmZzZXRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGFuIGFycmF5IGFuZCB0aGUga2V5IHRvIGZpbmQsIHJldHVybnMgaXRzIGluZGV4XG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBhcmd1bWVudCB7QXJyYXl9IGFyclxuICAgICAqIEBhcmd1bWVudCBrZXlUb0ZpbmRcbiAgICAgKiBAcmV0dXJucyBpbmRleCBvciBudWxsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXJyYXlLZXlJbmRleChhcnIsIGtleVRvRmluZCkge1xuICAgICAgICB2YXIgaSA9IDAsIGtleTtcbiAgICAgICAgZm9yIChrZXkgaW4gYXJyKSB7XG4gICAgICAgICAgICBpZiAoYXJyW2tleV0gPT09IGtleVRvRmluZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBDU1MgY29tcHV0ZWQgcHJvcGVydHkgb2YgdGhlIGdpdmVuIGVsZW1lbnRcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQGFyZ3VtZW50IHtFZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAYXJndW1lbnQge1N0cmluZ30gcHJvcGVydHlcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgcHJvcGVydHkpIHtcbiAgICAgICAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgICAgICAgdmFyIGNzcyA9IHJvb3QuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcbiAgICAgICAgcmV0dXJuIGNzc1twcm9wZXJ0eV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgb2Zmc2V0IHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0gb2Zmc2V0IHBhcmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gICAgICAgIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXG4gICAgICAgIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgcmV0dXJuIG9mZnNldFBhcmVudCA9PT0gcm9vdC5kb2N1bWVudC5ib2R5IHx8ICFvZmZzZXRQYXJlbnQgPyByb290LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IG9mZnNldFBhcmVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzY3JvbGxpbmcgcGFyZW50IG9mIHRoZSBnaXZlbiBlbGVtZW50XG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBvZmZzZXQgcGFyZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50ID09PSByb290LmRvY3VtZW50KSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IHB1dHMgdGhlIHNjcm9sbFRPcCB2YWx1ZSBvbiBgZG9jdW1lbnRFbGVtZW50YCBpbnN0ZWFkIG9mIGBib2R5YCwgd2UgdGhlbiBjaGVjayB3aGljaCBvZiB0aGVtIGlzXG4gICAgICAgICAgICAvLyBncmVhdGVyIHRoYW4gMCBhbmQgcmV0dXJuIHRoZSBwcm9wZXIgZWxlbWVudFxuICAgICAgICAgICAgaWYgKHJvb3QuZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdC5kb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaXJlZm94IHdhbnQgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgWydzY3JvbGwnLCAnYXV0byddLmluZGV4T2YoZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCwgJ292ZXJmbG93JykpICE9PSAtMSB8fFxuICAgICAgICAgICAgWydzY3JvbGwnLCAnYXV0byddLmluZGV4T2YoZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCwgJ292ZXJmbG93LXgnKSkgIT09IC0xIHx8XG4gICAgICAgICAgICBbJ3Njcm9sbCcsICdhdXRvJ10uaW5kZXhPZihnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkocGFyZW50LCAnb3ZlcmZsb3cteScpKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGV0ZWN0ZWQgc2Nyb2xsUGFyZW50IGlzIGJvZHksIHdlIHBlcmZvcm0gYW4gYWRkaXRpb25hbCBjaGVjayBvbiBpdHMgcGFyZW50Tm9kZVxuICAgICAgICAgICAgLy8gaW4gdGhpcyB3YXkgd2UnbGwgZ2V0IGJvZHkgaWYgdGhlIGJyb3dzZXIgaXMgQ2hyb21lLWlzaCwgb3IgZG9jdW1lbnRFbGVtZW50IG90aGVyd2lzZVxuICAgICAgICAgICAgLy8gZml4ZXMgaXNzdWUgIzY1XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudC5wYXJlbnROb2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBmaXhlZCBvciBpcyBpbnNpZGUgYSBmaXhlZCBwYXJlbnRcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gICAgICogQGFyZ3VtZW50IHtFbGVtZW50fSBjdXN0b21Db250YWluZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYW5zd2VyIHRvIFwiaXNGaXhlZD9cIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRml4ZWQoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gcm9vdC5kb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50LCAncG9zaXRpb24nKSA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSA/IGlzRml4ZWQoZWxlbWVudC5wYXJlbnROb2RlKSA6IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzdHlsZSB0byB0aGUgZ2l2ZW4gcG9wcGVyXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIHN0eWxlIHRvXG4gICAgICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlcyAtIE9iamVjdCB3aXRoIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0U3R5bGUoZWxlbWVudCwgc3R5bGVzKSB7XG4gICAgICAgIGZ1bmN0aW9uIGlzX251bWVyaWMobikge1xuICAgICAgICAgICAgcmV0dXJuIChuICE9PSAnJyAmJiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobikpO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICB2YXIgdW5pdCA9ICcnO1xuICAgICAgICAgICAgLy8gYWRkIHVuaXQgaWYgdGhlIHZhbHVlIGlzIG51bWVyaWMgYW5kIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICBpZiAoWyd3aWR0aCcsICdoZWlnaHQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uaW5kZXhPZihwcm9wKSAhPT0gLTEgJiYgaXNfbnVtZXJpYyhzdHlsZXNbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgdW5pdCA9ICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gc3R5bGVzW3Byb3BdICsgdW5pdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgZnVuY3Rpb25cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQGFyZ3VtZW50IHsqfSBmdW5jdGlvblRvQ2hlY2sgLSB2YXJpYWJsZSB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG86IGlzIGEgZnVuY3Rpb24/XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiAgICAgICAgdmFyIGdldFR5cGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBnaXZlbiBlbGVtZW50LCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0IHBhcmVudFxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHBvc2l0aW9uIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGVsZW1lbnQgYW5kIGl0cyBgc2Nyb2xsVG9wYFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9mZnNldFJlY3QoZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudFJlY3QgPSB7XG4gICAgICAgICAgICB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IGVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudFJlY3QucmlnaHQgPSBlbGVtZW50UmVjdC5sZWZ0ICsgZWxlbWVudFJlY3Qud2lkdGg7XG4gICAgICAgIGVsZW1lbnRSZWN0LmJvdHRvbSA9IGVsZW1lbnRSZWN0LnRvcCArIGVsZW1lbnRSZWN0LmhlaWdodDtcblxuICAgICAgICAvLyBwb3NpdGlvblxuICAgICAgICByZXR1cm4gZWxlbWVudFJlY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIGdpdmVuIGVsZW1lbnRcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gY2xpZW50IHJlY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgLy8gd2hldGhlciB0aGUgSUUgdmVyc2lvbiBpcyBsb3dlciB0aGFuIDExXG4gICAgICAgIHZhciBpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSAhPSAtMTtcblxuICAgICAgICAvLyBmaXggaWUgZG9jdW1lbnQgYm91bmRpbmcgdG9wIGFsd2F5cyAwIGJ1Z1xuICAgICAgICB2YXIgcmVjdFRvcCA9IGlzSUUgJiYgZWxlbWVudC50YWdOYW1lID09PSAnSFRNTCdcbiAgICAgICAgICAgID8gLWVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICAgICAgICA6IHJlY3QudG9wO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IHJlY3RUb3AsXG4gICAgICAgICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICAgICAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICAgICAgICB3aWR0aDogcmVjdC5yaWdodCAtIHJlY3QubGVmdCxcbiAgICAgICAgICAgIGhlaWdodDogcmVjdC5ib3R0b20gLSByZWN0VG9wXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYW4gZWxlbWVudCBhbmQgb25lIG9mIGl0cyBwYXJlbnRzLCByZXR1cm4gdGhlIG9mZnNldFxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gICAgICogQHJldHVybiB7T2JqZWN0fSByZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9DdXN0b21QYXJlbnQoZWxlbWVudCwgcGFyZW50LCBmaXhlZCkge1xuICAgICAgICB2YXIgZWxlbWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCk7XG4gICAgICAgIHZhciBwYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHBhcmVudCk7XG5cbiAgICAgICAgaWYgKGZpeGVkKSB7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KHBhcmVudCk7XG4gICAgICAgICAgICBwYXJlbnRSZWN0LnRvcCArPSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgcGFyZW50UmVjdC5ib3R0b20gKz0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIHBhcmVudFJlY3QubGVmdCArPSBzY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIHBhcmVudFJlY3QucmlnaHQgKz0gc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjdCA9IHtcbiAgICAgICAgICAgIHRvcDogZWxlbWVudFJlY3QudG9wIC0gcGFyZW50UmVjdC50b3AgLFxuICAgICAgICAgICAgbGVmdDogZWxlbWVudFJlY3QubGVmdCAtIHBhcmVudFJlY3QubGVmdCAsXG4gICAgICAgICAgICBib3R0b206IChlbGVtZW50UmVjdC50b3AgLSBwYXJlbnRSZWN0LnRvcCkgKyBlbGVtZW50UmVjdC5oZWlnaHQsXG4gICAgICAgICAgICByaWdodDogKGVsZW1lbnRSZWN0LmxlZnQgLSBwYXJlbnRSZWN0LmxlZnQpICsgZWxlbWVudFJlY3Qud2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogZWxlbWVudFJlY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGVsZW1lbnRSZWN0LmhlaWdodFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHByZWZpeGVkIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eSAoY2FtZWxDYXNlKVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IHByZWZpeGVkIHByb3BlcnR5IChjYW1lbENhc2UpXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKHByb3BlcnR5KSB7XG4gICAgICAgIHZhciBwcmVmaXhlcyA9IFsnJywgJ21zJywgJ3dlYmtpdCcsICdtb3onLCAnbyddO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0b0NoZWNrID0gcHJlZml4ZXNbaV0gPyBwcmVmaXhlc1tpXSArIHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSkgOiBwcm9wZXJ0eTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdC5kb2N1bWVudC5ib2R5LnN0eWxlW3RvQ2hlY2tdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b0NoZWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBPYmplY3QuYXNzaWduKCkgbWV0aG9kIGlzIHVzZWQgdG8gY29weSB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlXG4gICAgICogb2JqZWN0cyB0byBhIHRhcmdldCBvYmplY3QuIEl0IHdpbGwgcmV0dXJuIHRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIFRoaXMgcG9seWZpbGwgZG9lc24ndCBzdXBwb3J0IHN5bWJvbCBwcm9wZXJ0aWVzLCBzaW5jZSBFUzUgZG9lc24ndCBoYXZlIHN5bWJvbHMgYW55d2F5XG4gICAgICogU291cmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGlmICghT2JqZWN0LmFzc2lnbikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRTb3VyY2UgPSBPYmplY3QobmV4dFNvdXJjZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKG5leHRTb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUG9wcGVyO1xufSkpO1xuIl19
