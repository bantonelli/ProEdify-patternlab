<template>
  <div class="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
  import Emitter from '../../utils/mixins/emitter';

  export default {
    name: 'CheckboxGroup',

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
</script>

