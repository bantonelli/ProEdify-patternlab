define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var SYNC_HOOK_PROP = '$v-sync';

  /**
   * v-sync directive
   *
   * Usage:
   *  v-sync:component-prop="context prop name"
   *
   * If your want to sync component's prop "visible" to context prop "myVisible", use like this:
   *  v-sync:visible="myVisible"
   */
  exports.default = {
    bind: function bind(el, binding, vnode) {
      var context = vnode.context;
      var component = vnode.child;
      var expression = binding.expression;
      var prop = binding.arg;

      if (!expression || !prop) {
        console.warn('v-sync should specify arg & expression, for example: v-sync:visible="myVisible"');
        return;
      }

      if (!component || !component.$watch) {
        console.warn('v-sync is only available on Vue Component');
        return;
      }

      var unwatchContext = context.$watch(expression, function (val) {
        component[prop] = val;
      });

      var unwatchComponent = component.$watch(prop, function (val) {
        context[expression] = val;
      });

      Object.defineProperty(component, SYNC_HOOK_PROP, {
        value: {
          unwatchContext: unwatchContext,
          unwatchComponent: unwatchComponent
        },
        enumerable: false
      });
    },
    unbind: function unbind(el, binding, vnode) {
      var component = vnode.child;
      if (component && component[SYNC_HOOK_PROP]) {
        var _component$SYNC_HOOK_ = component[SYNC_HOOK_PROP],
            unwatchContext = _component$SYNC_HOOK_.unwatchContext,
            unwatchComponent = _component$SYNC_HOOK_.unwatchComponent;

        unwatchContext && unwatchContext();
        unwatchComponent && unwatchComponent();
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9zeW5jLmpzIl0sIm5hbWVzIjpbIlNZTkNfSE9PS19QUk9QIiwiYmluZCIsImVsIiwiYmluZGluZyIsInZub2RlIiwiY29udGV4dCIsImNvbXBvbmVudCIsImNoaWxkIiwiZXhwcmVzc2lvbiIsInByb3AiLCJhcmciLCJjb25zb2xlIiwid2FybiIsIiR3YXRjaCIsInVud2F0Y2hDb250ZXh0IiwidmFsIiwidW53YXRjaENvbXBvbmVudCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJlbnVtZXJhYmxlIiwidW5iaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSxpQkFBaUIsU0FBdkI7O0FBRUE7Ozs7Ozs7OztvQkFTZTtBQUNiQyxRQURhLGdCQUNSQyxFQURRLEVBQ0pDLE9BREksRUFDS0MsS0FETCxFQUNZO0FBQ3ZCLFVBQU1DLFVBQVVELE1BQU1DLE9BQXRCO0FBQ0EsVUFBTUMsWUFBWUYsTUFBTUcsS0FBeEI7QUFDQSxVQUFNQyxhQUFhTCxRQUFRSyxVQUEzQjtBQUNBLFVBQU1DLE9BQU9OLFFBQVFPLEdBQXJCOztBQUVBLFVBQUksQ0FBQ0YsVUFBRCxJQUFlLENBQUNDLElBQXBCLEVBQTBCO0FBQ3hCRSxnQkFBUUMsSUFBUixDQUFhLGlGQUFiO0FBQ0E7QUFDRDs7QUFFRCxVQUFJLENBQUNOLFNBQUQsSUFBYyxDQUFDQSxVQUFVTyxNQUE3QixFQUFxQztBQUNuQ0YsZ0JBQVFDLElBQVIsQ0FBYSwyQ0FBYjtBQUNBO0FBQ0Q7O0FBRUQsVUFBTUUsaUJBQWlCVCxRQUFRUSxNQUFSLENBQWVMLFVBQWYsRUFBMkIsVUFBQ08sR0FBRCxFQUFTO0FBQ3pEVCxrQkFBVUcsSUFBVixJQUFrQk0sR0FBbEI7QUFDRCxPQUZzQixDQUF2Qjs7QUFJQSxVQUFNQyxtQkFBbUJWLFVBQVVPLE1BQVYsQ0FBaUJKLElBQWpCLEVBQXVCLFVBQUNNLEdBQUQsRUFBUztBQUN2RFYsZ0JBQVFHLFVBQVIsSUFBc0JPLEdBQXRCO0FBQ0QsT0FGd0IsQ0FBekI7O0FBSUFFLGFBQU9DLGNBQVAsQ0FBc0JaLFNBQXRCLEVBQWlDTixjQUFqQyxFQUFpRDtBQUMvQ21CLGVBQU87QUFDTEwsd0NBREs7QUFFTEU7QUFGSyxTQUR3QztBQUsvQ0ksb0JBQVk7QUFMbUMsT0FBakQ7QUFPRCxLQWhDWTtBQWtDYkMsVUFsQ2Esa0JBa0NObkIsRUFsQ00sRUFrQ0ZDLE9BbENFLEVBa0NPQyxLQWxDUCxFQWtDYztBQUN6QixVQUFNRSxZQUFZRixNQUFNRyxLQUF4QjtBQUNBLFVBQUlELGFBQWFBLFVBQVVOLGNBQVYsQ0FBakIsRUFBNEM7QUFBQSxvQ0FDR00sVUFBVU4sY0FBVixDQURIO0FBQUEsWUFDbENjLGNBRGtDLHlCQUNsQ0EsY0FEa0M7QUFBQSxZQUNsQkUsZ0JBRGtCLHlCQUNsQkEsZ0JBRGtCOztBQUUxQ0YsMEJBQWtCQSxnQkFBbEI7QUFDQUUsNEJBQW9CQSxrQkFBcEI7QUFDRDtBQUNGO0FBekNZLEciLCJmaWxlIjoiYXBwL3V0aWxzL3N5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTWU5DX0hPT0tfUFJPUCA9ICckdi1zeW5jJztcblxuLyoqXG4gKiB2LXN5bmMgZGlyZWN0aXZlXG4gKlxuICogVXNhZ2U6XG4gKiAgdi1zeW5jOmNvbXBvbmVudC1wcm9wPVwiY29udGV4dCBwcm9wIG5hbWVcIlxuICpcbiAqIElmIHlvdXIgd2FudCB0byBzeW5jIGNvbXBvbmVudCdzIHByb3AgXCJ2aXNpYmxlXCIgdG8gY29udGV4dCBwcm9wIFwibXlWaXNpYmxlXCIsIHVzZSBsaWtlIHRoaXM6XG4gKiAgdi1zeW5jOnZpc2libGU9XCJteVZpc2libGVcIlxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIGJpbmQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHZub2RlLmNvbnRleHQ7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdm5vZGUuY2hpbGQ7XG4gICAgY29uc3QgZXhwcmVzc2lvbiA9IGJpbmRpbmcuZXhwcmVzc2lvbjtcbiAgICBjb25zdCBwcm9wID0gYmluZGluZy5hcmc7XG5cbiAgICBpZiAoIWV4cHJlc3Npb24gfHwgIXByb3ApIHtcbiAgICAgIGNvbnNvbGUud2Fybigndi1zeW5jIHNob3VsZCBzcGVjaWZ5IGFyZyAmIGV4cHJlc3Npb24sIGZvciBleGFtcGxlOiB2LXN5bmM6dmlzaWJsZT1cIm15VmlzaWJsZVwiJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFjb21wb25lbnQgfHwgIWNvbXBvbmVudC4kd2F0Y2gpIHtcbiAgICAgIGNvbnNvbGUud2Fybigndi1zeW5jIGlzIG9ubHkgYXZhaWxhYmxlIG9uIFZ1ZSBDb21wb25lbnQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1bndhdGNoQ29udGV4dCA9IGNvbnRleHQuJHdhdGNoKGV4cHJlc3Npb24sICh2YWwpID0+IHtcbiAgICAgIGNvbXBvbmVudFtwcm9wXSA9IHZhbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVud2F0Y2hDb21wb25lbnQgPSBjb21wb25lbnQuJHdhdGNoKHByb3AsICh2YWwpID0+IHtcbiAgICAgIGNvbnRleHRbZXhwcmVzc2lvbl0gPSB2YWw7XG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29tcG9uZW50LCBTWU5DX0hPT0tfUFJPUCwge1xuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdW53YXRjaENvbnRleHQsXG4gICAgICAgIHVud2F0Y2hDb21wb25lbnRcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9LFxuXG4gIHVuYmluZChlbCwgYmluZGluZywgdm5vZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSB2bm9kZS5jaGlsZDtcbiAgICBpZiAoY29tcG9uZW50ICYmIGNvbXBvbmVudFtTWU5DX0hPT0tfUFJPUF0pIHtcbiAgICAgIGNvbnN0IHsgdW53YXRjaENvbnRleHQsIHVud2F0Y2hDb21wb25lbnQgfSA9IGNvbXBvbmVudFtTWU5DX0hPT0tfUFJPUF07XG4gICAgICB1bndhdGNoQ29udGV4dCAmJiB1bndhdGNoQ29udGV4dCgpO1xuICAgICAgdW53YXRjaENvbXBvbmVudCAmJiB1bndhdGNoQ29tcG9uZW50KCk7XG4gICAgfVxuICB9XG59O1xuIl19
