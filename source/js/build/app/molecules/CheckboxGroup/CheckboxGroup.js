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

  var checkboxGroupTemplate = '\n<div class="checkbox-group">\n  <slot></slot>\n</div>\n';

  exports.default = {
    name: 'CheckboxGroup',

    template: checkboxGroupTemplate,

    componentName: 'CheckboxGroup',

    mixins: [_emitter2.default],

    props: {
      value: {},
      min: Number,
      max: Number,
      fill: String,
      textColor: String
    },

    watch: {
      value: function value(_value) {
        // console.log("Changed group value", value);
        this.dispatch('FormItem', 'form.change', [_value]);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvQ2hlY2tib3hHcm91cC9DaGVja2JveEdyb3VwLmpzIl0sIm5hbWVzIjpbImNoZWNrYm94R3JvdXBUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsInZhbHVlIiwibWluIiwiTnVtYmVyIiwibWF4IiwiZmlsbCIsIlN0cmluZyIsInRleHRDb2xvciIsIndhdGNoIiwiZGlzcGF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQUlBLG1GQUFKOztvQkFNZTtBQUNiQyxVQUFNLGVBRE87O0FBR2JDLGNBQVVGLHFCQUhHOztBQUtiRyxtQkFBZSxlQUxGOztBQU9iQyxZQUFRLG1CQVBLOztBQVNiQyxXQUFPO0FBQ0xDLGFBQU8sRUFERjtBQUVMQyxXQUFLQyxNQUZBO0FBR0xDLFdBQUtELE1BSEE7QUFJTEUsWUFBTUMsTUFKRDtBQUtMQyxpQkFBV0Q7QUFMTixLQVRNOztBQWlCYkUsV0FBTztBQUNMUCxXQURLLGlCQUNDQSxNQURELEVBQ1E7QUFDWDtBQUNBLGFBQUtRLFFBQUwsQ0FBYyxVQUFkLEVBQTBCLGFBQTFCLEVBQXlDLENBQUNSLE1BQUQsQ0FBekM7QUFDRDtBQUpJO0FBakJNLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9DaGVja2JveEdyb3VwL0NoZWNrYm94R3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9taXhpbnMvZW1pdHRlcic7XG5cbmxldCBjaGVja2JveEdyb3VwVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiY2hlY2tib3gtZ3JvdXBcIj5cbiAgPHNsb3Q+PC9zbG90PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdDaGVja2JveEdyb3VwJyxcblxuICB0ZW1wbGF0ZTogY2hlY2tib3hHcm91cFRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdDaGVja2JveEdyb3VwJyxcblxuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICBwcm9wczoge1xuICAgIHZhbHVlOiB7fSxcbiAgICBtaW46IE51bWJlcixcbiAgICBtYXg6IE51bWJlcixcbiAgICBmaWxsOiBTdHJpbmcsXG4gICAgdGV4dENvbG9yOiBTdHJpbmdcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHZhbHVlKHZhbHVlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkNoYW5nZWQgZ3JvdXAgdmFsdWVcIiwgdmFsdWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5jaGFuZ2UnLCBbdmFsdWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblxuIl19
