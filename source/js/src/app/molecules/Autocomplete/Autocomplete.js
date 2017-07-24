import Emitter from '../../utils/mixins/emitter';
import InputField from '../InputField/InputField';
import AutocompleteSuggestions from './AutocompleteSuggestions';

let autocompleteTemplate = `
<div class="autocomplete">
  <input-field
    ref="inputField"
    :value="value"
    :disabled="disabled"
    :placeholder="placeholder"
    :name="name"
    :size="size"
    :icon="icon"
    :on-icon-click="onIconClick"
    @compositionstart.native="handleComposition"
    @compositionupdate.native="handleComposition"
    @compositionend.native="handleComposition"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
    @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
    @keydown.enter.native.prevent="handleKeyEnter"
  >
    <template slot="prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="append" v-if="$slots.append">
      <slot name="append"></slot>
    </template>
  </input-field>
  <autocomplete-suggestions
    :props="props"
    :class="[popperClass ? popperClass : '']"
    ref="suggestions"
    offset="5"
    :suggestions="suggestions"
  >
  </autocomplete-suggestions>
</div>
`;

export default {
  name: 'Autocomplete',

  mixins: [Emitter],

  template: autocompleteTemplate,

  componentName: 'Autocomplete',

  components: {
    InputField,
    AutocompleteSuggestions
  },

  props: {
    props: {
      type: Object,
      default() {
        return {
          label: 'value',
          value: 'value'
        };
      }
    },
    popperClass: String,
    placeholder: String,
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    icon: String,
    onIconClick: Function
  },
  data() {
    return {
      isFocus: false,
      isOnComposition: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1
    };
  },
  computed: {
    suggestionVisible() {
      // When true the AutocompleteSuggestions component is shown 
      const suggestions = this.suggestions;
      let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      let val = (isValidData || this.loading) && this.isFocus;
      // let val = (isValidData || this.loading);
      return val;
    }
  },
  watch: {
    suggestionVisible(val) {
      // When this variable is updated send a 'visible' event 
      // to the AutocompleteSuggestions child component.
      // the child then displays itself (using the width value of the event payload).    
      this.broadcast('AutocompleteSuggestions', 'visible', [val, this.$refs.inputField.$refs.inputComponent.$el.offsetWidth]);    
    }
  },
  methods: {
    getData(queryString) {
      // Set loading state of the component 
      this.loading = true;
      this.fetchSuggestions(queryString, (suggestions) => {
        // when the suggestions are fetched run this callback and set loading to false.
        this.loading = false;
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
        } else {
          console.error('autocomplete suggestions must be an array');
        }
      });
    },
    handleComposition(event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.handleChange(this.value);
      } else {
        this.isOnComposition = true;
      }
    },
    handleChange(value) {
      this.$emit('input', value);
      if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
        this.suggestions = [];
        return;
      }
      this.getData(value);
    },
    handleFocus() {
      // console.log("AUTOCOMPLETE: CALLED HANDLE FOCUS");
      this.isFocus = true;
      if (this.triggerOnFocus) {
        this.getData(this.value);
      }
    },
    handleBlur() {
      setTimeout(_ => {
        this.isFocus = false;
      }, 100);
    },
    handleKeyEnter() {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        this.select(this.suggestions[this.highlightedIndex]);
      }
    },
    select(item) {
      this.$emit('input', item[this.props.value]);
      this.$emit('select', item);
      this.$nextTick(_ => {
        this.suggestions = [];
      });
    }
  },
  mounted() {
    this.$on('item-click', item => {
      this.select(item);
    });
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy();
  }
};


