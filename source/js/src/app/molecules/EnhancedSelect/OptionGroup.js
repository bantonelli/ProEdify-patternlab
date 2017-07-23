import Emitter from '../../utils/mixins/emitter';

let optionGroupTemplate = `
<ul class="select__group">
  <li class="select__group-title" v-show="visible">{{ label }}</li>
  <li>
    <ul class="select__group-options">
      <slot></slot>
    </ul>
  </li>
</ul>
`;

export default {
  mixins: [Emitter],

  name: 'OptionGroup',

  template: optionGroupTemplate,

  componentName: 'OptionGroup',

  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: true
    };
  },

  watch: {
    disabled(val) {
      this.broadcast('Option', 'handleGroupDisabled', val);
    }
  },

  methods: {
    queryChange() {
      this.visible = this.$children &&
        Array.isArray(this.$children) &&
        this.$children.some(option => option.visible === true);
    }
  },

  created() {
    this.$on('queryChange', this.queryChange);
  },

  mounted() {
    if (this.disabled) {
      this.broadcast('Option', 'handleGroupDisabled', this.disabled);
    }
  }
};

