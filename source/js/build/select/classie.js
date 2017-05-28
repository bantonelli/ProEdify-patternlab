define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /*!
   * classie - class helper functions
   * from bonzo https://github.com/ded/bonzo
   * 
   * classie.has( elem, 'my-class' ) -> true/false
   * classie.add( elem, 'my-new-class' )
   * classie.remove( elem, 'my-unwanted-class' )
   * classie.toggle( elem, 'my-class' )
   */

  /*jshint browser: true, strict: true, undef: true */
  /*global define: false */

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ('classList' in document.documentElement) {
    hasClass = function hasClass(elem, c) {
      return elem.classList.contains(c);
    };
    addClass = function addClass(elem, c) {
      elem.classList.add(c);
    };
    removeClass = function removeClass(elem, c) {
      elem.classList.remove(c);
    };
  } else {
    hasClass = function hasClass(elem, c) {
      return classReg(c).test(elem.className);
    };
    addClass = function addClass(elem, c) {
      if (!hasClass(elem, c)) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function removeClass(elem, c) {
      elem.className = elem.className.replace(classReg(c), ' ');
    };
  }

  function toggleClass(elem, c) {
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  exports.default = classie;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC9jbGFzc2llLmpzIl0sIm5hbWVzIjpbImNsYXNzUmVnIiwiY2xhc3NOYW1lIiwiUmVnRXhwIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJlbGVtIiwiYyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwicmVtb3ZlIiwidGVzdCIsInJlcGxhY2UiLCJ0b2dnbGVDbGFzcyIsImZuIiwiY2xhc3NpZSIsImhhcyIsInRvZ2dsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTtBQUNBOztBQUVBOztBQUVBLFdBQVNBLFFBQVQsQ0FBbUJDLFNBQW5CLEVBQStCO0FBQzdCLFdBQU8sSUFBSUMsTUFBSixDQUFXLGFBQWFELFNBQWIsR0FBeUIsVUFBcEMsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxNQUFJRSxRQUFKLEVBQWNDLFFBQWQsRUFBd0JDLFdBQXhCOztBQUVBLE1BQUssZUFBZUMsU0FBU0MsZUFBN0IsRUFBK0M7QUFDN0NKLGVBQVcsa0JBQVVLLElBQVYsRUFBZ0JDLENBQWhCLEVBQW9CO0FBQzdCLGFBQU9ELEtBQUtFLFNBQUwsQ0FBZUMsUUFBZixDQUF5QkYsQ0FBekIsQ0FBUDtBQUNELEtBRkQ7QUFHQUwsZUFBVyxrQkFBVUksSUFBVixFQUFnQkMsQ0FBaEIsRUFBb0I7QUFDN0JELFdBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFvQkgsQ0FBcEI7QUFDRCxLQUZEO0FBR0FKLGtCQUFjLHFCQUFVRyxJQUFWLEVBQWdCQyxDQUFoQixFQUFvQjtBQUNoQ0QsV0FBS0UsU0FBTCxDQUFlRyxNQUFmLENBQXVCSixDQUF2QjtBQUNELEtBRkQ7QUFHRCxHQVZELE1BV0s7QUFDSE4sZUFBVyxrQkFBVUssSUFBVixFQUFnQkMsQ0FBaEIsRUFBb0I7QUFDN0IsYUFBT1QsU0FBVVMsQ0FBVixFQUFjSyxJQUFkLENBQW9CTixLQUFLUCxTQUF6QixDQUFQO0FBQ0QsS0FGRDtBQUdBRyxlQUFXLGtCQUFVSSxJQUFWLEVBQWdCQyxDQUFoQixFQUFvQjtBQUM3QixVQUFLLENBQUNOLFNBQVVLLElBQVYsRUFBZ0JDLENBQWhCLENBQU4sRUFBNEI7QUFDMUJELGFBQUtQLFNBQUwsR0FBaUJPLEtBQUtQLFNBQUwsR0FBaUIsR0FBakIsR0FBdUJRLENBQXhDO0FBQ0Q7QUFDRixLQUpEO0FBS0FKLGtCQUFjLHFCQUFVRyxJQUFWLEVBQWdCQyxDQUFoQixFQUFvQjtBQUNoQ0QsV0FBS1AsU0FBTCxHQUFpQk8sS0FBS1AsU0FBTCxDQUFlYyxPQUFmLENBQXdCZixTQUFVUyxDQUFWLENBQXhCLEVBQXVDLEdBQXZDLENBQWpCO0FBQ0QsS0FGRDtBQUdEOztBQUVELFdBQVNPLFdBQVQsQ0FBc0JSLElBQXRCLEVBQTRCQyxDQUE1QixFQUFnQztBQUM5QixRQUFJUSxLQUFLZCxTQUFVSyxJQUFWLEVBQWdCQyxDQUFoQixJQUFzQkosV0FBdEIsR0FBb0NELFFBQTdDO0FBQ0FhLE9BQUlULElBQUosRUFBVUMsQ0FBVjtBQUNEOztBQUVELE1BQUlTLFVBQVU7QUFDWjtBQUNBZixjQUFVQSxRQUZFO0FBR1pDLGNBQVVBLFFBSEU7QUFJWkMsaUJBQWFBLFdBSkQ7QUFLWlcsaUJBQWFBLFdBTEQ7QUFNWjtBQUNBRyxTQUFLaEIsUUFQTztBQVFaUyxTQUFLUixRQVJPO0FBU1pTLFlBQVFSLFdBVEk7QUFVWmUsWUFBUUo7QUFWSSxHQUFkOztvQkFhZUUsTyIsImZpbGUiOiJzZWxlY3QvY2xhc3NpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogY2xhc3NpZSAtIGNsYXNzIGhlbHBlciBmdW5jdGlvbnNcbiAqIGZyb20gYm9uem8gaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib256b1xuICogXG4gKiBjbGFzc2llLmhhcyggZWxlbSwgJ215LWNsYXNzJyApIC0+IHRydWUvZmFsc2VcbiAqIGNsYXNzaWUuYWRkKCBlbGVtLCAnbXktbmV3LWNsYXNzJyApXG4gKiBjbGFzc2llLnJlbW92ZSggZWxlbSwgJ215LXVud2FudGVkLWNsYXNzJyApXG4gKiBjbGFzc2llLnRvZ2dsZSggZWxlbSwgJ215LWNsYXNzJyApXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCB1bmRlZjogdHJ1ZSAqL1xuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSAqL1xuXG4vLyBjbGFzcyBoZWxwZXIgZnVuY3Rpb25zIGZyb20gYm9uem8gaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib256b1xuXG5mdW5jdGlvbiBjbGFzc1JlZyggY2xhc3NOYW1lICkge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIihefFxcXFxzKylcIiArIGNsYXNzTmFtZSArIFwiKFxcXFxzK3wkKVwiKTtcbn1cblxuLy8gY2xhc3NMaXN0IHN1cHBvcnQgZm9yIGNsYXNzIG1hbmFnZW1lbnRcbi8vIGFsdGhvIHRvIGJlIGZhaXIsIHRoZSBhcGkgc3Vja3MgYmVjYXVzZSBpdCB3b24ndCBhY2NlcHQgbXVsdGlwbGUgY2xhc3NlcyBhdCBvbmNlXG52YXIgaGFzQ2xhc3MsIGFkZENsYXNzLCByZW1vdmVDbGFzcztcblxuaWYgKCAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgKSB7XG4gIGhhc0NsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgcmV0dXJuIGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCBjICk7XG4gIH07XG4gIGFkZENsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgZWxlbS5jbGFzc0xpc3QuYWRkKCBjICk7XG4gIH07XG4gIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCBjICk7XG4gIH07XG59XG5lbHNlIHtcbiAgaGFzQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICByZXR1cm4gY2xhc3NSZWcoIGMgKS50ZXN0KCBlbGVtLmNsYXNzTmFtZSApO1xuICB9O1xuICBhZGRDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIGlmICggIWhhc0NsYXNzKCBlbGVtLCBjICkgKSB7XG4gICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyAnICsgYztcbiAgICB9XG4gIH07XG4gIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKCBjbGFzc1JlZyggYyApLCAnICcgKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoIGVsZW0sIGMgKSB7XG4gIHZhciBmbiA9IGhhc0NsYXNzKCBlbGVtLCBjICkgPyByZW1vdmVDbGFzcyA6IGFkZENsYXNzO1xuICBmbiggZWxlbSwgYyApO1xufVxuXG52YXIgY2xhc3NpZSA9IHtcbiAgLy8gZnVsbCBuYW1lc1xuICBoYXNDbGFzczogaGFzQ2xhc3MsXG4gIGFkZENsYXNzOiBhZGRDbGFzcyxcbiAgcmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzLFxuICB0b2dnbGVDbGFzczogdG9nZ2xlQ2xhc3MsXG4gIC8vIHNob3J0IG5hbWVzXG4gIGhhczogaGFzQ2xhc3MsXG4gIGFkZDogYWRkQ2xhc3MsXG4gIHJlbW92ZTogcmVtb3ZlQ2xhc3MsXG4gIHRvZ2dsZTogdG9nZ2xlQ2xhc3Ncbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzaWU7Il19
