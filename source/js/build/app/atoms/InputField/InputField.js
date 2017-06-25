define(['exports', '../../mixins/emitter', './calcTextareaHeight', '../../utils/merge', '../Input', '../TextArea'], function (exports, _emitter, _calcTextareaHeight, _merge, _Input, _TextArea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  var _calcTextareaHeight2 = _interopRequireDefault(_calcTextareaHeight);

  var _merge2 = _interopRequireDefault(_merge);

  var _Input2 = _interopRequireDefault(_Input);

  var _TextArea2 = _interopRequireDefault(_TextArea);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var inputFieldTemplate2 = '\n<div :class="[type === \'textarea\' ? \'text-area\' : \'el-input\',\n  {\n    \'is-disabled\': disabled,\n    \'el-input-group\': $slots.prepend || $slots.append,\n    \'el-input-group--append\': $slots.append,\n    \'el-input-group--prepend\': $slots.prepend\n  }\n]">\n  <template v-if="type !== \'textarea\'">\n    <!-- \u524D\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </div>\n    <!-- input \u56FE\u6807 -->\n    <slot name="icon">\n      <i class="el-input__icon"\n        :class="[\n          \'el-icon-\' + icon,\n          onIconClick ? \'is-clickable\' : \'\'\n        ]"\n        v-if="icon"\n        @click="handleIconClick">\n      </i>\n    </slot>\n    <input\n      v-if="type !== \'textarea\'"\n      class="el-input__inner"\n      v-bind="$props"\n      :autocomplete="autoComplete"\n      :value="currentValue"\n      ref="input"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n    >\n    <i class="el-input__icon el-icon-loading" v-if="validating"></i>\n    <!-- \u540E\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </div>\n  </template>\n  <template v-else>\n    <pe-text-area\n      ref="textarea"\n      :parent-props="$props"\n      :styles="textareaStyle"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n      >\n    </pe-text-area>\n  </template>\n</div>\n';

  exports.default = {
    name: 'Input',

    componentName: 'Input',

    template: inputFieldTemplate2,

    mixins: [_emitter2.default],

    components: {
      'pe-input': _Input2.default,
      'pe-text-area': _TextArea2.default
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
      onIconClick: Function
    },

    computed: {
      validating: function validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle: function textareaStyle() {
        // This computed prop is bound to the :style attribute of <textarea>

        return (0, _merge2.default)({}, this.textareaCalcStyle, { resize: this.resize });
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
        this.$refs.input.select();
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
        // console.log("VALUE: ", value);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dEZpZWxkL0lucHV0RmllbGQuanMiXSwibmFtZXMiOlsiaW5wdXRGaWVsZFRlbXBsYXRlMiIsIm5hbWUiLCJjb21wb25lbnROYW1lIiwidGVtcGxhdGUiLCJtaXhpbnMiLCJjb21wb25lbnRzIiwiZGF0YSIsImN1cnJlbnRWYWx1ZSIsInZhbHVlIiwidGV4dGFyZWFDYWxjU3R5bGUiLCJwcm9wcyIsIlN0cmluZyIsIk51bWJlciIsInBsYWNlaG9sZGVyIiwicmVzaXplIiwicmVhZG9ubHkiLCJCb29sZWFuIiwiYXV0b2ZvY3VzIiwiaWNvbiIsImRpc2FibGVkIiwidHlwZSIsImRlZmF1bHQiLCJhdXRvc2l6ZSIsIk9iamVjdCIsInJvd3MiLCJhdXRvQ29tcGxldGUiLCJmb3JtIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwibWF4IiwibWluIiwic3RlcCIsInZhbGlkYXRlRXZlbnQiLCJvbkljb25DbGljayIsIkZ1bmN0aW9uIiwiY29tcHV0ZWQiLCJ2YWxpZGF0aW5nIiwiJHBhcmVudCIsInZhbGlkYXRlU3RhdGUiLCJ0ZXh0YXJlYVN0eWxlIiwid2F0Y2giLCJ2YWwiLCJvbGRWYWx1ZSIsInNldEN1cnJlbnRWYWx1ZSIsIm1ldGhvZHMiLCJoYW5kbGVCbHVyIiwiZXZlbnQiLCIkZW1pdCIsImRpc3BhdGNoIiwiaW5wdXRTZWxlY3QiLCIkcmVmcyIsImlucHV0Iiwic2VsZWN0IiwicmVzaXplVGV4dGFyZWEiLCIkaXNTZXJ2ZXIiLCJtaW5Sb3dzIiwibWF4Um93cyIsInRleHRhcmVhIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVJbnB1dCIsInRhcmdldCIsImhhbmRsZUljb25DbGljayIsIiRuZXh0VGljayIsImNyZWF0ZWQiLCIkb24iLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU1BLHNnREFBTjs7b0JBOERlO0FBQ2JDLFVBQU0sT0FETzs7QUFHYkMsbUJBQWUsT0FIRjs7QUFL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ZC9JbnB1dEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5wdXRGaWVsZFRlbXBsYXRlMiA9IGBcbjxkaXYgOmNsYXNzPVwiW3R5cGUgPT09ICd0ZXh0YXJlYScgPyAndGV4dC1hcmVhJyA6ICdlbC1pbnB1dCcsXG4gIHtcbiAgICAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZCxcbiAgICAnZWwtaW5wdXQtZ3JvdXAnOiAkc2xvdHMucHJlcGVuZCB8fCAkc2xvdHMuYXBwZW5kLFxuICAgICdlbC1pbnB1dC1ncm91cC0tYXBwZW5kJzogJHNsb3RzLmFwcGVuZCxcbiAgICAnZWwtaW5wdXQtZ3JvdXAtLXByZXBlbmQnOiAkc2xvdHMucHJlcGVuZFxuICB9XG5dXCI+XG4gIDx0ZW1wbGF0ZSB2LWlmPVwidHlwZSAhPT0gJ3RleHRhcmVhJ1wiPlxuICAgIDwhLS0g5YmN572u5YWD57SgIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJlbC1pbnB1dC1ncm91cF9fcHJlcGVuZFwiIHYtaWY9XCIkc2xvdHMucHJlcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cInByZXBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gICAgPCEtLSBpbnB1dCDlm77moIcgLS0+XG4gICAgPHNsb3QgbmFtZT1cImljb25cIj5cbiAgICAgIDxpIGNsYXNzPVwiZWwtaW5wdXRfX2ljb25cIlxuICAgICAgICA6Y2xhc3M9XCJbXG4gICAgICAgICAgJ2VsLWljb24tJyArIGljb24sXG4gICAgICAgICAgb25JY29uQ2xpY2sgPyAnaXMtY2xpY2thYmxlJyA6ICcnXG4gICAgICAgIF1cIlxuICAgICAgICB2LWlmPVwiaWNvblwiXG4gICAgICAgIEBjbGljaz1cImhhbmRsZUljb25DbGlja1wiPlxuICAgICAgPC9pPlxuICAgIDwvc2xvdD5cbiAgICA8aW5wdXRcbiAgICAgIHYtaWY9XCJ0eXBlICE9PSAndGV4dGFyZWEnXCJcbiAgICAgIGNsYXNzPVwiZWwtaW5wdXRfX2lubmVyXCJcbiAgICAgIHYtYmluZD1cIiRwcm9wc1wiXG4gICAgICA6YXV0b2NvbXBsZXRlPVwiYXV0b0NvbXBsZXRlXCJcbiAgICAgIDp2YWx1ZT1cImN1cnJlbnRWYWx1ZVwiXG4gICAgICByZWY9XCJpbnB1dFwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgID5cbiAgICA8aSBjbGFzcz1cImVsLWlucHV0X19pY29uIGVsLWljb24tbG9hZGluZ1wiIHYtaWY9XCJ2YWxpZGF0aW5nXCI+PC9pPlxuICAgIDwhLS0g5ZCO572u5YWD57SgIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJlbC1pbnB1dC1ncm91cF9fYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJhcHBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gIDwvdGVtcGxhdGU+XG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XG4gICAgPHBlLXRleHQtYXJlYVxuICAgICAgcmVmPVwidGV4dGFyZWFcIlxuICAgICAgOnBhcmVudC1wcm9wcz1cIiRwcm9wc1wiXG4gICAgICA6c3R5bGVzPVwidGV4dGFyZWFTdHlsZVwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgICAgPlxuICAgIDwvcGUtdGV4dC1hcmVhPlxuICA8L3RlbXBsYXRlPlxuPC9kaXY+XG5gO1xuXG5pbXBvcnQgZW1pdHRlciBmcm9tICcuLi8uLi9taXhpbnMvZW1pdHRlcic7XG5pbXBvcnQgY2FsY1RleHRhcmVhSGVpZ2h0IGZyb20gJy4vY2FsY1RleHRhcmVhSGVpZ2h0JztcbmltcG9ydCBtZXJnZSBmcm9tICcuLi8uLi91dGlscy9tZXJnZSc7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vSW5wdXQnO1xuaW1wb3J0IFRleHRBcmVhIGZyb20gJy4uL1RleHRBcmVhJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnSW5wdXQnLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdJbnB1dCcsXG5cbiAgdGVtcGxhdGU6IGlucHV0RmllbGRUZW1wbGF0ZTIsIFxuXG4gIG1peGluczogW2VtaXR0ZXJdLFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICAncGUtaW5wdXQnOiBJbnB1dCxcbiAgICAncGUtdGV4dC1hcmVhJzogVGV4dEFyZWFcbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICB0ZXh0YXJlYUNhbGNTdHlsZToge31cbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICByZXNpemU6IFN0cmluZyxcbiAgICByZWFkb25seTogQm9vbGVhbixcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xuICAgIH0sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGF1dG9zaXplOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICByb3dzOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAyXG4gICAgfSxcbiAgICBhdXRvQ29tcGxldGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdvZmYnXG4gICAgfSxcbiAgICBmb3JtOiBTdHJpbmcsXG4gICAgbWF4bGVuZ3RoOiBOdW1iZXIsXG4gICAgbWlubGVuZ3RoOiBOdW1iZXIsXG4gICAgbWF4OiB7fSxcbiAgICBtaW46IHt9LFxuICAgIHN0ZXA6IHt9LFxuICAgIHZhbGlkYXRlRXZlbnQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBvbkljb25DbGljazogRnVuY3Rpb25cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHZhbGlkYXRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICd2YWxpZGF0aW5nJztcbiAgICB9LFxuICAgIHRleHRhcmVhU3R5bGUoKSB7XG4gICAgICAvLyBUaGlzIGNvbXB1dGVkIHByb3AgaXMgYm91bmQgdG8gdGhlIDpzdHlsZSBhdHRyaWJ1dGUgb2YgPHRleHRhcmVhPlxuICAgICAgXG4gICAgICByZXR1cm4gbWVyZ2Uoe30sIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUsIHsgcmVzaXplOiB0aGlzLnJlc2l6ZSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAndmFsdWUnKHZhbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvLyBlbWl0IGEgbm9ybWFsIGJsdXIgZXZlbnQgXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIC8vIFVwb24gdmFsaWRhdGlvbiBldmVudCBkaXNwYXRjaCB0aGUgY3VycmVudFZhbHVlIHRvIHRoZSBwYXJlbnQgZm9ybSBcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5ibHVyJywgW3RoaXMuY3VycmVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnB1dFNlbGVjdCgpIHtcbiAgICAgIC8vIHNlbGVjdCB0aGUgRE9NIDxpbnB1dD4gXG4gICAgICAvLyB1c2luZyBhIFZ1ZSByZWYgZm9yIGVhc3kgRE9NIHNlbGVjdGlvbiBcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2VsZWN0KCk7XG4gICAgfSxcbiAgICByZXNpemVUZXh0YXJlYSgpIHtcbiAgICAgIC8vIG1ldGhvZCB0byBjYWxjdWxhdGUgdGV4dCBhcmVhIHNpemUgXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqIENhbGxlZCBSRVNJWkUgKioqKioqKioqXCIpO1xuICAgICAgLy8gaWYgb24gc2VydmVyIHN0b3AgZXhlY3V0aW9uIFxuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG5cbiAgICAgIC8vIGdyYWIgdGhlIGF1dG9zaXplIGFuZCB0eXBlIHByb3BzIGZyb20gdGhpcyBjdXJyZW50IGNvbXBvbmVudCBcbiAgICAgIHZhciB7IGF1dG9zaXplLCB0eXBlIH0gPSB0aGlzO1xuXG4gICAgICAvLyBJZiBhdXRvc2l6ZT09ZmFsc2Ugb3IgdHlwZSBpcyBub3QgJ3RleHRhcmVhJyBzdG9wIGV4ZWN1dGlvblxuICAgICAgaWYgKCFhdXRvc2l6ZSB8fCB0eXBlICE9PSAndGV4dGFyZWEnKSByZXR1cm47XG4gICAgICBjb25zdCBtaW5Sb3dzID0gYXV0b3NpemUubWluUm93cztcbiAgICAgIGNvbnN0IG1heFJvd3MgPSBhdXRvc2l6ZS5tYXhSb3dzO1xuICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKiBDQUxDVUxBVEUgSEVJR0hUICoqKioqKioqKlwiKTtcbiAgICAgIC8vIFVwZGF0ZSBkYXRhUHJvcCB0ZXh0YXJlYUNhbGNTdHlsZSB3aXRoIG5ldyB0ZXh0IGFyZWEgaGVpZ2h0LiBcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMudGV4dGFyZWEuJHJlZnMuaW5wdXQpO1xuICAgICAgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSA9IGNhbGNUZXh0YXJlYUhlaWdodCh0aGlzLiRyZWZzLnRleHRhcmVhLiRyZWZzLmlucHV0LCBtaW5Sb3dzLCBtYXhSb3dzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqIHRleHRhcmVhQ2FsY1N0eWxlOiBcIiwgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZS5oZWlnaHQpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZXZlbnQpO1xuICAgIH0sXG4gICAgaGFuZGxlSW5wdXQoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZTtcbiAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGV2ZW50O1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coXCJWQUxVRTogXCIsIHZhbHVlKTtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWUodmFsdWUpO1xuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsdWUpO1xuICAgIH0sXG4gICAgaGFuZGxlSWNvbkNsaWNrKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5vbkljb25DbGljaykge1xuICAgICAgICB0aGlzLm9uSWNvbkNsaWNrKGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZXZlbnQpO1xuICAgIH0sXG4gICAgc2V0Q3VycmVudFZhbHVlKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHRoaXMuY3VycmVudFZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLiRuZXh0VGljayhfID0+IHsgICAgICAgIFxuICAgICAgICB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gICAgICB9KTtcbiAgICAgIC8vIHRoaXMucmVzaXplVGV4dGFyZWEoKTtcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uY2hhbmdlJywgW3ZhbHVlXSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGNyZWF0ZWQoKSB7XG4gICAgdGhpcy4kb24oJ2lucHV0U2VsZWN0JywgdGhpcy5pbnB1dFNlbGVjdCk7XG4gIH0sXG5cbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gIH1cbn07XG5cbiJdfQ==
