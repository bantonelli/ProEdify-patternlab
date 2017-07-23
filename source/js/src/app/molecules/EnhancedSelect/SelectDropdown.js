import Popper from '../../utils/vue-popper';

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

  props: {
    placement: {
      default: 'bottom-start'
    },

    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default() {
        return {
          forceAbsolute: true,
          gpuAcceleration: false
        };
      }
    }
  },

  data() {
    return {
      minWidth: ''
    };
  },

  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },

  watch: {
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },

  mounted() {
    // this.referenceElm = this.$parent.$refs.reference.$el;
    // this.$parent.popperElm = this.popperElm = this.$el;
    console.log("Reference Element Mounted", this.$parent.$refs);
    this.referenceElm = this.$parent.$refs.reference.$el;      
    this.$parent.popperElm = this.popperElm = this.$el;

    this.$on('updatePopper', () => {
      if (this.$parent.visible) this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  }
};
