import Dropdown from '../../atoms/Dropdown/Dropdown'; 
import DropdownMenuItem from '../../atoms/Dropdown/DropdownMenuItem'; 

let usernameDropdownTemplate = `
<dropdown
  :label="userName"
  :visible-arrow="false"  
  :variation-class="'dropdown--navbar'"
  :show-header="true"
  :show-footer="true"
  :popper-options="{placement: 'bottom'}"
> 
  <template slot="header">
      <a :href="headerLink">Home</a>
  </template>       
  <dropdown-menu-item v-for="item in menuItems">
    <a :href="item.link">{{item.item}}</a>
  </dropdown-menu-item>
  <template slot="footer">
      <a :href="footerLink" @click="logOut">Log Out</a>
  </template>       
</dropdown>
`;

export default {
    name: 'UsernameDropdown',

    template: usernameDropdownTemplate,

    componentName: 'UsernameDropdown',
    
    props: {
        userName: {
            type: String,
            default: 'Username'
        },
        headerLink: {
            type: String,
            default: '#'
        },
        footerLink: {
            type: String,
            default: '#'
        },
        menuItems: {
            type: Array,
            default: function () {
                return [
                    {item: 'Settings', link: '#'},
                    {item: 'Profile', link: '#'},
                ]
            }
        }
    },

    data: function () {
        return {
            state1: ''
        }
    },

    components: {
        'dropdown': Dropdown,
        'dropdown-menu-item': DropdownMenuItem
    },    
    methods: {
        logOut() {
            console.log("Logged out");
        }
    },
    mounted: function () {        
    }
}