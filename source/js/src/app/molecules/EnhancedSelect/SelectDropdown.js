// import Popper from '../../utils/vue-popper';
import Popper from '../../utils/vue-popper2';

let selectDropdownTemplate = `
<div
  class="select__dropdown"
  :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
  :style="{ minWidth: minWidth }">
  <slot></slot>
</div>
`;

export default {
  name: 'SelectDropdown',

  template: selectDropdownTemplate,

  componentName: 'SelectDropdown',

  mixins: [Popper],

  // Need for new popper
  data() {
    return {
      minWidth: ''
    };
  },

  // Need for new popper 
  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },

  // Need for new popper
  watch: {
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },

  mounted() {
    // this.referenceElm = this.$parent.$refs.reference.$el;
    // this.$parent.popperElm = this.popperElm = this.$el;
    // console.log("Reference Element Mounted", this.$parent.$refs);
    // this.referenceElm = this.$parent.$refs.reference.$el; OLD vue-popper     
    // this.$parent.popperElm = this.popperElm = this.$el; OLD vue-popper


    // updatePopper event comes from Enhanced Select
    this.$on('updatePopper', () => {
      if (this.$parent.visible) this.updatePopper();
    });

    // destroyPopper event comes from Enhanced Select
    this.$on('destroyPopper', this.doDestroy());
  }
};
