define(['exports', 'vue', 'element-ui/src/utils/dom'], function (exports, _vue, _dom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vue2 = _interopRequireDefault(_vue);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var hasModal = false;

  var getModal = function getModal() {
    if (_vue2.default.prototype.$isServer) return;
    var modalDom = PopupManager.modalDom;
    if (modalDom) {
      hasModal = true;
    } else {
      hasModal = false;
      modalDom = document.createElement('div');
      PopupManager.modalDom = modalDom;

      modalDom.addEventListener('touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });

      modalDom.addEventListener('click', function () {
        PopupManager.doOnModalClick && PopupManager.doOnModalClick();
      });
    }

    return modalDom;
  };

  var instances = {};

  var PopupManager = {
    zIndex: 2000,

    modalFade: true,

    getInstance: function getInstance(id) {
      return instances[id];
    },

    register: function register(id, instance) {
      if (id && instance) {
        instances[id] = instance;
      }
    },

    deregister: function deregister(id) {
      if (id) {
        instances[id] = null;
        delete instances[id];
      }
    },

    nextZIndex: function nextZIndex() {
      return PopupManager.zIndex++;
    },

    modalStack: [],

    doOnModalClick: function doOnModalClick() {
      var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
      if (!topItem) return;

      var instance = PopupManager.getInstance(topItem.id);
      if (instance && instance.closeOnClickModal) {
        instance.close();
      }
    },

    openModal: function openModal(id, zIndex, dom, modalClass, modalFade) {
      if (_vue2.default.prototype.$isServer) return;
      if (!id || zIndex === undefined) return;
      this.modalFade = modalFade;

      var modalStack = this.modalStack;

      for (var i = 0, j = modalStack.length; i < j; i++) {
        var item = modalStack[i];
        if (item.id === id) {
          return;
        }
      }

      var modalDom = getModal();

      (0, _dom.addClass)(modalDom, 'v-modal');
      if (this.modalFade && !hasModal) {
        (0, _dom.addClass)(modalDom, 'v-modal-enter');
      }
      if (modalClass) {
        var classArr = modalClass.trim().split(/\s+/);
        classArr.forEach(function (item) {
          return (0, _dom.addClass)(modalDom, item);
        });
      }
      setTimeout(function () {
        (0, _dom.removeClass)(modalDom, 'v-modal-enter');
      }, 200);

      if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
        dom.parentNode.appendChild(modalDom);
      } else {
        document.body.appendChild(modalDom);
      }

      if (zIndex) {
        modalDom.style.zIndex = zIndex;
      }
      modalDom.style.display = '';

      this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
    },

    closeModal: function closeModal(id) {
      var modalStack = this.modalStack;
      var modalDom = getModal();

      if (modalStack.length > 0) {
        var topItem = modalStack[modalStack.length - 1];
        if (topItem.id === id) {
          if (topItem.modalClass) {
            var classArr = topItem.modalClass.trim().split(/\s+/);
            classArr.forEach(function (item) {
              return (0, _dom.removeClass)(modalDom, item);
            });
          }

          modalStack.pop();
          if (modalStack.length > 0) {
            modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
          }
        } else {
          for (var i = modalStack.length - 1; i >= 0; i--) {
            if (modalStack[i].id === id) {
              modalStack.splice(i, 1);
              break;
            }
          }
        }
      }

      if (modalStack.length === 0) {
        if (this.modalFade) {
          (0, _dom.addClass)(modalDom, 'v-modal-leave');
        }
        setTimeout(function () {
          if (modalStack.length === 0) {
            if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
            modalDom.style.display = 'none';
            PopupManager.modalDom = undefined;
          }
          (0, _dom.removeClass)(modalDom, 'v-modal-leave');
        }, 200);
      }
    }
  };

  var getTopPopup = function getTopPopup() {
    if (_vue2.default.prototype.$isServer) return;
    if (PopupManager.modalStack.length > 0) {
      var topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1];
      if (!topPopup) return;
      var instance = PopupManager.getInstance(topPopup.id);

      return instance;
    }
  };

  if (!_vue2.default.prototype.$isServer) {
    // handle `esc` key when the popup is shown
    window.addEventListener('keydown', function (event) {
      if (event.keyCode === 27) {
        var topPopup = getTopPopup();

        if (topPopup && topPopup.closeOnPressEscape) {
          topPopup.handleClose ? topPopup.handleClose() : topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close();
        }
      }
    });

    // keep focusing inside the popup by `tab` key
    document.addEventListener('focusin', function (event) {
      var topPopup = getTopPopup();

      if (topPopup && !topPopup.$el.contains(event.target)) {
        event.stopPropagation();
        topPopup.$el.focus();
      }
    });
  }

  exports.default = PopupManager;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9wb3B1cC9wb3B1cC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImhhc01vZGFsIiwiZ2V0TW9kYWwiLCJwcm90b3R5cGUiLCIkaXNTZXJ2ZXIiLCJtb2RhbERvbSIsIlBvcHVwTWFuYWdlciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiZG9Pbk1vZGFsQ2xpY2siLCJpbnN0YW5jZXMiLCJ6SW5kZXgiLCJtb2RhbEZhZGUiLCJnZXRJbnN0YW5jZSIsImlkIiwicmVnaXN0ZXIiLCJpbnN0YW5jZSIsImRlcmVnaXN0ZXIiLCJuZXh0WkluZGV4IiwibW9kYWxTdGFjayIsInRvcEl0ZW0iLCJsZW5ndGgiLCJjbG9zZU9uQ2xpY2tNb2RhbCIsImNsb3NlIiwib3Blbk1vZGFsIiwiZG9tIiwibW9kYWxDbGFzcyIsInVuZGVmaW5lZCIsImkiLCJqIiwiaXRlbSIsImNsYXNzQXJyIiwidHJpbSIsInNwbGl0IiwiZm9yRWFjaCIsInNldFRpbWVvdXQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiLCJhcHBlbmRDaGlsZCIsImJvZHkiLCJzdHlsZSIsImRpc3BsYXkiLCJwdXNoIiwiY2xvc2VNb2RhbCIsInBvcCIsInNwbGljZSIsInJlbW92ZUNoaWxkIiwiZ2V0VG9wUG9wdXAiLCJ0b3BQb3B1cCIsIndpbmRvdyIsImtleUNvZGUiLCJjbG9zZU9uUHJlc3NFc2NhcGUiLCJoYW5kbGVDbG9zZSIsImhhbmRsZUFjdGlvbiIsIiRlbCIsImNvbnRhaW5zIiwidGFyZ2V0IiwiZm9jdXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQUlBLFdBQVcsS0FBZjs7QUFFQSxNQUFNQyxXQUFXLFNBQVhBLFFBQVcsR0FBVztBQUMxQixRQUFJLGNBQUlDLFNBQUosQ0FBY0MsU0FBbEIsRUFBNkI7QUFDN0IsUUFBSUMsV0FBV0MsYUFBYUQs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QVc5QyxhQUFhaUIsVUFBYixDQUF3QmpCLGFBQWFpQixVQUFiLENBQXdCRSxNQUF4QixHQUFpQyxDQUF6RCxDQUFqQjtBQUNBLFVBQUksQ0FBQzJCLFFBQUwsRUFBZTtBQUNmLFVBQU1oQyxXQUFXZCxhQUFhVyxXQUFiLENBQXlCbUMsU0FBU2xDLEVBQWxDLENBQWpCOztBQUVBLGFBQU9FLFFBQVA7QUFDRDtBQUNGLEdBVEQ7O0FBV0EsTUFBSSxDQUFDLGNBQUlqQixTQUFKLENBQWNDLFNBQW5CLEVBQThCO0FBQzVCO0FBQ0FpRCxXQUFPNUMsZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsVUFBU0MsS0FBVCxFQUFnQjtBQUNqRCxVQUFJQSxNQUFNNEMsT0FBTixLQUFrQixFQUF0QixFQUEwQjtBQUN4QixZQUFNRixXQUFXRCxhQUFqQjs7QUFFQSxZQUFJQyxZQUFZQSxTQUFTRyxrQkFBekIsRUFBNkM7QUFDM0NILG1CQUFTSSxXQUFULEdBQ0lKLFNBQVNJLFdBQVQsRUFESixHQUVLSixTQUFTSyxZQUFULEdBQXdCTCxTQUFTSyxZQUFULENBQXNCLFFBQXRCLENBQXhCLEdBQTBETCxTQUFTekIsS0FBVCxFQUYvRDtBQUdEO0FBQ0Y7QUFDRixLQVZEOztBQVlBO0FBQ0FwQixhQUFTRSxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxVQUFTQyxLQUFULEVBQWdCO0FBQ25ELFVBQU0wQyxXQUFXRCxhQUFqQjs7QUFFQSxVQUFJQyxZQUFZLENBQUNBLFNBQVNNLEdBQVQsQ0FBYUMsUUFBYixDQUFzQmpELE1BQU1rRCxNQUE1QixDQUFqQixFQUFzRDtBQUNwRGxELGNBQU1FLGVBQU47QUFDQXdDLGlCQUFTTSxHQUFULENBQWFHLEtBQWI7QUFDRDtBQUNGLEtBUEQ7QUFRRDs7b0JBRWN2RCxZIiwiZmlsZSI6ImFwcC91dGlscy9wb3B1cC9wb3B1cC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnO1xuaW1wb3J0IHsgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzIH0gZnJvbSAnZWxlbWVudC11aS9zcmMvdXRpbHMvZG9tJztcblxubGV0IGhhc01vZGFsID0gZmFsc2U7XG5cbmNvbnN0IGdldE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gIGlmIChWdWUucHJvdG90eXBlLiRpc1NlcnZlcikgcmV0dXJuO1xuICBsZXQgbW9kYWxEb20gPSBQb3B1cE1hbmFnZXIubW9kYWxEb207XG4gIGlmIChtb2RhbERvbSkge1xuICAgIGhhc01vZGFsID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBoYXNNb2RhbCA9IGZhbHNlO1xuICAgIG1vZGFsRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgUG9wdXBNYW5hZ2VyLm1vZGFsRG9tID0gbW9kYWxEb207XG5cbiAgICBtb2RhbERvbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbW9kYWxEb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFBvcHVwTWFuYWdlci5kb09uTW9kYWxDbGljayAmJiBQb3B1cE1hbmFnZXIuZG9Pbk1vZGFsQ2xpY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtb2RhbERvbTtcbn07XG5cbmNvbnN0IGluc3RhbmNlcyA9IHt9O1xuXG5jb25zdCBQb3B1cE1hbmFnZXIgPSB7XG4gIHpJbmRleDogMjAwMCxcblxuICBtb2RhbEZhZGU6IHRydWUsXG5cbiAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlc1tpZF07XG4gIH0sXG5cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGlkLCBpbnN0YW5jZSkge1xuICAgIGlmIChpZCAmJiBpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuICAgIH1cbiAgfSxcblxuICBkZXJlZ2lzdGVyOiBmdW5jdGlvbihpZCkge1xuICAgIGlmIChpZCkge1xuICAgICAgaW5zdGFuY2VzW2lkXSA9IG51bGw7XG4gICAgICBkZWxldGUgaW5zdGFuY2VzW2lkXTtcbiAgICB9XG4gIH0sXG5cbiAgbmV4dFpJbmRleDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFBvcHVwTWFuYWdlci56SW5kZXgrKztcbiAgfSxcblxuICBtb2RhbFN0YWNrOiBbXSxcblxuICBkb09uTW9kYWxDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdG9wSXRlbSA9IFBvcHVwTWFuYWdlci5tb2RhbFN0YWNrW1BvcHVwTWFuYWdlci5tb2RhbFN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGlmICghdG9wSXRlbSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaW5zdGFuY2UgPSBQb3B1cE1hbmFnZXIuZ2V0SW5zdGFuY2UodG9wSXRlbS5pZCk7XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLmNsb3NlT25DbGlja01vZGFsKSB7XG4gICAgICBpbnN0YW5jZS5jbG9zZSgpO1xuICAgIH1cbiAgfSxcblxuICBvcGVuTW9kYWw6IGZ1bmN0aW9uKGlkLCB6SW5kZXgsIGRvbSwgbW9kYWxDbGFzcywgbW9kYWxGYWRlKSB7XG4gICAgaWYgKFZ1ZS5wcm90b3R5cGUuJGlzU2VydmVyKSByZXR1cm47XG4gICAgaWYgKCFpZCB8fCB6SW5kZXggPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIHRoaXMubW9kYWxGYWRlID0gbW9kYWxGYWRlO1xuXG4gICAgY29uc3QgbW9kYWxTdGFjayA9IHRoaXMubW9kYWxTdGFjaztcblxuICAgIGZvciAobGV0IGkgPSAwLCBqID0gbW9kYWxTdGFjay5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBtb2RhbFN0YWNrW2ldO1xuICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtb2RhbERvbSA9IGdldE1vZGFsKCk7XG5cbiAgICBhZGRDbGFzcyhtb2RhbERvbSwgJ3YtbW9kYWwnKTtcbiAgICBpZiAodGhpcy5tb2RhbEZhZGUgJiYgIWhhc01vZGFsKSB7XG4gICAgICBhZGRDbGFzcyhtb2RhbERvbSwgJ3YtbW9kYWwtZW50ZXInKTtcbiAgICB9XG4gICAgaWYgKG1vZGFsQ2xhc3MpIHtcbiAgICAgIGxldCBjbGFzc0FyciA9IG1vZGFsQ2xhc3MudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgICBjbGFzc0Fyci5mb3JFYWNoKGl0ZW0gPT4gYWRkQ2xhc3MobW9kYWxEb20sIGl0ZW0pKTtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZW1vdmVDbGFzcyhtb2RhbERvbSwgJ3YtbW9kYWwtZW50ZXInKTtcbiAgICB9LCAyMDApO1xuXG4gICAgaWYgKGRvbSAmJiBkb20ucGFyZW50Tm9kZSAmJiBkb20ucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gMTEpIHtcbiAgICAgIGRvbS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKG1vZGFsRG9tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbERvbSk7XG4gICAgfVxuXG4gICAgaWYgKHpJbmRleCkge1xuICAgICAgbW9kYWxEb20uc3R5bGUuekluZGV4ID0gekluZGV4O1xuICAgIH1cbiAgICBtb2RhbERvbS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cbiAgICB0aGlzLm1vZGFsU3RhY2sucHVzaCh7IGlkOiBpZCwgekluZGV4OiB6SW5kZXgsIG1vZGFsQ2xhc3M6IG1vZGFsQ2xhc3MgfSk7XG4gIH0sXG5cbiAgY2xvc2VNb2RhbDogZnVuY3Rpb24oaWQpIHtcbiAgICBjb25zdCBtb2RhbFN0YWNrID0gdGhpcy5tb2RhbFN0YWNrO1xuICAgIGNvbnN0IG1vZGFsRG9tID0gZ2V0TW9kYWwoKTtcblxuICAgIGlmIChtb2RhbFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHRvcEl0ZW0gPSBtb2RhbFN0YWNrW21vZGFsU3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBpZiAodG9wSXRlbS5pZCA9PT0gaWQpIHtcbiAgICAgICAgaWYgKHRvcEl0ZW0ubW9kYWxDbGFzcykge1xuICAgICAgICAgIGxldCBjbGFzc0FyciA9IHRvcEl0ZW0ubW9kYWxDbGFzcy50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICBjbGFzc0Fyci5mb3JFYWNoKGl0ZW0gPT4gcmVtb3ZlQ2xhc3MobW9kYWxEb20sIGl0ZW0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsU3RhY2sucG9wKCk7XG4gICAgICAgIGlmIChtb2RhbFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBtb2RhbERvbS5zdHlsZS56SW5kZXggPSBtb2RhbFN0YWNrW21vZGFsU3RhY2subGVuZ3RoIC0gMV0uekluZGV4O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gbW9kYWxTdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChtb2RhbFN0YWNrW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgbW9kYWxTdGFjay5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kYWxTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLm1vZGFsRmFkZSkge1xuICAgICAgICBhZGRDbGFzcyhtb2RhbERvbSwgJ3YtbW9kYWwtbGVhdmUnKTtcbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAobW9kYWxTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpZiAobW9kYWxEb20ucGFyZW50Tm9kZSkgbW9kYWxEb20ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtb2RhbERvbSk7XG4gICAgICAgICAgbW9kYWxEb20uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBQb3B1cE1hbmFnZXIubW9kYWxEb20gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlQ2xhc3MobW9kYWxEb20sICd2LW1vZGFsLWxlYXZlJyk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgZ2V0VG9wUG9wdXAgPSBmdW5jdGlvbigpIHtcbiAgaWYgKFZ1ZS5wcm90b3R5cGUuJGlzU2VydmVyKSByZXR1cm47XG4gIGlmIChQb3B1cE1hbmFnZXIubW9kYWxTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgdG9wUG9wdXAgPSBQb3B1cE1hbmFnZXIubW9kYWxTdGFja1tQb3B1cE1hbmFnZXIubW9kYWxTdGFjay5sZW5ndGggLSAxXTtcbiAgICBpZiAoIXRvcFBvcHVwKSByZXR1cm47XG4gICAgY29uc3QgaW5zdGFuY2UgPSBQb3B1cE1hbmFnZXIuZ2V0SW5zdGFuY2UodG9wUG9wdXAuaWQpO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG59O1xuXG5pZiAoIVZ1ZS5wcm90b3R5cGUuJGlzU2VydmVyKSB7XG4gIC8vIGhhbmRsZSBgZXNjYCBrZXkgd2hlbiB0aGUgcG9wdXAgaXMgc2hvd25cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuICAgICAgY29uc3QgdG9wUG9wdXAgPSBnZXRUb3BQb3B1cCgpO1xuXG4gICAgICBpZiAodG9wUG9wdXAgJiYgdG9wUG9wdXAuY2xvc2VPblByZXNzRXNjYXBlKSB7XG4gICAgICAgIHRvcFBvcHVwLmhhbmRsZUNsb3NlXG4gICAgICAgICAgPyB0b3BQb3B1cC5oYW5kbGVDbG9zZSgpXG4gICAgICAgICAgOiAodG9wUG9wdXAuaGFuZGxlQWN0aW9uID8gdG9wUG9wdXAuaGFuZGxlQWN0aW9uKCdjYW5jZWwnKSA6IHRvcFBvcHVwLmNsb3NlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8ga2VlcCBmb2N1c2luZyBpbnNpZGUgdGhlIHBvcHVwIGJ5IGB0YWJgIGtleVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBjb25zdCB0b3BQb3B1cCA9IGdldFRvcFBvcHVwKCk7XG5cbiAgICBpZiAodG9wUG9wdXAgJiYgIXRvcFBvcHVwLiRlbC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRvcFBvcHVwLiRlbC5mb2N1cygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvcHVwTWFuYWdlcjtcbiJdfQ==
