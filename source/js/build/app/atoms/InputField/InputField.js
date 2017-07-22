define(['exports', '../../utils/mixins/emitter', './calcTextareaHeight', '../../utils/merge', '../Input', '../TextArea', 'lodash'], function (exports, _emitter, _calcTextareaHeight, _merge, _Input, _TextArea, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  var _calcTextareaHeight2 = _interopRequireDefault(_calcTextareaHeight);

  var _merge2 = _interopRequireDefault(_merge);

  var _Input2 = _interopRequireDefault(_Input);

  var _TextArea2 = _interopRequireDefault(_TextArea);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var inputFieldTemplate2 = '\n<div :class="[type === \'textarea\' ? \'text-area-field\' : \'input-field\',\n  {\n    \'input-field--appended\': $slots.append,\n    \'input-field--prepended\': $slots.prepend,\n  },\n  {\n    \'is-disabled\': disabled\n  }\n]">\n  <template v-if="type !== \'textarea\'">\n    <!-- Prepend Slot -->\n    <div class="input-field__prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </div>\n\n    <input-component\n      :parent-props="parentProps"\n      :modifier-styles="modifierStyles"\n      :is-valid="isValid"\n      :is-invalid="isInvalid"      \n      ref="inputComponent"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n      >\n        <!-- input icon -->\n        <template v-if="icon" slot="icon">\n          <i class="input__icon icon-loading" v-if="validating"></i>\n          <i \n            v-else\n            class="input__icon"\n            :class="[\n              icon,\n              onIconClick ? \'is-clickable\' : \'\'\n            ]" \n            slot="icon"        \n            @click="handleIconClick"\n          ></i>\n        </template>\n    </input-component>          \n    \n    <!-- Append Slot -->\n    <div class="input-field__append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </div>\n  </template>\n  <template v-else>\n    <text-area\n      ref="textarea"\n      :parent-props="parentProps"\n      :modifier-styles="modifierStyles"\n      :is-valid="isValid"\n      :is-invalid="isInvalid"\n      :styles="textareaStyle"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n      >\n    </text-area>\n  </template>\n</div>\n';

  exports.default = {
    name: 'InputField',

    componentName: 'InputField',

    template: inputFieldTemplate2,

    mixins: [_emitter2.default],

    components: {
      'input-component': _Input2.default,
      'text-area': _TextArea2.default
    },

    data: function data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },


    props: {
      value: [String, Number],
      placeholder: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      autocapitalize: {
        type: String,
        default: "off"
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      modifierStyles: {
        type: Array,
        default: null
      }
    },

    computed: {
      validating: function validating() {
        return this.$parent.validateState === 'validating';
        // return true;
      },
      textareaStyle: function textareaStyle() {
        // This computed prop is bound to the :style attribute of <textarea>

        return (0, _merge2.default)({}, this.textareaCalcStyle, { resize: this.resize });
      },
      parentProps: function parentProps() {
        // let newObject = this.$props;
        // for(var prop in this.$props) {
        //     if(prop === "modifierStyles"){

        //     }          
        // }
        return _lodash2.default.omit(this.$props, ['modifierStyles']);
      },
      isValid: function isValid() {
        if (this.$parent.validateState) {
          // For normal inputs 
          // form-item >> input-field
          return this.$parent.validateState === 'success';
        } else if (this.$parent.$parent.validateState) {
          // For select component 
          // form-item >> select >> input-field
          return this.$parent.$parent.validateState === 'success';
        } else {
          return false;
        }
      },
      isInvalid: function isInvalid() {
        if (this.$parent.validateState) {
          // For normal inputs 
          // form-item >> input-field
          return this.$parent.validateState === 'error';
        } else if (this.$parent.$parent.validateState) {
          // For select component 
          // form-item >> select >> input-field
          return this.$parent.$parent.validateState === 'error';
        } else {
          return false;
        }
      }
    },

    watch: {
      'value': function value(val, oldValue) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      handleBlur: function handleBlur(event) {
        // emit a normal blur event 
        this.$emit('blur', event);

        if (this.validateEvent) {
          // Upon validation event dispatch the currentValue to the parent form 
          this.dispatch('FormItem', 'form.blur', [this.currentValue]);
        }
      },
      inputSelect: function inputSelect() {
        // select the DOM <input> 
        // using a Vue ref for easy DOM selection 
        this.$refs.inputComponent.select();
      },
      resizeTextarea: function resizeTextarea() {
        // method to calculate text area size 
        // console.log("***** Called RESIZE *********");
        // if on server stop execution 
        if (this.$isServer) return;

        // grab the autosize and type props from this current component 
        var autosize = this.autosize,
            type = this.type;


        // If autosize==false or type is not 'textarea' stop execution
        if (!autosize || type !== 'textarea') return;
        var minRows = autosize.minRows;
        var maxRows = autosize.maxRows;
        // console.log("***** CALCULATE HEIGHT *********");
        // Update dataProp textareaCalcStyle with new text area height. 
        // console.log(this.$refs.textarea.$refs.input);
        this.textareaCalcStyle = (0, _calcTextareaHeight2.default)(this.$refs.textarea.$refs.input, minRows, maxRows);
        // console.log("*** textareaCalcStyle: ", this.textareaCalcStyle.height);
      },
      handleFocus: function handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput: function handleInput(event) {
        var value = void 0;
        if (event.target) {
          value = event.target.value;
        } else {
          value = event;
        }
        // console.log("PARENT PROPS: ", this.parentProps);
        // console.log("PROPS: ", this.$props);
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleIconClick: function handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue: function setCurrentValue(value) {
        var _this = this;

        if (value === this.currentValue) return;
        this.$nextTick(function (_) {
          _this.resizeTextarea();
        });
        // this.resizeTextarea();
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('FormItem', 'form.change', [value]);
        }
      }
    },

    created: function created() {
      this.$on('inputSelect', this.inputSelect);
    },
    mounted: function mounted() {
      this.resizeTextarea();
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dEZpZWxkL0lucHV0RmllbGQuanMiXSwibmFtZXMiOlsiaW5wdXRGaWVsZFRlbXBsYXRlMiIsIm5hbWUiLCJjb21wb25lbnROYW1lIiwidGVtcGxhdGUiLCJtaXhpbnMiLCJjb21wb25lbnRzIiwiZGF0YSIsImN1cnJlbnRWYWx1ZSIsInZhbHVlIiwidGV4dGFyZWFDYWxjU3R5bGUiLCJwcm9wcyIsIlN0cmluZyIsIk51bWJlciIsInBsYWNlaG9sZGVyIiwicmVzaXplIiwicmVhZG9ubHkiLCJCb29sZWFuIiwiYXV0b2ZvY3VzIiwiaWNvbiIsImRpc2FibGVkIiwidHlwZSIsImRlZmF1bHQiLCJhdXRvc2l6ZSIsIk9iamVjdCIsInJvd3MiLCJhdXRvQ29tcGxldGUiLCJhdXRvY2FwaXRhbGl6ZSIsImZvcm0iLCJtYXhsZW5ndGgiLCJtaW5sZW5ndGgiLCJtYXgiLCJtaW4iLCJzdGVwIiwidmFsaWRhdGVFdmVudCIsIm9uSWNvbkNsaWNrIiwiRnVuY3Rpb24iLCJtb2RpZmllclN0eWxlcyIsIkFycmF5IiwiY29tcHV0ZWQiLCJ2YWxpZGF0aW5nIiwiJHBhcmVudCIsInZhbGlkYXRlU3RhdGUiLCJ0ZXh0YXJlYVN0eWxlIiwicGFyZW50UHJvcHMiLCJvbWl0IiwiJHByb3BzIiwiaXNWYWxpZCIsImlzSW52YWxpZCIsIndhdGNoIiwidmFsIiwib2xkVmFsdWUiLCJzZXRDdXJyZW50VmFsdWUiLCJtZXRob2RzIiwiaGFuZGxlQmx1ciIsImV2ZW50IiwiJGVtaXQiLCJkaXNwYXRjaCIsImlucHV0U2VsZWN0IiwiJHJlZnMiLCJpbnB1dENvbXBvbmVudCIsInNlbGVjdCIsInJlc2l6ZVRleHRhcmVhIiwiJGlzU2VydmVyIiwibWluUm93cyIsIm1heFJvd3MiLCJ0ZXh0YXJlYSIsImlucHV0IiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVJbnB1dCIsInRhcmdldCIsImhhbmRsZUljb25DbGljayIsIiRuZXh0VGljayIsImNyZWF0ZWQiLCIkb24i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LGNBQUw7QUFDRDtBQXJNWSxHIiwiZmlsZSI6ImFwcC9hdG9tcy9JbnB1dEZpZWxkL0lucHV0RmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpbnB1dEZpZWxkVGVtcGxhdGUyID0gYFxuPGRpdiA6Y2xhc3M9XCJbdHlwZSA9PT0gJ3RleHRhcmVhJyA/ICd0ZXh0LWFyZWEtZmllbGQnIDogJ2lucHV0LWZpZWxkJyxcbiAge1xuICAgICdpbnB1dC1maWVsZC0tYXBwZW5kZWQnOiAkc2xvdHMuYXBwZW5kLFxuICAgICdpbnB1dC1maWVsZC0tcHJlcGVuZGVkJzogJHNsb3RzLnByZXBlbmQsXG4gIH0sXG4gIHtcbiAgICAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZFxuICB9XG5dXCI+XG4gIDx0ZW1wbGF0ZSB2LWlmPVwidHlwZSAhPT0gJ3RleHRhcmVhJ1wiPlxuICAgIDwhLS0gUHJlcGVuZCBTbG90IC0tPlxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZF9fcHJlcGVuZFwiIHYtaWY9XCIkc2xvdHMucHJlcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cInByZXBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG5cbiAgICA8aW5wdXQtY29tcG9uZW50XG4gICAgICA6cGFyZW50LXByb3BzPVwicGFyZW50UHJvcHNcIlxuICAgICAgOm1vZGlmaWVyLXN0eWxlcz1cIm1vZGlmaWVyU3R5bGVzXCJcbiAgICAgIDppcy12YWxpZD1cImlzVmFsaWRcIlxuICAgICAgOmlzLWludmFsaWQ9XCJpc0ludmFsaWRcIiAgICAgIFxuICAgICAgcmVmPVwiaW5wdXRDb21wb25lbnRcIlxuICAgICAgQGlucHV0PVwiaGFuZGxlSW5wdXRcIlxuICAgICAgQGZvY3VzPVwiaGFuZGxlRm9jdXNcIlxuICAgICAgQGJsdXI9XCJoYW5kbGVCbHVyXCJcbiAgICAgID5cbiAgICAgICAgPCEtLSBpbnB1dCBpY29uIC0tPlxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImljb25cIiBzbG90PVwiaWNvblwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwiaW5wdXRfX2ljb24gaWNvbi1sb2FkaW5nXCIgdi1pZj1cInZhbGlkYXRpbmdcIj48L2k+XG4gICAgICAgICAgPGkgXG4gICAgICAgICAgICB2LWVsc2VcbiAgICAgICAgICAgIGNsYXNzPVwiaW5wdXRfX2ljb25cIlxuICAgICAgICAgICAgOmNsYXNzPVwiW1xuICAgICAgICAgICAgICBpY29uLFxuICAgICAgICAgICAgICBvbkljb25DbGljayA/ICdpcy1jbGlja2FibGUnIDogJydcbiAgICAgICAgICAgIF1cIiBcbiAgICAgICAgICAgIHNsb3Q9XCJpY29uXCIgICAgICAgIFxuICAgICAgICAgICAgQGNsaWNrPVwiaGFuZGxlSWNvbkNsaWNrXCJcbiAgICAgICAgICA+PC9pPlxuICAgICAgICA8L3RlbXBsYXRlPlxuICAgIDwvaW5wdXQtY29tcG9uZW50PiAgICAgICAgICBcbiAgICBcbiAgICA8IS0tIEFwcGVuZCBTbG90IC0tPlxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZF9fYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJhcHBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gIDwvdGVtcGxhdGU+XG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XG4gICAgPHRleHQtYXJlYVxuICAgICAgcmVmPVwidGV4dGFyZWFcIlxuICAgICAgOnBhcmVudC1wcm9wcz1cInBhcmVudFByb3BzXCJcbiAgICAgIDptb2RpZmllci1zdHlsZXM9XCJtb2RpZmllclN0eWxlc1wiXG4gICAgICA6aXMtdmFsaWQ9XCJpc1ZhbGlkXCJcbiAgICAgIDppcy1pbnZhbGlkPVwiaXNJbnZhbGlkXCJcbiAgICAgIDpzdHlsZXM9XCJ0ZXh0YXJlYVN0eWxlXCJcbiAgICAgIEBpbnB1dD1cImhhbmRsZUlucHV0XCJcbiAgICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgICA+XG4gICAgPC90ZXh0LWFyZWE+XG4gIDwvdGVtcGxhdGU+XG48L2Rpdj5cbmA7XG5cbmltcG9ydCBlbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBjYWxjVGV4dGFyZWFIZWlnaHQgZnJvbSAnLi9jYWxjVGV4dGFyZWFIZWlnaHQnO1xuaW1wb3J0IG1lcmdlIGZyb20gJy4uLy4uL3V0aWxzL21lcmdlJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9JbnB1dCc7XG5pbXBvcnQgVGV4dEFyZWEgZnJvbSAnLi4vVGV4dEFyZWEnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnSW5wdXRGaWVsZCcsXG5cbiAgY29tcG9uZW50TmFtZTogJ0lucHV0RmllbGQnLFxuXG4gIHRlbXBsYXRlOiBpbnB1dEZpZWxkVGVtcGxhdGUyLCBcblxuICBtaXhpbnM6IFtlbWl0dGVyXSxcblxuICBjb21wb25lbnRzOiB7XG4gICAgJ2lucHV0LWNvbXBvbmVudCc6IElucHV0LFxuICAgICd0ZXh0LWFyZWEnOiBUZXh0QXJlYVxuICB9LFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgIHRleHRhcmVhQ2FsY1N0eWxlOiB7fVxuICAgIH07XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICB2YWx1ZTogW1N0cmluZywgTnVtYmVyXSxcbiAgICBwbGFjZWhvbGRlcjogU3RyaW5nLFxuICAgIHJlc2l6ZTogU3RyaW5nLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIGF1dG9mb2N1czogQm9vbGVhbixcbiAgICBpY29uOiBTdHJpbmcsXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3RleHQnXG4gICAgfSxcbiAgICBuYW1lOiBTdHJpbmcsXG4gICAgYXV0b3NpemU6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBPYmplY3RdLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHJvd3M6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDJcbiAgICB9LFxuICAgIGF1dG9Db21wbGV0ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ29mZidcbiAgICB9LFxuICAgIGF1dG9jYXBpdGFsaXplOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiBcIm9mZlwiXG4gICAgfSxcbiAgICBmb3JtOiBTdHJpbmcsXG4gICAgbWF4bGVuZ3RoOiBOdW1iZXIsXG4gICAgbWlubGVuZ3RoOiBOdW1iZXIsXG4gICAgbWF4OiB7fSxcbiAgICBtaW46IHt9LFxuICAgIHN0ZXA6IHt9LFxuICAgIHZhbGlkYXRlRXZlbnQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBvbkljb25DbGljazogRnVuY3Rpb24sXG4gICAgbW9kaWZpZXJTdHlsZXM6IHtcbiAgICAgIHR5cGU6IEFycmF5LCBcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICB2YWxpZGF0aW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC52YWxpZGF0ZVN0YXRlID09PSAndmFsaWRhdGluZyc7XG4gICAgICAvLyByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHRleHRhcmVhU3R5bGUoKSB7XG4gICAgICAvLyBUaGlzIGNvbXB1dGVkIHByb3AgaXMgYm91bmQgdG8gdGhlIDpzdHlsZSBhdHRyaWJ1dGUgb2YgPHRleHRhcmVhPlxuICAgICAgXG4gICAgICByZXR1cm4gbWVyZ2Uoe30sIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUsIHsgcmVzaXplOiB0aGlzLnJlc2l6ZSB9KTtcbiAgICB9LFxuICAgIHBhcmVudFByb3BzKCkge1xuICAgICAgLy8gbGV0IG5ld09iamVjdCA9IHRoaXMuJHByb3BzO1xuICAgICAgLy8gZm9yKHZhciBwcm9wIGluIHRoaXMuJHByb3BzKSB7XG4gICAgICAvLyAgICAgaWYocHJvcCA9PT0gXCJtb2RpZmllclN0eWxlc1wiKXtcblxuICAgICAgLy8gICAgIH0gICAgICAgICAgXG4gICAgICAvLyB9XG4gICAgICByZXR1cm4gXy5vbWl0KHRoaXMuJHByb3BzLCBbJ21vZGlmaWVyU3R5bGVzJ10pO1xuICAgIH0sXG4gICAgaXNWYWxpZCgpIHtcbiAgICAgIGlmICh0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSkge1xuICAgICAgICAvLyBGb3Igbm9ybWFsIGlucHV0cyBcbiAgICAgICAgLy8gZm9ybS1pdGVtID4+IGlucHV0LWZpZWxkXG4gICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ3N1Y2Nlc3MnO1xuICAgICAgfSBcbiAgICAgIGVsc2UgaWYgKHRoaXMuJHBhcmVudC4kcGFyZW50LnZhbGlkYXRlU3RhdGUpIHtcbiAgICAgICAgLy8gRm9yIHNlbGVjdCBjb21wb25lbnQgXG4gICAgICAgIC8vIGZvcm0taXRlbSA+PiBzZWxlY3QgPj4gaW5wdXQtZmllbGRcbiAgICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICdzdWNjZXNzJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gICAgICBcbiAgICB9LFxuICAgIGlzSW52YWxpZCgpIHtcbiAgICAgIGlmICh0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSkge1xuICAgICAgICAvLyBGb3Igbm9ybWFsIGlucHV0cyBcbiAgICAgICAgLy8gZm9ybS1pdGVtID4+IGlucHV0LWZpZWxkXG4gICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ2Vycm9yJztcbiAgICAgIH0gXG4gICAgICBlbHNlIGlmICh0aGlzLiRwYXJlbnQuJHBhcmVudC52YWxpZGF0ZVN0YXRlKSB7XG4gICAgICAgIC8vIEZvciBzZWxlY3QgY29tcG9uZW50IFxuICAgICAgICAvLyBmb3JtLWl0ZW0gPj4gc2VsZWN0ID4+IGlucHV0LWZpZWxkXG4gICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQuJHBhcmVudC52YWxpZGF0ZVN0YXRlID09PSAnZXJyb3InO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSAgXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgJ3ZhbHVlJyh2YWwsIG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLnNldEN1cnJlbnRWYWx1ZSh2YWwpO1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQmx1cihldmVudCkge1xuICAgICAgLy8gZW1pdCBhIG5vcm1hbCBibHVyIGV2ZW50IFxuICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGV2ZW50KTtcblxuICAgICAgaWYgKHRoaXMudmFsaWRhdGVFdmVudCkge1xuICAgICAgICAvLyBVcG9uIHZhbGlkYXRpb24gZXZlbnQgZGlzcGF0Y2ggdGhlIGN1cnJlbnRWYWx1ZSB0byB0aGUgcGFyZW50IGZvcm0gXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uYmx1cicsIFt0aGlzLmN1cnJlbnRWYWx1ZV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5wdXRTZWxlY3QoKSB7XG4gICAgICAvLyBzZWxlY3QgdGhlIERPTSA8aW5wdXQ+IFxuICAgICAgLy8gdXNpbmcgYSBWdWUgcmVmIGZvciBlYXN5IERPTSBzZWxlY3Rpb24gXG4gICAgICB0aGlzLiRyZWZzLmlucHV0Q29tcG9uZW50LnNlbGVjdCgpO1xuICAgIH0sXG4gICAgcmVzaXplVGV4dGFyZWEoKSB7XG4gICAgICAvLyBtZXRob2QgdG8gY2FsY3VsYXRlIHRleHQgYXJlYSBzaXplIFxuICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKiBDYWxsZWQgUkVTSVpFICoqKioqKioqKlwiKTtcbiAgICAgIC8vIGlmIG9uIHNlcnZlciBzdG9wIGV4ZWN1dGlvbiBcbiAgICAgIGlmICh0aGlzLiRpc1NlcnZlcikgcmV0dXJuO1xuXG4gICAgICAvLyBncmFiIHRoZSBhdXRvc2l6ZSBhbmQgdHlwZSBwcm9wcyBmcm9tIHRoaXMgY3VycmVudCBjb21wb25lbnQgXG4gICAgICB2YXIgeyBhdXRvc2l6ZSwgdHlwZSB9ID0gdGhpcztcblxuICAgICAgLy8gSWYgYXV0b3NpemU9PWZhbHNlIG9yIHR5cGUgaXMgbm90ICd0ZXh0YXJlYScgc3RvcCBleGVjdXRpb25cbiAgICAgIGlmICghYXV0b3NpemUgfHwgdHlwZSAhPT0gJ3RleHRhcmVhJykgcmV0dXJuO1xuICAgICAgY29uc3QgbWluUm93cyA9IGF1dG9zaXplLm1pblJvd3M7XG4gICAgICBjb25zdCBtYXhSb3dzID0gYXV0b3NpemUubWF4Um93cztcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKiogQ0FMQ1VMQVRFIEhFSUdIVCAqKioqKioqKipcIik7XG4gICAgICAvLyBVcGRhdGUgZGF0YVByb3AgdGV4dGFyZWFDYWxjU3R5bGUgd2l0aCBuZXcgdGV4dCBhcmVhIGhlaWdodC4gXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLiRyZWZzLnRleHRhcmVhLiRyZWZzLmlucHV0KTtcbiAgICAgIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUgPSBjYWxjVGV4dGFyZWFIZWlnaHQodGhpcy4kcmVmcy50ZXh0YXJlYS4kcmVmcy5pbnB1dCwgbWluUm93cywgbWF4Um93cyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIioqKiB0ZXh0YXJlYUNhbGNTdHlsZTogXCIsIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUuaGVpZ2h0KTtcbiAgICB9LFxuICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdmb2N1cycsIGV2ZW50KTtcbiAgICB9LFxuICAgIGhhbmRsZUlucHV0KGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWU7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBldmVudDtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiUEFSRU5UIFBST1BTOiBcIiwgdGhpcy5wYXJlbnRQcm9wcyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIlBST1BTOiBcIiwgdGhpcy4kcHJvcHMpO1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7XG4gICAgICB0aGlzLnNldEN1cnJlbnRWYWx1ZSh2YWx1ZSk7XG4gICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB2YWx1ZSk7XG4gICAgfSxcbiAgICBoYW5kbGVJY29uQ2xpY2soZXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLm9uSWNvbkNsaWNrKSB7XG4gICAgICAgIHRoaXMub25JY29uQ2xpY2soZXZlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBldmVudCk7XG4gICAgfSxcbiAgICBzZXRDdXJyZW50VmFsdWUodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5jdXJyZW50VmFsdWUpIHJldHVybjtcbiAgICAgIHRoaXMuJG5leHRUaWNrKF8gPT4geyAgICAgICAgXG4gICAgICAgIHRoaXMucmVzaXplVGV4dGFyZWEoKTtcbiAgICAgIH0pO1xuICAgICAgLy8gdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh0aGlzLnZhbGlkYXRlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5jaGFuZ2UnLCBbdmFsdWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlZCgpIHtcbiAgICB0aGlzLiRvbignaW5wdXRTZWxlY3QnLCB0aGlzLmlucHV0U2VsZWN0KTtcbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMucmVzaXplVGV4dGFyZWEoKTtcbiAgfVxufTtcblxuIl19
