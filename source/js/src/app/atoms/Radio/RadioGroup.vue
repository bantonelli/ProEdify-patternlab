<template>
  <div class="radio-group">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '../../utils/mixins/emitter';

  export default {
    name: 'RadioGroup',

    componentName: 'RadioGroup',

    mixins: [Emitter],

    props: {
      value: {},
      size: String,
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
</script>

