define(['exports', '../../atoms/Tag/Tag', '../InputField/InputField', './SelectDropdown', './Option', 'throttle-debounce/debounce', '../../utils/mixins/emitter', '../../utils/clickoutside', '../../utils/dom', '../../utils/resize-event'], function (exports, _Tag, _InputField, _SelectDropdown, _Option, _debounce, _emitter, _clickoutside, _dom, _resizeEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Tag2 = _interopRequireDefault(_Tag);

  var _InputField2 = _interopRequireDefault(_InputField);

  var _SelectDropdown2 = _interopRequireDefault(_SelectDropdown);

  var _Option2 = _interopRequireDefault(_Option);

  var _debounce2 = _interopRequireDefault(_debounce);

  var _emitter2 = _interopRequireDefault(_emitter);

  var _clickoutside2 = _interopRequireDefault(_clickoutside);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // const sizeMap = {
  //   'large': 42,
  //   'small': 30,
  //   'mini': 22
  // };

  var enhancedSelectTemplate = '\n<div\n  class="select"\n  :class="modifierStyles"\n  v-clickoutside="handleClose">\n  <!-- MULTIPLE SELECT / TAGS -->\n  <div\n    class="select__tags"\n    v-if="multiple"\n    @click.stop="toggleMenu"\n    ref="tags"\n    :style="{ \'max-width\': inputWidth - 32 + \'px\' }">\n    <transition-group @after-leave="resetInputHeight">\n      <tag\n        v-for="item in selected"\n        :key="item.value"\n        closable\n        :hit="item.hitState"\n        type="primary"\n        @close="deleteTag($event, item)"\n        close-transition>\n        <span class="select__tags-text">{{ item.currentLabel }}</span>\n      </tag>\n    </transition-group>\n\n    <input\n      type="text"\n      class="select__filter-input"\n      @focus="visible = true"\n      :disabled="disabled"\n      @keyup="managePlaceholder"\n      @keydown="resetInputState"\n      @keydown.down.prevent="navigateOptions(\'next\')"\n      @keydown.up.prevent="navigateOptions(\'prev\')"\n      @keydown.enter.prevent="selectOption"\n      @keydown.esc.stop.prevent="visible = false"\n      @keydown.delete="deletePrevTag"\n      v-model="query"\n      :debounce="remote ? 300 : 0"\n      v-if="filterable"\n      :style="{ width: inputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\' }"\n      ref="input">\n  </div>\n  <!-- END TAGS -->\n  <input-field\n    class="select__input"\n    ref="reference"\n    v-model="selectedLabel"\n    type="text"\n    :modifier-styles="inputModifierStyles"\n    :placeholder="currentPlaceholder"\n    :name="name"\n    :disabled="disabled"\n    :readonly="!filterable || multiple"\n    :validate-event="false"\n    @focus="handleFocus"\n    @click="handleIconClick"\n    @mousedown.native="handleMouseDown"\n    @keyup.native="debouncedOnInputChange"\n    @keydown.native.down.prevent="navigateOptions(\'next\')"\n    @keydown.native.up.prevent="navigateOptions(\'prev\')"\n    @keydown.native.enter.prevent="selectOption"\n    @keydown.native.esc.stop.prevent="visible = false"\n    @keydown.native.tab="visible = false"\n    @paste.native="debouncedOnInputChange"\n    @mouseenter.native="inputHovering = true"\n    @mouseleave.native="inputHovering = false"\n    :icon="iconClass">\n  </input-field>\n  <transition\n    name="el-zoom-in-top"\n    @after-leave="doDestroy"\n    @after-enter="handleMenuEnter">\n    <select-menu\n      ref="popper"\n      v-show="visible && emptyText !== false"\n      :class="modifierStyles">\n        <ul\n          class="select__options"\n          :class="[{ \'is-empty\': !allowCreate && filteredOptionsCount === 0 }]"\n          v-show="options.length > 0 && !loading" \n        >\n          <select-option\n            :value="query"\n            created\n            v-if="showNewOption">\n          </select-option>\n          <slot></slot>\n        </ul>\n      <p class="select__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>\n    </select-menu>\n  </transition>\n</div>\n';

  exports.default = {
    mixins: [_emitter2.default],

    name: 'Select',

    template: enhancedSelectTemplate,

    componentName: 'Select',

    computed: {
      iconClass: function iconClass() {
        var criteria = this.clearable && !this.disabled && this.inputHovering && !this.multiple && this.value !== undefined && this.value !== '';
        return criteria ? 'icon-circle-close is-show-close' : this.remote && this.filterable ? '' : 'icon-up-down-arrow';
        // return criteria ? 'icon-circle-close is-show-close' : 'icon-up-down-arrow';
      },
      debounce: function debounce() {
        return this.remote ? 300 : 0;
      },
      emptyText: function emptyText() {

        if (this.loading) {
          return this.loadingText || 'Loading';
        } else {
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || 'No matches';
          }
          if (this.options.length === 0) {
            return this.noDataText || 'No Data';
          }
        }
        return null;
      },
      showNewOption: function showNewOption() {
        var _this = this;

        var hasExistingOption = this.options.filter(function (option) {
          return !option.created;
        }).some(function (option) {
          return option.currentLabel === _this.query;
        });
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
      }
    },

    components: {
      'input-field': _InputField2.default,
      'select-menu': _SelectDropdown2.default,
      'select-option': _Option2.default,
      'tag': _Tag2.default
    },

    directives: { Clickoutside: _clickoutside2.default },

    props: {
      name: String,
      value: {
        required: true
      },
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default: function _default() {
          return 'Select Placeholder';
        }
      },
      defaultFirstOption: Boolean,
      modifierStyles: {
        type: Array,
        default: null
      },
      inputModifierStyles: {
        type: Array,
        default: null
      }
    },

    data: function data() {
      return {
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        dropdownUl: null,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        bottomOverflow: 0,
        topOverflow: 0,
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: ''
      };
    },


    watch: {
      placeholder: function placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },
      value: function value(val) {
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || this.$refs.input && this.query !== '') {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        this.setSelected();
        if (this.filterable && !this.multiple) {
          this.inputLength = 20;
        }
        this.$emit('change', val);
        this.dispatch('FormItem', 'form.change', val);
      },
      query: function query(val) {
        var _this2 = this;

        this.$nextTick(function () {
          if (_this2.visible) _this2.broadcast('SelectDropdown', 'updatePopper');
        });
        this.hoverIndex = -1;
        if (this.multiple && this.filterable) {
          this.inputLength = this.$refs.input.value.length * 15 + 20;
          this.managePlaceholder();
          this.resetInputHeight();
        }
        if (this.remote && typeof this.remoteMethod === 'function') {
          this.hoverIndex = -1;
          this.remoteMethod(val);
          this.broadcast('Option', 'resetIndex');
        } else if (typeof this.filterMethod === 'function') {
          this.filterMethod(val);
          this.broadcast('OptionGroup', 'queryChange');
        } else {
          this.filteredOptionsCount = this.optionsCount;
          this.broadcast('Option', 'queryChange', val);
          this.broadcast('OptionGroup', 'queryChange');
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      },
      visible: function visible(val) {
        var _this3 = this;

        // If visible is set to false         
        if (!val) {
          // call blur() on the input-field 
          this.$refs.reference.$el.querySelector('input').blur();
          // this.$refs.reference.$refs.inputComponent.$el.querySelector('input').blur();

          // Hide icons 
          this.handleIconHide();

          // Destroy Popper  
          this.broadcast('SelectDropdown', 'destroyPopper');

          // Blur tag input 
          if (this.$refs.input) {
            this.$refs.input.blur();
          }

          // Reset query, selected and input placeholder to empty string 
          this.query = '';
          this.selectedLabel = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(function () {
            if (_this3.$refs.input && _this3.$refs.input.value === '' && _this3.selected.length === 0) {
              _this3.currentPlaceholder = _this3.cachedPlaceHolder;
            }
          });
          if (!this.multiple) {
            this.getOverflows();
            if (this.selected) {
              if (this.filterable && this.allowCreate && this.createdSelected && this.createdOption) {
                this.selectedLabel = this.createdLabel;
              } else {
                this.selectedLabel = this.selected.currentLabel;
              }
              if (this.filterable) this.query = this.selectedLabel;
            }
          }
        }
        // If is visible 
        else {
            // Show icons 
            this.handleIconShow();

            // Broadcast updatePopper event 
            this.broadcast('SelectDropdown', 'updatePopper');

            // Show filtered results 
            if (this.filterable) {
              this.query = this.selectedLabel;
              if (this.multiple) {
                this.$refs.input.focus();
              } else {
                if (!this.remote) {
                  this.broadcast('Option', 'queryChange', '');
                  this.broadcast('OptionGroup', 'queryChange');
                }
                this.broadcast('Input', 'inputSelect');
              }
            }
          }
        this.$emit('visible-change', val);
      },
      options: function options(val) {
        if (this.$isServer) return;
        this.optionsAllDisabled = val.length === val.filter(function (item) {
          return item.disabled === true;
        }).length;
        if (this.multiple) {
          this.resetInputHeight();
        }
        var inputs = this.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          this.setSelected();
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      }
    },

    methods: {
      handleIconHide: function handleIconHide() {
        var icon = this.$el.querySelector('.input__icon');
        if (icon) {
          (0, _dom.removeClass)(icon, 'is-reverse');
        }
      },
      handleIconShow: function handleIconShow() {
        var icon = this.$el.querySelector('.input__icon');
        if (icon && !(0, _dom.hasClass)(icon, 'icon-circle-close')) {
          (0, _dom.addClass)(icon, 'is-reverse');
        }
      },
      handleMenuEnter: function handleMenuEnter() {
        if (!this.dropdownUl) {
          this.dropdownUl = this.$refs.popper.$el.querySelector('.select__options');
          this.getOverflows();
        }
        if (!this.multiple && this.dropdownUl) {
          this.resetMenuScroll();
        }
      },
      getOverflows: function getOverflows() {
        if (this.dropdownUl && this.selected && this.selected.$el) {
          var selectedRect = this.selected.$el.getBoundingClientRect();
          var popperRect = this.$refs.popper.$el.getBoundingClientRect();
          this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
          this.topOverflow = selectedRect.top - popperRect.top;
        }
      },
      resetMenuScroll: function resetMenuScroll() {
        if (this.bottomOverflow > 0) {
          this.dropdownUl.scrollTop += this.bottomOverflow;
        } else if (this.topOverflow < 0) {
          this.dropdownUl.scrollTop += this.topOverflow;
        }
      },
      getOption: function getOption(value) {
        var option = void 0;
        for (var i = this.cachedOptions.length - 1; i >= 0; i--) {
          var cachedOption = this.cachedOptions[i];
          if (cachedOption.value === value) {
            option = cachedOption;
            break;
          }
        }
        if (option) return option;
        var label = typeof value === 'string' || typeof value === 'number' ? value : '';
        var newOption = {
          value: value,
          currentLabel: label
        };
        if (this.multiple) {
          newOption.hitState = false;
        }
        return newOption;
      },
      setSelected: function setSelected() {
        var _this4 = this;

        if (!this.multiple) {
          var option = this.getOption(this.value);
          if (option.created) {
            this.createdLabel = option.currentLabel;
            this.createdSelected = true;
          } else {
            this.createdSelected = false;
          }
          this.selectedLabel = option.currentLabel;
          this.selected = option;
          if (this.filterable) this.query = this.selectedLabel;
          return;
        }
        var result = [];
        if (Array.isArray(this.value)) {
          this.value.forEach(function (value) {
            result.push(_this4.getOption(value));
          });
        }
        this.selected = result;
        this.$nextTick(function () {
          _this4.resetInputHeight();
        });
      },
      handleFocus: function handleFocus() {
        this.visible = true;
      },
      handleIconClick: function handleIconClick(event) {
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.deleteSelected(event);
        } else {
          this.toggleMenu();
        }
      },
      handleMouseDown: function handleMouseDown(event) {
        if (event.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          event.preventDefault();
        }
      },
      doDestroy: function doDestroy() {
        this.$refs.popper && this.$refs.popper.doDestroy();
      },
      handleClose: function handleClose() {
        this.visible = false;
      },
      toggleLastOptionHitState: function toggleLastOptionHitState(hit) {
        if (!Array.isArray(this.selected)) return;
        var option = this.selected[this.selected.length - 1];
        if (!option) return;

        if (hit === true || hit === false) {
          option.hitState = hit;
          return hit;
        }

        option.hitState = !option.hitState;
        return option.hitState;
      },
      deletePrevTag: function deletePrevTag(e) {
        if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
          var value = this.value.slice();
          value.pop();
          this.$emit('input', value);
        }
      },
      managePlaceholder: function managePlaceholder() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },
      resetInputState: function resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
      },
      resetInputHeight: function resetInputHeight() {
        var _this5 = this;

        this.$nextTick(function () {
          if (!_this5.$refs.reference) return;
          // let inputChildNodes = this.$refs.reference.$el.childNodes;
          // Change logic to use selector. 
          // let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          // let input = this.$refs.reference.$el.querySelector('input');
          var input = _this5.$refs.reference.$refs.inputComponent.$refs.input;
          // let inputComponent = this.$refs.reference.$el.querySelector('.input');
          var inputComponent = _this5.$refs.reference.$refs.inputComponent.$el;
          // var newHeight = Math.max(this.$refs.tags.clientHeight + 6, sizeMap[this.size] || 40) + 'px';
          var newHeight = Math.max(_this5.$refs.tags.clientHeight + 6, 40) + 'px';
          input.style.height = newHeight;
          inputComponent.style.height = newHeight;

          if (_this5.visible && _this5.emptyText !== false) {
            _this5.broadcast('SelectDropdown', 'updatePopper');
          }
        });
      },
      resetHoverIndex: function resetHoverIndex() {
        var _this6 = this;

        setTimeout(function () {
          if (!_this6.multiple) {
            _this6.hoverIndex = _this6.options.indexOf(_this6.selected);
          } else {
            if (_this6.selected.length > 0) {
              _this6.hoverIndex = Math.min.apply(null, _this6.selected.map(function (item) {
                return _this6.options.indexOf(item);
              }));
            } else {
              _this6.hoverIndex = -1;
            }
          }
        }, 300);
      },
      handleOptionSelect: function handleOptionSelect(option) {
        if (this.multiple) {
          var value = this.value.slice();
          var optionIndex = value.indexOf(option.value);
          if (optionIndex > -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          if (this.filterable) this.$refs.input.focus();
        } else {
          this.$emit('input', option.value);
          this.visible = false;
        }
      },
      toggleMenu: function toggleMenu() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },
      navigateOptions: function navigateOptions(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
        this.optionsAllDisabled = this.options.length === this.options.filter(function (item) {
          return item.disabled === true;
        }).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
      },
      resetScrollTop: function resetScrollTop() {
        var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
        var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          this.dropdownUl.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          this.dropdownUl.scrollTop += topOverflowDistance;
        }
      },
      selectOption: function selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },
      deleteSelected: function deleteSelected(event) {
        event.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
        this.$emit('clear');
      },
      deleteTag: function deleteTag(event, tag) {
        var index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled) {
          var value = this.value.slice();
          value.splice(index, 1);
          this.$emit('input', value);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },
      onInputChange: function onInputChange() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },
      onOptionDestroy: function onOptionDestroy(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        var index = this.options.indexOf(option);
        if (index > -1) {
          this.options.splice(index, 1);
        }
        this.broadcast('Option', 'resetIndex');
      },
      resetInputWidth: function resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },
      handleResize: function handleResize() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },
      checkDefaultFirstOption: function checkDefaultFirstOption() {
        this.hoverIndex = -1;
        for (var i = 0; i !== this.options.length; ++i) {
          var option = this.options[i];
          if (this.query) {
            // pick first options that passes the filter
            if (!option.disabled && !option.groupDisabled && option.visible) {
              this.hoverIndex = i;
              break;
            }
          } else {
            // pick currently selected option
            if (option.itemSelected) {
              this.hoverIndex = i;
              break;
            }
          }
        }
      }
    },

    created: function created() {
      var _this7 = this;

      // set cachedPlaceHolder
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;

      // if multiple select send an array through input event payload 
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }

      // if not multiple select send a string through input event payload 
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }

      // Call setSelected
      this.setSelected();

      this.debouncedOnInputChange = (0, _debounce2.default)(this.debounce, function () {
        _this7.onInputChange();
      });

      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
    },
    mounted: function mounted() {
      var _this8 = this;

      if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      (0, _resizeEvent.addResizeListener)(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(function () {
        if (_this8.$refs.reference && _this8.$refs.reference.$el) {
          _this8.inputWidth = _this8.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },
    beforeDestroy: function beforeDestroy() {
      if (this.$el && this.handleResize) (0, _resizeEvent.removeResizeListener)(this.$el, this.handleResize);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvRW5oYW5jZWRTZWxlY3QuanMiXSwibmFtZXMiOlsiZW5oYW5jZWRTZWxlY3RUZW1wbGF0ZSIsIm1peGlucyIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wdXRlZCIsImljb25DbGFzcyIsImNyaXRlcmlhIiwiY2xlYXJhYmxlIiwiZGlzYWJsZWQiLCJpbnB1dEhvdmVyaW5nIiwibXVsdGlwbGUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInJlbW90ZSIsImZpbHRlcmFibGUiLCJkZWJvdW5jZSIsImVtcHR5VGV4dCIsImxvYWRpbmciLCJsb2FkaW5nVGV4dCIsInF1ZXJ5Iiwib3B0aW9ucyIsImxlbmd0aCIsImZpbHRlcmVkT3B0aW9uc0NvdW50Iiwibm9NYXRjaFRleHQiLCJub0RhdGFUZXh0Iiwic2hvd05ld09wdGlvbiIsImhhc0V4aXN0aW5nT3B0aW9uIiwiZmlsdGVyIiwib3B0aW9uIiwiY3JlYXRlZCIsInNvbWUiLCJjdXJyZW50TGFiZWwiLCJhbGxvd0NyZWF0ZSIsImNvbXBvbmVudHMiLCJkaXJlY3RpdmVzIiwiQ2xpY2tvdXRzaWRlIiwicHJvcHMiLCJTdHJpbmciLCJyZXF1aXJlZCIsIkJvb2xlYW4iLCJwb3BwZXJDbGFzcyIsInJlbW90ZU1ldGhvZCIsIkZ1bmN0aW9uIiwiZmlsdGVyTWV0aG9kIiwibXVsdGlwbGVMaW1pdCIsInR5cGUiLCJOdW1iZXIiLCJkZWZhdWx0IiwicGxhY2Vob2xkZXIiLCJkZWZhdWx0Rmlyc3RPcHRpb24iLCJtb2RpZmllclN0eWxlcyIsIkFycmF5IiwiaW5wdXRNb2RpZmllclN0eWxlcyIsImRhdGEiLCJjYWNoZWRPcHRpb25zIiwiY3JlYXRlZExhYmVsIiwiY3JlYXRlZFNlbGVjdGVkIiwic2VsZWN0ZWQiLCJpc1NlbGVjdCIsImlucHV0TGVuZ3RoIiwiaW5wdXRXaWR0aCIsImNhY2hlZFBsYWNlSG9sZGVyIiwib3B0aW9uc0NvdW50IiwiZHJvcGRvd25VbCIsInZpc2libGUiLCJzZWxlY3RlZExhYmVsIiwiaG92ZXJJbmRleCIsImJvdHRvbU92ZXJmbG93IiwidG9wT3ZlcmZsb3ciLCJvcHRpb25zQWxsRGlzYWJsZWQiLCJjdXJyZW50UGxhY2Vob2xkZXIiLCJ3YXRjaCIsInZhbCIsInJlc2V0SW5wdXRIZWlnaHQiLCIkcmVmcyIsImlucHV0Iiwic2V0U2VsZWN0ZWQiLCIkZW1pdCIsImRpc3BhdGNoIiwiJG5leHRUaWNrIiwiYnJvYWRjYXN0IiwibWFuYWdlUGxhY2Vob2xkZXIiLCJjaGVja0RlZmF1bHRGaXJzdE9wdGlvbiIsInJlZmVyZW5jZSIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCJibHVyIiwiaGFuZGxlSWNvbkhpZGUiLCJyZXNldEhvdmVySW5kZXgiLCJnZXRPdmVyZmxvd3MiLCJjcmVhdGVkT3B0aW9uIiwiaGFuZGxlSWNvblNob3ciLCJmb2N1cyIsIiRpc1NlcnZlciIsIml0ZW0iLCJpbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5kZXhPZiIsImNhbGwiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJtZXRob2RzIiwiaWNvbiIsImhhbmRsZU1lbnVFbnRlciIsInBvcHBlciIsInJlc2V0TWVudVNjcm9sbCIsInNlbGVjdGVkUmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBvcHBlclJlY3QiLCJib3R0b20iLCJ0b3AiLCJzY3JvbGxUb3AiLCJnZXRPcHRpb24iLCJpIiwiY2FjaGVkT3B0aW9uIiwibGFiZWwiLCJuZXdPcHRpb24iLCJoaXRTdGF0ZSIsInJlc3VsdCIsImlzQXJyYXkiLCJmb3JFYWNoIiwicHVzaCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlSWNvbkNsaWNrIiwiZXZlbnQiLCJkZWxldGVTZWxlY3RlZCIsInRvZ2dsZU1lbnUiLCJoYW5kbGVNb3VzZURvd24iLCJ0YXJnZXQiLCJ0YWdOYW1lIiwiaGFuZGxlQ2xvc2UiLCJwcmV2ZW50RGVmYXVsdCIsImRvRGVzdHJveSIsInRvZ2dsZUxhc3RPcHRpb25IaXRTdGF0ZSIsImhpdCIsImRlbGV0ZVByZXZUYWciLCJlIiwic2xpY2UiLCJwb3AiLCJyZXNldElucHV0U3RhdGUiLCJrZXlDb2RlIiwiaW5wdXRDb21wb25lbnQiLCJuZXdIZWlnaHQiLCJNYXRoIiwibWF4IiwidGFncyIsImNsaWVudEhlaWdodCIsInN0eWxlIiwiaGVpZ2h0Iiwic2V0VGltZW91dCIsIm1pbiIsImFwcGx5IiwibWFwIiwiaGFuZGxlT3B0aW9uU2VsZWN0Iiwib3B0aW9uSW5kZXgiLCJzcGxpY2UiLCJuYXZpZ2F0ZU9wdGlvbnMiLCJkaXJlY3Rpb24iLCJyZXNldFNjcm9sbFRvcCIsImdyb3VwRGlzYWJsZWQiLCJib3R0b21PdmVyZmxvd0Rpc3RhbmNlIiwidG9wT3ZlcmZsb3dEaXN0YW5jZSIsInNlbGVjdE9wdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImRlbGV0ZVRhZyIsInRhZyIsImluZGV4Iiwib25JbnB1dENoYW5nZSIsIm9uT3B0aW9uRGVzdHJveSIsInJlc2V0SW5wdXRXaWR0aCIsIndpZHRoIiwiaGFuZGxlUmVzaXplIiwiaXRlbVNlbGVjdGVkIiwiZGVib3VuY2VkT25JbnB1dENoYW5nZSIsIiRvbiIsIm1vdW50ZWQiLCJiZWZvcmVEZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUlBLGk5RkFBSjs7b0JBK0ZlO0FBQ2JDLFlBQVEsbUJBREs7O0FBR2JDLFVBQU0sUUFITzs7QUFLYkMsY0FBVUgsc0JBTEc7O0FBT2JJLG1CQUFlLFFBUEY7O0FBU2JDLGNBQVU7QUFDUkMsZUFEUSx1QkFDSTtBQUNWLFlBQUlDLFdBQVcsS0FBS0MsU0FBTCxJQUNiLENBQUMsS0FBS0MsUUFETyxJQUViLEtBQUtDLGFBRlEsSUFHYixDQUFDLEtBQUtDLFFBSE8sSUFJYixLQUFLQyxLQUFMLEtBQWVDLFNBSkYsSUFLYixLQUFLRCxLQUFMLEtBQWUsRUFMakI7QUFNQSxlQUFPTCxX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RyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL0VuaGFuY2VkU2VsZWN0L0VuaGFuY2VkU2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhZyBmcm9tICcuLi8uLi9hdG9tcy9UYWcvVGFnJztcbmltcG9ydCBJbnB1dEZpZWxkIGZyb20gJy4uL0lucHV0RmllbGQvSW5wdXRGaWVsZCc7XG5pbXBvcnQgU2VsZWN0TWVudSBmcm9tICcuL1NlbGVjdERyb3Bkb3duJztcbmltcG9ydCBPcHRpb24gZnJvbSAnLi9PcHRpb24nO1xuXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnO1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuaW1wb3J0IENsaWNrb3V0c2lkZSBmcm9tICcuLi8uLi91dGlscy9jbGlja291dHNpZGUnO1xuaW1wb3J0IHsgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzLCBoYXNDbGFzcyB9IGZyb20gJy4uLy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyBhZGRSZXNpemVMaXN0ZW5lciwgcmVtb3ZlUmVzaXplTGlzdGVuZXIgfSBmcm9tICcuLi8uLi91dGlscy9yZXNpemUtZXZlbnQnO1xuXG4vLyBjb25zdCBzaXplTWFwID0ge1xuLy8gICAnbGFyZ2UnOiA0Mixcbi8vICAgJ3NtYWxsJzogMzAsXG4vLyAgICdtaW5pJzogMjJcbi8vIH07XG5cbmxldCBlbmhhbmNlZFNlbGVjdFRlbXBsYXRlID0gYFxuPGRpdlxuICBjbGFzcz1cInNlbGVjdFwiXG4gIDpjbGFzcz1cIm1vZGlmaWVyU3R5bGVzXCJcbiAgdi1jbGlja291dHNpZGU9XCJoYW5kbGVDbG9zZVwiPlxuICA8IS0tIE1VTFRJUExFIFNFTEVDVCAvIFRBR1MgLS0+XG4gIDxkaXZcbiAgICBjbGFzcz1cInNlbGVjdF9fdGFnc1wiXG4gICAgdi1pZj1cIm11bHRpcGxlXCJcbiAgICBAY2xpY2suc3RvcD1cInRvZ2dsZU1lbnVcIlxuICAgIHJlZj1cInRhZ3NcIlxuICAgIDpzdHlsZT1cInsgJ21heC13aWR0aCc6IGlucHV0V2lkdGggLSAzMiArICdweCcgfVwiPlxuICAgIDx0cmFuc2l0aW9uLWdyb3VwIEBhZnRlci1sZWF2ZT1cInJlc2V0SW5wdXRIZWlnaHRcIj5cbiAgICAgIDx0YWdcbiAgICAgICAgdi1mb3I9XCJpdGVtIGluIHNlbGVjdGVkXCJcbiAgICAgICAgOmtleT1cIml0ZW0udmFsdWVcIlxuICAgICAgICBjbG9zYWJsZVxuICAgICAgICA6aGl0PVwiaXRlbS5oaXRTdGF0ZVwiXG4gICAgICAgIHR5cGU9XCJwcmltYXJ5XCJcbiAgICAgICAgQGNsb3NlPVwiZGVsZXRlVGFnKCRldmVudCwgaXRlbSlcIlxuICAgICAgICBjbG9zZS10cmFuc2l0aW9uPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInNlbGVjdF9fdGFncy10ZXh0XCI+e3sgaXRlbS5jdXJyZW50TGFiZWwgfX08L3NwYW4+XG4gICAgICA8L3RhZz5cbiAgICA8L3RyYW5zaXRpb24tZ3JvdXA+XG5cbiAgICA8aW5wdXRcbiAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgIGNsYXNzPVwic2VsZWN0X19maWx0ZXItaW5wdXRcIlxuICAgICAgQGZvY3VzPVwidmlzaWJsZSA9IHRydWVcIlxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgICAgQGtleXVwPVwibWFuYWdlUGxhY2Vob2xkZXJcIlxuICAgICAgQGtleWRvd249XCJyZXNldElucHV0U3RhdGVcIlxuICAgICAgQGtleWRvd24uZG93bi5wcmV2ZW50PVwibmF2aWdhdGVPcHRpb25zKCduZXh0JylcIlxuICAgICAgQGtleWRvd24udXAucHJldmVudD1cIm5hdmlnYXRlT3B0aW9ucygncHJldicpXCJcbiAgICAgIEBrZXlkb3duLmVudGVyLnByZXZlbnQ9XCJzZWxlY3RPcHRpb25cIlxuICAgICAgQGtleWRvd24uZXNjLnN0b3AucHJldmVudD1cInZpc2libGUgPSBmYWxzZVwiXG4gICAgICBAa2V5ZG93bi5kZWxldGU9XCJkZWxldGVQcmV2VGFnXCJcbiAgICAgIHYtbW9kZWw9XCJxdWVyeVwiXG4gICAgICA6ZGVib3VuY2U9XCJyZW1vdGUgPyAzMDAgOiAwXCJcbiAgICAgIHYtaWY9XCJmaWx0ZXJhYmxlXCJcbiAgICAgIDpzdHlsZT1cInsgd2lkdGg6IGlucHV0TGVuZ3RoICsgJ3B4JywgJ21heC13aWR0aCc6IGlucHV0V2lkdGggLSA0MiArICdweCcgfVwiXG4gICAgICByZWY9XCJpbnB1dFwiPlxuICA8L2Rpdj5cbiAgPCEtLSBFTkQgVEFHUyAtLT5cbiAgPGlucHV0LWZpZWxkXG4gICAgY2xhc3M9XCJzZWxlY3RfX2lucHV0XCJcbiAgICByZWY9XCJyZWZlcmVuY2VcIlxuICAgIHYtbW9kZWw9XCJzZWxlY3RlZExhYmVsXCJcbiAgICB0eXBlPVwidGV4dFwiXG4gICAgOm1vZGlmaWVyLXN0eWxlcz1cImlucHV0TW9kaWZpZXJTdHlsZXNcIlxuICAgIDpwbGFjZWhvbGRlcj1cImN1cnJlbnRQbGFjZWhvbGRlclwiXG4gICAgOm5hbWU9XCJuYW1lXCJcbiAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgOnJlYWRvbmx5PVwiIWZpbHRlcmFibGUgfHwgbXVsdGlwbGVcIlxuICAgIDp2YWxpZGF0ZS1ldmVudD1cImZhbHNlXCJcbiAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgQGNsaWNrPVwiaGFuZGxlSWNvbkNsaWNrXCJcbiAgICBAbW91c2Vkb3duLm5hdGl2ZT1cImhhbmRsZU1vdXNlRG93blwiXG4gICAgQGtleXVwLm5hdGl2ZT1cImRlYm91bmNlZE9uSW5wdXRDaGFuZ2VcIlxuICAgIEBrZXlkb3duLm5hdGl2ZS5kb3duLnByZXZlbnQ9XCJuYXZpZ2F0ZU9wdGlvbnMoJ25leHQnKVwiXG4gICAgQGtleWRvd24ubmF0aXZlLnVwLnByZXZlbnQ9XCJuYXZpZ2F0ZU9wdGlvbnMoJ3ByZXYnKVwiXG4gICAgQGtleWRvd24ubmF0aXZlLmVudGVyLnByZXZlbnQ9XCJzZWxlY3RPcHRpb25cIlxuICAgIEBrZXlkb3duLm5hdGl2ZS5lc2Muc3RvcC5wcmV2ZW50PVwidmlzaWJsZSA9IGZhbHNlXCJcbiAgICBAa2V5ZG93bi5uYXRpdmUudGFiPVwidmlzaWJsZSA9IGZhbHNlXCJcbiAgICBAcGFzdGUubmF0aXZlPVwiZGVib3VuY2VkT25JbnB1dENoYW5nZVwiXG4gICAgQG1vdXNlZW50ZXIubmF0aXZlPVwiaW5wdXRIb3ZlcmluZyA9IHRydWVcIlxuICAgIEBtb3VzZWxlYXZlLm5hdGl2ZT1cImlucHV0SG92ZXJpbmcgPSBmYWxzZVwiXG4gICAgOmljb249XCJpY29uQ2xhc3NcIj5cbiAgPC9pbnB1dC1maWVsZD5cbiAgPHRyYW5zaXRpb25cbiAgICBuYW1lPVwiZWwtem9vbS1pbi10b3BcIlxuICAgIEBhZnRlci1sZWF2ZT1cImRvRGVzdHJveVwiXG4gICAgQGFmdGVyLWVudGVyPVwiaGFuZGxlTWVudUVudGVyXCI+XG4gICAgPHNlbGVjdC1tZW51XG4gICAgICByZWY9XCJwb3BwZXJcIlxuICAgICAgdi1zaG93PVwidmlzaWJsZSAmJiBlbXB0eVRleHQgIT09IGZhbHNlXCJcbiAgICAgIDpjbGFzcz1cIm1vZGlmaWVyU3R5bGVzXCI+XG4gICAgICAgIDx1bFxuICAgICAgICAgIGNsYXNzPVwic2VsZWN0X19vcHRpb25zXCJcbiAgICAgICAgICA6Y2xhc3M9XCJbeyAnaXMtZW1wdHknOiAhYWxsb3dDcmVhdGUgJiYgZmlsdGVyZWRPcHRpb25zQ291bnQgPT09IDAgfV1cIlxuICAgICAgICAgIHYtc2hvdz1cIm9wdGlvbnMubGVuZ3RoID4gMCAmJiAhbG9hZGluZ1wiIFxuICAgICAgICA+XG4gICAgICAgICAgPHNlbGVjdC1vcHRpb25cbiAgICAgICAgICAgIDp2YWx1ZT1cInF1ZXJ5XCJcbiAgICAgICAgICAgIGNyZWF0ZWRcbiAgICAgICAgICAgIHYtaWY9XCJzaG93TmV3T3B0aW9uXCI+XG4gICAgICAgICAgPC9zZWxlY3Qtb3B0aW9uPlxuICAgICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgICAgPC91bD5cbiAgICAgIDxwIGNsYXNzPVwic2VsZWN0X19lbXB0eVwiIHYtaWY9XCJlbXB0eVRleHQgJiYgKGFsbG93Q3JlYXRlICYmIG9wdGlvbnMubGVuZ3RoID09PSAwIHx8ICFhbGxvd0NyZWF0ZSlcIj57eyBlbXB0eVRleHQgfX08L3A+XG4gICAgPC9zZWxlY3QtbWVudT5cbiAgPC90cmFuc2l0aW9uPlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1peGluczogW0VtaXR0ZXJdLFxuXG4gIG5hbWU6ICdTZWxlY3QnLFxuXG4gIHRlbXBsYXRlOiBlbmhhbmNlZFNlbGVjdFRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdTZWxlY3QnLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaWNvbkNsYXNzKCkge1xuICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5jbGVhcmFibGUgJiZcbiAgICAgICAgIXRoaXMuZGlzYWJsZWQgJiZcbiAgICAgICAgdGhpcy5pbnB1dEhvdmVyaW5nICYmXG4gICAgICAgICF0aGlzLm11bHRpcGxlICYmXG4gICAgICAgIHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB0aGlzLnZhbHVlICE9PSAnJztcbiAgICAgIHJldHVybiBjcml0ZXJpYSA/ICdpY29uLWNpcmNsZS1jbG9zZSBpcy1zaG93LWNsb3NlJyA6ICh0aGlzLnJlbW90ZSAmJiB0aGlzLmZpbHRlcmFibGUgPyAnJyA6ICdpY29uLXVwLWRvd24tYXJyb3cnKTtcbiAgICAgIC8vIHJldHVybiBjcml0ZXJpYSA/ICdpY29uLWNpcmNsZS1jbG9zZSBpcy1zaG93LWNsb3NlJyA6ICdpY29uLXVwLWRvd24tYXJyb3cnO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKiogXG4gICAgZGVib3VuY2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW1vdGUgPyAzMDAgOiAwO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKiogXG4gICAgLy8gUHJvcGVydHkgdGhhdCBkeW5hbWljYWxseSByZXR1cm5zIGRpZmZlcmVudCB0ZXh0IHdoZW4gc2VsZWN0IHJlc3VsdHMgYXJlIGVtcHR5XG4gICAgLy8gUmV0dXJucyBmYWxzZSB3aGVuOiBubyBvcHRpb25zLCBubyBxdWVyeSwgJiBnZXR0aW5nIGRhdGEgZnJvbSByZW1vdGUgc2VydmVyIFxuICAgIC8vIElmIG5vdCBsb2FkaW5nIHJldHVybnMgbnVsbCAgXG4gICAgZW1wdHlUZXh0KCkge1xuICAgICAgXG4gICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRpbmdUZXh0IHx8ICdMb2FkaW5nJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnJlbW90ZSAmJiB0aGlzLnF1ZXJ5ID09PSAnJyAmJiB0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUgJiYgdGhpcy5vcHRpb25zLmxlbmd0aCA+IDAgJiYgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudCA9PT0gMCkgeyAgICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiB0aGlzLm5vTWF0Y2hUZXh0IHx8ICdObyBtYXRjaGVzJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5vRGF0YVRleHQgfHwgJ05vIERhdGEnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqIFxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZiBmaWx0ZXJhYmxlLCBhbGxvd0NyZWF0ZSwgYW5kIHRoZXJlIGlzIGEgcXVlcnkuICBcbiAgICBzaG93TmV3T3B0aW9uKCkge1xuICAgICAgbGV0IGhhc0V4aXN0aW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gIW9wdGlvbi5jcmVhdGVkKVxuICAgICAgICAuc29tZShvcHRpb24gPT4gb3B0aW9uLmN1cnJlbnRMYWJlbCA9PT0gdGhpcy5xdWVyeSk7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJhYmxlICYmIHRoaXMuYWxsb3dDcmVhdGUgJiYgdGhpcy5xdWVyeSAhPT0gJycgJiYgIWhhc0V4aXN0aW5nT3B0aW9uO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRzOiB7XG4gICAgJ2lucHV0LWZpZWxkJzogSW5wdXRGaWVsZCxcbiAgICAnc2VsZWN0LW1lbnUnOiBTZWxlY3RNZW51LFxuICAgICdzZWxlY3Qtb3B0aW9uJzogT3B0aW9uLFxuICAgICd0YWcnOiBUYWdcbiAgfSxcblxuICBkaXJlY3RpdmVzOiB7IENsaWNrb3V0c2lkZSB9LFxuXG4gIHByb3BzOiB7XG4gICAgbmFtZTogU3RyaW5nLFxuICAgIHZhbHVlOiB7XG4gICAgICByZXF1aXJlZDogdHJ1ZVxuICAgIH0sICAgICAgXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgY2xlYXJhYmxlOiBCb29sZWFuLFxuICAgIGZpbHRlcmFibGU6IEJvb2xlYW4sXG4gICAgYWxsb3dDcmVhdGU6IEJvb2xlYW4sXG4gICAgbG9hZGluZzogQm9vbGVhbixcbiAgICBwb3BwZXJDbGFzczogU3RyaW5nLFxuICAgIHJlbW90ZTogQm9vbGVhbixcbiAgICBsb2FkaW5nVGV4dDogU3RyaW5nLFxuICAgIG5vTWF0Y2hUZXh0OiBTdHJpbmcsXG4gICAgbm9EYXRhVGV4dDogU3RyaW5nLFxuICAgIHJlbW90ZU1ldGhvZDogRnVuY3Rpb24sXG4gICAgZmlsdGVyTWV0aG9kOiBGdW5jdGlvbixcbiAgICBtdWx0aXBsZTogQm9vbGVhbixcbiAgICBtdWx0aXBsZUxpbWl0OiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuICdTZWxlY3QgUGxhY2Vob2xkZXInO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVmYXVsdEZpcnN0T3B0aW9uOiBCb29sZWFuLFxuICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfSxcbiAgICBpbnB1dE1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfVxuICB9LFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgY2FjaGVkT3B0aW9uczogW10sXG4gICAgICBjcmVhdGVkTGFiZWw6IG51bGwsXG4gICAgICBjcmVhdGVkU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgc2VsZWN0ZWQ6IHRoaXMubXVsdGlwbGUgPyBbXSA6IHt9LFxuICAgICAgaXNTZWxlY3Q6IHRydWUsXG4gICAgICBpbnB1dExlbmd0aDogMjAsXG4gICAgICBpbnB1dFdpZHRoOiAwLFxuICAgICAgY2FjaGVkUGxhY2VIb2xkZXI6ICcnLFxuICAgICAgb3B0aW9uc0NvdW50OiAwLFxuICAgICAgZmlsdGVyZWRPcHRpb25zQ291bnQ6IDAsXG4gICAgICBkcm9wZG93blVsOiBudWxsLFxuICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICBzZWxlY3RlZExhYmVsOiAnJyxcbiAgICAgIGhvdmVySW5kZXg6IC0xLFxuICAgICAgcXVlcnk6ICcnLFxuICAgICAgYm90dG9tT3ZlcmZsb3c6IDAsXG4gICAgICB0b3BPdmVyZmxvdzogMCxcbiAgICAgIG9wdGlvbnNBbGxEaXNhYmxlZDogZmFsc2UsXG4gICAgICBpbnB1dEhvdmVyaW5nOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRQbGFjZWhvbGRlcjogJydcbiAgICB9O1xuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgcGxhY2Vob2xkZXIodmFsKSB7XG4gICAgICB0aGlzLmNhY2hlZFBsYWNlSG9sZGVyID0gdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSB2YWw7XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKioqXG4gICAgdmFsdWUodmFsKSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwIHx8ICh0aGlzLiRyZWZzLmlucHV0ICYmIHRoaXMucXVlcnkgIT09ICcnKSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVyID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSB0aGlzLmNhY2hlZFBsYWNlSG9sZGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNldFNlbGVjdGVkKCk7XG4gICAgICBpZiAodGhpcy5maWx0ZXJhYmxlICYmICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuaW5wdXRMZW5ndGggPSAyMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbCk7XG4gICAgICB0aGlzLmRpc3BhdGNoKCdGb3JtSXRlbScsICdmb3JtLmNoYW5nZScsIHZhbCk7XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKioqXG4gICAgLy8gUmVwcmVzZW50cyBjdXJyZW50IHVzZXIgcXVlcnkgaW4gc2VsZWN0ICBcbiAgICAvLyBVcG9uIHNldHRpbmcgdGhpcyBwcm9wZXJ0eSBjYWxsIHRoZSBmaWx0ZXJNZXRob2Qgb24gdGhlIHZhbHVlLiBcbiAgICBxdWVyeSh2YWwpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkgdGhpcy5icm9hZGNhc3QoJ1NlbGVjdERyb3Bkb3duJywgJ3VwZGF0ZVBvcHBlcicpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmhvdmVySW5kZXggPSAtMTtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlICYmIHRoaXMuZmlsdGVyYWJsZSkge1xuICAgICAgICB0aGlzLmlucHV0TGVuZ3RoID0gdGhpcy4kcmVmcy5pbnB1dC52YWx1ZS5sZW5ndGggKiAxNSArIDIwO1xuICAgICAgICB0aGlzLm1hbmFnZVBsYWNlaG9sZGVyKCk7XG4gICAgICAgIHRoaXMucmVzZXRJbnB1dEhlaWdodCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVtb3RlICYmIHR5cGVvZiB0aGlzLnJlbW90ZU1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmhvdmVySW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5yZW1vdGVNZXRob2QodmFsKTtcbiAgICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdyZXNldEluZGV4Jyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmZpbHRlck1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmZpbHRlck1ldGhvZCh2YWwpO1xuICAgICAgICB0aGlzLmJyb2FkY2FzdCgnT3B0aW9uR3JvdXAnLCAncXVlcnlDaGFuZ2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRPcHRpb25zQ291bnQgPSB0aGlzLm9wdGlvbnNDb3VudDtcbiAgICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdxdWVyeUNoYW5nZScsIHZhbCk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdPcHRpb25Hcm91cCcsICdxdWVyeUNoYW5nZScpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGVmYXVsdEZpcnN0T3B0aW9uICYmICh0aGlzLmZpbHRlcmFibGUgfHwgdGhpcy5yZW1vdGUpICYmIHRoaXMuZmlsdGVyZWRPcHRpb25zQ291bnQpIHtcbiAgICAgICAgdGhpcy5jaGVja0RlZmF1bHRGaXJzdE9wdGlvbigpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqKlxuICAgIHZpc2libGUodmFsKSB7XG4gICAgICAvLyBJZiB2aXNpYmxlIGlzIHNldCB0byBmYWxzZSAgICAgICAgIFxuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgLy8gY2FsbCBibHVyKCkgb24gdGhlIGlucHV0LWZpZWxkIFxuICAgICAgICB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kZWwucXVlcnlTZWxlY3RvcignaW5wdXQnKS5ibHVyKCk7XG4gICAgICAgIC8vIHRoaXMuJHJlZnMucmVmZXJlbmNlLiRyZWZzLmlucHV0Q29tcG9uZW50LiRlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmJsdXIoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEhpZGUgaWNvbnMgXG4gICAgICAgIHRoaXMuaGFuZGxlSWNvbkhpZGUoKTtcblxuICAgICAgICAvLyBEZXN0cm95IFBvcHBlciAgXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdTZWxlY3REcm9wZG93bicsICdkZXN0cm95UG9wcGVyJyk7XG5cbiAgICAgICAgLy8gQmx1ciB0YWcgaW5wdXQgXG4gICAgICAgIGlmICh0aGlzLiRyZWZzLmlucHV0KSB7XG4gICAgICAgICAgdGhpcy4kcmVmcy5pbnB1dC5ibHVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNldCBxdWVyeSwgc2VsZWN0ZWQgYW5kIGlucHV0IHBsYWNlaG9sZGVyIHRvIGVtcHR5IHN0cmluZyBcbiAgICAgICAgdGhpcy5xdWVyeSA9ICcnO1xuICAgICAgICB0aGlzLnNlbGVjdGVkTGFiZWwgPSAnJztcbiAgICAgICAgdGhpcy5pbnB1dExlbmd0aCA9IDIwO1xuICAgICAgICB0aGlzLnJlc2V0SG92ZXJJbmRleCgpO1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuaW5wdXQgJiZcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQudmFsdWUgPT09ICcnICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSB0aGlzLmNhY2hlZFBsYWNlSG9sZGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZ2V0T3ZlcmZsb3dzKCk7XG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUgJiYgdGhpcy5hbGxvd0NyZWF0ZSAmJlxuICAgICAgICAgICAgICB0aGlzLmNyZWF0ZWRTZWxlY3RlZCAmJiB0aGlzLmNyZWF0ZWRPcHRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExhYmVsID0gdGhpcy5jcmVhdGVkTGFiZWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGFiZWwgPSB0aGlzLnNlbGVjdGVkLmN1cnJlbnRMYWJlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHRoaXMucXVlcnkgPSB0aGlzLnNlbGVjdGVkTGFiZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgLy8gSWYgaXMgdmlzaWJsZSBcbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBTaG93IGljb25zIFxuICAgICAgICB0aGlzLmhhbmRsZUljb25TaG93KCk7XG5cbiAgICAgICAgLy8gQnJvYWRjYXN0IHVwZGF0ZVBvcHBlciBldmVudCBcbiAgICAgICAgdGhpcy5icm9hZGNhc3QoJ1NlbGVjdERyb3Bkb3duJywgJ3VwZGF0ZVBvcHBlcicpO1xuXG4gICAgICAgIC8vIFNob3cgZmlsdGVyZWQgcmVzdWx0cyBcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyYWJsZSkge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnNlbGVjdGVkTGFiZWw7XG4gICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlbW90ZSkge1xuICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdCgnT3B0aW9uJywgJ3F1ZXJ5Q2hhbmdlJywgJycpO1xuICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdCgnT3B0aW9uR3JvdXAnLCAncXVlcnlDaGFuZ2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KCdJbnB1dCcsICdpbnB1dFNlbGVjdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy4kZW1pdCgndmlzaWJsZS1jaGFuZ2UnLCB2YWwpO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqKlxuICAgIG9wdGlvbnModmFsKSB7XG4gICAgICBpZiAodGhpcy4kaXNTZXJ2ZXIpIHJldHVybjtcbiAgICAgIHRoaXMub3B0aW9uc0FsbERpc2FibGVkID0gdmFsLmxlbmd0aCA9PT0gdmFsLmZpbHRlcihpdGVtID0+IGl0ZW0uZGlzYWJsZWQgPT09IHRydWUpLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMucmVzZXRJbnB1dEhlaWdodCgpO1xuICAgICAgfVxuICAgICAgbGV0IGlucHV0cyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgICBpZiAoW10uaW5kZXhPZi5jYWxsKGlucHV0cywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgPT09IC0xKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRlZmF1bHRGaXJzdE9wdGlvbiAmJiAodGhpcy5maWx0ZXJhYmxlIHx8IHRoaXMucmVtb3RlKSAmJiB0aGlzLmZpbHRlcmVkT3B0aW9uc0NvdW50KSB7XG4gICAgICAgIHRoaXMuY2hlY2tEZWZhdWx0Rmlyc3RPcHRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8vIERPTkUgKioqKioqXG4gICAgaGFuZGxlSWNvbkhpZGUoKSB7XG4gICAgICBsZXQgaWNvbiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dF9faWNvbicpO1xuICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaWNvbiwgJ2lzLXJldmVyc2UnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICBoYW5kbGVJY29uU2hvdygpIHtcbiAgICAgIGxldCBpY29uID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmlucHV0X19pY29uJyk7XG4gICAgICBpZiAoaWNvbiAmJiAhaGFzQ2xhc3MoaWNvbiwgJ2ljb24tY2lyY2xlLWNsb3NlJykpIHtcbiAgICAgICAgYWRkQ2xhc3MoaWNvbiwgJ2lzLXJldmVyc2UnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICBoYW5kbGVNZW51RW50ZXIoKSB7XG4gICAgICBpZiAoIXRoaXMuZHJvcGRvd25VbCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3duVWwgPSB0aGlzLiRyZWZzLnBvcHBlci4kZWwucXVlcnlTZWxlY3RvcignLnNlbGVjdF9fb3B0aW9ucycpO1xuICAgICAgICB0aGlzLmdldE92ZXJmbG93cygpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMuZHJvcGRvd25VbCkge1xuICAgICAgICB0aGlzLnJlc2V0TWVudVNjcm9sbCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqKlxuICAgIC8vIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gcG9wcGVyIFxuICAgIC8vICYmIGlmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgb3B0aW9uIGNvbXBvbmVudCBcbiAgICAgIC8vIHNldCB0aGUgYm90dG9tIGFuZCB0b3Agb3ZlcmZsb3cgdG8gYmUgdXNlZCBpbiByZXNldHRpbmcgdGhlIHNjcm9sbC5cbiAgICBnZXRPdmVyZmxvd3MoKSB7ICAgICAgICAgXG4gICAgICBpZiAodGhpcy5kcm9wZG93blVsICYmIHRoaXMuc2VsZWN0ZWQgJiYgdGhpcy5zZWxlY3RlZC4kZWwpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkUmVjdCA9IHRoaXMuc2VsZWN0ZWQuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgcG9wcGVyUmVjdCA9IHRoaXMuJHJlZnMucG9wcGVyLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5ib3R0b21PdmVyZmxvdyA9IHNlbGVjdGVkUmVjdC5ib3R0b20gLSBwb3BwZXJSZWN0LmJvdHRvbTtcbiAgICAgICAgdGhpcy50b3BPdmVyZmxvdyA9IHNlbGVjdGVkUmVjdC50b3AgLSBwb3BwZXJSZWN0LnRvcDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICAvLyBVc2UgdmFsdWUgb2Ygb3ZlcmZsb3cocykgdG8gcmVzZXQgc2Nyb2xsIHBvc2l0aW9uIG9mIERyb3Bkb3duIHBvcHBlciAgXG4gICAgcmVzZXRNZW51U2Nyb2xsKCkge1xuICAgICAgaWYgKHRoaXMuYm90dG9tT3ZlcmZsb3cgPiAwKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd25VbC5zY3JvbGxUb3AgKz0gdGhpcy5ib3R0b21PdmVyZmxvdztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy50b3BPdmVyZmxvdyA8IDApIHtcbiAgICAgICAgdGhpcy5kcm9wZG93blVsLnNjcm9sbFRvcCArPSB0aGlzLnRvcE92ZXJmbG93O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRPcHRpb24odmFsdWUpIHtcbiAgICAgIGxldCBvcHRpb247XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5jYWNoZWRPcHRpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGNhY2hlZE9wdGlvbiA9IHRoaXMuY2FjaGVkT3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKGNhY2hlZE9wdGlvbi52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBvcHRpb24gPSBjYWNoZWRPcHRpb247XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24pIHJldHVybiBvcHRpb247XG4gICAgICBjb25zdCBsYWJlbCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuICAgICAgICA/IHZhbHVlIDogJyc7XG4gICAgICBsZXQgbmV3T3B0aW9uID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGN1cnJlbnRMYWJlbDogbGFiZWxcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICBuZXdPcHRpb24uaGl0U3RhdGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdPcHRpb247XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKiogXG4gICAgLy8gTWV0aG9kIHRvIFNldCB0aGUgc2VsZWN0ZWQgb3B0aW9uIFxuICAgIHNldFNlbGVjdGVkKCkge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIGxldCBvcHRpb24gPSB0aGlzLmdldE9wdGlvbih0aGlzLnZhbHVlKTtcbiAgICAgICAgaWYgKG9wdGlvbi5jcmVhdGVkKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVkTGFiZWwgPSBvcHRpb24uY3VycmVudExhYmVsO1xuICAgICAgICAgIHRoaXMuY3JlYXRlZFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZWRTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRMYWJlbCA9IG9wdGlvbi5jdXJyZW50TGFiZWw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBvcHRpb247XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHRoaXMucXVlcnkgPSB0aGlzLnNlbGVjdGVkTGFiZWw7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICAgIHRoaXMudmFsdWUuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5nZXRPcHRpb24odmFsdWUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLnNlbGVjdGVkID0gcmVzdWx0O1xuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoYW5kbGVGb2N1cygpIHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGhhbmRsZUljb25DbGljayhldmVudCkge1xuICAgICAgaWYgKHRoaXMuaWNvbkNsYXNzLmluZGV4T2YoJ2NpcmNsZS1jbG9zZScpID4gLTEpIHtcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZChldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaGFuZGxlTW91c2VEb3duKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLnZpc2libGUpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkb0Rlc3Ryb3koKSB7XG4gICAgICB0aGlzLiRyZWZzLnBvcHBlciAmJiB0aGlzLiRyZWZzLnBvcHBlci5kb0Rlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xvc2UoKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlTGFzdE9wdGlvbkhpdFN0YXRlKGhpdCkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSByZXR1cm47XG4gICAgICBjb25zdCBvcHRpb24gPSB0aGlzLnNlbGVjdGVkW3RoaXMuc2VsZWN0ZWQubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoIW9wdGlvbikgcmV0dXJuO1xuXG4gICAgICBpZiAoaGl0ID09PSB0cnVlIHx8IGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgb3B0aW9uLmhpdFN0YXRlID0gaGl0O1xuICAgICAgICByZXR1cm4gaGl0O1xuICAgICAgfVxuXG4gICAgICBvcHRpb24uaGl0U3RhdGUgPSAhb3B0aW9uLmhpdFN0YXRlO1xuICAgICAgcmV0dXJuIG9wdGlvbi5oaXRTdGF0ZTtcbiAgICB9LFxuXG4gICAgZGVsZXRlUHJldlRhZyhlKSB7XG4gICAgICBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoIDw9IDAgJiYgIXRoaXMudG9nZ2xlTGFzdE9wdGlvbkhpdFN0YXRlKCkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKCk7XG4gICAgICAgIHZhbHVlLnBvcCgpO1xuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbWFuYWdlUGxhY2Vob2xkZXIoKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgIT09ICcnKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVyID0gdGhpcy4kcmVmcy5pbnB1dC52YWx1ZSA/ICcnIDogdGhpcy5jYWNoZWRQbGFjZUhvbGRlcjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRJbnB1dFN0YXRlKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgIT09IDgpIHRoaXMudG9nZ2xlTGFzdE9wdGlvbkhpdFN0YXRlKGZhbHNlKTtcbiAgICAgIHRoaXMuaW5wdXRMZW5ndGggPSB0aGlzLiRyZWZzLmlucHV0LnZhbHVlLmxlbmd0aCAqIDE1ICsgMjA7XG4gICAgICB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICB9LFxuXG4gICAgcmVzZXRJbnB1dEhlaWdodCgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLiRyZWZzLnJlZmVyZW5jZSkgcmV0dXJuO1xuICAgICAgICAvLyBsZXQgaW5wdXRDaGlsZE5vZGVzID0gdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLmNoaWxkTm9kZXM7XG4gICAgICAgIC8vIENoYW5nZSBsb2dpYyB0byB1c2Ugc2VsZWN0b3IuIFxuICAgICAgICAvLyBsZXQgaW5wdXQgPSBbXS5maWx0ZXIuY2FsbChpbnB1dENoaWxkTm9kZXMsIGl0ZW0gPT4gaXRlbS50YWdOYW1lID09PSAnSU5QVVQnKVswXTtcbiAgICAgICAgLy8gbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRyZWZzLmlucHV0Q29tcG9uZW50LiRyZWZzLmlucHV0O1xuICAgICAgICAvLyBsZXQgaW5wdXRDb21wb25lbnQgPSB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kZWwucXVlcnlTZWxlY3RvcignLmlucHV0Jyk7XG4gICAgICAgIGxldCBpbnB1dENvbXBvbmVudCA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRyZWZzLmlucHV0Q29tcG9uZW50LiRlbDtcbiAgICAgICAgLy8gdmFyIG5ld0hlaWdodCA9IE1hdGgubWF4KHRoaXMuJHJlZnMudGFncy5jbGllbnRIZWlnaHQgKyA2LCBzaXplTWFwW3RoaXMuc2l6ZV0gfHwgNDApICsgJ3B4JztcbiAgICAgICAgdmFyIG5ld0hlaWdodCA9IE1hdGgubWF4KHRoaXMuJHJlZnMudGFncy5jbGllbnRIZWlnaHQgKyA2LCA0MCkgKyAncHgnO1xuICAgICAgICBpbnB1dC5zdHlsZS5oZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgICAgIGlucHV0Q29tcG9uZW50LnN0eWxlLmhlaWdodCA9IG5ld0hlaWdodDtcblxuICAgICAgICBpZiAodGhpcy52aXNpYmxlICYmIHRoaXMuZW1wdHlUZXh0ICE9PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KCdTZWxlY3REcm9wZG93bicsICd1cGRhdGVQb3BwZXInKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc2V0SG92ZXJJbmRleCgpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBNYXRoLm1pbi5hcHBseShudWxsLCB0aGlzLnNlbGVjdGVkLm1hcChpdGVtID0+IHRoaXMub3B0aW9ucy5pbmRleE9mKGl0ZW0pKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaG92ZXJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgMzAwKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlT3B0aW9uU2VsZWN0KG9wdGlvbikge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gdmFsdWUuaW5kZXhPZihvcHRpb24udmFsdWUpO1xuICAgICAgICBpZiAob3B0aW9uSW5kZXggPiAtMSkge1xuICAgICAgICAgIHZhbHVlLnNwbGljZShvcHRpb25JbmRleCwgMSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tdWx0aXBsZUxpbWl0IDw9IDAgfHwgdmFsdWUubGVuZ3RoIDwgdGhpcy5tdWx0aXBsZUxpbWl0KSB7XG4gICAgICAgICAgdmFsdWUucHVzaChvcHRpb24udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgICBpZiAob3B0aW9uLmNyZWF0ZWQpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgICAgICAgdGhpcy5pbnB1dExlbmd0aCA9IDIwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0Jywgb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHRvZ2dsZU1lbnUoKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJhYmxlICYmIHRoaXMucXVlcnkgPT09ICcnICYmIHRoaXMudmlzaWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMudmlzaWJsZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbmF2aWdhdGVPcHRpb25zKGRpcmVjdGlvbikge1xuICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDAgfHwgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudCA9PT0gMCkgcmV0dXJuO1xuICAgICAgdGhpcy5vcHRpb25zQWxsRGlzYWJsZWQgPSB0aGlzLm9wdGlvbnMubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5kaXNhYmxlZCA9PT0gdHJ1ZSkubGVuZ3RoO1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnNBbGxEaXNhYmxlZCkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgICB0aGlzLmhvdmVySW5kZXgrKztcbiAgICAgICAgICBpZiAodGhpcy5ob3ZlckluZGV4ID09PSB0aGlzLm9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLmRpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS5ncm91cERpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICAhdGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0udmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZU9wdGlvbnMoJ25leHQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgdGhpcy5ob3ZlckluZGV4LS07XG4gICAgICAgICAgaWYgKHRoaXMuaG92ZXJJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuaG92ZXJJbmRleCA9IHRoaXMub3B0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLmRpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS5ncm91cERpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICAhdGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0udmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZU9wdGlvbnMoJ3ByZXYnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRTY3JvbGxUb3AoKSB7XG4gICAgICBsZXQgYm90dG9tT3ZlcmZsb3dEaXN0YW5jZSA9IHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gLVxuICAgICAgICB0aGlzLiRyZWZzLnBvcHBlci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xuICAgICAgbGV0IHRvcE92ZXJmbG93RGlzdGFuY2UgPSB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgdGhpcy4kcmVmcy5wb3BwZXIuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgIGlmIChib3R0b21PdmVyZmxvd0Rpc3RhbmNlID4gMCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3duVWwuc2Nyb2xsVG9wICs9IGJvdHRvbU92ZXJmbG93RGlzdGFuY2U7XG4gICAgICB9XG4gICAgICBpZiAodG9wT3ZlcmZsb3dEaXN0YW5jZSA8IDApIHtcbiAgICAgICAgdGhpcy5kcm9wZG93blVsLnNjcm9sbFRvcCArPSB0b3BPdmVyZmxvd0Rpc3RhbmNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZWxlY3RPcHRpb24oKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVPcHRpb25TZWxlY3QodGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGVTZWxlY3RlZChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICcnKTtcbiAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy4kZW1pdCgnY2xlYXInKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlVGFnKGV2ZW50LCB0YWcpIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuc2VsZWN0ZWQuaW5kZXhPZih0YWcpO1xuICAgICAgaWYgKGluZGV4ID4gLTEgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKCk7XG4gICAgICAgIHZhbHVlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgICB0aGlzLiRlbWl0KCdyZW1vdmUtdGFnJywgdGFnKTtcbiAgICAgIH1cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBvbklucHV0Q2hhbmdlKCkge1xuICAgICAgaWYgKHRoaXMuZmlsdGVyYWJsZSkge1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWxlY3RlZExhYmVsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbk9wdGlvbkRlc3Ryb3kob3B0aW9uKSB7XG4gICAgICB0aGlzLm9wdGlvbnNDb3VudC0tO1xuICAgICAgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudC0tO1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2Yob3B0aW9uKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdyZXNldEluZGV4Jyk7XG4gICAgfSxcblxuICAgIHJlc2V0SW5wdXRXaWR0aCgpIHtcbiAgICAgIHRoaXMuaW5wdXRXaWR0aCA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICB9LFxuXG4gICAgaGFuZGxlUmVzaXplKCkge1xuICAgICAgdGhpcy5yZXNldElucHV0V2lkdGgoKTtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICB9LFxuXG4gICAgLy8gT0sgKioqKioqXG4gICAgY2hlY2tEZWZhdWx0Rmlyc3RPcHRpb24oKSB7XG4gICAgICB0aGlzLmhvdmVySW5kZXggPSAtMTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSB0aGlzLm9wdGlvbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xuICAgICAgICAgIC8vIHBpY2sgZmlyc3Qgb3B0aW9ucyB0aGF0IHBhc3NlcyB0aGUgZmlsdGVyXG4gICAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQgJiYgIW9wdGlvbi5ncm91cERpc2FibGVkICYmIG9wdGlvbi52aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHBpY2sgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvblxuICAgICAgICAgIGlmIChvcHRpb24uaXRlbVNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gRE9ORSAqKioqKipcbiAgY3JlYXRlZCgpIHtcbiAgICAvLyBzZXQgY2FjaGVkUGxhY2VIb2xkZXJcbiAgICB0aGlzLmNhY2hlZFBsYWNlSG9sZGVyID0gdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyO1xuXG4gICAgLy8gaWYgbXVsdGlwbGUgc2VsZWN0IHNlbmQgYW4gYXJyYXkgdGhyb3VnaCBpbnB1dCBldmVudCBwYXlsb2FkIFxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIFtdKTtcbiAgICB9XG5cbiAgICAvLyBpZiBub3QgbXVsdGlwbGUgc2VsZWN0IHNlbmQgYSBzdHJpbmcgdGhyb3VnaCBpbnB1dCBldmVudCBwYXlsb2FkIFxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICcnKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHNldFNlbGVjdGVkXG4gICAgdGhpcy5zZXRTZWxlY3RlZCgpO1xuXG4gICAgdGhpcy5kZWJvdW5jZWRPbklucHV0Q2hhbmdlID0gZGVib3VuY2UodGhpcy5kZWJvdW5jZSwgKCkgPT4ge1xuICAgICAgdGhpcy5vbklucHV0Q2hhbmdlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRvbignaGFuZGxlT3B0aW9uQ2xpY2snLCB0aGlzLmhhbmRsZU9wdGlvblNlbGVjdCk7XG4gICAgdGhpcy4kb24oJ29uT3B0aW9uRGVzdHJveScsIHRoaXMub25PcHRpb25EZXN0cm95KTtcbiAgICB0aGlzLiRvbignc2V0U2VsZWN0ZWQnLCB0aGlzLnNldFNlbGVjdGVkKTtcbiAgfSxcblxuICAvLyBPSyAqKioqKipcbiAgbW91bnRlZCgpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSAnJztcbiAgICB9XG4gICAgYWRkUmVzaXplTGlzdGVuZXIodGhpcy4kZWwsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICBpZiAodGhpcy5yZW1vdGUgJiYgdGhpcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5yZXNldElucHV0SGVpZ2h0KCk7XG4gICAgfVxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLiRyZWZzLnJlZmVyZW5jZSAmJiB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kZWwpIHtcbiAgICAgICAgdGhpcy5pbnB1dFdpZHRoID0gdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8vIE9LICoqKioqKlxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIGlmICh0aGlzLiRlbCAmJiB0aGlzLmhhbmRsZVJlc2l6ZSkgcmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy4kZWwsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgfVxufTtcbiJdfQ==
