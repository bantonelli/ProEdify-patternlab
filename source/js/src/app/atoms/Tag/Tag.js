let tagTemplate = `
<transition :name="closeTransition ? '' : 'el-zoom-in-center'">
  <span
    class="tag"
    :class="[modifierStyles, {'is-hit': hit}]">
    <slot></slot>
    <i class="tag__close icon-close"
      v-if="closable"
      @click="handleClose"></i>
  </span>
</transition>
`;

export default {
  name: 'Tag',

  template: tagTemplate,

  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    closeTransition: Boolean,
    color: String,
    modifierStyles: {
      type: Array, 
      default: null
    }
  },
  methods: {
    handleClose(event) {
      this.$emit('close', event);
    }
  }
};


