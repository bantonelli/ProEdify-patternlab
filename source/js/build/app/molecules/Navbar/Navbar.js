define(['exports', './UsernameDropdown', './NotificationsDropdown', '../Autocomplete/Autocomplete'], function (exports, _UsernameDropdown, _NotificationsDropdown, _Autocomplete) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _UsernameDropdown2 = _interopRequireDefault(_UsernameDropdown);

    var _NotificationsDropdown2 = _interopRequireDefault(_NotificationsDropdown);

    var _Autocomplete2 = _interopRequireDefault(_Autocomplete);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var navbarTemplate = '\n<div id="navbar" class="navbar">\n    <div class="navbar__container">\n        <a class="navbar__brand" href="#">\n            <img \n                class="navbar__brand-image" \n                sizes="(max-width: 479px) 30vw, 100px" \n                src="../../../images/ProEdify-Logo_FINAL_WHITE.png" \n                srcset="../../../images/ProEdify-Logo_FINAL_WHITE.png 500w, ../../..images/ProEdify-Logo_FINAL_WHITE.png 800w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 1080w, ../../../assets/images/ProEdify-Logo_FINAL_WHITE.png 1600w, ../../../assets/images/ProEdify-Logo_FINAL_WHITE.png 2000w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 2438w" \n                width="1219"\n            >\n        </a>\n        <div class="navbar__search">\n            <autocomplete\n                v-model="state1"\n                :fetch-suggestions="querySearch"\n                :trigger-on-focus="false"\n                :modifier-styles="[\'input_color-white\']"\n                icon="icon-magnifying-glass"\n                placeholder="Please Input"\n                @select="handleSelect"\n            >\n            </autocomplete>          \n        </div>    \n        <template v-if="isAuthenticated">\n            <notifications\n                class="navbar__notifications"\n            >\n            </notifications>\n            <nav class="navbar__menu" role="navigation">\n                <username\n                    class="navbar__username"\n                >\n                </username>\n            </nav>\n        </template>\n        <template v-else>\n            <a class="navbar__auth-link" href="#">Sign Up</a>\n            <a class="navbar__auth-link" href="#">Log In</a>\n        </template>\n    </div>\n</div>\n';

    /*
    PLAN: 
    Navbar 
        - Handles User Notifications  
        - Handles Log Out and Log In Functions OR Events  
        - Dynamically renders:
            - List of notification components  
            - Username when logged in 
            - Sign in when logged out 
    
    NotificationsDropdown
        - Dropdown that renders the number of 
          notification items that it has 
    
    Notification 
        - A single notification item 
        - Dynamically renders 'new' status if user 
          has not previously seen the notification.
    
    UsernameDropdown    
        - Dropdown that handles Log Out functionality 
        - Provides links to current user's: 
            - settings page
            - profile page 
            - home page  
    
    */

    exports.default = {
        name: 'Navbar',

        template: navbarTemplate,

        componentName: 'Navbar',

        props: {
            isAuthenticated: {
                type: Boolean,
                default: true
            }
        },
        data: function data() {
            return {
                state1: ''
            };
        },
        components: {
            'autocomplete': _Autocomplete2.default,
            'notifications': _NotificationsDropdown2.default,
            'username': _UsernameDropdown2.default
        },
        methods: {
            querySearch: function querySearch(queryString, cb) {
                var links = this.links;
                // Call createFilter for every link   
                var results = queryString ? links.filter(this.createFilter(queryString)) : links;
                // call callback function to return suggestions
                cb(results);
            },
            createFilter: function createFilter(queryString) {
                return function (link) {
                    return link.value.indexOf(queryString.toLowerCase()) === 0;
                };
            },
            loadAll: function loadAll() {
                return [{ "value": "vue", "link": "https://github.com/vuejs/vue" }, { "value": "element", "link": "https://github.com/ElemeFE/element" }, { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" }, { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" }, { "value": "vuex", "link": "https://github.com/vuejs/vuex" }, { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" }, { "value": "babel", "link": "https://github.com/babel/babel" }];
            },
            handleSelect: function handleSelect(item) {
                console.log(item);
            }
        },
        mounted: function mounted() {
            this.links = this.loadAll();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL05hdmJhci5qcyJdLCJuYW1lcyI6WyJuYXZiYXJUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImlzQXV0aGVudGljYXRlZCIsInR5cGUiLCJCb29sZWFuIiwiZGVmYXVsdCIsImRhdGEiLCJzdGF0ZTEiLCJjb21wb25lbnRzIiwibWV0aG9kcyIsInF1ZXJ5U2VhcmNoIiwicXVlcnlTdHJpbmciLCJjYiIsImxpbmtzIiwicmVzdWx0cyIsImZpbHRlciIsImNyZWF0ZUZpbHRlciIsImxpbmsiLCJ2YWx1ZSIsImluZGV4T2YiLCJ0b0xvd2VyQ2FzZSIsImxvYWRBbGwiLCJoYW5kbGVTZWxlY3QiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsIm1vdW50ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxRQUFJQSw4dURBQUo7O0FBNENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQStCZTtBQUNYQyxjQUFNLFFBREs7O0FBR1hDLGtCQUFVRixjQUhDOztBQUtYRyx1QkFBZSxRQUxKOztBQU9YQyxlQUFPO0FBQ0pDLDZCQUFpQjtBQUNiQyxzQkFBTUMsT0FETztBQUViQyx5QkFBUztBQUZJO0FBRGIsU0FQSTtBQWFYQyxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVE7QUFETCxhQUFQO0FBR0gsU0FqQlU7QUFrQlhDLG9CQUFZO0FBQ1Isa0RBRFE7QUFFUiw0REFGUTtBQUdSO0FBSFEsU0FsQkQ7QUF1QlhDLGlCQUFTO0FBQ0xDLHVCQURLLHVCQUNPQyxXQURQLEVBQ29CQyxFQURwQixFQUN3QjtBQUN6QixvQkFBSUMsUUFBUSxLQUFLQSxLQUFqQjtBQUNBO0FBQ0Esb0JBQUlDLFVBQVVILGNBQWNFLE1BQU1FLE1BQU4sQ0FBYSxLQUFLQyxZQUFMLENBQWtCTCxXQUFsQixDQUFiLENBQWQsR0FBNkRFLEtBQTNFO0FBQ0E7QUFDQUQsbUJBQUdFLE9BQUg7QUFDSCxhQVBJO0FBUUxFLHdCQVJLLHdCQVFRTCxXQVJSLEVBUXFCO0FBQ3RCLHVCQUFPLFVBQUNNLElBQUQsRUFBVTtBQUNiLDJCQUFRQSxLQUFLQyxLQUFMLENBQVdDLE9BQVgsQ0FBbUJSLFlBQVlTLFdBQVosRUFBbkIsTUFBa0QsQ0FBMUQ7QUFDSCxpQkFGRDtBQUdILGFBWkk7QUFhTEMsbUJBYksscUJBYUs7QUFDTix1QkFBTyxDQUNILEVBQUUsU0FBUyxLQUFYLEVBQWtCLFFBQVEsOEJBQTFCLEVBREcsRUFFSCxFQUFFLFNBQVMsU0FBWCxFQUFzQixRQUFRLG9DQUE5QixFQUZHLEVBR0gsRUFBRSxTQUFTLFNBQVgsRUFBc0IsUUFBUSxvQ0FBOUIsRUFIRyxFQUlILEVBQUUsU0FBUyxTQUFYLEVBQXNCLFFBQVEsb0NBQTlCLEVBSkcsRUFLSCxFQUFFLFNBQVMsTUFBWCxFQUFtQixRQUFRLCtCQUEzQixFQUxHLEVBTUgsRUFBRSxTQUFTLFlBQVgsRUFBeUIsUUFBUSxxQ0FBakMsRUFORyxFQU9ILEVBQUUsU0FBUyxPQUFYLEVBQW9CLFFBQVEsZ0NBQTVCLEVBUEcsQ0FBUDtBQVNILGFBdkJJO0FBd0JMQyx3QkF4Qkssd0JBd0JRQyxJQXhCUixFQXdCYztBQUNmQyx3QkFBUUMsR0FBUixDQUFZRixJQUFaO0FBQ0g7QUExQkksU0F2QkU7QUFtRFhHLGlCQUFTLG1CQUFZO0FBQ2pCLGlCQUFLYixLQUFMLEdBQWEsS0FBS1EsT0FBTCxFQUFiO0FBQ0g7QUFyRFUsSyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL05hdmJhci9OYXZiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlcm5hbWVEcm9wZG93biBmcm9tICcuL1VzZXJuYW1lRHJvcGRvd24nO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnNEcm9wZG93biBmcm9tICcuL05vdGlmaWNhdGlvbnNEcm9wZG93bic7XG5cbmxldCBuYXZiYXJUZW1wbGF0ZSA9IGBcbjxkaXYgaWQ9XCJuYXZiYXJcIiBjbGFzcz1cIm5hdmJhclwiPlxuICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX2NvbnRhaW5lclwiPlxuICAgICAgICA8YSBjbGFzcz1cIm5hdmJhcl9fYnJhbmRcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdmJhcl9fYnJhbmQtaW1hZ2VcIiBcbiAgICAgICAgICAgICAgICBzaXplcz1cIihtYXgtd2lkdGg6IDQ3OXB4KSAzMHZ3LCAxMDBweFwiIFxuICAgICAgICAgICAgICAgIHNyYz1cIi4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZ1wiIFxuICAgICAgICAgICAgICAgIHNyY3NldD1cIi4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZyA1MDB3LCAuLi8uLi8uLmltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZyA4MDB3LCAuLi8uLi8uLi9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMTA4MHcsIC4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMTYwMHcsIC4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMjAwMHcsIC4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZyAyNDM4d1wiIFxuICAgICAgICAgICAgICAgIHdpZHRoPVwiMTIxOVwiXG4gICAgICAgICAgICA+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9fc2VhcmNoXCI+XG4gICAgICAgICAgICA8YXV0b2NvbXBsZXRlXG4gICAgICAgICAgICAgICAgdi1tb2RlbD1cInN0YXRlMVwiXG4gICAgICAgICAgICAgICAgOmZldGNoLXN1Z2dlc3Rpb25zPVwicXVlcnlTZWFyY2hcIlxuICAgICAgICAgICAgICAgIDp0cmlnZ2VyLW9uLWZvY3VzPVwiZmFsc2VcIlxuICAgICAgICAgICAgICAgIDptb2RpZmllci1zdHlsZXM9XCJbJ2lucHV0X2NvbG9yLXdoaXRlJ11cIlxuICAgICAgICAgICAgICAgIGljb249XCJpY29uLW1hZ25pZnlpbmctZ2xhc3NcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGxlYXNlIElucHV0XCJcbiAgICAgICAgICAgICAgICBAc2VsZWN0PVwiaGFuZGxlU2VsZWN0XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvYXV0b2NvbXBsZXRlPiAgICAgICAgICBcbiAgICAgICAgPC9kaXY+ICAgIFxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImlzQXV0aGVudGljYXRlZFwiPlxuICAgICAgICAgICAgPG5vdGlmaWNhdGlvbnNcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdmJhcl9fbm90aWZpY2F0aW9uc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L25vdGlmaWNhdGlvbnM+XG4gICAgICAgICAgICA8bmF2IGNsYXNzPVwibmF2YmFyX19tZW51XCIgcm9sZT1cIm5hdmlnYXRpb25cIj5cbiAgICAgICAgICAgICAgICA8dXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuYXZiYXJfX3VzZXJuYW1lXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPC91c2VybmFtZT5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICA8L3RlbXBsYXRlPlxuICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgICAgICAgICAgPGEgY2xhc3M9XCJuYXZiYXJfX2F1dGgtbGlua1wiIGhyZWY9XCIjXCI+U2lnbiBVcDwvYT5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2YmFyX19hdXRoLWxpbmtcIiBocmVmPVwiI1wiPkxvZyBJbjwvYT5cbiAgICAgICAgPC90ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxuLypcblBMQU46IFxuTmF2YmFyIFxuICAgIC0gSGFuZGxlcyBVc2VyIE5vdGlmaWNhdGlvbnMgIFxuICAgIC0gSGFuZGxlcyBMb2cgT3V0IGFuZCBMb2cgSW4gRnVuY3Rpb25zIE9SIEV2ZW50cyAgXG4gICAgLSBEeW5hbWljYWxseSByZW5kZXJzOlxuICAgICAgICAtIExpc3Qgb2Ygbm90aWZpY2F0aW9uIGNvbXBvbmVudHMgIFxuICAgICAgICAtIFVzZXJuYW1lIHdoZW4gbG9nZ2VkIGluIFxuICAgICAgICAtIFNpZ24gaW4gd2hlbiBsb2dnZWQgb3V0IFxuXG5Ob3RpZmljYXRpb25zRHJvcGRvd25cbiAgICAtIERyb3Bkb3duIHRoYXQgcmVuZGVycyB0aGUgbnVtYmVyIG9mIFxuICAgICAgbm90aWZpY2F0aW9uIGl0ZW1zIHRoYXQgaXQgaGFzIFxuXG5Ob3RpZmljYXRpb24gXG4gICAgLSBBIHNpbmdsZSBub3RpZmljYXRpb24gaXRlbSBcbiAgICAtIER5bmFtaWNhbGx5IHJlbmRlcnMgJ25ldycgc3RhdHVzIGlmIHVzZXIgXG4gICAgICBoYXMgbm90IHByZXZpb3VzbHkgc2VlbiB0aGUgbm90aWZpY2F0aW9uLlxuXG5Vc2VybmFtZURyb3Bkb3duICAgIFxuICAgIC0gRHJvcGRvd24gdGhhdCBoYW5kbGVzIExvZyBPdXQgZnVuY3Rpb25hbGl0eSBcbiAgICAtIFByb3ZpZGVzIGxpbmtzIHRvIGN1cnJlbnQgdXNlcidzOiBcbiAgICAgICAgLSBzZXR0aW5ncyBwYWdlXG4gICAgICAgIC0gcHJvZmlsZSBwYWdlIFxuICAgICAgICAtIGhvbWUgcGFnZSAgXG5cbiovXG5cblxuaW1wb3J0IEF1dG9jb21wbGV0ZSBmcm9tICcuLi9BdXRvY29tcGxldGUvQXV0b2NvbXBsZXRlJzsgLy8gRG9uZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ05hdmJhcicsXG5cbiAgICB0ZW1wbGF0ZTogbmF2YmFyVGVtcGxhdGUsXG5cbiAgICBjb21wb25lbnROYW1lOiAnTmF2YmFyJyxcbiAgICBcbiAgICBwcm9wczoge1xuICAgICAgIGlzQXV0aGVudGljYXRlZDoge1xuICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGUxOiAnJ1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdhdXRvY29tcGxldGUnOiBBdXRvY29tcGxldGUsXG4gICAgICAgICdub3RpZmljYXRpb25zJzogTm90aWZpY2F0aW9uc0Ryb3Bkb3duLFxuICAgICAgICAndXNlcm5hbWUnOiBVc2VybmFtZURyb3Bkb3duXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIHF1ZXJ5U2VhcmNoKHF1ZXJ5U3RyaW5nLCBjYikge1xuICAgICAgICAgICAgdmFyIGxpbmtzID0gdGhpcy5saW5rcztcbiAgICAgICAgICAgIC8vIENhbGwgY3JlYXRlRmlsdGVyIGZvciBldmVyeSBsaW5rICAgXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHF1ZXJ5U3RyaW5nID8gbGlua3MuZmlsdGVyKHRoaXMuY3JlYXRlRmlsdGVyKHF1ZXJ5U3RyaW5nKSkgOiBsaW5rcztcbiAgICAgICAgICAgIC8vIGNhbGwgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgICAgICAgICBjYihyZXN1bHRzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlRmlsdGVyKHF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gKGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGxpbmsudmFsdWUuaW5kZXhPZihxdWVyeVN0cmluZy50b0xvd2VyQ2FzZSgpKSA9PT0gMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBsb2FkQWxsKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJ2dWVcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZVwiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwiZWxlbWVudFwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vRWxlbWVGRS9lbGVtZW50XCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJjb29raW5nXCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9FbGVtZUZFL2Nvb2tpbmdcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcIm1pbnQtdWlcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL0VsZW1lRkUvbWludC11aVwiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwidnVleFwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVleFwiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwidnVlLXJvdXRlclwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLXJvdXRlclwiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwiYmFiZWxcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsXCIgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlU2VsZWN0KGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlua3MgPSB0aGlzLmxvYWRBbGwoKTtcbiAgICB9XG59Il19
