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

  var enhancedSelectTemplate = '\n<div\n  class="select"\n  :class="modifierStyles"\n  v-clickoutside="handleClose">\n  <!-- MULTIPLE SELECT / TAGS -->\n  <div\n    class="select__tags"\n    v-if="multiple"\n    @click.stop="toggleMenu"\n    ref="tags"\n    :style="{ \'max-width\': inputWidth - 32 + \'px\' }">\n    <transition-group @after-leave="resetInputHeight">\n      <tag\n        v-for="item in selected"\n        :key="item.value"\n        closable\n        :hit="item.hitState"\n        type="primary"\n        @close="deleteTag($event, item)"\n        close-transition>\n        <span class="select__tags-text">{{ item.currentLabel }}</span>\n      </tag>\n    </transition-group>\n\n    <input\n      type="text"\n      class="select__filter-input"\n      @focus="visible = true"\n      :disabled="disabled"      \n      @keyup="managePlaceholder"      \n      @keydown.down.prevent="navigateOptions(\'next\')"\n      @keydown.up.prevent="navigateOptions(\'prev\')"\n      @keydown.enter.prevent="selectOption"\n      @keydown.esc.stop.prevent="visible = false"\n      @keydown.delete="deletePrevTag"\n      v-model="query"\n      :debounce="remote ? 300 : 0"\n      v-if="filterable"\n      :style="{ \'max-width\': inputWidth - 42 + \'px\'}"    \n      ref="input">\n  </div>\n  <!-- OLD STYLE BINDING \n  :style="{ width: inputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\' }"\n   -->\n  <!-- END TAGS -->\n  <input-field\n    class="select__input"\n    ref="reference"\n    v-model="selectedLabel"\n    type="text"\n    :modifier-styles="inputModifierStyles"\n    :placeholder="currentPlaceholder"\n    :name="name"\n    :disabled="disabled"\n    :readonly="!filterable || multiple"\n    :validate-event="false"\n    @focus="handleFocus"\n    @click="handleIconClick"\n    @mousedown.native="handleMouseDown"\n    @keyup.native="debouncedOnInputChange"\n    @keydown.native.down.prevent="navigateOptions(\'next\')"\n    @keydown.native.up.prevent="navigateOptions(\'prev\')"\n    @keydown.native.enter.prevent="selectOption"\n    @keydown.native.esc.stop.prevent="visible = false"\n    @keydown.native.tab="visible = false"\n    @paste.native="debouncedOnInputChange"\n    @mouseenter.native="inputHovering = true"\n    @mouseleave.native="inputHovering = false"\n    :icon="iconClass">\n  </input-field>\n  <transition\n    name="el-zoom-in-top"\n    @after-leave="doDestroy"\n    @after-enter="handleMenuEnter">\n    <select-menu\n      ref="popper"\n      v-show="visible && emptyText !== false"\n      :class="modifierStyles"     \n      >\n        <ul\n          class="select__options"\n          :class="[{ \'is-empty\': !allowCreate && filteredOptionsCount === 0 }]"\n          v-show="options.length > 0 && !loading" \n        >\n          <select-option\n            :value="query"\n            created\n            v-if="showNewOption">\n          </select-option>\n          <slot></slot>\n        </ul>\n      <p class="select__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>\n    </select-menu>\n  </transition>\n</div>\n';

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
          // this.broadcast('SelectDropdown', 'destroyPopper');

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
          var input = _this5.$refs.reference.$el.querySelector('input');
          // let input = this.$refs.reference.$refs.inputComponent.$refs.input;
          var inputComponent = _this5.$refs.reference.$el.querySelector('.input');
          // let inputComponent = this.$refs.reference.$refs.inputComponent.$el;
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
      if (this.$el && this.handleResize) {
        this.broadcast('SelectDropdown', 'destroyPopper');
        (0, _resizeEvent.removeResizeListener)(this.$el, this.handleResize);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvRW5oYW5jZWRTZWxlY3QuanMiXSwibmFtZXMiOlsiZW5oYW5jZWRTZWxlY3RUZW1wbGF0ZSIsIm1peGlucyIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wdXRlZCIsImljb25DbGFzcyIsImNyaXRlcmlhIiwiY2xlYXJhYmxlIiwiZGlzYWJsZWQiLCJpbnB1dEhvdmVyaW5nIiwibXVsdGlwbGUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInJlbW90ZSIsImZpbHRlcmFibGUiLCJkZWJvdW5jZSIsImVtcHR5VGV4dCIsImxvYWRpbmciLCJsb2FkaW5nVGV4dCIsInF1ZXJ5Iiwib3B0aW9ucyIsImxlbmd0aCIsImZpbHRlcmVkT3B0aW9uc0NvdW50Iiwibm9NYXRjaFRleHQiLCJub0RhdGFUZXh0Iiwic2hvd05ld09wdGlvbiIsImhhc0V4aXN0aW5nT3B0aW9uIiwiZmlsdGVyIiwib3B0aW9uIiwiY3JlYXRlZCIsInNvbWUiLCJjdXJyZW50TGFiZWwiLCJhbGxvd0NyZWF0ZSIsImNvbXBvbmVudHMiLCJkaXJlY3RpdmVzIiwiQ2xpY2tvdXRzaWRlIiwicHJvcHMiLCJTdHJpbmciLCJyZXF1aXJlZCIsIkJvb2xlYW4iLCJwb3BwZXJDbGFzcyIsInJlbW90ZU1ldGhvZCIsIkZ1bmN0aW9uIiwiZmlsdGVyTWV0aG9kIiwibXVsdGlwbGVMaW1pdCIsInR5cGUiLCJOdW1iZXIiLCJkZWZhdWx0IiwicGxhY2Vob2xkZXIiLCJkZWZhdWx0Rmlyc3RPcHRpb24iLCJtb2RpZmllclN0eWxlcyIsIkFycmF5IiwiaW5wdXRNb2RpZmllclN0eWxlcyIsImRhdGEiLCJjYWNoZWRPcHRpb25zIiwiY3JlYXRlZExhYmVsIiwiY3JlYXRlZFNlbGVjdGVkIiwic2VsZWN0ZWQiLCJpc1NlbGVjdCIsImlucHV0TGVuZ3RoIiwiaW5wdXRXaWR0aCIsImNhY2hlZFBsYWNlSG9sZGVyIiwib3B0aW9uc0NvdW50IiwiZHJvcGRvd25VbCIsInZpc2libGUiLCJzZWxlY3RlZExhYmVsIiwiaG92ZXJJbmRleCIsImJvdHRvbU92ZXJmbG93IiwidG9wT3ZlcmZsb3ciLCJvcHRpb25zQWxsRGlzYWJsZWQiLCJjdXJyZW50UGxhY2Vob2xkZXIiLCJ3YXRjaCIsInZhbCIsInJlc2V0SW5wdXRIZWlnaHQiLCIkcmVmcyIsImlucHV0Iiwic2V0U2VsZWN0ZWQiLCIkZW1pdCIsImRpc3BhdGNoIiwiJG5leHRUaWNrIiwiYnJvYWRjYXN0IiwibWFuYWdlUGxhY2Vob2xkZXIiLCJjaGVja0RlZmF1bHRGaXJzdE9wdGlvbiIsInJlZmVyZW5jZSIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCJibHVyIiwiaGFuZGxlSWNvbkhpZGUiLCJyZXNldEhvdmVySW5kZXgiLCJnZXRPdmVyZmxvd3MiLCJjcmVhdGVkT3B0aW9uIiwiaGFuZGxlSWNvblNob3ciLCJmb2N1cyIsIiRpc1NlcnZlciIsIml0ZW0iLCJpbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5kZXhPZiIsImNhbGwiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJtZXRob2RzIiwiaWNvbiIsImhhbmRsZU1lbnVFbnRlciIsInBvcHBlciIsInJlc2V0TWVudVNjcm9sbCIsInNlbGVjdGVkUmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBvcHBlclJlY3QiLCJib3R0b20iLCJ0b3AiLCJzY3JvbGxUb3AiLCJnZXRPcHRpb24iLCJpIiwiY2FjaGVkT3B0aW9uIiwibGFiZWwiLCJuZXdPcHRpb24iLCJoaXRTdGF0ZSIsInJlc3VsdCIsImlzQXJyYXkiLCJmb3JFYWNoIiwicHVzaCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlSWNvbkNsaWNrIiwiZXZlbnQiLCJkZWxldGVTZWxlY3RlZCIsInRvZ2dsZU1lbnUiLCJoYW5kbGVNb3VzZURvd24iLCJ0YXJnZXQiLCJ0YWdOYW1lIiwiaGFuZGxlQ2xvc2UiLCJwcmV2ZW50RGVmYXVsdCIsImRvRGVzdHJveSIsInRvZ2dsZUxhc3RPcHRpb25IaXRTdGF0ZSIsImhpdCIsImRlbGV0ZVByZXZUYWciLCJlIiwic2xpY2UiLCJwb3AiLCJyZXNldElucHV0U3RhdGUiLCJrZXlDb2RlIiwiaW5wdXRDb21wb25lbnQiLCJuZXdIZWlnaHQiLCJNYXRoIiwibWF4IiwidGFncyIsImNsaWVudEhlaWdodCIsInN0eWxlIiwiaGVpZ2h0Iiwic2V0VGltZW91dCIsIm1pbiIsImFwcGx5IiwibWFwIiwiaGFuZGxlT3B0aW9uU2VsZWN0Iiwib3B0aW9uSW5kZXgiLCJzcGxpY2UiLCJuYXZpZ2F0ZU9wdGlvbnMiLCJkaXJlY3Rpb24iLCJyZXNldFNjcm9sbFRvcCIsImdyb3VwRGlzYWJsZWQiLCJib3R0b21PdmVyZmxvd0Rpc3RhbmNlIiwidG9wT3ZlcmZsb3dEaXN0YW5jZSIsInNlbGVjdE9wdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImRlbGV0ZVRhZyIsInRhZyIsImluZGV4Iiwib25JbnB1dENoYW5nZSIsIm9uT3B0aW9uRGVzdHJveSIsInJlc2V0SW5wdXRXaWR0aCIsIndpZHRoIiwiaGFuZGxlUmVzaXplIiwiaXRlbVNlbGVjdGVkIiwiZGVib3VuY2VkT25JbnB1dENoYW5nZSIsIiRvbiIsIm1vdW50ZWQiLCJiZWZvcmVEZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUlBLHNpR0FBSjs7b0JBa0dlO0FBQ2JDLFlBQVEsbUJBREs7O0FBR2JDLFVBQU0sUUFITzs7QUFLYkMsY0FBVUgsc0JBTEc7O0FBT2JJLG1CQUFlLFFBUEY7O0FBU2JDLGNBQVU7QUFDUkMsZUFEUSx1QkFDSTtBQUNWLFlBQUlDLFdBQVcsS0FBS0MsU0FBTCxJQUNiLENBQUMsS0FBS0MsUUFETyxJQUViLEtBQUtDLGFBRlEsSUFHYixDQUFDLEtBQUtDLFFBSE8sSUFJYixLQUFLQyxLQUFMLEtBQWVDLFNBSkYsSUFLYixLQUFLRCxLQUFMLEtBQWUsRUFMakI7QUFNQSxlQUFPTCxXQUFXLGlDQUFYLEdBQWdELEtBQUtPLE1BQUwsSUFBZSxLQUFLQyxVQUFwQixHQUFpQyxFQUFqQyxHQUFzQyxvQkFBN0Y7QUFDQTtBQUNELE9BVk87QUFhUkMsY0FiUSxzQkFhRztBQUNULGVBQU8sS0FBS0YsTUFBTCxHQUFjLEdBQWQsR0FBb0IsQ0FBM0I7QUFDRCxPQWZPO0FBcUJSRyxlQXJCUSx1QkFxQkk7O0FBRVYsWUFBSSxLQUFLQyxPQUFULEVBQWtCO0FBQ2hCLGlCQUFPLEtBQUtDLFdBQUwsSUFBb0IsU0FBM0I7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJLEtBQUtMLE1BQUwsSUFBZSxLQUFLTSxLQUFMLEtBQWUsRUFBOUIsSUFBb0MsS0FBS0MsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLENBQWhFLEVBQW1FLE9BQU8sS0FBUDtBQUNuRSxjQUFJLEtBQUtQLFVBQUwsSUFBbUIsS0FBS00sT0FBTCxDQUFhQyxNQUFiLEdBQXNCLENBQXpDLElBQThDLEtBQUtDLG9CQUFMLEtBQThCLENBQWhGLEVBQW1GO0FBQ2pGLG1CQUFPLEtBQUtDLFdBQUwsSUFBb0IsWUFBM0I7QUFDRDtBQUNELGNBQUksS0FBS0gsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzdCLG1CQUFPLEtBQUtHLFVBQUwsSUFBbUIsU0FBMUI7QUFDRDtBQUNGO0FBQ0QsZUFBTyxJQUFQO0FBQ0QsT0FuQ087QUF1Q1JDLG1CQXZDUSwyQkF1Q1E7QUFBQTs7QUFDZCxZQUFJQyxvQkFBb0IsS0FBS04sT0FBTCxDQUFhTyxNQUFiLENBQW9CO0FBQUEsaUJBQVUsQ0FBQ0MsT0FBT0MsT0FBbEI7QUFBQSxTQUFwQixFQUNyQkMsSUFEcUIsQ0FDaEI7QUFBQSxpQkFBVUYsT0FBT0csWUFBUCxLQUF3QixNQUFLWixLQUF2QztBQUFBLFNBRGdCLENBQXhCO0FBRUEsZUFBTyxLQUFLTCxVQUFMLElBQW1CLEtBQUtrQixXQUF4QixJQUF1QyxLQUFLYixLQUFMLEtBQWUsRUFBdEQsSUFBNEQsQ0FBQ08saUJBQXBFO0FBQ0Q7QUEzQ08sS0FURzs7QUF1RGJPLGdCQUFZO0FBQ1YseUNBRFU7QUFFViw2Q0FGVTtBQUdWLHVDQUhVO0FBSVY7QUFKVSxLQXZEQzs7QUE4RGJDLGdCQUFZLEVBQUVDLG9DQUFGLEVBOURDOztBQWdFYkMsV0FBTztBQUNMbkMsWUFBTW9DLE1BREQ7QUFFTDFCLGFBQU87QUFDTDJCLGtCQUFVO0FBREwsT0FGRjtBQUtMOUIsZ0JBQVUrQixPQUxMO0FBTUxoQyxpQkFBV2dDLE9BTk47QUFPTHpCLGtCQUFZeUIsT0FQUDtBQVFMUCxtQkFBYU8sT0FSUjtBQVNMdEIsZUFBU3NCLE9BVEo7QUFVTEMsbUJBQWFILE1BVlI7QUFXTHhCLGNBQVEwQixPQVhIO0FBWUxyQixtQkFBYW1CLE1BWlI7QUFhTGQsbUJBQWFjLE1BYlI7QUFjTGIsa0JBQVlhLE1BZFA7QUFlTEksb0JBQWNDLFFBZlQ7QUFnQkxDLG9CQUFjRCxRQWhCVDtBQWlCTGhDLGdCQUFVNkIsT0FqQkw7QUFrQkxLLHFCQUFlO0FBQ2JDLGNBQU1DLE1BRE87QUFFYkMsaUJBQVM7QUFGSSxPQWxCVjtBQXNCTEMsbUJBQWE7QUFDWEgsY0FBTVIsTUFESztBQUVYVSxlQUZXLHNCQUVEO0FBQ1IsaUJBQU8sb0JBQVA7QUFDRDtBQUpVLE9BdEJSO0FBNEJMRSwwQkFBb0JWLE9BNUJmO0FBNkJMVyxzQkFBZ0I7QUFDZEwsY0FBTU0sS0FEUTtBQUVkSixpQkFBUztBQUZLLE9BN0JYO0FBaUNMSywyQkFBcUI7QUFDbkJQLGNBQU1NLEtBRGE7QUFFbkJKLGlCQUFTO0FBRlU7QUFqQ2hCLEtBaEVNOztBQXVHYk0sUUF2R2Esa0JBdUdOO0FBQ0wsYUFBTztBQUNMakMsaUJBQVMsRUFESjtBQUVMa0MsdUJBQWUsRUFGVjtBQUdMQyxzQkFBYyxJQUhUO0FBSUxDLHlCQUFpQixLQUpaO0FBS0xDLGtCQUFVLEtBQUsvQyxRQUFMLEdBQWdCLEVBQWhCLEdBQXFCLEVBTDFCO0FBTUxnRCxrQkFBVSxJQU5MO0FBT0xDLHFCQUFhLEVBUFI7QUFRTEMsb0JBQVksQ0FSUDtBQVNMQywyQkFBbUIsRUFUZDtBQVVMQyxzQkFBYyxDQVZUO0FBV0x4Qyw4QkFBc0IsQ0FYakI7QUFZTHlDLG9CQUFZLElBWlA7QUFhTEMsaUJBQVMsS0FiSjtBQWNMQyx1QkFBZSxFQWRWO0FBZUxDLG9CQUFZLENBQUMsQ0FmUjtBQWdCTC9DLGVBQU8sRUFoQkY7QUFpQkxnRCx3QkFBZ0IsQ0FqQlg7QUFrQkxDLHFCQUFhLENBbEJSO0FBbUJMQyw0QkFBb0IsS0FuQmY7QUFvQkw1RCx1QkFBZSxLQXBCVjtBQXFCTDZELDRCQUFvQjtBQXJCZixPQUFQO0FBdUJELEtBL0hZOzs7QUFpSWJDLFdBQU87QUFDTHZCLGlCQURLLHVCQUNPd0IsR0FEUCxFQUNZO0FBQ2YsYUFBS1gsaUJBQUwsR0FBeUIsS0FBS1Msa0JBQUwsR0FBMEJFLEdBQW5EO0FBQ0QsT0FISTtBQU1MN0QsV0FOSyxpQkFNQzZELEdBTkQsRUFNTTtBQUNULFlBQUksS0FBSzlELFFBQVQsRUFBbUI7QUFDakIsZUFBSytELGdCQUFMO0FBQ0EsY0FBSUQsSUFBSW5ELE1BQUosR0FBYSxDQUFiLElBQW1CLEtBQUtxRCxLQUFMLENBQVdDLEtBQVgsSUFBb0IsS0FBS3hELEtBQUwsS0FBZSxFQUExRCxFQUErRDtBQUM3RCxpQkFBS21ELGtCQUFMLEdBQTBCLEVBQTFCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUtBLGtCQUFMLEdBQTBCLEtBQUtULGlCQUEvQjtBQUNEO0FBQ0Y7QUFDRCxhQUFLZSxXQUFMO0FBQ0EsWUFBSSxLQUFLOUQsVUFBTCxJQUFtQixDQUFDLEtBQUtKLFFBQTdCLEVBQXVDO0FBQ3JDLGVBQUtpRCxXQUFMLEdBQW1CLEVBQW5CO0FBQ0Q7QUFDRCxhQUFLa0IsS0FBTCxDQUFXLFFBQVgsRUFBcUJMLEdBQXJCO0FBQ0EsYUFBS00sUUFBTCxDQUFjLFVBQWQsRUFBMEIsYUFBMUIsRUFBeUNOLEdBQXpDO0FBQ0QsT0FyQkk7QUEwQkxyRCxXQTFCSyxpQkEwQkNxRCxHQTFCRCxFQTBCTTtBQUFBOztBQUNULGFBQUtPLFNBQUwsQ0FBZSxZQUFNO0FBQ25CLGNBQUksT0FBS2YsT0FBVCxFQUFrQixPQUFLZ0IsU0FBTCxDQUFlLGdCQUFmLEVBQWlDLGNBQWpDO0FBQ25CLFNBRkQ7QUFHQSxhQUFLZCxVQUFMLEdBQWtCLENBQUMsQ0FBbkI7QUFDQSxZQUFJLEtBQUt4RCxRQUFMLElBQWlCLEtBQUtJLFVBQTFCLEVBQXNDO0FBQ3BDLGVBQUs2QyxXQUFMLEdBQW1CLEtBQUtlLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQmhFLEtBQWpCLENBQXVCVSxNQUF2QixHQUFnQyxFQUFoQyxHQUFxQyxFQUF4RDtBQUNBLGVBQUs0RCxpQkFBTDtBQUNBLGVBQUtSLGdCQUFMO0FBQ0Q7QUFDRCxZQUFJLEtBQUs1RCxNQUFMLElBQWUsT0FBTyxLQUFLNEIsWUFBWixLQUE2QixVQUFoRCxFQUE0RDtBQUMxRCxlQUFLeUIsVUFBTCxHQUFrQixDQUFDLENBQW5CO0FBQ0EsZUFBS3pCLFlBQUwsQ0FBa0IrQixHQUFsQjtBQUNBLGVBQUtRLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLFlBQXpCO0FBQ0QsU0FKRCxNQUlPLElBQUksT0FBTyxLQUFLckMsWUFBWixLQUE2QixVQUFqQyxFQUE2QztBQUNsRCxlQUFLQSxZQUFMLENBQWtCNkIsR0FBbEI7QUFDQSxlQUFLUSxTQUFMLENBQWUsYUFBZixFQUE4QixhQUE5QjtBQUNELFNBSE0sTUFHQTtBQUNMLGVBQUsxRCxvQkFBTCxHQUE0QixLQUFLd0MsWUFBakM7QUFDQSxlQUFLa0IsU0FBTCxDQUFlLFFBQWYsRUFBeUIsYUFBekIsRUFBd0NSLEdBQXhDO0FBQ0EsZUFBS1EsU0FBTCxDQUFlLGFBQWYsRUFBOEIsYUFBOUI7QUFDRDtBQUNELFlBQUksS0FBSy9CLGtCQUFMLEtBQTRCLEtBQUtuQyxVQUFMLElBQW1CLEtBQUtELE1BQXBELEtBQStELEtBQUtTLG9CQUF4RSxFQUE4RjtBQUM1RixlQUFLNEQsdUJBQUw7QUFDRDtBQUNGLE9BbkRJO0FBc0RMbEIsYUF0REssbUJBc0RHUSxHQXRESCxFQXNEUTtBQUFBOztBQUNYO0FBQ0EsWUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDUjtBQUNBLGVBQUtFLEtBQUwsQ0FBV1MsU0FBWCxDQUFxQkMsR0FBckIsQ0FBeUJDLGFBQXpCLENBQXVDLE9BQXZDLEVBQWdEQyxJQUFoRDtBQUNBOztBQUVBO0FBQ0EsZUFBS0MsY0FBTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsY0FBSSxLQUFLYixLQUFMLENBQVdDLEtBQWYsRUFBc0I7QUFDcEIsaUJBQUtELEtBQUwsQ0FBV0MsS0FBWCxDQUFpQlcsSUFBakI7QUFDRDs7QUFFRDtBQUNBLGVBQUtuRSxLQUFMLEdBQWEsRUFBYjtBQUNBLGVBQUs4QyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsZUFBS04sV0FBTCxHQUFtQixFQUFuQjtBQUNBLGVBQUs2QixlQUFMO0FBQ0EsZUFBS1QsU0FBTCxDQUFlLFlBQU07QUFDbkIsZ0JBQUksT0FBS0wsS0FBTCxDQUFXQyxLQUFYLElBQ0YsT0FBS0QsS0FBTCxDQUFXQyxLQUFYLENBQWlCaEUsS0FBakIsS0FBMkIsRUFEekIsSUFFRixPQUFLOEMsUUFBTCxDQUFjcEMsTUFBZCxLQUF5QixDQUYzQixFQUU4QjtBQUM1QixxQkFBS2lELGtCQUFMLEdBQTBCLE9BQUtULGlCQUEvQjtBQUNEO0FBQ0YsV0FORDtBQU9BLGNBQUksQ0FBQyxLQUFLbkQsUUFBVixFQUFvQjtBQUNsQixpQkFBSytFLFlBQUw7QUFDQSxnQkFBSSxLQUFLaEMsUUFBVCxFQUFtQjtBQUNqQixrQkFBSSxLQUFLM0MsVUFBTCxJQUFtQixLQUFLa0IsV0FBeEIsSUFDRixLQUFLd0IsZUFESCxJQUNzQixLQUFLa0MsYUFEL0IsRUFDOEM7QUFDNUMscUJBQUt6QixhQUFMLEdBQXFCLEtBQUtWLFlBQTFCO0FBQ0QsZUFIRCxNQUdPO0FBQ0wscUJBQUtVLGFBQUwsR0FBcUIsS0FBS1IsUUFBTCxDQUFjMUIsWUFBbkM7QUFDRDtBQUNELGtCQUFJLEtBQUtqQixVQUFULEVBQXFCLEtBQUtLLEtBQUwsR0FBYSxLQUFLOEMsYUFBbEI7QUFDdEI7QUFDRjtBQUNGO0FBQ0Q7QUF6Q0EsYUEwQ0s7QUFDSDtBQUNBLGlCQUFLMEIsY0FBTDs7QUFFQTtBQUNBLGlCQUFLWCxTQUFMLENBQWUsZ0JBQWYsRUFBaUMsY0FBakM7O0FBRUE7QUFDQSxnQkFBSSxLQUFLbEUsVUFBVCxFQUFxQjtBQUNuQixtQkFBS0ssS0FBTCxHQUFhLEtBQUs4QyxhQUFsQjtBQUNBLGtCQUFJLEtBQUt2RCxRQUFULEVBQW1CO0FBQ2pCLHFCQUFLZ0UsS0FBTCxDQUFXQyxLQUFYLENBQWlCaUIsS0FBakI7QUFDRCxlQUZELE1BRU87QUFDTCxvQkFBSSxDQUFDLEtBQUsvRSxNQUFWLEVBQWtCO0FBQ2hCLHVCQUFLbUUsU0FBTCxDQUFlLFFBQWYsRUFBeUIsYUFBekIsRUFBd0MsRUFBeEM7QUFDQSx1QkFBS0EsU0FBTCxDQUFlLGFBQWYsRUFBOEIsYUFBOUI7QUFDRDtBQUNELHFCQUFLQSxTQUFMLENBQWUsT0FBZixFQUF3QixhQUF4QjtBQUNEO0FBQ0Y7QUFDRjtBQUNELGFBQUtILEtBQUwsQ0FBVyxnQkFBWCxFQUE2QkwsR0FBN0I7QUFDRCxPQXhISTtBQTJITHBELGFBM0hLLG1CQTJIR29ELEdBM0hILEVBMkhRO0FBQ1gsWUFBSSxLQUFLcUIsU0FBVCxFQUFvQjtBQUNwQixhQUFLeEIsa0JBQUwsR0FBMEJHLElBQUluRCxNQUFKLEtBQWVtRCxJQUFJN0MsTUFBSixDQUFXO0FBQUEsaUJBQVFtRSxLQUFLdEYsUUFBTCxLQUFrQixJQUExQjtBQUFBLFNBQVgsRUFBMkNhLE1BQXBGO0FBQ0EsWUFBSSxLQUFLWCxRQUFULEVBQW1CO0FBQ2pCLGVBQUsrRCxnQkFBTDtBQUNEO0FBQ0QsWUFBSXNCLFNBQVMsS0FBS1gsR0FBTCxDQUFTWSxnQkFBVCxDQUEwQixPQUExQixDQUFiO0FBQ0EsWUFBSSxHQUFHQyxPQUFILENBQVdDLElBQVgsQ0FBZ0JILE1BQWhCLEVBQXdCSSxTQUFTQyxhQUFqQyxNQUFvRCxDQUFDLENBQXpELEVBQTREO0FBQzFELGVBQUt4QixXQUFMO0FBQ0Q7QUFDRCxZQUFJLEtBQUszQixrQkFBTCxLQUE0QixLQUFLbkMsVUFBTCxJQUFtQixLQUFLRCxNQUFwRCxLQUErRCxLQUFLUyxvQkFBeEUsRUFBOEY7QUFDNUYsZUFBSzRELHVCQUFMO0FBQ0Q7QUFDRjtBQXhJSSxLQWpJTTs7QUE0UWJtQixhQUFTO0FBRVBkLG9CQUZPLDRCQUVVO0FBQ2YsWUFBSWUsT0FBTyxLQUFLbEIsR0FBTCxDQUFTQyxhQUFULENBQXVCLGNBQXZCLENBQVg7QUFDQSxZQUFJaUIsSUFBSixFQUFVO0FBQ1IsZ0NBQVlBLElBQVosRUFBa0IsWUFBbEI7QUFDRDtBQUNGLE9BUE07QUFVUFgsb0JBVk8sNEJBVVU7QUFDZixZQUFJVyxPQUFPLEtBQUtsQixHQUFMLENBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBWDtBQUNBLFlBQUlpQixRQUFRLENBQUMsbUJBQVNBLElBQVQsRUFBZSxtQkFBZixDQUFiLEVBQWtEO0FBQ2hELDZCQUFTQSxJQUFULEVBQWUsWUFBZjtBQUNEO0FBQ0YsT0FmTTtBQWtCUEMscUJBbEJPLDZCQWtCVztBQUNoQixZQUFJLENBQUMsS0FBS3hDLFVBQVYsRUFBc0I7QUFDcEIsZUFBS0EsVUFBTCxHQUFrQixLQUFLVyxLQUFMLENBQVc4QixNQUFYLENBQWtCcEIsR0FBbEIsQ0FBc0JDLGFBQXRCLENBQW9DLGtCQUFwQyxDQUFsQjtBQUNBLGVBQUtJLFlBQUw7QUFDRDtBQUNELFlBQUksQ0FBQyxLQUFLL0UsUUFBTixJQUFrQixLQUFLcUQsVUFBM0IsRUFBdUM7QUFDckMsZUFBSzBDLGVBQUw7QUFDRDtBQUNGLE9BMUJNO0FBZ0NQaEIsa0JBaENPLDBCQWdDUTtBQUNiLFlBQUksS0FBSzFCLFVBQUwsSUFBbUIsS0FBS04sUUFBeEIsSUFBb0MsS0FBS0EsUUFBTCxDQUFjMkIsR0FBdEQsRUFBMkQ7QUFDekQsY0FBSXNCLGVBQWUsS0FBS2pELFFBQUwsQ0FBYzJCLEdBQWQsQ0FBa0J1QixxQkFBbEIsRUFBbkI7QUFDQSxjQUFJQyxhQUFhLEtBQUtsQyxLQUFMLENBQVc4QixNQUFYLENBQWtCcEIsR0FBbEIsQ0FBc0J1QixxQkFBdEIsRUFBakI7QUFDQSxlQUFLeEMsY0FBTCxHQUFzQnVDLGFBQWFHLE1BQWIsR0FBc0JELFdBQVdDLE1BQXZEO0FBQ0EsZUFBS3pDLFdBQUwsR0FBbUJzQyxhQUFhSSxHQUFiLEdBQW1CRixXQUFXRSxHQUFqRDtBQUNEO0FBQ0YsT0F2Q007QUEyQ1BMLHFCQTNDTyw2QkEyQ1c7QUFDaEIsWUFBSSxLQUFLdEMsY0FBTCxHQUFzQixDQUExQixFQUE2QjtBQUMzQixlQUFLSixVQUFMLENBQWdCZ0QsU0FBaEIsSUFBNkIsS0FBSzVDLGNBQWxDO0FBQ0QsU0FGRCxNQUVPLElBQUksS0FBS0MsV0FBTCxHQUFtQixDQUF2QixFQUEwQjtBQUMvQixlQUFLTCxVQUFMLENBQWdCZ0QsU0FBaEIsSUFBNkIsS0FBSzNDLFdBQWxDO0FBQ0Q7QUFDRixPQWpETTtBQW1EUDRDLGVBbkRPLHFCQW1ER3JHLEtBbkRILEVBbURVO0FBQ2YsWUFBSWlCLGVBQUo7QUFDQSxhQUFLLElBQUlxRixJQUFJLEtBQUszRCxhQUFMLENBQW1CakMsTUFBbkIsR0FBNEIsQ0FBekMsRUFBNEM0RixLQUFLLENBQWpELEVBQW9EQSxHQUFwRCxFQUF5RDtBQUN2RCxjQUFNQyxlQUFlLEtBQUs1RCxhQUFMLENBQW1CMkQsQ0FBbkIsQ0FBckI7QUFDQSxjQUFJQyxhQUFhdkcsS0FBYixLQUF1QkEsS0FBM0IsRUFBa0M7QUFDaENpQixxQkFBU3NGLFlBQVQ7QUFDQTtBQUNEO0FBQ0Y7QUFDRCxZQUFJdEYsTUFBSixFQUFZLE9BQU9BLE1BQVA7QUFDWixZQUFNdUYsUUFBUSxPQUFPeEcsS0FBUCxLQUFpQixRQUFqQixJQUE2QixPQUFPQSxLQUFQLEtBQWlCLFFBQTlDLEdBQ1ZBLEtBRFUsR0FDRixFQURaO0FBRUEsWUFBSXlHLFlBQVk7QUFDZHpHLGlCQUFPQSxLQURPO0FBRWRvQix3QkFBY29GO0FBRkEsU0FBaEI7QUFJQSxZQUFJLEtBQUt6RyxRQUFULEVBQW1CO0FBQ2pCMEcsb0JBQVVDLFFBQVYsR0FBcUIsS0FBckI7QUFDRDtBQUNELGVBQU9ELFNBQVA7QUFDRCxPQXZFTTtBQTJFUHhDLGlCQTNFTyx5QkEyRU87QUFBQTs7QUFDWixZQUFJLENBQUMsS0FBS2xFLFFBQVYsRUFBb0I7QUFDbEIsY0FBSWtCLFNBQVMsS0FBS29GLFNBQUwsQ0FBZSxLQUFLckcsS0FBcEIsQ0FBYjtBQUNBLGNBQUlpQixPQUFPQyxPQUFYLEVBQW9CO0FBQ2xCLGlCQUFLMEIsWUFBTCxHQUFvQjNCLE9BQU9HLFlBQTNCO0FBQ0EsaUJBQUt5QixlQUFMLEdBQXVCLElBQXZCO0FBQ0QsV0FIRCxNQUdPO0FBQ0wsaUJBQUtBLGVBQUwsR0FBdUIsS0FBdkI7QUFDRDtBQUNELGVBQUtTLGFBQUwsR0FBcUJyQyxPQUFPRyxZQUE1QjtBQUNBLGVBQUswQixRQUFMLEdBQWdCN0IsTUFBaEI7QUFDQSxjQUFJLEtBQUtkLFVBQVQsRUFBcUIsS0FBS0ssS0FBTCxHQUFhLEtBQUs4QyxhQUFsQjtBQUNyQjtBQUNEO0FBQ0QsWUFBSXFELFNBQVMsRUFBYjtBQUNBLFlBQUluRSxNQUFNb0UsT0FBTixDQUFjLEtBQUs1RyxLQUFuQixDQUFKLEVBQStCO0FBQzdCLGVBQUtBLEtBQUwsQ0FBVzZHLE9BQVgsQ0FBbUIsaUJBQVM7QUFDMUJGLG1CQUFPRyxJQUFQLENBQVksT0FBS1QsU0FBTCxDQUFlckcsS0FBZixDQUFaO0FBQ0QsV0FGRDtBQUdEO0FBQ0QsYUFBSzhDLFFBQUwsR0FBZ0I2RCxNQUFoQjtBQUNBLGFBQUt2QyxTQUFMLENBQWUsWUFBTTtBQUNuQixpQkFBS04sZ0JBQUw7QUFDRCxTQUZEO0FBR0QsT0FuR007QUFxR1BpRCxpQkFyR08seUJBcUdPO0FBQ1osYUFBSzFELE9BQUwsR0FBZSxJQUFmO0FBQ0QsT0F2R007QUF5R1AyRCxxQkF6R08sMkJBeUdTQyxLQXpHVCxFQXlHZ0I7QUFDckIsWUFBSSxLQUFLdkgsU0FBTCxDQUFlNEYsT0FBZixDQUF1QixjQUF2QixJQUF5QyxDQUFDLENBQTlDLEVBQWlEO0FBQy9DLGVBQUs0QixjQUFMLENBQW9CRCxLQUFwQjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtFLFVBQUw7QUFDRDtBQUNGLE9BL0dNO0FBaUhQQyxxQkFqSE8sMkJBaUhTSCxLQWpIVCxFQWlIZ0I7QUFDckIsWUFBSUEsTUFBTUksTUFBTixDQUFhQyxPQUFiLEtBQXlCLE9BQTdCLEVBQXNDO0FBQ3RDLFlBQUksS0FBS2pFLE9BQVQsRUFBa0I7QUFDaEIsZUFBS2tFLFdBQUw7QUFDQU4sZ0JBQU1PLGNBQU47QUFDRDtBQUNGLE9BdkhNO0FBeUhQQyxlQXpITyx1QkF5SEs7QUFDVixhQUFLMUQsS0FBTCxDQUFXOEIsTUFBWCxJQUFxQixLQUFLOUIsS0FBTCxDQUFXOEIsTUFBWCxDQUFrQjRCLFNBQWxCLEVBQXJCO0FBQ0QsT0EzSE07QUE2SFBGLGlCQTdITyx5QkE2SE87QUFDWixhQUFLbEUsT0FBTCxHQUFlLEtBQWY7QUFDRCxPQS9ITTtBQWlJUHFFLDhCQWpJTyxvQ0FpSWtCQyxHQWpJbEIsRUFpSXVCO0FBQzVCLFlBQUksQ0FBQ25GLE1BQU1vRSxPQUFOLENBQWMsS0FBSzlELFFBQW5CLENBQUwsRUFBbUM7QUFDbkMsWUFBTTdCLFNBQVMsS0FBSzZCLFFBQUwsQ0FBYyxLQUFLQSxRQUFMLENBQWNwQyxNQUFkLEdBQXVCLENBQXJDLENBQWY7QUFDQSxZQUFJLENBQUNPLE1BQUwsRUFBYTs7QUFFYixZQUFJMEcsUUFBUSxJQUFSLElBQWdCQSxRQUFRLEtBQTVCLEVBQW1DO0FBQ2pDMUcsaUJBQU95RixRQUFQLEdBQWtCaUIsR0FBbEI7QUFDQSxpQkFBT0EsR0FBUDtBQUNEOztBQUVEMUcsZUFBT3lGLFFBQVAsR0FBa0IsQ0FBQ3pGLE9BQU95RixRQUExQjtBQUNBLGVBQU96RixPQUFPeUYsUUFBZDtBQUNELE9BN0lNO0FBK0lQa0IsbUJBL0lPLHlCQStJT0MsQ0EvSVAsRUErSVU7QUFDZixZQUFJQSxFQUFFUixNQUFGLENBQVNySCxLQUFULENBQWVVLE1BQWYsSUFBeUIsQ0FBekIsSUFBOEIsQ0FBQyxLQUFLZ0gsd0JBQUwsRUFBbkMsRUFBb0U7QUFDbEUsY0FBTTFILFFBQVEsS0FBS0EsS0FBTCxDQUFXOEgsS0FBWCxFQUFkO0FBQ0E5SCxnQkFBTStILEdBQU47QUFDQSxlQUFLN0QsS0FBTCxDQUFXLE9BQVgsRUFBb0JsRSxLQUFwQjtBQUNEO0FBQ0YsT0FySk07QUF1SlBzRSx1QkF2Sk8sK0JBdUphO0FBQ2xCLFlBQUksS0FBS1gsa0JBQUwsS0FBNEIsRUFBaEMsRUFBb0M7QUFDbEMsZUFBS0Esa0JBQUwsR0FBMEIsS0FBS0ksS0FBTCxDQUFXQyxLQUFYLENBQWlCaEUsS0FBakIsR0FBeUIsRUFBekIsR0FBOEIsS0FBS2tELGlCQUE3RDtBQUNEO0FBQ0YsT0EzSk07QUE2SlA4RSxxQkE3Sk8sMkJBNkpTSCxDQTdKVCxFQTZKWTtBQUNqQixZQUFJQSxFQUFFSSxPQUFGLEtBQWMsQ0FBbEIsRUFBcUIsS0FBS1Asd0JBQUwsQ0FBOEIsS0FBOUI7QUFDckIsYUFBSzFFLFdBQUwsR0FBbUIsS0FBS2UsS0FBTCxDQUFXQyxLQUFYLENBQWlCaEUsS0FBakIsQ0FBdUJVLE1BQXZCLEdBQWdDLEVBQWhDLEdBQXFDLEVBQXhEO0FBQ0EsYUFBS29ELGdCQUFMO0FBQ0QsT0FqS007QUFtS1BBLHNCQW5LTyw4QkFtS1k7QUFBQTs7QUFDakIsYUFBS00sU0FBTCxDQUFlLFlBQU07QUFDbkIsY0FBSSxDQUFDLE9BQUtMLEtBQUwsQ0FBV1MsU0FBaEIsRUFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsY0FBSVIsUUFBUSxPQUFLRCxLQUFMLENBQVdTLFNBQVgsQ0FBcUJDLEdBQXJCLENBQXlCQyxhQUF6QixDQUF1QyxPQUF2QyxDQUFaO0FBQ0E7QUFDQSxjQUFJd0QsaUJBQWlCLE9BQUtuRSxLQUFMLENBQVdTLFNBQVgsQ0FBcUJDLEdBQXJCLENBQXlCQyxhQUF6QixDQUF1QyxRQUF2QyxDQUFyQjtBQUNBO0FBQ0E7QUFDQSxjQUFJeUQsWUFBWUMsS0FBS0MsR0FBTCxDQUFTLE9BQUt0RSxLQUFMLENBQVd1RSxJQUFYLENBQWdCQyxZQUFoQixHQUErQixDQUF4QyxFQUEyQyxFQUEzQyxJQUFpRCxJQUFqRTtBQUNBdkUsZ0JBQU13RSxLQUFOLENBQVlDLE1BQVosR0FBcUJOLFNBQXJCO0FBQ0FELHlCQUFlTSxLQUFmLENBQXFCQyxNQUFyQixHQUE4Qk4sU0FBOUI7O0FBRUEsY0FBSSxPQUFLOUUsT0FBTCxJQUFnQixPQUFLaEQsU0FBTCxLQUFtQixLQUF2QyxFQUE4QztBQUM1QyxtQkFBS2dFLFNBQUwsQ0FBZSxnQkFBZixFQUFpQyxjQUFqQztBQUNEO0FBQ0YsU0FqQkQ7QUFrQkQsT0F0TE07QUF3TFBRLHFCQXhMTyw2QkF3TFc7QUFBQTs7QUFDaEI2RCxtQkFBVyxZQUFNO0FBQ2YsY0FBSSxDQUFDLE9BQUszSSxRQUFWLEVBQW9CO0FBQ2xCLG1CQUFLd0QsVUFBTCxHQUFrQixPQUFLOUMsT0FBTCxDQUFhNkUsT0FBYixDQUFxQixPQUFLeEMsUUFBMUIsQ0FBbEI7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSSxPQUFLQSxRQUFMLENBQWNwQyxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCLHFCQUFLNkMsVUFBTCxHQUFrQjZFLEtBQUtPLEdBQUwsQ0FBU0MsS0FBVCxDQUFlLElBQWYsRUFBcUIsT0FBSzlGLFFBQUwsQ0FBYytGLEdBQWQsQ0FBa0I7QUFBQSx1QkFBUSxPQUFLcEksT0FBTCxDQUFhNkUsT0FBYixDQUFxQkgsSUFBckIsQ0FBUjtBQUFBLGVBQWxCLENBQXJCLENBQWxCO0FBQ0QsYUFGRCxNQUVPO0FBQ0wscUJBQUs1QixVQUFMLEdBQWtCLENBQUMsQ0FBbkI7QUFDRDtBQUNGO0FBQ0YsU0FWRCxFQVVHLEdBVkg7QUFXRCxPQXBNTTtBQXNNUHVGLHdCQXRNTyw4QkFzTVk3SCxNQXRNWixFQXNNb0I7QUFDekIsWUFBSSxLQUFLbEIsUUFBVCxFQUFtQjtBQUNqQixjQUFNQyxRQUFRLEtBQUtBLEtBQUwsQ0FBVzhILEtBQVgsRUFBZDtBQUNBLGNBQU1pQixjQUFjL0ksTUFBTXNGLE9BQU4sQ0FBY3JFLE9BQU9qQixLQUFyQixDQUFwQjtBQUNBLGNBQUkrSSxjQUFjLENBQUMsQ0FBbkIsRUFBc0I7QUFDcEIvSSxrQkFBTWdKLE1BQU4sQ0FBYUQsV0FBYixFQUEwQixDQUExQjtBQUNELFdBRkQsTUFFTyxJQUFJLEtBQUs5RyxhQUFMLElBQXNCLENBQXRCLElBQTJCakMsTUFBTVUsTUFBTixHQUFlLEtBQUt1QixhQUFuRCxFQUFrRTtBQUN2RWpDLGtCQUFNOEcsSUFBTixDQUFXN0YsT0FBT2pCLEtBQWxCO0FBQ0Q7QUFDRCxlQUFLa0UsS0FBTCxDQUFXLE9BQVgsRUFBb0JsRSxLQUFwQjtBQUNBLGNBQUlpQixPQUFPQyxPQUFYLEVBQW9CO0FBQ2xCLGlCQUFLVixLQUFMLEdBQWEsRUFBYjtBQUNBLGlCQUFLd0MsV0FBTCxHQUFtQixFQUFuQjtBQUNEO0FBQ0QsY0FBSSxLQUFLN0MsVUFBVCxFQUFxQixLQUFLNEQsS0FBTCxDQUFXQyxLQUFYLENBQWlCaUIsS0FBakI7QUFDdEIsU0FkRCxNQWNPO0FBQ0wsZUFBS2YsS0FBTCxDQUFXLE9BQVgsRUFBb0JqRCxPQUFPakIsS0FBM0I7QUFDQSxlQUFLcUQsT0FBTCxHQUFlLEtBQWY7QUFDRDtBQUNGLE9Bek5NO0FBMk5QOEQsZ0JBM05PLHdCQTJOTTtBQUNYLFlBQUksS0FBS2hILFVBQUwsSUFBbUIsS0FBS0ssS0FBTCxLQUFlLEVBQWxDLElBQXdDLEtBQUs2QyxPQUFqRCxFQUEwRDtBQUN4RDtBQUNEO0FBQ0QsWUFBSSxDQUFDLEtBQUt4RCxRQUFWLEVBQW9CO0FBQ2xCLGVBQUt3RCxPQUFMLEdBQWUsQ0FBQyxLQUFLQSxPQUFyQjtBQUNEO0FBQ0YsT0FsT007QUFvT1A0RixxQkFwT08sMkJBb09TQyxTQXBPVCxFQW9Pb0I7QUFDekIsWUFBSSxDQUFDLEtBQUs3RixPQUFWLEVBQW1CO0FBQ2pCLGVBQUtBLE9BQUwsR0FBZSxJQUFmO0FBQ0E7QUFDRDtBQUNELFlBQUksS0FBSzVDLE9BQUwsQ0FBYUMsTUFBYixLQUF3QixDQUF4QixJQUE2QixLQUFLQyxvQkFBTCxLQUE4QixDQUEvRCxFQUFrRTtBQUNsRSxhQUFLK0Msa0JBQUwsR0FBMEIsS0FBS2pELE9BQUwsQ0FBYUMsTUFBYixLQUF3QixLQUFLRCxPQUFMLENBQWFPLE1BQWIsQ0FBb0I7QUFBQSxpQkFBUW1FLEtBQUt0RixRQUFMLEtBQWtCLElBQTFCO0FBQUEsU0FBcEIsRUFBb0RhLE1BQXRHO0FBQ0EsWUFBSSxDQUFDLEtBQUtnRCxrQkFBVixFQUE4QjtBQUM1QixjQUFJd0YsY0FBYyxNQUFsQixFQUEwQjtBQUN4QixpQkFBSzNGLFVBQUw7QUFDQSxnQkFBSSxLQUFLQSxVQUFMLEtBQW9CLEtBQUs5QyxPQUFMLENBQWFDLE1BQXJDLEVBQTZDO0FBQzNDLG1CQUFLNkMsVUFBTCxHQUFrQixDQUFsQjtBQUNEO0FBQ0QsaUJBQUs0RixjQUFMO0FBQ0EsZ0JBQUksS0FBSzFJLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEIxRCxRQUE5QixLQUEyQyxJQUEzQyxJQUNGLEtBQUtZLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEI2RixhQUE5QixLQUFnRCxJQUQ5QyxJQUVGLENBQUMsS0FBSzNJLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEJGLE9BRmpDLEVBRTBDO0FBQ3hDLG1CQUFLNEYsZUFBTCxDQUFxQixNQUFyQjtBQUNEO0FBQ0Y7QUFDRCxjQUFJQyxjQUFjLE1BQWxCLEVBQTBCO0FBQ3hCLGlCQUFLM0YsVUFBTDtBQUNBLGdCQUFJLEtBQUtBLFVBQUwsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsbUJBQUtBLFVBQUwsR0FBa0IsS0FBSzlDLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixDQUF4QztBQUNEO0FBQ0QsaUJBQUt5SSxjQUFMO0FBQ0EsZ0JBQUksS0FBSzFJLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEIxRCxRQUE5QixLQUEyQyxJQUEzQyxJQUNGLEtBQUtZLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEI2RixhQUE5QixLQUFnRCxJQUQ5QyxJQUVGLENBQUMsS0FBSzNJLE9BQUwsQ0FBYSxLQUFLOEMsVUFBbEIsRUFBOEJGLE9BRmpDLEVBRTBDO0FBQ3hDLG1CQUFLNEYsZUFBTCxDQUFxQixNQUFyQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLE9BclFNO0FBdVFQRSxvQkF2UU8sNEJBdVFVO0FBQ2YsWUFBSUUseUJBQXlCLEtBQUs1SSxPQUFMLENBQWEsS0FBSzhDLFVBQWxCLEVBQThCa0IsR0FBOUIsQ0FBa0N1QixxQkFBbEMsR0FBMERFLE1BQTFELEdBQzNCLEtBQUtuQyxLQUFMLENBQVc4QixNQUFYLENBQWtCcEIsR0FBbEIsQ0FBc0J1QixxQkFBdEIsR0FBOENFLE1BRGhEO0FBRUEsWUFBSW9ELHNCQUFzQixLQUFLN0ksT0FBTCxDQUFhLEtBQUs4QyxVQUFsQixFQUE4QmtCLEdBQTlCLENBQWtDdUIscUJBQWxDLEdBQTBERyxHQUExRCxHQUN4QixLQUFLcEMsS0FBTCxDQUFXOEIsTUFBWCxDQUFrQnBCLEdBQWxCLENBQXNCdUIscUJBQXRCLEdBQThDRyxHQURoRDtBQUVBLFlBQUlrRCx5QkFBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsZUFBS2pHLFVBQUwsQ0FBZ0JnRCxTQUFoQixJQUE2QmlELHNCQUE3QjtBQUNEO0FBQ0QsWUFBSUMsc0JBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGVBQUtsRyxVQUFMLENBQWdCZ0QsU0FBaEIsSUFBNkJrRCxtQkFBN0I7QUFDRDtBQUNGLE9BbFJNO0FBb1JQQyxrQkFwUk8sMEJBb1JRO0FBQ2IsWUFBSSxLQUFLOUksT0FBTCxDQUFhLEtBQUs4QyxVQUFsQixDQUFKLEVBQW1DO0FBQ2pDLGVBQUt1RixrQkFBTCxDQUF3QixLQUFLckksT0FBTCxDQUFhLEtBQUs4QyxVQUFsQixDQUF4QjtBQUNEO0FBQ0YsT0F4Uk07QUEwUlAyRCxvQkExUk8sMEJBMFJRRCxLQTFSUixFQTBSZTtBQUNwQkEsY0FBTXVDLGVBQU47QUFDQSxhQUFLdEYsS0FBTCxDQUFXLE9BQVgsRUFBb0IsRUFBcEI7QUFDQSxhQUFLYixPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUthLEtBQUwsQ0FBVyxPQUFYO0FBQ0QsT0EvUk07QUFpU1B1RixlQWpTTyxxQkFpU0d4QyxLQWpTSCxFQWlTVXlDLEdBalNWLEVBaVNlO0FBQ3BCLFlBQUlDLFFBQVEsS0FBSzdHLFFBQUwsQ0FBY3dDLE9BQWQsQ0FBc0JvRSxHQUF0QixDQUFaO0FBQ0EsWUFBSUMsUUFBUSxDQUFDLENBQVQsSUFBYyxDQUFDLEtBQUs5SixRQUF4QixFQUFrQztBQUNoQyxjQUFNRyxRQUFRLEtBQUtBLEtBQUwsQ0FBVzhILEtBQVgsRUFBZDtBQUNBOUgsZ0JBQU1nSixNQUFOLENBQWFXLEtBQWIsRUFBb0IsQ0FBcEI7QUFDQSxlQUFLekYsS0FBTCxDQUFXLE9BQVgsRUFBb0JsRSxLQUFwQjtBQUNBLGVBQUtrRSxLQUFMLENBQVcsWUFBWCxFQUF5QndGLEdBQXpCO0FBQ0Q7QUFDRHpDLGNBQU11QyxlQUFOO0FBQ0QsT0ExU007QUE0U1BJLG1CQTVTTywyQkE0U1M7QUFDZCxZQUFJLEtBQUt6SixVQUFULEVBQXFCO0FBQ25CLGVBQUtLLEtBQUwsR0FBYSxLQUFLOEMsYUFBbEI7QUFDRDtBQUNGLE9BaFRNO0FBa1RQdUcscUJBbFRPLDJCQWtUUzVJLE1BbFRULEVBa1RpQjtBQUN0QixhQUFLa0MsWUFBTDtBQUNBLGFBQUt4QyxvQkFBTDtBQUNBLFlBQUlnSixRQUFRLEtBQUtsSixPQUFMLENBQWE2RSxPQUFiLENBQXFCckUsTUFBckIsQ0FBWjtBQUNBLFlBQUkwSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNkLGVBQUtsSixPQUFMLENBQWF1SSxNQUFiLENBQW9CVyxLQUFwQixFQUEyQixDQUEzQjtBQUNEO0FBQ0QsYUFBS3RGLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLFlBQXpCO0FBQ0QsT0ExVE07QUE0VFB5RixxQkE1VE8sNkJBNFRXO0FBQ2hCLGFBQUs3RyxVQUFMLEdBQWtCLEtBQUtjLEtBQUwsQ0FBV1MsU0FBWCxDQUFxQkMsR0FBckIsQ0FBeUJ1QixxQkFBekIsR0FBaUQrRCxLQUFuRTtBQUNELE9BOVRNO0FBZ1VQQyxrQkFoVU8sMEJBZ1VRO0FBQ2IsYUFBS0YsZUFBTDtBQUNBLFlBQUksS0FBSy9KLFFBQVQsRUFBbUIsS0FBSytELGdCQUFMO0FBQ3BCLE9BblVNO0FBc1VQUyw2QkF0VU8scUNBc1VtQjtBQUN4QixhQUFLaEIsVUFBTCxHQUFrQixDQUFDLENBQW5CO0FBQ0EsYUFBSyxJQUFJK0MsSUFBSSxDQUFiLEVBQWdCQSxNQUFNLEtBQUs3RixPQUFMLENBQWFDLE1BQW5DLEVBQTJDLEVBQUU0RixDQUE3QyxFQUFnRDtBQUM5QyxjQUFNckYsU0FBUyxLQUFLUixPQUFMLENBQWE2RixDQUFiLENBQWY7QUFDQSxjQUFJLEtBQUs5RixLQUFULEVBQWdCO0FBQ2Q7QUFDQSxnQkFBSSxDQUFDUyxPQUFPcEIsUUFBUixJQUFvQixDQUFDb0IsT0FBT21JLGFBQTVCLElBQTZDbkksT0FBT29DLE9BQXhELEVBQWlFO0FBQy9ELG1CQUFLRSxVQUFMLEdBQWtCK0MsQ0FBbEI7QUFDQTtBQUNEO0FBQ0YsV0FORCxNQU1PO0FBQ0w7QUFDQSxnQkFBSXJGLE9BQU9nSixZQUFYLEVBQXlCO0FBQ3ZCLG1CQUFLMUcsVUFBTCxHQUFrQitDLENBQWxCO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQXhWTSxLQTVRSTs7QUF3bUJicEYsV0F4bUJhLHFCQXdtQkg7QUFBQTs7QUFDUjtBQUNBLFdBQUtnQyxpQkFBTCxHQUF5QixLQUFLUyxrQkFBTCxHQUEwQixLQUFLdEIsV0FBeEQ7O0FBRUE7QUFDQSxVQUFJLEtBQUt0QyxRQUFMLElBQWlCLENBQUN5QyxNQUFNb0UsT0FBTixDQUFjLEtBQUs1RyxLQUFuQixDQUF0QixFQUFpRDtBQUMvQyxhQUFLa0UsS0FBTCxDQUFXLE9BQVgsRUFBb0IsRUFBcEI7QUFDRDs7QUFFRDtBQUNBLFVBQUksQ0FBQyxLQUFLbkUsUUFBTixJQUFrQnlDLE1BQU1vRSxPQUFOLENBQWMsS0FBSzVHLEtBQW5CLENBQXRCLEVBQWlEO0FBQy9DLGFBQUtrRSxLQUFMLENBQVcsT0FBWCxFQUFvQixFQUFwQjtBQUNEOztBQUVEO0FBQ0EsV0FBS0QsV0FBTDs7QUFFQSxXQUFLaUcsc0JBQUwsR0FBOEIsd0JBQVMsS0FBSzlKLFFBQWQsRUFBd0IsWUFBTTtBQUMxRCxlQUFLd0osYUFBTDtBQUNELE9BRjZCLENBQTlCOztBQUlBLFdBQUtPLEdBQUwsQ0FBUyxtQkFBVCxFQUE4QixLQUFLckIsa0JBQW5DO0FBQ0EsV0FBS3FCLEdBQUwsQ0FBUyxpQkFBVCxFQUE0QixLQUFLTixlQUFqQztBQUNBLFdBQUtNLEdBQUwsQ0FBUyxhQUFULEVBQXdCLEtBQUtsRyxXQUE3QjtBQUNELEtBaG9CWTtBQW1vQmJtRyxXQW5vQmEscUJBbW9CSDtBQUFBOztBQUNSLFVBQUksS0FBS3JLLFFBQUwsSUFBaUJ5QyxNQUFNb0UsT0FBTixDQUFjLEtBQUs1RyxLQUFuQixDQUFqQixJQUE4QyxLQUFLQSxLQUFMLENBQVdVLE1BQVgsR0FBb0IsQ0FBdEUsRUFBeUU7QUFDdkUsYUFBS2lELGtCQUFMLEdBQTBCLEVBQTFCO0FBQ0Q7QUFDRCwwQ0FBa0IsS0FBS2MsR0FBdkIsRUFBNEIsS0FBS3VGLFlBQWpDO0FBQ0EsVUFBSSxLQUFLOUosTUFBTCxJQUFlLEtBQUtILFFBQXhCLEVBQWtDO0FBQ2hDLGFBQUsrRCxnQkFBTDtBQUNEO0FBQ0QsV0FBS00sU0FBTCxDQUFlLFlBQU07QUFDbkIsWUFBSSxPQUFLTCxLQUFMLENBQVdTLFNBQVgsSUFBd0IsT0FBS1QsS0FBTCxDQUFXUyxTQUFYLENBQXFCQyxHQUFqRCxFQUFzRDtBQUNwRCxpQkFBS3hCLFVBQUwsR0FBa0IsT0FBS2MsS0FBTCxDQUFXUyxTQUFYLENBQXFCQyxHQUFyQixDQUF5QnVCLHFCQUF6QixHQUFpRCtELEtBQW5FO0FBQ0Q7QUFDRixPQUpEO0FBS0QsS0FocEJZO0FBbXBCYk0saUJBbnBCYSwyQkFtcEJHO0FBQ2QsVUFBSSxLQUFLNUYsR0FBTCxJQUFZLEtBQUt1RixZQUFyQixFQUFtQztBQUNqQyxhQUFLM0YsU0FBTCxDQUFlLGdCQUFmLEVBQWlDLGVBQWpDO0FBQ0EsK0NBQXFCLEtBQUtJLEdBQTFCLEVBQStCLEtBQUt1RixZQUFwQztBQUNEO0FBQ0Y7QUF4cEJZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9FbmhhbmNlZFNlbGVjdC9FbmhhbmNlZFNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYWcgZnJvbSAnLi4vLi4vYXRvbXMvVGFnL1RhZyc7XG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICcuLi9JbnB1dEZpZWxkL0lucHV0RmllbGQnO1xuaW1wb3J0IFNlbGVjdE1lbnUgZnJvbSAnLi9TZWxlY3REcm9wZG93bic7XG5pbXBvcnQgT3B0aW9uIGZyb20gJy4vT3B0aW9uJztcblxuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlJztcbmltcG9ydCBFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBDbGlja291dHNpZGUgZnJvbSAnLi4vLi4vdXRpbHMvY2xpY2tvdXRzaWRlJztcbmltcG9ydCB7IGFkZENsYXNzLCByZW1vdmVDbGFzcywgaGFzQ2xhc3MgfSBmcm9tICcuLi8uLi91dGlscy9kb20nO1xuaW1wb3J0IHsgYWRkUmVzaXplTGlzdGVuZXIsIHJlbW92ZVJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcmVzaXplLWV2ZW50JztcblxuLy8gY29uc3Qgc2l6ZU1hcCA9IHtcbi8vICAgJ2xhcmdlJzogNDIsXG4vLyAgICdzbWFsbCc6IDMwLFxuLy8gICAnbWluaSc6IDIyXG4vLyB9O1xuXG5sZXQgZW5oYW5jZWRTZWxlY3RUZW1wbGF0ZSA9IGBcbjxkaXZcbiAgY2xhc3M9XCJzZWxlY3RcIlxuICA6Y2xhc3M9XCJtb2RpZmllclN0eWxlc1wiXG4gIHYtY2xpY2tvdXRzaWRlPVwiaGFuZGxlQ2xvc2VcIj5cbiAgPCEtLSBNVUxUSVBMRSBTRUxFQ1QgLyBUQUdTIC0tPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJzZWxlY3RfX3RhZ3NcIlxuICAgIHYtaWY9XCJtdWx0aXBsZVwiXG4gICAgQGNsaWNrLnN0b3A9XCJ0b2dnbGVNZW51XCJcbiAgICByZWY9XCJ0YWdzXCJcbiAgICA6c3R5bGU9XCJ7ICdtYXgtd2lkdGgnOiBpbnB1dFdpZHRoIC0gMzIgKyAncHgnIH1cIj5cbiAgICA8dHJhbnNpdGlvbi1ncm91cCBAYWZ0ZXItbGVhdmU9XCJyZXNldElucHV0SGVpZ2h0XCI+XG4gICAgICA8dGFnXG4gICAgICAgIHYtZm9yPVwiaXRlbSBpbiBzZWxlY3RlZFwiXG4gICAgICAgIDprZXk9XCJpdGVtLnZhbHVlXCJcbiAgICAgICAgY2xvc2FibGVcbiAgICAgICAgOmhpdD1cIml0ZW0uaGl0U3RhdGVcIlxuICAgICAgICB0eXBlPVwicHJpbWFyeVwiXG4gICAgICAgIEBjbG9zZT1cImRlbGV0ZVRhZygkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgY2xvc2UtdHJhbnNpdGlvbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzZWxlY3RfX3RhZ3MtdGV4dFwiPnt7IGl0ZW0uY3VycmVudExhYmVsIH19PC9zcGFuPlxuICAgICAgPC90YWc+XG4gICAgPC90cmFuc2l0aW9uLWdyb3VwPlxuXG4gICAgPGlucHV0XG4gICAgICB0eXBlPVwidGV4dFwiXG4gICAgICBjbGFzcz1cInNlbGVjdF9fZmlsdGVyLWlucHV0XCJcbiAgICAgIEBmb2N1cz1cInZpc2libGUgPSB0cnVlXCJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCIgICAgICBcbiAgICAgIEBrZXl1cD1cIm1hbmFnZVBsYWNlaG9sZGVyXCIgICAgICBcbiAgICAgIEBrZXlkb3duLmRvd24ucHJldmVudD1cIm5hdmlnYXRlT3B0aW9ucygnbmV4dCcpXCJcbiAgICAgIEBrZXlkb3duLnVwLnByZXZlbnQ9XCJuYXZpZ2F0ZU9wdGlvbnMoJ3ByZXYnKVwiXG4gICAgICBAa2V5ZG93bi5lbnRlci5wcmV2ZW50PVwic2VsZWN0T3B0aW9uXCJcbiAgICAgIEBrZXlkb3duLmVzYy5zdG9wLnByZXZlbnQ9XCJ2aXNpYmxlID0gZmFsc2VcIlxuICAgICAgQGtleWRvd24uZGVsZXRlPVwiZGVsZXRlUHJldlRhZ1wiXG4gICAgICB2LW1vZGVsPVwicXVlcnlcIlxuICAgICAgOmRlYm91bmNlPVwicmVtb3RlID8gMzAwIDogMFwiXG4gICAgICB2LWlmPVwiZmlsdGVyYWJsZVwiXG4gICAgICA6c3R5bGU9XCJ7ICdtYXgtd2lkdGgnOiBpbnB1dFdpZHRoIC0gNDIgKyAncHgnfVwiICAgIFxuICAgICAgcmVmPVwiaW5wdXRcIj5cbiAgPC9kaXY+XG4gIDwhLS0gT0xEIFNUWUxFIEJJTkRJTkcgXG4gIDpzdHlsZT1cInsgd2lkdGg6IGlucHV0TGVuZ3RoICsgJ3B4JywgJ21heC13aWR0aCc6IGlucHV0V2lkdGggLSA0MiArICdweCcgfVwiXG4gICAtLT5cbiAgPCEtLSBFTkQgVEFHUyAtLT5cbiAgPGlucHV0LWZpZWxkXG4gICAgY2xhc3M9XCJzZWxlY3RfX2lucHV0XCJcbiAgICByZWY9XCJyZWZlcmVuY2VcIlxuICAgIHYtbW9kZWw9XCJzZWxlY3RlZExhYmVsXCJcbiAgICB0eXBlPVwidGV4dFwiXG4gICAgOm1vZGlmaWVyLXN0eWxlcz1cImlucHV0TW9kaWZpZXJTdHlsZXNcIlxuICAgIDpwbGFjZWhvbGRlcj1cImN1cnJlbnRQbGFjZWhvbGRlclwiXG4gICAgOm5hbWU9XCJuYW1lXCJcbiAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgOnJlYWRvbmx5PVwiIWZpbHRlcmFibGUgfHwgbXVsdGlwbGVcIlxuICAgIDp2YWxpZGF0ZS1ldmVudD1cImZhbHNlXCJcbiAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgQGNsaWNrPVwiaGFuZGxlSWNvbkNsaWNrXCJcbiAgICBAbW91c2Vkb3duLm5hdGl2ZT1cImhhbmRsZU1vdXNlRG93blwiXG4gICAgQGtleXVwLm5hdGl2ZT1cImRlYm91bmNlZE9uSW5wdXRDaGFuZ2VcIlxuICAgIEBrZXlkb3duLm5hdGl2ZS5kb3duLnByZXZlbnQ9XCJuYXZpZ2F0ZU9wdGlvbnMoJ25leHQnKVwiXG4gICAgQGtleWRvd24ubmF0aXZlLnVwLnByZXZlbnQ9XCJuYXZpZ2F0ZU9wdGlvbnMoJ3ByZXYnKVwiXG4gICAgQGtleWRvd24ubmF0aXZlLmVudGVyLnByZXZlbnQ9XCJzZWxlY3RPcHRpb25cIlxuICAgIEBrZXlkb3duLm5hdGl2ZS5lc2Muc3RvcC5wcmV2ZW50PVwidmlzaWJsZSA9IGZhbHNlXCJcbiAgICBAa2V5ZG93bi5uYXRpdmUudGFiPVwidmlzaWJsZSA9IGZhbHNlXCJcbiAgICBAcGFzdGUubmF0aXZlPVwiZGVib3VuY2VkT25JbnB1dENoYW5nZVwiXG4gICAgQG1vdXNlZW50ZXIubmF0aXZlPVwiaW5wdXRIb3ZlcmluZyA9IHRydWVcIlxuICAgIEBtb3VzZWxlYXZlLm5hdGl2ZT1cImlucHV0SG92ZXJpbmcgPSBmYWxzZVwiXG4gICAgOmljb249XCJpY29uQ2xhc3NcIj5cbiAgPC9pbnB1dC1maWVsZD5cbiAgPHRyYW5zaXRpb25cbiAgICBuYW1lPVwiZWwtem9vbS1pbi10b3BcIlxuICAgIEBhZnRlci1sZWF2ZT1cImRvRGVzdHJveVwiXG4gICAgQGFmdGVyLWVudGVyPVwiaGFuZGxlTWVudUVudGVyXCI+XG4gICAgPHNlbGVjdC1tZW51XG4gICAgICByZWY9XCJwb3BwZXJcIlxuICAgICAgdi1zaG93PVwidmlzaWJsZSAmJiBlbXB0eVRleHQgIT09IGZhbHNlXCJcbiAgICAgIDpjbGFzcz1cIm1vZGlmaWVyU3R5bGVzXCIgICAgIFxuICAgICAgPlxuICAgICAgICA8dWxcbiAgICAgICAgICBjbGFzcz1cInNlbGVjdF9fb3B0aW9uc1wiXG4gICAgICAgICAgOmNsYXNzPVwiW3sgJ2lzLWVtcHR5JzogIWFsbG93Q3JlYXRlICYmIGZpbHRlcmVkT3B0aW9uc0NvdW50ID09PSAwIH1dXCJcbiAgICAgICAgICB2LXNob3c9XCJvcHRpb25zLmxlbmd0aCA+IDAgJiYgIWxvYWRpbmdcIiBcbiAgICAgICAgPlxuICAgICAgICAgIDxzZWxlY3Qtb3B0aW9uXG4gICAgICAgICAgICA6dmFsdWU9XCJxdWVyeVwiXG4gICAgICAgICAgICBjcmVhdGVkXG4gICAgICAgICAgICB2LWlmPVwic2hvd05ld09wdGlvblwiPlxuICAgICAgICAgIDwvc2VsZWN0LW9wdGlvbj5cbiAgICAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgICAgIDwvdWw+XG4gICAgICA8cCBjbGFzcz1cInNlbGVjdF9fZW1wdHlcIiB2LWlmPVwiZW1wdHlUZXh0ICYmIChhbGxvd0NyZWF0ZSAmJiBvcHRpb25zLmxlbmd0aCA9PT0gMCB8fCAhYWxsb3dDcmVhdGUpXCI+e3sgZW1wdHlUZXh0IH19PC9wPlxuICAgIDwvc2VsZWN0LW1lbnU+XG4gIDwvdHJhbnNpdGlvbj5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICBuYW1lOiAnU2VsZWN0JyxcblxuICB0ZW1wbGF0ZTogZW5oYW5jZWRTZWxlY3RUZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnU2VsZWN0JyxcblxuICBjb21wdXRlZDoge1xuICAgIGljb25DbGFzcygpIHtcbiAgICAgIGxldCBjcml0ZXJpYSA9IHRoaXMuY2xlYXJhYmxlICYmXG4gICAgICAgICF0aGlzLmRpc2FibGVkICYmXG4gICAgICAgIHRoaXMuaW5wdXRIb3ZlcmluZyAmJlxuICAgICAgICAhdGhpcy5tdWx0aXBsZSAmJlxuICAgICAgICB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdGhpcy52YWx1ZSAhPT0gJyc7XG4gICAgICByZXR1cm4gY3JpdGVyaWEgPyAnaWNvbi1jaXJjbGUtY2xvc2UgaXMtc2hvdy1jbG9zZScgOiAodGhpcy5yZW1vdGUgJiYgdGhpcy5maWx0ZXJhYmxlID8gJycgOiAnaWNvbi11cC1kb3duLWFycm93Jyk7XG4gICAgICAvLyByZXR1cm4gY3JpdGVyaWEgPyAnaWNvbi1jaXJjbGUtY2xvc2UgaXMtc2hvdy1jbG9zZScgOiAnaWNvbi11cC1kb3duLWFycm93JztcbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqIFxuICAgIGRlYm91bmNlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3RlID8gMzAwIDogMDtcbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqIFxuICAgIC8vIFByb3BlcnR5IHRoYXQgZHluYW1pY2FsbHkgcmV0dXJucyBkaWZmZXJlbnQgdGV4dCB3aGVuIHNlbGVjdCByZXN1bHRzIGFyZSBlbXB0eVxuICAgIC8vIFJldHVybnMgZmFsc2Ugd2hlbjogbm8gb3B0aW9ucywgbm8gcXVlcnksICYgZ2V0dGluZyBkYXRhIGZyb20gcmVtb3RlIHNlcnZlciBcbiAgICAvLyBJZiBub3QgbG9hZGluZyByZXR1cm5zIG51bGwgIFxuICAgIGVtcHR5VGV4dCgpIHtcbiAgICAgIFxuICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkaW5nVGV4dCB8fCAnTG9hZGluZyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5yZW1vdGUgJiYgdGhpcy5xdWVyeSA9PT0gJycgJiYgdGhpcy5vcHRpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJhYmxlICYmIHRoaXMub3B0aW9ucy5sZW5ndGggPiAwICYmIHRoaXMuZmlsdGVyZWRPcHRpb25zQ291bnQgPT09IDApIHsgICAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gdGhpcy5ub01hdGNoVGV4dCB8fCAnTm8gbWF0Y2hlcyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ub0RhdGFUZXh0IHx8ICdObyBEYXRhJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKiBcbiAgICAvLyBSZXR1cm5zIHRydWUgaWYgZmlsdGVyYWJsZSwgYWxsb3dDcmVhdGUsIGFuZCB0aGVyZSBpcyBhIHF1ZXJ5LiAgXG4gICAgc2hvd05ld09wdGlvbigpIHtcbiAgICAgIGxldCBoYXNFeGlzdGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maWx0ZXIob3B0aW9uID0+ICFvcHRpb24uY3JlYXRlZClcbiAgICAgICAgLnNvbWUob3B0aW9uID0+IG9wdGlvbi5jdXJyZW50TGFiZWwgPT09IHRoaXMucXVlcnkpO1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyYWJsZSAmJiB0aGlzLmFsbG93Q3JlYXRlICYmIHRoaXMucXVlcnkgIT09ICcnICYmICFoYXNFeGlzdGluZ09wdGlvbjtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuICAgICdpbnB1dC1maWVsZCc6IElucHV0RmllbGQsXG4gICAgJ3NlbGVjdC1tZW51JzogU2VsZWN0TWVudSxcbiAgICAnc2VsZWN0LW9wdGlvbic6IE9wdGlvbixcbiAgICAndGFnJzogVGFnXG4gIH0sXG5cbiAgZGlyZWN0aXZlczogeyBDbGlja291dHNpZGUgfSxcblxuICBwcm9wczoge1xuICAgIG5hbWU6IFN0cmluZyxcbiAgICB2YWx1ZToge1xuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LCAgICAgIFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGNsZWFyYWJsZTogQm9vbGVhbixcbiAgICBmaWx0ZXJhYmxlOiBCb29sZWFuLFxuICAgIGFsbG93Q3JlYXRlOiBCb29sZWFuLFxuICAgIGxvYWRpbmc6IEJvb2xlYW4sXG4gICAgcG9wcGVyQ2xhc3M6IFN0cmluZyxcbiAgICByZW1vdGU6IEJvb2xlYW4sXG4gICAgbG9hZGluZ1RleHQ6IFN0cmluZyxcbiAgICBub01hdGNoVGV4dDogU3RyaW5nLFxuICAgIG5vRGF0YVRleHQ6IFN0cmluZyxcbiAgICByZW1vdGVNZXRob2Q6IEZ1bmN0aW9uLFxuICAgIGZpbHRlck1ldGhvZDogRnVuY3Rpb24sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gICAgbXVsdGlwbGVMaW1pdDoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiAnU2VsZWN0IFBsYWNlaG9sZGVyJztcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRGaXJzdE9wdGlvbjogQm9vbGVhbixcbiAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH0sXG4gICAgaW5wdXRNb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcHRpb25zOiBbXSxcbiAgICAgIGNhY2hlZE9wdGlvbnM6IFtdLFxuICAgICAgY3JlYXRlZExhYmVsOiBudWxsLFxuICAgICAgY3JlYXRlZFNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIHNlbGVjdGVkOiB0aGlzLm11bHRpcGxlID8gW10gOiB7fSxcbiAgICAgIGlzU2VsZWN0OiB0cnVlLFxuICAgICAgaW5wdXRMZW5ndGg6IDIwLFxuICAgICAgaW5wdXRXaWR0aDogMCxcbiAgICAgIGNhY2hlZFBsYWNlSG9sZGVyOiAnJyxcbiAgICAgIG9wdGlvbnNDb3VudDogMCxcbiAgICAgIGZpbHRlcmVkT3B0aW9uc0NvdW50OiAwLFxuICAgICAgZHJvcGRvd25VbDogbnVsbCxcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgc2VsZWN0ZWRMYWJlbDogJycsXG4gICAgICBob3ZlckluZGV4OiAtMSxcbiAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgIGJvdHRvbU92ZXJmbG93OiAwLFxuICAgICAgdG9wT3ZlcmZsb3c6IDAsXG4gICAgICBvcHRpb25zQWxsRGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgaW5wdXRIb3ZlcmluZzogZmFsc2UsXG4gICAgICBjdXJyZW50UGxhY2Vob2xkZXI6ICcnXG4gICAgfTtcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHBsYWNlaG9sZGVyKHZhbCkge1xuICAgICAgdGhpcy5jYWNoZWRQbGFjZUhvbGRlciA9IHRoaXMuY3VycmVudFBsYWNlaG9sZGVyID0gdmFsO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqKlxuICAgIHZhbHVlKHZhbCkge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5yZXNldElucHV0SGVpZ2h0KCk7XG4gICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCB8fCAodGhpcy4kcmVmcy5pbnB1dCAmJiB0aGlzLnF1ZXJ5ICE9PSAnJykpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQbGFjZWhvbGRlciA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVyID0gdGhpcy5jYWNoZWRQbGFjZUhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTZWxlY3RlZCgpO1xuICAgICAgaWYgKHRoaXMuZmlsdGVyYWJsZSAmJiAhdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmlucHV0TGVuZ3RoID0gMjA7XG4gICAgICB9XG4gICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB2YWwpO1xuICAgICAgdGhpcy5kaXNwYXRjaCgnRm9ybUl0ZW0nLCAnZm9ybS5jaGFuZ2UnLCB2YWwpO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqKlxuICAgIC8vIFJlcHJlc2VudHMgY3VycmVudCB1c2VyIHF1ZXJ5IGluIHNlbGVjdCAgXG4gICAgLy8gVXBvbiBzZXR0aW5nIHRoaXMgcHJvcGVydHkgY2FsbCB0aGUgZmlsdGVyTWV0aG9kIG9uIHRoZSB2YWx1ZS4gXG4gICAgcXVlcnkodmFsKSB7XG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnZpc2libGUpIHRoaXMuYnJvYWRjYXN0KCdTZWxlY3REcm9wZG93bicsICd1cGRhdGVQb3BwZXInKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5ob3ZlckluZGV4ID0gLTE7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLmZpbHRlcmFibGUpIHtcbiAgICAgICAgdGhpcy5pbnB1dExlbmd0aCA9IHRoaXMuJHJlZnMuaW5wdXQudmFsdWUubGVuZ3RoICogMTUgKyAyMDtcbiAgICAgICAgdGhpcy5tYW5hZ2VQbGFjZWhvbGRlcigpO1xuICAgICAgICB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlbW90ZSAmJiB0eXBlb2YgdGhpcy5yZW1vdGVNZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5ob3ZlckluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMucmVtb3RlTWV0aG9kKHZhbCk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdPcHRpb24nLCAncmVzZXRJbmRleCcpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5maWx0ZXJNZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJNZXRob2QodmFsKTtcbiAgICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbkdyb3VwJywgJ3F1ZXJ5Q2hhbmdlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbHRlcmVkT3B0aW9uc0NvdW50ID0gdGhpcy5vcHRpb25zQ291bnQ7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdPcHRpb24nLCAncXVlcnlDaGFuZ2UnLCB2YWwpO1xuICAgICAgICB0aGlzLmJyb2FkY2FzdCgnT3B0aW9uR3JvdXAnLCAncXVlcnlDaGFuZ2UnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRlZmF1bHRGaXJzdE9wdGlvbiAmJiAodGhpcy5maWx0ZXJhYmxlIHx8IHRoaXMucmVtb3RlKSAmJiB0aGlzLmZpbHRlcmVkT3B0aW9uc0NvdW50KSB7XG4gICAgICAgIHRoaXMuY2hlY2tEZWZhdWx0Rmlyc3RPcHRpb24oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICB2aXNpYmxlKHZhbCkge1xuICAgICAgLy8gSWYgdmlzaWJsZSBpcyBzZXQgdG8gZmFsc2UgICAgICAgICBcbiAgICAgIGlmICghdmFsKSB7XG4gICAgICAgIC8vIGNhbGwgYmx1cigpIG9uIHRoZSBpbnB1dC1maWVsZCBcbiAgICAgICAgdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuYmx1cigpO1xuICAgICAgICAvLyB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kcmVmcy5pbnB1dENvbXBvbmVudC4kZWwucXVlcnlTZWxlY3RvcignaW5wdXQnKS5ibHVyKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBIaWRlIGljb25zIFxuICAgICAgICB0aGlzLmhhbmRsZUljb25IaWRlKCk7XG5cbiAgICAgICAgLy8gRGVzdHJveSBQb3BwZXIgIFxuICAgICAgICAvLyB0aGlzLmJyb2FkY2FzdCgnU2VsZWN0RHJvcGRvd24nLCAnZGVzdHJveVBvcHBlcicpO1xuXG4gICAgICAgIC8vIEJsdXIgdGFnIGlucHV0IFxuICAgICAgICBpZiAodGhpcy4kcmVmcy5pbnB1dCkge1xuICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuYmx1cigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgcXVlcnksIHNlbGVjdGVkIGFuZCBpbnB1dCBwbGFjZWhvbGRlciB0byBlbXB0eSBzdHJpbmcgXG4gICAgICAgIHRoaXMucXVlcnkgPSAnJztcbiAgICAgICAgdGhpcy5zZWxlY3RlZExhYmVsID0gJyc7XG4gICAgICAgIHRoaXMuaW5wdXRMZW5ndGggPSAyMDtcbiAgICAgICAgdGhpcy5yZXNldEhvdmVySW5kZXgoKTtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLiRyZWZzLmlucHV0ICYmXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID09PSAnJyAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVyID0gdGhpcy5jYWNoZWRQbGFjZUhvbGRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLmdldE92ZXJmbG93cygpO1xuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJhYmxlICYmIHRoaXMuYWxsb3dDcmVhdGUgJiZcbiAgICAgICAgICAgICAgdGhpcy5jcmVhdGVkU2VsZWN0ZWQgJiYgdGhpcy5jcmVhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMYWJlbCA9IHRoaXMuY3JlYXRlZExhYmVsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExhYmVsID0gdGhpcy5zZWxlY3RlZC5jdXJyZW50TGFiZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJhYmxlKSB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWxlY3RlZExhYmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIC8vIElmIGlzIHZpc2libGUgXG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gU2hvdyBpY29ucyBcbiAgICAgICAgdGhpcy5oYW5kbGVJY29uU2hvdygpO1xuXG4gICAgICAgIC8vIEJyb2FkY2FzdCB1cGRhdGVQb3BwZXIgZXZlbnQgXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdTZWxlY3REcm9wZG93bicsICd1cGRhdGVQb3BwZXInKTtcblxuICAgICAgICAvLyBTaG93IGZpbHRlcmVkIHJlc3VsdHMgXG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWxlY3RlZExhYmVsO1xuICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZW1vdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdxdWVyeUNoYW5nZScsICcnKTtcbiAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbkdyb3VwJywgJ3F1ZXJ5Q2hhbmdlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJyb2FkY2FzdCgnSW5wdXQnLCAnaW5wdXRTZWxlY3QnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ3Zpc2libGUtY2hhbmdlJywgdmFsKTtcbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICBvcHRpb25zKHZhbCkge1xuICAgICAgaWYgKHRoaXMuJGlzU2VydmVyKSByZXR1cm47XG4gICAgICB0aGlzLm9wdGlvbnNBbGxEaXNhYmxlZCA9IHZhbC5sZW5ndGggPT09IHZhbC5maWx0ZXIoaXRlbSA9PiBpdGVtLmRpc2FibGVkID09PSB0cnVlKS5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICAgIH1cbiAgICAgIGxldCBpbnB1dHMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgICAgaWYgKFtdLmluZGV4T2YuY2FsbChpbnB1dHMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpID09PSAtMSkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kZWZhdWx0Rmlyc3RPcHRpb24gJiYgKHRoaXMuZmlsdGVyYWJsZSB8fCB0aGlzLnJlbW90ZSkgJiYgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudCkge1xuICAgICAgICB0aGlzLmNoZWNrRGVmYXVsdEZpcnN0T3B0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICAvLyBET05FICoqKioqKlxuICAgIGhhbmRsZUljb25IaWRlKCkge1xuICAgICAgbGV0IGljb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuaW5wdXRfX2ljb24nKTtcbiAgICAgIGlmIChpY29uKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGljb24sICdpcy1yZXZlcnNlJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKioqXG4gICAgaGFuZGxlSWNvblNob3coKSB7XG4gICAgICBsZXQgaWNvbiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dF9faWNvbicpO1xuICAgICAgaWYgKGljb24gJiYgIWhhc0NsYXNzKGljb24sICdpY29uLWNpcmNsZS1jbG9zZScpKSB7XG4gICAgICAgIGFkZENsYXNzKGljb24sICdpcy1yZXZlcnNlJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKioqXG4gICAgaGFuZGxlTWVudUVudGVyKCkge1xuICAgICAgaWYgKCF0aGlzLmRyb3Bkb3duVWwpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93blVsID0gdGhpcy4kcmVmcy5wb3BwZXIuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RfX29wdGlvbnMnKTtcbiAgICAgICAgdGhpcy5nZXRPdmVyZmxvd3MoKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLmRyb3Bkb3duVWwpIHtcbiAgICAgICAgdGhpcy5yZXNldE1lbnVTY3JvbGwoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRE9ORSAqKioqKipcbiAgICAvLyBpZiB0aGVyZSBpcyBhIGRyb3Bkb3duIHBvcHBlciBcbiAgICAvLyAmJiBpZiB0aGVyZSBpcyBhIHNlbGVjdGVkIG9wdGlvbiBjb21wb25lbnQgXG4gICAgICAvLyBzZXQgdGhlIGJvdHRvbSBhbmQgdG9wIG92ZXJmbG93IHRvIGJlIHVzZWQgaW4gcmVzZXR0aW5nIHRoZSBzY3JvbGwuXG4gICAgZ2V0T3ZlcmZsb3dzKCkgeyAgICAgICAgIFxuICAgICAgaWYgKHRoaXMuZHJvcGRvd25VbCAmJiB0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQuJGVsKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZFJlY3QgPSB0aGlzLnNlbGVjdGVkLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IHBvcHBlclJlY3QgPSB0aGlzLiRyZWZzLnBvcHBlci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuYm90dG9tT3ZlcmZsb3cgPSBzZWxlY3RlZFJlY3QuYm90dG9tIC0gcG9wcGVyUmVjdC5ib3R0b207XG4gICAgICAgIHRoaXMudG9wT3ZlcmZsb3cgPSBzZWxlY3RlZFJlY3QudG9wIC0gcG9wcGVyUmVjdC50b3A7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERPTkUgKioqKioqXG4gICAgLy8gVXNlIHZhbHVlIG9mIG92ZXJmbG93KHMpIHRvIHJlc2V0IHNjcm9sbCBwb3NpdGlvbiBvZiBEcm9wZG93biBwb3BwZXIgIFxuICAgIHJlc2V0TWVudVNjcm9sbCgpIHtcbiAgICAgIGlmICh0aGlzLmJvdHRvbU92ZXJmbG93ID4gMCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3duVWwuc2Nyb2xsVG9wICs9IHRoaXMuYm90dG9tT3ZlcmZsb3c7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudG9wT3ZlcmZsb3cgPCAwKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd25VbC5zY3JvbGxUb3AgKz0gdGhpcy50b3BPdmVyZmxvdztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0T3B0aW9uKHZhbHVlKSB7XG4gICAgICBsZXQgb3B0aW9uO1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuY2FjaGVkT3B0aW9ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBjYWNoZWRPcHRpb24gPSB0aGlzLmNhY2hlZE9wdGlvbnNbaV07XG4gICAgICAgIGlmIChjYWNoZWRPcHRpb24udmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgb3B0aW9uID0gY2FjaGVkT3B0aW9uO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uKSByZXR1cm4gb3B0aW9uO1xuICAgICAgY29uc3QgbGFiZWwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcidcbiAgICAgICAgPyB2YWx1ZSA6ICcnO1xuICAgICAgbGV0IG5ld09wdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBjdXJyZW50TGFiZWw6IGxhYmVsXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgbmV3T3B0aW9uLmhpdFN0YXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3T3B0aW9uO1xuICAgIH0sXG5cbiAgICAvLyBET05FICoqKioqIFxuICAgIC8vIE1ldGhvZCB0byBTZXQgdGhlIHNlbGVjdGVkIG9wdGlvbiBcbiAgICBzZXRTZWxlY3RlZCgpIHtcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICBsZXQgb3B0aW9uID0gdGhpcy5nZXRPcHRpb24odGhpcy52YWx1ZSk7XG4gICAgICAgIGlmIChvcHRpb24uY3JlYXRlZCkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlZExhYmVsID0gb3B0aW9uLmN1cnJlbnRMYWJlbDtcbiAgICAgICAgICB0aGlzLmNyZWF0ZWRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVkU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGVkTGFiZWwgPSBvcHRpb24uY3VycmVudExhYmVsO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gb3B0aW9uO1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJhYmxlKSB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWxlY3RlZExhYmVsO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSkge1xuICAgICAgICB0aGlzLnZhbHVlLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZ2V0T3B0aW9uKHZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5zZWxlY3RlZCA9IHJlc3VsdDtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldElucHV0SGVpZ2h0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlRm9jdXMoKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBoYW5kbGVJY29uQ2xpY2soZXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmljb25DbGFzcy5pbmRleE9mKCdjaXJjbGUtY2xvc2UnKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWQoZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZU1vdXNlRG93bihldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnKSByZXR1cm47XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9EZXN0cm95KCkge1xuICAgICAgdGhpcy4kcmVmcy5wb3BwZXIgJiYgdGhpcy4kcmVmcy5wb3BwZXIuZG9EZXN0cm95KCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsb3NlKCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHRvZ2dsZUxhc3RPcHRpb25IaXRTdGF0ZShoaXQpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNlbGVjdGVkKSkgcmV0dXJuO1xuICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5zZWxlY3RlZFt0aGlzLnNlbGVjdGVkLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKCFvcHRpb24pIHJldHVybjtcblxuICAgICAgaWYgKGhpdCA9PT0gdHJ1ZSB8fCBoaXQgPT09IGZhbHNlKSB7XG4gICAgICAgIG9wdGlvbi5oaXRTdGF0ZSA9IGhpdDtcbiAgICAgICAgcmV0dXJuIGhpdDtcbiAgICAgIH1cblxuICAgICAgb3B0aW9uLmhpdFN0YXRlID0gIW9wdGlvbi5oaXRTdGF0ZTtcbiAgICAgIHJldHVybiBvcHRpb24uaGl0U3RhdGU7XG4gICAgfSxcblxuICAgIGRlbGV0ZVByZXZUYWcoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlLmxlbmd0aCA8PSAwICYmICF0aGlzLnRvZ2dsZUxhc3RPcHRpb25IaXRTdGF0ZSgpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgpO1xuICAgICAgICB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1hbmFnZVBsYWNlaG9sZGVyKCkge1xuICAgICAgaWYgKHRoaXMuY3VycmVudFBsYWNlaG9sZGVyICE9PSAnJykge1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGFjZWhvbGRlciA9IHRoaXMuJHJlZnMuaW5wdXQudmFsdWUgPyAnJyA6IHRoaXMuY2FjaGVkUGxhY2VIb2xkZXI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlc2V0SW5wdXRTdGF0ZShlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlICE9PSA4KSB0aGlzLnRvZ2dsZUxhc3RPcHRpb25IaXRTdGF0ZShmYWxzZSk7XG4gICAgICB0aGlzLmlucHV0TGVuZ3RoID0gdGhpcy4kcmVmcy5pbnB1dC52YWx1ZS5sZW5ndGggKiAxNSArIDIwO1xuICAgICAgdGhpcy5yZXNldElucHV0SGVpZ2h0KCk7XG4gICAgfSxcblxuICAgIHJlc2V0SW5wdXRIZWlnaHQoKSB7XG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy4kcmVmcy5yZWZlcmVuY2UpIHJldHVybjtcbiAgICAgICAgLy8gbGV0IGlucHV0Q2hpbGROb2RlcyA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRlbC5jaGlsZE5vZGVzO1xuICAgICAgICAvLyBDaGFuZ2UgbG9naWMgdG8gdXNlIHNlbGVjdG9yLiBcbiAgICAgICAgLy8gbGV0IGlucHV0ID0gW10uZmlsdGVyLmNhbGwoaW5wdXRDaGlsZE5vZGVzLCBpdGVtID0+IGl0ZW0udGFnTmFtZSA9PT0gJ0lOUFVUJylbMF07XG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgICAgICAvLyBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kcmVmcy5pbnB1dENvbXBvbmVudC4kcmVmcy5pbnB1dDtcbiAgICAgICAgbGV0IGlucHV0Q29tcG9uZW50ID0gdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dCcpO1xuICAgICAgICAvLyBsZXQgaW5wdXRDb21wb25lbnQgPSB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kcmVmcy5pbnB1dENvbXBvbmVudC4kZWw7XG4gICAgICAgIC8vIHZhciBuZXdIZWlnaHQgPSBNYXRoLm1heCh0aGlzLiRyZWZzLnRhZ3MuY2xpZW50SGVpZ2h0ICsgNiwgc2l6ZU1hcFt0aGlzLnNpemVdIHx8IDQwKSArICdweCc7XG4gICAgICAgIHZhciBuZXdIZWlnaHQgPSBNYXRoLm1heCh0aGlzLiRyZWZzLnRhZ3MuY2xpZW50SGVpZ2h0ICsgNiwgNDApICsgJ3B4JztcbiAgICAgICAgaW5wdXQuc3R5bGUuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgICAgICBpbnB1dENvbXBvbmVudC5zdHlsZS5oZWlnaHQgPSBuZXdIZWlnaHQ7XG5cbiAgICAgICAgaWYgKHRoaXMudmlzaWJsZSAmJiB0aGlzLmVtcHR5VGV4dCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLmJyb2FkY2FzdCgnU2VsZWN0RHJvcGRvd24nLCAndXBkYXRlUG9wcGVyJyk7XG4gICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc2V0SG92ZXJJbmRleCgpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBNYXRoLm1pbi5hcHBseShudWxsLCB0aGlzLnNlbGVjdGVkLm1hcChpdGVtID0+IHRoaXMub3B0aW9ucy5pbmRleE9mKGl0ZW0pKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaG92ZXJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgMzAwKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlT3B0aW9uU2VsZWN0KG9wdGlvbikge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gdmFsdWUuaW5kZXhPZihvcHRpb24udmFsdWUpO1xuICAgICAgICBpZiAob3B0aW9uSW5kZXggPiAtMSkge1xuICAgICAgICAgIHZhbHVlLnNwbGljZShvcHRpb25JbmRleCwgMSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tdWx0aXBsZUxpbWl0IDw9IDAgfHwgdmFsdWUubGVuZ3RoIDwgdGhpcy5tdWx0aXBsZUxpbWl0KSB7XG4gICAgICAgICAgdmFsdWUucHVzaChvcHRpb24udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgICBpZiAob3B0aW9uLmNyZWF0ZWQpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgICAgICAgdGhpcy5pbnB1dExlbmd0aCA9IDIwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0Jywgb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHRvZ2dsZU1lbnUoKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJhYmxlICYmIHRoaXMucXVlcnkgPT09ICcnICYmIHRoaXMudmlzaWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMudmlzaWJsZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbmF2aWdhdGVPcHRpb25zKGRpcmVjdGlvbikge1xuICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDAgfHwgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudCA9PT0gMCkgcmV0dXJuO1xuICAgICAgdGhpcy5vcHRpb25zQWxsRGlzYWJsZWQgPSB0aGlzLm9wdGlvbnMubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5kaXNhYmxlZCA9PT0gdHJ1ZSkubGVuZ3RoO1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnNBbGxEaXNhYmxlZCkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgICB0aGlzLmhvdmVySW5kZXgrKztcbiAgICAgICAgICBpZiAodGhpcy5ob3ZlckluZGV4ID09PSB0aGlzLm9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLmRpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS5ncm91cERpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICAhdGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0udmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZU9wdGlvbnMoJ25leHQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgdGhpcy5ob3ZlckluZGV4LS07XG4gICAgICAgICAgaWYgKHRoaXMuaG92ZXJJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuaG92ZXJJbmRleCA9IHRoaXMub3B0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLmRpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS5ncm91cERpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICAhdGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0udmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZU9wdGlvbnMoJ3ByZXYnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRTY3JvbGxUb3AoKSB7XG4gICAgICBsZXQgYm90dG9tT3ZlcmZsb3dEaXN0YW5jZSA9IHRoaXMub3B0aW9uc1t0aGlzLmhvdmVySW5kZXhdLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gLVxuICAgICAgICB0aGlzLiRyZWZzLnBvcHBlci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xuICAgICAgbGV0IHRvcE92ZXJmbG93RGlzdGFuY2UgPSB0aGlzLm9wdGlvbnNbdGhpcy5ob3ZlckluZGV4XS4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgdGhpcy4kcmVmcy5wb3BwZXIuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgIGlmIChib3R0b21PdmVyZmxvd0Rpc3RhbmNlID4gMCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3duVWwuc2Nyb2xsVG9wICs9IGJvdHRvbU92ZXJmbG93RGlzdGFuY2U7XG4gICAgICB9XG4gICAgICBpZiAodG9wT3ZlcmZsb3dEaXN0YW5jZSA8IDApIHtcbiAgICAgICAgdGhpcy5kcm9wZG93blVsLnNjcm9sbFRvcCArPSB0b3BPdmVyZmxvd0Rpc3RhbmNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZWxlY3RPcHRpb24oKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVPcHRpb25TZWxlY3QodGhpcy5vcHRpb25zW3RoaXMuaG92ZXJJbmRleF0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGVTZWxlY3RlZChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICcnKTtcbiAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy4kZW1pdCgnY2xlYXInKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlVGFnKGV2ZW50LCB0YWcpIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuc2VsZWN0ZWQuaW5kZXhPZih0YWcpO1xuICAgICAgaWYgKGluZGV4ID4gLTEgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKCk7XG4gICAgICAgIHZhbHVlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpO1xuICAgICAgICB0aGlzLiRlbWl0KCdyZW1vdmUtdGFnJywgdGFnKTtcbiAgICAgIH1cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBvbklucHV0Q2hhbmdlKCkge1xuICAgICAgaWYgKHRoaXMuZmlsdGVyYWJsZSkge1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWxlY3RlZExhYmVsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbk9wdGlvbkRlc3Ryb3kob3B0aW9uKSB7XG4gICAgICB0aGlzLm9wdGlvbnNDb3VudC0tO1xuICAgICAgdGhpcy5maWx0ZXJlZE9wdGlvbnNDb3VudC0tO1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2Yob3B0aW9uKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdyZXNldEluZGV4Jyk7XG4gICAgfSxcblxuICAgIHJlc2V0SW5wdXRXaWR0aCgpIHtcbiAgICAgIHRoaXMuaW5wdXRXaWR0aCA9IHRoaXMuJHJlZnMucmVmZXJlbmNlLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICB9LFxuXG4gICAgaGFuZGxlUmVzaXplKCkge1xuICAgICAgdGhpcy5yZXNldElucHV0V2lkdGgoKTtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB0aGlzLnJlc2V0SW5wdXRIZWlnaHQoKTtcbiAgICB9LFxuXG4gICAgLy8gT0sgKioqKioqXG4gICAgY2hlY2tEZWZhdWx0Rmlyc3RPcHRpb24oKSB7XG4gICAgICB0aGlzLmhvdmVySW5kZXggPSAtMTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSB0aGlzLm9wdGlvbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xuICAgICAgICAgIC8vIHBpY2sgZmlyc3Qgb3B0aW9ucyB0aGF0IHBhc3NlcyB0aGUgZmlsdGVyXG4gICAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQgJiYgIW9wdGlvbi5ncm91cERpc2FibGVkICYmIG9wdGlvbi52aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHBpY2sgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvblxuICAgICAgICAgIGlmIChvcHRpb24uaXRlbVNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVySW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gRE9ORSAqKioqKipcbiAgY3JlYXRlZCgpIHtcbiAgICAvLyBzZXQgY2FjaGVkUGxhY2VIb2xkZXJcbiAgICB0aGlzLmNhY2hlZFBsYWNlSG9sZGVyID0gdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyO1xuXG4gICAgLy8gaWYgbXVsdGlwbGUgc2VsZWN0IHNlbmQgYW4gYXJyYXkgdGhyb3VnaCBpbnB1dCBldmVudCBwYXlsb2FkIFxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIFtdKTtcbiAgICB9XG5cbiAgICAvLyBpZiBub3QgbXVsdGlwbGUgc2VsZWN0IHNlbmQgYSBzdHJpbmcgdGhyb3VnaCBpbnB1dCBldmVudCBwYXlsb2FkIFxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICcnKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHNldFNlbGVjdGVkXG4gICAgdGhpcy5zZXRTZWxlY3RlZCgpO1xuXG4gICAgdGhpcy5kZWJvdW5jZWRPbklucHV0Q2hhbmdlID0gZGVib3VuY2UodGhpcy5kZWJvdW5jZSwgKCkgPT4ge1xuICAgICAgdGhpcy5vbklucHV0Q2hhbmdlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRvbignaGFuZGxlT3B0aW9uQ2xpY2snLCB0aGlzLmhhbmRsZU9wdGlvblNlbGVjdCk7XG4gICAgdGhpcy4kb24oJ29uT3B0aW9uRGVzdHJveScsIHRoaXMub25PcHRpb25EZXN0cm95KTtcbiAgICB0aGlzLiRvbignc2V0U2VsZWN0ZWQnLCB0aGlzLnNldFNlbGVjdGVkKTtcbiAgfSxcblxuICAvLyBPSyAqKioqKipcbiAgbW91bnRlZCgpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXIgPSAnJztcbiAgICB9XG4gICAgYWRkUmVzaXplTGlzdGVuZXIodGhpcy4kZWwsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICBpZiAodGhpcy5yZW1vdGUgJiYgdGhpcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5yZXNldElucHV0SGVpZ2h0KCk7XG4gICAgfVxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLiRyZWZzLnJlZmVyZW5jZSAmJiB0aGlzLiRyZWZzLnJlZmVyZW5jZS4kZWwpIHtcbiAgICAgICAgdGhpcy5pbnB1dFdpZHRoID0gdGhpcy4kcmVmcy5yZWZlcmVuY2UuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8vIE9LICoqKioqKlxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIGlmICh0aGlzLiRlbCAmJiB0aGlzLmhhbmRsZVJlc2l6ZSkge1xuICAgICAgdGhpcy5icm9hZGNhc3QoJ1NlbGVjdERyb3Bkb3duJywgJ2Rlc3Ryb3lQb3BwZXInKTtcbiAgICAgIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMuJGVsLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgfVxuICB9XG59O1xuIl19
