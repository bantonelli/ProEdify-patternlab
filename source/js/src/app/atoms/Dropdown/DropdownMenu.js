// import Popper from '../../utils/vue-popper';
import Popper from '../../utils/vue-popper2';

let dropdownMenuTemplate = `
<div class="dropdown__menu" @click="menuClick">
    <slot></slot>    
</div>
`;

export default {
  name: 'DropdownMenu',

  template: dropdownMenuTemplate,

  componentName: 'DropdownMenu',

  mixins: [Popper],

  data() {
    return {
    };
  },

  computed: {
  },

  watch: {
  },

  methods: {
    menuClick(e) {
        if (this.$parent.triggerReferenceOnly) {
            this.stopProp(e);
        }
    },
    stopProp(e) {
      console.log("STOP PROP");
      e.stopPropagation();
    }
  },

  mounted() {
    // this.referenceElm = this.$parent.$refs.reference.$el;
    // this.$parent.popperElm = this.popperElm = this.$el;
    // console.log("Reference Element Mounted", this.$parent.$refs);
    // this.referenceElm = this.$parent.$refs.reference.$el; OLD vue-popper     
    // this.$parent.popperElm = this.popperElm = this.$el; OLD vue-popper


    // // updatePopper event comes from Enhanced Select
    // this.$on('updatePopper', this.updatePopper());

    // // destroyPopper event comes from Enhanced Select
    // this.$on('destroyPopper', this.doDestroy());

    // console.log(this.$parent);
  },

  beforeDestroy() {
    console.log("DROPDOWN MENU DESTROYED");
  }
};
