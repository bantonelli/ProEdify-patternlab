define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function _broadcast(componentName, eventName, params) {
    this.$children.forEach(function (child) {
      var name = child.$options.componentName;

      if (name === componentName) {
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        _broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  }
  exports.default = {
    methods: {
      dispatch: function dispatch(componentName, eventName, params) {
        var parent = this.$parent || this.$root;
        var name = parent.$options.componentName;

        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent;

          if (parent) {
            name = parent.$options.componentName;
          }
        }
        if (parent) {
          parent.$emit.apply(parent, [eventName].concat(params));
        }
      },
      broadcast: function broadcast(componentName, eventName, params) {
        _broadcast.call(this, componentName, eventName, params);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9taXhpbnMvZW1pdHRlci5qcyJdLCJuYW1lcyI6WyJicm9hZGNhc3QiLCJjb21wb25lbnROYW1lIiwiZXZlbnROYW1lIiwicGFyYW1zIiwiJGNoaWxkcmVuIiwiZm9yRWFjaCIsIm5hbWUiLCJjaGlsZCIsIiRvcHRpb25zIiwiJGVtaXQiLCJhcHBseSIsImNvbmNhdCIsIm1ldGhvZHMiLCJkaXNwYXRjaCIsInBhcmVudCIsIiRwYXJlbnQiLCIkcm9vdCIsImNhbGwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFdBQVNBLFVBQVQsQ0FBbUJDLGFBQW5CLEVBQWtDQyxTQUFsQyxFQUE2Q0MsTUFBN0MsRUFBcUQ7QUFDbkQsU0FBS0MsU0FBTCxDQUFlQyxPQUFmLENBQXVCLGlCQUFTO0FBQzlCLFVBQUlDLE9BQU9DLE1BQU1DLFFBQU4sQ0FBZVAsYUFBMUI7O0FBRUEsVUFBSUssU0FBU0wsYUFBYixFQUE0QjtBQUMxQk0sY0FBTUUsS0FBTixDQUFZQyxLQUFaLENBQWtCSCxLQUFsQixFQUF5QixDQUFDTCxTQUFELEVBQVlTLE1BQVosQ0FBbUJSLE1BQW5CLENBQXpCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xILG1CQUFVVSxLQUFWLENBQWdCSCxLQUFoQixFQUF1QixDQUFDTixhQUFELEVBQWdCQyxTQUFoQixFQUEyQlMsTUFBM0IsQ0FBa0MsQ0FBQ1IsTUFBRCxDQUFsQyxDQUF2QjtBQUNEO0FBQ0YsS0FSRDtBQVNEO29CQUNjO0FBQ2JTLGFBQVM7QUFDUEMsY0FETyxvQkFDRVosYUFERixFQUNpQkMsU0FEakIsRUFDNEJDLE1BRDVCLEVBQ29DO0FBQ3pDLFlBQUlXLFNBQVMsS0FBS0MsT0FBTCxJQUFnQixLQUFLQyxLQUFsQztBQUNBLFlBQUlWLE9BQU9RLE9BQU9OLFFBQVAsQ0FBZ0JQLGFBQTNCOztBQUVBLGVBQU9hLFdBQVcsQ0FBQ1IsSUFBRCxJQUFTQSxTQUFTTCxhQUE3QixDQUFQLEVBQW9EO0FBQ2xEYSxtQkFBU0EsT0FBT0MsT0FBaEI7O0FBRUEsY0FBSUQsTUFBSixFQUFZO0FBQ1ZSLG1CQUFPUSxPQUFPTixRQUFQLENBQWdCUCxhQUF2QjtBQUNEO0FBQ0Y7QUFDRCxZQUFJYSxNQUFKLEVBQVk7QUFDVkEsaUJBQU9MLEtBQVAsQ0FBYUMsS0FBYixDQUFtQkksTUFBbkIsRUFBMkIsQ0FBQ1osU0FBRCxFQUFZUyxNQUFaLENBQW1CUixNQUFuQixDQUEzQjtBQUNEO0FBQ0YsT0FmTTtBQWdCUEgsZUFoQk8scUJBZ0JHQyxhQWhCSCxFQWdCa0JDLFNBaEJsQixFQWdCNkJDLE1BaEI3QixFQWdCcUM7QUFDMUNILG1CQUFVaUIsSUFBVixDQUFlLElBQWYsRUFBcUJoQixhQUFyQixFQUFvQ0MsU0FBcEMsRUFBK0NDLE1BQS9DO0FBQ0Q7QUFsQk07QUFESSxHIiwiZmlsZSI6ImFwcC9taXhpbnMvZW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGJyb2FkY2FzdChjb21wb25lbnROYW1lLCBldmVudE5hbWUsIHBhcmFtcykge1xuICB0aGlzLiRjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICB2YXIgbmFtZSA9IGNoaWxkLiRvcHRpb25zLmNvbXBvbmVudE5hbWU7XG5cbiAgICBpZiAobmFtZSA9PT0gY29tcG9uZW50TmFtZSkge1xuICAgICAgY2hpbGQuJGVtaXQuYXBwbHkoY2hpbGQsIFtldmVudE5hbWVdLmNvbmNhdChwYXJhbXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJvYWRjYXN0LmFwcGx5KGNoaWxkLCBbY29tcG9uZW50TmFtZSwgZXZlbnROYW1lXS5jb25jYXQoW3BhcmFtc10pKTtcbiAgICB9XG4gIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQge1xuICBtZXRob2RzOiB7XG4gICAgZGlzcGF0Y2goY29tcG9uZW50TmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnQgfHwgdGhpcy4kcm9vdDtcbiAgICAgIHZhciBuYW1lID0gcGFyZW50LiRvcHRpb25zLmNvbXBvbmVudE5hbWU7XG5cbiAgICAgIHdoaWxlIChwYXJlbnQgJiYgKCFuYW1lIHx8IG5hbWUgIT09IGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC4kcGFyZW50O1xuXG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBuYW1lID0gcGFyZW50LiRvcHRpb25zLmNvbXBvbmVudE5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LiRlbWl0LmFwcGx5KHBhcmVudCwgW2V2ZW50TmFtZV0uY29uY2F0KHBhcmFtcykpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYnJvYWRjYXN0KGNvbXBvbmVudE5hbWUsIGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICBicm9hZGNhc3QuY2FsbCh0aGlzLCBjb21wb25lbnROYW1lLCBldmVudE5hbWUsIHBhcmFtcyk7XG4gICAgfVxuICB9XG59O1xuIl19
