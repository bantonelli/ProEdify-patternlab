define(['exports', 'element-ui/src/mixins/emitter'], function (exports, _emitter) {
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

  var checkboxButtonTemplate = '\n<label\n  class="el-checkbox-button"\n    :class="[\n      size ? \'el-checkbox-button--\' + size : \'\',\n      { \'is-disabled\': disabled },\n      { \'is-checked\': isChecked },\n      { \'is-focus\': focus },\n    ]"\n  >\n  <input\n    v-if="trueLabel || falseLabel"\n    class="el-checkbox-button__original"\n    type="checkbox"\n    :name="name"\n    :disabled="disabled"\n    :true-value="trueLabel"\n    :false-value="falseLabel"\n    v-model="model"\n    @change="handleChange"\n    @focus="focus = true"\n    @blur="focus = false">\n  <input\n    v-else\n    class="el-checkbox-button__original"\n    type="checkbox"\n    :name="name"\n    :disabled="disabled"\n    :value="label"\n    v-model="model"\n    @change="handleChange"\n    @focus="focus = true"\n    @blur="focus = false">\n\n  <span class="el-checkbox-button__inner" \n    v-if="$slots.default || label"\n    :style="isChecked ? activeStyle : null">\n    <slot>{{label}}</slot>\n  </span>\n\n</label>\n';

  exports.default = {
    name: 'ElCheckboxButton',

    template: checkboxButtonTemplate,

    mixins: [_emitter2.default],

    data: function data() {
      return {
        selfModel: false,
        focus: false
      };
    },


    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },
    computed: {
      model: {
        get: function get() {
          return this._checkboxGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
        },
        set: function set(val) {
          if (this._checkboxGroup) {
            var isLimitExceeded = false;
            this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (isLimitExceeded = true);

            this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (isLimitExceeded = true);

            isLimitExceeded === false && this.dispatch('ElCheckboxGroup', 'input', [val]);
          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },

      isChecked: function isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },
      _checkboxGroup: function _checkboxGroup() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      store: function store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      activeStyle: function activeStyle() {
        return {
          backgroundColor: this._checkboxGroup.fill || '',
          borderColor: this._checkboxGroup.fill || '',
          color: this._checkboxGroup.textColor || '',
          'box-shadow': '-1px 0 0 0 ' + this._checkboxGroup.fill

        };
      },
      size: function size() {
        return this._checkboxGroup.size;
      }
    },
    methods: {
      addToStore: function addToStore() {
        if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange: function handleChange(ev) {
        var _this = this;

        this.$emit('change', ev);
        if (this._checkboxGroup) {
          this.$nextTick(function (_) {
            _this.dispatch('ElCheckboxGroup', 'change', [_this._checkboxGroup.value]);
          });
        }
      }
    },

    created: function created() {
      this.checked && this.addToStore();
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9DaGVja2JveC9DaGVja2JveEJ1dHRvbi5qcyJdLCJuYW1lcyI6WyJjaGVja2JveEJ1dHRvblRlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiZGF0YSIsInNlbGZNb2RlbCIsImZvY3VzIiwicHJvcHMiLCJ2YWx1ZSIsImxhYmVsIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwiY2hlY2tlZCIsIlN0cmluZyIsInRydWVMYWJlbCIsIk51bWJlciIsImZhbHNlTGFiZWwiLCJjb21wdXRlZCIsIm1vZGVsIiwiZ2V0IiwiX2NoZWNrYm94R3JvdXAiLCJzdG9yZSIsInVuZGVmaW5lZCIsInNldCIsInZhbCIsImlzTGltaXRFeGNlZWRlZCIsIm1pbiIsImxlbmd0aCIsIm1heCIsImRpc3BhdGNoIiwiJGVtaXQiLCJpc0NoZWNrZWQiLCJ0b1N0cmluZyIsImNhbGwiLCJBcnJheSIsImlzQXJyYXkiLCJpbmRleE9mIiwicGFyZW50IiwiJHBhcmVudCIsIiRvcHRpb25zIiwiY29tcG9uZW50TmFtZSIsImFjdGl2ZVN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZmlsbCIsImJvcmRlckNvbG9yIiwiY29sb3IiLCJ0ZXh0Q29sb3IiLCJzaXplIiwibWV0aG9kcyIsImFkZFRvU3RvcmUiLCJwdXNoIiwiaGFuZGxlQ2hhbmdlIiwiZXYiLCIkbmV4dFRpY2siLCJjcmVhdGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSw4K0JBQUo7O29CQTJDZTtBQUNiQyxVQUFNLGtCQURPOztBQUdiQyxjQUFVRixzQkFIRzs7QUFLYkcsWUFBUSxtQkFMSzs7QUFPYkMsUUFQYSxrQkFPTjtBQUNMLGFBQU87QUFDTEMsbUJBQVcsS0FETjtBQUVMQyxlQUFPO0FBRkYsT0FBUDtBQUlELEtBWlk7OztBQWNiQyxXQUFPO0FBQ0xDLGFBQU8sRUFERjtBQUVMQyxhQUFPLEVBRkY7QUFHTEMsZ0JBQVVDLE9BSEw7QUFJTEMsZUFBU0QsT0FK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QjtBQUNEO0FBbkVPLEtBdkJHO0FBNEZiQyxhQUFTO0FBQ1BDLGdCQURPLHdCQUNNO0FBQ1gsWUFDRWYsTUFBTUMsT0FBTixDQUFjLEtBQUtqQixLQUFuQixLQUNBLEtBQUtBLEtBQUwsQ0FBV2tCLE9BQVgsQ0FBbUIsS0FBSzNCLEtBQXhCLE1BQW1DLENBQUMsQ0FGdEMsRUFHRTtBQUNBLGVBQUtTLEtBQUwsQ0FBV2dDLElBQVgsQ0FBZ0IsS0FBS3pDLEtBQXJCO0FBQ0QsU0FMRCxNQUtPO0FBQ0wsZUFBS1MsS0FBTCxHQUFhLEtBQUtKLFNBQUwsSUFBa0IsSUFBL0I7QUFDRDtBQUNGLE9BVk07QUFXUHFDLGtCQVhPLHdCQVdNQyxFQVhOLEVBV1U7QUFBQTs7QUFDZixhQUFLdEIsS0FBTCxDQUFXLFFBQVgsRUFBcUJzQixFQUFyQjtBQUNBLFlBQUksS0FBS2hDLGNBQVQsRUFBeUI7QUFDdkIsZUFBS2lDLFNBQUwsQ0FBZSxhQUFLO0FBQ2xCLGtCQUFLeEIsUUFBTCxDQUFjLGlCQUFkLEVBQWlDLFFBQWpDLEVBQTJDLENBQUMsTUFBS1QsY0FBTCxDQUFvQlosS0FBckIsQ0FBM0M7QUFDRCxXQUZEO0FBR0Q7QUFDRjtBQWxCTSxLQTVGSTs7QUFpSGI4QyxXQWpIYSxxQkFpSEg7QUFDUixXQUFLMUMsT0FBTCxJQUFnQixLQUFLcUMsVUFBTCxFQUFoQjtBQUNEO0FBbkhZLEciLCJmaWxlIjoiYXBwL2F0b21zL0NoZWNrYm94L0NoZWNrYm94QnV0dG9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZWxlbWVudC11aS9zcmMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgY2hlY2tib3hCdXR0b25UZW1wbGF0ZSA9IGBcbjxsYWJlbFxuICBjbGFzcz1cImVsLWNoZWNrYm94LWJ1dHRvblwiXG4gICAgOmNsYXNzPVwiW1xuICAgICAgc2l6ZSA/ICdlbC1jaGVja2JveC1idXR0b24tLScgKyBzaXplIDogJycsXG4gICAgICB7ICdpcy1kaXNhYmxlZCc6IGRpc2FibGVkIH0sXG4gICAgICB7ICdpcy1jaGVja2VkJzogaXNDaGVja2VkIH0sXG4gICAgICB7ICdpcy1mb2N1cyc6IGZvY3VzIH0sXG4gICAgXVwiXG4gID5cbiAgPGlucHV0XG4gICAgdi1pZj1cInRydWVMYWJlbCB8fCBmYWxzZUxhYmVsXCJcbiAgICBjbGFzcz1cImVsLWNoZWNrYm94LWJ1dHRvbl9fb3JpZ2luYWxcIlxuICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgOm5hbWU9XCJuYW1lXCJcbiAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgOnRydWUtdmFsdWU9XCJ0cnVlTGFiZWxcIlxuICAgIDpmYWxzZS12YWx1ZT1cImZhbHNlTGFiZWxcIlxuICAgIHYtbW9kZWw9XCJtb2RlbFwiXG4gICAgQGNoYW5nZT1cImhhbmRsZUNoYW5nZVwiXG4gICAgQGZvY3VzPVwiZm9jdXMgPSB0cnVlXCJcbiAgICBAYmx1cj1cImZvY3VzID0gZmFsc2VcIj5cbiAgPGlucHV0XG4gICAgdi1lbHNlXG4gICAgY2xhc3M9XCJlbC1jaGVja2JveC1idXR0b25fX29yaWdpbmFsXCJcbiAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgIDpuYW1lPVwibmFtZVwiXG4gICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgIDp2YWx1ZT1cImxhYmVsXCJcbiAgICB2LW1vZGVsPVwibW9kZWxcIlxuICAgIEBjaGFuZ2U9XCJoYW5kbGVDaGFuZ2VcIlxuICAgIEBmb2N1cz1cImZvY3VzID0gdHJ1ZVwiXG4gICAgQGJsdXI9XCJmb2N1cyA9IGZhbHNlXCI+XG5cbiAgPHNwYW4gY2xhc3M9XCJlbC1jaGVja2JveC1idXR0b25fX2lubmVyXCIgXG4gICAgdi1pZj1cIiRzbG90cy5kZWZhdWx0IHx8IGxhYmVsXCJcbiAgICA6c3R5bGU9XCJpc0NoZWNrZWQgPyBhY3RpdmVTdHlsZSA6IG51bGxcIj5cbiAgICA8c2xvdD57e2xhYmVsfX08L3Nsb3Q+XG4gIDwvc3Bhbj5cblxuPC9sYWJlbD5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0VsQ2hlY2tib3hCdXR0b24nLFxuXG4gIHRlbXBsYXRlOiBjaGVja2JveEJ1dHRvblRlbXBsYXRlLFxuXG4gIG1peGluczogW0VtaXR0ZXJdLFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGZNb2RlbDogZmFsc2UsXG4gICAgICBmb2N1czogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IHt9LFxuICAgIGxhYmVsOiB7fSxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBjaGVja2VkOiBCb29sZWFuLFxuICAgIG5hbWU6IFN0cmluZyxcbiAgICB0cnVlTGFiZWw6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgZmFsc2VMYWJlbDogW1N0cmluZywgTnVtYmVyXVxuICB9LFxuICBjb21wdXRlZDoge1xuICAgIG1vZGVsOiB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGVja2JveEdyb3VwXG4gICAgICAgICAgPyB0aGlzLnN0b3JlIDogdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyB0aGlzLnZhbHVlIDogdGhpcy5zZWxmTW9kZWw7XG4gICAgICB9LFxuXG4gICAgICBzZXQodmFsKSB7XG4gICAgICAgIGlmICh0aGlzLl9jaGVja2JveEdyb3VwKSB7XG4gICAgICAgICAgbGV0IGlzTGltaXRFeGNlZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICh0aGlzLl9jaGVja2JveEdyb3VwLm1pbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWwubGVuZ3RoIDwgdGhpcy5fY2hlY2tib3hHcm91cC5taW4gJiZcbiAgICAgICAgICAgIChpc0xpbWl0RXhjZWVkZWQgPSB0cnVlKSk7XG5cbiAgICAgICAgICAodGhpcy5fY2hlY2tib3hHcm91cC5tYXggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsLmxlbmd0aCA+IHRoaXMuX2NoZWNrYm94R3JvdXAubWF4ICYmXG4gICAgICAgICAgICAoaXNMaW1pdEV4Y2VlZGVkID0gdHJ1ZSkpO1xuXG4gICAgICAgICAgaXNMaW1pdEV4Y2VlZGVkID09PSBmYWxzZSAmJlxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goJ0VsQ2hlY2tib3hHcm91cCcsICdpbnB1dCcsIFt2YWxdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZWxmTW9kZWwgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNDaGVja2VkKCkge1xuICAgICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwodGhpcy5tb2RlbCkgPT09ICdbb2JqZWN0IEJvb2xlYW5dJykge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLm1vZGVsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5pbmRleE9mKHRoaXMubGFiZWwpID4gLTE7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZWwgIT09IG51bGwgJiYgdGhpcy5tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsID09PSB0aGlzLnRydWVMYWJlbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoZWNrYm94R3JvdXAoKSB7XG4gICAgICBsZXQgcGFyZW50ID0gdGhpcy4kcGFyZW50O1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRvcHRpb25zLmNvbXBvbmVudE5hbWUgIT09ICdFbENoZWNrYm94R3JvdXAnKSB7XG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdG9yZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGVja2JveEdyb3VwID8gdGhpcy5fY2hlY2tib3hHcm91cC52YWx1ZSA6IHRoaXMudmFsdWU7XG4gICAgfSxcblxuICAgIGFjdGl2ZVN0eWxlKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLl9jaGVja2JveEdyb3VwLmZpbGwgfHwgJycsXG4gICAgICAgIGJvcmRlckNvbG9yOiB0aGlzLl9jaGVja2JveEdyb3VwLmZpbGwgfHwgJycsXG4gICAgICAgIGNvbG9yOiB0aGlzLl9jaGVja2JveEdyb3VwLnRleHRDb2xvciB8fCAnJyxcbiAgICAgICAgJ2JveC1zaGFkb3cnOiAnLTFweCAwIDAgMCAnICsgdGhpcy5fY2hlY2tib3hHcm91cC5maWxsXG5cbiAgICAgIH07XG4gICAgfSxcblxuICAgIHNpemUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hlY2tib3hHcm91cC5zaXplO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGFkZFRvU3RvcmUoKSB7XG4gICAgICBpZiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkodGhpcy5tb2RlbCkgJiZcbiAgICAgICAgdGhpcy5tb2RlbC5pbmRleE9mKHRoaXMubGFiZWwpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubW9kZWwucHVzaCh0aGlzLmxhYmVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSB0aGlzLnRydWVMYWJlbCB8fCB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2hhbmdlKGV2KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBldik7XG4gICAgICBpZiAodGhpcy5fY2hlY2tib3hHcm91cCkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayhfID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKCdFbENoZWNrYm94R3JvdXAnLCAnY2hhbmdlJywgW3RoaXMuX2NoZWNrYm94R3JvdXAudmFsdWVdKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGNyZWF0ZWQoKSB7XG4gICAgdGhpcy5jaGVja2VkICYmIHRoaXMuYWRkVG9TdG9yZSgpO1xuICB9XG59O1xuXG4iXX0=
