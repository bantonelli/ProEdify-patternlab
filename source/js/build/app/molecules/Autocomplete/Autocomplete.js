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

  var autocompleteTemplate = '\n<div class="autocomplete">\n  <input-field\n    ref="inputField"\n    :value="value"\n    :disabled="disabled"\n    :placeholder="placeholder"\n    :name="name"\n    :size="size"\n    :icon="icon"\n    :on-icon-click="onIconClick"\n    @compositionstart.native="handleComposition"\n    @compositionupdate.native="handleComposition"\n    @compositionend.native="handleComposition"\n    @change="handleChange"\n    @focus="handleFocus"\n    @blur="handleBlur"\n    @keydown.up.native.prevent="highlight(highlightedIndex - 1)"\n    @keydown.down.native.prevent="highlight(highlightedIndex + 1)"\n    @keydown.enter.native.prevent="handleKeyEnter"\n  >\n    <template slot="prepend" v-if="$slots.prepend">\n      <slot name="prepend"></slot>\n    </template>\n    <template slot="append" v-if="$slots.append">\n      <slot name="append"></slot>\n    </template>\n  </input-field>\n  <autocomplete-suggestions\n    :props="props"\n    :class="[popperClass ? popperClass : \'\']"\n    ref="suggestions"\n    offset="5"\n    :suggestions="suggestions"\n  >\n  </autocomplete-suggestions>\n</div>\n';

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
      onIconClick: Function
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZS5qcyJdLCJuYW1lcyI6WyJhdXRvY29tcGxldGVUZW1wbGF0ZSIsIm5hbWUiLCJtaXhpbnMiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRzIiwiSW5wdXRGaWVsZCIsIkF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zIiwicHJvcHMiLCJ0eXBlIiwiT2JqZWN0IiwiZGVmYXVsdCIsImxhYmVsIiwidmFsdWUiLCJwb3BwZXJDbGFzcyIsIlN0cmluZyIsInBsYWNlaG9sZGVyIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwic2l6ZSIsImF1dG9mb2N1cyIsImZldGNoU3VnZ2VzdGlvbnMiLCJGdW5jdGlvbiIsInRyaWdnZXJPbkZvY3VzIiwiY3VzdG9tSXRlbSIsImljb24iLCJvbkljb25DbGljayIsImRhdGEiLCJpc0ZvY3VzIiwiaXNPbkNvbXBvc2l0aW9uIiwic3VnZ2VzdGlvbnMiLCJsb2FkaW5nIiwiaGlnaGxpZ2h0ZWRJbmRleCIsImNvbXB1dGVkIiwic3VnZ2VzdGlvblZpc2libGUiLCJpc1ZhbGlkRGF0YSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsInZhbCIsIndhdGNoIiwiYnJvYWRjYXN0IiwiJHJlZnMiLCJpbnB1dEZpZWxkIiwiaW5wdXRDb21wb25lbnQiLCIkZWwiLCJvZmZzZXRXaWR0aCIsIm1ldGhvZHMiLCJnZXREYXRhIiwicXVlcnlTdHJpbmciLCJjb25zb2xlIiwiZXJyb3IiLCJoYW5kbGVDb21wb3NpdGlvbiIsImV2ZW50IiwiaGFuZGxlQ2hhbmdlIiwiJGVtaXQiLCJoYW5kbGVGb2N1cyIsImhhbmRsZUJsdXIiLCJzZXRUaW1lb3V0IiwiaGFuZGxlS2V5RW50ZXIiLCJzZWxlY3QiLCJpdGVtIiwiJG5leHRUaWNrIiwibW91bnRlZCIsIiRvbiIsImJlZm9yZURlc3Ryb3kiLCIkZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7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QWpJWSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBJbnB1dEZpZWxkIGZyb20gJy4uL0lucHV0RmllbGQvSW5wdXRGaWVsZCc7XG5pbXBvcnQgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgZnJvbSAnLi9BdXRvY29tcGxldGVTdWdnZXN0aW9ucyc7XG5cbmxldCBhdXRvY29tcGxldGVUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJhdXRvY29tcGxldGVcIj5cbiAgPGlucHV0LWZpZWxkXG4gICAgcmVmPVwiaW5wdXRGaWVsZFwiXG4gICAgOnZhbHVlPVwidmFsdWVcIlxuICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICA6cGxhY2Vob2xkZXI9XCJwbGFjZWhvbGRlclwiXG4gICAgOm5hbWU9XCJuYW1lXCJcbiAgICA6c2l6ZT1cInNpemVcIlxuICAgIDppY29uPVwiaWNvblwiXG4gICAgOm9uLWljb24tY2xpY2s9XCJvbkljb25DbGlja1wiXG4gICAgQGNvbXBvc2l0aW9uc3RhcnQubmF0aXZlPVwiaGFuZGxlQ29tcG9zaXRpb25cIlxuICAgIEBjb21wb3NpdGlvbnVwZGF0ZS5uYXRpdmU9XCJoYW5kbGVDb21wb3NpdGlvblwiXG4gICAgQGNvbXBvc2l0aW9uZW5kLm5hdGl2ZT1cImhhbmRsZUNvbXBvc2l0aW9uXCJcbiAgICBAY2hhbmdlPVwiaGFuZGxlQ2hhbmdlXCJcbiAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgQGJsdXI9XCJoYW5kbGVCbHVyXCJcbiAgICBAa2V5ZG93bi51cC5uYXRpdmUucHJldmVudD1cImhpZ2hsaWdodChoaWdobGlnaHRlZEluZGV4IC0gMSlcIlxuICAgIEBrZXlkb3duLmRvd24ubmF0aXZlLnByZXZlbnQ9XCJoaWdobGlnaHQoaGlnaGxpZ2h0ZWRJbmRleCArIDEpXCJcbiAgICBAa2V5ZG93bi5lbnRlci5uYXRpdmUucHJldmVudD1cImhhbmRsZUtleUVudGVyXCJcbiAgPlxuICAgIDx0ZW1wbGF0ZSBzbG90PVwicHJlcGVuZFwiIHYtaWY9XCIkc2xvdHMucHJlcGVuZFwiPlxuICAgICAgPHNsb3QgbmFtZT1cInByZXBlbmRcIj48L3Nsb3Q+XG4gICAgPC90ZW1wbGF0ZT5cbiAgICA8dGVtcGxhdGUgc2xvdD1cImFwcGVuZFwiIHYtaWY9XCIkc2xvdHMuYXBwZW5kXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiYXBwZW5kXCI+PC9zbG90PlxuICAgIDwvdGVtcGxhdGU+XG4gIDwvaW5wdXQtZmllbGQ+XG4gIDxhdXRvY29tcGxldGUtc3VnZ2VzdGlvbnNcbiAgICA6cHJvcHM9XCJwcm9wc1wiXG4gICAgOmNsYXNzPVwiW3BvcHBlckNsYXNzID8gcG9wcGVyQ2xhc3MgOiAnJ11cIlxuICAgIHJlZj1cInN1Z2dlc3Rpb25zXCJcbiAgICBvZmZzZXQ9XCI1XCJcbiAgICA6c3VnZ2VzdGlvbnM9XCJzdWdnZXN0aW9uc1wiXG4gID5cbiAgPC9hdXRvY29tcGxldGUtc3VnZ2VzdGlvbnM+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0F1dG9jb21wbGV0ZScsXG5cbiAgbWl4aW5zOiBbRW1pdHRlcl0sXG5cbiAgdGVtcGxhdGU6IGF1dG9jb21wbGV0ZVRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdBdXRvY29tcGxldGUnLFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICBJbnB1dEZpZWxkLFxuICAgIEF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBwcm9wczoge1xuICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogJ3ZhbHVlJyxcbiAgICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgcG9wcGVyQ2xhc3M6IFN0cmluZyxcbiAgICBwbGFjZWhvbGRlcjogU3RyaW5nLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIG5hbWU6IFN0cmluZyxcbiAgICBzaXplOiBTdHJpbmcsXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgZmV0Y2hTdWdnZXN0aW9uczogRnVuY3Rpb24sXG4gICAgdHJpZ2dlck9uRm9jdXM6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBjdXN0b21JdGVtOiBTdHJpbmcsXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIG9uSWNvbkNsaWNrOiBGdW5jdGlvblxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpc0ZvY3VzOiBmYWxzZSxcbiAgICAgIGlzT25Db21wb3NpdGlvbjogZmFsc2UsXG4gICAgICBzdWdnZXN0aW9uczogW10sXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgfTtcbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBzdWdnZXN0aW9uVmlzaWJsZSgpIHtcbiAgICAgIC8vIFdoZW4gdHJ1ZSB0aGUgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgY29tcG9uZW50IGlzIHNob3duIFxuICAgICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSB0aGlzLnN1Z2dlc3Rpb25zO1xuICAgICAgbGV0IGlzVmFsaWREYXRhID0gQXJyYXkuaXNBcnJheShzdWdnZXN0aW9ucykgJiYgc3VnZ2VzdGlvbnMubGVuZ3RoID4gMDtcbiAgICAgIGxldCB2YWwgPSAoaXNWYWxpZERhdGEgfHwgdGhpcy5sb2FkaW5nKSAmJiB0aGlzLmlzRm9jdXM7XG4gICAgICAvLyBsZXQgdmFsID0gKGlzVmFsaWREYXRhIHx8IHRoaXMubG9hZGluZyk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBzdWdnZXN0aW9uVmlzaWJsZSh2YWwpIHtcbiAgICAgIC8vIFdoZW4gdGhpcyB2YXJpYWJsZSBpcyB1cGRhdGVkIHNlbmQgYSAndmlzaWJsZScgZXZlbnQgXG4gICAgICAvLyB0byB0aGUgQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMgY2hpbGQgY29tcG9uZW50LlxuICAgICAgLy8gdGhlIGNoaWxkIHRoZW4gZGlzcGxheXMgaXRzZWxmICh1c2luZyB0aGUgd2lkdGggdmFsdWUgb2YgdGhlIGV2ZW50IHBheWxvYWQpLiAgICBcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdBdXRvY29tcGxldGVTdWdnZXN0aW9ucycsICd2aXNpYmxlJywgW3ZhbCwgdGhpcy4kcmVmcy5pbnB1dEZpZWxkLiRyZWZzLmlucHV0Q29tcG9uZW50LiRlbC5vZmZzZXRXaWR0aF0pOyAgICBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXREYXRhKHF1ZXJ5U3RyaW5nKSB7XG4gICAgICAvLyBTZXQgbG9hZGluZyBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IFxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmV0Y2hTdWdnZXN0aW9ucyhxdWVyeVN0cmluZywgKHN1Z2dlc3Rpb25zKSA9PiB7XG4gICAgICAgIC8vIHdoZW4gdGhlIHN1Z2dlc3Rpb25zIGFyZSBmZXRjaGVkIHJ1biB0aGlzIGNhbGxiYWNrIGFuZCBzZXQgbG9hZGluZyB0byBmYWxzZS5cbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHN1Z2dlc3Rpb25zKSkge1xuICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdhdXRvY29tcGxldGUgc3VnZ2VzdGlvbnMgbXVzdCBiZSBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGhhbmRsZUNvbXBvc2l0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2NvbXBvc2l0aW9uZW5kJykge1xuICAgICAgICB0aGlzLmlzT25Db21wb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNPbkNvbXBvc2l0aW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZUNoYW5nZSh2YWx1ZSkge1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7XG4gICAgICBpZiAodGhpcy5pc09uQ29tcG9zaXRpb24gfHwgKCF0aGlzLnRyaWdnZXJPbkZvY3VzICYmICF2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmdldERhdGEodmFsdWUpO1xuICAgIH0sXG4gICAgaGFuZGxlRm9jdXMoKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkFVVE9DT01QTEVURTogQ0FMTEVEIEhBTkRMRSBGT0NVU1wiKTtcbiAgICAgIHRoaXMuaXNGb2N1cyA9IHRydWU7XG4gICAgICBpZiAodGhpcy50cmlnZ2VyT25Gb2N1cykge1xuICAgICAgICB0aGlzLmdldERhdGEodGhpcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVCbHVyKCkge1xuICAgICAgc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgdGhpcy5pc0ZvY3VzID0gZmFsc2U7XG4gICAgICB9LCAxMDApO1xuICAgIH0sXG4gICAgaGFuZGxlS2V5RW50ZXIoKSB7XG4gICAgICBpZiAodGhpcy5zdWdnZXN0aW9uVmlzaWJsZSAmJiB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPj0gMCAmJiB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPCB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuaGlnaGxpZ2h0ZWRJbmRleF0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0KGl0ZW0pIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgaXRlbVt0aGlzLnByb3BzLnZhbHVlXSk7XG4gICAgICB0aGlzLiRlbWl0KCdzZWxlY3QnLCBpdGVtKTtcbiAgICAgIHRoaXMuJG5leHRUaWNrKF8gPT4ge1xuICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gW107XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy4kb24oJ2l0ZW0tY2xpY2snLCBpdGVtID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xuICAgIH0pO1xuICB9LFxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuJHJlZnMuc3VnZ2VzdGlvbnMuJGRlc3Ryb3koKTtcbiAgfVxufTtcblxuXG4iXX0=
