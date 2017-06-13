define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
      var source = arguments[i] || {};
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var value = source[prop];
          if (value !== undefined) {
            target[prop] = value;
          }
        }
      }
    }

    return target;
  };

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9tZXJnZS5qcyJdLCJuYW1lcyI6WyJ0YXJnZXQiLCJpIiwiaiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsInZhbHVlIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O29CQUFlLFVBQVNBLE1BQVQsRUFBaUI7QUFDOUIsU0FBSyxJQUFJQyxJQUFJLENBQVIsRUFBV0MsSUFBSUMsVUFBVUMsTUFBOUIsRUFBc0NILElBQUlDLENBQTFDLEVBQTZDRCxHQUE3QyxFQUFrRDtBQUNoRCxVQUFJSSxTQUFTRixVQUFVRixDQUFWLEtBQWdCLEVBQTdCO0FBQ0EsV0FBSyxJQUFJSyxJQUFULElBQWlCRCxNQUFqQixFQUF5QjtBQUN2QixZQUFJQSxPQUFPRSxjQUFQLENBQXNCRCxJQUF0QixDQUFKLEVBQWlDO0FBQy9CLGNBQUlFLFFBQVFILE9BQU9DLElBQVAsQ0FBWjtBQUNBLGNBQUlFLFVBQVVDLFNBQWQsRUFBeUI7QUFDdkJULG1CQUFPTSxJQUFQLElBQWVFLEtBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxXQUFPUixNQUFQO0FBQ0QsRzs7QUFBQSIsImZpbGUiOiJhcHAvdXRpbHMvbWVyZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0YXJnZXQpIHtcbiAgZm9yIChsZXQgaSA9IDEsIGogPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgbGV0IHNvdXJjZSA9IGFyZ3VtZW50c1tpXSB8fCB7fTtcbiAgICBmb3IgKGxldCBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiJdfQ==
