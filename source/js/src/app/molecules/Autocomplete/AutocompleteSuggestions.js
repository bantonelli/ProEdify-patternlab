import Popper from '../../utils/vue-popper';
import Emitter from '../../utils/mixins/emitter';

let autocompleteSuggestionsTemplate = `
<!--<transition name="el-zoom-in-top" @after-leave="doDestroy">-->
<!-- This whole component is simply an implementation of the vue-popper mixin --> 
  <div
    v-show="showPopper"
    class="autocomplete-suggestions"
    :class="{ 'is-loading': parent.loading }"
    :style="{ width: dropdownWidth }"
  >
    <!--<el-scrollbar
      tag="ul"
      wrap-class="el-autocomplete-suggestion__wrap"
      view-class="el-autocomplete-suggestion__list"
    >-->        
      <ul class="autocomplete-suggestions__wrapper">
        <template v-if="parent.loading">
          <li><i class="icon-loading"></i></li>
        </template>          
        <template v-else v-for="(item, index) in suggestions">
            <li
              v-if="!parent.customItem"
              class="autocomplete-suggestions__item"
              @click="select(item)"
            >
              {{item[props.label]}}
            </li>
            <component
              v-else
              :class="{'highlighted': parent.highlightedIndex === index}"
              @click="select(item)"
              :is="parent.customItem"
              :item="item"
              :index="index">
            </component>          
        </template>
      </ul>
    <!--</el-scrollbar>-->
  </div>
<!--</transition>-->
`;

// import ElScrollbar from '../scrollbar';

// Example CustomItem
// const customTemplate = `
//   <div>
//     <span>{{ item.value }}</span>
//     <span>{{ item.link }}</span>
//   </div>
// `;

// const customComponent = {
//   props: ['item', 'index'],
//   template: customTemplate
// }

export default {
  // components: { ElScrollbar },
  // components: {
  //   'item-link': customComponent
  // },
  mixins: [Popper, Emitter],

  name: 'AutocompleteSuggestions',

  template: autocompleteSuggestionsTemplate,

  componentName: 'AutocompleteSuggestions',

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },

  props: {
    props: Object,
    suggestions: Array,
    options: {
      default() {
        return {
          forceAbsolute: true,
          gpuAcceleration: false
        };
      }
    }
  },

  methods: {
    select(item) {
      this.dispatch('Autocomplete', 'item-click', item);
    }
  },

  updated() {
    this.$nextTick(_ => {
      this.updatePopper();
    });
  },

  mounted() {
    this.popperElm = this.$el;
    // this.referenceElm = this.$parent.$refs.inputField.$refs.inputComponent.$refs.input.$el;
    this.referenceElm = this.$parent.$refs.inputField.$refs.inputComponent.$el;
  },

  created() {
    this.$on('visible', (val, inputWidth) => {
      console.log("AUTOCOMPLETE SUGGEST: CALLED 'visible' HANDLER, VALUE: ", val, inputWidth);        
      this.dropdownWidth = inputWidth + 'px';
      this.showPopper = val;
    });
  }
};

