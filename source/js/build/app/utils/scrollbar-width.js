define(['exports', 'vue'], function (exports, _vue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    if (_vue2.default.prototype.$isServer) return 0;
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    var outer = document.createElement('div');
    outer.className = 'el-scrollbar__wrap';
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  };

  var _vue2 = _interopRequireDefault(_vue);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var scrollBarWidth = void 0;

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9zY3JvbGxiYXItd2lkdGguanMiXSwibmFtZXMiOlsicHJvdG90eXBlIiwiJGlzU2VydmVyIiwic2Nyb2xsQmFyV2lkdGgiLCJ1bmRlZmluZWQiLCJvdXRlciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsIndpZHRoIiwicG9zaXRpb24iLCJ0b3AiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJ3aWR0aE5vU2Nyb2xsIiwib2Zmc2V0V2lkdGgiLCJvdmVyZmxvdyIsImlubmVyIiwid2lkdGhXaXRoU2Nyb2xsIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O29CQUllLFlBQVc7QUFDeEIsUUFBSSxjQUFJQSxTQUFKLENBQWNDLFNBQWxCLEVBQTZCLE9BQU8sQ0FBUDtBQUM3QixRQUFJQyxtQkFBbUJDLFNBQXZCLEVBQWtDLE9BQU9ELGNBQVA7O0FBRWxDLFFBQU1FLFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBRixVQUFNRyxTQUFOLEdBQWtCLG9CQUFsQjtBQUNBSCxVQUFNSSxLQUFOLENBQVlDLFVBQVosR0FBeUIsUUFBekI7QUFDQUwsVUFBTUksS0FBTixDQUFZRSxLQUFaLEdBQW9CLE9BQXBCO0FBQ0FOLFVBQU1JLEtBQU4sQ0FBWUcsUUFBWixHQUF1QixVQUF2QjtBQUNBUCxVQUFNSSxLQUFOLENBQVlJLEdBQVosR0FBa0IsU0FBbEI7QUFDQVAsYUFBU1EsSUFBVCxDQUFjQyxXQUFkLENBQTBCVixLQUExQjs7QUFFQSxRQUFNVyxnQkFBZ0JYLE1BQU1ZLFdBQTVCO0FBQ0FaLFVBQU1JLEtBQU4sQ0FBWVMsUUFBWixHQUF1QixRQUF2Qjs7QUFFQSxRQUFNQyxRQUFRYixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWQ7QUFDQVksVUFBTVYsS0FBTixDQUFZRSxLQUFaLEdBQW9CLE1BQXBCO0FBQ0FOLFVBQU1VLFdBQU4sQ0FBa0JJLEtBQWxCOztBQUVBLFFBQU1DLGtCQUFrQkQsTUFBTUYsV0FBOUI7QUFDQVosVUFBTWdCLFVBQU4sQ0FBaUJDLFdBQWpCLENBQTZCakIsS0FBN0I7O0FBRUEsV0FBT1csZ0JBQWdCSSxlQUF2QjtBQUNELEc7Ozs7Ozs7Ozs7QUF6QkQsTUFBSWpCLHVCQUFKOztBQXlCQyIsImZpbGUiOiJhcHAvdXRpbHMvc2Nyb2xsYmFyLXdpZHRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnO1xuXG5sZXQgc2Nyb2xsQmFyV2lkdGg7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBpZiAoVnVlLnByb3RvdHlwZS4kaXNTZXJ2ZXIpIHJldHVybiAwO1xuICBpZiAoc2Nyb2xsQmFyV2lkdGggIT09IHVuZGVmaW5lZCkgcmV0dXJuIHNjcm9sbEJhcldpZHRoO1xuXG4gIGNvbnN0IG91dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIG91dGVyLmNsYXNzTmFtZSA9ICdlbC1zY3JvbGxiYXJfX3dyYXAnO1xuICBvdXRlci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gIG91dGVyLnN0eWxlLndpZHRoID0gJzEwMHB4JztcbiAgb3V0ZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBvdXRlci5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3V0ZXIpO1xuXG4gIGNvbnN0IHdpZHRoTm9TY3JvbGwgPSBvdXRlci5vZmZzZXRXaWR0aDtcbiAgb3V0ZXIuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcblxuICBjb25zdCBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBpbm5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgb3V0ZXIuYXBwZW5kQ2hpbGQoaW5uZXIpO1xuXG4gIGNvbnN0IHdpZHRoV2l0aFNjcm9sbCA9IGlubmVyLm9mZnNldFdpZHRoO1xuICBvdXRlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG91dGVyKTtcblxuICByZXR1cm4gd2lkdGhOb1Njcm9sbCAtIHdpZHRoV2l0aFNjcm9sbDtcbn07XG4iXX0=
