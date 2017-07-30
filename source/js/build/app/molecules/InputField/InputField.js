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
        if (this.$parent) {
          if (this.$parent.validateState) {
            // For normal inputs 
            // form-item >> input-field
            return this.$parent.validateState === 'success';
          } else if (this.$parent.$parent) {
            return this.$parent.$parent.validateState ? this.$parent.$parent.validateState === 'success' : false;
          }
        } else {
          return false;
        }
      },
      isInvalid: function isInvalid() {
        if (this.$parent) {
          if (this.$parent.validateState) {
            // For normal inputs 
            // form-item >> input-field
            return this.$parent.validateState === 'error';
          } else if (this.$parent.$parent) {
            return this.$parent.$parent.validateState ? this.$parent.$parent.validateState === 'error' : false;
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvSW5wdXRGaWVsZC9JbnB1dEZpZWxkLmpzIl0sIm5hbWVzIjpbImlucHV0RmllbGRUZW1wbGF0ZTIiLCJuYW1lIiwiY29tcG9uZW50TmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiY29tcG9uZW50cyIsImRhdGEiLCJjdXJyZW50VmFsdWUiLCJ2YWx1ZSIsInRleHRhcmVhQ2FsY1N0eWxlIiwicHJvcHMiLCJTdHJpbmciLCJOdW1iZXIiLCJwbGFjZWhvbGRlciIsInJlc2l6ZSIsInJlYWRvbmx5IiwiQm9vbGVhbiIsImF1dG9mb2N1cyIsImljb24iLCJkaXNhYmxlZCIsInR5cGUiLCJkZWZhdWx0IiwiYXV0b3NpemUiLCJPYmplY3QiLCJyb3dzIiwiYXV0b0NvbXBsZXRlIiwiYXV0b2NhcGl0YWxpemUiLCJmb3JtIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwibWF4IiwibWluIiwic3RlcCIsInZhbGlkYXRlRXZlbnQiLCJvbkljb25DbGljayIsIkZ1bmN0aW9uIiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsImNvbXB1dGVkIiwidmFsaWRhdGluZyIsIiRwYXJlbnQiLCJ2YWxpZGF0ZVN0YXRlIiwidGV4dGFyZWFTdHlsZSIsInBhcmVudFByb3BzIiwib21pdCIsIiRwcm9wcyIsImlzVmFsaWQiLCJpc0ludmFsaWQiLCJ3YXRjaCIsInZhbCIsIm9sZFZhbHVlIiwic2V0Q3VycmVudFZhbHVlIiwibWV0aG9kcyIsImhhbmRsZUJsdXIiLCJldmVudCIsIiRlbWl0IiwiZGlzcGF0Y2giLCJpbnB1dFNlbGVjdCIsIiRyZWZzIiwiaW5wdXRDb21wb25lbnQiLCJzZWxlY3QiLCJyZXNpemVUZXh0YXJlYSIsIiRpc1NlcnZlciIsIm1pblJvd3MiLCJtYXhSb3dzIiwidGV4dGFyZWEiLCJpbnB1dCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlSW5wdXQiLCJ0YXJnZXQiLCJoYW5kbGVJY29uQ2xpY2siLCIkbmV4dFRpY2siLCJjcmVhdGVkIiwi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O0FBQ0Q7QUFDRjtBQWxFTSxLQTFISTs7QUErTGJnRSxXQS9MYSxxQkErTEg7QUFDUixXQUFLQyxHQUFMLENBQVMsYUFBVCxFQUF3QixLQUFLaEIsV0FBN0I7QUFDRCxLQWpNWTtBQW1NYmlCLFdBbk1hLHFCQW1NSDtBQUNSLFdBQUtiLGNBQUw7QUFDRDtBQXJNWSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvSW5wdXRGaWVsZC9JbnB1dEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5wdXRGaWVsZFRlbXBsYXRlMiA9IGBcbjxkaXYgOmNsYXNzPVwiW3R5cGUgPT09ICd0ZXh0YXJlYScgPyAndGV4dC1hcmVhLWZpZWxkJyA6ICdpbnB1dC1maWVsZCcsXG4gIHtcbiAgICAnaW5wdXQtZmllbGQtLWFwcGVuZGVkJzogJHNsb3RzLmFwcGVuZCxcbiAgICAnaW5wdXQtZmllbGQtLXByZXBlbmRlZCc6ICRzbG90cy5wcmVwZW5kLFxuICB9LFxuICB7XG4gICAgJ2lzLWRpc2FibGVkJzogZGlzYWJsZWRcbiAgfVxuXVwiPlxuICA8dGVtcGxhdGUgdi1pZj1cInR5cGUgIT09ICd0ZXh0YXJlYSdcIj5cbiAgICA8IS0tIFByZXBlbmQgU2xvdCAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRfX3ByZXBlbmRcIiB2LWlmPVwiJHNsb3RzLnByZXBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJwcmVwZW5kXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuXG4gICAgPGlucHV0LWNvbXBvbmVudFxuICAgICAgOnBhcmVudC1wcm9wcz1cInBhcmVudFByb3BzXCJcbiAgICAgIDptb2RpZmllci1zdHlsZXM9XCJtb2RpZmllclN0eWxlc1wiXG4gICAgICA6aXMtdmFsaWQ9XCJpc1ZhbGlkXCJcbiAgICAgIDppcy1pbnZhbGlkPVwiaXNJbnZhbGlkXCIgICAgICBcbiAgICAgIHJlZj1cImlucHV0Q29tcG9uZW50XCJcbiAgICAgIEBpbnB1dD1cImhhbmRsZUlucHV0XCJcbiAgICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgICA+XG4gICAgICAgIDwhLS0gaW5wdXQgaWNvbiAtLT5cbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJpY29uXCIgc2xvdD1cImljb25cIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImlucHV0X19pY29uIGljb24tbG9hZGluZ1wiIHYtaWY9XCJ2YWxpZGF0aW5nXCI+PC9pPlxuICAgICAgICAgIDxpIFxuICAgICAgICAgICAgdi1lbHNlXG4gICAgICAgICAgICBjbGFzcz1cImlucHV0X19pY29uXCJcbiAgICAgICAgICAgIDpjbGFzcz1cIltcbiAgICAgICAgICAgICAgaWNvbixcbiAgICAgICAgICAgICAgb25JY29uQ2xpY2sgPyAnaXMtY2xpY2thYmxlJyA6ICcnXG4gICAgICAgICAgICBdXCIgXG4gICAgICAgICAgICBzbG90PVwiaWNvblwiICAgICAgICBcbiAgICAgICAgICAgIEBjbGljaz1cImhhbmRsZUljb25DbGlja1wiXG4gICAgICAgICAgPjwvaT5cbiAgICAgICAgPC90ZW1wbGF0ZT5cbiAgICA8L2lucHV0LWNvbXBvbmVudD4gICAgICAgICAgXG4gICAgXG4gICAgPCEtLSBBcHBlbmQgU2xvdCAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRfX2FwcGVuZFwiIHYtaWY9XCIkc2xvdHMuYXBwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiYXBwZW5kXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICA8L3RlbXBsYXRlPlxuICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgIDx0ZXh0LWFyZWFcbiAgICAgIHJlZj1cInRleHRhcmVhXCJcbiAgICAgIDpwYXJlbnQtcHJvcHM9XCJwYXJlbnRQcm9wc1wiXG4gICAgICA6bW9kaWZpZXItc3R5bGVzPVwibW9kaWZpZXJTdHlsZXNcIlxuICAgICAgOmlzLXZhbGlkPVwiaXNWYWxpZFwiXG4gICAgICA6aXMtaW52YWxpZD1cImlzSW52YWxpZFwiXG4gICAgICA6c3R5bGVzPVwidGV4dGFyZWFTdHlsZVwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgICAgPlxuICAgIDwvdGV4dC1hcmVhPlxuICA8L3RlbXBsYXRlPlxuPC9kaXY+XG5gO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNhbGNUZXh0YXJlYUhlaWdodCBmcm9tICcuL2NhbGNUZXh0YXJlYUhlaWdodCc7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9taXhpbnMvZW1pdHRlcic7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnLi4vLi4vdXRpbHMvbWVyZ2UnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2F0b21zL0lucHV0JztcbmltcG9ydCBUZXh0QXJlYSBmcm9tICcuLi8uLi9hdG9tcy9UZXh0QXJlYSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0lucHV0RmllbGQnLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdJbnB1dEZpZWxkJyxcblxuICB0ZW1wbGF0ZTogaW5wdXRGaWVsZFRlbXBsYXRlMiwgXG5cbiAgbWl4aW5zOiBbZW1pdHRlcl0sXG5cbiAgY29tcG9uZW50czoge1xuICAgICdpbnB1dC1jb21wb25lbnQnOiBJbnB1dCxcbiAgICAndGV4dC1hcmVhJzogVGV4dEFyZWFcbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICB0ZXh0YXJlYUNhbGNTdHlsZToge31cbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICByZXNpemU6IFN0cmluZyxcbiAgICByZWFkb25seTogQm9vbGVhbixcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xuICAgIH0sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGF1dG9zaXplOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICByb3dzOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAyXG4gICAgfSxcbiAgICBhdXRvQ29tcGxldGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdvZmYnXG4gICAgfSxcbiAgICBhdXRvY2FwaXRhbGl6ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogXCJvZmZcIlxuICAgIH0sXG4gICAgZm9ybTogU3RyaW5nLFxuICAgIG1heGxlbmd0aDogTnVtYmVyLFxuICAgIG1pbmxlbmd0aDogTnVtYmVyLFxuICAgIG1heDoge30sXG4gICAgbWluOiB7fSxcbiAgICBzdGVwOiB7fSxcbiAgICB2YWxpZGF0ZUV2ZW50OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAgb25JY29uQ2xpY2s6IEZ1bmN0aW9uLFxuICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgdmFsaWRhdGluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ3ZhbGlkYXRpbmcnO1xuICAgICAgLy8gcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB0ZXh0YXJlYVN0eWxlKCkge1xuICAgICAgLy8gVGhpcyBjb21wdXRlZCBwcm9wIGlzIGJvdW5kIHRvIHRoZSA6c3R5bGUgYXR0cmlidXRlIG9mIDx0ZXh0YXJlYT5cbiAgICAgIFxuICAgICAgcmV0dXJuIG1lcmdlKHt9LCB0aGlzLnRleHRhcmVhQ2FsY1N0eWxlLCB7IHJlc2l6ZTogdGhpcy5yZXNpemUgfSk7XG4gICAgfSxcbiAgICBwYXJlbnRQcm9wcygpIHtcbiAgICAgIC8vIGxldCBuZXdPYmplY3QgPSB0aGlzLiRwcm9wcztcbiAgICAgIC8vIGZvcih2YXIgcHJvcCBpbiB0aGlzLiRwcm9wcykge1xuICAgICAgLy8gICAgIGlmKHByb3AgPT09IFwibW9kaWZpZXJTdHlsZXNcIil7XG5cbiAgICAgIC8vICAgICB9ICAgICAgICAgIFxuICAgICAgLy8gfVxuICAgICAgcmV0dXJuIF8ub21pdCh0aGlzLiRwcm9wcywgWydtb2RpZmllclN0eWxlcyddKTtcbiAgICB9LFxuICAgIGlzVmFsaWQoKSB7XG4gICAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICAgIGlmICh0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSkge1xuICAgICAgICAgIC8vIEZvciBub3JtYWwgaW5wdXRzIFxuICAgICAgICAgIC8vIGZvcm0taXRlbSA+PiBpbnB1dC1maWVsZFxuICAgICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ3N1Y2Nlc3MnO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIGlmICh0aGlzLiRwYXJlbnQuJHBhcmVudCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQuJHBhcmVudC52YWxpZGF0ZVN0YXRlID8gdGhpcy4kcGFyZW50LiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ3N1Y2Nlc3MnIDogZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9ICAgICAgXG4gICAgfSxcbiAgICBpc0ludmFsaWQoKSB7XG4gICAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICAgIGlmICh0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSkge1xuICAgICAgICAgIC8vIEZvciBub3JtYWwgaW5wdXRzIFxuICAgICAgICAgIC8vIGZvcm0taXRlbSA+PiBpbnB1dC1maWVsZFxuICAgICAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA9PT0gJ2Vycm9yJztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSBpZiAodGhpcy4kcGFyZW50LiRwYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kcGFyZW50LiRwYXJlbnQudmFsaWRhdGVTdGF0ZSA/IHRoaXMuJHBhcmVudC4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICdlcnJvcicgOiBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gICBcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAndmFsdWUnKHZhbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvLyBlbWl0IGEgbm9ybWFsIGJsdXIgZXZlbnQgXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIC8vIFVwb24gdmFsaWRhdGlvbiBldmVudCBkaXNwYXRjaCB0aGUgY3VycmVudFZhbHVlIHRvIHRoZSBwYXJlbnQgZm9ybSBcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5ibHVyJywgW3RoaXMuY3VycmVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnB1dFNlbGVjdCgpIHtcbiAgICAgIC8vIHNlbGVjdCB0aGUgRE9NIDxpbnB1dD4gXG4gICAgICAvLyB1c2luZyBhIFZ1ZSByZWYgZm9yIGVhc3kgRE9NIHNlbGVjdGlvbiBcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXRDb21wb25lbnQuc2VsZWN0KCk7XG4gICAgfSxcbiAgICByZXNpemVUZXh0YXJlYSgpIHtcbiAgICAgIC8vIG1ldGhvZCB0byBjYWxjdWxhdGUgdGV4dCBhcmVhIHNpemUgXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqIENhbGxlZCBSRVNJWkUgKioqKioqKioqXCIpO1xuICAgICAgLy8gaWYgb24gc2VydmVyIHN0b3AgZXhlY3V0aW9uIFxuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG5cbiAgICAgIC8vIGdyYWIgdGhlIGF1dG9zaXplIGFuZCB0eXBlIHByb3BzIGZyb20gdGhpcyBjdXJyZW50IGNvbXBvbmVudCBcbiAgICAgIHZhciB7IGF1dG9zaXplLCB0eXBlIH0gPSB0aGlzO1xuXG4gICAgICAvLyBJZiBhdXRvc2l6ZT09ZmFsc2Ugb3IgdHlwZSBpcyBub3QgJ3RleHRhcmVhJyBzdG9wIGV4ZWN1dGlvblxuICAgICAgaWYgKCFhdXRvc2l6ZSB8fCB0eXBlICE9PSAndGV4dGFyZWEnKSByZXR1cm47XG4gICAgICBjb25zdCBtaW5Sb3dzID0gYXV0b3NpemUubWluUm93cztcbiAgICAgIGNvbnN0IG1heFJvd3MgPSBhdXRvc2l6ZS5tYXhSb3dzO1xuICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKiBDQUxDVUxBVEUgSEVJR0hUICoqKioqKioqKlwiKTtcbiAgICAgIC8vIFVwZGF0ZSBkYXRhUHJvcCB0ZXh0YXJlYUNhbGNTdHlsZSB3aXRoIG5ldyB0ZXh0IGFyZWEgaGVpZ2h0LiBcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMudGV4dGFyZWEuJHJlZnMuaW5wdXQpO1xuICAgICAgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSA9IGNhbGNUZXh0YXJlYUhlaWdodCh0aGlzLiRyZWZzLnRleHRhcmVhLiRyZWZzLmlucHV0LCBtaW5Sb3dzLCBtYXhSb3dzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqIHRleHRhcmVhQ2FsY1N0eWxlOiBcIiwgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZS5oZWlnaHQpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZXZlbnQpO1xuICAgIH0sXG4gICAgaGFuZGxlSW5wdXQoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZTtcbiAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGV2ZW50O1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coXCJQQVJFTlQgUFJPUFM6IFwiLCB0aGlzLnBhcmVudFByb3BzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiUFJPUFM6IFwiLCB0aGlzLiRwcm9wcyk7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbHVlKTtcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKTtcbiAgICB9LFxuICAgIGhhbmRsZUljb25DbGljayhldmVudCkge1xuICAgICAgaWYgKHRoaXMub25JY29uQ2xpY2spIHtcbiAgICAgICAgdGhpcy5vbkljb25DbGljayhldmVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLiRlbWl0KCdjbGljaycsIGV2ZW50KTtcbiAgICB9LFxuICAgIHNldEN1cnJlbnRWYWx1ZSh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlID09PSB0aGlzLmN1cnJlbnRWYWx1ZSkgcmV0dXJuO1xuICAgICAgdGhpcy4kbmV4dFRpY2soXyA9PiB7ICAgICAgICBcbiAgICAgICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICAgICAgfSk7XG4gICAgICAvLyB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMudmFsaWRhdGVFdmVudCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdGb3JtSXRlbScsICdmb3JtLmNoYW5nZScsIFt2YWx1ZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMuJG9uKCdpbnB1dFNlbGVjdCcsIHRoaXMuaW5wdXRTZWxlY3QpO1xuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICB9XG59O1xuXG4iXX0=
