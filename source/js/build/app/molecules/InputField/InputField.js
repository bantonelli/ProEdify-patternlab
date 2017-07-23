define(['exports', 'lodash', './calcTextareaHeight', '../../utils/mixins/emitter', '../../utils/merge', '../../atoms/Input', '../../atoms/TextArea'], function (exports, _lodash, _calcTextareaHeight, _emitter, _merge, _Input, _TextArea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _calcTextareaHeight2 = _interopRequireDefault(_calcTextareaHeight);

  var _emitter2 = _interopRequireDefault(_emitter);

  var _merge2 = _interopRequireDefault(_merge);

  var _Input2 = _interopRequireDefault(_Input);

  var _TextArea2 = _interopRequireDefault(_TextArea);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvSW5wdXRGaWVsZC9JbnB1dEZpZWxkLmpzIl0sIm5hbWVzIjpbImlucHV0RmllbGRUZW1wbGF0ZTIiLCJuYW1lIiwiY29tcG9uZW50TmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiY29tcG9uZW50cyIsImRhdGEiLCJjdXJyZW50VmFsdWUiLCJ2YWx1ZSIsInRleHRhcmVhQ2FsY1N0eWxlIiwicHJvcHMiLCJTdHJpbmciLCJOdW1iZXIiLCJwbGFjZWhvbGRlciIsInJlc2l6ZSIsInJlYWRvbmx5IiwiQm9vbGVhbiIsImF1dG9mb2N1cyIsImljb24iLCJkaXNhYmxlZCIsInR5cGUiLCJkZWZhdWx0IiwiYXV0b3NpemUiLCJPYmplY3QiLCJyb3dzIiwiYXV0b0NvbXBsZXRlIiwiYXV0b2NhcGl0YWxpemUiLCJmb3JtIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwibWF4IiwibWluIiwic3RlcCIsInZhbGlkYXRlRXZlbnQiLCJvbkljb25DbGljayIsIkZ1bmN0aW9uIiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsImNvbXB1dGVkIiwidmFsaWRhdGluZyIsIiRwYXJlbnQiLCJ2YWxpZGF0ZVN0YXRlIiwidGV4dGFyZWFTdHlsZSIsInBhcmVudFByb3BzIiwib21pdCIsIiRwcm9wcyIsImlzVmFsaWQiLCJpc0ludmFsaWQiLCJ3YXRjaCIsInZhbCIsIm9sZFZhbHVlIiwic2V0Q3VycmVudFZhbHVlIiwibWV0aG9kcyIsImhhbmRsZUJsdXIiLCJldmVudCIsIiRlbWl0IiwiZGlzcGF0Y2giLCJpbnB1dFNlbGVjdCIsIiRyZWZzIiwiaW5wdXRDb21wb25lbnQiLCJzZWxlY3QiLCJyZXNpemVUZXh0YXJlYSIsIiRpc1NlcnZlciIsIm1pblJvd3MiLCJtYXhSb3dzIiwidGV4dGFyZWEiLCJpbnB1dCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlSW5wdXQiLCJ0YXJnZXQiLCJoYW5kbGVJY29uQ2xpY2siLCIkbmV4dFRpY2siLCJjcmVhdGVkIiwi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QUFLYixjQUFMO0FBQ0Q7QUFyTVksRyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL0lucHV0RmllbGQvSW5wdXRGaWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlucHV0RmllbGRUZW1wbGF0ZTIgPSBgXG48ZGl2IDpjbGFzcz1cIlt0eXBlID09PSAndGV4dGFyZWEnID8gJ3RleHQtYXJlYS1maWVsZCcgOiAnaW5wdXQtZmllbGQnLFxuICB7XG4gICAgJ2lucHV0LWZpZWxkLS1hcHBlbmRlZCc6ICRzbG90cy5hcHBlbmQsXG4gICAgJ2lucHV0LWZpZWxkLS1wcmVwZW5kZWQnOiAkc2xvdHMucHJlcGVuZCxcbiAgfSxcbiAge1xuICAgICdpcy1kaXNhYmxlZCc6IGRpc2FibGVkXG4gIH1cbl1cIj5cbiAgPHRlbXBsYXRlIHYtaWY9XCJ0eXBlICE9PSAndGV4dGFyZWEnXCI+XG4gICAgPCEtLSBQcmVwZW5kIFNsb3QgLS0+XG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkX19wcmVwZW5kXCIgdi1pZj1cIiRzbG90cy5wcmVwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwicHJlcGVuZFwiPjwvc2xvdD5cbiAgICA8L2Rpdj5cblxuICAgIDxpbnB1dC1jb21wb25lbnRcbiAgICAgIDpwYXJlbnQtcHJvcHM9XCJwYXJlbnRQcm9wc1wiXG4gICAgICA6bW9kaWZpZXItc3R5bGVzPVwibW9kaWZpZXJTdHlsZXNcIlxuICAgICAgOmlzLXZhbGlkPVwiaXNWYWxpZFwiXG4gICAgICA6aXMtaW52YWxpZD1cImlzSW52YWxpZFwiICAgICAgXG4gICAgICByZWY9XCJpbnB1dENvbXBvbmVudFwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgICAgPlxuICAgICAgICA8IS0tIGlucHV0IGljb24gLS0+XG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwiaWNvblwiIHNsb3Q9XCJpY29uXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJpbnB1dF9faWNvbiBpY29uLWxvYWRpbmdcIiB2LWlmPVwidmFsaWRhdGluZ1wiPjwvaT5cbiAgICAgICAgICA8aSBcbiAgICAgICAgICAgIHYtZWxzZVxuICAgICAgICAgICAgY2xhc3M9XCJpbnB1dF9faWNvblwiXG4gICAgICAgICAgICA6Y2xhc3M9XCJbXG4gICAgICAgICAgICAgIGljb24sXG4gICAgICAgICAgICAgIG9uSWNvbkNsaWNrID8gJ2lzLWNsaWNrYWJsZScgOiAnJ1xuICAgICAgICAgICAgXVwiIFxuICAgICAgICAgICAgc2xvdD1cImljb25cIiAgICAgICAgXG4gICAgICAgICAgICBAY2xpY2s9XCJoYW5kbGVJY29uQ2xpY2tcIlxuICAgICAgICAgID48L2k+XG4gICAgICAgIDwvdGVtcGxhdGU+XG4gICAgPC9pbnB1dC1jb21wb25lbnQ+ICAgICAgICAgIFxuICAgIFxuICAgIDwhLS0gQXBwZW5kIFNsb3QgLS0+XG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkX19hcHBlbmRcIiB2LWlmPVwiJHNsb3RzLmFwcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cImFwcGVuZFwiPjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgPC90ZW1wbGF0ZT5cbiAgPHRlbXBsYXRlIHYtZWxzZT5cbiAgICA8dGV4dC1hcmVhXG4gICAgICByZWY9XCJ0ZXh0YXJlYVwiXG4gICAgICA6cGFyZW50LXByb3BzPVwicGFyZW50UHJvcHNcIlxuICAgICAgOm1vZGlmaWVyLXN0eWxlcz1cIm1vZGlmaWVyU3R5bGVzXCJcbiAgICAgIDppcy12YWxpZD1cImlzVmFsaWRcIlxuICAgICAgOmlzLWludmFsaWQ9XCJpc0ludmFsaWRcIlxuICAgICAgOnN0eWxlcz1cInRleHRhcmVhU3R5bGVcIlxuICAgICAgQGlucHV0PVwiaGFuZGxlSW5wdXRcIlxuICAgICAgQGZvY3VzPVwiaGFuZGxlRm9jdXNcIlxuICAgICAgQGJsdXI9XCJoYW5kbGVCbHVyXCJcbiAgICAgID5cbiAgICA8L3RleHQtYXJlYT5cbiAgPC90ZW1wbGF0ZT5cbjwvZGl2PlxuYDtcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjYWxjVGV4dGFyZWFIZWlnaHQgZnJvbSAnLi9jYWxjVGV4dGFyZWFIZWlnaHQnO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuaW1wb3J0IG1lcmdlIGZyb20gJy4uLy4uL3V0aWxzL21lcmdlJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi8uLi9hdG9tcy9JbnB1dCc7XG5pbXBvcnQgVGV4dEFyZWEgZnJvbSAnLi4vLi4vYXRvbXMvVGV4dEFyZWEnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdJbnB1dEZpZWxkJyxcblxuICBjb21wb25lbnROYW1lOiAnSW5wdXRGaWVsZCcsXG5cbiAgdGVtcGxhdGU6IGlucHV0RmllbGRUZW1wbGF0ZTIsIFxuXG4gIG1peGluczogW2VtaXR0ZXJdLFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICAnaW5wdXQtY29tcG9uZW50JzogSW5wdXQsXG4gICAgJ3RleHQtYXJlYSc6IFRleHRBcmVhXG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgdGV4dGFyZWFDYWxjU3R5bGU6IHt9XG4gICAgfTtcbiAgfSxcblxuICBwcm9wczoge1xuICAgIHZhbHVlOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgIHBsYWNlaG9sZGVyOiBTdHJpbmcsXG4gICAgcmVzaXplOiBTdHJpbmcsXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXG4gICAgYXV0b2ZvY3VzOiBCb29sZWFuLFxuICAgIGljb246IFN0cmluZyxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndGV4dCdcbiAgICB9LFxuICAgIG5hbWU6IFN0cmluZyxcbiAgICBhdXRvc2l6ZToge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgcm93czoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMlxuICAgIH0sXG4gICAgYXV0b0NvbXBsZXRlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnb2ZmJ1xuICAgIH0sXG4gICAgYXV0b2NhcGl0YWxpemU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwib2ZmXCJcbiAgICB9LFxuICAgIGZvcm06IFN0cmluZyxcbiAgICBtYXhsZW5ndGg6IE51bWJlcixcbiAgICBtaW5sZW5ndGg6IE51bWJlcixcbiAgICBtYXg6IHt9LFxuICAgIG1pbjoge30sXG4gICAgc3RlcDoge30sXG4gICAgdmFsaWRhdGVFdmVudDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIG9uSWNvbkNsaWNrOiBGdW5jdGlvbixcbiAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHZhbGlkYXRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICd2YWxpZGF0aW5nJztcbiAgICAgIC8vIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdGV4dGFyZWFTdHlsZSgpIHtcbiAgICAgIC8vIFRoaXMgY29tcHV0ZWQgcHJvcCBpcyBib3VuZCB0byB0aGUgOnN0eWxlIGF0dHJpYnV0ZSBvZiA8dGV4dGFyZWE+XG4gICAgICBcbiAgICAgIHJldHVybiBtZXJnZSh7fSwgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSwgeyByZXNpemU6IHRoaXMucmVzaXplIH0pO1xuICAgIH0sXG4gICAgcGFyZW50UHJvcHMoKSB7XG4gICAgICAvLyBsZXQgbmV3T2JqZWN0ID0gdGhpcy4kcHJvcHM7XG4gICAgICAvLyBmb3IodmFyIHByb3AgaW4gdGhpcy4kcHJvcHMpIHtcbiAgICAgIC8vICAgICBpZihwcm9wID09PSBcIm1vZGlmaWVyU3R5bGVzXCIpe1xuXG4gICAgICAvLyAgICAgfSAgICAgICAgICBcbiAgICAgIC8vIH1cbiAgICAgIHJldHVybiBfLm9taXQodGhpcy4kcHJvcHMsIFsnbW9kaWZpZXJTdHlsZXMnXSk7XG4gICAgfSxcbiAgICBpc1ZhbGlkKCkge1xuICAgICAgaWYgKHRoaXMuJHBhcmVudC52YWxpZGF0ZVN0YXRlKSB7XG4gICAgICAgIC8vIEZvciBub3JtYWwgaW5wdXRzIFxuICAgICAgICAvLyBmb3JtLWl0ZW0gPj4gaW5wdXQtZmllbGRcbiAgICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC52YWxpZGF0ZVN0YXRlID09PSAnc3VjY2Vzcyc7XG4gICAgICB9IFxuICAgICAgZWxzZSBpZiAodGhpcy4kcGFyZW50LiRwYXJlbnQudmFsaWRhdGVTdGF0ZSkge1xuICAgICAgICAvLyBGb3Igc2VsZWN0IGNvbXBvbmVudCBcbiAgICAgICAgLy8gZm9ybS1pdGVtID4+IHNlbGVjdCA+PiBpbnB1dC1maWVsZFxuICAgICAgICByZXR1cm4gdGhpcy4kcGFyZW50LiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ3N1Y2Nlc3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSAgICAgIFxuICAgIH0sXG4gICAgaXNJbnZhbGlkKCkge1xuICAgICAgaWYgKHRoaXMuJHBhcmVudC52YWxpZGF0ZVN0YXRlKSB7XG4gICAgICAgIC8vIEZvciBub3JtYWwgaW5wdXRzIFxuICAgICAgICAvLyBmb3JtLWl0ZW0gPj4gaW5wdXQtZmllbGRcbiAgICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC52YWxpZGF0ZVN0YXRlID09PSAnZXJyb3InO1xuICAgICAgfSBcbiAgICAgIGVsc2UgaWYgKHRoaXMuJHBhcmVudC4kcGFyZW50LnZhbGlkYXRlU3RhdGUpIHtcbiAgICAgICAgLy8gRm9yIHNlbGVjdCBjb21wb25lbnQgXG4gICAgICAgIC8vIGZvcm0taXRlbSA+PiBzZWxlY3QgPj4gaW5wdXQtZmllbGRcbiAgICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICdlcnJvcic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9ICBcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAndmFsdWUnKHZhbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvLyBlbWl0IGEgbm9ybWFsIGJsdXIgZXZlbnQgXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIC8vIFVwb24gdmFsaWRhdGlvbiBldmVudCBkaXNwYXRjaCB0aGUgY3VycmVudFZhbHVlIHRvIHRoZSBwYXJlbnQgZm9ybSBcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5ibHVyJywgW3RoaXMuY3VycmVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnB1dFNlbGVjdCgpIHtcbiAgICAgIC8vIHNlbGVjdCB0aGUgRE9NIDxpbnB1dD4gXG4gICAgICAvLyB1c2luZyBhIFZ1ZSByZWYgZm9yIGVhc3kgRE9NIHNlbGVjdGlvbiBcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXRDb21wb25lbnQuc2VsZWN0KCk7XG4gICAgfSxcbiAgICByZXNpemVUZXh0YXJlYSgpIHtcbiAgICAgIC8vIG1ldGhvZCB0byBjYWxjdWxhdGUgdGV4dCBhcmVhIHNpemUgXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqIENhbGxlZCBSRVNJWkUgKioqKioqKioqXCIpO1xuICAgICAgLy8gaWYgb24gc2VydmVyIHN0b3AgZXhlY3V0aW9uIFxuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG5cbiAgICAgIC8vIGdyYWIgdGhlIGF1dG9zaXplIGFuZCB0eXBlIHByb3BzIGZyb20gdGhpcyBjdXJyZW50IGNvbXBvbmVudCBcbiAgICAgIHZhciB7IGF1dG9zaXplLCB0eXBlIH0gPSB0aGlzO1xuXG4gICAgICAvLyBJZiBhdXRvc2l6ZT09ZmFsc2Ugb3IgdHlwZSBpcyBub3QgJ3RleHRhcmVhJyBzdG9wIGV4ZWN1dGlvblxuICAgICAgaWYgKCFhdXRvc2l6ZSB8fCB0eXBlICE9PSAndGV4dGFyZWEnKSByZXR1cm47XG4gICAgICBjb25zdCBtaW5Sb3dzID0gYXV0b3NpemUubWluUm93cztcbiAgICAgIGNvbnN0IG1heFJvd3MgPSBhdXRvc2l6ZS5tYXhSb3dzO1xuICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKiBDQUxDVUxBVEUgSEVJR0hUICoqKioqKioqKlwiKTtcbiAgICAgIC8vIFVwZGF0ZSBkYXRhUHJvcCB0ZXh0YXJlYUNhbGNTdHlsZSB3aXRoIG5ldyB0ZXh0IGFyZWEgaGVpZ2h0LiBcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMudGV4dGFyZWEuJHJlZnMuaW5wdXQpO1xuICAgICAgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSA9IGNhbGNUZXh0YXJlYUhlaWdodCh0aGlzLiRyZWZzLnRleHRhcmVhLiRyZWZzLmlucHV0LCBtaW5Sb3dzLCBtYXhSb3dzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqIHRleHRhcmVhQ2FsY1N0eWxlOiBcIiwgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZS5oZWlnaHQpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZXZlbnQpO1xuICAgIH0sXG4gICAgaGFuZGxlSW5wdXQoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZTtcbiAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGV2ZW50O1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coXCJQQVJFTlQgUFJPUFM6IFwiLCB0aGlzLnBhcmVudFByb3BzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiUFJPUFM6IFwiLCB0aGlzLiRwcm9wcyk7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbHVlKTtcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKTtcbiAgICB9LFxuICAgIGhhbmRsZUljb25DbGljayhldmVudCkge1xuICAgICAgaWYgKHRoaXMub25JY29uQ2xpY2spIHtcbiAgICAgICAgdGhpcy5vbkljb25DbGljayhldmVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLiRlbWl0KCdjbGljaycsIGV2ZW50KTtcbiAgICB9LFxuICAgIHNldEN1cnJlbnRWYWx1ZSh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlID09PSB0aGlzLmN1cnJlbnRWYWx1ZSkgcmV0dXJuO1xuICAgICAgdGhpcy4kbmV4dFRpY2soXyA9PiB7ICAgICAgICBcbiAgICAgICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICAgICAgfSk7XG4gICAgICAvLyB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMudmFsaWRhdGVFdmVudCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdGb3JtSXRlbScsICdmb3JtLmNoYW5nZScsIFt2YWx1ZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMuJG9uKCdpbnB1dFNlbGVjdCcsIHRoaXMuaW5wdXRTZWxlY3QpO1xuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICB9XG59O1xuXG4iXX0=
