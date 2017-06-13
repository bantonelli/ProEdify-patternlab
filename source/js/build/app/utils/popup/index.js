define(['exports', 'vue', 'element-ui/src/utils/merge', 'element-ui/src/utils/popup/popup-manager', '../scrollbar-width'], function (exports, _vue, _merge, _popupManager, _scrollbarWidth) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9wb3B1cC9pbmRleC5qcyJdLCJuYW1lcyI6WyJpZFNlZWQiLCJ0cmFuc2l0aW9ucyIsImhvb2tUcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImluZGV4T2YiLCJnZXRWdWVJbnN0YW5jZSIsImVsZW1lbnQiLCJpbnN0YW5jZSIsIl9fdnVlX18iLCJ0ZXh0Tm9kZSIsInByZXZpb3VzU2libGluZyIsImFmdGVyRW50ZXIiLCJlbCIsImRvQWZ0ZXJPcGVuIiwiYWZ0ZXJMZWF2ZSIsImRvQWZ0ZXJDbG9zZSIsInNjcm9sbEJhcldpZHRoIiwiZ2V0RE9NIiwiZG9tIiwibm9kZVR5cGUiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0U2libGluZyIsIm1vZGVsIiwicHJvcCIsImV2ZW50IiwicHJvcHMiLCJ2aXNpYmxlIiwidHlwZSIsIkJvb2xlYW4iLCJkZWZhdWx0IiwiU3RyaW5nIiwib3BlbkRlbGF5IiwiY2xvc2VEZWxheSIsInpJbmRleCIsIm1vZGFsIiwibW9kYWxGYWRlIiwibW9kYWxDbGFzcyIsIm1vZGFsQXBwZW5kVG9Cb2R5IiwibG9ja1Njcm9sbCIsImNsb3NlT25QcmVzc0VzY2FwZSIsImNsb3NlT25DbGlja01vZGFsIiwiY3JlYXRlZCIsImJlZm9yZU1vdW50IiwiX3BvcHVwSWQiLCJyZWdpc3RlciIsImJlZm9yZURlc3Ryb3kiLCJkZXJlZ2lzdGVyIiwiY2xvc2VNb2RhbCIsImJvZHlPdmVyZmxvdyIsImRvY3VtZW50IiwiYm9keSIsInN0eWxlIiwib3ZlcmZsb3ciLCJwYWRkaW5nUmlnaHQiLCJib2R5UGFkZGluZ1JpZ2h0IiwiZGF0YSIsIm9wZW5lZCIsInJlbmRlcmVkIiwid2F0Y2giLCJ2YWwiLCJfb3BlbmluZyIsIm5leHRUaWNrIiwib3BlbiIsImNsb3NlIiwibWV0aG9kcyIsIm9wdGlvbnMiLCIkZW1pdCIsIiRwcm9wcyIsIl9jbG9zZVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiX29wZW5UaW1lciIsIk51bWJlciIsInNldFRpbWVvdXQiLCJkb09wZW4iLCIkaXNTZXJ2ZXIiLCJ3aWxsT3BlbiIsIiRlbCIsIl9jbG9zaW5nIiwib3Blbk1vZGFsIiwibmV4dFpJbmRleCIsInVuZGVmaW5lZCIsImJvZHlIYXNPdmVyZmxvdyIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsInNjcm9sbEhlaWdodCIsImdldENvbXB1dGVkU3R5bGUiLCJwb3NpdGlvbiIsIm9uT3BlbiIsIndpbGxDbG9zZSIsImRvQ2xvc2UiLCJvbkNsb3NlIiwiUG9wdXBNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBSUEsU0FBUyxDQUFiO0FBQ0EsTUFBTUMsY0FBYyxFQUFwQjs7QUFFQSxNQUFNQyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUNDLFVBQUQsRUFBZ0I7QUFDckMsUUFBSUYsWUFBWUcsT0FBWixDQUFvQkQsVUFBcEIsTUFBb0MsQ0FBQyxDQUF6QyxFQUE0Qzs7QUFFNUMsUUFBTUUsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxPQUFELEVBQWE7QUFDbEMsVUFBSUMsV0FBV0QsUUFBUUUsT0FBdkI7QUFDQSxVQUFJLENBQUNELFFBQUwsRUFBZTtBQUNiLFlBQU1FLFdBQVdILFFBQVFJLGVBQXpCO0FBQ0EsWUFBSUQsU0FBU0QsT0FBYixFQUFzQjtBQUNwQkQscUJBQVdFLFNBQVNELE9BQXBCO0FBQ0Q7QUFDRjtBQUNELGFBQU9ELFFBQVA7QUFDRCxLQVREOztBQVdBLGtCQUFJSixVQUFKLENBQWVBLFVBQWYsRUFBMkI7QUFDekJRLGdCQUR5QixzQkFDZEMsRUFEYyxFQUNWO0FBQ2IsWUFBTUwsV0FBV0YsZUFBZU8sRUFBZixDQUFqQjs7QUFFQSxZQUFJTCxRQUFKLEVBQWM7QUFDWkEsbUJBQVNNLFdBQVQsSUFBd0JOLFNBQVNNLFdBQVQsRUFBeEI7QUFDRDtBQUNGLE9BUHdCO0FBUXpCQyxnQkFSeUIsc0JBUWRGLEVBUmMsRUFRVjtBQUNiLFlBQU1MLFdBQVdGLGVBQWVPLEVBQWYsQ0FB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QSxZQUFJLEtBQUtwRCxVQUFULEVBQXFCO0FBQ25Ca0MscUJBQVcsWUFBTTtBQUNmLGdCQUFJLE9BQUt0QyxLQUFMLElBQWMsT0FBS2MsWUFBTCxLQUFzQixRQUF4QyxFQUFrRDtBQUNoREMsdUJBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQkMsUUFBcEIsR0FBK0IsT0FBS0osWUFBcEM7QUFDQUMsdUJBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQkUsWUFBcEIsR0FBbUMsT0FBS0MsZ0JBQXhDO0FBQ0Q7QUFDRCxtQkFBS04sWUFBTCxHQUFvQixJQUFwQjtBQUNBLG1CQUFLTSxnQkFBTCxHQUF3QixJQUF4QjtBQUNELFdBUEQsRUFPRyxHQVBIO0FBUUQ7O0FBRUQsYUFBS0UsTUFBTCxHQUFjLEtBQWQ7O0FBRUEsWUFBSSxDQUFDLEtBQUtyRCxVQUFWLEVBQXNCO0FBQ3BCLGVBQUtZLFlBQUw7QUFDRDtBQUNGLE9BN0hNO0FBK0hQQSxrQkEvSE8sMEJBK0hRO0FBQ2IsK0JBQWFnQyxVQUFiLENBQXdCLEtBQUtKLFFBQTdCO0FBQ0EsYUFBS2tDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDtBQWxJTTtBQTdGSSxHO1VBb09iYyxZIiwiZmlsZSI6ImFwcC91dGlscy9wb3B1cC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCBtZXJnZSBmcm9tICdlbGVtZW50LXVpL3NyYy91dGlscy9tZXJnZSc7XG5pbXBvcnQgUG9wdXBNYW5hZ2VyIGZyb20gJ2VsZW1lbnQtdWkvc3JjL3V0aWxzL3BvcHVwL3BvcHVwLW1hbmFnZXInO1xuaW1wb3J0IGdldFNjcm9sbEJhcldpZHRoIGZyb20gJy4uL3Njcm9sbGJhci13aWR0aCc7XG5cbmxldCBpZFNlZWQgPSAxO1xuY29uc3QgdHJhbnNpdGlvbnMgPSBbXTtcblxuY29uc3QgaG9va1RyYW5zaXRpb24gPSAodHJhbnNpdGlvbikgPT4ge1xuICBpZiAodHJhbnNpdGlvbnMuaW5kZXhPZih0cmFuc2l0aW9uKSAhPT0gLTEpIHJldHVybjtcblxuICBjb25zdCBnZXRWdWVJbnN0YW5jZSA9IChlbGVtZW50KSA9PiB7XG4gICAgbGV0IGluc3RhbmNlID0gZWxlbWVudC5fX3Z1ZV9fO1xuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IHRleHROb2RlID0gZWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICBpZiAodGV4dE5vZGUuX192dWVfXykge1xuICAgICAgICBpbnN0YW5jZSA9IHRleHROb2RlLl9fdnVlX187XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICBWdWUudHJhbnNpdGlvbih0cmFuc2l0aW9uLCB7XG4gICAgYWZ0ZXJFbnRlcihlbCkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBnZXRWdWVJbnN0YW5jZShlbCk7XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZS5kb0FmdGVyT3BlbiAmJiBpbnN0YW5jZS5kb0FmdGVyT3BlbigpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWZ0ZXJMZWF2ZShlbCkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBnZXRWdWVJbnN0YW5jZShlbCk7XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZS5kb0FmdGVyQ2xvc2UgJiYgaW5zdGFuY2UuZG9BZnRlckNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmxldCBzY3JvbGxCYXJXaWR0aDtcblxuY29uc3QgZ2V0RE9NID0gZnVuY3Rpb24oZG9tKSB7XG4gIGlmIChkb20ubm9kZVR5cGUgPT09IDMpIHtcbiAgICBkb20gPSBkb20ubmV4dEVsZW1lbnRTaWJsaW5nIHx8IGRvbS5uZXh0U2libGluZztcbiAgICBnZXRET00oZG9tKTtcbiAgfVxuICByZXR1cm4gZG9tO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtb2RlbDoge1xuICAgIHByb3A6ICd2aXNpYmxlJyxcbiAgICBldmVudDogJ3Zpc2libGUtY2hhbmdlJ1xuICB9LFxuICBwcm9wczoge1xuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJydcbiAgICB9LFxuICAgIG9wZW5EZWxheToge30sXG4gICAgY2xvc2VEZWxheToge30sXG4gICAgekluZGV4OiB7fSxcbiAgICBtb2RhbDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBtb2RhbEZhZGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBtb2RhbENsYXNzOiB7fSxcbiAgICBtb2RhbEFwcGVuZFRvQm9keToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBsb2NrU2Nyb2xsOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAgY2xvc2VPblByZXNzRXNjYXBlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGNsb3NlT25DbGlja01vZGFsOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlZCgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uKSB7XG4gICAgICBob29rVHJhbnNpdGlvbih0aGlzLnRyYW5zaXRpb24pO1xuICAgIH1cbiAgfSxcblxuICBiZWZvcmVNb3VudCgpIHtcbiAgICB0aGlzLl9wb3B1cElkID0gJ3BvcHVwLScgKyBpZFNlZWQrKztcbiAgICBQb3B1cE1hbmFnZXIucmVnaXN0ZXIodGhpcy5fcG9wdXBJZCwgdGhpcyk7XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICBQb3B1cE1hbmFnZXIuZGVyZWdpc3Rlcih0aGlzLl9wb3B1cElkKTtcbiAgICBQb3B1cE1hbmFnZXIuY2xvc2VNb2RhbCh0aGlzLl9wb3B1cElkKTtcbiAgICBpZiAodGhpcy5tb2RhbCAmJiB0aGlzLmJvZHlPdmVyZmxvdyAhPT0gbnVsbCAmJiB0aGlzLmJvZHlPdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSB0aGlzLmJvZHlPdmVyZmxvdztcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gdGhpcy5ib2R5UGFkZGluZ1JpZ2h0O1xuICAgIH1cbiAgICB0aGlzLmJvZHlPdmVyZmxvdyA9IG51bGw7XG4gICAgdGhpcy5ib2R5UGFkZGluZ1JpZ2h0ID0gbnVsbDtcbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZWQ6IGZhbHNlLFxuICAgICAgYm9keU92ZXJmbG93OiBudWxsLFxuICAgICAgYm9keVBhZGRpbmdSaWdodDogbnVsbCxcbiAgICAgIHJlbmRlcmVkOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICB2aXNpYmxlKHZhbCkge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fb3BlbmluZykgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMucmVuZGVyZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkID0gdHJ1ZTtcbiAgICAgICAgICBWdWUubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9wZW4ob3B0aW9ucykge1xuICAgICAgaWYgKCF0aGlzLnJlbmRlcmVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRlbWl0KCd2aXNpYmxlLWNoYW5nZScsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcm9wcyA9IG1lcmdlKHt9LCB0aGlzLiRwcm9wcyB8fCB0aGlzLCBvcHRpb25zKTtcblxuICAgICAgaWYgKHRoaXMuX2Nsb3NlVGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nsb3NlVGltZXIpO1xuICAgICAgICB0aGlzLl9jbG9zZVRpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9vcGVuVGltZXIpO1xuXG4gICAgICBjb25zdCBvcGVuRGVsYXkgPSBOdW1iZXIocHJvcHMub3BlbkRlbGF5KTtcbiAgICAgIGlmIChvcGVuRGVsYXkgPiAwKSB7XG4gICAgICAgIHRoaXMuX29wZW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX29wZW5UaW1lciA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kb09wZW4ocHJvcHMpO1xuICAgICAgICB9LCBvcGVuRGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kb09wZW4ocHJvcHMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkb09wZW4ocHJvcHMpIHtcbiAgICAgIGlmICh0aGlzLiRpc1NlcnZlcikgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMud2lsbE9wZW4gJiYgIXRoaXMud2lsbE9wZW4oKSkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMub3BlbmVkKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX29wZW5pbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLiRlbWl0KCd2aXNpYmxlLWNoYW5nZScsIHRydWUpO1xuXG4gICAgICBjb25zdCBkb20gPSBnZXRET00odGhpcy4kZWwpO1xuXG4gICAgICBjb25zdCBtb2RhbCA9IHByb3BzLm1vZGFsO1xuXG4gICAgICBjb25zdCB6SW5kZXggPSBwcm9wcy56SW5kZXg7XG4gICAgICBpZiAoekluZGV4KSB7XG4gICAgICAgIFBvcHVwTWFuYWdlci56SW5kZXggPSB6SW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChtb2RhbCkge1xuICAgICAgICBpZiAodGhpcy5fY2xvc2luZykge1xuICAgICAgICAgIFBvcHVwTWFuYWdlci5jbG9zZU1vZGFsKHRoaXMuX3BvcHVwSWQpO1xuICAgICAgICAgIHRoaXMuX2Nsb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBQb3B1cE1hbmFnZXIub3Blbk1vZGFsKHRoaXMuX3BvcHVwSWQsIFBvcHVwTWFuYWdlci5uZXh0WkluZGV4KCksIHRoaXMubW9kYWxBcHBlbmRUb0JvZHkgPyB1bmRlZmluZWQgOiBkb20sIHByb3BzLm1vZGFsQ2xhc3MsIHByb3BzLm1vZGFsRmFkZSk7XG4gICAgICAgIGlmIChwcm9wcy5sb2NrU2Nyb2xsKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmJvZHlPdmVyZmxvdykge1xuICAgICAgICAgICAgdGhpcy5ib2R5UGFkZGluZ1JpZ2h0ID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgICAgICB0aGlzLmJvZHlPdmVyZmxvdyA9IGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNjcm9sbEJhcldpZHRoID0gZ2V0U2Nyb2xsQmFyV2lkdGgoKTtcbiAgICAgICAgICBsZXQgYm9keUhhc092ZXJmbG93ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgIGlmIChzY3JvbGxCYXJXaWR0aCA+IDAgJiYgYm9keUhhc092ZXJmbG93KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IHNjcm9sbEJhcldpZHRoICsgJ3B4JztcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGRvbSkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGRvbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB9XG5cbiAgICAgIGRvbS5zdHlsZS56SW5kZXggPSBQb3B1cE1hbmFnZXIubmV4dFpJbmRleCgpO1xuICAgICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLm9uT3BlbiAmJiB0aGlzLm9uT3BlbigpO1xuXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikge1xuICAgICAgICB0aGlzLmRvQWZ0ZXJPcGVuKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRvQWZ0ZXJPcGVuKCkge1xuICAgICAgdGhpcy5fb3BlbmluZyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9zZSgpIHtcbiAgICAgIGlmICh0aGlzLndpbGxDbG9zZSAmJiAhdGhpcy53aWxsQ2xvc2UoKSkgcmV0dXJuO1xuXG4gICAgICBpZiAodGhpcy5fb3BlblRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9vcGVuVGltZXIpO1xuICAgICAgICB0aGlzLl9vcGVuVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nsb3NlVGltZXIpO1xuXG4gICAgICBjb25zdCBjbG9zZURlbGF5ID0gTnVtYmVyKHRoaXMuY2xvc2VEZWxheSk7XG5cbiAgICAgIGlmIChjbG9zZURlbGF5ID4gMCkge1xuICAgICAgICB0aGlzLl9jbG9zZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY2xvc2VUaW1lciA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kb0Nsb3NlKCk7XG4gICAgICAgIH0sIGNsb3NlRGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kb0Nsb3NlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRvQ2xvc2UoKSB7XG4gICAgICB0aGlzLiRlbWl0KCd2aXNpYmxlLWNoYW5nZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuX2Nsb3NpbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLm9uQ2xvc2UgJiYgdGhpcy5vbkNsb3NlKCk7XG5cbiAgICAgIGlmICh0aGlzLmxvY2tTY3JvbGwpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMubW9kYWwgJiYgdGhpcy5ib2R5T3ZlcmZsb3cgIT09ICdoaWRkZW4nKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gdGhpcy5ib2R5T3ZlcmZsb3c7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IHRoaXMuYm9keVBhZGRpbmdSaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5ib2R5T3ZlcmZsb3cgPSBudWxsO1xuICAgICAgICAgIHRoaXMuYm9keVBhZGRpbmdSaWdodCA9IG51bGw7XG4gICAgICAgIH0sIDIwMCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG5cbiAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuZG9BZnRlckNsb3NlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRvQWZ0ZXJDbG9zZSgpIHtcbiAgICAgIFBvcHVwTWFuYWdlci5jbG9zZU1vZGFsKHRoaXMuX3BvcHVwSWQpO1xuICAgICAgdGhpcy5fY2xvc2luZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgUG9wdXBNYW5hZ2VyXG59O1xuIl19
