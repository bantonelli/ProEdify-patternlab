define(['exports', '../../utils/mixins/emitter', '../InputField/InputField', './AutocompleteSuggestions'], function (exports, _emitter, _InputField, _AutocompleteSuggestions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  var _InputField2 = _interopRequireDefault(_InputField);

  var _AutocompleteSuggestions2 = _interopRequireDefault(_AutocompleteSuggestions);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var autocompleteTemplate = '\n<div class="autocomplete" :class="modifierStyles">\n  <input-field\n    ref="inputField"\n    :value="value"\n    :disabled="disabled"\n    :placeholder="placeholder"\n    :name="name"\n    :size="size"\n    :icon="icon"\n    :on-icon-click="onIconClick"\n    @compositionstart.native="handleComposition"\n    @compositionupdate.native="handleComposition"\n    @compositionend.native="handleComposition"\n    @change="handleChange"\n    @focus="handleFocus"\n    @blur="handleBlur"\n    @keydown.up.native.prevent="highlight(highlightedIndex - 1)"\n    @keydown.down.native.prevent="highlight(highlightedIndex + 1)"\n    @keydown.enter.native.prevent="handleKeyEnter"\n  >\n    <template slot="prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </template>\n    <template slot="append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </template>\n  </input-field>\n  <autocomplete-suggestions\n    :props="props"\n    :class="[popperClass ? popperClass : \'\']"\n    ref="suggestions"\n    offset="5"\n    :suggestions="suggestions"\n  >\n  </autocomplete-suggestions>\n</div>\n';

  exports.default = {
    name: 'Autocomplete',

    mixins: [_emitter2.default],

    template: autocompleteTemplate,

    componentName: 'Autocomplete',

    components: {
      InputField: _InputField2.default,
      AutocompleteSuggestions: _AutocompleteSuggestions2.default
    },

    props: {
      props: {
        type: Object,
        default: function _default() {
          return {
            label: 'value',
            value: 'value'
          };
        }
      },
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      autofocus: Boolean,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String,
      icon: String,
      onIconClick: Function,
      modifierStyles: {
        type: Array,
        default: null
      }
    },
    data: function data() {
      return {
        isFocus: false,
        isOnComposition: false,
        suggestions: [],
        loading: false,
        highlightedIndex: -1
      };
    },

    computed: {
      suggestionVisible: function suggestionVisible() {
        // When true the AutocompleteSuggestions component is shown 
        var suggestions = this.suggestions;
        var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
        var val = (isValidData || this.loading) && this.isFocus;
        // let val = (isValidData || this.loading);
        return val;
      }
    },
    watch: {
      suggestionVisible: function suggestionVisible(val) {
        // When this variable is updated send a 'visible' event 
        // to the AutocompleteSuggestions child component.
        // the child then displays itself (using the width value of the event payload).    
        this.broadcast('AutocompleteSuggestions', 'visible', [val, this.$refs.inputField.$refs.inputComponent.$el.offsetWidth]);
      }
    },
    methods: {
      getData: function getData(queryString) {
        var _this = this;

        // Set loading state of the component 
        this.loading = true;
        this.fetchSuggestions(queryString, function (suggestions) {
          // when the suggestions are fetched run this callback and set loading to false.
          _this.loading = false;
          if (Array.isArray(suggestions)) {
            _this.suggestions = suggestions;
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        });
      },
      handleComposition: function handleComposition(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false;
          this.handleChange(this.value);
        } else {
          this.isOnComposition = true;
        }
      },
      handleChange: function handleChange(value) {
        this.$emit('input', value);
        if (this.isOnComposition || !this.triggerOnFocus && !value) {
          this.suggestions = [];
          return;
        }
        this.getData(value);
      },
      handleFocus: function handleFocus() {
        // console.log("AUTOCOMPLETE: CALLED HANDLE FOCUS");
        this.isFocus = true;
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      handleBlur: function handleBlur() {
        var _this2 = this;

        setTimeout(function (_) {
          _this2.isFocus = false;
        }, 100);
      },
      handleKeyEnter: function handleKeyEnter() {
        if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
          this.select(this.suggestions[this.highlightedIndex]);
        }
      },
      select: function select(item) {
        var _this3 = this;

        this.$emit('input', item[this.props.value]);
        this.$emit('select', item);
        this.$nextTick(function (_) {
          _this3.suggestions = [];
        });
      }
    },
    mounted: function mounted() {
      var _this4 = this;

      this.$on('item-click', function (item) {
        _this4.select(item);
      });
    },
    beforeDestroy: function beforeDestroy() {
      this.$refs.suggestions.$destroy();
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZS5qcyJdLCJuYW1lcyI6WyJhdXRvY29tcGxldGVUZW1wbGF0ZSIsIm5hbWUiLCJtaXhpbnMiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRzIiwiSW5wdXRGaWVsZCIsIkF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zIiwicHJvcHMiLCJ0eXBlIiwiT2JqZWN0IiwiZGVmYXVsdCIsImxhYmVsIiwidmFsdWUiLCJwb3BwZXJDbGFzcyIsIlN0cmluZyIsInBsYWNlaG9sZGVyIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwic2l6ZSIsImF1dG9mb2N1cyIsImZldGNoU3VnZ2VzdGlvbnMiLCJGdW5jdGlvbiIsInRyaWdnZXJPbkZvY3VzIiwiY3VzdG9tSXRlbSIsImljb24iLCJvbkljb25DbGljayIsIm1vZGlmaWVyU3R5bGVzIiwiQXJyYXkiLCJkYXRhIiwiaXNGb2N1cyIsImlzT25Db21wb3NpdGlvbiIsInN1Z2dlc3Rpb25zIiwibG9hZGluZyIsImhpZ2hsaWdodGVkSW5kZXgiLCJjb21wdXRlZCIsInN1Z2dlc3Rpb25WaXNpYmxlIiwiaXNWYWxpZERhdGEiLCJpc0FycmF5IiwibGVuZ3RoIiwidmFsIiwid2F0Y2giLCJicm9hZGNhc3QiLCIkcmVmcyIsImlucHV0RmllbGQiLCJpbnB1dENvbXBvbmVudCIsIiRlbCIsIm9mZnNldFdpZHRoIiwibWV0aG9kcyIsImdldERhdGEiLCJxdWVyeVN0cmluZyIsImNvbnNvbGUiLCJlcnJvciIsImhhbmRsZUNvbXBvc2l0aW9uIiwiZXZlbnQiLCJoYW5kbGVDaGFuZ2UiLCIkZW1pdCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlQmx1ciIsInNldFRpbWVvdXQiLCJoYW5kbGVLZXlFbnRlciIsInNlbGVjdCIsIml0ZW0iLCIkbmV4dFRpY2siLCJtb3VudGVkIiwiJG9uIiwiYmVmb3JlRGVzdHJveSIsIiRkZXN0cm95Il0sIm1hcHBpbmdzIjoi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S0FsSVk7QUFtSWJJLGlCQW5JYSwyQkFtSUc7QUFDZCxXQUFLdkIsS0FBTCxDQUFXWCxXQUFYLENBQXVCbUMsUUFBdkI7QUFDRDtBQXJJWSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBJbnB1dEZpZWxkIGZyb20gJy4uL0lucHV0RmllbGQvSW5wdXRGaWVsZCc7XG5pbXBvcnQgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgZnJvbSAnLi9BdXRvY29tcGxldGVTdWdnZXN0aW9ucyc7XG5cbmxldCBhdXRvY29tcGxldGVUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJhdXRvY29tcGxldGVcIiA6Y2xhc3M9XCJtb2RpZmllclN0eWxlc1wiPlxuICA8aW5wdXQtZmllbGRcbiAgICByZWY9XCJpbnB1dEZpZWxkXCJcbiAgICA6dmFsdWU9XCJ2YWx1ZVwiXG4gICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgIDpwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyXCJcbiAgICA6bmFtZT1cIm5hbWVcIlxuICAgIDpzaXplPVwic2l6ZVwiXG4gICAgOmljb249XCJpY29uXCJcbiAgICA6b24taWNvbi1jbGljaz1cIm9uSWNvbkNsaWNrXCJcbiAgICBAY29tcG9zaXRpb25zdGFydC5uYXRpdmU9XCJoYW5kbGVDb21wb3NpdGlvblwiXG4gICAgQGNvbXBvc2l0aW9udXBkYXRlLm5hdGl2ZT1cImhhbmRsZUNvbXBvc2l0aW9uXCJcbiAgICBAY29tcG9zaXRpb25lbmQubmF0aXZlPVwiaGFuZGxlQ29tcG9zaXRpb25cIlxuICAgIEBjaGFuZ2U9XCJoYW5kbGVDaGFuZ2VcIlxuICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgIEBrZXlkb3duLnVwLm5hdGl2ZS5wcmV2ZW50PVwiaGlnaGxpZ2h0KGhpZ2hsaWdodGVkSW5kZXggLSAxKVwiXG4gICAgQGtleWRvd24uZG93bi5uYXRpdmUucHJldmVudD1cImhpZ2hsaWdodChoaWdobGlnaHRlZEluZGV4ICsgMSlcIlxuICAgIEBrZXlkb3duLmVudGVyLm5hdGl2ZS5wcmV2ZW50PVwiaGFuZGxlS2V5RW50ZXJcIlxuICA+XG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJwcmVwZW5kXCIgdi1pZj1cIiRzbG90cy5wcmVwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwicHJlcGVuZFwiPjwvc2xvdD5cbiAgICA8L3RlbXBsYXRlPlxuICAgIDx0ZW1wbGF0ZSBzbG90PVwiYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgIDxzbG90IG5hbWU9XCJhcHBlbmRcIj48L3Nsb3Q+XG4gICAgPC90ZW1wbGF0ZT5cbiAgPC9pbnB1dC1maWVsZD5cbiAgPGF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uc1xuICAgIDpwcm9wcz1cInByb3BzXCJcbiAgICA6Y2xhc3M9XCJbcG9wcGVyQ2xhc3MgPyBwb3BwZXJDbGFzcyA6ICcnXVwiXG4gICAgcmVmPVwic3VnZ2VzdGlvbnNcIlxuICAgIG9mZnNldD1cIjVcIlxuICAgIDpzdWdnZXN0aW9ucz1cInN1Z2dlc3Rpb25zXCJcbiAgPlxuICA8L2F1dG9jb21wbGV0ZS1zdWdnZXN0aW9ucz5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnQXV0b2NvbXBsZXRlJyxcblxuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICB0ZW1wbGF0ZTogYXV0b2NvbXBsZXRlVGVtcGxhdGUsXG5cbiAgY29tcG9uZW50TmFtZTogJ0F1dG9jb21wbGV0ZScsXG5cbiAgY29tcG9uZW50czoge1xuICAgIElucHV0RmllbGQsXG4gICAgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNcbiAgfSxcblxuICBwcm9wczoge1xuICAgIHByb3BzOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICBkZWZhdWx0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhYmVsOiAndmFsdWUnLFxuICAgICAgICAgIHZhbHVlOiAndmFsdWUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BwZXJDbGFzczogU3RyaW5nLFxuICAgIHBsYWNlaG9sZGVyOiBTdHJpbmcsXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIHNpemU6IFN0cmluZyxcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIGF1dG9mb2N1czogQm9vbGVhbixcbiAgICBmZXRjaFN1Z2dlc3Rpb25zOiBGdW5jdGlvbixcbiAgICB0cmlnZ2VyT25Gb2N1czoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIGN1c3RvbUl0ZW06IFN0cmluZyxcbiAgICBpY29uOiBTdHJpbmcsXG4gICAgb25JY29uQ2xpY2s6IEZ1bmN0aW9uLFxuICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpc0ZvY3VzOiBmYWxzZSxcbiAgICAgIGlzT25Db21wb3NpdGlvbjogZmFsc2UsXG4gICAgICBzdWdnZXN0aW9uczogW10sXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgfTtcbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBzdWdnZXN0aW9uVmlzaWJsZSgpIHtcbiAgICAgIC8vIFdoZW4gdHJ1ZSB0aGUgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgY29tcG9uZW50IGlzIHNob3duIFxuICAgICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSB0aGlzLnN1Z2dlc3Rpb25zO1xuICAgICAgbGV0IGlzVmFsaWREYXRhID0gQXJyYXkuaXNBcnJheShzdWdnZXN0aW9ucykgJiYgc3VnZ2VzdGlvbnMubGVuZ3RoID4gMDtcbiAgICAgIGxldCB2YWwgPSAoaXNWYWxpZERhdGEgfHwgdGhpcy5sb2FkaW5nKSAmJiB0aGlzLmlzRm9jdXM7XG4gICAgICAvLyBsZXQgdmFsID0gKGlzVmFsaWREYXRhIHx8IHRoaXMubG9hZGluZyk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBzdWdnZXN0aW9uVmlzaWJsZSh2YWwpIHtcbiAgICAgIC8vIFdoZW4gdGhpcyB2YXJpYWJsZSBpcyB1cGRhdGVkIHNlbmQgYSAndmlzaWJsZScgZXZlbnQgXG4gICAgICAvLyB0byB0aGUgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgY2hpbGQgY29tcG9uZW50LlxuICAgICAgLy8gdGhlIGNoaWxkIHRoZW4gZGlzcGxheXMgaXRzZWxmICh1c2luZyB0aGUgd2lkdGggdmFsdWUgb2YgdGhlIGV2ZW50IHBheWxvYWQpLiAgICBcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdBdXRvY29tcGxldGVTdWdnZXN0aW9ucycsICd2aXNpYmxlJywgW3ZhbCwgdGhpcy4kcmVmcy5pbnB1dEZpZWxkLiRyZWZzLmlucHV0Q29tcG9uZW50LiRlbC5vZmZzZXRXaWR0aF0pOyAgICBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXREYXRhKHF1ZXJ5U3RyaW5nKSB7XG4gICAgICAvLyBTZXQgbG9hZGluZyBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IFxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmV0Y2hTdWdnZXN0aW9ucyhxdWVyeVN0cmluZywgKHN1Z2dlc3Rpb25zKSA9PiB7XG4gICAgICAgIC8vIHdoZW4gdGhlIHN1Z2dlc3Rpb25zIGFyZSBmZXRjaGVkIHJ1biB0aGlzIGNhbGxiYWNrIGFuZCBzZXQgbG9hZGluZyB0byBmYWxzZS5cbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHN1Z2dlc3Rpb25zKSkge1xuICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdhdXRvY29tcGxldGUgc3VnZ2VzdGlvbnMgbXVzdCBiZSBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGhhbmRsZUNvbXBvc2l0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2NvbXBvc2l0aW9uZW5kJykge1xuICAgICAgICB0aGlzLmlzT25Db21wb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNPbkNvbXBvc2l0aW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZUNoYW5nZSh2YWx1ZSkge1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7XG4gICAgICBpZiAodGhpcy5pc09uQ29tcG9zaXRpb24gfHwgKCF0aGlzLnRyaWdnZXJPbkZvY3VzICYmICF2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmdldERhdGEodmFsdWUpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkFVVE9DT01QTEVURTogQ0FMTEVEIEhBTkRMRSBGT0NVU1wiKTtcbiAgICAgIHRoaXMuaXNGb2N1cyA9IHRydWU7XG4gICAgICBpZiAodGhpcy50cmlnZ2VyT25Gb2N1cykge1xuICAgICAgICB0aGlzLmdldERhdGEodGhpcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVCbHVyKCkge1xuICAgICAgc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgdGhpcy5pc0ZvY3VzID0gZmFsc2U7XG4gICAgICB9LCAxMDApO1xuICAgIH0sXG4gICAgaGFuZGxlS2V5RW50ZXIoKSB7XG4gICAgICBpZiAodGhpcy5zdWdnZXN0aW9uVmlzaWJsZSAmJiB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPj0gMCAmJiB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPCB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuaGlnaGxpZ2h0ZWRJbmRleF0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0KGl0ZW0pIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgaXRlbVt0aGlzLnByb3BzLnZhbHVlXSk7XG4gICAgICB0aGlzLiRlbWl0KCdzZWxlY3QnLCBpdGVtKTtcbiAgICAgIHRoaXMuJG5leHRUaWNrKF8gPT4ge1xuICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gW107XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy4kb24oJ2l0ZW0tY2xpY2snLCBpdGVtID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xuICAgIH0pO1xuICB9LFxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuJHJlZnMuc3VnZ2VzdGlvbnMuJGRlc3Ryb3koKTtcbiAgfVxufTtcblxuXG4iXX0=
