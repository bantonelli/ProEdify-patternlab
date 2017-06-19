define(['exports', '../../mixins/emitter', './calcTextareaHeight', '../../utils/merge'], function (exports, _emitter, _calcTextareaHeight, _merge) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  var _calcTextareaHeight2 = _interopRequireDefault(_calcTextareaHeight);

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var inputTemplate = '\n<div :class="[\n  type === \'textarea\' ? \'el-textarea\' : \'el-input\',\n  size ? \'el-input--\' + size : \'\',\n  {\n    \'is-disabled\': disabled,\n    \'el-input-group\': $slots.prepend || $slots.append,\n    \'el-input-group--append\': $slots.append,\n    \'el-input-group--prepend\': $slots.prepend\n  }\n]">\n  <template v-if="type !== \'textarea\'">\n    <!-- \u524D\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </div>\n    <!-- input \u56FE\u6807 -->\n    <slot name="icon">\n      <i class="el-input__icon"\n        :class="[\n          \'el-icon-\' + icon,\n          onIconClick ? \'is-clickable\' : \'\'\n        ]"\n        v-if="icon"\n        @click="handleIconClick">\n      </i>\n    </slot>\n    <input\n      v-if="type !== \'textarea\'"\n      class="el-input__inner"\n      v-bind="$props"\n      :autocomplete="autoComplete"\n      :value="currentValue"\n      ref="input"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n    >\n    <i class="el-input__icon el-icon-loading" v-if="validating"></i>\n    <!-- \u540E\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </div>\n  </template>\n  <textarea\n    v-else\n    class="el-textarea__inner"\n    :value="currentValue"\n    @input="handleInput"\n    ref="textarea"\n    v-bind="$props"\n    :style="textareaStyle"\n    @focus="handleFocus"\n    @blur="handleBlur">\n  </textarea>\n</div>\n';

  var inputTemplate2 = '\n<div :class="[type === \'textarea\' ? \'text-area\' : \'el-input\',\n  {\n    \'is-disabled\': disabled,\n    \'el-input-group\': $slots.prepend || $slots.append,\n    \'el-input-group--append\': $slots.append,\n    \'el-input-group--prepend\': $slots.prepend\n  }\n]">\n  <template v-if="type !== \'textarea\'">\n    <!-- \u524D\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </div>\n    <!-- input \u56FE\u6807 -->\n    <slot name="icon">\n      <i class="el-input__icon"\n        :class="[\n          \'el-icon-\' + icon,\n          onIconClick ? \'is-clickable\' : \'\'\n        ]"\n        v-if="icon"\n        @click="handleIconClick">\n      </i>\n    </slot>\n    <input\n      v-if="type !== \'textarea\'"\n      class="el-input__inner"\n      v-bind="$props"\n      :autocomplete="autoComplete"\n      :value="currentValue"\n      ref="input"\n      @input="handleInput"\n      @focus="handleFocus"\n      @blur="handleBlur"\n    >\n    <i class="el-input__icon el-icon-loading" v-if="validating"></i>\n    <!-- \u540E\u7F6E\u5143\u7D20 -->\n    <div class="el-input-group__append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </div>\n  </template>\n  <template v-else>\n    <div \n        class="text-area__input" \n        @keyup="changed"\n        contenteditable="true"\n        cols="30"\n        rows="10"\n        >\n        <span v-if="placeHolder">{{placeHolder}}</span>\n    </div>\n    <div class="text-area__border"></div>  \n  </template>\n</div>\n';

  exports.default = {
    name: 'Input',

    componentName: 'Input',

    template: inputTemplate2,

    mixins: [_emitter2.default],

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

        // if on server stop execution 
        if (this.$isServer) return;

        // grab the autosize and type props from this current component 
        var autosize = this.autosize,
            type = this.type;


        // If autosize==false or type is not 'textarea' stop execution
        if (!autosize || type !== 'textarea') return;
        var minRows = autosize.minRows;
        var maxRows = autosize.maxRows;

        // Update dataProp textareaCalcStyle with new text area height. 
        this.textareaCalcStyle = (0, _calcTextareaHeight2.default)(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus: function handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput: function handleInput(event) {
        var value = event.target.value;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC9JbnB1dC5qcyJdLCJuYW1lcyI6WyJpbnB1dFRlbXBsYXRlIiwiaW5wdXRUZW1wbGF0ZTIiLCJuYW1lIiwiY29tcG9uZW50TmFtZSIsInRlbXBsYXRlIiwibWl4aW5zIiwiZGF0YSIsImN1cnJlbnRWYWx1ZSIsInZhbHVlIiwidGV4dGFyZWFDYWxjU3R5bGUiLCJwcm9wcyIsIlN0cmluZyIsIk51bWJlciIsInBsYWNlaG9sZGVyIiwicmVzaXplIiwicmVhZG9ubHkiLCJCb29sZWFuIiwiYXV0b2ZvY3VzIiwiaWNvbiIsImRpc2FibGVkIiwidHlwZSIsImRlZmF1bHQiLCJhdXRvc2l6ZSIsIk9iamVjdCIsInJvd3MiLCJhdXRvQ29tcGxldGUiLCJmb3JtIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwibWF4IiwibWluIiwic3RlcCIsInZhbGlkYXRlRXZlbnQiLCJvbkljb25DbGljayIsIkZ1bmN0aW9uIiwiY29tcHV0ZWQiLCJ2YWxpZGF0aW5nIiwiJHBhcmVudCIsInZhbGlkYXRlU3RhdGUiLCJ0ZXh0YXJlYVN0eWxlIiwid2F0Y2giLCJ2YWwiLCJvbGRWYWx1ZSIsInNldEN1cnJlbnRWYWx1ZSIsIm1ldGhvZHMiLCJoYW5kbGVCbHVyIiwiZXZlbnQiLCIkZW1pdCIsImRpc3BhdGNoIiwiaW5wdXRTZWxlY3QiLCIkcmVmcyIsImlucHV0Iiwic2VsZWN0IiwicmVzaXplVGV4dGFyZWEiLCIkaXNTZXJ2ZXIiLCJtaW5Sb3dzIiwibWF4Um93cyIsInRleHRhcmVhIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVJbnB1dCIsInRhcmdldCIsImhhbmRsZUljb25DbGljayIsIiRuZXh0VGljayIsImNyZWF0ZWQiLCIkb24iLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEseWlEQUFOOztBQTBEQSxNQUFNQyxzakRBQU47O29CQTZEZTtBQUNiQyxVQUFNLE9BRE87O0FBR2JDLG1CQUFlLE9BSEY7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TUFBTWMsTUFBTixDQUFhcEQsS0FBM0I7QUFDQSxhQUFLdUMsS0FBTCxDQUFXLE9BQVgsRUFBb0J2QyxLQUFwQjtBQUNBLGFBQUttQyxlQUFMLENBQXFCbkMsS0FBckI7QUFDQSxhQUFLdUMsS0FBTCxDQUFXLFFBQVgsRUFBcUJ2QyxLQUFyQjtBQUNELE9BeENNO0FBeUNQcUQscUJBekNPLDJCQXlDU2YsS0F6Q1QsRUF5Q2dCO0FBQ3JCLFlBQUksS0FBS2IsV0FBVCxFQUFzQjtBQUNwQixlQUFLQSxXQUFMLENBQWlCYSxLQUFqQjtBQUNEO0FBQ0QsYUFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0JELEtBQXBCO0FBQ0QsT0E5Q007QUErQ1BILHFCQS9DTywyQkErQ1NuQyxLQS9DVCxFQStDZ0I7QUFBQTs7QUFDckIsWUFBSUEsVUFBVSxLQUFLRCxZQUFuQixFQUFpQztBQUNqQyxhQUFLdUQsU0FBTCxDQUFlLGFBQUs7QUFDbEIsZ0JBQUtULGNBQUw7QUFDRCxTQUZEO0FBR0EsYUFBSzlDLFlBQUwsR0FBb0JDLEtBQXBCO0FBQ0EsWUFBSSxLQUFLd0IsYUFBVCxFQUF3QjtBQUN0QixlQUFLZ0IsUUFBTCxDQUFjLFVBQWQsRUFBMEIsYUFBMUIsRUFBeUMsQ0FBQ3hDLEtBQUQsQ0FBekM7QUFDRDtBQUNGO0FBeERNLEtBdkVJOztBQWtJYnVELFdBbElhLHFCQWtJSDtBQUNSLFdBQUtDLEdBQUwsQ0FBUyxhQUFULEVBQXdCLEtBQUtmLFdBQTdCO0FBQ0QsS0FwSVk7QUFzSWJnQixXQXRJYSxxQkFzSUg7QUFDUixXQUFLWixjQUFMO0FBQ0Q7QUF4SVksRyIsImZpbGUiOiJhcHAvYXRvbXMvSW5wdXQvSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpbnB1dFRlbXBsYXRlID0gYFxuPGRpdiA6Y2xhc3M9XCJbXG4gIHR5cGUgPT09ICd0ZXh0YXJlYScgPyAnZWwtdGV4dGFyZWEnIDogJ2VsLWlucHV0JyxcbiAgc2l6ZSA/ICdlbC1pbnB1dC0tJyArIHNpemUgOiAnJyxcbiAge1xuICAgICdpcy1kaXNhYmxlZCc6IGRpc2FibGVkLFxuICAgICdlbC1pbnB1dC1ncm91cCc6ICRzbG90cy5wcmVwZW5kIHx8ICRzbG90cy5hcHBlbmQsXG4gICAgJ2VsLWlucHV0LWdyb3VwLS1hcHBlbmQnOiAkc2xvdHMuYXBwZW5kLFxuICAgICdlbC1pbnB1dC1ncm91cC0tcHJlcGVuZCc6ICRzbG90cy5wcmVwZW5kXG4gIH1cbl1cIj5cbiAgPHRlbXBsYXRlIHYtaWY9XCJ0eXBlICE9PSAndGV4dGFyZWEnXCI+XG4gICAgPCEtLSDliY3nva7lhYPntKAgLS0+XG4gICAgPGRpdiBjbGFzcz1cImVsLWlucHV0LWdyb3VwX19wcmVwZW5kXCIgdi1pZj1cIiRzbG90cy5wcmVwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwicHJlcGVuZFwiPjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICA8IS0tIGlucHV0IOWbvuaghyAtLT5cbiAgICA8c2xvdCBuYW1lPVwiaWNvblwiPlxuICAgICAgPGkgY2xhc3M9XCJlbC1pbnB1dF9faWNvblwiXG4gICAgICAgIDpjbGFzcz1cIltcbiAgICAgICAgICAnZWwtaWNvbi0nICsgaWNvbixcbiAgICAgICAgICBvbkljb25DbGljayA/ICdpcy1jbGlja2FibGUnIDogJydcbiAgICAgICAgXVwiXG4gICAgICAgIHYtaWY9XCJpY29uXCJcbiAgICAgICAgQGNsaWNrPVwiaGFuZGxlSWNvbkNsaWNrXCI+XG4gICAgICA8L2k+XG4gICAgPC9zbG90PlxuICAgIDxpbnB1dFxuICAgICAgdi1pZj1cInR5cGUgIT09ICd0ZXh0YXJlYSdcIlxuICAgICAgY2xhc3M9XCJlbC1pbnB1dF9faW5uZXJcIlxuICAgICAgdi1iaW5kPVwiJHByb3BzXCJcbiAgICAgIDphdXRvY29tcGxldGU9XCJhdXRvQ29tcGxldGVcIlxuICAgICAgOnZhbHVlPVwiY3VycmVudFZhbHVlXCJcbiAgICAgIHJlZj1cImlucHV0XCJcbiAgICAgIEBpbnB1dD1cImhhbmRsZUlucHV0XCJcbiAgICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgPlxuICAgIDxpIGNsYXNzPVwiZWwtaW5wdXRfX2ljb24gZWwtaWNvbi1sb2FkaW5nXCIgdi1pZj1cInZhbGlkYXRpbmdcIj48L2k+XG4gICAgPCEtLSDlkI7nva7lhYPntKAgLS0+XG4gICAgPGRpdiBjbGFzcz1cImVsLWlucHV0LWdyb3VwX19hcHBlbmRcIiB2LWlmPVwiJHNsb3RzLmFwcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cImFwcGVuZFwiPjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgPC90ZW1wbGF0ZT5cbiAgPHRleHRhcmVhXG4gICAgdi1lbHNlXG4gICAgY2xhc3M9XCJlbC10ZXh0YXJlYV9faW5uZXJcIlxuICAgIDp2YWx1ZT1cImN1cnJlbnRWYWx1ZVwiXG4gICAgQGlucHV0PVwiaGFuZGxlSW5wdXRcIlxuICAgIHJlZj1cInRleHRhcmVhXCJcbiAgICB2LWJpbmQ9XCIkcHJvcHNcIlxuICAgIDpzdHlsZT1cInRleHRhcmVhU3R5bGVcIlxuICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICBAYmx1cj1cImhhbmRsZUJsdXJcIj5cbiAgPC90ZXh0YXJlYT5cbjwvZGl2PlxuYDtcblxuY29uc3QgaW5wdXRUZW1wbGF0ZTIgPSBgXG48ZGl2IDpjbGFzcz1cIlt0eXBlID09PSAndGV4dGFyZWEnID8gJ3RleHQtYXJlYScgOiAnZWwtaW5wdXQnLFxuICB7XG4gICAgJ2lzLWRpc2FibGVkJzogZGlzYWJsZWQsXG4gICAgJ2VsLWlucHV0LWdyb3VwJzogJHNsb3RzLnByZXBlbmQgfHwgJHNsb3RzLmFwcGVuZCxcbiAgICAnZWwtaW5wdXQtZ3JvdXAtLWFwcGVuZCc6ICRzbG90cy5hcHBlbmQsXG4gICAgJ2VsLWlucHV0LWdyb3VwLS1wcmVwZW5kJzogJHNsb3RzLnByZXBlbmRcbiAgfVxuXVwiPlxuICA8dGVtcGxhdGUgdi1pZj1cInR5cGUgIT09ICd0ZXh0YXJlYSdcIj5cbiAgICA8IS0tIOWJjee9ruWFg+e0oCAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiZWwtaW5wdXQtZ3JvdXBfX3ByZXBlbmRcIiB2LWlmPVwiJHNsb3RzLnByZXBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJwcmVwZW5kXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDwhLS0gaW5wdXQg5Zu+5qCHIC0tPlxuICAgIDxzbG90IG5hbWU9XCJpY29uXCI+XG4gICAgICA8aSBjbGFzcz1cImVsLWlucHV0X19pY29uXCJcbiAgICAgICAgOmNsYXNzPVwiW1xuICAgICAgICAgICdlbC1pY29uLScgKyBpY29uLFxuICAgICAgICAgIG9uSWNvbkNsaWNrID8gJ2lzLWNsaWNrYWJsZScgOiAnJ1xuICAgICAgICBdXCJcbiAgICAgICAgdi1pZj1cImljb25cIlxuICAgICAgICBAY2xpY2s9XCJoYW5kbGVJY29uQ2xpY2tcIj5cbiAgICAgIDwvaT5cbiAgICA8L3Nsb3Q+XG4gICAgPGlucHV0XG4gICAgICB2LWlmPVwidHlwZSAhPT0gJ3RleHRhcmVhJ1wiXG4gICAgICBjbGFzcz1cImVsLWlucHV0X19pbm5lclwiXG4gICAgICB2LWJpbmQ9XCIkcHJvcHNcIlxuICAgICAgOmF1dG9jb21wbGV0ZT1cImF1dG9Db21wbGV0ZVwiXG4gICAgICA6dmFsdWU9XCJjdXJyZW50VmFsdWVcIlxuICAgICAgcmVmPVwiaW5wdXRcIlxuICAgICAgQGlucHV0PVwiaGFuZGxlSW5wdXRcIlxuICAgICAgQGZvY3VzPVwiaGFuZGxlRm9jdXNcIlxuICAgICAgQGJsdXI9XCJoYW5kbGVCbHVyXCJcbiAgICA+XG4gICAgPGkgY2xhc3M9XCJlbC1pbnB1dF9faWNvbiBlbC1pY29uLWxvYWRpbmdcIiB2LWlmPVwidmFsaWRhdGluZ1wiPjwvaT5cbiAgICA8IS0tIOWQjue9ruWFg+e0oCAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiZWwtaW5wdXQtZ3JvdXBfX2FwcGVuZFwiIHYtaWY9XCIkc2xvdHMuYXBwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiYXBwZW5kXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICA8L3RlbXBsYXRlPlxuICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgIDxkaXYgXG4gICAgICAgIGNsYXNzPVwidGV4dC1hcmVhX19pbnB1dFwiIFxuICAgICAgICBAa2V5dXA9XCJjaGFuZ2VkXCJcbiAgICAgICAgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXG4gICAgICAgIGNvbHM9XCIzMFwiXG4gICAgICAgIHJvd3M9XCIxMFwiXG4gICAgICAgID5cbiAgICAgICAgPHNwYW4gdi1pZj1cInBsYWNlSG9sZGVyXCI+e3twbGFjZUhvbGRlcn19PC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWFyZWFfX2JvcmRlclwiPjwvZGl2PiAgXG4gIDwvdGVtcGxhdGU+XG48L2Rpdj5cbmA7XG5cbmltcG9ydCBlbWl0dGVyIGZyb20gJy4uLy4uL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBjYWxjVGV4dGFyZWFIZWlnaHQgZnJvbSAnLi9jYWxjVGV4dGFyZWFIZWlnaHQnO1xuaW1wb3J0IG1lcmdlIGZyb20gJy4uLy4uL3V0aWxzL21lcmdlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnSW5wdXQnLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdJbnB1dCcsXG5cbiAgdGVtcGxhdGU6IGlucHV0VGVtcGxhdGUyLCBcblxuICBtaXhpbnM6IFtlbWl0dGVyXSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICB0ZXh0YXJlYUNhbGNTdHlsZToge31cbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICByZXNpemU6IFN0cmluZyxcbiAgICByZWFkb25seTogQm9vbGVhbixcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xuICAgIH0sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGF1dG9zaXplOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICByb3dzOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAyXG4gICAgfSxcbiAgICBhdXRvQ29tcGxldGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdvZmYnXG4gICAgfSxcbiAgICBmb3JtOiBTdHJpbmcsXG4gICAgbWF4bGVuZ3RoOiBOdW1iZXIsXG4gICAgbWlubGVuZ3RoOiBOdW1iZXIsXG4gICAgbWF4OiB7fSxcbiAgICBtaW46IHt9LFxuICAgIHN0ZXA6IHt9LFxuICAgIHZhbGlkYXRlRXZlbnQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBvbkljb25DbGljazogRnVuY3Rpb25cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHZhbGlkYXRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LnZhbGlkYXRlU3RhdGUgPT09ICd2YWxpZGF0aW5nJztcbiAgICB9LFxuICAgIHRleHRhcmVhU3R5bGUoKSB7XG4gICAgICAvLyBUaGlzIGNvbXB1dGVkIHByb3AgaXMgYm91bmQgdG8gdGhlIDpzdHlsZSBhdHRyaWJ1dGUgb2YgPHRleHRhcmVhPlxuICAgICAgXG4gICAgICByZXR1cm4gbWVyZ2Uoe30sIHRoaXMudGV4dGFyZWFDYWxjU3R5bGUsIHsgcmVzaXplOiB0aGlzLnJlc2l6ZSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAndmFsdWUnKHZhbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvLyBlbWl0IGEgbm9ybWFsIGJsdXIgZXZlbnQgXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy52YWxpZGF0ZUV2ZW50KSB7XG4gICAgICAgIC8vIFVwb24gdmFsaWRhdGlvbiBldmVudCBkaXNwYXRjaCB0aGUgY3VycmVudFZhbHVlIHRvIHRoZSBwYXJlbnQgZm9ybSBcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5ibHVyJywgW3RoaXMuY3VycmVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnB1dFNlbGVjdCgpIHtcbiAgICAgIC8vIHNlbGVjdCB0aGUgRE9NIDxpbnB1dD4gXG4gICAgICAvLyB1c2luZyBhIFZ1ZSByZWYgZm9yIGVhc3kgRE9NIHNlbGVjdGlvbiBcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2VsZWN0KCk7XG4gICAgfSxcbiAgICByZXNpemVUZXh0YXJlYSgpIHtcbiAgICAgIC8vIG1ldGhvZCB0byBjYWxjdWxhdGUgdGV4dCBhcmVhIHNpemUgXG5cbiAgICAgIC8vIGlmIG9uIHNlcnZlciBzdG9wIGV4ZWN1dGlvbiBcbiAgICAgIGlmICh0aGlzLiRpc1NlcnZlcikgcmV0dXJuO1xuXG4gICAgICAvLyBncmFiIHRoZSBhdXRvc2l6ZSBhbmQgdHlwZSBwcm9wcyBmcm9tIHRoaXMgY3VycmVudCBjb21wb25lbnQgXG4gICAgICB2YXIgeyBhdXRvc2l6ZSwgdHlwZSB9ID0gdGhpcztcblxuICAgICAgLy8gSWYgYXV0b3NpemU9PWZhbHNlIG9yIHR5cGUgaXMgbm90ICd0ZXh0YXJlYScgc3RvcCBleGVjdXRpb25cbiAgICAgIGlmICghYXV0b3NpemUgfHwgdHlwZSAhPT0gJ3RleHRhcmVhJykgcmV0dXJuO1xuICAgICAgY29uc3QgbWluUm93cyA9IGF1dG9zaXplLm1pblJvd3M7XG4gICAgICBjb25zdCBtYXhSb3dzID0gYXV0b3NpemUubWF4Um93cztcblxuICAgICAgLy8gVXBkYXRlIGRhdGFQcm9wIHRleHRhcmVhQ2FsY1N0eWxlIHdpdGggbmV3IHRleHQgYXJlYSBoZWlnaHQuIFxuICAgICAgdGhpcy50ZXh0YXJlYUNhbGNTdHlsZSA9IGNhbGNUZXh0YXJlYUhlaWdodCh0aGlzLiRyZWZzLnRleHRhcmVhLCBtaW5Sb3dzLCBtYXhSb3dzKTtcbiAgICB9LFxuICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdmb2N1cycsIGV2ZW50KTtcbiAgICB9LFxuICAgIGhhbmRsZUlucHV0KGV2ZW50KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWUodmFsdWUpO1xuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsdWUpO1xuICAgIH0sXG4gICAgaGFuZGxlSWNvbkNsaWNrKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5vbkljb25DbGljaykge1xuICAgICAgICB0aGlzLm9uSWNvbkNsaWNrKGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZXZlbnQpO1xuICAgIH0sXG4gICAgc2V0Q3VycmVudFZhbHVlKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHRoaXMuY3VycmVudFZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLiRuZXh0VGljayhfID0+IHtcbiAgICAgICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMudmFsaWRhdGVFdmVudCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdGb3JtSXRlbScsICdmb3JtLmNoYW5nZScsIFt2YWx1ZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMuJG9uKCdpbnB1dFNlbGVjdCcsIHRoaXMuaW5wdXRTZWxlY3QpO1xuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZXNpemVUZXh0YXJlYSgpO1xuICB9XG59O1xuXG4iXX0=
