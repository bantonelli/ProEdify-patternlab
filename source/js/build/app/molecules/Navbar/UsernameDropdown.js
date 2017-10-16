define(['exports', '../../atoms/Dropdown/Dropdown', '../../atoms/Dropdown/DropdownMenuItem'], function (exports, _Dropdown, _DropdownMenuItem) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Dropdown2 = _interopRequireDefault(_Dropdown);

    var _DropdownMenuItem2 = _interopRequireDefault(_DropdownMenuItem);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var usernameDropdownTemplate = '\n<dropdown\n  :label="userName"\n  :visible-arrow="false"  \n  :variation-class="\'dropdown--navbar\'"\n  :show-header="true"\n  :show-footer="true"\n  :popper-options="{placement: \'bottom\'}"\n> \n  <template slot="header">\n      <a :href="headerLink">Home</a>\n  </template>       \n  <dropdown-menu-item v-for="item in menuItems">\n    <a :href="item.link">{{item.item}}</a>\n  </dropdown-menu-item>\n  <template slot="footer">\n      <a :href="footerLink" @click="logOut">Log Out</a>\n  </template>       \n</dropdown>\n';

    exports.default = {
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
                default: function _default() {
                    return [{ item: 'Settings', link: '#' }, { item: 'Profile', link: '#' }];
                }
            }
        },

        data: function data() {
            return {
                state1: ''
            };
        },

        components: {
            'dropdown': _Dropdown2.default,
            'dropdown-menu-item': _DropdownMenuItem2.default
        },
        methods: {
            logOut: function logOut() {
                console.log("Logged out");
            }
        },
        mounted: function mounted() {}
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL1VzZXJuYW1lRHJvcGRvd24uanMiXSwibmFtZXMiOlsidXNlcm5hbWVEcm9wZG93blRlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwiY29tcG9uZW50TmFtZSIsInByb3BzIiwidXNlck5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwiZGVmYXVsdCIsImhlYWRlckxpbmsiLCJmb290ZXJMaW5rIiwibWVudUl0ZW1zIiwiQXJyYXkiLCJpdGVtIiwibGluayIsImRhdGEiLCJzdGF0ZTEiLCJjb21wb25lbnRzIiwibWV0aG9kcyIsImxvZ091dCIsImNvbnNvbGUiLCJsb2ciLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLFFBQUlBLDRpQkFBSjs7c0JBcUJlO0FBQ1hDLGNBQU0sa0JBREs7O0FBR1hDLGtCQUFVRix3QkFIQzs7QUFLWEcsdUJBQWUsa0JBTEo7O0FBT1hDLGVBQU87QUFDSEMsc0JBQVU7QUFDTkMsc0JBQU1DLE1BREE7QUFFTkMseUJBQVM7QUFGSCxhQURQO0FBS0hDLHdCQUFZO0FBQ1JILHNCQUFNQyxNQURFO0FBRVJDLHlCQUFTO0FBRkQsYUFMVDtBQVNIRSx3QkFBWTtBQUNSSixzQkFBTUMsTUFERTtBQUVSQyx5QkFBUztBQUZELGFBVFQ7QUFhSEcsdUJBQVc7QUFDUEwsc0JBQU1NLEtBREM7QUFFUEoseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FDSCxFQUFDSyxNQUFNLFVBQVAsRUFBbUJDLE1BQU0sR0FBekIsRUFERyxFQUVILEVBQUNELE1BQU0sU0FBUCxFQUFrQkMsTUFBTSxHQUF4QixFQUZHLENBQVA7QUFJSDtBQVBNO0FBYlIsU0FQSTs7QUErQlhDLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQyx3QkFBUTtBQURMLGFBQVA7QUFHSCxTQW5DVTs7QUFxQ1hDLG9CQUFZO0FBQ1IsMENBRFE7QUFFUjtBQUZRLFNBckNEO0FBeUNYQyxpQkFBUztBQUNMQyxrQkFESyxvQkFDSTtBQUNMQyx3QkFBUUMsR0FBUixDQUFZLFlBQVo7QUFDSDtBQUhJLFNBekNFO0FBOENYQyxpQkFBUyxtQkFBWSxDQUNwQjtBQS9DVSxLIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvTmF2YmFyL1VzZXJuYW1lRHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRHJvcGRvd24gZnJvbSAnLi4vLi4vYXRvbXMvRHJvcGRvd24vRHJvcGRvd24nOyBcbmltcG9ydCBEcm9wZG93bk1lbnVJdGVtIGZyb20gJy4uLy4uL2F0b21zL0Ryb3Bkb3duL0Ryb3Bkb3duTWVudUl0ZW0nOyBcblxubGV0IHVzZXJuYW1lRHJvcGRvd25UZW1wbGF0ZSA9IGBcbjxkcm9wZG93blxuICA6bGFiZWw9XCJ1c2VyTmFtZVwiXG4gIDp2aXNpYmxlLWFycm93PVwiZmFsc2VcIiAgXG4gIDp2YXJpYXRpb24tY2xhc3M9XCInZHJvcGRvd24tLW5hdmJhcidcIlxuICA6c2hvdy1oZWFkZXI9XCJ0cnVlXCJcbiAgOnNob3ctZm9vdGVyPVwidHJ1ZVwiXG4gIDpwb3BwZXItb3B0aW9ucz1cIntwbGFjZW1lbnQ6ICdib3R0b20nfVwiXG4+IFxuICA8dGVtcGxhdGUgc2xvdD1cImhlYWRlclwiPlxuICAgICAgPGEgOmhyZWY9XCJoZWFkZXJMaW5rXCI+SG9tZTwvYT5cbiAgPC90ZW1wbGF0ZT4gICAgICAgXG4gIDxkcm9wZG93bi1tZW51LWl0ZW0gdi1mb3I9XCJpdGVtIGluIG1lbnVJdGVtc1wiPlxuICAgIDxhIDpocmVmPVwiaXRlbS5saW5rXCI+e3tpdGVtLml0ZW19fTwvYT5cbiAgPC9kcm9wZG93bi1tZW51LWl0ZW0+XG4gIDx0ZW1wbGF0ZSBzbG90PVwiZm9vdGVyXCI+XG4gICAgICA8YSA6aHJlZj1cImZvb3RlckxpbmtcIiBAY2xpY2s9XCJsb2dPdXRcIj5Mb2cgT3V0PC9hPlxuICA8L3RlbXBsYXRlPiAgICAgICBcbjwvZHJvcGRvd24+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ1VzZXJuYW1lRHJvcGRvd24nLFxuXG4gICAgdGVtcGxhdGU6IHVzZXJuYW1lRHJvcGRvd25UZW1wbGF0ZSxcblxuICAgIGNvbXBvbmVudE5hbWU6ICdVc2VybmFtZURyb3Bkb3duJyxcbiAgICBcbiAgICBwcm9wczoge1xuICAgICAgICB1c2VyTmFtZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1VzZXJuYW1lJ1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXJMaW5rOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnIydcbiAgICAgICAgfSxcbiAgICAgICAgZm9vdGVyTGluazoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJyMnXG4gICAgICAgIH0sXG4gICAgICAgIG1lbnVJdGVtczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAge2l0ZW06ICdTZXR0aW5ncycsIGxpbms6ICcjJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpdGVtOiAnUHJvZmlsZScsIGxpbms6ICcjJ30sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXRlMTogJydcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdkcm9wZG93bic6IERyb3Bkb3duLFxuICAgICAgICAnZHJvcGRvd24tbWVudS1pdGVtJzogRHJvcGRvd25NZW51SXRlbVxuICAgIH0sICAgIFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgbG9nT3V0KCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgb3V0XCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7ICAgICAgICBcbiAgICB9XG59Il19
