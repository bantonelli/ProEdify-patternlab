<template>
<div 
    class="radio" 
    :class="[
      modifierStyles,
      {        
        'is-disabled': isDisabled,
        'is-checked': model === label,
        'is-focus': focus
      }
    ]"
  >
    <input 
      class="radio__input" 
      type="radio" 
      :id="id"        
      :value="label"      
      :name="name"
      :disabled="isDisabled"
      v-model="model"
      @focus="focus = true"
      @blur="focus = false"
    >
    <div class="radio__fill"></div>
    <label class="radio__label" :for="id">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
    </label>
</div>

  
</template>
<script>
  import Emitter from '../../utils/mixins/emitter';

  export default {
    name: 'Radio',

    mixins: [Emitter],

    componentName: 'Radio',

    props: {
      id: String,
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      modifierStyles: {
        type: Array, 
        default: null
      }
    },

    data() {
      return {
        focus: false
      };
    },

    computed: {
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'RadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },

      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },

        set(val) {
          if (this.isGroup) {
            this.dispatch('RadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },

      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled
          : this.disabled;
      }
    },

    // changed: function (event) {
    //     var isChecked = event.target.checked;
    //     if (isChecked) {
    //         this.$emit('input', (this.formvalue));
    //     } else {            
    //         this.$emit('input', null);
    //     }              
    // }
  };
</script>
