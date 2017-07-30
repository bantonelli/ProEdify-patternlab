const inputFieldTemplate2 = `
<div :class="[type === 'textarea' ? 'text-area-field' : 'input-field',
  {
    'input-field--appended': $slots.append,
    'input-field--prepended': $slots.prepend,
  },
  {
    'is-disabled': disabled
  }
]">
  <template v-if="type !== 'textarea'">
    <!-- Prepend Slot -->
    <div class="input-field__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>

    <input-component
      :parent-props="parentProps"
      :modifier-styles="modifierStyles"
      :is-valid="isValid"
      :is-invalid="isInvalid"      
      ref="inputComponent"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      >
        <!-- input icon -->
        <template v-if="icon" slot="icon">
          <i class="input__icon icon-loading" v-if="validating"></i>
          <i 
            v-else
            class="input__icon"
            :class="[
              icon,
              onIconClick ? 'is-clickable' : ''
            ]" 
            slot="icon"        
            @click="handleIconClick"
          ></i>
        </template>
    </input-component>          
    
    <!-- Append Slot -->
    <div class="input-field__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </template>
  <template v-else>
    <text-area
      ref="textarea"
      :parent-props="parentProps"
      :modifier-styles="modifierStyles"
      :is-valid="isValid"
      :is-invalid="isInvalid"
      :styles="textareaStyle"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      >
    </text-area>
  </template>
</div>
`;

import _ from 'lodash';
import calcTextareaHeight from './calcTextareaHeight';
import emitter from '../../utils/mixins/emitter';
import merge from '../../utils/merge';
import Input from '../../atoms/Input';
import TextArea from '../../atoms/TextArea';

export default {
  name: 'InputField',

  componentName: 'InputField',

  template: inputFieldTemplate2, 

  mixins: [emitter],

  components: {
    'input-component': Input,
    'text-area': TextArea
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
    validating() {
      return this.$parent.validateState === 'validating';
      // return true;
    },
    textareaStyle() {
      // This computed prop is bound to the :style attribute of <textarea>
      
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    parentProps() {
      // let newObject = this.$props;
      // for(var prop in this.$props) {
      //     if(prop === "modifierStyles"){

      //     }          
      // }
      return _.omit(this.$props, ['modifierStyles']);
    },
    isValid() {
      if (this.$parent) {
        if (this.$parent.validateState) {
          // For normal inputs 
          // form-item >> input-field
          return this.$parent.validateState === 'success';
        } 
        else if (this.$parent.$parent) {
          return this.$parent.$parent.validateState ? this.$parent.$parent.validateState === 'success' : false;                               
        }
      } else {
        return false;
      }      
    },
    isInvalid() {
      if (this.$parent) {
        if (this.$parent.validateState) {
          // For normal inputs 
          // form-item >> input-field
          return this.$parent.validateState === 'error';
        } 
        else if (this.$parent.$parent) {
          return this.$parent.$parent.validateState ? this.$parent.$parent.validateState === 'error' : false;                               
        }
      } else {
        return false;
      }   
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
      this.$refs.inputComponent.select();
    },
    resizeTextarea() {
      // method to calculate text area size 
      // console.log("***** Called RESIZE *********");
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
      // console.log("*** textareaCalcStyle: ", this.textareaCalcStyle.height);
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
      // console.log("PARENT PROPS: ", this.parentProps);
      // console.log("PROPS: ", this.$props);
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

