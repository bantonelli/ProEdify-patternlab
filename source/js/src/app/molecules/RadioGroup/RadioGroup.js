import Emitter from '../../utils/mixins/emitter';

let radioGroupTemplate = `
<div class="radio-group">
  <slot></slot>
</div>
`;

export default {
  name: 'RadioGroup',

  template: radioGroupTemplate,

  componentName: 'RadioGroup',

  mixins: [Emitter],

  props: {
    value: {},
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  watch: {
    value(value) {
      this.$emit('change', value);
      this.dispatch('FormItem', 'form.change', [this.value]);
    }
  }
};


