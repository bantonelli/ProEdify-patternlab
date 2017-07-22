<template>
  <div class="form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required
  }">
    <label :for="prop" class="form-item__label" v-bind:style="labelStyle" v-if="label">
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <div class="form-item__content" v-bind:style="contentStyle">
      <!-- The input item slots in here -->
      <slot></slot>
      <!-- The validation error message -->
      <div class="form-item__error" v-if="validateState === 'error' && showMessage && form.showMessage">{{validateMessage}}</div>
    </div>
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from '../../utils/mixins/emitter';

  function noop() {}

  function getPropByPath(obj, path) {
    // obj == model (the object that contains all form-item props)
    // path == the string of the prop to validate 
    let tempObj = obj;

    // convert indexes to properties: object[index] --> object.index
      // Replace all alphanumeric characters between brackets 
      // with a period preceding the same chars ($1)          
    path = path.replace(/\[(\w+)\]/g, '.$1');

    // Remove leading period: .stuff --> stuff
    path = path.replace(/^\./, '');

    // Create new array 
    // Each index of this array is a piece of path string 
      // when path is split at each period  
    let keyArr = path.split('.');
    let i = 0;

    for (let len = keyArr.length; i < len - 1; ++i) {
      let key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        throw new Error('please transfer a valid prop path to form item!');
      }
    }
    return {
      o: tempObj,
      k: keyArr[i],
      v: tempObj[keyArr[i]]
    };
  }

  export default {
    name: 'FormItem',

    componentName: 'FormItem',

    mixins: [emitter],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      // Error message to show for the form item
        // Updates validateMessage
      // *** NOTHING TO CHANGE
      error(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      },
      // *** NOTHING TO CHANGE      
      validateStatus(value) {
        this.validateState = value;
      }
    },
    computed: {
      // Sets up the label style for the form item dynamically (form-item__label)
      // *** NOTHING TO CHANGE   
      labelStyle() {
        var ret = {};
        if (this.form.labelPosition === 'top') return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.width = labelWidth;
        }
        return ret;
      },

      // Sets up the style for the input wrapper. (form-item__content) 
      contentStyle() {
        var ret = {};
        if (this.form.labelPosition === 'top' || this.form.inline) return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.marginLeft = labelWidth;
        }
        return ret;
      },
      // Computed prop that returns parent Form component.  
      form() {
        var parent = this.$parent;
        while (parent.$options.componentName !== 'Form') {
          parent = parent.$parent;
        }
        return parent;
      },
      // Value used to validate against. 
      fieldValue: {
        cache: false,
        get() {
          // When field value is accessed the model used here is just an alias of the parent's model. 
          var model = this.form.model;

          // If no parent and no prop property return nothing.
          // this.prop is used when there is validation            
          if (!model || !this.prop) { return; }

          // prop is the dataProp from the Vue form that should be validated by the form-item
          // set path to be this prop. (Example: "name")   
          var path = this.prop;

          // If path has a colon replace it with a . 
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }

          // Pass model (the object that contains all form-item props)
          // Pass path (the string of the prop to validate)           
          return getPropByPath(model, path).v;
        }
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isRequired: false
      };
    },
    methods: {
      validate(trigger, callback = noop) {
        var rules = this.getFilteredRule(trigger);
        if (!rules || rules.length === 0) {
          callback();
          return true;
        }

        this.validateState = 'validating';

        var descriptor = {};
        descriptor[this.prop] = rules;

        var validator = new AsyncValidator(descriptor);
        var model = {};

        model[this.prop] = this.fieldValue;

        validator.validate(model, { firstFields: true }, (errors, fields) => {
          this.validateState = !errors ? 'success' : 'error';
          this.validateMessage = errors ? errors[0].message : '';

          callback(this.validateMessage);
        });
      },
      resetField() {
        this.validateState = '';
        this.validateMessage = '';

        let model = this.form.model;
        let value = this.fieldValue;
        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        let prop = getPropByPath(model, path);

        if (Array.isArray(value)) {
          this.validateDisabled = true;
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          this.validateDisabled = true;
          prop.o[prop.k] = this.initialValue;
        }
      },
      getRules() {
        var formRules = this.form.rules;
        var selfRuels = this.rules;

        formRules = formRules ? formRules[this.prop] : [];

        return [].concat(selfRuels || formRules || []);
      },
      getFilteredRule(trigger) {
        var rules = this.getRules();

        return rules.filter(rule => {
          return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
        });
      },
      onFieldBlur() {
        this.validate('blur');
      },
      onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }

        this.validate('change');
      }
    },
    mounted() {
      if (this.prop) {
        this.dispatch('Form', 'form.addField', [this]);

        let initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        let rules = this.getRules();

        if (rules.length) {
          rules.every(rule => {
            if (rule.required) {
              this.isRequired = true;
              return false;
            }
          });
          this.$on('form.blur', this.onFieldBlur);
          this.$on('form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy() {
      this.dispatch('Form', 'form.removeField', [this]);
    }
  };
</script>

<style lang="scss">

  .form-item {
    position: relative;
    &__label {
      position: absolute;
      vertical-align: middle;
      font-size: 16px;
      padding: 12px 6px 12px 0;
    }
    &__content {
      
    }
    &__error {
      position: absolute;
      z-index: 1;
      font-size: 12px;
      color: red;
      // color: #BC61A8;
      padding: 10px 10px;
    }
  }

</style>