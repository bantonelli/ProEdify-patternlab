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

    var navbarTemplate = '\n<div id="navbar" class="navbar">\n    <div class="navbar__container">\n        <a class="navbar__brand" href="#">\n            <img \n                class="navbar__brand-image" \n                sizes="(max-width: 479px) 30vw, 100px" \n                src="../../../../static/images/ProEdify-Logo_FINAL_WHITE.png" \n                srcset="../../../../static/images/ProEdify-Logo_FINAL_WHITE.png 500w, ../../..images/ProEdify-Logo_FINAL_WHITE.png 800w, ../../../../static/images/ProEdify-Logo_FINAL_WHITE.png 1080w, ../../../assets/images/ProEdify-Logo_FINAL_WHITE.png 1600w, ../../../assets/images/ProEdify-Logo_FINAL_WHITE.png 2000w, ../../../../static/images/ProEdify-Logo_FINAL_WHITE.png 2438w" \n                width="1219"\n            >\n        </a>\n        <div class="navbar__search">\n            <autocomplete\n                v-model="state1"\n                :fetch-suggestions="querySearch"\n                :trigger-on-focus="false"\n                :modifier-styles="[\'input_color-white\']"\n                icon="icon-magnifying-glass"\n                placeholder="Please Input"\n                @select="handleSelect"\n            >\n            </autocomplete>          \n        </div>    \n        <template v-if="isAuthenticated">\n            <notifications\n                class="navbar__notifications"\n            >\n            </notifications>\n            <nav class="navbar__menu" role="navigation">\n                <username\n                    class="navbar__username"\n                >\n                </username>\n            </nav>\n        </template>\n        <template v-else>\n            <a class="navbar__auth-link" href="#">Sign Up</a>\n            <a class="navbar__auth-link" href="#">Log In</a>\n        </template>\n    </div>\n</div>\n';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL05hdmJhci5qcyJdLCJuYW1lcyI6WyJuYXZiYXJUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImlzQXV0aGVudGljYXRlZCIsInR5cGUiLCJCb29sZWFuIiwiZGVmYXVsdCIsImRhdGEiLCJzdGF0ZTEiLCJjb21wb25lbnRzIiwibWV0aG9kcyIsInF1ZXJ5U2VhcmNoIiwicXVlcnlTdHJpbmciLCJjYiIsImxpbmtzIiwicmVzdWx0cyIsImZpbHRlciIsImNyZWF0ZUZpbHRlciIsImxpbmsiLCJ2YWx1ZSIsImluZGV4T2YiLCJ0b0xvd2VyQ2FzZSIsImxvYWRBbGwiLCJoYW5kbGVTZWxlY3QiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsIm1vdW50ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxRQUFJQSxzeERBQUo7O0FBNENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQStCZTtBQUNYQyxjQUFNLFFBREs7O0FBR1hDLGtCQUFVRixjQUhDOztBQUtYRyx1QkFBZSxRQUxKOztBQU9YQyxlQUFPO0FBQ0pDLDZCQUFpQjtBQUNiQyxzQkFBTUMsT0FETztBQUViQyx5QkFBUztBQUZJO0FBRGIsU0FQSTtBQWFYQyxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVE7QUFETCxhQUFQO0FBR0gsU0FqQlU7QUFrQlhDLG9CQUFZO0FBQ1Isa0RBRFE7QUFFUiw0REFGUTtBQUdSO0FBSFEsU0FsQkQ7QUF1QlhDLGlCQUFTO0FBQ0xDLHVCQURLLHVCQUNPQyxXQURQLEVBQ29CQyxFQURwQixFQUN3QjtBQUN6QixvQkFBSUMsUUFBUSxLQUFLQSxLQUFqQjtBQUNBO0FBQ0Esb0JBQUlDLFVBQVVILGNBQWNFLE1BQU1FLE1BQU4sQ0FBYSxLQUFLQyxZQUFMLENBQWtCTCxXQUFsQixDQUFiLENBQWQsR0FBNkRFLEtBQTNFO0FBQ0E7QUFDQUQsbUJBQUdFLE9BQUg7QUFDSCxhQVBJO0FBUUxFLHdCQVJLLHdCQVFRTCxXQVJSLEVBUXFCO0FBQ3RCLHVCQUFPLFVBQUNNLElBQUQsRUFBVTtBQUNiLDJCQUFRQSxLQUFLQyxLQUFMLENBQVdDLE9BQVgsQ0FBbUJSLFlBQVlTLFdBQVosRUFBbkIsTUFBa0QsQ0FBMUQ7QUFDSCxpQkFGRDtBQUdILGFBWkk7QUFhTEMsbUJBYksscUJBYUs7QUFDTix1QkFBTyxDQUNILEVBQUUsU0FBUyxLQUFYLEVBQWtCLFFBQVEsOEJBQTFCLEVBREcsRUFFSCxFQUFFLFNBQVMsU0FBWCxFQUFzQixRQUFRLG9DQUE5QixFQUZHLEVBR0gsRUFBRSxTQUFTLFNBQVgsRUFBc0IsUUFBUSxvQ0FBOUIsRUFIRyxFQUlILEVBQUUsU0FBUyxTQUFYLEVBQXNCLFFBQVEsb0NBQTlCLEVBSkcsRUFLSCxFQUFFLFNBQVMsTUFBWCxFQUFtQixRQUFRLCtCQUEzQixFQUxHLEVBTUgsRUFBRSxTQUFTLFlBQVgsRUFBeUIsUUFBUSxxQ0FBakMsRUFORyxFQU9ILEVBQUUsU0FBUyxPQUFYLEVBQW9CLFFBQVEsZ0NBQTVCLEVBUEcsQ0FBUDtBQVNILGFBdkJJO0FBd0JMQyx3QkF4Qkssd0JBd0JRQyxJQXhCUixFQXdCYztBQUNmQyx3QkFBUUMsR0FBUixDQUFZRixJQUFaO0FBQ0g7QUExQkksU0F2QkU7QUFtRFhHLGlCQUFTLG1CQUFZO0FBQ2pCLGlCQUFLYixLQUFMLEdBQWEsS0FBS1EsT0FBTCxFQUFiO0FBQ0g7QUFyRFUsSyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL05hdmJhci9OYXZiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlcm5hbWVEcm9wZG93biBmcm9tICcuL1VzZXJuYW1lRHJvcGRvd24nO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnNEcm9wZG93biBmcm9tICcuL05vdGlmaWNhdGlvbnNEcm9wZG93bic7XG5cbmxldCBuYXZiYXJUZW1wbGF0ZSA9IGBcbjxkaXYgaWQ9XCJuYXZiYXJcIiBjbGFzcz1cIm5hdmJhclwiPlxuICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX2NvbnRhaW5lclwiPlxuICAgICAgICA8YSBjbGFzcz1cIm5hdmJhcl9fYnJhbmRcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdmJhcl9fYnJhbmQtaW1hZ2VcIiBcbiAgICAgICAgICAgICAgICBzaXplcz1cIihtYXgtd2lkdGg6IDQ3OXB4KSAzMHZ3LCAxMDBweFwiIFxuICAgICAgICAgICAgICAgIHNyYz1cIi4uLy4uLy4uLy4uL3N0YXRpYy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmdcIiBcbiAgICAgICAgICAgICAgICBzcmNzZXQ9XCIuLi8uLi8uLi8uLi9zdGF0aWMvaW1hZ2VzL1Byb0VkaWZ5LUxvZ29fRklOQUxfV0hJVEUucG5nIDUwMHcsIC4uLy4uLy4uaW1hZ2VzL1Byb0VkaWZ5LUxvZ29fRklOQUxfV0hJVEUucG5nIDgwMHcsIC4uLy4uLy4uLy4uL3N0YXRpYy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMTA4MHcsIC4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMTYwMHcsIC4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMjAwMHcsIC4uLy4uLy4uLy4uL3N0YXRpYy9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMjQzOHdcIiBcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjEyMTlcIlxuICAgICAgICAgICAgPlxuICAgICAgICA8L2E+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX3NlYXJjaFwiPlxuICAgICAgICAgICAgPGF1dG9jb21wbGV0ZVxuICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJzdGF0ZTFcIlxuICAgICAgICAgICAgICAgIDpmZXRjaC1zdWdnZXN0aW9ucz1cInF1ZXJ5U2VhcmNoXCJcbiAgICAgICAgICAgICAgICA6dHJpZ2dlci1vbi1mb2N1cz1cImZhbHNlXCJcbiAgICAgICAgICAgICAgICA6bW9kaWZpZXItc3R5bGVzPVwiWydpbnB1dF9jb2xvci13aGl0ZSddXCJcbiAgICAgICAgICAgICAgICBpY29uPVwiaWNvbi1tYWduaWZ5aW5nLWdsYXNzXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBsZWFzZSBJbnB1dFwiXG4gICAgICAgICAgICAgICAgQHNlbGVjdD1cImhhbmRsZVNlbGVjdFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L2F1dG9jb21wbGV0ZT4gICAgICAgICAgXG4gICAgICAgIDwvZGl2PiAgICBcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJpc0F1dGhlbnRpY2F0ZWRcIj5cbiAgICAgICAgICAgIDxub3RpZmljYXRpb25zXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuYXZiYXJfX25vdGlmaWNhdGlvbnNcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9ub3RpZmljYXRpb25zPlxuICAgICAgICAgICAgPG5hdiBjbGFzcz1cIm5hdmJhcl9fbWVudVwiIHJvbGU9XCJuYXZpZ2F0aW9uXCI+XG4gICAgICAgICAgICAgICAgPHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmF2YmFyX191c2VybmFtZVwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDwvdXNlcm5hbWU+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgPC90ZW1wbGF0ZT5cbiAgICAgICAgPHRlbXBsYXRlIHYtZWxzZT5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2YmFyX19hdXRoLWxpbmtcIiBocmVmPVwiI1wiPlNpZ24gVXA8L2E+XG4gICAgICAgICAgICA8YSBjbGFzcz1cIm5hdmJhcl9fYXV0aC1saW5rXCIgaHJlZj1cIiNcIj5Mb2cgSW48L2E+XG4gICAgICAgIDwvdGVtcGxhdGU+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbi8qXG5QTEFOOiBcbk5hdmJhciBcbiAgICAtIEhhbmRsZXMgVXNlciBOb3RpZmljYXRpb25zICBcbiAgICAtIEhhbmRsZXMgTG9nIE91dCBhbmQgTG9nIEluIEZ1bmN0aW9ucyBPUiBFdmVudHMgIFxuICAgIC0gRHluYW1pY2FsbHkgcmVuZGVyczpcbiAgICAgICAgLSBMaXN0IG9mIG5vdGlmaWNhdGlvbiBjb21wb25lbnRzICBcbiAgICAgICAgLSBVc2VybmFtZSB3aGVuIGxvZ2dlZCBpbiBcbiAgICAgICAgLSBTaWduIGluIHdoZW4gbG9nZ2VkIG91dCBcblxuTm90aWZpY2F0aW9uc0Ryb3Bkb3duXG4gICAgLSBEcm9wZG93biB0aGF0IHJlbmRlcnMgdGhlIG51bWJlciBvZiBcbiAgICAgIG5vdGlmaWNhdGlvbiBpdGVtcyB0aGF0IGl0IGhhcyBcblxuTm90aWZpY2F0aW9uIFxuICAgIC0gQSBzaW5nbGUgbm90aWZpY2F0aW9uIGl0ZW0gXG4gICAgLSBEeW5hbWljYWxseSByZW5kZXJzICduZXcnIHN0YXR1cyBpZiB1c2VyIFxuICAgICAgaGFzIG5vdCBwcmV2aW91c2x5IHNlZW4gdGhlIG5vdGlmaWNhdGlvbi5cblxuVXNlcm5hbWVEcm9wZG93biAgICBcbiAgICAtIERyb3Bkb3duIHRoYXQgaGFuZGxlcyBMb2cgT3V0IGZ1bmN0aW9uYWxpdHkgXG4gICAgLSBQcm92aWRlcyBsaW5rcyB0byBjdXJyZW50IHVzZXInczogXG4gICAgICAgIC0gc2V0dGluZ3MgcGFnZVxuICAgICAgICAtIHByb2ZpbGUgcGFnZSBcbiAgICAgICAgLSBob21lIHBhZ2UgIFxuXG4qL1xuXG5cbmltcG9ydCBBdXRvY29tcGxldGUgZnJvbSAnLi4vQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZSc7IC8vIERvbmVcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICdOYXZiYXInLFxuXG4gICAgdGVtcGxhdGU6IG5hdmJhclRlbXBsYXRlLFxuXG4gICAgY29tcG9uZW50TmFtZTogJ05hdmJhcicsXG4gICAgXG4gICAgcHJvcHM6IHtcbiAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IHtcbiAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXRlMTogJydcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAnYXV0b2NvbXBsZXRlJzogQXV0b2NvbXBsZXRlLFxuICAgICAgICAnbm90aWZpY2F0aW9ucyc6IE5vdGlmaWNhdGlvbnNEcm9wZG93bixcbiAgICAgICAgJ3VzZXJuYW1lJzogVXNlcm5hbWVEcm9wZG93blxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBxdWVyeVNlYXJjaChxdWVyeVN0cmluZywgY2IpIHtcbiAgICAgICAgICAgIHZhciBsaW5rcyA9IHRoaXMubGlua3M7XG4gICAgICAgICAgICAvLyBDYWxsIGNyZWF0ZUZpbHRlciBmb3IgZXZlcnkgbGluayAgIFxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeVN0cmluZyA/IGxpbmtzLmZpbHRlcih0aGlzLmNyZWF0ZUZpbHRlcihxdWVyeVN0cmluZykpIDogbGlua3M7XG4gICAgICAgICAgICAvLyBjYWxsIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJldHVybiBzdWdnZXN0aW9uc1xuICAgICAgICAgICAgY2IocmVzdWx0cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZUZpbHRlcihxdWVyeVN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIChsaW5rKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChsaW5rLnZhbHVlLmluZGV4T2YocXVlcnlTdHJpbmcudG9Mb3dlckNhc2UoKSkgPT09IDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZEFsbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwidnVlXCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWVcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcImVsZW1lbnRcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL0VsZW1lRkUvZWxlbWVudFwiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwiY29va2luZ1wiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vRWxlbWVGRS9jb29raW5nXCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJtaW50LXVpXCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9FbGVtZUZFL21pbnQtdWlcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcInZ1ZXhcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZXhcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcInZ1ZS1yb3V0ZXJcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS1yb3V0ZXJcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcImJhYmVsXCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbFwiIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZVNlbGVjdChpdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpbmtzID0gdGhpcy5sb2FkQWxsKCk7XG4gICAgfVxufSJdfQ==
