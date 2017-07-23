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

  var radioGroupTemplate = '\n<div class="radio-group">\n  <slot></slot>\n</div>\n';

  exports.default = {
    name: 'RadioGroup',

    template: radioGroupTemplate,

    componentName: 'RadioGroup',

    mixins: [_emitter2.default],

    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value: function value(_value) {
        this.$emit('change', _value);
        this.dispatch('FormItem', 'form.change', [this.value]);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9SYWRpby9SYWRpb0dyb3VwLmpzIl0sIm5hbWVzIjpbInJhZGlvR3JvdXBUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsInZhbHVlIiwic2l6ZSIsIlN0cmluZyIsImZpbGwiLCJ0ZXh0Q29sb3IiLCJkaXNhYmxlZCIsIkJvb2xlYW4iLCJ3YXRjaCIsIiRlbWl0IiwiZGlzcGF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQUlBLDZFQUFKOztvQkFNZTtBQUNiQyxVQUFNLFlBRE87O0FBR2JDLGNBQVVGLGtCQUhHOztBQUtiRyxtQkFBZSxZQUxGOztBQU9iQyxZQUFRLG1CQVBLOztBQVNiQyxXQUFPO0FBQ0xDLGFBQU8sRUFERjtBQUVMQyxZQUFNQyxNQUZEO0FBR0xDLFlBQU1ELE1BSEQ7QUFJTEUsaUJBQVdGLE1BSk47QUFLTEcsZ0JBQVVDO0FBTEwsS0FUTTtBQWdCYkMsV0FBTztBQUNMUCxXQURLLGlCQUNDQSxNQURELEVBQ1E7QUFDWCxhQUFLUSxLQUFMLENBQVcsUUFBWCxFQUFxQlIsTUFBckI7QUFDQSxhQUFLUyxRQUFMLENBQWMsVUFBZCxFQUEwQixhQUExQixFQUF5QyxDQUFDLEtBQUtULEtBQU4sQ0FBekM7QUFDRDtBQUpJO0FBaEJNLEciLCJmaWxlIjoiYXBwL2F0b21zL1JhZGlvL1JhZGlvR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9taXhpbnMvZW1pdHRlcic7XG5cbmxldCByYWRpb0dyb3VwVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwicmFkaW8tZ3JvdXBcIj5cbiAgPHNsb3Q+PC9zbG90PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdSYWRpb0dyb3VwJyxcblxuICB0ZW1wbGF0ZTogcmFkaW9Hcm91cFRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdSYWRpb0dyb3VwJyxcblxuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICBwcm9wczoge1xuICAgIHZhbHVlOiB7fSxcbiAgICBzaXplOiBTdHJpbmcsXG4gICAgZmlsbDogU3RyaW5nLFxuICAgIHRleHRDb2xvcjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuXG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgdmFsdWUodmFsdWUpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uY2hhbmdlJywgW3RoaXMudmFsdWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblxuIl19
