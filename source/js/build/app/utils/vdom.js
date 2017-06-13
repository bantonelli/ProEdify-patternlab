define(['exports', 'element-ui/src/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isVNode = isVNode;
  exports.getFirstComponentChild = getFirstComponentChild;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function isVNode(node) {
    return (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && (0, _util.hasOwn)(node, 'componentOptions');
  };

  function getFirstComponentChild(children) {
    return children && children.filter(function (c) {
      return c && c.tag;
    })[0];
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92ZG9tLmpzIl0sIm5hbWVzIjpbImlzVk5vZGUiLCJnZXRGaXJzdENvbXBvbmVudENoaWxkIiwibm9kZSIsImNoaWxkcmVuIiwiZmlsdGVyIiwiYyIsInRhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1VBRWdCQSxPLEdBQUFBLE87VUFJQUMsc0IsR0FBQUEsc0I7Ozs7Ozs7O0FBSlQsV0FBU0QsT0FBVCxDQUFpQkUsSUFBakIsRUFBdUI7QUFDNUIsV0FBTyxRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWhCLElBQTRCLGtCQUFPQSxJQUFQLEVBQWEsa0JBQWIsQ0FBbkM7QUFDRDs7QUFFTSxXQUFTRCxzQkFBVCxDQUFnQ0UsUUFBaEMsRUFBMEM7QUFDL0MsV0FBT0EsWUFBWUEsU0FBU0MsTUFBVCxDQUFnQjtBQUFBLGFBQUtDLEtBQUtBLEVBQUVDLEdBQVo7QUFBQSxLQUFoQixFQUFpQyxDQUFqQyxDQUFuQjtBQUNEIiwiZmlsZSI6ImFwcC91dGlscy92ZG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFzT3duIH0gZnJvbSAnZWxlbWVudC11aS9zcmMvdXRpbHMvdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZOb2RlKG5vZGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBoYXNPd24obm9kZSwgJ2NvbXBvbmVudE9wdGlvbnMnKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJzdENvbXBvbmVudENoaWxkKGNoaWxkcmVuKSB7XG4gIHJldHVybiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5maWx0ZXIoYyA9PiBjICYmIGMudGFnKVswXTtcbn07XG4iXX0=
