define(['exports', 'vue', '../merge', './popup-manager', '../scrollbar-width'], function (exports, _vue, _merge, _popupManager, _scrollbarWidth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PopupManager = undefined;

  var _vue2 = _interopRequireDefault(_vue);

  var _merge2 = _interopRequireDefault(_merge);

  var _popupManager2 = _interopRequireDefault(_popupManager);

  var _scrollbarWidth2 = _interopRequireDefault(_scrollbarWidth);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var idSeed = 1;
  var transitions = [];

  var hookTransition = function hookTransition(transition) {
    if (transitions.indexOf(transition) !== -1) return;

    var getVueInstance = function getVueInstance(element) {
      var instance = element.__vue__;
      if (!instance) {
        var textNode = element.previousSibling;
        if (textNode.__vue__) {
          instance = textNode.__vue__;
        }
      }
      return instance;
    };

    _vue2.default.transition(transition, {
      afterEnter: function afterEnter(el) {
        var instance = getVueInstance(el);

        if (instance) {
          instance.doAfterOpen && instance.doAfterOpen();
        }
      },
      afterLeave: function afterLeave(el) {
        var instance = getVueInstance(el);

        if (instance) {
          instance.doAfterClose && instance.doAfterClose();
        }
      }
    });
  };

  var scrollBarWidth = void 0;

  var getDOM = function getDOM(dom) {
    if (dom.nodeType === 3) {
      dom = dom.nextElementSibling || dom.nextSibling;
      getDOM(dom);
    }
    return dom;
  };

  exports.default = {
    model: {
      prop: 'visible',
      event: 'visible-change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      transition: {
        type: String,
        default: ''
      },
      openDelay: {},
      closeDelay: {},
      zIndex: {},
      modal: {
        type: Boolean,
        default: false
      },
      modalFade: {
        type: Boolean,
        default: true
      },
      modalClass: {},
      modalAppendToBody: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      }
    },

    created: function created() {
      if (this.transition) {
        hookTransition(this.transition);
      }
    },
    beforeMount: function beforeMount() {
      this._popupId = 'popup-' + idSeed++;
      _popupManager2.default.register(this._popupId, this);
    },
    beforeDestroy: function beforeDestroy() {
      _popupManager2.default.deregister(this._popupId);
      _popupManager2.default.closeModal(this._popupId);
      if (this.modal && this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
        document.body.style.overflow = this.bodyOverflow;
        document.body.style.paddingRight = this.bodyPaddingRight;
      }
      this.bodyOverflow = null;
      this.bodyPaddingRight = null;
    },
    data: function data() {
      return {
        opened: false,
        bodyOverflow: null,
        bodyPaddingRight: null,
        rendered: false
      };
    },


    watch: {
      visible: function visible(val) {
        var _this = this;

        if (val) {
          if (this._opening) return;
          if (!this.rendered) {
            this.rendered = true;
            _vue2.default.nextTick(function () {
              _this.open();
            });
          } else {
            this.open();
          }
        } else {
          this.close();
        }
      }
    },

    methods: {
      open: function open(options) {
        var _this2 = this;

        if (!this.rendered) {
          this.rendered = true;
          this.$emit('visible-change', true);
        }

        var props = (0, _merge2.default)({}, this.$props || this, options);

        if (this._closeTimer) {
          clearTimeout(this._closeTimer);
          this._closeTimer = null;
        }
        clearTimeout(this._openTimer);

        var openDelay = Number(props.openDelay);
        if (openDelay > 0) {
          this._openTimer = setTimeout(function () {
            _this2._openTimer = null;
            _this2.doOpen(props);
          }, openDelay);
        } else {
          this.doOpen(props);
        }
      },
      doOpen: function doOpen(props) {
        if (this.$isServer) return;
        if (this.willOpen && !this.willOpen()) return;
        if (this.opened) return;

        this._opening = true;

        this.$emit('visible-change', true);

        var dom = getDOM(this.$el);

        var modal = props.modal;

        var zIndex = props.zIndex;
        if (zIndex) {
          _popupManager2.default.zIndex = zIndex;
        }

        if (modal) {
          if (this._closing) {
            _popupManager2.default.closeModal(this._popupId);
            this._closing = false;
          }
          _popupManager2.default.openModal(this._popupId, _popupManager2.default.nextZIndex(), this.modalAppendToBody ? undefined : dom, props.modalClass, props.modalFade);
          if (props.lockScroll) {
            if (!this.bodyOverflow) {
              this.bodyPaddingRight = document.body.style.paddingRight;
              this.bodyOverflow = document.body.style.overflow;
            }
            scrollBarWidth = (0, _scrollbarWidth2.default)();
            var bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
            if (scrollBarWidth > 0 && bodyHasOverflow) {
              document.body.style.paddingRight = scrollBarWidth + 'px';
            }
            document.body.style.overflow = 'hidden';
          }
        }

        if (getComputedStyle(dom).position === 'static') {
          dom.style.position = 'absolute';
        }

        dom.style.zIndex = _popupManager2.default.nextZIndex();
        this.opened = true;

        this.onOpen && this.onOpen();

        if (!this.transition) {
          this.doAfterOpen();
        }
      },
      doAfterOpen: function doAfterOpen() {
        this._opening = false;
      },
      close: function close() {
        var _this3 = this;

        if (this.willClose && !this.willClose()) return;

        if (this._openTimer !== null) {
          clearTimeout(this._openTimer);
          this._openTimer = null;
        }
        clearTimeout(this._closeTimer);

        var closeDelay = Number(this.closeDelay);

        if (closeDelay > 0) {
          this._closeTimer = setTimeout(function () {
            _this3._closeTimer = null;
            _this3.doClose();
          }, closeDelay);
        } else {
          this.doClose();
        }
      },
      doClose: function doClose() {
        var _this4 = this;

        this.$emit('visible-change', false);
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(function () {
            if (_this4.modal && _this4.bodyOverflow !== 'hidden') {
              document.body.style.overflow = _this4.bodyOverflow;
              document.body.style.paddingRight = _this4.bodyPaddingRight;
            }
            _this4.bodyOverflow = null;
            _this4.bodyPaddingRight = null;
          }, 200);
        }

        this.opened = false;

        if (!this.transition) {
          this.doAfterClose();
        }
      },
      doAfterClose: function doAfterClose() {
        _popupManager2.default.closeModal(this._popupId);
        this._closing = false;
      }
    }
  };
  exports.PopupManager = _popupManager2.default;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9wb3B1cC9pbmRleC5qcyJdLCJuYW1lcyI6WyJpZFNlZWQiLCJ0cmFuc2l0aW9ucyIsImhvb2tUcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImluZGV4T2YiLCJnZXRWdWVJbnN0YW5jZSIsImVsZW1lbnQiLCJpbnN0YW5jZSIsIl9fdnVlX18iLCJ0ZXh0Tm9kZSIsInByZXZpb3VzU2libGluZyIsImFmdGVyRW50ZXIiLCJlbCIsImRvQWZ0ZXJPcGVuIiwiYWZ0ZXJMZWF2ZSIsImRvQWZ0ZXJDbG9zZSIsInNjcm9sbEJhcldpZHRoIiwiZ2V0RE9NIiwiZG9tIiwibm9kZVR5cGUiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0U2libGluZyIsIm1vZGVsIiwicHJvcCIsImV2ZW50IiwicHJvcHMiLCJ2aXNpYmxlIiwidHlwZSIsIkJvb2xlYW4iLCJkZWZhdWx0IiwiU3RyaW5nIiwib3BlbkRlbGF5IiwiY2xvc2VEZWxheSIsInpJbmRleCIsIm1vZGFsIiwibW9kYWxGYWRlIiwibW9kYWxDbGFzcyIsIm1vZGFsQXBwZW5kVG9Cb2R5IiwibG9ja1Njcm9sbCIsImNsb3NlT25QcmVzc0VzY2FwZSIsImNsb3NlT25DbGlja01vZGFsIiwiY3JlYXRlZCIsImJlZm9yZU1vdW50IiwiX3BvcHVwSWQiLCJyZWdpc3RlciIsImJlZm9yZURlc3Ryb3kiLCJkZXJlZ2lzdGVyIiwiY2xvc2VNb2RhbCIsImJvZHlPdmVyZmxvdyIsImRvY3VtZW50IiwiYm9keSIsInN0eWxlIiwib3ZlcmZsb3ciLCJwYWRkaW5nUmlnaHQiLCJib2R5UGFkZGluZ1JpZ2h0IiwiZGF0YSIsIm9wZW5lZCIsInJlbmRlcmVkIiwid2F0Y2giLCJ2YWwiLCJfb3BlbmluZyIsIm5leHRUaWNrIiwib3BlbiIsImNsb3NlIiwibWV0aG9kcyIsIm9wdGlvbnMiLCIkZW1pdCIsIiRwcm9wcyIsIl9jbG9zZVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiX29wZW5UaW1lciIsIk51bWJlciIsInNldFRpbWVvdXQiLCJkb09wZW4iLCIkaXNTZXJ2ZXIiLCJ3aWxsT3BlbiIsIiRlbCIsIl9jbG9zaW5nIiwib3Blbk1vZGFsIiwibmV4dFpJbmRleCIsInVuZGVmaW5lZCIsImJvZHlIYXNPdmVyZmxvdyIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsInNjcm9sbEhlaWdodCIsImdldENvbXB1dGVkU3R5bGUiLCJwb3NpdGlvbiIsIm9uT3BlbiIsIndpbGxDbG9zZSIsImRvQ2xvc2UiLCJvbkNsb3NlIiwiUG9wdXBNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBSUEsU0FBUyxDQUFiO0FBQ0EsTUFBTUMsY0FBYyxFQUFwQjs7QUFFQSxNQUFNQyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUNDLFVBQUQsRUFBZ0I7QUFDckMsUUFBSUYsWUFBWUcsT0FBWixDQUFvQkQsVUFBcEIsTUFBb0MsQ0FBQyxDQUF6QyxFQUE0Qzs7QUFFNUMsUUFBTUUsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxPQUFELEVBQWE7QUFDbEMsVUFBSUMsV0FBV0QsUUFBUUUsT0FBdkI7QUFDQSxVQUFJLENBQUNELFFBQUwsRUFBZTtBQUNiLFlBQU1FLFdBQVdILFFBQVFJLGVBQXpCO0FBQ0EsWUFBSUQsU0FBU0QsT0FBYixFQUFzQjtBQUNwQkQscUJBQVdFLFNBQVNELE9BQXBCO0FBQ0Q7QUFDRjtBQUNELGFBQU9ELFFBQVA7QUFDRCxLQVREOztBQVdBLGtCQUFJSixVQUFKLENBQWVBLFVBQWYsRUFBMkI7QUFDekJRLGdCQUR5QixzQkFDZEMsRUFEYyxFQUNWO0FBQ2IsWUFBTUwsV0FBV0YsZUFBZU8sRUFBZixDQUFqQjs7QUFFQSxZQUFJTCxRQUFKLEVBQWM7QUFDWkEsbUJBQVNNLFdBQVQsSUFBd0JOLFNBQVNNLFdBQVQsRUFBeEI7QUFDRDtBQUNGLE9BUHdCO0FBUXpCQyxnQkFSeUIsc0JBUWRGLEVBUmMsRUFRVjtBQUNiLFlBQU1MLFdBQVdGLGVBQWVPLEVBQWYsQ0FB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QSxZQUFJLEtBQUtwRCxVQUFULEVBQXFCO0FBQ25Ca0MscUJBQVcsWUFBTTtBQUNmLGdCQUFJLE9BQUt0QyxLQUFMLElBQWMsT0FBS2MsWUFBTCxLQUFzQixRQUF4QyxFQUFrRDtBQUNoREMsdUJBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQkMsUUFBcEIsR0FBK0IsT0FBS0osWUFBcEM7QUFDQUMsdUJBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQkUsWUFBcEIsR0FBbUMsT0FBS0MsZ0JBQXhDO0FBQ0Q7QUFDRCxtQkFBS04sWUFBTCxHQUFvQixJQUFwQjtBQUNBLG1CQUFLTSxnQkFBTCxHQUF3QixJQUF4QjtBQUNELFdBUEQsRUFPRyxHQVBIO0FBUUQ7O0FBRUQsYUFBS0UsTUFBTCxHQUFjLEtBQWQ7O0FBRUEsWUFBSSxDQUFDLEtBQUtyRCxVQUFWLEVBQXNCO0FBQ3BCLGVBQUtZLFlBQUw7QUFDRDtBQUNGLE9BN0hNO0FBK0hQQSxrQkEvSE8sMEJBK0hRO0FBQ2IsK0JBQWFnQyxVQUFiLENBQXdCLEtBQUtKLFFBQTdCO0FBQ0EsYUFBS2tDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDtBQWxJTTtBQTdGSSxHO1VBb09iYyxZIiwiZmlsZSI6ImFwcC91dGlscy9wb3B1cC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCBtZXJnZSBmcm9tICcuLi9tZXJnZSc7XG5pbXBvcnQgUG9wdXBNYW5hZ2VyIGZyb20gJy4vcG9wdXAtbWFuYWdlcic7XG5pbXBvcnQgZ2V0U2Nyb2xsQmFyV2lkdGggZnJvbSAnLi4vc2Nyb2xsYmFyLXdpZHRoJztcblxubGV0IGlkU2VlZCA9IDE7XG5jb25zdCB0cmFuc2l0aW9ucyA9IFtdO1xuXG5jb25zdCBob29rVHJhbnNpdGlvbiA9ICh0cmFuc2l0aW9uKSA9PiB7XG4gIGlmICh0cmFuc2l0aW9ucy5pbmRleE9mKHRyYW5zaXRpb24pICE9PSAtMSkgcmV0dXJuO1xuXG4gIGNvbnN0IGdldFZ1ZUluc3RhbmNlID0gKGVsZW1lbnQpID0+IHtcbiAgICBsZXQgaW5zdGFuY2UgPSBlbGVtZW50Ll9fdnVlX187XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgY29uc3QgdGV4dE5vZGUgPSBlbGVtZW50LnByZXZpb3VzU2libGluZztcbiAgICAgIGlmICh0ZXh0Tm9kZS5fX3Z1ZV9fKSB7XG4gICAgICAgIGluc3RhbmNlID0gdGV4dE5vZGUuX192dWVfXztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIFZ1ZS50cmFuc2l0aW9uKHRyYW5zaXRpb24sIHtcbiAgICBhZnRlckVudGVyKGVsKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGdldFZ1ZUluc3RhbmNlKGVsKTtcblxuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlLmRvQWZ0ZXJPcGVuICYmIGluc3RhbmNlLmRvQWZ0ZXJPcGVuKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZnRlckxlYXZlKGVsKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGdldFZ1ZUluc3RhbmNlKGVsKTtcblxuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlLmRvQWZ0ZXJDbG9zZSAmJiBpbnN0YW5jZS5kb0FmdGVyQ2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxubGV0IHNjcm9sbEJhcldpZHRoO1xuXG5jb25zdCBnZXRET00gPSBmdW5jdGlvbihkb20pIHtcbiAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMykge1xuICAgIGRvbSA9IGRvbS5uZXh0RWxlbWVudFNpYmxpbmcgfHwgZG9tLm5leHRTaWJsaW5nO1xuICAgIGdldERPTShkb20pO1xuICB9XG4gIHJldHVybiBkb207XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1vZGVsOiB7XG4gICAgcHJvcDogJ3Zpc2libGUnLFxuICAgIGV2ZW50OiAndmlzaWJsZS1jaGFuZ2UnXG4gIH0sXG4gIHByb3BzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIH0sXG4gICAgb3BlbkRlbGF5OiB7fSxcbiAgICBjbG9zZURlbGF5OiB7fSxcbiAgICB6SW5kZXg6IHt9LFxuICAgIG1vZGFsOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIG1vZGFsRmFkZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIG1vZGFsQ2xhc3M6IHt9LFxuICAgIG1vZGFsQXBwZW5kVG9Cb2R5OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGxvY2tTY3JvbGw6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBjbG9zZU9uUHJlc3NFc2NhcGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgY2xvc2VPbkNsaWNrTW9kYWw6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb24pIHtcbiAgICAgIGhvb2tUcmFuc2l0aW9uKHRoaXMudHJhbnNpdGlvbik7XG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZU1vdW50KCkge1xuICAgIHRoaXMuX3BvcHVwSWQgPSAncG9wdXAtJyArIGlkU2VlZCsrO1xuICAgIFBvcHVwTWFuYWdlci5yZWdpc3Rlcih0aGlzLl9wb3B1cElkLCB0aGlzKTtcbiAgfSxcblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIFBvcHVwTWFuYWdlci5kZXJlZ2lzdGVyKHRoaXMuX3BvcHVwSWQpO1xuICAgIFBvcHVwTWFuYWdlci5jbG9zZU1vZGFsKHRoaXMuX3BvcHVwSWQpO1xuICAgIGlmICh0aGlzLm1vZGFsICYmIHRoaXMuYm9keU92ZXJmbG93ICE9PSBudWxsICYmIHRoaXMuYm9keU92ZXJmbG93ICE9PSAnaGlkZGVuJykge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IHRoaXMuYm9keU92ZXJmbG93O1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSB0aGlzLmJvZHlQYWRkaW5nUmlnaHQ7XG4gICAgfVxuICAgIHRoaXMuYm9keU92ZXJmbG93ID0gbnVsbDtcbiAgICB0aGlzLmJvZHlQYWRkaW5nUmlnaHQgPSBudWxsO1xuICB9LFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lZDogZmFsc2UsXG4gICAgICBib2R5T3ZlcmZsb3c6IG51bGwsXG4gICAgICBib2R5UGFkZGluZ1JpZ2h0OiBudWxsLFxuICAgICAgcmVuZGVyZWQ6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHZpc2libGUodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIGlmICh0aGlzLl9vcGVuaW5nKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5yZW5kZXJlZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICAgIFZ1ZS5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb3BlbihvcHRpb25zKSB7XG4gICAgICBpZiAoIXRoaXMucmVuZGVyZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3Zpc2libGUtY2hhbmdlJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3BzID0gbWVyZ2Uoe30sIHRoaXMuJHByb3BzIHx8IHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICBpZiAodGhpcy5fY2xvc2VUaW1lcikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VUaW1lcik7XG4gICAgICAgIHRoaXMuX2Nsb3NlVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX29wZW5UaW1lcik7XG5cbiAgICAgIGNvbnN0IG9wZW5EZWxheSA9IE51bWJlcihwcm9wcy5vcGVuRGVsYXkpO1xuICAgICAgaWYgKG9wZW5EZWxheSA+IDApIHtcbiAgICAgICAgdGhpcy5fb3BlblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fb3BlblRpbWVyID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmRvT3Blbihwcm9wcyk7XG4gICAgICAgIH0sIG9wZW5EZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvT3Blbihwcm9wcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRvT3Blbihwcm9wcykge1xuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG4gICAgICBpZiAodGhpcy53aWxsT3BlbiAmJiAhdGhpcy53aWxsT3BlbigpKSByZXR1cm47XG4gICAgICBpZiAodGhpcy5vcGVuZWQpIHJldHVybjtcblxuICAgICAgdGhpcy5fb3BlbmluZyA9IHRydWU7XG5cbiAgICAgIHRoaXMuJGVtaXQoJ3Zpc2libGUtY2hhbmdlJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGRvbSA9IGdldERPTSh0aGlzLiRlbCk7XG5cbiAgICAgIGNvbnN0IG1vZGFsID0gcHJvcHMubW9kYWw7XG5cbiAgICAgIGNvbnN0IHpJbmRleCA9IHByb3BzLnpJbmRleDtcbiAgICAgIGlmICh6SW5kZXgpIHtcbiAgICAgICAgUG9wdXBNYW5hZ2VyLnpJbmRleCA9IHpJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgIGlmICh0aGlzLl9jbG9zaW5nKSB7XG4gICAgICAgICAgUG9wdXBNYW5hZ2VyLmNsb3NlTW9kYWwodGhpcy5fcG9wdXBJZCk7XG4gICAgICAgICAgdGhpcy5fY2xvc2luZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFBvcHVwTWFuYWdlci5vcGVuTW9kYWwodGhpcy5fcG9wdXBJZCwgUG9wdXBNYW5hZ2VyLm5leHRaSW5kZXgoKSwgdGhpcy5tb2RhbEFwcGVuZFRvQm9keSA/IHVuZGVmaW5lZCA6IGRvbSwgcHJvcHMubW9kYWxDbGFzcywgcHJvcHMubW9kYWxGYWRlKTtcbiAgICAgICAgaWYgKHByb3BzLmxvY2tTY3JvbGwpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuYm9keU92ZXJmbG93KSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlQYWRkaW5nUmlnaHQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodDtcbiAgICAgICAgICAgIHRoaXMuYm9keU92ZXJmbG93ID0gZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdztcbiAgICAgICAgICB9XG4gICAgICAgICAgc2Nyb2xsQmFyV2lkdGggPSBnZXRTY3JvbGxCYXJXaWR0aCgpO1xuICAgICAgICAgIGxldCBib2R5SGFzT3ZlcmZsb3cgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IDwgZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgaWYgKHNjcm9sbEJhcldpZHRoID4gMCAmJiBib2R5SGFzT3ZlcmZsb3cpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc2Nyb2xsQmFyV2lkdGggKyAncHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZG9tKS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgZG9tLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIH1cblxuICAgICAgZG9tLnN0eWxlLnpJbmRleCA9IFBvcHVwTWFuYWdlci5uZXh0WkluZGV4KCk7XG4gICAgICB0aGlzLm9wZW5lZCA9IHRydWU7XG5cbiAgICAgIHRoaXMub25PcGVuICYmIHRoaXMub25PcGVuKCk7XG5cbiAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuZG9BZnRlck9wZW4oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9BZnRlck9wZW4oKSB7XG4gICAgICB0aGlzLl9vcGVuaW5nID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb3NlKCkge1xuICAgICAgaWYgKHRoaXMud2lsbENsb3NlICYmICF0aGlzLndpbGxDbG9zZSgpKSByZXR1cm47XG5cbiAgICAgIGlmICh0aGlzLl9vcGVuVGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX29wZW5UaW1lcik7XG4gICAgICAgIHRoaXMuX29wZW5UaW1lciA9IG51bGw7XG4gICAgICB9XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VUaW1lcik7XG5cbiAgICAgIGNvbnN0IGNsb3NlRGVsYXkgPSBOdW1iZXIodGhpcy5jbG9zZURlbGF5KTtcblxuICAgICAgaWYgKGNsb3NlRGVsYXkgPiAwKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9jbG9zZVRpbWVyID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmRvQ2xvc2UoKTtcbiAgICAgICAgfSwgY2xvc2VEZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvQ2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9DbG9zZSgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ3Zpc2libGUtY2hhbmdlJywgZmFsc2UpO1xuICAgICAgdGhpcy5fY2xvc2luZyA9IHRydWU7XG5cbiAgICAgIHRoaXMub25DbG9zZSAmJiB0aGlzLm9uQ2xvc2UoKTtcblxuICAgICAgaWYgKHRoaXMubG9ja1Njcm9sbCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5tb2RhbCAmJiB0aGlzLmJvZHlPdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSB0aGlzLmJvZHlPdmVyZmxvdztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gdGhpcy5ib2R5UGFkZGluZ1JpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmJvZHlPdmVyZmxvdyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5ib2R5UGFkZGluZ1JpZ2h0ID0gbnVsbDtcbiAgICAgICAgfSwgMjAwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5kb0FmdGVyQ2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9BZnRlckNsb3NlKCkge1xuICAgICAgUG9wdXBNYW5hZ2VyLmNsb3NlTW9kYWwodGhpcy5fcG9wdXBJZCk7XG4gICAgICB0aGlzLl9jbG9zaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge1xuICBQb3B1cE1hbmFnZXJcbn07XG4iXX0=
