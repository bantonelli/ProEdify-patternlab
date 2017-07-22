define(['exports', './util'], function (exports, _util) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy92ZG9tLmpzIl0sIm5hbWVzIjpbImlzVk5vZGUiLCJnZXRGaXJzdENvbXBvbmVudENoaWxkIiwibm9kZSIsImNoaWxkcmVuIiwiZmlsdGVyIiwiYyIsInRhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1VBRWdCQSxPLEdBQUFBLE87VUFJQUMsc0IsR0FBQUEsc0I7Ozs7Ozs7O0FBSlQsV0FBU0QsT0FBVCxDQUFpQkUsSUFBakIsRUFBdUI7QUFDNUIsV0FBTyxRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWhCLElBQTRCLGtCQUFPQSxJQUFQLEVBQWEsa0JBQWIsQ0FBbkM7QUFDRDs7QUFFTSxXQUFTRCxzQkFBVCxDQUFnQ0UsUUFBaEMsRUFBMEM7QUFDL0MsV0FBT0EsWUFBWUEsU0FBU0MsTUFBVCxDQUFnQjtBQUFBLGFBQUtDLEtBQUtBLEVBQUVDLEdBQVo7QUFBQSxLQUFoQixFQUFpQyxDQUFqQyxDQUFuQjtBQUNEIiwiZmlsZSI6ImFwcC91dGlscy92ZG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFzT3duIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVk5vZGUobm9kZSkge1xuICByZXR1cm4gdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIGhhc093bihub2RlLCAnY29tcG9uZW50T3B0aW9ucycpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpcnN0Q29tcG9uZW50Q2hpbGQoY2hpbGRyZW4pIHtcbiAgcmV0dXJuIGNoaWxkcmVuICYmIGNoaWxkcmVuLmZpbHRlcihjID0+IGMgJiYgYy50YWcpWzBdO1xufTtcbiJdfQ==
