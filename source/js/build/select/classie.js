"use strict";

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

(function (window) {

  'use strict';

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

  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(classie);
  } else {
    // browser global
    window.classie = classie;
  }
})(window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC9jbGFzc2llLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImNsYXNzUmVnIiwiY2xhc3NOYW1lIiwiUmVnRXhwIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJlbGVtIiwiYyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwicmVtb3ZlIiwidGVzdCIsInJlcGxhY2UiLCJ0b2dnbGVDbGFzcyIsImZuIiwiY2xhc3NpZSIsImhhcyIsInRvZ2dsZSIsImRlZmluZSIsImFtZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBO0FBQ0E7O0FBRUEsQ0FBRSxVQUFVQSxNQUFWLEVBQW1COztBQUVyQjs7QUFFQTs7QUFFQSxXQUFTQyxRQUFULENBQW1CQyxTQUFuQixFQUErQjtBQUM3QixXQUFPLElBQUlDLE1BQUosQ0FBVyxhQUFhRCxTQUFiLEdBQXlCLFVBQXBDLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsTUFBSUUsUUFBSixFQUFjQyxRQUFkLEVBQXdCQyxXQUF4Qjs7QUFFQSxNQUFLLGVBQWVDLFNBQVNDLGVBQTdCLEVBQStDO0FBQzdDSixlQUFXLGtCQUFVSyxJQUFWLEVBQWdCQyxDQUFoQixFQUFvQjtBQUM3QixhQUFPRCxLQUFLRSxTQUFMLENBQWVDLFFBQWYsQ0FBeUJGLENBQXpCLENBQVA7QUFDRCxLQUZEO0FBR0FMLGVBQVcsa0JBQVVJLElBQVYsRUFBZ0JDLENBQWhCLEVBQW9CO0FBQzdCRCxXQUFLRSxTQUFMLENBQWVFLEdBQWYsQ0FBb0JILENBQXBCO0FBQ0QsS0FGRDtBQUdBSixrQkFBYyxxQkFBVUcsSUFBVixFQUFnQkMsQ0FBaEIsRUFBb0I7QUFDaENELFdBQUtFLFNBQUwsQ0FBZUcsTUFBZixDQUF1QkosQ0FBdkI7QUFDRCxLQUZEO0FBR0QsR0FWRCxNQVdLO0FBQ0hOLGVBQVcsa0JBQVVLLElBQVYsRUFBZ0JDLENBQWhCLEVBQW9CO0FBQzdCLGFBQU9ULFNBQVVTLENBQVYsRUFBY0ssSUFBZCxDQUFvQk4sS0FBS1AsU0FBekIsQ0FBUDtBQUNELEtBRkQ7QUFHQUcsZUFBVyxrQkFBVUksSUFBVixFQUFnQkMsQ0FBaEIsRUFBb0I7QUFDN0IsVUFBSyxDQUFDTixTQUFVSyxJQUFWLEVBQWdCQyxDQUFoQixDQUFOLEVBQTRCO0FBQzFCRCxhQUFLUCxTQUFMLEdBQWlCTyxLQUFLUCxTQUFMLEdBQWlCLEdBQWpCLEdBQXVCUSxDQUF4QztBQUNEO0FBQ0YsS0FKRDtBQUtBSixrQkFBYyxxQkFBVUcsSUFBVixFQUFnQkMsQ0FBaEIsRUFBb0I7QUFDaENELFdBQUtQLFNBQUwsR0FBaUJPLEtBQUtQLFNBQUwsQ0FBZWMsT0FBZixDQUF3QmYsU0FBVVMsQ0FBVixDQUF4QixFQUF1QyxHQUF2QyxDQUFqQjtBQUNELEtBRkQ7QUFHRDs7QUFFRCxXQUFTTyxXQUFULENBQXNCUixJQUF0QixFQUE0QkMsQ0FBNUIsRUFBZ0M7QUFDOUIsUUFBSVEsS0FBS2QsU0FBVUssSUFBVixFQUFnQkMsQ0FBaEIsSUFBc0JKLFdBQXRCLEdBQW9DRCxRQUE3QztBQUNBYSxPQUFJVCxJQUFKLEVBQVVDLENBQVY7QUFDRDs7QUFFRCxNQUFJUyxVQUFVO0FBQ1o7QUFDQWYsY0FBVUEsUUFGRTtBQUdaQyxjQUFVQSxRQUhFO0FBSVpDLGlCQUFhQSxXQUpEO0FBS1pXLGlCQUFhQSxXQUxEO0FBTVo7QUFDQUcsU0FBS2hCLFFBUE87QUFRWlMsU0FBS1IsUUFSTztBQVNaUyxZQUFRUixXQVRJO0FBVVplLFlBQVFKO0FBVkksR0FBZDs7QUFhQTtBQUNBLE1BQUssT0FBT0ssTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBNUMsRUFBa0Q7QUFDaEQ7QUFDQUQsV0FBUUgsT0FBUjtBQUNELEdBSEQsTUFHTztBQUNMO0FBQ0FuQixXQUFPbUIsT0FBUCxHQUFpQkEsT0FBakI7QUFDRDtBQUVBLENBbEVELEVBa0VJbkIsTUFsRUoiLCJmaWxlIjoic2VsZWN0L2NsYXNzaWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGNsYXNzaWUgLSBjbGFzcyBoZWxwZXIgZnVuY3Rpb25zXG4gKiBmcm9tIGJvbnpvIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvYm9uem9cbiAqIFxuICogY2xhc3NpZS5oYXMoIGVsZW0sICdteS1jbGFzcycgKSAtPiB0cnVlL2ZhbHNlXG4gKiBjbGFzc2llLmFkZCggZWxlbSwgJ215LW5ldy1jbGFzcycgKVxuICogY2xhc3NpZS5yZW1vdmUoIGVsZW0sICdteS11bndhbnRlZC1jbGFzcycgKVxuICogY2xhc3NpZS50b2dnbGUoIGVsZW0sICdteS1jbGFzcycgKVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIGNsYXNzIGhlbHBlciBmdW5jdGlvbnMgZnJvbSBib256byBodHRwczovL2dpdGh1Yi5jb20vZGVkL2JvbnpvXG5cbmZ1bmN0aW9uIGNsYXNzUmVnKCBjbGFzc05hbWUgKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXHMrfCQpXCIpO1xufVxuXG4vLyBjbGFzc0xpc3Qgc3VwcG9ydCBmb3IgY2xhc3MgbWFuYWdlbWVudFxuLy8gYWx0aG8gdG8gYmUgZmFpciwgdGhlIGFwaSBzdWNrcyBiZWNhdXNlIGl0IHdvbid0IGFjY2VwdCBtdWx0aXBsZSBjbGFzc2VzIGF0IG9uY2VcbnZhciBoYXNDbGFzcywgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzO1xuXG5pZiAoICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCApIHtcbiAgaGFzQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICByZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoIGMgKTtcbiAgfTtcbiAgYWRkQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICBlbGVtLmNsYXNzTGlzdC5hZGQoIGMgKTtcbiAgfTtcbiAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoIGMgKTtcbiAgfTtcbn1cbmVsc2Uge1xuICBoYXNDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIHJldHVybiBjbGFzc1JlZyggYyApLnRlc3QoIGVsZW0uY2xhc3NOYW1lICk7XG4gIH07XG4gIGFkZENsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgaWYgKCAhaGFzQ2xhc3MoIGVsZW0sIGMgKSApIHtcbiAgICAgIGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnICcgKyBjO1xuICAgIH1cbiAgfTtcbiAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoIGNsYXNzUmVnKCBjICksICcgJyApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVDbGFzcyggZWxlbSwgYyApIHtcbiAgdmFyIGZuID0gaGFzQ2xhc3MoIGVsZW0sIGMgKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG4gIGZuKCBlbGVtLCBjICk7XG59XG5cbnZhciBjbGFzc2llID0ge1xuICAvLyBmdWxsIG5hbWVzXG4gIGhhc0NsYXNzOiBoYXNDbGFzcyxcbiAgYWRkQ2xhc3M6IGFkZENsYXNzLFxuICByZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXG4gIHRvZ2dsZUNsYXNzOiB0b2dnbGVDbGFzcyxcbiAgLy8gc2hvcnQgbmFtZXNcbiAgaGFzOiBoYXNDbGFzcyxcbiAgYWRkOiBhZGRDbGFzcyxcbiAgcmVtb3ZlOiByZW1vdmVDbGFzcyxcbiAgdG9nZ2xlOiB0b2dnbGVDbGFzc1xufTtcblxuLy8gdHJhbnNwb3J0XG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggY2xhc3NpZSApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmNsYXNzaWUgPSBjbGFzc2llO1xufVxuXG59KSggd2luZG93ICk7XG4iXX0=
