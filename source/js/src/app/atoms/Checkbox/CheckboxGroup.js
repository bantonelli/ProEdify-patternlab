import Emitter from '../../utils/mixins/emitter';

let checkboxGroupTemplate = `
<div class="checkbox-group">
  <slot></slot>
</div>
`;

export default {
  name: 'CheckboxGroup',

  template: checkboxGroupTemplate,

  componentName: 'CheckboxGroup',

  mixins: [Emitter],

  props: {
    value: {},
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },

  watch: {
    value(value) {
      // console.log("Changed group value", value);
      this.dispatch('FormItem', 'form.change', [value]);
    }
  }
};


