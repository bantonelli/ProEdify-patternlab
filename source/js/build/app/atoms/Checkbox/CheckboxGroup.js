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
      size: String,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9DaGVja2JveC9DaGVja2JveEdyb3VwLmpzIl0sIm5hbWVzIjpbImNoZWNrYm94R3JvdXBUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsInZhbHVlIiwibWluIiwiTnVtYmVyIiwibWF4Iiwic2l6ZSIsIlN0cmluZyIsImZpbGwiLCJ0ZXh0Q29sb3IiLCJ3YXRjaCIsImRpc3BhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSxtRkFBSjs7b0JBTWU7QUFDYkMsVUFBTSxlQURPOztBQUdiQyxjQUFVRixxQkFIRzs7QUFLYkcsbUJBQWUsZUFMRjs7QUFPYkMsWUFBUSxtQkFQSzs7QUFTYkMsV0FBTztBQUNMQyxhQUFPLEVBREY7QUFFTEMsV0FBS0MsTUFGQTtBQUdMQyxXQUFLRCxNQUhBO0FBSUxFLFlBQU1DLE1BSkQ7QUFLTEMsWUFBTUQsTUFMRDtBQU1MRSxpQkFBV0Y7QUFOTixLQVRNOztBQWtCYkcsV0FBTztBQUNMUixXQURLLGlCQUNDQSxNQURELEVBQ1E7QUFDWDtBQUNBLGFBQUtTLFFBQUwsQ0FBYyxVQUFkLEVBQTBCLGFBQTFCLEVBQXlDLENBQUNULE1BQUQsQ0FBekM7QUFDRDtBQUpJO0FBbEJNLEciLCJmaWxlIjoiYXBwL2F0b21zL0NoZWNrYm94L0NoZWNrYm94R3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9taXhpbnMvZW1pdHRlcic7XG5cbmxldCBjaGVja2JveEdyb3VwVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiY2hlY2tib3gtZ3JvdXBcIj5cbiAgPHNsb3Q+PC9zbG90PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdDaGVja2JveEdyb3VwJyxcblxuICB0ZW1wbGF0ZTogY2hlY2tib3hHcm91cFRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdDaGVja2JveEdyb3VwJyxcblxuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICBwcm9wczoge1xuICAgIHZhbHVlOiB7fSxcbiAgICBtaW46IE51bWJlcixcbiAgICBtYXg6IE51bWJlcixcbiAgICBzaXplOiBTdHJpbmcsXG4gICAgZmlsbDogU3RyaW5nLFxuICAgIHRleHRDb2xvcjogU3RyaW5nXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICB2YWx1ZSh2YWx1ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJDaGFuZ2VkIGdyb3VwIHZhbHVlXCIsIHZhbHVlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uY2hhbmdlJywgW3ZhbHVlXSk7XG4gICAgfVxuICB9XG59O1xuXG5cbiJdfQ==
