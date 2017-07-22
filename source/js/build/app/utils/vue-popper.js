define(['exports', 'vue', './popup', 'popper.js', './generatePopper'], function (exports, _vue, _popup, _popper, _generatePopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vue2 = _interopRequireDefault(_vue);

  var _popper2 = _interopRequireDefault(_popper);

  var _generatePopper2 = _interopRequireDefault(_generatePopper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // const PopperJS = Vue.prototype.$isServer ? function() {} : require('./popper');
  console.log(_popper2.default);

  var stop = function stop(e) {
    return e.stopPropagation();
  };

  /**
   * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
   * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
   * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
   * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
   * @param {Boolean} [visible=false] Visibility of the popup element.
   * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
   */
  exports.default = {
    props: {
      placement: {
        type: String,
        default: 'bottom'
      },
      boundariesPadding: {
        type: Number,
        default: 5
      },
      reference: {},
      popper: {},
      offset: {
        default: 0
      },
      value: Boolean,
      visibleArrow: Boolean,
      transition: String,
      appendToBody: {
        type: Boolean,
        default: true
      },
      popperOptions: {
        type: Object,
        default: function _default() {
          return {
            gpuAcceleration: false
          };
        }
      }
    },

    data: function data() {
      return {
        showPopper: false,
        currentPlacement: ''
      };
    },


    watch: {
      value: {
        immediate: true,
        handler: function handler(val) {
          this.showPopper = val;
          this.$emit('input', val);
        }
      },

      showPopper: function showPopper(val) {
        val ? this.updatePopper() : this.destroyPopper();
        this.$emit('input', val);
      }
    },

    methods: {
      createPopper: function createPopper() {
        var _this = this;

        // console.log("INSIDE Vue-popper.createPopper()");
        if (this.$isServer) return;

        // set up placement of popper 
        this.currentPlacement = this.currentPlacement || this.placement;
        if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
          return;
        }

        // set up options
        var options = this.popperOptions;

        // get the popper html element 
        var popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;

        // get the ref html element 
        var reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }

        if (!popper || !reference) return;
        if (this.visibleArrow) this.appendArrow(popper);
        if (this.appendToBody) document.body.appendChild(this.popperElm);
        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroy();
        }

        // update placement on options object 
        options.placement = this.currentPlacement;
        options.offset = this.offset;
        options.modifiers = { generatePopper: {
            onLoad: _generatePopper2.default,
            order: 0,
            enabled: true
          }
        };
        options.onCreate = function (_) {
          _this.$emit('created', _this);
          _this.resetTransformOrigin();
          _this.$nextTick(_this.updatePopper);
        };
        if (typeof options.onUpdate !== 'function') {
          options.onUpdate = function (_) {};
        }

        // console.log("REFERENCE: ", reference);
        // console.log("POPPER: ", popper);
        // console.log("OPTIONS: ", options);
        this.popperJS = new _popper2.default(reference, popper, options);
        // console.log("CREATED new Popper instance: Vue-popper.createPopper()");

        // this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        // this.popperElm.addEventListener('click', stop);
        // console.log("FINISHED Vue-popper.createPopper()");
      },
      updatePopper: function updatePopper() {
        this.popperJS ? this.popperJS.update() : this.createPopper();
      },
      doDestroy: function doDestroy() {
        /* istanbul ignore if */
        if (this.showPopper || !this.popperJS) return;
        this.popperJS.destroy();
        this.popperJS = null;
      },
      destroyPopper: function destroyPopper() {
        if (this.popperJS) {
          this.resetTransformOrigin();
        }
      },
      resetTransformOrigin: function resetTransformOrigin() {
        var placementMap = {
          top: 'bottom',
          bottom: 'top',
          left: 'right',
          right: 'left'
        };
        // console.log(this.popperJS);
        var placement = this.popperJS.popper.getAttribute('x-placement').split('-')[0];
        var origin = placementMap[placement];
        this.popperJS.popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
      },
      appendArrow: function appendArrow(element) {
        var hash = void 0;
        if (this.appended) {
          return;
        }

        this.appended = true;

        for (var item in element.attributes) {
          if (/^_v-/.test(element.attributes[item].name)) {
            hash = element.attributes[item].name;
            break;
          }
        }

        var arrow = document.createElement('div');

        if (hash) {
          arrow.setAttribute(hash, '');
        }
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
      }
    },

    beforeDestroy: function beforeDestroy() {
      this.doDestroy();
      if (this.popperElm && this.popperElm.parentNode === document.body) {
        this.popperElm.removeEventListener('click', stop);
        document.body.removeChild(this.popperElm);
      }
    },
    deactivated: function deactivated() {
      this.$options.beforeDestroy[0].call(this);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92dWUtcG9wcGVyLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJzdG9wIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByb3BzIiwicGxhY2VtZW50IiwidHlwZSIsIlN0cmluZyIsImRlZmF1bHQiLCJib3VuZGFyaWVzUGFkZGluZyIsIk51bWJlciIsInJlZmVyZW5jZSIsInBvcHBlciIsIm9mZnNldCIsInZhbHVlIiwiQm9vbGVhbiIsInZpc2libGVBcnJvdyIsInRyYW5zaXRpb24iLCJhcHBlbmRUb0JvZHkiLCJwb3BwZXJPcHRpb25zIiwiT2JqZWN0IiwiZ3B1QWNjZWxlcmF0aW9uIiwiZGF0YSIsInNob3dQb3BwZXIiLCJjdXJyZW50UGxhY2VtZW50Iiwid2F0Y2giLCJpbW1lZGlhdGUiLCJoYW5kbGVyIiwidmFsIiwiJGVtaXQiLCJ1cGRhdGVQb3BwZXIiLCJkZXN0cm95UG9wcGVyIiwibWV0aG9kcyIsImNyZWF0ZVBvcHBlciIsIiRpc1NlcnZlciIsInRlc3QiLCJvcHRpb25zIiwicG9wcGVyRWxtIiwiJHJlZnMiLCJyZWZlcmVuY2VFbG0iLCIkc2xvdHMiLCJlbG0iLCJhcHBlbmRBcnJvdyIsImRvY3VtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwicG9wcGVySlMiLCJkZXN0cm95IiwibW9kaWZpZXJzIiwiZ2VuZXJhdGVQb3BwZXIiLCJvbkxvYWQiLCJvcmRlciIsImVuYWJsZWQiLCJvbkNyZWF0ZSIsInJlc2V0VHJhbnNmb3JtT3JpZ2luIiwiJG5leHRUaWNrIiwib25VcGRhdGUiLCJfIiwidXBkYXRlIiwiZG9EZXN0cm95IiwicGxhY2VtZW50TWFwIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJvcmlnaW4iLCJzdHlsZSIsInRyYW5zZm9ybU9yaWdpbiIsImluZGV4T2YiLCJlbGVtZW50IiwiaGFzaCIsImFwcGVuZGVkIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJuYW1lIiwiYXJyb3ciLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiYmVmb3JlRGVzdHJveSIsInBhcmVudE5vZGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJkZWFjdGl2YXRlZCIsIiRvcHRpb25zIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBSUFBLFVBQVFDLEdBQVI7O0FBRUEsTUFBTUMsT0FBTyxTQUFQQSxJQUFPO0FBQUEsV0FBS0MsRUFBRUMsZUFBRixFQUFMO0FBQUEsR0FBYjs7QUFFQTs7Ozs7Ozs7b0JBUWU7QUFDYkMsV0FBTztBQUNMQyxpQkFBVztBQUNUQyxjQUFNQyxNQURHO0FBRVRDLGlCQUFTO0FBRkEsT0FETjtBQUtMQyx5QkFBbUI7QUFDakJILGNBQU1JLE1BRFc7QUFFakJGLGlCQUFTO0FBRlEsT0FMZDtBQVNMRyxpQkFBVyxFQVROO0FBVUxDLGNBQVEsRUFWSDtBQVdMQyxjQUFRO0FBQ05MLGlCQUFTO0FBREgsT0FYSDtBQWNMTSxhQUFPQyxPQWRGO0FBZUxDLG9CQUFjRCxPQWZUO0FBZ0JMRSxrQkFBWVYsTUFoQlA7QUFpQkxXLG9CQUFjO0FBQ1paLGNBQU1TLE9BRE07QUFFWlAsaUJBQVM7QUFGRyxPQWpCVDtBQXFCTFcscUJBQWU7QUFDYmIsY0FBTWMsTUFETztBQUViWixlQUZhLHNCQUVIO0FBQ1IsaUJBQU87QUFDTGEsNkJBQWlCO0FBRFosV0FBUDtBQUdEO0FBTlk7QUFyQlYsS0FETTs7QUFnQ2JDLFFBaENhLGtCQWdDTjtBQUNMLGFBQU87QUFDTEMsb0JBQVksS0FEUDtBQUVMQywwQkFBa0I7QUFGYixPQUFQO0FBSUQsS0FyQ1k7OztBQXVDYkMsV0FBTztBQUNMWCxhQUFPO0FBQ0xZLG1CQUFXLElBRE47QUFFTEMsZUFGSyxtQkFFR0MsR0FGSCxFQUVRO0FBQ1gsZUFBS0wsVUFBTCxHQUFrQkssR0FBbEI7QUFDQSxlQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsR0FB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TixJQUFKLEVBQVU7QUFDUkssZ0JBQU1FLFlBQU4sQ0FBbUJQLElBQW5CLEVBQXlCLEVBQXpCO0FBQ0Q7QUFDREssY0FBTUUsWUFBTixDQUFtQixTQUFuQixFQUE4QixFQUE5QjtBQUNBRixjQUFNRyxTQUFOLEdBQWtCLGVBQWxCO0FBQ0FULGdCQUFRMUIsV0FBUixDQUFvQmdDLEtBQXBCO0FBQ0Q7QUFuSE0sS0F0REk7O0FBNEtiSSxpQkE1S2EsMkJBNEtHO0FBQ2QsV0FBS3RCLFNBQUw7QUFDQSxVQUFJLEtBQUt0QixTQUFMLElBQWtCLEtBQUtBLFNBQUwsQ0FBZTZDLFVBQWYsS0FBOEJ2QyxTQUFTQyxJQUE3RCxFQUFtRTtBQUNqRSxhQUFLUCxTQUFMLENBQWU4QyxtQkFBZixDQUFtQyxPQUFuQyxFQUE0Q2xGLElBQTVDO0FBQ0EwQyxpQkFBU0MsSUFBVCxDQUFjd0MsV0FBZCxDQUEwQixLQUFLL0MsU0FBL0I7QUFDRDtBQUNGLEtBbExZO0FBcUxiZ0QsZUFyTGEseUJBcUxDO0FBQ1osV0FBS0MsUUFBTCxDQUFjTCxhQUFkLENBQTRCLENBQTVCLEVBQStCTSxJQUEvQixDQUFvQyxJQUFwQztBQUNEO0FBdkxZLEciLCJmaWxlIjoiYXBwL3V0aWxzL3Z1ZS1wb3BwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG5pbXBvcnQge1xuICBQb3B1cE1hbmFnZXJcbn0gZnJvbSAnLi9wb3B1cCc7XG5cbi8vIGNvbnN0IFBvcHBlckpTID0gVnVlLnByb3RvdHlwZS4kaXNTZXJ2ZXIgPyBmdW5jdGlvbigpIHt9IDogcmVxdWlyZSgnLi9wb3BwZXInKTtcbmltcG9ydCBQb3BwZXJKUyBmcm9tICdwb3BwZXIuanMnO1xuaW1wb3J0IGdlbmVyYXRlUG9wcGVyT25Mb2FkIGZyb20gJy4vZ2VuZXJhdGVQb3BwZXInO1xuXG5jb25zb2xlLmxvZyhQb3BwZXJKUyk7XG5cbmNvbnN0IHN0b3AgPSBlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3JlZmVyZW5jZT0kcmVmcy5yZWZlcmVuY2VdIC0gVGhlIHJlZmVyZW5jZSBlbGVtZW50IHVzZWQgdG8gcG9zaXRpb24gdGhlIHBvcHBlci5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwb3BwZXI9JHJlZnMucG9wcGVyXSAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXIsIG9yIGEgY29uZmlndXJhdGlvbiB1c2VkIHRvIGdlbmVyYXRlIHRoZSBwb3BwZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gW3BsYWNlbWVudD1idXR0b25dIC0gUGxhY2VtZW50IG9mIHRoZSBwb3BwZXIgYWNjZXB0ZWQgdmFsdWVzOiB0b3AoLXN0YXJ0LCAtZW5kKSwgcmlnaHQoLXN0YXJ0LCAtZW5kKSwgYm90dG9tKC1zdGFydCwgLWVuZCksIGxlZnQoLXN0YXJ0LCAtZW5kKVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvZmZzZXQ9MF0gLSBBbW91bnQgb2YgcGl4ZWxzIHRoZSBwb3BwZXIgd2lsbCBiZSBzaGlmdGVkIChjYW4gYmUgbmVnYXRpdmUpLlxuICogQHBhcmFtIHtCb29sZWFufSBbdmlzaWJsZT1mYWxzZV0gVmlzaWJpbGl0eSBvZiB0aGUgcG9wdXAgZWxlbWVudC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3Zpc2libGUtYXJyb3c9ZmFsc2VdIFZpc2liaWxpdHkgb2YgdGhlIGFycm93LCBubyBzdHlsZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wczoge1xuICAgIHBsYWNlbWVudDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2JvdHRvbSdcbiAgICB9LFxuICAgIGJvdW5kYXJpZXNQYWRkaW5nOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiA1XG4gICAgfSxcbiAgICByZWZlcmVuY2U6IHt9LFxuICAgIHBvcHBlcjoge30sXG4gICAgb2Zmc2V0OiB7XG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcbiAgICB2YWx1ZTogQm9vbGVhbixcbiAgICB2aXNpYmxlQXJyb3c6IEJvb2xlYW4sXG4gICAgdHJhbnNpdGlvbjogU3RyaW5nLFxuICAgIGFwcGVuZFRvQm9keToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIHBvcHBlck9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ3B1QWNjZWxlcmF0aW9uOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzaG93UG9wcGVyOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRQbGFjZW1lbnQ6ICcnXG4gICAgfTtcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHZhbHVlOiB7XG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICBoYW5kbGVyKHZhbCkge1xuICAgICAgICB0aGlzLnNob3dQb3BwZXIgPSB2YWw7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd1BvcHBlcih2YWwpIHtcbiAgICAgIHZhbCA/IHRoaXMudXBkYXRlUG9wcGVyKCkgOiB0aGlzLmRlc3Ryb3lQb3BwZXIoKTtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsKTtcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNyZWF0ZVBvcHBlcigpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiSU5TSURFIFZ1ZS1wb3BwZXIuY3JlYXRlUG9wcGVyKClcIik7XG4gICAgICBpZiAodGhpcy4kaXNTZXJ2ZXIpIHJldHVybjtcblxuICAgICAgLy8gc2V0IHVwIHBsYWNlbWVudCBvZiBwb3BwZXIgXG4gICAgICB0aGlzLmN1cnJlbnRQbGFjZW1lbnQgPSB0aGlzLmN1cnJlbnRQbGFjZW1lbnQgfHwgdGhpcy5wbGFjZW1lbnQ7XG4gICAgICBpZiAoIS9eKHRvcHxib3R0b218bGVmdHxyaWdodCkoLXN0YXJ0fC1lbmQpPyQvZy50ZXN0KHRoaXMuY3VycmVudFBsYWNlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdXAgb3B0aW9uc1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucG9wcGVyT3B0aW9ucztcblxuICAgICAgLy8gZ2V0IHRoZSBwb3BwZXIgaHRtbCBlbGVtZW50IFxuICAgICAgY29uc3QgcG9wcGVyID0gdGhpcy5wb3BwZXJFbG0gPSB0aGlzLnBvcHBlckVsbSB8fCB0aGlzLnBvcHBlciB8fCB0aGlzLiRyZWZzLnBvcHBlcjtcblxuICAgICAgLy8gZ2V0IHRoZSByZWYgaHRtbCBlbGVtZW50IFxuICAgICAgbGV0IHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy5yZWZlcmVuY2VFbG0gfHwgdGhpcy5yZWZlcmVuY2UgfHwgdGhpcy4kcmVmcy5yZWZlcmVuY2U7XG5cbiAgICAgIGlmICghcmVmZXJlbmNlICYmXG4gICAgICAgIHRoaXMuJHNsb3RzLnJlZmVyZW5jZSAmJlxuICAgICAgICB0aGlzLiRzbG90cy5yZWZlcmVuY2VbMF0pIHtcbiAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRzbG90cy5yZWZlcmVuY2VbMF0uZWxtO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBvcHBlciB8fCAhcmVmZXJlbmNlKSByZXR1cm47XG4gICAgICBpZiAodGhpcy52aXNpYmxlQXJyb3cpIHRoaXMuYXBwZW5kQXJyb3cocG9wcGVyKTtcbiAgICAgIGlmICh0aGlzLmFwcGVuZFRvQm9keSkgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnBvcHBlckVsbSk7XG4gICAgICBpZiAodGhpcy5wb3BwZXJKUyAmJiB0aGlzLnBvcHBlckpTLmRlc3Ryb3kpIHtcbiAgICAgICAgdGhpcy5wb3BwZXJKUy5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBwbGFjZW1lbnQgb24gb3B0aW9ucyBvYmplY3QgXG4gICAgICBvcHRpb25zLnBsYWNlbWVudCA9IHRoaXMuY3VycmVudFBsYWNlbWVudDtcbiAgICAgIG9wdGlvbnMub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgICBvcHRpb25zLm1vZGlmaWVycyA9IHsgZ2VuZXJhdGVQb3BwZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTG9hZDogZ2VuZXJhdGVQb3BwZXJPbkxvYWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgIG9wdGlvbnMub25DcmVhdGUgPSBfID0+IHtcbiAgICAgICAgdGhpcy4kZW1pdCgnY3JlYXRlZCcsIHRoaXMpO1xuICAgICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMudXBkYXRlUG9wcGVyKTtcbiAgICAgIH07XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25VcGRhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0aW9ucy5vblVwZGF0ZSA9IChfKSA9PiB7fTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc29sZS5sb2coXCJSRUZFUkVOQ0U6IFwiLCByZWZlcmVuY2UpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJQT1BQRVI6IFwiLCBwb3BwZXIpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJPUFRJT05TOiBcIiwgb3B0aW9ucyk7XG4gICAgICB0aGlzLnBvcHBlckpTID0gbmV3IFBvcHBlckpTKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ1JFQVRFRCBuZXcgUG9wcGVyIGluc3RhbmNlOiBWdWUtcG9wcGVyLmNyZWF0ZVBvcHBlcigpXCIpO1xuXG4gICAgICAvLyB0aGlzLnBvcHBlckpTLl9wb3BwZXIuc3R5bGUuekluZGV4ID0gUG9wdXBNYW5hZ2VyLm5leHRaSW5kZXgoKTtcbiAgICAgIC8vIHRoaXMucG9wcGVyRWxtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RvcCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkZJTklTSEVEIFZ1ZS1wb3BwZXIuY3JlYXRlUG9wcGVyKClcIik7XG4gICAgfSxcblxuICAgIHVwZGF0ZVBvcHBlcigpIHtcbiAgICAgIHRoaXMucG9wcGVySlMgPyB0aGlzLnBvcHBlckpTLnVwZGF0ZSgpIDogdGhpcy5jcmVhdGVQb3BwZXIoKTtcbiAgICB9LFxuXG4gICAgZG9EZXN0cm95KCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAodGhpcy5zaG93UG9wcGVyIHx8ICF0aGlzLnBvcHBlckpTKSByZXR1cm47XG4gICAgICB0aGlzLnBvcHBlckpTLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucG9wcGVySlMgPSBudWxsO1xuICAgIH0sXG5cbiAgICBkZXN0cm95UG9wcGVyKCkge1xuICAgICAgaWYgKHRoaXMucG9wcGVySlMpIHtcbiAgICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldFRyYW5zZm9ybU9yaWdpbigpIHtcbiAgICAgIGxldCBwbGFjZW1lbnRNYXAgPSB7XG4gICAgICAgIHRvcDogJ2JvdHRvbScsXG4gICAgICAgIGJvdHRvbTogJ3RvcCcsXG4gICAgICAgIGxlZnQ6ICdyaWdodCcsXG4gICAgICAgIHJpZ2h0OiAnbGVmdCdcbiAgICAgIH07XG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnBvcHBlckpTKTtcbiAgICAgIGxldCBwbGFjZW1lbnQgPSB0aGlzLnBvcHBlckpTLnBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50Jykuc3BsaXQoJy0nKVswXTtcbiAgICAgIGxldCBvcmlnaW4gPSBwbGFjZW1lbnRNYXBbcGxhY2VtZW50XTtcbiAgICAgIHRoaXMucG9wcGVySlMucG9wcGVyLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSA+IC0xID8gYGNlbnRlciAkeyBvcmlnaW4gfWAgOiBgJHsgb3JpZ2luIH0gY2VudGVyYDtcbiAgICB9LFxuXG4gICAgYXBwZW5kQXJyb3coZWxlbWVudCkge1xuICAgICAgbGV0IGhhc2g7XG4gICAgICBpZiAodGhpcy5hcHBlbmRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXBwZW5kZWQgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBpdGVtIGluIGVsZW1lbnQuYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoL15fdi0vLnRlc3QoZWxlbWVudC5hdHRyaWJ1dGVzW2l0ZW1dLm5hbWUpKSB7XG4gICAgICAgICAgaGFzaCA9IGVsZW1lbnQuYXR0cmlidXRlc1tpdGVtXS5uYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgIGlmIChoYXNoKSB7XG4gICAgICAgIGFycm93LnNldEF0dHJpYnV0ZShoYXNoLCAnJyk7XG4gICAgICB9XG4gICAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoJ3gtYXJyb3cnLCAnJyk7XG4gICAgICBhcnJvdy5jbGFzc05hbWUgPSAncG9wcGVyX19hcnJvdyc7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGFycm93KTtcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICB0aGlzLmRvRGVzdHJveSgpO1xuICAgIGlmICh0aGlzLnBvcHBlckVsbSAmJiB0aGlzLnBvcHBlckVsbS5wYXJlbnROb2RlID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB0aGlzLnBvcHBlckVsbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHN0b3ApO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnBvcHBlckVsbSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIGNhbGwgZGVzdHJveSBpbiBrZWVwLWFsaXZlIG1vZGVcbiAgZGVhY3RpdmF0ZWQoKSB7XG4gICAgdGhpcy4kb3B0aW9ucy5iZWZvcmVEZXN0cm95WzBdLmNhbGwodGhpcyk7XG4gIH1cbn07XG4iXX0=
