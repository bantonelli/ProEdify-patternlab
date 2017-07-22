<template>
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
</template>
<script>
  export default {
    name: 'Tag',
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
</script>

<style lang="scss">
  .tag {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 5px;
    font-size: 12px;
    border: 1px solid rgb(131, 131, 131);
    border-radius: 2px;
    margin: 3px 0 6px 6px;
    white-space: nowrap;
    /*&__close {

    }*/
  }
</style>
