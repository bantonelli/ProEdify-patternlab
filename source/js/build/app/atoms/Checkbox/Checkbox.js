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

  var checkboxTemplate = '\n<div \n  class="checkbox" \n  :class="[\n    modifierStyles, \n    {      \n      \'is-disabled\': disabled,\n      \'is-checked\': isChecked,\n      \'is-indeterminate\': indeterminate,\n      \'is-focus\': focus\n    }\n  ]"\n>\n    <input \n      v-if="trueLabel || falseLabel"\n      class="checkbox__input" \n      type="checkbox" \n      :id="id"  \n      :name="name"\n      :disabled="disabled"\n      :true-value="trueLabel"\n      :false-value="falseLabel" \n      v-model="model"   \n      @change="handleChange"          \n      @focus="focus = true"\n      @blur="focus = false"\n    >\n    <input\n      v-else\n      class="checkbox__input"\n      type="checkbox"\n      :id="id" \n      :disabled="disabled"\n      :value="label"\n      :name="name"\n      v-model="model"\n      @change="handleChange"\n      @focus="focus = true"\n      @blur="focus = false"\n    >    \n    <label \n      v-if="$slots.default || label"\n      class="checkbox__label" \n      :for="id"\n    >        \n      <span>\n        <slot></slot>\n        <template v-if="!$slots.default">{{label}}</template>\n      </span>\n    </label>\n</div>\n';

  exports.default = {
    name: 'Checkbox',

    template: checkboxTemplate,

    mixins: [_emitter2.default],

    componentName: 'Checkbox',

    data: function data() {
      return {
        selfModel: false,
        focus: false
      };
    },


    computed: {
      model: {
        get: function get() {
          // If group return the store
          // Store would be the groups model array 
          return this.isGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
        },
        set: function set(val) {
          // Model prop is updated upon native @input of checkbox
          // it uses the groups model or its own dynamically                  

          // if using group emit input on group and let v-model 
          // handle addition or removal of :value from array.                  

          // console.log("Setting model", val);
          // gets the model of the checkbox 
          if (this.isGroup) {
            // this.model is an array if group            
            // console.log("Setting model as group");
            var isLimitExceeded = false;
            this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (isLimitExceeded = true);

            this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (isLimitExceeded = true);

            // if limit isn't exceeded dispatch @input to group
            // model will then be updated on group 
            // which will then propogate to the checkbox via store.  
            isLimitExceeded === false && this.dispatch('CheckboxGroup', 'input', [val]);
          } else if (this.value !== undefined) {
            // If not group and doesn't have trueLabel||falseLabel
            // console.log("Setting model as single", val);
            this.$emit('input', val);
          } else {
            // If not group and has trueLabel||falseLabel
            this.selfModel = val;
          }
        }
      },

      isChecked: function isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          // If single check model will be boolean. 
          return this.model;
        } else if (Array.isArray(this.model)) {
          // If check group model will be array including its label  
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },
      isGroup: function isGroup() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'CheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      store: function store() {
        // Return either the groups model or the single's model. 
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },

    props: {
      id: String,
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      modifierStyles: {
        type: Array,
        default: null
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

        if (this.isGroup) {
          this.$nextTick(function (_) {
            // console.log("change update value: ", this._checkboxGroup.value);
            // Send updated group value through change event 
            // parent form will react to @change of group  
            _this.dispatch('CheckboxGroup', 'change', [_this._checkboxGroup.value]);
          });
        } else {
          this.$emit('change', ev);
        }
      }
    },

    created: function created() {
      this.checked && this.addToStore();
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9DaGVja2JveC9DaGVja2JveC5qcyJdLCJuYW1lcyI6WyJjaGVja2JveFRlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiY29tcG9uZW50TmFtZSIsImRhdGEiLCJzZWxmTW9kZWwiLCJmb2N1cyIsImNvbXB1dGVkIiwibW9kZWwiLCJnZXQiLCJpc0dyb3VwIiwic3RvcmUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInNldCIsInZhbCIsImlzTGltaXRFeGNlZWRlZCIsIl9jaGVja2JveEdyb3VwIiwibWluIiwibGVuZ3RoIiwibWF4IiwiZGlzcGF0Y2giLCIkZW1pdCIsImlzQ2hlY2tlZCIsInRvU3RyaW5nIiwiY2FsbCIsIkFycmF5IiwiaXNBcnJheSIsImluZGV4T2YiLCJsYWJlbCIsInRydWVMYWJlbCIsInBhcmVudCIsIiRwYXJlbnQiLCIkb3B0aW9ucyIsInByb3BzIiwiaWQiLCJTdHJpbmciLCJpbmRldGVybWluYXRlIiwiQm9vbGVhbiIsImRpc2FibGVkIiwiY2hlY2tlZCIsIk51bWJlciIsImZhbHNlTGFiZWwiLCJtb2RpZmllclN0eWxlcyIsInR5cGUiLCJkZWZhdWx0IiwibWV0aG9kcyIsImFkZFRvU3RvcmUiLCJwdXNoIiwiaGFuZGxlQ2hhbmdlIiwiZXYiLCIkbmV4dFRpY2siLCJjcmVhdGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSw0b0NBQUo7O29CQXFEZTtBQUNiQyxVQUFNLFVBRE87O0FBR2JDLGNBQVVGLGdCQUhHOztBQUtiRyxZQUFRLG1CQUxLOztBQU9iQyxtQkFBZSxVQVBGOztBQVNiQyxRQVRhLGtCQVNOO0FBQ0wsYUFBTztBQUNMQyxtQkFBVyxLQUROO0FBRUxDLGVBQU87QUFGRixPQUFQO0FBSUQsS0FkWTs7O0FBZ0JiQyxjQUFVO0FBQ1JDLGFBQU87QUFDTEMsV0FESyxpQkFDQztBQUNKO0FBQ0U7QUFDRixpQkFBTyxLQUFLQyxPQUFMLEdBQ0gsS0FBS0MsS0FE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QUtBLEtBQUwsQ0FBV29CLE9BQVgsQ0FBbUIsS0FBS0MsS0FBeEIsTUFBbUMsQ0FBQyxDQUZ0QyxFQUdFO0FBQ0EsZUFBS3JCLEtBQUwsQ0FBV3dDLElBQVgsQ0FBZ0IsS0FBS25CLEtBQXJCO0FBQ0QsU0FMRCxNQUtPO0FBQ0wsZUFBS3JCLEtBQUwsR0FBYSxLQUFLc0IsU0FBTCxJQUFrQixJQUEvQjtBQUNEO0FBQ0YsT0FWTTtBQVdQbUIsa0JBWE8sd0JBV01DLEVBWE4sRUFXVTtBQUFBOztBQUNmLFlBQUksS0FBS3hDLE9BQVQsRUFBa0I7QUFDaEIsZUFBS3lDLFNBQUwsQ0FBZSxhQUFLO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGtCQUFLOUIsUUFBTCxDQUFjLGVBQWQsRUFBK0IsUUFBL0IsRUFBeUMsQ0FBQyxNQUFLSixjQUFMLENBQW9CTCxLQUFyQixDQUF6QztBQUNELFdBTEQ7QUFNRCxTQVBELE1BT087QUFDTCxlQUFLVSxLQUFMLENBQVcsUUFBWCxFQUFxQjRCLEVBQXJCO0FBQ0Q7QUFDRjtBQXRCTSxLQS9HSTs7QUF3SWJFLFdBeElhLHFCQXdJSDtBQUNSLFdBQUtaLE9BQUwsSUFBZ0IsS0FBS08sVUFBTCxFQUFoQjtBQUNEO0FBMUlZLEciLCJmaWxlIjoiYXBwL2F0b21zL0NoZWNrYm94L0NoZWNrYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgY2hlY2tib3hUZW1wbGF0ZSA9IGBcbjxkaXYgXG4gIGNsYXNzPVwiY2hlY2tib3hcIiBcbiAgOmNsYXNzPVwiW1xuICAgIG1vZGlmaWVyU3R5bGVzLCBcbiAgICB7ICAgICAgXG4gICAgICAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZCxcbiAgICAgICdpcy1jaGVja2VkJzogaXNDaGVja2VkLFxuICAgICAgJ2lzLWluZGV0ZXJtaW5hdGUnOiBpbmRldGVybWluYXRlLFxuICAgICAgJ2lzLWZvY3VzJzogZm9jdXNcbiAgICB9XG4gIF1cIlxuPlxuICAgIDxpbnB1dCBcbiAgICAgIHYtaWY9XCJ0cnVlTGFiZWwgfHwgZmFsc2VMYWJlbFwiXG4gICAgICBjbGFzcz1cImNoZWNrYm94X19pbnB1dFwiIFxuICAgICAgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICA6aWQ9XCJpZFwiICBcbiAgICAgIDpuYW1lPVwibmFtZVwiXG4gICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgICA6dHJ1ZS12YWx1ZT1cInRydWVMYWJlbFwiXG4gICAgICA6ZmFsc2UtdmFsdWU9XCJmYWxzZUxhYmVsXCIgXG4gICAgICB2LW1vZGVsPVwibW9kZWxcIiAgIFxuICAgICAgQGNoYW5nZT1cImhhbmRsZUNoYW5nZVwiICAgICAgICAgIFxuICAgICAgQGZvY3VzPVwiZm9jdXMgPSB0cnVlXCJcbiAgICAgIEBibHVyPVwiZm9jdXMgPSBmYWxzZVwiXG4gICAgPlxuICAgIDxpbnB1dFxuICAgICAgdi1lbHNlXG4gICAgICBjbGFzcz1cImNoZWNrYm94X19pbnB1dFwiXG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgOmlkPVwiaWRcIiBcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgIDp2YWx1ZT1cImxhYmVsXCJcbiAgICAgIDpuYW1lPVwibmFtZVwiXG4gICAgICB2LW1vZGVsPVwibW9kZWxcIlxuICAgICAgQGNoYW5nZT1cImhhbmRsZUNoYW5nZVwiXG4gICAgICBAZm9jdXM9XCJmb2N1cyA9IHRydWVcIlxuICAgICAgQGJsdXI9XCJmb2N1cyA9IGZhbHNlXCJcbiAgICA+ICAgIFxuICAgIDxsYWJlbCBcbiAgICAgIHYtaWY9XCIkc2xvdHMuZGVmYXVsdCB8fCBsYWJlbFwiXG4gICAgICBjbGFzcz1cImNoZWNrYm94X19sYWJlbFwiIFxuICAgICAgOmZvcj1cImlkXCJcbiAgICA+ICAgICAgICBcbiAgICAgIDxzcGFuPlxuICAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwiISRzbG90cy5kZWZhdWx0XCI+e3tsYWJlbH19PC90ZW1wbGF0ZT5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdDaGVja2JveCcsXG5cbiAgdGVtcGxhdGU6IGNoZWNrYm94VGVtcGxhdGUsIFxuXG4gIG1peGluczogW0VtaXR0ZXJdLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdDaGVja2JveCcsXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZk1vZGVsOiBmYWxzZSxcbiAgICAgIGZvY3VzOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBtb2RlbDoge1xuICAgICAgZ2V0KCkge1xuICAgICAgICAvLyBJZiBncm91cCByZXR1cm4gdGhlIHN0b3JlXG4gICAgICAgICAgLy8gU3RvcmUgd291bGQgYmUgdGhlIGdyb3VwcyBtb2RlbCBhcnJheSBcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNHcm91cFxuICAgICAgICAgID8gdGhpcy5zdG9yZSA6IHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gdGhpcy52YWx1ZSA6IHRoaXMuc2VsZk1vZGVsOyAgICAgICAgICAgIFxuICAgICAgfSxcblxuICAgICAgc2V0KHZhbCkge1xuICAgICAgICAvLyBNb2RlbCBwcm9wIGlzIHVwZGF0ZWQgdXBvbiBuYXRpdmUgQGlucHV0IG9mIGNoZWNrYm94XG4gICAgICAgICAgLy8gaXQgdXNlcyB0aGUgZ3JvdXBzIG1vZGVsIG9yIGl0cyBvd24gZHluYW1pY2FsbHkgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAvLyBpZiB1c2luZyBncm91cCBlbWl0IGlucHV0IG9uIGdyb3VwIGFuZCBsZXQgdi1tb2RlbCBcbiAgICAgICAgLy8gaGFuZGxlIGFkZGl0aW9uIG9yIHJlbW92YWwgb2YgOnZhbHVlIGZyb20gYXJyYXkuICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTZXR0aW5nIG1vZGVsXCIsIHZhbCk7XG4gICAgICAgIC8vIGdldHMgdGhlIG1vZGVsIG9mIHRoZSBjaGVja2JveCBcbiAgICAgICAgaWYgKHRoaXMuaXNHcm91cCkge1xuICAgICAgICAgIC8vIHRoaXMubW9kZWwgaXMgYW4gYXJyYXkgaWYgZ3JvdXAgICAgICAgICAgICBcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNldHRpbmcgbW9kZWwgYXMgZ3JvdXBcIik7XG4gICAgICAgICAgbGV0IGlzTGltaXRFeGNlZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICh0aGlzLl9jaGVja2JveEdyb3VwLm1pbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWwubGVuZ3RoIDwgdGhpcy5fY2hlY2tib3hHcm91cC5taW4gJiZcbiAgICAgICAgICAgIChpc0xpbWl0RXhjZWVkZWQgPSB0cnVlKSk7XG5cbiAgICAgICAgICAodGhpcy5fY2hlY2tib3hHcm91cC5tYXggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsLmxlbmd0aCA+IHRoaXMuX2NoZWNrYm94R3JvdXAubWF4ICYmXG4gICAgICAgICAgICAoaXNMaW1pdEV4Y2VlZGVkID0gdHJ1ZSkpO1xuXG4gICAgICAgICAgLy8gaWYgbGltaXQgaXNuJ3QgZXhjZWVkZWQgZGlzcGF0Y2ggQGlucHV0IHRvIGdyb3VwXG4gICAgICAgICAgLy8gbW9kZWwgd2lsbCB0aGVuIGJlIHVwZGF0ZWQgb24gZ3JvdXAgXG4gICAgICAgICAgLy8gd2hpY2ggd2lsbCB0aGVuIHByb3BvZ2F0ZSB0byB0aGUgY2hlY2tib3ggdmlhIHN0b3JlLiAgXG4gICAgICAgICAgaXNMaW1pdEV4Y2VlZGVkID09PSBmYWxzZSAmJlxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goJ0NoZWNrYm94R3JvdXAnLCAnaW5wdXQnLCBbdmFsXSk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBJZiBub3QgZ3JvdXAgYW5kIGRvZXNuJ3QgaGF2ZSB0cnVlTGFiZWx8fGZhbHNlTGFiZWxcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNldHRpbmcgbW9kZWwgYXMgc2luZ2xlXCIsIHZhbCk7XG4gICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIG5vdCBncm91cCBhbmQgaGFzIHRydWVMYWJlbHx8ZmFsc2VMYWJlbFxuICAgICAgICAgIHRoaXMuc2VsZk1vZGVsID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzQ2hlY2tlZCgpIHtcbiAgICAgIGlmICh7fS50b1N0cmluZy5jYWxsKHRoaXMubW9kZWwpID09PSAnW29iamVjdCBCb29sZWFuXScpIHtcbiAgICAgICAgLy8gSWYgc2luZ2xlIGNoZWNrIG1vZGVsIHdpbGwgYmUgYm9vbGVhbi4gXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMubW9kZWwpKSB7XG4gICAgICAgIC8vIElmIGNoZWNrIGdyb3VwIG1vZGVsIHdpbGwgYmUgYXJyYXkgaW5jbHVkaW5nIGl0cyBsYWJlbCAgXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmluZGV4T2YodGhpcy5sYWJlbCkgPiAtMTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlbCAhPT0gbnVsbCAmJiB0aGlzLm1vZGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwgPT09IHRoaXMudHJ1ZUxhYmVsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0dyb3VwKCkge1xuICAgICAgbGV0IHBhcmVudCA9IHRoaXMuJHBhcmVudDtcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKHBhcmVudC4kb3B0aW9ucy5jb21wb25lbnROYW1lICE9PSAnQ2hlY2tib3hHcm91cCcpIHtcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jaGVja2JveEdyb3VwID0gcGFyZW50O1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIHN0b3JlKCkge1xuICAgICAgLy8gUmV0dXJuIGVpdGhlciB0aGUgZ3JvdXBzIG1vZGVsIG9yIHRoZSBzaW5nbGUncyBtb2RlbC4gXG4gICAgICByZXR1cm4gdGhpcy5fY2hlY2tib3hHcm91cCA/IHRoaXMuX2NoZWNrYm94R3JvdXAudmFsdWUgOiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgfSxcblxuICBwcm9wczoge1xuICAgIGlkOiBTdHJpbmcsXG4gICAgdmFsdWU6IHt9LFxuICAgIGxhYmVsOiB7fSxcbiAgICBpbmRldGVybWluYXRlOiBCb29sZWFuLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGNoZWNrZWQ6IEJvb2xlYW4sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIHRydWVMYWJlbDogW1N0cmluZywgTnVtYmVyXSxcbiAgICBmYWxzZUxhYmVsOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRUb1N0b3JlKCkge1xuICAgICAgaWYgKFxuICAgICAgICBBcnJheS5pc0FycmF5KHRoaXMubW9kZWwpICYmXG4gICAgICAgIHRoaXMubW9kZWwuaW5kZXhPZih0aGlzLmxhYmVsKSA9PT0gLTFcbiAgICAgICkge1xuICAgICAgICB0aGlzLm1vZGVsLnB1c2godGhpcy5sYWJlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vZGVsID0gdGhpcy50cnVlTGFiZWwgfHwgdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZUNoYW5nZShldikgeyAgICAgICAgXG4gICAgICBpZiAodGhpcy5pc0dyb3VwKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKF8gPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hhbmdlIHVwZGF0ZSB2YWx1ZTogXCIsIHRoaXMuX2NoZWNrYm94R3JvdXAudmFsdWUpO1xuICAgICAgICAgIC8vIFNlbmQgdXBkYXRlZCBncm91cCB2YWx1ZSB0aHJvdWdoIGNoYW5nZSBldmVudCBcbiAgICAgICAgICAvLyBwYXJlbnQgZm9ybSB3aWxsIHJlYWN0IHRvIEBjaGFuZ2Ugb2YgZ3JvdXAgIFxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goJ0NoZWNrYm94R3JvdXAnLCAnY2hhbmdlJywgW3RoaXMuX2NoZWNrYm94R3JvdXAudmFsdWVdKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBldik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgY3JlYXRlZCgpIHtcbiAgICB0aGlzLmNoZWNrZWQgJiYgdGhpcy5hZGRUb1N0b3JlKCk7XG4gIH1cbn07XG5cbiJdfQ==
