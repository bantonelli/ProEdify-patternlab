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

  var radioTemplate = '\n<div \n    class="radio" \n    :class="[\n      modifierStyles,\n      {        \n        \'is-disabled\': isDisabled,\n        \'is-checked\': model === label,\n        \'is-focus\': focus\n      }\n    ]"\n  >\n    <input \n      class="radio__input" \n      type="radio" \n      :id="id"        \n      :value="label"      \n      :name="name"\n      :disabled="isDisabled"\n      v-model="model"\n      @focus="focus = true"\n      @blur="focus = false"\n    >\n    <div class="radio__fill"></div>\n    <label class="radio__label" :for="id">\n        <slot></slot>\n        <template v-if="!$slots.default">{{label}}</template>\n    </label>\n</div>\n';

  exports.default = {
    name: 'Radio',

    template: radioTemplate,

    mixins: [_emitter2.default],

    componentName: 'Radio',

    props: {
      id: String,
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      modifierStyles: {
        type: Array,
        default: null
      }
    },

    data: function data() {
      return {
        focus: false
      };
    },


    computed: {
      isGroup: function isGroup() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'RadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },


      model: {
        get: function get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set: function set(val) {
          if (this.isGroup) {
            this.dispatch('RadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },

      isDisabled: function isDisabled() {
        return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
      }
    }

  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9SYWRpby9SYWRpby5qcyJdLCJuYW1lcyI6WyJyYWRpb1RlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiY29tcG9uZW50TmFtZSIsInByb3BzIiwiaWQiLCJTdHJpbmciLCJ2YWx1ZSIsImxhYmVsIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwibW9kaWZpZXJTdHlsZXMiLCJ0eXBlIiwiQXJyYXkiLCJkZWZhdWx0IiwiZGF0YSIsImZvY3VzIiwiY29tcHV0ZWQiLCJpc0dyb3VwIiwicGFyZW50IiwiJHBhcmVudCIsIiRvcHRpb25zIiwiX3JhZGlvR3JvdXAiLCJtb2RlbCIsImdldCIsInNldCIsInZhbCIsImRpc3BhdGNoIiwiJGVtaXQiLCJpc0Rpc2FibGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFJQSxtcUJBQUo7O29CQStCZTtBQUNiQyxVQUFNLE9BRE87O0FBR2JDLGNBQVVGLGFBSEc7O0FBS2JHLFlBQVEsbUJBTEs7O0FBT2JDLG1CQUFlLE9BUEY7O0FBU2JDLFdBQU87QUFDTEMsVUFBSUMsTUFEQztBQUVMQyxhQUFPLEVBRkY7QUFHTEMsYUFBTyxFQUhGO0FBSUxDLGdCQUFVQyxPQUpMO0FBS0xWLFlBQU1NLE1BTEQ7QUFNTEssc0JBQWdCO0FBQ2RDLGNBQU1DLEtBRFE7QUFFZEMsaUJBQVM7QUFGSztBQU5YLEtBVE07O0FBcUJiQyxRQXJCYSxrQkFxQk47QUFDTCxhQUFPO0FBQ0xDLGVBQU87QUFERixPQUFQO0FBR0QsS0F6Qlk7OztBQTJCYkMsY0FBVTtBQUNSQyxhQURRLHFCQUNFO0FBQ1IsWUFBSUMsU0FBUyxLQUFLQyxPQUFsQjtBQUNBLGVBQU9ELE1BQVAsRUFBZTtBQUNiLGNBQUlBLE9BQU9FLFFBQVAsQ0FBZ0JsQixhQUFoQixLQUFrQyxZQUF0QyxFQUFvRDtBQUNsRGdCLHFCQUFTQSxPQUFPQyxPQUFoQjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLRSxXQUFMLEdBQW1CSCxNQUFuQjtBQUNBLG1CQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FaTzs7O0FBY1JJLGFBQU87QUFDTEMsV0FESyxpQkFDQztBQUNKLGlCQUFPLEtBQUtOLE9BQUwsR0FBZSxLQUFLSSxXQUFMLENBQWlCZixLQUFoQyxHQUF3QyxLQUFLQSxLQUFwRDtBQUNELFNBSEk7QUFLTGtCLFdBTEssZUFLREMsR0FMQyxFQUtJO0FBQ1AsY0FBSSxLQUFLUixPQUFULEVBQWtCO0FBQ2hCLGlCQUFLUyxRQUFMLENBQWMsWUFBZCxFQUE0QixPQUE1QixFQUFxQyxDQUFDRCxHQUFELENBQXJDO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUtFLEtBQUwsQ0FBVyxPQUFYLEVBQW9CRixHQUFwQjtBQUNEO0FBQ0Y7QUFYSSxPQWRDOztBQTRCUkcsZ0JBNUJRLHdCQTRCSztBQUNYLGVBQU8sS0FBS1gsT0FBTCxHQUNILEtBQUtJLFdBQUwsQ0FBaUJiLFFBQWpCLElBQTZCLEtBQUtBLFFBRC9CLEdBRUgsS0FBS0EsUUFGVDtBQUdEO0FBaENPOztBQTNCRyxHIiwiZmlsZSI6ImFwcC9hdG9tcy9SYWRpby9SYWRpby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgcmFkaW9UZW1wbGF0ZSA9IGBcbjxkaXYgXG4gICAgY2xhc3M9XCJyYWRpb1wiIFxuICAgIDpjbGFzcz1cIltcbiAgICAgIG1vZGlmaWVyU3R5bGVzLFxuICAgICAgeyAgICAgICAgXG4gICAgICAgICdpcy1kaXNhYmxlZCc6IGlzRGlzYWJsZWQsXG4gICAgICAgICdpcy1jaGVja2VkJzogbW9kZWwgPT09IGxhYmVsLFxuICAgICAgICAnaXMtZm9jdXMnOiBmb2N1c1xuICAgICAgfVxuICAgIF1cIlxuICA+XG4gICAgPGlucHV0IFxuICAgICAgY2xhc3M9XCJyYWRpb19faW5wdXRcIiBcbiAgICAgIHR5cGU9XCJyYWRpb1wiIFxuICAgICAgOmlkPVwiaWRcIiAgICAgICAgXG4gICAgICA6dmFsdWU9XCJsYWJlbFwiICAgICAgXG4gICAgICA6bmFtZT1cIm5hbWVcIlxuICAgICAgOmRpc2FibGVkPVwiaXNEaXNhYmxlZFwiXG4gICAgICB2LW1vZGVsPVwibW9kZWxcIlxuICAgICAgQGZvY3VzPVwiZm9jdXMgPSB0cnVlXCJcbiAgICAgIEBibHVyPVwiZm9jdXMgPSBmYWxzZVwiXG4gICAgPlxuICAgIDxkaXYgY2xhc3M9XCJyYWRpb19fZmlsbFwiPjwvZGl2PlxuICAgIDxsYWJlbCBjbGFzcz1cInJhZGlvX19sYWJlbFwiIDpmb3I9XCJpZFwiPlxuICAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwiISRzbG90cy5kZWZhdWx0XCI+e3tsYWJlbH19PC90ZW1wbGF0ZT5cbiAgICA8L2xhYmVsPlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdSYWRpbycsXG5cbiAgdGVtcGxhdGU6IHJhZGlvVGVtcGxhdGUsXG5cbiAgbWl4aW5zOiBbRW1pdHRlcl0sXG5cbiAgY29tcG9uZW50TmFtZTogJ1JhZGlvJyxcblxuICBwcm9wczoge1xuICAgIGlkOiBTdHJpbmcsXG4gICAgdmFsdWU6IHt9LFxuICAgIGxhYmVsOiB7fSxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBuYW1lOiBTdHJpbmcsXG4gICAgbW9kaWZpZXJTdHlsZXM6IHtcbiAgICAgIHR5cGU6IEFycmF5LCBcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZm9jdXM6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGlzR3JvdXAoKSB7XG4gICAgICBsZXQgcGFyZW50ID0gdGhpcy4kcGFyZW50O1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRvcHRpb25zLmNvbXBvbmVudE5hbWUgIT09ICdSYWRpb0dyb3VwJykge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC4kcGFyZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JhZGlvR3JvdXAgPSBwYXJlbnQ7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbW9kZWw6IHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNHcm91cCA/IHRoaXMuX3JhZGlvR3JvdXAudmFsdWUgOiB0aGlzLnZhbHVlO1xuICAgICAgfSxcblxuICAgICAgc2V0KHZhbCkge1xuICAgICAgICBpZiAodGhpcy5pc0dyb3VwKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaCgnUmFkaW9Hcm91cCcsICdpbnB1dCcsIFt2YWxdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNEaXNhYmxlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzR3JvdXBcbiAgICAgICAgPyB0aGlzLl9yYWRpb0dyb3VwLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgOiB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgfSxcblxuICAvLyBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gICAgIHZhciBpc0NoZWNrZWQgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgLy8gICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgLy8gICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICh0aGlzLmZvcm12YWx1ZSkpO1xuICAvLyAgICAgfSBlbHNlIHsgICAgICAgICAgICBcbiAgLy8gICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG51bGwpO1xuICAvLyAgICAgfSAgICAgICAgICAgICAgXG4gIC8vIH1cbn07XG5cbiJdfQ==
