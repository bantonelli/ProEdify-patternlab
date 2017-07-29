define(['exports', 'vue', './popup/index', 'popper.js'], function (exports, _vue, _index, _popper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vue2 = _interopRequireDefault(_vue);

  var _popper2 = _interopRequireDefault(_popper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // import generatePopperOnLoad from './generatePopper';

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


  // const PopperJS = Vue.prototype.$isServer ? function() {} : require('./popper');
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
        default: false
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
        // currentPlacement is data attr 
        // placement is a prop attr 
        this.currentPlacement = this.currentPlacement || this.placement;
        if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
          return;
        }

        // set up options
        var options = this.popperOptions;

        // get the popper html element 
        // popperElm is defined on parent during mounted() hook 
        var popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;

        // get the ref html element 
        // referenceElm is defined on parent during mounted() hook 
        var reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }

        if (!popper || !reference) return;
        if (this.visibleArrow) this.appendArrow(popper);

        // appendToBody is prop attr 
        // it is set to true by default 
        if (this.appendToBody) document.body.appendChild(this.popperElm);
        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroy();
        }

        // update placement on options object 
        options.placement = this.currentPlacement;
        options.offset = this.offset;
        // options.modifiers = { generatePopper: {
        //                         onLoad: generatePopperOnLoad,
        //                         order: 0,
        //                         enabled: true,
        //                       },
        //                     };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92dWUtcG9wcGVyLmpzIl0sIm5hbWVzIjpbInN0b3AiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJvcHMiLCJwbGFjZW1lbnQiLCJ0eXBlIiwiU3RyaW5nIiwiZGVmYXVsdCIsImJvdW5kYXJpZXNQYWRkaW5nIiwiTnVtYmVyIiwicmVmZXJlbmNlIiwicG9wcGVyIiwib2Zmc2V0IiwidmFsdWUiLCJCb29sZWFuIiwidmlzaWJsZUFycm93IiwidHJhbnNpdGlvbiIsImFwcGVuZFRvQm9keSIsInBvcHBlck9wdGlvbnMiLCJPYmplY3QiLCJncHVBY2NlbGVyYXRpb24iLCJkYXRhIiwic2hvd1BvcHBlciIsImN1cnJlbnRQbGFjZW1lbnQiLCJ3YXRjaCIsImltbWVkaWF0ZSIsImhhbmRsZXIiLCJ2YWwiLCIkZW1pdCIsInVwZGF0ZVBvcHBlciIsImRlc3Ryb3lQb3BwZXIiLCJtZXRob2RzIiwiY3JlYXRlUG9wcGVyIiwiJGlzU2VydmVyIiwidGVzdCIsIm9wdGlvbnMiLCJwb3BwZXJFbG0iLCIkcmVmcyIsInJlZmVyZW5jZUVsbSIsIiRzbG90cyIsImVsbSIsImFwcGVuZEFycm93IiwiZG9jdW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJwb3BwZXJKUyIsImRlc3Ryb3kiLCJvbkNyZWF0ZSIsInJlc2V0VHJhbnNmb3JtT3JpZ2luIiwiJG5leHRUaWNrIiwib25VcGRhdGUiLCJfIiwidXBkYXRlIiwiZG9EZXN0cm95IiwicGxhY2VtZW50TWFwIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJvcmlnaW4iLCJzdHlsZSIsInRyYW5zZm9ybU9yaWdpbiIsImluZGV4T2YiLCJlbGVtZW50IiwiaGFzaCIsImFwcGVuZGVkIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJuYW1lIiwiYXJyb3ciLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiYmVmb3JlRGVzdHJveSIsInBhcmVudE5vZGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJkZWFjdGl2YXRlZCIsIiRvcHRpb25zIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7QUFFQSxNQUFNQSxPQUFPLFNBQVBBLElBQU87QUFBQSxXQUFLQyxFQUFFQyxlQUFGLEVBQUw7QUFBQSxHQUFiOztBQUVBOzs7Ozs7Ozs7O0FBTkE7b0JBY2U7QUFDYkMsV0FBTztBQUNMQyxpQkFBVztBQUNUQyxjQUFNQyxNQURHO0FBRVRDLGlCQUFTO0FBRkEsT0FETjtBQUtMQyx5QkFBbUI7QUFDakJILGNBQU1JLE1BRFc7QUFFakJGLGlCQUFTO0FBRlEsT0FMZDtBQVNMRyxpQkFBVyxFQVROO0FBVUxDLGNBQVEsRUFWSDtBQVdMQyxjQUFRO0FBQ05MLGlCQUFTO0FBREgsT0FYSDtBQWNMTSxhQUFPQyxPQWRGO0FBZUxDLG9CQUFjRCxPQWZUO0FBZ0JMRSxrQkFBWVYsTUFoQlA7QUFpQkxXLG9CQUFjO0FBQ1paLGNBQU1TLE9BRE07QUFFWlAsaUJBQVM7QUFGRyxPQWpCVDtBQXFCTFcscUJBQWU7QUFDYmIsY0FBTWMsTUFETztBQUViWixlQUZhLHNCQUVIO0FBQ1IsaUJBQU87QUFDTGEsNkJBQWlCO0FBRFosV0FBUDtBQUdEO0FBTlk7QUFyQlYsS0FETTs7QUFnQ2JDLFFBaENhLGtCQWdDTjtBQUNMLGFBQU87QUFDTEMsb0JBQVksS0FEUDtBQUVMQywwQkFBa0I7QUFGYixPQUFQO0FBSUQsS0FyQ1k7OztBQXVDYkMsV0FBTztBQUNMWCxhQUFPO0FBQ0xZLG1CQUFXLElBRE47QUFFTEMsZUFGSyxtQkFFR0MsR0FGSCxFQUVRO0FBQ1gsZUFBS0wsVUFBTCxHQUFrQkssR0FBbEI7QUFDQSxlQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsR0FBcEI7QUFDRDtBQUxJLE9BREY7O0FBU0xMLGdCQVRLLHNCQVNNSyxHQVROLEVBU1c7QUFDZEEsY0FBTSxLQUFLRSxZQUFMLEVBQU4sR0FBNEIsS0FB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LGVBQWxCO0FBQ0FULGdCQUFRckIsV0FBUixDQUFvQjJCLEtBQXBCO0FBQ0Q7QUExSE0sS0F0REk7O0FBbUxiSSxpQkFuTGEsMkJBbUxHO0FBQ2QsV0FBS3RCLFNBQUw7QUFDQSxVQUFJLEtBQUtqQixTQUFMLElBQWtCLEtBQUtBLFNBQUwsQ0FBZXdDLFVBQWYsS0FBOEJsQyxTQUFTQyxJQUE3RCxFQUFtRTtBQUNqRSxhQUFLUCxTQUFMLENBQWV5QyxtQkFBZixDQUFtQyxPQUFuQyxFQUE0QzdFLElBQTVDO0FBQ0EwQyxpQkFBU0MsSUFBVCxDQUFjbUMsV0FBZCxDQUEwQixLQUFLMUMsU0FBL0I7QUFDRDtBQUNGLEtBekxZO0FBNExiMkMsZUE1TGEseUJBNExDO0FBQ1osV0FBS0MsUUFBTCxDQUFjTCxhQUFkLENBQTRCLENBQTVCLEVBQStCTSxJQUEvQixDQUFvQyxJQUFwQztBQUNEO0FBOUxZLEciLCJmaWxlIjoiYXBwL3V0aWxzL3Z1ZS1wb3BwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG5pbXBvcnQge1xuICBQb3B1cE1hbmFnZXJcbn0gZnJvbSAnLi9wb3B1cC9pbmRleCc7XG5cbi8vIGNvbnN0IFBvcHBlckpTID0gVnVlLnByb3RvdHlwZS4kaXNTZXJ2ZXIgPyBmdW5jdGlvbigpIHt9IDogcmVxdWlyZSgnLi9wb3BwZXInKTtcbmltcG9ydCBQb3BwZXJKUyBmcm9tICdwb3BwZXIuanMnO1xuLy8gaW1wb3J0IGdlbmVyYXRlUG9wcGVyT25Mb2FkIGZyb20gJy4vZ2VuZXJhdGVQb3BwZXInO1xuXG5jb25zdCBzdG9wID0gZSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtyZWZlcmVuY2U9JHJlZnMucmVmZXJlbmNlXSAtIFRoZSByZWZlcmVuY2UgZWxlbWVudCB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbcG9wcGVyPSRyZWZzLnBvcHBlcl0gLSBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyLCBvciBhIGNvbmZpZ3VyYXRpb24gdXNlZCB0byBnZW5lcmF0ZSB0aGUgcG9wcGVyLlxuICogQHBhcmFtIHtTdHJpbmd9IFtwbGFjZW1lbnQ9YnV0dG9uXSAtIFBsYWNlbWVudCBvZiB0aGUgcG9wcGVyIGFjY2VwdGVkIHZhbHVlczogdG9wKC1zdGFydCwgLWVuZCksIHJpZ2h0KC1zdGFydCwgLWVuZCksIGJvdHRvbSgtc3RhcnQsIC1lbmQpLCBsZWZ0KC1zdGFydCwgLWVuZClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb2Zmc2V0PTBdIC0gQW1vdW50IG9mIHBpeGVscyB0aGUgcG9wcGVyIHdpbGwgYmUgc2hpZnRlZCAoY2FuIGJlIG5lZ2F0aXZlKS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3Zpc2libGU9ZmFsc2VdIFZpc2liaWxpdHkgb2YgdGhlIHBvcHVwIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt2aXNpYmxlLWFycm93PWZhbHNlXSBWaXNpYmlsaXR5IG9mIHRoZSBhcnJvdywgbm8gc3R5bGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IHtcbiAgICBwbGFjZW1lbnQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdib3R0b20nXG4gICAgfSxcbiAgICBib3VuZGFyaWVzUGFkZGluZzoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogNVxuICAgIH0sXG4gICAgcmVmZXJlbmNlOiB7fSxcbiAgICBwb3BwZXI6IHt9LFxuICAgIG9mZnNldDoge1xuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG4gICAgdmFsdWU6IEJvb2xlYW4sXG4gICAgdmlzaWJsZUFycm93OiBCb29sZWFuLFxuICAgIHRyYW5zaXRpb246IFN0cmluZyxcbiAgICBhcHBlbmRUb0JvZHk6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgcG9wcGVyT3B0aW9uczoge1xuICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBncHVBY2NlbGVyYXRpb246IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3dQb3BwZXI6IGZhbHNlLFxuICAgICAgY3VycmVudFBsYWNlbWVudDogJydcbiAgICB9O1xuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIodmFsKSB7XG4gICAgICAgIHRoaXMuc2hvd1BvcHBlciA9IHZhbDtcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93UG9wcGVyKHZhbCkge1xuICAgICAgdmFsID8gdGhpcy51cGRhdGVQb3BwZXIoKSA6IHRoaXMuZGVzdHJveVBvcHBlcigpO1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpO1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY3JlYXRlUG9wcGVyKCkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJJTlNJREUgVnVlLXBvcHBlci5jcmVhdGVQb3BwZXIoKVwiKTtcbiAgICAgIGlmICh0aGlzLiRpc1NlcnZlcikgcmV0dXJuO1xuXG4gICAgICAvLyBzZXQgdXAgcGxhY2VtZW50IG9mIHBvcHBlciBcbiAgICAgIC8vIGN1cnJlbnRQbGFjZW1lbnQgaXMgZGF0YSBhdHRyIFxuICAgICAgLy8gcGxhY2VtZW50IGlzIGEgcHJvcCBhdHRyIFxuICAgICAgdGhpcy5jdXJyZW50UGxhY2VtZW50ID0gdGhpcy5jdXJyZW50UGxhY2VtZW50IHx8IHRoaXMucGxhY2VtZW50O1xuICAgICAgaWYgKCEvXih0b3B8Ym90dG9tfGxlZnR8cmlnaHQpKC1zdGFydHwtZW5kKT8kL2cudGVzdCh0aGlzLmN1cnJlbnRQbGFjZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHVwIG9wdGlvbnNcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnBvcHBlck9wdGlvbnM7XG5cbiAgICAgIC8vIGdldCB0aGUgcG9wcGVyIGh0bWwgZWxlbWVudCBcbiAgICAgIC8vIHBvcHBlckVsbSBpcyBkZWZpbmVkIG9uIHBhcmVudCBkdXJpbmcgbW91bnRlZCgpIGhvb2sgXG4gICAgICBjb25zdCBwb3BwZXIgPSB0aGlzLnBvcHBlckVsbSA9IHRoaXMucG9wcGVyRWxtIHx8IHRoaXMucG9wcGVyIHx8IHRoaXMuJHJlZnMucG9wcGVyO1xuXG4gICAgICAvLyBnZXQgdGhlIHJlZiBodG1sIGVsZW1lbnQgXG4gICAgICAvLyByZWZlcmVuY2VFbG0gaXMgZGVmaW5lZCBvbiBwYXJlbnQgZHVyaW5nIG1vdW50ZWQoKSBob29rIFxuICAgICAgbGV0IHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy5yZWZlcmVuY2VFbG0gfHwgdGhpcy5yZWZlcmVuY2UgfHwgdGhpcy4kcmVmcy5yZWZlcmVuY2U7XG5cbiAgICAgIGlmICghcmVmZXJlbmNlICYmXG4gICAgICAgIHRoaXMuJHNsb3RzLnJlZmVyZW5jZSAmJlxuICAgICAgICB0aGlzLiRzbG90cy5yZWZlcmVuY2VbMF0pIHtcbiAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRzbG90cy5yZWZlcmVuY2VbMF0uZWxtO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBvcHBlciB8fCAhcmVmZXJlbmNlKSByZXR1cm47XG4gICAgICBpZiAodGhpcy52aXNpYmxlQXJyb3cpIHRoaXMuYXBwZW5kQXJyb3cocG9wcGVyKTtcblxuICAgICAgLy8gYXBwZW5kVG9Cb2R5IGlzIHByb3AgYXR0ciBcbiAgICAgIC8vIGl0IGlzIHNldCB0byB0cnVlIGJ5IGRlZmF1bHQgXG4gICAgICBpZiAodGhpcy5hcHBlbmRUb0JvZHkpIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wb3BwZXJFbG0pO1xuICAgICAgaWYgKHRoaXMucG9wcGVySlMgJiYgdGhpcy5wb3BwZXJKUy5kZXN0cm95KSB7XG4gICAgICAgIHRoaXMucG9wcGVySlMuZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgcGxhY2VtZW50IG9uIG9wdGlvbnMgb2JqZWN0IFxuICAgICAgb3B0aW9ucy5wbGFjZW1lbnQgPSB0aGlzLmN1cnJlbnRQbGFjZW1lbnQ7XG4gICAgICBvcHRpb25zLm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgICAgLy8gb3B0aW9ucy5tb2RpZmllcnMgPSB7IGdlbmVyYXRlUG9wcGVyOiB7XG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBvbkxvYWQ6IGdlbmVyYXRlUG9wcGVyT25Mb2FkLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IDAsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICBvcHRpb25zLm9uQ3JlYXRlID0gXyA9PiB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NyZWF0ZWQnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLnVwZGF0ZVBvcHBlcik7XG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uVXBkYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9wdGlvbnMub25VcGRhdGUgPSAoXykgPT4ge307XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVGRVJFTkNFOiBcIiwgcmVmZXJlbmNlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiUE9QUEVSOiBcIiwgcG9wcGVyKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiT1BUSU9OUzogXCIsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5wb3BwZXJKUyA9IG5ldyBQb3BwZXJKUyhyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkNSRUFURUQgbmV3IFBvcHBlciBpbnN0YW5jZTogVnVlLXBvcHBlci5jcmVhdGVQb3BwZXIoKVwiKTtcblxuICAgICAgLy8gdGhpcy5wb3BwZXJKUy5fcG9wcGVyLnN0eWxlLnpJbmRleCA9IFBvcHVwTWFuYWdlci5uZXh0WkluZGV4KCk7XG4gICAgICAvLyB0aGlzLnBvcHBlckVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN0b3ApO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJGSU5JU0hFRCBWdWUtcG9wcGVyLmNyZWF0ZVBvcHBlcigpXCIpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVQb3BwZXIoKSB7XG4gICAgICB0aGlzLnBvcHBlckpTID8gdGhpcy5wb3BwZXJKUy51cGRhdGUoKSA6IHRoaXMuY3JlYXRlUG9wcGVyKCk7XG4gICAgfSxcblxuICAgIGRvRGVzdHJveSgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKHRoaXMuc2hvd1BvcHBlciB8fCAhdGhpcy5wb3BwZXJKUykgcmV0dXJuO1xuICAgICAgdGhpcy5wb3BwZXJKUy5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBvcHBlckpTID0gbnVsbDtcbiAgICB9LFxuXG4gICAgZGVzdHJveVBvcHBlcigpIHtcbiAgICAgIGlmICh0aGlzLnBvcHBlckpTKSB7XG4gICAgICAgIHRoaXMucmVzZXRUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRUcmFuc2Zvcm1PcmlnaW4oKSB7XG4gICAgICBsZXQgcGxhY2VtZW50TWFwID0ge1xuICAgICAgICB0b3A6ICdib3R0b20nLFxuICAgICAgICBib3R0b206ICd0b3AnLFxuICAgICAgICBsZWZ0OiAncmlnaHQnLFxuICAgICAgICByaWdodDogJ2xlZnQnXG4gICAgICB9O1xuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5wb3BwZXJKUyk7XG4gICAgICBsZXQgcGxhY2VtZW50ID0gdGhpcy5wb3BwZXJKUy5wb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpLnNwbGl0KCctJylbMF07XG4gICAgICBsZXQgb3JpZ2luID0gcGxhY2VtZW50TWFwW3BsYWNlbWVudF07XG4gICAgICB0aGlzLnBvcHBlckpTLnBvcHBlci5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgPiAtMSA/IGBjZW50ZXIgJHsgb3JpZ2luIH1gIDogYCR7IG9yaWdpbiB9IGNlbnRlcmA7XG4gICAgfSxcblxuICAgIGFwcGVuZEFycm93KGVsZW1lbnQpIHtcbiAgICAgIGxldCBoYXNoO1xuICAgICAgaWYgKHRoaXMuYXBwZW5kZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFwcGVuZGVkID0gdHJ1ZTtcblxuICAgICAgZm9yIChsZXQgaXRlbSBpbiBlbGVtZW50LmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKC9eX3YtLy50ZXN0KGVsZW1lbnQuYXR0cmlidXRlc1tpdGVtXS5uYW1lKSkge1xuICAgICAgICAgIGhhc2ggPSBlbGVtZW50LmF0dHJpYnV0ZXNbaXRlbV0ubmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICBpZiAoaGFzaCkge1xuICAgICAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoaGFzaCwgJycpO1xuICAgICAgfVxuICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKCd4LWFycm93JywgJycpO1xuICAgICAgYXJyb3cuY2xhc3NOYW1lID0gJ3BvcHBlcl9fYXJyb3cnO1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChhcnJvdyk7XG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgdGhpcy5kb0Rlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5wb3BwZXJFbG0gJiYgdGhpcy5wb3BwZXJFbG0ucGFyZW50Tm9kZSA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdGhpcy5wb3BwZXJFbG0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdG9wKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5wb3BwZXJFbG0pO1xuICAgIH1cbiAgfSxcblxuICAvLyBjYWxsIGRlc3Ryb3kgaW4ga2VlcC1hbGl2ZSBtb2RlXG4gIGRlYWN0aXZhdGVkKCkge1xuICAgIHRoaXMuJG9wdGlvbnMuYmVmb3JlRGVzdHJveVswXS5jYWxsKHRoaXMpO1xuICB9XG59O1xuIl19
