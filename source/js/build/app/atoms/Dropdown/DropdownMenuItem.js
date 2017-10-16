define(['exports', '../../utils/mixins/emitter'], function (exports, _emitter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var dropdownMenuItemTemplate = '\n<li class="dropdown__menu-item"\n    :class="{}"\n    >\n    <slot></slot>\n</li>\n';

  exports.default = {
    name: 'DropdownMenuItem',

    template: dropdownMenuItemTemplate,

    componentName: 'DropdownMenuItem',

    mixins: [_emitter2.default],

    props: {},
    watch: {},
    computed: {
      form: function form() {
        var parent = this.$parent;
        while (parent.$options.componentName !== 'Form') {
          parent = parent.$parent;
        }
        return parent;
      }
    },
    data: function data() {
      return {};
    },

    methods: {},
    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {
      console.log("DROPDOWN ITEM DESTROYED");
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9Ecm9wZG93bi9Ecm9wZG93bk1lbnVJdGVtLmpzIl0sIm5hbWVzIjpbImRyb3Bkb3duTWVudUl0ZW1UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsIndhdGNoIiwiY29tcHV0ZWQiLCJmb3JtIiwicGFyZW50IiwiJHBhcmVudCIsIiRvcHRpb25zIiwiZGF0YSIsIm1ldGhvZHMiLCJtb3VudGVkIiwiYmVmb3JlRGVzdHJveSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQUlBLGtIQUFKOztvQkFRZTtBQUNiQyxVQUFNLGtCQURPOztBQUdiQyxjQUFVRix3QkFIRzs7QUFLYkcsbUJBQWUsa0JBTEY7O0FBT2JDLFlBQVEsbUJBUEs7O0FBU2JDLFdBQU8sRUFUTTtBQVdiQyxXQUFPLEVBWE07QUFhYkMsY0FBVTtBQUVSQyxVQUZRLGtCQUVEO0FBQ0wsWUFBSUMsU0FBUyxLQUFLQyxPQUFsQjtBQUNBLGVBQU9ELE9BQU9FLFFBQVAsQ0FBZ0JSLGFBQWhCLEtBQWtDLE1BQXpDLEVBQWlEO0FBQy9DTSxtQkFBU0EsT0FBT0MsT0FBaEI7QUFDRDtBQUNELGVBQU9ELE1BQVA7QUFDRDtBQVJPLEtBYkc7QUF1QmJHLFFBdkJhLGtCQXVCTjtBQUNMLGFBQU8sRUFBUDtBQUVELEtBMUJZOztBQTJCYkMsYUFBUyxFQTNCSTtBQTZCYkMsV0E3QmEscUJBNkJILENBQ1QsQ0E5Qlk7QUErQmJDLGlCQS9CYSwyQkErQkc7QUFDZEMsY0FBUUMsR0FBUixDQUFZLHlCQUFaO0FBQ0Q7QUFqQ1ksRyIsImZpbGUiOiJhcHAvYXRvbXMvRHJvcGRvd24vRHJvcGRvd25NZW51SXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcblxubGV0IGRyb3Bkb3duTWVudUl0ZW1UZW1wbGF0ZSA9IGBcbjxsaSBjbGFzcz1cImRyb3Bkb3duX19tZW51LWl0ZW1cIlxuICAgIDpjbGFzcz1cInt9XCJcbiAgICA+XG4gICAgPHNsb3Q+PC9zbG90PlxuPC9saT5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0Ryb3Bkb3duTWVudUl0ZW0nLFxuXG4gIHRlbXBsYXRlOiBkcm9wZG93bk1lbnVJdGVtVGVtcGxhdGUsXG5cbiAgY29tcG9uZW50TmFtZTogJ0Ryb3Bkb3duTWVudUl0ZW0nLFxuXG4gIG1peGluczogW2VtaXR0ZXJdLFxuXG4gIHByb3BzOiB7XG4gIH0sXG4gIHdhdGNoOiB7XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgLy8gQ29tcHV0ZWQgcHJvcCB0aGF0IHJldHVybnMgcGFyZW50IEZvcm0gY29tcG9uZW50LiAgXG4gICAgZm9ybSgpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnQ7XG4gICAgICB3aGlsZSAocGFyZW50LiRvcHRpb25zLmNvbXBvbmVudE5hbWUgIT09ICdGb3JtJykge1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgfTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICB9LFxuICBtb3VudGVkKCkge1xuICB9LFxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIGNvbnNvbGUubG9nKFwiRFJPUERPV04gSVRFTSBERVNUUk9ZRURcIik7XG4gIH1cbn07XG4iXX0=
