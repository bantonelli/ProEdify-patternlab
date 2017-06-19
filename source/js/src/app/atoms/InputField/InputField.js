const inputFieldTemplate2 = `
<div :class="[type === 'textarea' ? 'text-area' : 'el-input',
  {
    'is-disabled': disabled,
    'el-input-group': $slots.prepend || $slots.append,
    'el-input-group--append': $slots.append,
    'el-input-group--prepend': $slots.prepend
  }
]">
  <template v-if="type !== 'textarea'">
    <!-- 前置元素 -->
    <div class="el-input-group__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <!-- input 图标 -->
    <slot name="icon">
      <i class="el-input__icon"
        :class="[
          'el-icon-' + icon,
          onIconClick ? 'is-clickable' : ''
        ]"
        v-if="icon"
        @click="handleIconClick">
      </i>
    </slot>
    <input
      v-if="type !== 'textarea'"
      class="el-input__inner"
      v-bind="$props"
      :autocomplete="autoComplete"
      :value="currentValue"
      ref="input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <i class="el-input__icon el-icon-loading" v-if="validating"></i>
    <!-- 后置元素 -->
    <div class="el-input-group__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </template>
  <template v-else>
    <pe-text-area
      ref="textarea"
      :parent-props="$props"
      :styles="textareaStyle"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      >
    </pe-text-area>
  </template>
</div>
`;

import emitter from '../../mixins/emitter';
import calcTextareaHeight from './calcTextareaHeight';
import merge from '../../utils/merge';
import Input from '../Input';
import TextArea from '../TextArea';

export default {
  name: 'Input',

  componentName: 'Input',

  template: inputFieldTemplate2, 

  mixins: [emitter],

  components: {
    'pe-input': Input,
    'pe-text-area': TextArea
  },

  data() {
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
    validating() {
      return this.$parent.validateState === 'validating';
    },
    textareaStyle() {
      // This computed prop is bound to the :style attribute of <textarea>
      
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    }
  },

  watch: {
    'value'(val, oldValue) {
      this.setCurrentValue(val);
    }
  },

  methods: {
    handleBlur(event) {
      // emit a normal blur event 
      this.$emit('blur', event);

      if (this.validateEvent) {
        // Upon validation event dispatch the currentValue to the parent form 
        this.dispatch('FormItem', 'form.blur', [this.currentValue]);
      }
    },
    inputSelect() {
      // select the DOM <input> 
      // using a Vue ref for easy DOM selection 
      this.$refs.input.select();
    },
    resizeTextarea() {
      // method to calculate text area size 
      console.log("***** Called RESIZE *********");
      // if on server stop execution 
      if (this.$isServer) return;

      // grab the autosize and type props from this current component 
      var { autosize, type } = this;

      // If autosize==false or type is not 'textarea' stop execution
      if (!autosize || type !== 'textarea') return;
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;
      // console.log("***** CALCULATE HEIGHT *********");
      // Update dataProp textareaCalcStyle with new text area height. 
      // console.log(this.$refs.textarea.$refs.input);
      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea.$refs.input, minRows, maxRows);
      console.log("*** textareaCalcStyle: ", this.textareaCalcStyle.height);
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    handleInput(event) {
      let value;
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
    handleIconClick(event) {
      if (this.onIconClick) {
        this.onIconClick(event);
      }
      this.$emit('click', event);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.$nextTick(_ => {        
        this.resizeTextarea();
      });
      // this.resizeTextarea();
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch('FormItem', 'form.change', [value]);
      }
    }
  },

  created() {
    this.$on('inputSelect', this.inputSelect);
  },

  mounted() {
    this.resizeTextarea();
  }
};

