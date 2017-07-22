define(['exports', 'vue', './dom'], function (exports, _vue, _dom) {
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

  var nodeList = [];
  var ctx = '@@clickoutsideContext';

  var startClick = void 0;

  !_vue2.default.prototype.$isServer && (0, _dom.on)(document, 'mousedown', function (e) {
    return startClick = e;
  });

  !_vue2.default.prototype.$isServer && (0, _dom.on)(document, 'mouseup', function (e) {
    nodeList.forEach(function (node) {
      return node[ctx].documentHandler(e, startClick);
    });
  });
  /**
   * v-clickoutside
   * @desc 点击元素外面才会触发的事件
   * @example
   * ```vue
   * <div v-element-clickoutside="handleClose">
   * ```
   */
  exports.default = {
    bind: function bind(el, binding, vnode) {
      var id = nodeList.push(el) - 1;
      var documentHandler = function documentHandler(mouseup, mousedown) {
        if (!vnode.context || el.contains(mouseup.target) || vnode.context.popperElm && (vnode.context.popperElm.contains(mouseup.target) || vnode.context.popperElm.contains(mousedown.target))) return;

        if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
          vnode.context[el[ctx].methodName]();
        } else {
          el[ctx].bindingFn && el[ctx].bindingFn();
        }
      };
      el[ctx] = {
        id: id,
        documentHandler: documentHandler,
        methodName: binding.expression,
        bindingFn: binding.value
      };
    },
    update: function update(el, binding) {
      el[ctx].methodName = binding.expression;
      el[ctx].bindingFn = binding.value;
    },
    unbind: function unbind(el) {
      var len = nodeList.length;

      for (var i = 0; i < len; i++) {
        if (nodeList[i][ctx].id === el[ctx].id) {
          nodeList.splice(i, 1);
          break;
        }
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9jbGlja291dHNpZGUuanMiXSwibmFtZXMiOlsibm9kZUxpc3QiLCJjdHgiLCJzdGFydENsaWNrIiwicHJvdG90eXBlIiwiJGlzU2VydmVyIiwiZG9jdW1lbnQiLCJlIiwiZm9yRWFjaCIsIm5vZGUiLCJkb2N1bWVudEhhbmRsZXIiLCJiaW5kIiwiZWwiLCJiaW5kaW5nIiwidm5vZGUiLCJpZCIsInB1c2giLCJtb3VzZXVwIiwibW91c2Vkb3duIiwiY29udGV4dCIsImNvbnRhaW5zIiwidGFyZ2V0IiwicG9wcGVyRWxtIiwiZXhwcmVzc2lvbiIsIm1ldGhvZE5hbWUiLCJiaW5kaW5nRm4iLCJ2YWx1ZSIsInVwZGF0ZSIsInVuYmluZCIsImxlbiIsImxlbmd0aCIsImkiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLFdBQVcsRUFBakI7QUFDQSxNQUFNQyxNQUFNLHVCQUFaOztBQUVBLE1BQUlDLG1CQUFKOztBQUVBLEdBQUMsY0FBSUMsU0FBSixDQUFjQyxTQUFmLElBQTRCLGFBQUdDLFFBQUgsRUFBYSxXQUFiLEVBQTBCO0FBQUEsV0FBTUgsYUFBYUksQ0FBbkI7QUFBQSxHQUExQixDQUE1Qjs7QUFFQSxHQUFDLGNBQUlILFNBQUosQ0FBY0MsU0FBZixJQUE0QixhQUFHQyxRQUFILEVBQWEsU0FBYixFQUF3QixhQUFLO0FBQ3ZETCxhQUFTTyxPQUFULENBQWlCO0FBQUEsYUFBUUMsS0FBS1AsR0FBTCxFQUFVUSxlQUFWLENBQTBCSCxDQUExQixFQUE2QkosVUFBN0IsQ0FBUjtBQUFBLEtBQWpCO0FBQ0QsR0FGMkIsQ0FBNUI7QUFHQTs7Ozs7Ozs7b0JBUWU7QUFDYlEsUUFEYSxnQkFDUkMsRUFEUSxFQUNKQyxPQURJLEVBQ0tDLEtBREwsRUFDWTtBQUN2QixVQUFNQyxLQUFLZCxTQUFTZSxJQUFULENBQWNKLEVBQWQsSUFBb0IsQ0FBL0I7QUFDQSxVQUFNRixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVNPLE9BQVQsRUFBa0JDLFNBQWxCLEVBQTZCO0FBQ25ELFlBQUksQ0FBQ0osTUFBTUssT0FBUCxJQUNGUCxHQUFHUSxRQUFILENBQVlILFFBQVFJLE1BQXBCLENBREUsSUFFRFAsTUFBTUssT0FBTixDQUFjRyxTQUFkLEtBQ0FSLE1BQU1LLE9BQU4sQ0FBY0csU0FBZCxDQUF3QkYsUUFBeEIsQ0FBaUNILFFBQVFJLE1BQXpDLEtBQ0RQLE1BQU1LLE9BQU4sQ0FBY0csU0FBZCxDQUF3QkYsUUFBeEIsQ0FBaUNGLFVBQVVHLE1BQTNDLENBRkMsQ0FGSCxFQUl3RDs7QUFFeEQsWUFBSVIsUUFBUVUsVUFBUixJQUNGWCxHQUFHVixHQUFILEVBQVFzQixVQUROLElBRUZWLE1BQU1LLE9BQU4sQ0FBY1AsR0FBR1YsR0FBSCxFQUFRc0IsVUFBdEIsQ0FGRixFQUVxQztBQUNuQ1YsZ0JBQU1LLE9BQU4sQ0FBY1AsR0FBR1YsR0FBSCxFQUFRc0IsVUFBdEI7QUFDRCxTQUpELE1BSU87QUFDTFosYUFBR1YsR0FBSCxFQUFRdUIsU0FBUixJQUFxQmIsR0FBR1YsR0FBSCxFQUFRdUIsU0FBUixFQUFyQjtBQUNEO0FBQ0YsT0FkRDtBQWVBYixTQUFHVixHQUFILElBQVU7QUFDUmEsY0FEUTtBQUVSTCx3Q0FGUTtBQUdSYyxvQkFBWVgsUUFBUVUsVUFIWjtBQUlSRSxtQkFBV1osUUFBUWE7QUFKWCxPQUFWO0FBTUQsS0F4Qlk7QUEwQmJDLFVBMUJhLGtCQTBCTmYsRUExQk0sRUEwQkZDLE9BMUJFLEVBMEJPO0FBQ2xCRCxTQUFHVixHQUFILEVBQVFzQixVQUFSLEdBQXFCWCxRQUFRVSxVQUE3QjtBQUNBWCxTQUFHVixHQUFILEVBQVF1QixTQUFSLEdBQW9CWixRQUFRYSxLQUE1QjtBQUNELEtBN0JZO0FBK0JiRSxVQS9CYSxrQkErQk5oQixFQS9CTSxFQStCRjtBQUNULFVBQUlpQixNQUFNNUIsU0FBUzZCLE1BQW5COztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixHQUFwQixFQUF5QkUsR0FBekIsRUFBOEI7QUFDNUIsWUFBSTlCLFNBQVM4QixDQUFULEVBQVk3QixHQUFaLEVBQWlCYSxFQUFqQixLQUF3QkgsR0FBR1YsR0FBSCxFQUFRYSxFQUFwQyxFQUF3QztBQUN0Q2QsbUJBQVMrQixNQUFULENBQWdCRCxDQUFoQixFQUFtQixDQUFuQjtBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBeENZLEciLCJmaWxlIjoiYXBwL3V0aWxzL2NsaWNrb3V0c2lkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCB7IG9uIH0gZnJvbSAnLi9kb20nO1xuXG5jb25zdCBub2RlTGlzdCA9IFtdO1xuY29uc3QgY3R4ID0gJ0BAY2xpY2tvdXRzaWRlQ29udGV4dCc7XG5cbmxldCBzdGFydENsaWNrO1xuXG4hVnVlLnByb3RvdHlwZS4kaXNTZXJ2ZXIgJiYgb24oZG9jdW1lbnQsICdtb3VzZWRvd24nLCBlID0+IChzdGFydENsaWNrID0gZSkpO1xuXG4hVnVlLnByb3RvdHlwZS4kaXNTZXJ2ZXIgJiYgb24oZG9jdW1lbnQsICdtb3VzZXVwJywgZSA9PiB7XG4gIG5vZGVMaXN0LmZvckVhY2gobm9kZSA9PiBub2RlW2N0eF0uZG9jdW1lbnRIYW5kbGVyKGUsIHN0YXJ0Q2xpY2spKTtcbn0pO1xuLyoqXG4gKiB2LWNsaWNrb3V0c2lkZVxuICogQGRlc2Mg54K55Ye75YWD57Sg5aSW6Z2i5omN5Lya6Kem5Y+R55qE5LqL5Lu2XG4gKiBAZXhhbXBsZVxuICogYGBgdnVlXG4gKiA8ZGl2IHYtZWxlbWVudC1jbGlja291dHNpZGU9XCJoYW5kbGVDbG9zZVwiPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYmluZChlbCwgYmluZGluZywgdm5vZGUpIHtcbiAgICBjb25zdCBpZCA9IG5vZGVMaXN0LnB1c2goZWwpIC0gMTtcbiAgICBjb25zdCBkb2N1bWVudEhhbmRsZXIgPSBmdW5jdGlvbihtb3VzZXVwLCBtb3VzZWRvd24pIHtcbiAgICAgIGlmICghdm5vZGUuY29udGV4dCB8fFxuICAgICAgICBlbC5jb250YWlucyhtb3VzZXVwLnRhcmdldCkgfHxcbiAgICAgICAgKHZub2RlLmNvbnRleHQucG9wcGVyRWxtICYmXG4gICAgICAgICh2bm9kZS5jb250ZXh0LnBvcHBlckVsbS5jb250YWlucyhtb3VzZXVwLnRhcmdldCkgfHxcbiAgICAgICAgdm5vZGUuY29udGV4dC5wb3BwZXJFbG0uY29udGFpbnMobW91c2Vkb3duLnRhcmdldCkpKSkgcmV0dXJuO1xuXG4gICAgICBpZiAoYmluZGluZy5leHByZXNzaW9uICYmXG4gICAgICAgIGVsW2N0eF0ubWV0aG9kTmFtZSAmJlxuICAgICAgICB2bm9kZS5jb250ZXh0W2VsW2N0eF0ubWV0aG9kTmFtZV0pIHtcbiAgICAgICAgdm5vZGUuY29udGV4dFtlbFtjdHhdLm1ldGhvZE5hbWVdKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbFtjdHhdLmJpbmRpbmdGbiAmJiBlbFtjdHhdLmJpbmRpbmdGbigpO1xuICAgICAgfVxuICAgIH07XG4gICAgZWxbY3R4XSA9IHtcbiAgICAgIGlkLFxuICAgICAgZG9jdW1lbnRIYW5kbGVyLFxuICAgICAgbWV0aG9kTmFtZTogYmluZGluZy5leHByZXNzaW9uLFxuICAgICAgYmluZGluZ0ZuOiBiaW5kaW5nLnZhbHVlXG4gICAgfTtcbiAgfSxcblxuICB1cGRhdGUoZWwsIGJpbmRpbmcpIHtcbiAgICBlbFtjdHhdLm1ldGhvZE5hbWUgPSBiaW5kaW5nLmV4cHJlc3Npb247XG4gICAgZWxbY3R4XS5iaW5kaW5nRm4gPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuXG4gIHVuYmluZChlbCkge1xuICAgIGxldCBsZW4gPSBub2RlTGlzdC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAobm9kZUxpc3RbaV1bY3R4XS5pZCA9PT0gZWxbY3R4XS5pZCkge1xuICAgICAgICBub2RlTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
