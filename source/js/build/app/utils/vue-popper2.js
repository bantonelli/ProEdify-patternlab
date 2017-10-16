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
            arrowClass: {
                type: String,
                default: 'popper__arrow'
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
            if (typeof this.$parent.$refs.reference.$el !== 'undefined') {
                this.referenceElm = this.$parent.$refs.reference.$el;
            } else if (typeof this.$parent.$refs.reference !== 'undefined') {
                this.referenceElm = this.$parent.$refs.reference;
            } else {
                this.referenceElm = this.reference;
            }

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
                arrow.className = this.arrowClass;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92dWUtcG9wcGVyMi5qcyJdLCJuYW1lcyI6WyJvbiIsImVsZW1lbnQiLCJldmVudCIsImhhbmRsZXIiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXRhY2hFdmVudCIsInByb3BzIiwidHJpZ2dlciIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwidmFsaWRhdG9yIiwiaW5kZXhPZiIsInZhbHVlIiwiZGVsYXlPbk1vdXNlT3V0IiwiTnVtYmVyIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwiY29udGVudCIsImVudGVyQWN0aXZlQ2xhc3MiLCJsZWF2ZUFjdGl2ZUNsYXNzIiwiYm91bmRhcmllc1NlbGVjdG9yIiwicmVmZXJlbmNlIiwiZm9yY2VTaG93IiwiYXBwZW5kVG9Cb2R5IiwidmlzaWJsZUFycm93IiwiYXJyb3dDbGFzcyIsInRyYW5zaXRpb24iLCJvcHRpb25zIiwiT2JqZWN0IiwiZGF0YSIsInJlZmVyZW5jZUVsbSIsInBvcHBlckpTIiwic2hvd1BvcHBlciIsImN1cnJlbnRQbGFjZW1lbnQiLCJwb3BwZXJPcHRpb25zIiwicGxhY2VtZW50IiwiZ3B1QWNjZWxlcmF0aW9uIiwid2F0Y2giLCIkZW1pdCIsInVwZGF0ZVBvcHBlciIsImltbWVkaWF0ZSIsImNyZWF0ZWQiLCJhc3NpZ24iLCJtb3VudGVkIiwiJHBhcmVudCIsIiRyZWZzIiwiJGVsIiwicG9wcGVyIiwiZG9Ub2dnbGUiLCJoYW5kbGVEb2N1bWVudENsaWNrIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlT3V0IiwiY3JlYXRlUG9wcGVyIiwibWV0aG9kcyIsImRvU2hvdyIsImRvQ2xvc2UiLCJkb0Rlc3Ryb3kiLCJkZXN0cm95IiwiJG5leHRUaWNrIiwiYXBwZW5kQXJyb3ciLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJwYXJlbnRFbGVtZW50IiwiYm91bmRhcmllc0VsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibW9kaWZpZXJzIiwicHJldmVudE92ZXJmbG93Iiwib25DcmVhdGUiLCJkZXN0cm95UG9wcGVyIiwiYXBwZW5kZWQiLCJhcnJvdyIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc05hbWUiLCJzY2hlZHVsZVVwZGF0ZSIsImNsZWFyVGltZW91dCIsIl90aW1lciIsInNldFRpbWVvdXQiLCJlIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJkZXN0cm95ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLGFBQVNBLEVBQVQsQ0FBWUMsT0FBWixFQUFxQkMsS0FBckIsRUFBNEJDLE9BQTVCLEVBQXFDO0FBQ2pDLFlBQUlGLFdBQVdDLEtBQVgsSUFBb0JDLE9BQXhCLEVBQWlDO0FBQzdCQyxxQkFBU0MsZ0JBQVQsR0FBNEJKLFFBQVFJLGdCQUFSLENBQXlCSCxLQUF6QixFQUFnQ0MsT0FBaEMsRUFBeUMsS0FBekMsQ0FBNUIsR0FBOEVGLFFBQVFLLFdBQVIsQ0FBb0IsT0FBT0osS0FBM0IsRUFBa0NDLE9BQWxDLENBQTlFO0FBQ0g7QUFDSjs7QUFFRCxhQUFTSSxHQUFULENBQWFOLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxPQUE3QixFQUFzQztBQUNsQyxZQUFJRixXQUFXQyxLQUFmLEVBQXNCO0FBQ2xCRSxxQkFBU0ksbUJBQVQsR0FBK0JQLFFBQVFPLG1CQUFSLENBQTRCTixLQUE1QixFQUFtQ0MsT0FBbkMsRUFBNEMsS0FBNUMsQ0FBL0IsR0FBb0ZGLFFBQVFRLFdBQVIsQ0FBb0IsT0FBT1AsS0FBM0IsRUFBa0NDLE9BQWxDLENBQXBGO0FBQ0g7QUFDSjs7c0JBRWM7QUFDWE8sZUFBTztBQUNIQyxxQkFBUztBQUNMQyxzQkFBTUMsTUFERDtBQUVMQyx5QkFBUyxPQUZKO0FBR0xDLDJCQUFXO0FBQUEsMkJBQVMsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQkMsT0FBbkIsQ0FBMkJDLEtBQTNCLElBQW9DLENBQUMsQ0FBOUM7QUFBQTtBQUhOLGFBRE47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QUFDLEtBQUtoQyxHQUFOLElBQWEsQ0FBQyxLQUFLaEIsWUFBbkIsSUFDQSxLQUFLZ0IsR0FBTCxDQUFTaUMsUUFBVCxDQUFrQkQsRUFBRUUsTUFBcEIsQ0FEQSxJQUVBLEtBQUtsRCxZQUFMLENBQWtCaUQsUUFBbEIsQ0FBMkJELEVBQUVFLE1BQTdCLENBRkEsSUFHQSxDQUFDLEtBQUtqQyxNQUhOLElBR2dCLEtBQUtBLE1BQUwsQ0FBWWdDLFFBQVosQ0FBcUJELEVBQUVFLE1BQXZCLENBSGhCLElBSUEsS0FBSzFELFNBSlQsRUFLRTtBQUNFO0FBQ0g7QUFDRCxxQkFBS1UsVUFBTCxHQUFrQixLQUFsQjtBQUNIO0FBeEZJLFNBekdFO0FBbU1YaUQsaUJBbk1XLHVCQW1NQztBQUNSLGlCQUFLYixhQUFMO0FBQ0g7QUFyTVUsSyIsImZpbGUiOiJhcHAvdXRpbHMvdnVlLXBvcHBlcjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9wcGVyIGZyb20gJ3BvcHBlci5qcyc7XG5cbmZ1bmN0aW9uIG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgaWYgKGVsZW1lbnQgJiYgZXZlbnQgJiYgaGFuZGxlcikge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSkgOiBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvZmYoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICBpZiAoZWxlbWVudCAmJiBldmVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyID8gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSkgOiBlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcilcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBwcm9wczoge1xuICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnaG92ZXInLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWx1ZSA9PiBbJ2NsaWNrJywgJ2hvdmVyJ10uaW5kZXhPZih2YWx1ZSkgPiAtMVxuICAgICAgICB9LFxuICAgICAgICBkZWxheU9uTW91c2VPdXQ6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnQ6IFN0cmluZyxcbiAgICAgICAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxuICAgICAgICBsZWF2ZUFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gICAgICAgIGJvdW5kYXJpZXNTZWxlY3RvcjogU3RyaW5nLFxuICAgICAgICByZWZlcmVuY2U6IHt9LFxuICAgICAgICBmb3JjZVNob3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhcHBlbmRUb0JvZHk6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB2aXNpYmxlQXJyb3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGFycm93Q2xhc3M6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdwb3BwZXJfX2Fycm93J1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZUVsbTogbnVsbCxcbiAgICAgICAgICAgIHBvcHBlckpTOiBudWxsLFxuICAgICAgICAgICAgc2hvd1BvcHBlcjogZmFsc2UsXG4gICAgICAgICAgICBjdXJyZW50UGxhY2VtZW50OiAnJyxcbiAgICAgICAgICAgIHBvcHBlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIGdwdUFjY2VsZXJhdGlvbjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICAgIHNob3dQb3BwZXIodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBvcHBlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlU2hvdzoge1xuICAgICAgICAgICAgaGFuZGxlcih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXNbdmFsdWUgPyAnZG9TaG93JyA6ICdkb0Nsb3NlJ10oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbW1lZGlhdGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY3JlYXRlZCgpIHtcbiAgICAgICAgdGhpcy5wb3BwZXJPcHRpb25zID0gT2JqZWN0LmFzc2lnbih0aGlzLnBvcHBlck9wdGlvbnMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBtb3VudGVkKCkge1xuICAgICAgICAvL3RoaXMucmVmZXJlbmNlRWxtID0gdGhpcy5yZWZlcmVuY2UgfHwgdGhpcy4kc2xvdHMucmVmZXJlbmNlWzBdLmVsbTtcbiAgICAgICAgLy90aGlzLnBvcHBlciA9IHRoaXMuJHNsb3RzLmRlZmF1bHRbMF0uZWxtO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuJHBhcmVudC4kcmVmcy5yZWZlcmVuY2UuJGVsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRwYXJlbnQuJHJlZnMucmVmZXJlbmNlLiRlbDsgICAgXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuJHBhcmVudC4kcmVmcy5yZWZlcmVuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnJlZmVyZW5jZUVsbSA9IHRoaXMuJHBhcmVudC4kcmVmcy5yZWZlcmVuY2U7ICAgICAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLnJlZmVyZW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9wcGVyID0gdGhpcy4kZWw7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnRyaWdnZXIpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgICAgICAgICBvbih0aGlzLnJlZmVyZW5jZUVsbSwgJ2NsaWNrJywgdGhpcy5kb1RvZ2dsZSk7XG4gICAgICAgICAgICAgICAgb24oZG9jdW1lbnQsICdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdob3Zlcic6XG4gICAgICAgICAgICAgICAgb24odGhpcy5yZWZlcmVuY2VFbG0sICdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2VPdmVyKTtcbiAgICAgICAgICAgICAgICBvbih0aGlzLnBvcHBlciwgJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZU92ZXIpO1xuICAgICAgICAgICAgICAgIG9uKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2VvdXQnLCB0aGlzLm9uTW91c2VPdXQpO1xuICAgICAgICAgICAgICAgIG9uKHRoaXMucG9wcGVyLCAnbW91c2VvdXQnLCB0aGlzLm9uTW91c2VPdXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlUG9wcGVyKCk7XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGRvVG9nZ2xlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZvcmNlU2hvdykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BvcHBlciA9ICF0aGlzLnNob3dQb3BwZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRvU2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1BvcHBlciA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGRvQ2xvc2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZG9EZXN0cm95KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1BvcHBlciB8fCAhdGhpcy5wb3BwZXJKUykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucG9wcGVySlMuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5wb3BwZXJKUyA9IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVBvcHBlcigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlQXJyb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRBcnJvdyh0aGlzLnBvcHBlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvQm9keSkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucG9wcGVyLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3BwZXJKUyAmJiB0aGlzLnBvcHBlckpTLmRlc3Ryb3kpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BwZXJKUy5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdW5kYXJpZXNTZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib3VuZGFyaWVzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5ib3VuZGFyaWVzU2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYm91bmRhcmllc0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBvcHBlck9wdGlvbnMubW9kaWZpZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wcGVyT3B0aW9ucy5tb2RpZmllcnMucHJldmVudE92ZXJmbG93ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wb3BwZXJPcHRpb25zLm1vZGlmaWVycy5wcmV2ZW50T3ZlcmZsb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BwZXJPcHRpb25zLm1vZGlmaWVycy5wcmV2ZW50T3ZlcmZsb3cuYm91bmRhcmllc0VsZW1lbnQgPSBib3VuZGFyaWVzRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBvcHBlck9wdGlvbnMub25DcmVhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2NyZWF0ZWQnLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy51cGRhdGVQb3BwZXIpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5wb3BwZXJKUyA9IG5ldyBQb3BwZXIodGhpcy5yZWZlcmVuY2VFbG0sIHRoaXMucG9wcGVyLCB0aGlzLnBvcHBlck9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc3Ryb3lQb3BwZXIoKSB7XG4gICAgICAgICAgICBvZmYodGhpcy5yZWZlcmVuY2VFbG0sICdjbGljaycsIHRoaXMuZG9Ub2dnbGUpO1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2V1cCcsIHRoaXMuZG9DbG9zZSk7XG4gICAgICAgICAgICBvZmYodGhpcy5yZWZlcmVuY2VFbG0sICdtb3VzZWRvd24nLCB0aGlzLmRvU2hvdyk7XG4gICAgICAgICAgICBvZmYodGhpcy5yZWZlcmVuY2VFbG0sICdmb2N1cycsIHRoaXMuZG9TaG93KTtcbiAgICAgICAgICAgIG9mZih0aGlzLnJlZmVyZW5jZUVsbSwgJ2JsdXInLCB0aGlzLmRvQ2xvc2UpO1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2VvdXQnLCB0aGlzLm9uTW91c2VPdXQpO1xuICAgICAgICAgICAgb2ZmKHRoaXMucmVmZXJlbmNlRWxtLCAnbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlT3Zlcik7XG4gICAgICAgICAgICBvZmYoZG9jdW1lbnQsICdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayk7XG4gICAgICAgICAgICB0aGlzLnBvcHBlckpTID0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgYXBwZW5kQXJyb3coZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXBwZW5kZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcGVuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoJ3gtYXJyb3cnLCAnJyk7XG4gICAgICAgICAgICBhcnJvdy5jbGFzc05hbWUgPSB0aGlzLmFycm93Q2xhc3M7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGFycm93KTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlUG9wcGVyKCkge1xuICAgICAgICAgICAgdGhpcy5wb3BwZXJKUyA/IHRoaXMucG9wcGVySlMuc2NoZWR1bGVVcGRhdGUoKSA6IHRoaXMuY3JlYXRlUG9wcGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VPdmVyKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93UG9wcGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VPdXQoKSB7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BvcHBlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgdGhpcy5kZWxheU9uTW91c2VPdXQpO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVEb2N1bWVudENsaWNrKGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy4kZWwgfHwgIXRoaXMucmVmZXJlbmNlRWxtIHx8XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuY29udGFpbnMoZS50YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5yZWZlcmVuY2VFbG0uY29udGFpbnMoZS50YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgIXRoaXMucG9wcGVyIHx8IHRoaXMucG9wcGVyLmNvbnRhaW5zKGUudGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VTaG93XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVzdHJveWVkKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lQb3BwZXIoKTtcbiAgICB9XG59Il19
