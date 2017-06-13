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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9jbGlja291dHNpZGUuanMiXSwibmFtZXMiOlsibm9kZUxpc3QiLCJjdHgiLCJzdGFydENsaWNrIiwicHJvdG90eXBlIiwiJGlzU2VydmVyIiwiZG9jdW1lbnQiLCJlIiwiZm9yRWFjaCIsIm5vZGUiLCJkb2N1bWVudEhhbmRsZXIiLCJiaW5kIiwiZWwiLCJiaW5kaW5nIiwidm5vZGUiLCJpZCIsInB1c2giLCJtb3VzZXVwIiwibW91c2Vkb3duIiwiY29udGV4dCIsImNvbnRhaW5zIiwidGFyZ2V0IiwicG9wcGVyRWxtIiwiZXhwcmVzc2lvbiIsIm1ldGhvZE5hbWUiLCJiaW5kaW5nRm4iLCJ2YWx1ZSIsInVwZGF0ZSIsInVuYmluZCIsImxlbiIsImxlbmd0aCIsImkiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLFdBQVcsRUFBakI7QUFDQSxNQUFNQyxNQUFNLHVCQUFaOztBQUVBLE1BQUlDLG1CQUFKOztBQUVBLEdBQUMsY0FBSUMsU0FBSixDQUFjQyxTQUFmLElBQTRCLGFBQUdDLFFBQUgsRUFBYSxXQUFiLEVBQTBCO0FBQUEsV0FBTUgsYUFBYUksQ0FBbkI7QUFBQSxHQUExQixDQUE1Qjs7QUFFQSxHQUFDLGNBQUlILFNBQUosQ0FBY0MsU0FBZixJQUE0QixhQUFHQyxRQUFILEVBQWEsU0FBYixFQUF3QixhQUFLO0FBQ3ZETCxhQUFTTyxPQUFULENBQWlCO0FBQUEsYUFBUUMsS0FBS1AsR0FBTCxFQUFVUSxlQUFWLENBQTBCSCxDQUExQixFQUE2QkosVUFBN0IsQ0FBUjtBQUFBLEtBQWpCO0FBQ0QsR0FGMkIsQ0FBNUI7QUFHQTs7Ozs7Ozs7b0JBUWU7QUFDYlEsUUFEYSxnQkFDUkMsRUFEUSxFQUNKQyxPQURJLEVBQ0tDLEtBREwsRUFDWTtBQUN2QixVQUFNQyxLQUFLZCxTQUFTZSxJQUFULENBQWNKLEVBQWQsSUFBb0IsQ0FBL0I7QUFDQSxVQUFNRixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVNPLE9BQVQsRUFBa0JDLFNBQWxCLEVBQTZCO0FBQ25ELFlBQUksQ0FBQ0osTUFBTUssT0FBUCxJQUNGUCxHQUFHUSxRQUFILENBQVlILFFBQVFJLE1BQXBCLENBREUsSUFFRFAsTUFBTUssT0FBTixDQUFjRyxTQUFkLEtBQ0FSLE1BQU1LLE9BQU4sQ0FBY0csU0FBZCxDQUF3QkYsUUFBeEIsQ0FBaUNILFFBQVFJLE1BQXpDLEtBQ0RQLE1BQU1LLE9BQU4sQ0FBY0csU0FBZCxDQUF3QkYsUUFBeEIsQ0FBaUNGLFVBQVVHLE1BQTNDLENBRkMsQ0FGSCxFQUl3RDs7QUFFeEQsWUFBSVIsUUFBUVUsVUFBUixJQUNGWCxHQUFHVixHQUFILEVBQVFzQixVQUROLElBRUZWLE1BQU1LLE9BQU4sQ0FBY1AsR0FBR1YsR0FBSCxFQUFRc0IsVUFBdEIsQ0FGRixFQUVxQztBQUNuQ1YsZ0JBQU1LLE9BQU4sQ0FBY1AsR0FBR1YsR0FBSCxFQUFRc0IsVUFBdEI7QUFDRCxTQUpELE1BSU87QUFDTFosYUFBR1YsR0FBSCxFQUFRdUIsU0FBUixJQUFxQmIsR0FBR1YsR0FBSCxFQUFRdUIsU0FBUixFQUFyQjtBQUNEO0FBQ0YsT0FkRDtBQWVBYixTQUFHVixHQUFILElBQVU7QUFDUmEsY0FEUTtBQUVSTCx3Q0FGUTtBQUdSYyxvQkFBWVgsUUFBUVUsVUFIWjtBQUlSRSxtQkFBV1osUUFBUWE7QUFKWCxPQUFWO0FBTUQsS0F4Qlk7QUEwQmJDLFVBMUJhLGtCQTBCTmYsRUExQk0sRUEwQkZDLE9BMUJFLEVBMEJPO0FBQ2xCRCxTQUFHVixHQUFILEVBQVFzQixVQUFSLEdBQXFCWCxRQUFRVSxVQUE3QjtBQUNBWCxTQUFHVixHQUFILEVBQVF1QixTQUFSLEdBQW9CWixRQUFRYSxLQUE1QjtBQUNELEtBN0JZO0FBK0JiRSxVQS9CYSxrQkErQk5oQixFQS9CTSxFQStCRjtBQUNULFVBQUlpQixNQUFNNUIsU0FBUzZCLE1BQW5COztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixHQUFwQixFQUF5QkUsR0FBekIsRUFBOEI7QUFDNUIsWUFBSTlCLFNBQVM4QixDQUFULEVBQVk3QixHQUFaLEVBQWlCYSxFQUFqQixLQUF3QkgsR0FBR1YsR0FBSCxFQUFRYSxFQUFwQyxFQUF3QztBQUN0Q2QsbUJBQVMrQixNQUFULENBQWdCRCxDQUFoQixFQUFtQixDQUFuQjtBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBeENZLEciLCJmaWxlIjoiYXBwL3V0aWxzL2NsaWNrb3V0c2lkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCB7IG9uIH0gZnJvbSAnZWxlbWVudC11aS9zcmMvdXRpbHMvZG9tJztcblxuY29uc3Qgbm9kZUxpc3QgPSBbXTtcbmNvbnN0IGN0eCA9ICdAQGNsaWNrb3V0c2lkZUNvbnRleHQnO1xuXG5sZXQgc3RhcnRDbGljaztcblxuIVZ1ZS5wcm90b3R5cGUuJGlzU2VydmVyICYmIG9uKGRvY3VtZW50LCAnbW91c2Vkb3duJywgZSA9PiAoc3RhcnRDbGljayA9IGUpKTtcblxuIVZ1ZS5wcm90b3R5cGUuJGlzU2VydmVyICYmIG9uKGRvY3VtZW50LCAnbW91c2V1cCcsIGUgPT4ge1xuICBub2RlTGlzdC5mb3JFYWNoKG5vZGUgPT4gbm9kZVtjdHhdLmRvY3VtZW50SGFuZGxlcihlLCBzdGFydENsaWNrKSk7XG59KTtcbi8qKlxuICogdi1jbGlja291dHNpZGVcbiAqIEBkZXNjIOeCueWHu+WFg+e0oOWklumdouaJjeS8muinpuWPkeeahOS6i+S7tlxuICogQGV4YW1wbGVcbiAqIGBgYHZ1ZVxuICogPGRpdiB2LWVsZW1lbnQtY2xpY2tvdXRzaWRlPVwiaGFuZGxlQ2xvc2VcIj5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIGJpbmQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgY29uc3QgaWQgPSBub2RlTGlzdC5wdXNoKGVsKSAtIDE7XG4gICAgY29uc3QgZG9jdW1lbnRIYW5kbGVyID0gZnVuY3Rpb24obW91c2V1cCwgbW91c2Vkb3duKSB7XG4gICAgICBpZiAoIXZub2RlLmNvbnRleHQgfHxcbiAgICAgICAgZWwuY29udGFpbnMobW91c2V1cC50YXJnZXQpIHx8XG4gICAgICAgICh2bm9kZS5jb250ZXh0LnBvcHBlckVsbSAmJlxuICAgICAgICAodm5vZGUuY29udGV4dC5wb3BwZXJFbG0uY29udGFpbnMobW91c2V1cC50YXJnZXQpIHx8XG4gICAgICAgIHZub2RlLmNvbnRleHQucG9wcGVyRWxtLmNvbnRhaW5zKG1vdXNlZG93bi50YXJnZXQpKSkpIHJldHVybjtcblxuICAgICAgaWYgKGJpbmRpbmcuZXhwcmVzc2lvbiAmJlxuICAgICAgICBlbFtjdHhdLm1ldGhvZE5hbWUgJiZcbiAgICAgICAgdm5vZGUuY29udGV4dFtlbFtjdHhdLm1ldGhvZE5hbWVdKSB7XG4gICAgICAgIHZub2RlLmNvbnRleHRbZWxbY3R4XS5tZXRob2ROYW1lXSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxbY3R4XS5iaW5kaW5nRm4gJiYgZWxbY3R4XS5iaW5kaW5nRm4oKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGVsW2N0eF0gPSB7XG4gICAgICBpZCxcbiAgICAgIGRvY3VtZW50SGFuZGxlcixcbiAgICAgIG1ldGhvZE5hbWU6IGJpbmRpbmcuZXhwcmVzc2lvbixcbiAgICAgIGJpbmRpbmdGbjogYmluZGluZy52YWx1ZVxuICAgIH07XG4gIH0sXG5cbiAgdXBkYXRlKGVsLCBiaW5kaW5nKSB7XG4gICAgZWxbY3R4XS5tZXRob2ROYW1lID0gYmluZGluZy5leHByZXNzaW9uO1xuICAgIGVsW2N0eF0uYmluZGluZ0ZuID0gYmluZGluZy52YWx1ZTtcbiAgfSxcblxuICB1bmJpbmQoZWwpIHtcbiAgICBsZXQgbGVuID0gbm9kZUxpc3QubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKG5vZGVMaXN0W2ldW2N0eF0uaWQgPT09IGVsW2N0eF0uaWQpIHtcbiAgICAgICAgbm9kZUxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iXX0=
