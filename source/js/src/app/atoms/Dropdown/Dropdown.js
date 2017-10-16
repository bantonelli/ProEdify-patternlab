import _ from 'lodash';
import Emitter from '../../utils/mixins/emitter';
import Clickoutside from '../../utils/clickoutside';
import DropdownMenu from './DropdownMenu';

let dropdownTemplate = `
<div 
  :class="classes"  
  v-clickoutside="handleClose"
  > 
    <template v-if="label">
      <div 
        class="dropdown__label"
        ref="reference"       
      >
          {{ label }}
      </div> 
    </template>
    <template v-else>
      <div 
        class="dropdown__label"
        :class="iconClass"
        ref="reference"       
      >
      </div> 
    </template> 
    <dropdown-menu 
      @show="handleOpen"
      @hide="handleClose"      
      v-show="visible"
      :trigger="trigger"
      :visible-arrow="visibleArrow"
      :arrow-class="arrowClass"
      :boundaries-selector="boundariesSelector"
      :options="popperOptions"
    >
        <div v-if="showHeader" class="dropdown__menu-header">
            <slot name="header">
                Header
            </slot>
        </div>        
        <ul class="dropdown__menu-list">
            <slot></slot>                                
        </ul>
        <div v-if="showFooter" class="dropdown__menu-footer">
            <slot name="footer">
                Footer
            </slot>
        </div>     
    </dropdown-menu>        
</div>
`;

export default {
  mixins: [Emitter],

  name: 'Dropdown',

  template: dropdownTemplate,

  componentName: 'Dropdown',

  directives: { Clickoutside },  

  components: {
    'dropdown-menu': DropdownMenu
  },

  props: {
      trigger: {
          type: String,
          default: 'click',
          validator: value => ['click', 'hover'].indexOf(value) > -1
      },
      triggerReferenceOnly: {
        type: Boolean,
        default: true
      },
      visibleArrow: {
          type: Boolean,
          default: true
      },
      arrowClass: {
          type: String,
          default: 'dropdown__menu-arrow'
      },
      boundariesSelector: String,      
      popperOptions: {
        type: Object,
        default: function () {
          return {};
        }
      },
      label: {
        type: String, 
        default: null
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: true
      }, 
      modifierStyles: {
        type: Array, 
        default: function () {
          return [];
        }
      },
      variationClass: {
        type: String,
        default: "dropdown"        
      },
      iconClass: {
        type: String,
        default: "pe-icon-dropdown-arrow"
      }
  },

  data() {
    return {
      visible: false
    };
  },

  computed: {
    classes: function () {
      let result;
      // If there is a label provided put the iconClass on classes 
      if (this.label) {
          result = [this.variationClass, this.iconClass];
          return _.concat(result, this.modifierStyles);
      } else {
        // Otherwise put iconClass on the dropdown__label element;        
          result = [this.variationClass];
          return _.concat(result, this.modifierStyles);
      }
    }
  },

  watch: {
    visible(val) {
      // If visible is set to false         
      if (!val) {
        // Destroy Popper  
        // this.broadcast('DropdownMenu', 'destroyPopper');
      } 
      // If is visible 
      else {
        // Broadcast updatePopper event 
        // this.broadcast('DropdownMenu', 'updatePopper');
      }      
      // this.$emit('visible-change', val);
    }
  },

  methods: {
    handleClose() {
      // console.log("CALLED Clickoutside"); >> WORKED
      this.visible = false;
    },
    handleOpen() {
      this.visible = true;
    }
  },

  mounted() {
  },

  beforeDestroy() {
    if (this.$el) {
      this.broadcast('DropdownMenu', 'destroyPopper');
    }
  }
};

/*
PLAN: 
Dropdown - Parent component
    - Contains "reference" ---> DONE
    - Uses the Dropdown menu ---> DONE 
    - Determines variationClass and modifierStyles ---> DONE
    - Determines iconClass ---> DONE  
    - Determines trigger click, hover, or use reference as trigger --- DONE
    - Determines dropdown label text  
    - Dynamically loads component into menu <slot>
    
Dropdown Menu - Child     
    - Make each dropdown menu-item be similar to form-item 
      where each item can be a different class of component.
    - Should be able to have a custom header and footer as well
      - Make slots for header and footer that can be passed in. 

Dropdown Menu Item - Child 
    - <li> wrapper 
    - Default slot will be where content is passed into 
    - Check to see if it is destroyed when parent 
      menu is destroyed. --> DONE Destroyed successfully
      - Generally Only have to manually destroy if you are 
        manually mounting the component. Otherwise Vue will 
        handle it. 
        - Ok if neither are destroyed 
        - Not Ok if menu is destroyed but items aren't       


<dropdown>
  <dropdown-menu-item>
    <some-component></some-component>
  </dropdown-menu-item>
</dropdown>

 */