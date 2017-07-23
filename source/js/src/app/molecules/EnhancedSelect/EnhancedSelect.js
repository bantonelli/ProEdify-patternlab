import Tag from '../../atoms/Tag/Tag';
import InputField from '../InputField/InputField';
import SelectMenu from './SelectDropdown';
import Option from './Option';

import debounce from 'throttle-debounce/debounce';
import Emitter from '../../utils/mixins/emitter';
import Clickoutside from '../../utils/clickoutside';
import { addClass, removeClass, hasClass } from '../../utils/dom';
import { addResizeListener, removeResizeListener } from '../../utils/resize-event';

// const sizeMap = {
//   'large': 42,
//   'small': 30,
//   'mini': 22
// };

let enhancedSelectTemplate = `
<div
  class="select"
  :class="modifierStyles"
  v-clickoutside="handleClose">
  <!-- MULTIPLE SELECT / TAGS -->
  <div
    class="select__tags"
    v-if="multiple"
    @click.stop="toggleMenu"
    ref="tags"
    :style="{ 'max-width': inputWidth - 32 + 'px' }">
    <transition-group @after-leave="resetInputHeight">
      <tag
        v-for="item in selected"
        :key="item.value"
        closable
        :hit="item.hitState"
        type="primary"
        @close="deleteTag($event, item)"
        close-transition>
        <span class="select__tags-text">{{ item.currentLabel }}</span>
      </tag>
    </transition-group>

    <input
      type="text"
      class="select__filter-input"
      @focus="visible = true"
      :disabled="disabled"
      @keyup="managePlaceholder"
      @keydown="resetInputState"
      @keydown.down.prevent="navigateOptions('next')"
      @keydown.up.prevent="navigateOptions('prev')"
      @keydown.enter.prevent="selectOption"
      @keydown.esc.stop.prevent="visible = false"
      @keydown.delete="deletePrevTag"
      v-model="query"
      :debounce="remote ? 300 : 0"
      v-if="filterable"
      :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
      ref="input">
  </div>
  <!-- END TAGS -->
  <input-field
    class="select__input"
    ref="reference"
    v-model="selectedLabel"
    type="text"
    :modifier-styles="inputModifierStyles"
    :placeholder="currentPlaceholder"
    :name="name"
    :disabled="disabled"
    :readonly="!filterable || multiple"
    :validate-event="false"
    @focus="handleFocus"
    @click="handleIconClick"
    @mousedown.native="handleMouseDown"
    @keyup.native="debouncedOnInputChange"
    @keydown.native.down.prevent="navigateOptions('next')"
    @keydown.native.up.prevent="navigateOptions('prev')"
    @keydown.native.enter.prevent="selectOption"
    @keydown.native.esc.stop.prevent="visible = false"
    @keydown.native.tab="visible = false"
    @paste.native="debouncedOnInputChange"
    @mouseenter.native="inputHovering = true"
    @mouseleave.native="inputHovering = false"
    :icon="iconClass">
  </input-field>
  <transition
    name="el-zoom-in-top"
    @after-leave="doDestroy"
    @after-enter="handleMenuEnter">
    <select-menu
      ref="popper"
      v-show="visible && emptyText !== false"
      :class="modifierStyles">
        <ul
          class="select__options"
          :class="[{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }]"
          v-show="options.length > 0 && !loading" 
        >
          <select-option
            :value="query"
            created
            v-if="showNewOption">
          </select-option>
          <slot></slot>
        </ul>
      <p class="select__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>
    </select-menu>
  </transition>
</div>
`;

export default {
  mixins: [Emitter],

  name: 'Select',

  template: enhancedSelectTemplate,

  componentName: 'Select',

  computed: {
    iconClass() {
      let criteria = this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        !this.multiple &&
        this.value !== undefined &&
        this.value !== '';
      return criteria ? 'icon-circle-close is-show-close' : (this.remote && this.filterable ? '' : 'icon-up-down-arrow');
      // return criteria ? 'icon-circle-close is-show-close' : 'icon-up-down-arrow';
    },

    // DONE **** 
    debounce() {
      return this.remote ? 300 : 0;
    },

    // DONE **** 
    // Property that dynamically returns different text when select results are empty
    // Returns false when: no options, no query, & getting data from remote server 
    // If not loading returns null  
    emptyText() {
      
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

    // DONE **** 
    // Returns true if filterable, allowCreate, and there is a query.  
    showNewOption() {
      let hasExistingOption = this.options.filter(option => !option.created)
        .some(option => option.currentLabel === this.query);
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
    }
  },

  components: {
    'input-field': InputField,
    'select-menu': SelectMenu,
    'select-option': Option,
    'tag': Tag
  },

  directives: { Clickoutside },

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
      default() {
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

  data() {
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
    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },

    // DONE ******
    value(val) {
      if (this.multiple) {
        this.resetInputHeight();
        if (val.length > 0 || (this.$refs.input && this.query !== '')) {
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

    // DONE ******
    // Represents current user query in select  
    // Upon setting this property call the filterMethod on the value. 
    query(val) {
      this.$nextTick(() => {
        if (this.visible) this.broadcast('SelectDropdown', 'updatePopper');
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

    // DONE ******
    visible(val) {
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
        this.$nextTick(() => {
          if (this.$refs.input &&
            this.$refs.input.value === '' &&
            this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          this.getOverflows();
          if (this.selected) {
            if (this.filterable && this.allowCreate &&
              this.createdSelected && this.createdOption) {
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

    // DONE ******
    options(val) {
      if (this.$isServer) return;
      this.optionsAllDisabled = val.length === val.filter(item => item.disabled === true).length;
      if (this.multiple) {
        this.resetInputHeight();
      }
      let inputs = this.$el.querySelectorAll('input');
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }
    }
  },

  methods: {
    // DONE ******
    handleIconHide() {
      let icon = this.$el.querySelector('.input__icon');
      if (icon) {
        removeClass(icon, 'is-reverse');
      }
    },

    // DONE ******
    handleIconShow() {
      let icon = this.$el.querySelector('.input__icon');
      if (icon && !hasClass(icon, 'icon-circle-close')) {
        addClass(icon, 'is-reverse');
      }
    },

    // DONE ******
    handleMenuEnter() {
      if (!this.dropdownUl) {
        this.dropdownUl = this.$refs.popper.$el.querySelector('.select__options');
        this.getOverflows();
      }
      if (!this.multiple && this.dropdownUl) {
        this.resetMenuScroll();
      }
    },

    // DONE ******
    // if there is a dropdown popper 
    // && if there is a selected option component 
      // set the bottom and top overflow to be used in resetting the scroll.
    getOverflows() {         
      if (this.dropdownUl && this.selected && this.selected.$el) {
        let selectedRect = this.selected.$el.getBoundingClientRect();
        let popperRect = this.$refs.popper.$el.getBoundingClientRect();
        this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
        this.topOverflow = selectedRect.top - popperRect.top;
      }
    },

    // DONE ******
    // Use value of overflow(s) to reset scroll position of Dropdown popper  
    resetMenuScroll() {
      if (this.bottomOverflow > 0) {
        this.dropdownUl.scrollTop += this.bottomOverflow;
      } else if (this.topOverflow < 0) {
        this.dropdownUl.scrollTop += this.topOverflow;
      }
    },

    getOption(value) {
      let option;
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        if (cachedOption.value === value) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      const label = typeof value === 'string' || typeof value === 'number'
        ? value : '';
      let newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },

    // DONE ***** 
    // Method to Set the selected option 
    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value);
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
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    handleFocus() {
      this.visible = true;
    },

    handleIconClick(event) {
      if (this.iconClass.indexOf('circle-close') > -1) {
        this.deleteSelected(event);
      } else {
        this.toggleMenu();
      }
    },

    handleMouseDown(event) {
      if (event.target.tagName !== 'INPUT') return;
      if (this.visible) {
        this.handleClose();
        event.preventDefault();
      }
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    handleClose() {
      this.visible = false;
    },

    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) return;
      const option = this.selected[this.selected.length - 1];
      if (!option) return;

      if (hit === true || hit === false) {
        option.hitState = hit;
        return hit;
      }

      option.hitState = !option.hitState;
      return option.hitState;
    },

    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice();
        value.pop();
        this.$emit('input', value);
      }
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },

    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },

    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        // let inputChildNodes = this.$refs.reference.$el.childNodes;
        // Change logic to use selector. 
        // let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        // let input = this.$refs.reference.$el.querySelector('input');
        let input = this.$refs.reference.$refs.inputComponent.$refs.input;
        // let inputComponent = this.$refs.reference.$el.querySelector('.input');
        let inputComponent = this.$refs.reference.$refs.inputComponent.$el;
        // var newHeight = Math.max(this.$refs.tags.clientHeight + 6, sizeMap[this.size] || 40) + 'px';
        var newHeight = Math.max(this.$refs.tags.clientHeight + 6, 40) + 'px';
        input.style.height = newHeight;
        inputComponent.style.height = newHeight;

        if (this.visible && this.emptyText !== false) {
          this.broadcast('SelectDropdown', 'updatePopper');
        }
      });
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
          } else {
            this.hoverIndex = -1;
          }
        }
      }, 300);
    },

    handleOptionSelect(option) {
      if (this.multiple) {
        const value = this.value.slice();
        const optionIndex = value.indexOf(option.value);
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

    toggleMenu() {
      if (this.filterable && this.query === '' && this.visible) {
        return;
      }
      if (!this.disabled) {
        this.visible = !this.visible;
      }
    },

    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
      this.optionsAllDisabled = this.options.length === this.options.filter(item => item.disabled === true).length;
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
          this.resetScrollTop();
          if (this.options[this.hoverIndex].disabled === true ||
            this.options[this.hoverIndex].groupDisabled === true ||
            !this.options[this.hoverIndex].visible) {
            this.navigateOptions('next');
          }
        }
        if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
          this.resetScrollTop();
          if (this.options[this.hoverIndex].disabled === true ||
            this.options[this.hoverIndex].groupDisabled === true ||
            !this.options[this.hoverIndex].visible) {
            this.navigateOptions('prev');
          }
        }
      }
    },

    resetScrollTop() {
      let bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom -
        this.$refs.popper.$el.getBoundingClientRect().bottom;
      let topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top -
        this.$refs.popper.$el.getBoundingClientRect().top;
      if (bottomOverflowDistance > 0) {
        this.dropdownUl.scrollTop += bottomOverflowDistance;
      }
      if (topOverflowDistance < 0) {
        this.dropdownUl.scrollTop += topOverflowDistance;
      }
    },

    selectOption() {
      if (this.options[this.hoverIndex]) {
        this.handleOptionSelect(this.options[this.hoverIndex]);
      }
    },

    deleteSelected(event) {
      event.stopPropagation();
      this.$emit('input', '');
      this.visible = false;
      this.$emit('clear');
    },

    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1 && !this.disabled) {
        const value = this.value.slice();
        value.splice(index, 1);
        this.$emit('input', value);
        this.$emit('remove-tag', tag);
      }
      event.stopPropagation();
    },

    onInputChange() {
      if (this.filterable) {
        this.query = this.selectedLabel;
      }
    },

    onOptionDestroy(option) {
      this.optionsCount--;
      this.filteredOptionsCount--;
      let index = this.options.indexOf(option);
      if (index > -1) {
        this.options.splice(index, 1);
      }
      this.broadcast('Option', 'resetIndex');
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },

    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },

    // OK ******
    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i];
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
  
  // DONE ******
  created() {
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

    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange();
    });

    this.$on('handleOptionClick', this.handleOptionSelect);
    this.$on('onOptionDestroy', this.onOptionDestroy);
    this.$on('setSelected', this.setSelected);
  },

  // OK ******
  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = '';
    }
    addResizeListener(this.$el, this.handleResize);
    if (this.remote && this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      }
    });
  },

  // OK ******
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  }
};
