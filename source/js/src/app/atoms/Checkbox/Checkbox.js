import Emitter from '../../utils/mixins/emitter';

let checkboxTemplate = `
<div 
  class="checkbox" 
  :class="[
    modifierStyles, 
    {      
      'is-disabled': disabled,
      'is-checked': isChecked,
      'is-indeterminate': indeterminate,
      'is-focus': focus
    }
  ]"
>
    <input 
      v-if="trueLabel || falseLabel"
      class="checkbox__input" 
      type="checkbox" 
      :id="id"  
      :name="name"
      :disabled="disabled"
      :true-value="trueLabel"
      :false-value="falseLabel" 
      v-model="model"   
      @change="handleChange"          
      @focus="focus = true"
      @blur="focus = false"
    >
    <input
      v-else
      class="checkbox__input"
      type="checkbox"
      :id="id" 
      :disabled="disabled"
      :value="label"
      :name="name"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >    
    <label 
      v-if="$slots.default || label"
      class="checkbox__label" 
      :for="id"
    >        
      <span>
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
    </label>
</div>
`;

export default {
  name: 'Checkbox',

  template: checkboxTemplate, 

  mixins: [Emitter],

  componentName: 'Checkbox',

  data() {
    return {
      selfModel: false,
      focus: false
    };
  },

  computed: {
    model: {
      get() {
        // If group return the store
          // Store would be the groups model array 
        return this.isGroup
          ? this.store : this.value !== undefined
          ? this.value : this.selfModel;            
      },

      set(val) {
        // Model prop is updated upon native @input of checkbox
          // it uses the groups model or its own dynamically                  

        // if using group emit input on group and let v-model 
        // handle addition or removal of :value from array.                  

        // console.log("Setting model", val);
        // gets the model of the checkbox 
        if (this.isGroup) {
          // this.model is an array if group            
          // console.log("Setting model as group");
          let isLimitExceeded = false;
          (this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (isLimitExceeded = true));

          (this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (isLimitExceeded = true));

          // if limit isn't exceeded dispatch @input to group
          // model will then be updated on group 
          // which will then propogate to the checkbox via store.  
          isLimitExceeded === false &&
          this.dispatch('CheckboxGroup', 'input', [val]);

        } else if (this.value !== undefined) {
          // If not group and doesn't have trueLabel||falseLabel
          // console.log("Setting model as single", val);
          this.$emit('input', val);
        } else {
          // If not group and has trueLabel||falseLabel
          this.selfModel = val;
        }
      }
    },

    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        // If single check model will be boolean. 
        return this.model;
      } else if (Array.isArray(this.model)) {
        // If check group model will be array including its label  
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },

    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'CheckboxGroup') {
          parent = parent.$parent;
        } else {
          this._checkboxGroup = parent;
          return true;
        }
      }
      return false;
    },

    store() {
      // Return either the groups model or the single's model. 
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    }
  },

  props: {
    id: String,
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    modifierStyles: {
      type: Array, 
      default: null
    }
  },

  methods: {
    addToStore() {
      if (
        Array.isArray(this.model) &&
        this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange(ev) {        
      if (this.isGroup) {
        this.$nextTick(_ => {
          // console.log("change update value: ", this._checkboxGroup.value);
          // Send updated group value through change event 
          // parent form will react to @change of group  
          this.dispatch('CheckboxGroup', 'change', [this._checkboxGroup.value]);
        });
      } else {
        this.$emit('change', ev);
      }
    }
  },
  
  created() {
    this.checked && this.addToStore();
  }
};

