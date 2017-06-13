define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    mounted: function mounted() {
      if (process.env.NODE_ENV === 'production') return;
      if (!this.$vnode) return;

      var _getMigratingConfig = this.getMigratingConfig(),
          props = _getMigratingConfig.props,
          events = _getMigratingConfig.events;

      var _$vnode = this.$vnode,
          data = _$vnode.data,
          componentOptions = _$vnode.componentOptions;

      var definedProps = data.attrs || {};
      var definedEvents = componentOptions.listeners || {};

      for (var propName in definedProps) {
        if (definedProps.hasOwnProperty(propName) && props[propName]) {
          console.warn('[Element Migrating][Attribute]: ' + props[propName]);
        }
      }

      for (var eventName in definedEvents) {
        if (definedEvents.hasOwnProperty(eventName) && events[eventName]) {
          console.warn('[Element Migrating][Event]: ' + events[eventName]);
        }
      }
    },

    methods: {
      getMigratingConfig: function getMigratingConfig() {
        return {
          props: {},
          events: {}
        };
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9taXhpbnMvbWlncmF0aW5nLmpzIl0sIm5hbWVzIjpbIm1vdW50ZWQiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCIkdm5vZGUiLCJnZXRNaWdyYXRpbmdDb25maWciLCJwcm9wcyIsImV2ZW50cyIsImRhdGEiLCJjb21wb25lbnRPcHRpb25zIiwiZGVmaW5lZFByb3BzIiwiYXR0cnMiLCJkZWZpbmVkRXZlbnRzIiwibGlzdGVuZXJzIiwicHJvcE5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbnNvbGUiLCJ3YXJuIiwiZXZlbnROYW1lIiwibWV0aG9kcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQXFCZTtBQUNiQSxXQURhLHFCQUNIO0FBQ1IsVUFBSUMsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQzNDLFVBQUksQ0FBQyxLQUFLQyxNQUFWLEVBQWtCOztBQUZWLGdDQUdrQixLQUFLQyxrQkFBTCxFQUhsQjtBQUFBLFVBR0FDLEtBSEEsdUJBR0FBLEtBSEE7QUFBQSxVQUdPQyxNQUhQLHVCQUdPQSxNQUhQOztBQUFBLG9CQUkyQixLQUFLSCxNQUpoQztBQUFBLFVBSUFJLElBSkEsV0FJQUEsSUFKQTtBQUFBLFVBSU1DLGdCQUpOLFdBSU1BLGdCQUpOOztBQUtSLFVBQU1DLGVBQWVGLEtBQUtHLEtBQUwsSUFBYyxFQUFuQztBQUNBLFVBQU1DLGdCQUFnQkgsaUJBQWlCSSxTQUFqQixJQUE4QixFQUFwRDs7QUFFQSxXQUFLLElBQUlDLFFBQVQsSUFBcUJKLFlBQXJCLEVBQW1DO0FBQ2pDLFlBQUlBLGFBQWFLLGNBQWIsQ0FBNEJELFFBQTVCLEtBQXlDUixNQUFNUSxRQUFOLENBQTdDLEVBQThEO0FBQzVERSxrQkFBUUMsSUFBUixzQ0FBZ0RYLE1BQU1RLFFBQU4sQ0FBaEQ7QUFDRDtBQUNGOztBQUVELFdBQUssSUFBSUksU0FBVCxJQUFzQk4sYUFBdEIsRUFBcUM7QUFDbkMsWUFBSUEsY0FBY0csY0FBZCxDQUE2QkcsU0FBN0IsS0FBMkNYLE9BQU9XLFNBQVAsQ0FBL0MsRUFBa0U7QUFDaEVGLGtCQUFRQyxJQUFSLGtDQUE0Q1YsT0FBT1csU0FBUCxDQUE1QztBQUNEO0FBQ0Y7QUFDRixLQXBCWTs7QUFxQmJDLGFBQVM7QUFDUGQsd0JBRE8sZ0NBQ2M7QUFDbkIsZUFBTztBQUNMQyxpQkFBTyxFQURGO0FBRUxDLGtCQUFRO0FBRkgsU0FBUDtBQUlEO0FBTk07QUFyQkksRyIsImZpbGUiOiJhcHAvbWl4aW5zL21pZ3JhdGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2hvdyBtaWdyYXRpbmcgZ3VpZGUgaW4gYnJvd3NlciBjb25zb2xlLlxuICpcbiAqIFVzYWdlOlxuICogaW1wb3J0IE1pZ3JhdGluZyBmcm9tICdlbGVtZW50LXVpL3NyYy9taXhpbnMvbWlncmF0aW5nJztcbiAqXG4gKiBtaXhpbnM6IFtNaWdyYXRpbmddXG4gKlxuICogYWRkIGdldE1pZ3JhdGluZ0NvbmZpZyBtZXRob2QgZm9yIHlvdXIgY29tcG9uZW50LlxuICogIGdldE1pZ3JhdGluZ0NvbmZpZygpIHtcbiAqICAgIHJldHVybiB7XG4gKiAgICAgIHByb3BzOiB7XG4gKiAgICAgICAgJ2FsbG93LW5vLXNlbGVjdGlvbic6ICdhbGxvdy1uby1zZWxlY3Rpb24gaXMgcmVtb3ZlZC4nLFxuICogICAgICAgICdzZWxlY3Rpb24tbW9kZSc6ICdzZWxlY3Rpb24tbW9kZSBpcyByZW1vdmVkLidcbiAqICAgICAgfSxcbiAqICAgICAgZXZlbnRzOiB7XG4gKiAgICAgICAgc2VsZWN0aW9uY2hhbmdlOiAnc2VsZWN0aW9uY2hhbmdlIGlzIHJlbmFtZWQgdG8gc2VsZWN0aW9uLWNoYW5nZS4nXG4gKiAgICAgIH1cbiAqICAgIH07XG4gKiAgfSxcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBtb3VudGVkKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSByZXR1cm47XG4gICAgaWYgKCF0aGlzLiR2bm9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IHsgcHJvcHMsIGV2ZW50cyB9ID0gdGhpcy5nZXRNaWdyYXRpbmdDb25maWcoKTtcbiAgICBjb25zdCB7IGRhdGEsIGNvbXBvbmVudE9wdGlvbnMgfSA9IHRoaXMuJHZub2RlO1xuICAgIGNvbnN0IGRlZmluZWRQcm9wcyA9IGRhdGEuYXR0cnMgfHwge307XG4gICAgY29uc3QgZGVmaW5lZEV2ZW50cyA9IGNvbXBvbmVudE9wdGlvbnMubGlzdGVuZXJzIHx8IHt9O1xuXG4gICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gZGVmaW5lZFByb3BzKSB7XG4gICAgICBpZiAoZGVmaW5lZFByb3BzLmhhc093blByb3BlcnR5KHByb3BOYW1lKSAmJiBwcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBbRWxlbWVudCBNaWdyYXRpbmddW0F0dHJpYnV0ZV06ICR7cHJvcHNbcHJvcE5hbWVdfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiBkZWZpbmVkRXZlbnRzKSB7XG4gICAgICBpZiAoZGVmaW5lZEV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudE5hbWUpICYmIGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW0VsZW1lbnQgTWlncmF0aW5nXVtFdmVudF06ICR7ZXZlbnRzW2V2ZW50TmFtZV19YCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0TWlncmF0aW5nQ29uZmlnKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcHM6IHt9LFxuICAgICAgICBldmVudHM6IHt9XG4gICAgICB9O1xuICAgIH1cbiAgfVxufTtcbiJdfQ==
