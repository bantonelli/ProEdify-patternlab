import emitter from '../../utils/mixins/emitter';

let dropdownMenuItemTemplate = `
<li class="dropdown__menu-item"
    :class="{}"
    >
    <slot></slot>
</li>
`;

export default {
  name: 'DropdownMenuItem',

  template: dropdownMenuItemTemplate,

  componentName: 'DropdownMenuItem',

  mixins: [emitter],

  props: {
  },
  watch: {
  },
  computed: {
    // Computed prop that returns parent Form component.  
    form() {
      var parent = this.$parent;
      while (parent.$options.componentName !== 'Form') {
        parent = parent.$parent;
      }
      return parent;
    }
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy() {
    console.log("DROPDOWN ITEM DESTROYED");
  }
};
