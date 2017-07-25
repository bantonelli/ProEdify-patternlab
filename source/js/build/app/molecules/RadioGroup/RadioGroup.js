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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvUmFkaW9Hcm91cC9SYWRpb0dyb3VwLmpzIl0sIm5hbWVzIjpbInJhZGlvR3JvdXBUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsInZhbHVlIiwiZmlsbCIsIlN0cmluZyIsInRleHRDb2xvciIsImRpc2FibGVkIiwiQm9vbGVhbiIsIndhdGNoIiwiJGVtaXQiLCJkaXNwYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBSUEsNkVBQUo7O29CQU1lO0FBQ2JDLFVBQU0sWUFETzs7QUFHYkMsY0FBVUYsa0JBSEc7O0FBS2JHLG1CQUFlLFlBTEY7O0FBT2JDLFlBQVEsbUJBUEs7O0FBU2JDLFdBQU87QUFDTEMsYUFBTyxFQURGO0FBRUxDLFlBQU1DLE1BRkQ7QUFHTEMsaUJBQVdELE1BSE47QUFJTEUsZ0JBQVVDO0FBSkwsS0FUTTtBQWViQyxXQUFPO0FBQ0xOLFdBREssaUJBQ0NBLE1BREQsRUFDUTtBQUNYLGFBQUtPLEtBQUwsQ0FBVyxRQUFYLEVBQXFCUCxNQUFyQjtBQUNBLGFBQUtRLFFBQUwsQ0FBYyxVQUFkLEVBQTBCLGFBQTFCLEVBQXlDLENBQUMsS0FBS1IsS0FBTixDQUF6QztBQUNEO0FBSkk7QUFmTSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvUmFkaW9Hcm91cC9SYWRpb0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgcmFkaW9Hcm91cFRlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInJhZGlvLWdyb3VwXCI+XG4gIDxzbG90Pjwvc2xvdD5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnUmFkaW9Hcm91cCcsXG5cbiAgdGVtcGxhdGU6IHJhZGlvR3JvdXBUZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnUmFkaW9Hcm91cCcsXG5cbiAgbWl4aW5zOiBbRW1pdHRlcl0sXG5cbiAgcHJvcHM6IHtcbiAgICB2YWx1ZToge30sXG4gICAgZmlsbDogU3RyaW5nLFxuICAgIHRleHRDb2xvcjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuXG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgdmFsdWUodmFsdWUpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uY2hhbmdlJywgW3RoaXMudmFsdWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblxuIl19
