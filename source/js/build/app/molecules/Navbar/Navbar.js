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

    var navbarTemplate = '\n<div id="navbar" class="navbar">\n    <div class="navbar__container">\n        <a class="navbar__brand" href="#">\n            <img \n                class="navbar__brand-image" \n                sizes="(max-width: 479px) 30vw, 100px" \n                src="../../../images/ProEdify-Logo_FINAL_WHITE.png" \n                srcset="../../../images/ProEdify-Logo_FINAL_WHITE.png 500w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 800w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 1080w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 1600w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 2000w, ../../../images/ProEdify-Logo_FINAL_WHITE.png 2438w" \n                width="1219"\n            >\n        </a>\n        <div class="navbar__search">\n            <autocomplete\n                v-model="state1"\n                :fetch-suggestions="querySearch"\n                :trigger-on-focus="false"\n                :modifier-styles="[\'input_color-white\']"\n                icon="icon-magnifying-glass"\n                placeholder="Please Input"\n                @select="handleSelect"\n            >\n            </autocomplete>          \n        </div>    \n        <template v-if="isAuthenticated">\n            <notifications\n                class="navbar__notifications"\n            >\n            </notifications>\n            <nav class="navbar__menu" role="navigation">\n                <username\n                    class="navbar__username"\n                >\n                </username>\n            </nav>\n        </template>\n        <template v-else>\n            <a class="navbar__auth-link" href="#">Sign Up</a>\n            <a class="navbar__auth-link" href="#">Log In</a>\n        </template>\n    </div>\n</div>\n';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL05hdmJhci5qcyJdLCJuYW1lcyI6WyJuYXZiYXJUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImlzQXV0aGVudGljYXRlZCIsInR5cGUiLCJCb29sZWFuIiwiZGVmYXVsdCIsImRhdGEiLCJzdGF0ZTEiLCJjb21wb25lbnRzIiwibWV0aG9kcyIsInF1ZXJ5U2VhcmNoIiwicXVlcnlTdHJpbmciLCJjYiIsImxpbmtzIiwicmVzdWx0cyIsImZpbHRlciIsImNyZWF0ZUZpbHRlciIsImxpbmsiLCJ2YWx1ZSIsImluZGV4T2YiLCJ0b0xvd2VyQ2FzZSIsImxvYWRBbGwiLCJoYW5kbGVTZWxlY3QiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsIm1vdW50ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxRQUFJQSxpdURBQUo7O0FBNENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQStCZTtBQUNYQyxjQUFNLFFBREs7O0FBR1hDLGtCQUFVRixjQUhDOztBQUtYRyx1QkFBZSxRQUxKOztBQU9YQyxlQUFPO0FBQ0pDLDZCQUFpQjtBQUNiQyxzQkFBTUMsT0FETztBQUViQyx5QkFBUztBQUZJO0FBRGIsU0FQSTtBQWFYQyxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVE7QUFETCxhQUFQO0FBR0gsU0FqQlU7QUFrQlhDLG9CQUFZO0FBQ1Isa0RBRFE7QUFFUiw0REFGUTtBQUdSO0FBSFEsU0FsQkQ7QUF1QlhDLGlCQUFTO0FBQ0xDLHVCQURLLHVCQUNPQyxXQURQLEVBQ29CQyxFQURwQixFQUN3QjtBQUN6QixvQkFBSUMsUUFBUSxLQUFLQSxLQUFqQjtBQUNBO0FBQ0Esb0JBQUlDLFVBQVVILGNBQWNFLE1BQU1FLE1BQU4sQ0FBYSxLQUFLQyxZQUFMLENBQWtCTCxXQUFsQixDQUFiLENBQWQsR0FBNkRFLEtBQTNFO0FBQ0E7QUFDQUQsbUJBQUdFLE9BQUg7QUFDSCxhQVBJO0FBUUxFLHdCQVJLLHdCQVFRTCxXQVJSLEVBUXFCO0FBQ3RCLHVCQUFPLFVBQUNNLElBQUQsRUFBVTtBQUNiLDJCQUFRQSxLQUFLQyxLQUFMLENBQVdDLE9BQVgsQ0FBbUJSLFlBQVlTLFdBQVosRUFBbkIsTUFBa0QsQ0FBMUQ7QUFDSCxpQkFGRDtBQUdILGFBWkk7QUFhTEMsbUJBYksscUJBYUs7QUFDTix1QkFBTyxDQUNILEVBQUUsU0FBUyxLQUFYLEVBQWtCLFFBQVEsOEJBQTFCLEVBREcsRUFFSCxFQUFFLFNBQVMsU0FBWCxFQUFzQixRQUFRLG9DQUE5QixFQUZHLEVBR0gsRUFBRSxTQUFTLFNBQVgsRUFBc0IsUUFBUSxvQ0FBOUIsRUFIRyxFQUlILEVBQUUsU0FBUyxTQUFYLEVBQXNCLFFBQVEsb0NBQTlCLEVBSkcsRUFLSCxFQUFFLFNBQVMsTUFBWCxFQUFtQixRQUFRLCtCQUEzQixFQUxHLEVBTUgsRUFBRSxTQUFTLFlBQVgsRUFBeUIsUUFBUSxxQ0FBakMsRUFORyxFQU9ILEVBQUUsU0FBUyxPQUFYLEVBQW9CLFFBQVEsZ0NBQTVCLEVBUEcsQ0FBUDtBQVNILGFBdkJJO0FBd0JMQyx3QkF4Qkssd0JBd0JRQyxJQXhCUixFQXdCYztBQUNmQyx3QkFBUUMsR0FBUixDQUFZRixJQUFaO0FBQ0g7QUExQkksU0F2QkU7QUFtRFhHLGlCQUFTLG1CQUFZO0FBQ2pCLGlCQUFLYixLQUFMLEdBQWEsS0FBS1EsT0FBTCxFQUFiO0FBQ0g7QUFyRFUsSyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL05hdmJhci9OYXZiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlcm5hbWVEcm9wZG93biBmcm9tICcuL1VzZXJuYW1lRHJvcGRvd24nO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnNEcm9wZG93biBmcm9tICcuL05vdGlmaWNhdGlvbnNEcm9wZG93bic7XG5cbmxldCBuYXZiYXJUZW1wbGF0ZSA9IGBcbjxkaXYgaWQ9XCJuYXZiYXJcIiBjbGFzcz1cIm5hdmJhclwiPlxuICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX2NvbnRhaW5lclwiPlxuICAgICAgICA8YSBjbGFzcz1cIm5hdmJhcl9fYnJhbmRcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdmJhcl9fYnJhbmQtaW1hZ2VcIiBcbiAgICAgICAgICAgICAgICBzaXplcz1cIihtYXgtd2lkdGg6IDQ3OXB4KSAzMHZ3LCAxMDBweFwiIFxuICAgICAgICAgICAgICAgIHNyYz1cIi4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZ1wiIFxuICAgICAgICAgICAgICAgIHNyY3NldD1cIi4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZyA1MDB3LCAuLi8uLi8uLi9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgODAwdywgLi4vLi4vLi4vaW1hZ2VzL1Byb0VkaWZ5LUxvZ29fRklOQUxfV0hJVEUucG5nIDEwODB3LCAuLi8uLi8uLi9pbWFnZXMvUHJvRWRpZnktTG9nb19GSU5BTF9XSElURS5wbmcgMTYwMHcsIC4uLy4uLy4uL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZyAyMDAwdywgLi4vLi4vLi4vaW1hZ2VzL1Byb0VkaWZ5LUxvZ29fRklOQUxfV0hJVEUucG5nIDI0Mzh3XCIgXG4gICAgICAgICAgICAgICAgd2lkdGg9XCIxMjE5XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgPC9hPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyX19zZWFyY2hcIj5cbiAgICAgICAgICAgIDxhdXRvY29tcGxldGVcbiAgICAgICAgICAgICAgICB2LW1vZGVsPVwic3RhdGUxXCJcbiAgICAgICAgICAgICAgICA6ZmV0Y2gtc3VnZ2VzdGlvbnM9XCJxdWVyeVNlYXJjaFwiXG4gICAgICAgICAgICAgICAgOnRyaWdnZXItb24tZm9jdXM9XCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgOm1vZGlmaWVyLXN0eWxlcz1cIlsnaW5wdXRfY29sb3Itd2hpdGUnXVwiXG4gICAgICAgICAgICAgICAgaWNvbj1cImljb24tbWFnbmlmeWluZy1nbGFzc1wiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQbGVhc2UgSW5wdXRcIlxuICAgICAgICAgICAgICAgIEBzZWxlY3Q9XCJoYW5kbGVTZWxlY3RcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9hdXRvY29tcGxldGU+ICAgICAgICAgIFxuICAgICAgICA8L2Rpdj4gICAgXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwiaXNBdXRoZW50aWNhdGVkXCI+XG4gICAgICAgICAgICA8bm90aWZpY2F0aW9uc1xuICAgICAgICAgICAgICAgIGNsYXNzPVwibmF2YmFyX19ub3RpZmljYXRpb25zXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvbm90aWZpY2F0aW9ucz5cbiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJuYXZiYXJfX21lbnVcIiByb2xlPVwibmF2aWdhdGlvblwiPlxuICAgICAgICAgICAgICAgIDx1c2VybmFtZVxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdmJhcl9fdXNlcm5hbWVcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8L3VzZXJuYW1lPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgIDwvdGVtcGxhdGU+XG4gICAgICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XG4gICAgICAgICAgICA8YSBjbGFzcz1cIm5hdmJhcl9fYXV0aC1saW5rXCIgaHJlZj1cIiNcIj5TaWduIFVwPC9hPlxuICAgICAgICAgICAgPGEgY2xhc3M9XCJuYXZiYXJfX2F1dGgtbGlua1wiIGhyZWY9XCIjXCI+TG9nIEluPC9hPlxuICAgICAgICA8L3RlbXBsYXRlPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG4vKlxuUExBTjogXG5OYXZiYXIgXG4gICAgLSBIYW5kbGVzIFVzZXIgTm90aWZpY2F0aW9ucyAgXG4gICAgLSBIYW5kbGVzIExvZyBPdXQgYW5kIExvZyBJbiBGdW5jdGlvbnMgT1IgRXZlbnRzICBcbiAgICAtIER5bmFtaWNhbGx5IHJlbmRlcnM6XG4gICAgICAgIC0gTGlzdCBvZiBub3RpZmljYXRpb24gY29tcG9uZW50cyAgXG4gICAgICAgIC0gVXNlcm5hbWUgd2hlbiBsb2dnZWQgaW4gXG4gICAgICAgIC0gU2lnbiBpbiB3aGVuIGxvZ2dlZCBvdXQgXG5cbk5vdGlmaWNhdGlvbnNEcm9wZG93blxuICAgIC0gRHJvcGRvd24gdGhhdCByZW5kZXJzIHRoZSBudW1iZXIgb2YgXG4gICAgICBub3RpZmljYXRpb24gaXRlbXMgdGhhdCBpdCBoYXMgXG5cbk5vdGlmaWNhdGlvbiBcbiAgICAtIEEgc2luZ2xlIG5vdGlmaWNhdGlvbiBpdGVtIFxuICAgIC0gRHluYW1pY2FsbHkgcmVuZGVycyAnbmV3JyBzdGF0dXMgaWYgdXNlciBcbiAgICAgIGhhcyBub3QgcHJldmlvdXNseSBzZWVuIHRoZSBub3RpZmljYXRpb24uXG5cblVzZXJuYW1lRHJvcGRvd24gICAgXG4gICAgLSBEcm9wZG93biB0aGF0IGhhbmRsZXMgTG9nIE91dCBmdW5jdGlvbmFsaXR5IFxuICAgIC0gUHJvdmlkZXMgbGlua3MgdG8gY3VycmVudCB1c2VyJ3M6IFxuICAgICAgICAtIHNldHRpbmdzIHBhZ2VcbiAgICAgICAgLSBwcm9maWxlIHBhZ2UgXG4gICAgICAgIC0gaG9tZSBwYWdlICBcblxuKi9cblxuXG5pbXBvcnQgQXV0b2NvbXBsZXRlIGZyb20gJy4uL0F1dG9jb21wbGV0ZS9BdXRvY29tcGxldGUnOyAvLyBEb25lXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAnTmF2YmFyJyxcblxuICAgIHRlbXBsYXRlOiBuYXZiYXJUZW1wbGF0ZSxcblxuICAgIGNvbXBvbmVudE5hbWU6ICdOYXZiYXInLFxuICAgIFxuICAgIHByb3BzOiB7XG4gICAgICAgaXNBdXRoZW50aWNhdGVkOiB7XG4gICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0ZTE6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ2F1dG9jb21wbGV0ZSc6IEF1dG9jb21wbGV0ZSxcbiAgICAgICAgJ25vdGlmaWNhdGlvbnMnOiBOb3RpZmljYXRpb25zRHJvcGRvd24sXG4gICAgICAgICd1c2VybmFtZSc6IFVzZXJuYW1lRHJvcGRvd25cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgcXVlcnlTZWFyY2gocXVlcnlTdHJpbmcsIGNiKSB7XG4gICAgICAgICAgICB2YXIgbGlua3MgPSB0aGlzLmxpbmtzO1xuICAgICAgICAgICAgLy8gQ2FsbCBjcmVhdGVGaWx0ZXIgZm9yIGV2ZXJ5IGxpbmsgICBcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gcXVlcnlTdHJpbmcgPyBsaW5rcy5maWx0ZXIodGhpcy5jcmVhdGVGaWx0ZXIocXVlcnlTdHJpbmcpKSA6IGxpbmtzO1xuICAgICAgICAgICAgLy8gY2FsbCBjYWxsYmFjayBmdW5jdGlvbiB0byByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgICAgICAgICAgIGNiKHJlc3VsdHMpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVGaWx0ZXIocXVlcnlTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAobGluay52YWx1ZS5pbmRleE9mKHF1ZXJ5U3RyaW5nLnRvTG93ZXJDYXNlKCkpID09PSAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRBbGwoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcInZ1ZVwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlXCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJlbGVtZW50XCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9FbGVtZUZFL2VsZW1lbnRcIiB9LFxuICAgICAgICAgICAgICAgIHsgXCJ2YWx1ZVwiOiBcImNvb2tpbmdcIiwgXCJsaW5rXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL0VsZW1lRkUvY29va2luZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBcInZhbHVlXCI6IFwibWludC11aVwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vRWxlbWVGRS9taW50LXVpXCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJ2dWV4XCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWV4XCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJ2dWUtcm91dGVyXCIsIFwibGlua1wiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWUtcm91dGVyXCIgfSxcbiAgICAgICAgICAgICAgICB7IFwidmFsdWVcIjogXCJiYWJlbFwiLCBcImxpbmtcIjogXCJodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWxcIiB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVTZWxlY3QoaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saW5rcyA9IHRoaXMubG9hZEFsbCgpO1xuICAgIH1cbn0iXX0=
