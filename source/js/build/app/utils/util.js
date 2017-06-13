define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasOwn = hasOwn;
  exports.toObject = toObject;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  };

  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy91dGlsLmpzIl0sIm5hbWVzIjpbImhhc093biIsInRvT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJvYmoiLCJrZXkiLCJjYWxsIiwiZXh0ZW5kIiwidG8iLCJfZnJvbSIsImFyciIsInJlcyIsImkiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7OztVQUNnQkEsTSxHQUFBQSxNO1VBV0FDLFEsR0FBQUEsUTtBQVpoQixNQUFNQyxpQkFBaUJDLE9BQU9DLFNBQVAsQ0FBaUJGLGNBQXhDO0FBQ08sV0FBU0YsTUFBVCxDQUFnQkssR0FBaEIsRUFBcUJDLEdBQXJCLEVBQTBCO0FBQy9CLFdBQU9KLGVBQWVLLElBQWYsQ0FBb0JGLEdBQXBCLEVBQXlCQyxHQUF6QixDQUFQO0FBQ0Q7O0FBRUQsV0FBU0UsTUFBVCxDQUFnQkMsRUFBaEIsRUFBb0JDLEtBQXBCLEVBQTJCO0FBQ3pCLFNBQUssSUFBSUosR0FBVCxJQUFnQkksS0FBaEIsRUFBdUI7QUFDckJELFNBQUdILEdBQUgsSUFBVUksTUFBTUosR0FBTixDQUFWO0FBQ0Q7QUFDRCxXQUFPRyxFQUFQO0FBQ0Q7O0FBRU0sV0FBU1IsUUFBVCxDQUFrQlUsR0FBbEIsRUFBdUI7QUFDNUIsUUFBSUMsTUFBTSxFQUFWO0FBQ0EsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLElBQUlHLE1BQXhCLEVBQWdDRCxHQUFoQyxFQUFxQztBQUNuQyxVQUFJRixJQUFJRSxDQUFKLENBQUosRUFBWTtBQUNWTCxlQUFPSSxHQUFQLEVBQVlELElBQUlFLENBQUosQ0FBWjtBQUNEO0FBQ0Y7QUFDRCxXQUFPRCxHQUFQO0FBQ0QiLCJmaWxlIjoiYXBwL3V0aWxzL3V0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5leHBvcnQgZnVuY3Rpb24gaGFzT3duKG9iaiwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIGV4dGVuZCh0bywgX2Zyb20pIHtcbiAgZm9yIChsZXQga2V5IGluIF9mcm9tKSB7XG4gICAgdG9ba2V5XSA9IF9mcm9tW2tleV07XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JqZWN0KGFycikge1xuICB2YXIgcmVzID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGFycltpXSkge1xuICAgICAgZXh0ZW5kKHJlcywgYXJyW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iXX0=
