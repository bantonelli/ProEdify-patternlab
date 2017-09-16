define(['exports', 'popper.js'], function (exports, _popper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _popper2 = _interopRequireDefault(_popper);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function on(element, event, handler) {
        if (element && event && handler) {
            document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
        }
    }

    function off(element, event, handler) {
        if (element && event) {
            document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
        }
    }

    exports.default = {
        props: {
            trigger: {
                type: String,
                default: 'hover',
                validator: function validator(value) {
                    return ['click', 'hover'].indexOf(value) > -1;
                }
            },
            delayOnMouseOut: {
                type: Number,
                default: 10
            },
            disabled: {
                type: Boolean,
                default: false
            },
            content: String,
            enterActiveClass: String,
            leaveActiveClass: String,
            boundariesSelector: String,
            reference: {},
            forceShow: {
                type: Boolean,
                default: false
            },
            appendToBody: {
                type: Boolean,
                default: false
            },
            visibleArrow: {
                type: Boolean,
                default: true
            },
            transition: {
                type: String,
                default: ''
            },
            options: {
                type: Object,
                default: function _default() {
                    return {};
                }
            }
        },
        data: function data() {
            return {
                referenceElm: null,
                popperJS: null,
                showPopper: false,
                currentPlacement: '',
                popperOptions: {
                    placement: 'bottom',
                    gpuAcceleration: false
                }
            };
        },

        watch: {
            showPopper: function showPopper(value) {
                if (value) {
                    this.$emit('show');
                    this.updatePopper();
                } else {
                    this.$emit('hide');
                }
            },

            forceShow: {
                handler: function handler(value) {
                    this[value ? 'doShow' : 'doClose']();
                },

                immediate: true
            }
        },
        created: function created() {
            this.popperOptions = Object.assign(this.popperOptions, this.options);
        },
        mounted: function mounted() {
            //this.referenceElm = this.reference || this.$slots.reference[0].elm;
            //this.popper = this.$slots.default[0].elm;
            this.referenceElm = this.$parent.$refs.reference.$el;
            this.popper = this.$el;
            switch (this.trigger) {
                case 'click':
                    on(this.referenceElm, 'click', this.doToggle);
                    on(document, 'click', this.handleDocumentClick);
                    break;
                case 'hover':
                    on(this.referenceElm, 'mouseover', this.onMouseOver);
                    on(this.popper, 'mouseover', this.onMouseOver);
                    on(this.referenceElm, 'mouseout', this.onMouseOut);
                    on(this.popper, 'mouseout', this.onMouseOut);
                    break;
            }
            this.createPopper();
        },

        methods: {
            doToggle: function doToggle() {
                if (!this.forceShow) {
                    this.showPopper = !this.showPopper;
                }
            },
            doShow: function doShow() {
                this.showPopper = true;
            },
            doClose: function doClose() {
                this.showPopper = false;
            },
            doDestroy: function doDestroy() {
                if (this.showPopper || !this.popperJS) {
                    return;
                }
                this.popperJS.destroy();
                this.popperJS = null;
            },
            createPopper: function createPopper() {
                var _this = this;

                this.$nextTick(function () {
                    if (_this.visibleArrow) {
                        _this.appendArrow(_this.popper);
                    }
                    if (_this.appendToBody) {
                        document.body.appendChild(_this.popper.parentElement);
                    }
                    if (_this.popperJS && _this.popperJS.destroy) {
                        _this.popperJS.destroy();
                    }
                    if (_this.boundariesSelector) {
                        var boundariesElement = document.querySelector(_this.boundariesSelector);
                        if (boundariesElement) {
                            _this.popperOptions.modifiers = Object.assign({}, _this.popperOptions.modifiers);
                            _this.popperOptions.modifiers.preventOverflow = Object.assign({}, _this.popperOptions.modifiers.preventOverflow);
                            _this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
                        }
                    }
                    _this.popperOptions.onCreate = function () {
                        _this.$emit('created', _this);
                        _this.$nextTick(_this.updatePopper);
                    };
                    _this.popperJS = new _popper2.default(_this.referenceElm, _this.popper, _this.popperOptions);
                });
            },
            destroyPopper: function destroyPopper() {
                off(this.referenceElm, 'click', this.doToggle);
                off(this.referenceElm, 'mouseup', this.doClose);
                off(this.referenceElm, 'mousedown', this.doShow);
                off(this.referenceElm, 'focus', this.doShow);
                off(this.referenceElm, 'blur', this.doClose);
                off(this.referenceElm, 'mouseout', this.onMouseOut);
                off(this.referenceElm, 'mouseover', this.onMouseOver);
                off(document, 'click', this.handleDocumentClick);
                this.popperJS = null;
            },
            appendArrow: function appendArrow(element) {
                if (this.appended) {
                    return;
                }
                this.appended = true;
                var arrow = document.createElement('div');
                arrow.setAttribute('x-arrow', '');
                arrow.className = 'popper__arrow';
                element.appendChild(arrow);
            },
            updatePopper: function updatePopper() {
                this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
            },
            onMouseOver: function onMouseOver() {
                this.showPopper = true;
                clearTimeout(this._timer);
            },
            onMouseOut: function onMouseOut() {
                var _this2 = this;

                this._timer = setTimeout(function () {
                    _this2.showPopper = false;
                }, this.delayOnMouseOut);
            },
            handleDocumentClick: function handleDocumentClick(e) {
                if (!this.$el || !this.referenceElm || this.$el.contains(e.target) || this.referenceElm.contains(e.target) || !this.popper || this.popper.contains(e.target) || this.forceShow) {
                    return;
                }
                this.showPopper = false;
            }
        },
        destroyed: function destroyed() {
            this.destroyPopper();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92dWUtcG9wcGVyMi5qcyJdLCJuYW1lcyI6WyJvbiIsImVsZW1lbnQiLCJldmVudCIsImhhbmRsZXIiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXRhY2hFdmVudCIsInByb3BzIiwidHJpZ2dlciIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwidmFsaWRhdG9yIiwiaW5kZXhPZiIsInZhbHVlIiwiZGVsYXlPbk1vdXNlT3V0IiwiTnVtYmVyIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwiY29udGVudCIsImVudGVyQWN0aXZlQ2xhc3MiLCJsZWF2ZUFjdGl2ZUNsYXNzIiwiYm91bmRhcmllc1NlbGVjdG9yIiwicmVmZXJlbmNlIiwiZm9yY2VTaG93IiwiYXBwZW5kVG9Cb2R5IiwidmlzaWJsZUFycm93IiwidHJhbnNpdGlvbiIsIm9wdGlvbnMiLCJPYmplY3QiLCJkYXRhIiwicmVmZXJlbmNlRWxtIiwicG9wcGVySlMiLCJzaG93UG9wcGVyIiwiY3VycmVudFBsYWNlbWVudCIsInBvcHBlck9wdGlvbnMiLCJwbGFjZW1lbnQiLCJncHVBY2NlbGVyYXRpb24iLCJ3YXRjaCIsIiRlbWl0IiwidXBkYXRlUG9wcGVyIiwiaW1tZWRpYXRlIiwiY3JlYXRlZCIsImFzc2lnbiIsIm1vdW50ZWQiLCIkcGFyZW50IiwiJHJlZnMiLCIkZWwiLCJwb3BwZXIiLCJkb1RvZ2dsZSIsImhhbmRsZURvY3VtZW50Q2xpY2siLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VPdXQiLCJjcmVhdGVQb3BwZXIiLCJtZXRob2RzIiwiZG9TaG93IiwiZG9DbG9zZSIsImRvRGVzdHJveSIsImRlc3Ryb3kiLCIkbmV4dFRpY2siLCJhcHBlbmRBcnJvdyIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInBhcmVudEVsZW1lbnQiLCJib3VuZGFyaWVzRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtb2RpZmllcnMiLCJwcmV2ZW50T3ZlcmZsb3ciLCJvbkNyZWF0ZSIsImRlc3Ryb3lQb3BwZXIiLCJhcHBlbmRlZCIsImFycm93IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImNsYXNzTmFtZSIsInNjaGVkdWxlVXBkYXRlIiwiY2xlYXJUaW1lb3V0IiwiX3RpbWVyIiwic2V0VGltZW91dCIsImUiLCJjb250YWlucyIsInRhcmdldCIsImRlc3Ryb3llZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsYUFBU0EsRUFBVCxDQUFZQyxPQUFaLEVBQXFCQyxLQUFyQixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDakMsWUFBSUYsV0FBV0MsS0FBWCxJQUFvQkMsT0FBeEIsRUFBaUM7QUFDN0JDLHFCQUFTQyxnQkFBVCxHQUE0QkosUUFBUUksZ0JBQVIsQ0FBeUJILEtBQXpCLEVBQWdDQyxPQUFoQyxFQUF5QyxLQUF6QyxDQUE1QixHQUE4RUYsUUFBUUssV0FBUixDQUFvQixPQUFPSixLQUEzQixFQUFrQ0MsT0FBbEMsQ0FBOUU7QUFDSDtBQUNKOztBQUVELGFBQVNJLEdBQVQsQ0FBYU4sT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE9BQTdCLEVBQXNDO0FBQ2xDLFlBQUlGLFdBQVdDLEtBQWYsRUFBc0I7QUFDbEJFLHFCQUFTSSxtQkFBVCxHQUErQlAsUUFBUU8sbUJBQVIsQ0FBNEJOLEtBQTVCLEVBQW1DQyxPQUFuQyxFQUE0QyxLQUE1QyxDQUEvQixHQUFvRkYsUUFBUVEsV0FBUixDQUFvQixPQUFPUCxLQUEzQixFQUFrQ0MsT0FBbEMsQ0FBcEY7QUFDSDtBQUNKOztzQkFFYztBQUNYTyxlQUFPO0FBQ0hDLHFCQUFTO0FBQ0xDLHNCQUFNQyxNQUREO0FBRUxDLHlCQUFTLE9BRko7QUFHTEMsMkJBQVc7QUFBQSwyQkFBUyxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CQyxPQUFuQixDQUEyQkMsS0FBM0IsSUFBb0MsQ0FBQyxDQUE5QztBQUFBO0FBSE4sYUFETjtBQU1IQyw2QkFBaUI7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OiJhcHAvdXRpbHMvdnVlLXBvcHBlcjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9wcGVyIGZyb20gJ3BvcHBlci5qcyc7XG5cbmZ1bmN0aW9uIG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgaWYgKGVsZW1lbnQgJiYgZXZlbnQgJiYgaGFuZGxlcikge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSkgOiBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvZmYoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICBpZiAoZWxlbWVudCAmJiBldmVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyID8gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSkgOiBlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcilcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBwcm9wczoge1xuICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnaG92ZXInLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWx1ZSA9PiBbJ2NsaWNrJywgJ2hvdmVyJ10uaW5kZXhPZih2YWx1ZSkgPiAtMVxuICAgICAgICB9LFxuICAgICAgICBkZWxheU9uTW91c2VPdXQ6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnQ6IFN0cmluZyxcbiAgICAgICAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxuICAgICAgICBsZWF2ZUFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gICAgICAgIGJvdW5kYXJpZXNTZWxlY3RvcjogU3RyaW5nLFxuICAgICAgICByZWZlcmVuY2U6IHt9LFxuICAgICAgICBmb3JjZVNob3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhcHBlbmRUb0JvZHk6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB2aXNpYmxlQXJyb3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVmZXJlbmNlRWxtOiBudWxsLFxuICAgICAgICAgICAgcG9wcGVySlM6IG51bGwsXG4gICAgICAgICAgICBzaG93UG9wcGVyOiBmYWxzZSxcbiAgICAgICAgICAgIGN1cnJlbnRQbGFjZW1lbnQ6ICcnLFxuICAgICAgICAgICAgcG9wcGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgZ3B1QWNjZWxlcmF0aW9uOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgd2F0Y2g6IHtcbiAgICAgICAgc2hvd1BvcHBlcih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUG9wcGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VTaG93OiB7XG4gICAgICAgICAgICBoYW5kbGVyKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t2YWx1ZSA/ICdkb1Nob3cnIDogJ2RvQ2xvc2UnXSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGltbWVkaWF0ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjcmVhdGVkKCkge1xuICAgICAgICB0aGlzLnBvcHBlck9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHRoaXMucG9wcGVyT3B0aW9ucywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIG1vdW50ZWQoKSB7XG4gICAgICAgIC8vdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLnJlZmVyZW5jZSB8fCB0aGlzLiRzbG90cy5yZWZlcmVuY2VbMF0uZWxtO1xuICAgICAgICAvL3RoaXMucG9wcGVyID0gdGhpcy4kc2xvdHMuZGVmYXVsdFswXS5lbG07XG4gICAgICAgIHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy4kcGFyZW50LiRyZWZzLnJlZmVyZW5jZS4kZWw7XG4gICAgICAgIHRoaXMucG9wcGVyID0gdGhpcy4kZWw7XG4gICAgICAgIHN3aXRjaCAodGhpcy50cmlnZ2VyKSB7XG4gICAgICAgICAgICBjYXNlICdjbGljayc6XG4gICAgICAgICAgICAgICAgb24odGhpcy5yZWZlcmVuY2VFbG0sICdjbGljaycsIHRoaXMuZG9Ub2dnbGUpO1xuICAgICAgICAgICAgICAgIG9uKGRvY3VtZW50LCAnY2xpY2snLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaG92ZXInOlxuICAgICAgICAgICAgICAgIG9uKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlT3Zlcik7XG4gICAgICAgICAgICAgICAgb24odGhpcy5wb3BwZXIsICdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2VPdmVyKTtcbiAgICAgICAgICAgICAgICBvbih0aGlzLnJlZmVyZW5jZUVsbSwgJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlT3V0KTtcbiAgICAgICAgICAgICAgICBvbih0aGlzLnBvcHBlciwgJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlT3V0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZVBvcHBlcigpO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBkb1RvZ2dsZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5mb3JjZVNob3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSAhdGhpcy5zaG93UG9wcGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkb1Nob3coKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBkb0Nsb3NlKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93UG9wcGVyID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGRvRGVzdHJveSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dQb3BwZXIgfHwgIXRoaXMucG9wcGVySlMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBvcHBlckpTLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMucG9wcGVySlMgPSBudWxsO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVQb3BwZXIoKSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUFycm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQXJyb3codGhpcy5wb3BwZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUb0JvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnBvcHBlci5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9wcGVySlMgJiYgdGhpcy5wb3BwZXJKUy5kZXN0cm95KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wcGVySlMuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib3VuZGFyaWVzU2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm91bmRhcmllc0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuYm91bmRhcmllc1NlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcHBlck9wdGlvbnMubW9kaWZpZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wb3BwZXJPcHRpb25zLm1vZGlmaWVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcHBlck9wdGlvbnMubW9kaWZpZXJzLnByZXZlbnRPdmVyZmxvdyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucG9wcGVyT3B0aW9ucy5tb2RpZmllcnMucHJldmVudE92ZXJmbG93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wcGVyT3B0aW9ucy5tb2RpZmllcnMucHJldmVudE92ZXJmbG93LmJvdW5kYXJpZXNFbGVtZW50ID0gYm91bmRhcmllc0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wb3BwZXJPcHRpb25zLm9uQ3JlYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdjcmVhdGVkJywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMudXBkYXRlUG9wcGVyKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMucG9wcGVySlMgPSBuZXcgUG9wcGVyKHRoaXMucmVmZXJlbmNlRWxtLCB0aGlzLnBvcHBlciwgdGhpcy5wb3BwZXJPcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95UG9wcGVyKCkge1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnY2xpY2snLCB0aGlzLmRvVG9nZ2xlKTtcbiAgICAgICAgICAgIG9mZih0aGlzLnJlZmVyZW5jZUVsbSwgJ21vdXNldXAnLCB0aGlzLmRvQ2xvc2UpO1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2Vkb3duJywgdGhpcy5kb1Nob3cpO1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnZm9jdXMnLCB0aGlzLmRvU2hvdyk7XG4gICAgICAgICAgICBvZmYodGhpcy5yZWZlcmVuY2VFbG0sICdibHVyJywgdGhpcy5kb0Nsb3NlKTtcbiAgICAgICAgICAgIG9mZih0aGlzLnJlZmVyZW5jZUVsbSwgJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlT3V0KTtcbiAgICAgICAgICAgIG9mZih0aGlzLnJlZmVyZW5jZUVsbSwgJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZU92ZXIpO1xuICAgICAgICAgICAgb2ZmKGRvY3VtZW50LCAnY2xpY2snLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuICAgICAgICAgICAgdGhpcy5wb3BwZXJKUyA9IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIGFwcGVuZEFycm93KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBlbmRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKCd4LWFycm93JywgJycpO1xuICAgICAgICAgICAgYXJyb3cuY2xhc3NOYW1lID0gJ3BvcHBlcl9fYXJyb3cnO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChhcnJvdyk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVBvcHBlcigpIHtcbiAgICAgICAgICAgIHRoaXMucG9wcGVySlMgPyB0aGlzLnBvcHBlckpTLnNjaGVkdWxlVXBkYXRlKCkgOiB0aGlzLmNyZWF0ZVBvcHBlcigpO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlT3ZlcigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1BvcHBlciA9IHRydWU7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlT3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIHRoaXMuZGVsYXlPbk1vdXNlT3V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlRG9jdW1lbnRDbGljayhlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuJGVsIHx8ICF0aGlzLnJlZmVyZW5jZUVsbSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmNvbnRhaW5zKGUudGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgIHRoaXMucmVmZXJlbmNlRWxtLmNvbnRhaW5zKGUudGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgICF0aGlzLnBvcHBlciB8fCB0aGlzLnBvcHBlci5jb250YWlucyhlLnRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmZvcmNlU2hvd1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaG93UG9wcGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlc3Ryb3llZCgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95UG9wcGVyKCk7XG4gICAgfVxufSJdfQ==
