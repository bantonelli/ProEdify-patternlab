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
        console.log("***** Called RESIZE *********");
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
        console.log("*** textareaCalcStyle: ", this.textareaCalcStyle.height);
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
        console.log("VALUE: ", value);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dEZpZWxkL0lucHV0RmllbGQuanMiXSwibmFtZXMiOlsiaW5wdXRGaWVsZFRlbXBsYXRlMiIsIm5hbWUiLCJjb21wb25lbnROYW1lIiwidGVtcGxhdGUiLCJtaXhpbnMiLCJjb21wb25lbnRzIiwiZGF0YSIsImN1cnJlbnRWYWx1ZSIsInZhbHVlIiwidGV4dGFyZWFDYWxjU3R5bGUiLCJwcm9wcyIsIlN0cmluZyIsIk51bWJlciIsInBsYWNlaG9sZGVyIiwicmVzaXplIiwicmVhZG9ubHkiLCJCb29sZWFuIiwiYXV0b2ZvY3VzIiwiaWNvbiIsImRpc2FibGVkIiwidHlwZSIsImRlZmF1bHQiLCJhdXRvc2l6ZSIsIk9iamVjdCIsInJvd3MiLCJhdXRvQ29tcGxldGUiLCJmb3JtIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwibWF4IiwibWluIiwic3RlcCIsInZhbGlkYXRlRXZlbnQiLCJvbkljb25DbGljayIsIkZ1bmN0aW9uIiwiY29tcHV0ZWQiLCJ2YWxpZGF0aW5nIiwiJHBhcmVudCIsInZhbGlkYXRlU3RhdGUiLCJ0ZXh0YXJlYVN0eWxlIiwid2F0Y2giLCJ2YWwiLCJvbGRWYWx1ZSIsInNldEN1cnJlbnRWYWx1ZSIsIm1ldGhvZHMiLCJoYW5kbGVCbHVyIiwiZXZlbnQiLCIkZW1pdCIsImRpc3BhdGNoIiwiaW5wdXRTZWxlY3QiLCIkcmVmcyIsImlucHV0Iiwic2VsZWN0IiwicmVzaXplVGV4dGFyZWEiLCJjb25zb2xlIiwibG9nIiwiJGlzU2VydmVyIiwibWluUm93cyIsIm1heFJvd3MiLCJ0ZXh0YXJlYSIsImhlaWdodCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlSW5wdXQiLCJ0YXJnZXQiLCJoYW5kbGVJY29uQ2xpY2siLCIkbmV4dFRpY2siLCJjcmVhdGVkIiwiJG9uIiwibW91bnRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNQSxzZ0RBQU47O29CQThEZTtBQUNiQyxVQUFNLE9B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MEQsV0FoSmEscUJBZ0pIO0FBQ1IsV0FBS0MsR0FBTCxDQUFTLGFBQVQsRUFBd0IsS0FBS2xCLFdBQTdCO0FBQ0QsS0FsSlk7QUFvSmJtQixXQXBKYSxxQkFvSkg7QUFDUixXQUFLZixjQUFMO0FBQ0Q7QUF0SlksRyIsImZpbGUiOiJhcHAvYXRvbXMvSW5wdXRGaWVsZC9JbnB1dEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5wdXRGaWVsZFRlbXBsYXRlMiA9IGBcbjxkaXYgOmNsYXNzPVwiW3R5cGUgPT09ICd0ZXh0YXJlYScgPyAndGV4dC1hcmVhJyA6ICdlbC1pbnB1dCcsXG4gIHtcbiAgICAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZCxcbiAgICAnZWwtaW5wdXQtZ3JvdXAnOiAkc2xvdHMucHJlcGVuZCB8fCAkc2xvdHMuYXBwZW5kLFxuICAgICdlbC1pbnB1dC1ncm91cC0tYXBwZW5kJzogJHNsb3RzLmFwcGVuZCxcbiAgICAnZWwtaW5wdXQtZ3JvdXAtLXByZXBlbmQnOiAkc2xvdHMucHJlcGVuZFxuICB9XG5dXCI+XG4gIDx0ZW1wbGF0ZSB2LWlmPVwidHlwZSAhPT0gJ3RleHRhcmVhJ1wiPlxuICAgIDwhLS0g5YmN572u5YWD57SgIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJlbC1pbnB1dC1ncm91cF9fcHJlcGVuZFwiIHYtaWY9XCIkc2xvdHMucHJlcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cInByZXBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gICAgPCEtLSBpbnB1dCDlm77moIcgLS0+XG4gICAgPHNsb3QgbmFtZT1cImljb25cIj5cbiAgICAgIDxpIGNsYXNzPVwiZWwtaW5wdXRfX2ljb25cIlxuICAgICAgICA6Y2xhc3M9XCJbXG4gICAgICAgICAgJ2VsLWljb24tJyArIGljb24sXG4gICAgICAgICAgb25JY29uQ2xpY2sgPyAnaXMtY2xpY2thYmxlJyA6ICcnXG4gICAgICAgIF1cIlxuICAgICAgICB2LWlmPVwiaWNvblwiXG4gICAgICAgIEBjbGljaz1cImhhbmRsZUljb25DbGlja1wiPlxuICAgICAgPC9pPlxuICAgIDwvc2xvdD5cbiAgICA8aW5wdXRcbiAgICAgIHYtaWY9XCJ0eXBlICE9PSAndGV4dGFyZWEnXCJcbiAgICAgIGNsYXNzPVwiZWwtaW5wdXRfX2lubmVyXCJcbiAgICAgIHYtYmluZD1cIiRwcm9wc1wiXG4gICAgICA6YXV0b2NvbXBsZXRlPVwiYXV0b0NvbXBsZXRlXCJcbiAgICAgIDp2YWx1ZT1cImN1cnJlbnRWYWx1ZVwiXG4gICAgICByZWY9XCJpbnB1dFwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgID5cbiAgICA8aSBjbGFzcz1cImVsLWlucHV0X19pY29uIGVsLWljb24tbG9hZGluZ1wiIHYtaWY9XCJ2YWxpZGF0aW5nXCI+PC9pPlxuICAgIDwhLS0g5ZCO572u5YWD57SgIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJlbC1pbnB1dC1ncm91cF9fYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJhcHBlbmRcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gIDwvdGVtcGxhdGU+XG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XG4gICAgPHBlLXRleHQtYXJlYVxuICAgICAgcmVmPVwidGV4dGFyZWFcIlxuICAgICAgOnBhcmVudC1wcm9wcz1cIiRwcm9wc1wiXG4gICAgICA6c3R5bGVzPVwidGV4dGFyZWFTdHlsZVwiXG4gICAgICBAaW5wdXQ9XCJoYW5kbGVJbnB1dFwiXG4gICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgICAgPlxuICAgIDwvcGUtdGV4dC1hcmVhPlxuICA8L3RlbXBsYXRlPlxuPC9kaXY+XG5gO1xuXG5pbXBvcnQgZW1pdHRlciBmcm9tICcuLi8uLi9taXhpbnMvZW1pdHRlcic7XG5pbXBvcnQgY2FsY1RleHRhcmVhSGVpZ2h0IGZyb20gJy4vY2FsY1RleHRhcmVhSGVpZ2h0JztcbmltcG9ydCBtZXJnZSBmcm9tICcuLi8uLi91dGlscy9tZXJnZSc7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vSW5wdXQnO1xuaW1wb3J0IFRleHRBcmVhIGZyb20gJy4uL1RleHRBcmVhJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnSW5wdXQnLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdJbnB1dCcsXG5cbiAgdGVtcGxhdGU6IGlucHV0RmllbGRUZW1wbGF0ZTIsIFxuXG4gIG1peGluczogW2VtaXR0ZXJdLFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICAncGUtaW5wdXQnOiBJbnB1dCxcbiAgICAncGUtdGV4dC1hcmVhJzogVGV4dEFyZWFcbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICB0ZXh0YXJlYUNhbGNTdHlsZToge31cbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICByZXNpemU6IFN0cmluZyxcbiAgICByZWFkb25seTogQm9vbGVhbixcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xuICAgIH0sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGF1dG9zaXplOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICByb3dzOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAyXG4gICAgfSxcbiAgICBhdXRvQ29tcGxldGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdvZmYnXG4gICAgfSxcbiAgICBmb3JtOiBTdHJpbmcsXG4gICAgbWF4bGVuZ3RoOiBOdW1iZXIsXG4gICAgbWlubGVuZ3RoOiBOdW1iZXIsXG4gICAgbWF4OiB7fSxcbiAgICBtaW46IHt9LFxuICAgIHN0ZXA6IHt9LFxuICAgIHZhbGlkYXRlRXZlbnQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBvbkljb25DbGljazogRnVuY3Rpb25cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHZhbGlkYXRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICd2YWxpZGF0aW5nJztcbiAgICB9LFxuICAgIHRleHRhcmVhU3R5bGUoKSB7XG4gICAgICAvLyBUaGlzIGNvbXB1dGVkIHByb3AgaXMgYm91bmQgdG8gdGhlIDpzdHlsZSBhdHRyaWJ1dGUgb2YgPHRleHRhcmVhPlxuICAgICAgXG4gICAgICByZXR1cm4gbWVyZ2Uoe30sIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUsIHsgcmVzaXplOiB0aGlzLnJlc2l6ZSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAndmFsdWUnKHZhbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvLyBlbWl0IGEgbm9ybWFsIGJsdXIgZXZlbnQgXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIC8vIFVwb24gdmFsaWRhdGlvbiBldmVudCBkaXNwYXRjaCB0aGUgY3VycmVudFZhbHVlIHRvIHRoZSBwYXJlbnQgZm9ybSBcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5ibHVyJywgW3RoaXMuY3VycmVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnB1dFNlbGVjdCgpIHtcbiAgICAgIC8vIHNlbGVjdCB0aGUgRE9NIDxpbnB1dD4gXG4gICAgICAvLyB1c2luZyBhIFZ1ZSByZWYgZm9yIGVhc3kgRE9NIHNlbGVjdGlvbiBcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2VsZWN0KCk7XG4gICAgfSxcbiAgICByZXNpemVUZXh0YXJlYSgpIHtcbiAgICAgIC8vIG1ldGhvZCB0byBjYWxjdWxhdGUgdGV4dCBhcmVhIHNpemUgXG4gICAgICBjb25zb2xlLmxvZyhcIioqKioqIENhbGxlZCBSRVNJWkUgKioqKioqKioqXCIpO1xuICAgICAgLy8gaWYgb24gc2VydmVyIHN0b3AgZXhlY3V0aW9uIFxuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG5cbiAgICAgIC8vIGdyYWIgdGhlIGF1dG9zaXplIGFuZCB0eXBlIHByb3BzIGZyb20gdGhpcyBjdXJyZW50IGNvbXBvbmVudCBcbiAgICAgIHZhciB7IGF1dG9zaXplLCB0eXBlIH0gPSB0aGlzO1xuXG4gICAgICAvLyBJZiBhdXRvc2l6ZT09ZmFsc2Ugb3IgdHlwZSBpcyBub3QgJ3RleHRhcmVhJyBzdG9wIGV4ZWN1dGlvblxuICAgICAgaWYgKCFhdXRvc2l6ZSB8fCB0eXBlICE9PSAndGV4dGFyZWEnKSByZXR1cm47XG4gICAgICBjb25zdCBtaW5Sb3dzID0gYXV0b3NpemUubWluUm93cztcbiAgICAgIGNvbnN0IG1heFJvd3MgPSBhdXRvc2l6ZS5tYXhSb3dzO1xuICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKiBDQUxDVUxBVEUgSEVJR0hUICoqKioqKioqKlwiKTtcbiAgICAgIC8vIFVwZGF0ZSBkYXRhUHJvcCB0ZXh0YXJlYUNhbGNTdHlsZSB3aXRoIG5ldyB0ZXh0IGFyZWEgaGVpZ2h0LiBcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMudGV4dGFyZWEuJHJlZnMuaW5wdXQpO1xuICAgICAgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSA9IGNhbGNUZXh0YXJlYUhlaWdodCh0aGlzLiRyZWZzLnRleHRhcmVhLiRyZWZzLmlucHV0LCBtaW5Sb3dzLCBtYXhSb3dzKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiKioqIHRleHRhcmVhQ2FsY1N0eWxlOiBcIiwgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZS5oZWlnaHQpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZXZlbnQpO1xuICAgIH0sXG4gICAgaGFuZGxlSW5wdXQoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZTtcbiAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGV2ZW50O1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJWQUxVRTogXCIsIHZhbHVlKTtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWUodmFsdWUpO1xuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsdWUpO1xuICAgIH0sXG4gICAgaGFuZGxlSWNvbkNsaWNrKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5vbkljb25DbGljaykge1xuICAgICAgICB0aGlzLm9uSWNvbkNsaWNrKGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZXZlbnQpO1xuICAgIH0sXG4gICAgc2V0Q3VycmVudFZhbHVlKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHRoaXMuY3VycmVudFZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLiRuZXh0VGljayhfID0+IHsgICAgICAgIFxuICAgICAgICB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gICAgICB9KTtcbiAgICAgIC8vIHRoaXMucmVzaXplVGV4dGFyZWEoKTtcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ0Zvcm1JdGVtJywgJ2Zvcm0uY2hhbmdlJywgW3ZhbHVlXSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGNyZWF0ZWQoKSB7XG4gICAgdGhpcy4kb24oJ2lucHV0U2VsZWN0JywgdGhpcy5pbnB1dFNlbGVjdCk7XG4gIH0sXG5cbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnJlc2l6ZVRleHRhcmVhKCk7XG4gIH1cbn07XG5cbiJdfQ==
