define(['exports', '../../atoms/Dropdown/Dropdown', '../../atoms/Dropdown/DropdownMenuItem', '../../atoms/Notification/Notification'], function (exports, _Dropdown, _DropdownMenuItem, _Notification) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Dropdown2 = _interopRequireDefault(_Dropdown);

    var _DropdownMenuItem2 = _interopRequireDefault(_DropdownMenuItem);

    var _Notification2 = _interopRequireDefault(_Notification);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var notificationsDropdownTemplate = '\n<dropdown\n  :visible-arrow="false"\n  :icon-class="\'pe-icon-notifications\'"\n  :variation-class="\'dropdown--navbar\'"\n  :show-header="true"\n  :show-footer="true"\n  :popper-options="{placement: \'auto\'}"\n> \n    <template slot="header">\n        <a href="#">Notifications</a>\n    </template>       \n    <dropdown-menu-item v-for="notification in notifications">\n        <notification\n            :notification="notification"\n            :category-map="categoryMap"\n            :has-category-icon="true"\n        >\n        </notification>\n    </dropdown-menu-item>\n    <template slot="footer">\n        <a href="#">See All</a>\n    </template>       \n</dropdown>\n';

    exports.default = {
        name: 'NotificationsDropdown',

        template: notificationsDropdownTemplate,

        componentName: 'NotificationsDropdown',

        props: {
            notifications: {
                type: Array,
                default: function _default() {
                    return [{
                        title: "Human Anatomy Course Launched",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "Register for this new course soon!",
                        avatar: "http://placeimg.com/100/100/people",
                        thumbnail: "http://placeimg.com/640/360/tech",
                        category: "Course"
                    }, {
                        title: "TEAS V6 Practice Tests Now Available",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "Practice tests now updated to the new TEAS format. Get started Today!",
                        thumbnail: "http://placeimg.com/640/360/tech",
                        category: "Product"
                    }, {
                        title: "Fall Sale Begins",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "All Course Modules and Test Guides Half Off!",
                        thumbnail: "http://placeimg.com/640/360/tech",
                        category: "Announcement"
                    }, {
                        title: "ProEdify Site Is Live!",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "It's Finally here the ProEdify Web App. Time to Start Studying!",
                        thumbnail: "http://placeimg.com/640/360/tech",
                        category: "Product"
                    }];
                }
            }
        },
        data: function data() {
            return {
                notificationCategories: ["Announcement", "Course", "Product"],
                iconClasses: ["pe-icon-bell", "pe-icon-close", "pe-icon-dropdown-arrow"]
            };
        },
        computed: {
            categoryMap: function categoryMap() {
                return _.zipObject(this.notificationCategories, this.iconClasses);
            }
        },
        components: {
            'dropdown': _Dropdown2.default,
            'dropdown-menu-item': _DropdownMenuItem2.default,
            'notification': _Notification2.default
        },
        methods: {},
        mounted: function mounted() {}
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL05vdGlmaWNhdGlvbnNEcm9wZG93bi5qcyJdLCJuYW1lcyI6WyJub3RpZmljYXRpb25zRHJvcGRvd25UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsIm5vdGlmaWNhdGlvbnMiLCJ0eXBlIiwiQXJyYXkiLCJkZWZhdWx0IiwidGl0bGUiLCJkYXRlIiwiRGF0ZSIsIm1lc3NhZ2UiLCJhdmF0YXIiLCJ0aHVtYm5haWwiLCJjYXRlZ29yeSIsImRhdGEiLCJub3RpZmljYXRpb25DYXRlZ29yaWVzIiwiaWNvbkNsYXNzZXMiLCJjb21wdXRlZCIsImNhdGVnb3J5TWFwIiwiXyIsInppcE9iamVjdCIsImNvbXBvbmVudHMiLCJtZXRob2RzIiwibW91bnRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLFFBQUlBLDZzQkFBSjs7c0JBMEJlO0FBQ1hDLGNBQU0sdUJBREs7O0FBR1hDLGtCQUFVRiw2QkFIQzs7QUFLWEcsdUJBQWUsdUJBTEo7O0FBT1hDLGVBQU87QUFDSEMsMkJBQWU7QUFDWEMsc0JBQU1DLEtBREs7QUFFWEMseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FDSDtBQUNJQywrQkFBTywrQkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyxvQ0FIYjtBQUlJQyxnQ0FBUSxvQ0FKWjtBQUtJQyxtQ0FBVyxrQ0FMZjtBQU1JQyxrQ0FBVTtBQU5kLHFCQURHLEVBU0g7QUFDSU4sK0JBQU8sc0NBRFg7QUFFSUMsOEJBQU0sSUFBSUMsSUFBSixDQUFTLElBQVQsRUFBZSxDQUFmLEVBQWtCLEVBQWxCLEVBQXNCLENBQXRCLEVBQXlCLEVBQXpCLENBRlY7QUFHSUMsaUNBQVMsdUVBSGI7QUFJSUUsbUNBQVcsa0NBSmY7QUFLSUMsa0NBQVU7QUFMZCxxQkFURyxFQWdCSDtBQUNJTiwrQkFBTyxrQkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyw4Q0FIYjtBQUlJRSxtQ0FBVyxrQ0FKZjtBQUtJQyxrQ0FBVTtBQUxkLHFCQWhCRyxFQXVCSDtBQUNJTiwrQkFBTyx3QkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyxpRUFIYjtBQUlJRSxtQ0FBVyxrQ0FKZjtBQUtJQyxrQ0FBVTtBQUxkLHFCQXZCRyxDQUFQO0FBK0JIO0FBbENVO0FBRFosU0FQSTtBQTZDWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHdDQUF3QixDQUFDLGNBQUQsRUFBaUIsUUFBakIsRUFBMkIsU0FBM0IsQ0FEckI7QUFFSEMsNkJBQWEsQ0FBQyxjQUFELEVBQWlCLGVBQWpCLEVBQWtDLHdCQUFsQztBQUZWLGFBQVA7QUFJSCxTQWxEVTtBQW1EWEMsa0JBQVU7QUFDTkMsdUJBRE0seUJBQ1E7QUFDVix1QkFBT0MsRUFBRUMsU0FBRixDQUFZLEtBQUtMLHNCQUFqQixFQUF5QyxLQUFLQyxXQUE5QyxDQUFQO0FBQ0g7QUFISyxTQW5EQztBQXdEWEssb0JBQVk7QUFDUiwwQ0FEUTtBQUVSLDREQUZRO0FBR1I7QUFIUSxTQXhERDtBQTZEWEMsaUJBQVMsRUE3REU7QUFnRVhDLGlCQUFTLG1CQUFZLENBQ3BCO0FBakVVLEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9OYXZiYXIvTm90aWZpY2F0aW9uc0Ryb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERyb3Bkb3duIGZyb20gJy4uLy4uL2F0b21zL0Ryb3Bkb3duL0Ryb3Bkb3duJzsgXG5pbXBvcnQgRHJvcGRvd25NZW51SXRlbSBmcm9tICcuLi8uLi9hdG9tcy9Ecm9wZG93bi9Ecm9wZG93bk1lbnVJdGVtJztcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi4vLi4vYXRvbXMvTm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbic7IFxuXG5sZXQgbm90aWZpY2F0aW9uc0Ryb3Bkb3duVGVtcGxhdGUgPSBgXG48ZHJvcGRvd25cbiAgOnZpc2libGUtYXJyb3c9XCJmYWxzZVwiXG4gIDppY29uLWNsYXNzPVwiJ3BlLWljb24tbm90aWZpY2F0aW9ucydcIlxuICA6dmFyaWF0aW9uLWNsYXNzPVwiJ2Ryb3Bkb3duLS1uYXZiYXInXCJcbiAgOnNob3ctaGVhZGVyPVwidHJ1ZVwiXG4gIDpzaG93LWZvb3Rlcj1cInRydWVcIlxuICA6cG9wcGVyLW9wdGlvbnM9XCJ7cGxhY2VtZW50OiAnYXV0byd9XCJcbj4gXG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJoZWFkZXJcIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIj5Ob3RpZmljYXRpb25zPC9hPlxuICAgIDwvdGVtcGxhdGU+ICAgICAgIFxuICAgIDxkcm9wZG93bi1tZW51LWl0ZW0gdi1mb3I9XCJub3RpZmljYXRpb24gaW4gbm90aWZpY2F0aW9uc1wiPlxuICAgICAgICA8bm90aWZpY2F0aW9uXG4gICAgICAgICAgICA6bm90aWZpY2F0aW9uPVwibm90aWZpY2F0aW9uXCJcbiAgICAgICAgICAgIDpjYXRlZ29yeS1tYXA9XCJjYXRlZ29yeU1hcFwiXG4gICAgICAgICAgICA6aGFzLWNhdGVnb3J5LWljb249XCJ0cnVlXCJcbiAgICAgICAgPlxuICAgICAgICA8L25vdGlmaWNhdGlvbj5cbiAgICA8L2Ryb3Bkb3duLW1lbnUtaXRlbT5cbiAgICA8dGVtcGxhdGUgc2xvdD1cImZvb3RlclwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiPlNlZSBBbGw8L2E+XG4gICAgPC90ZW1wbGF0ZT4gICAgICAgXG48L2Ryb3Bkb3duPlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICdOb3RpZmljYXRpb25zRHJvcGRvd24nLFxuXG4gICAgdGVtcGxhdGU6IG5vdGlmaWNhdGlvbnNEcm9wZG93blRlbXBsYXRlLFxuXG4gICAgY29tcG9uZW50TmFtZTogJ05vdGlmaWNhdGlvbnNEcm9wZG93bicsXG4gICAgXG4gICAgcHJvcHM6IHtcbiAgICAgICAgbm90aWZpY2F0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiSHVtYW4gQW5hdG9teSBDb3Vyc2UgTGF1bmNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMTcsIDksIDE1LCA2LCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlJlZ2lzdGVyIGZvciB0aGlzIG5ldyBjb3Vyc2Ugc29vbiFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogXCJodHRwOi8vcGxhY2VpbWcuY29tLzEwMC8xMDAvcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS82NDAvMzYwL3RlY2hcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiQ291cnNlXCIgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRFQVMgVjYgUHJhY3RpY2UgVGVzdHMgTm93IEF2YWlsYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoMjAxNywgOSwgMTUsIDYsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUHJhY3RpY2UgdGVzdHMgbm93IHVwZGF0ZWQgdG8gdGhlIG5ldyBURUFTIGZvcm1hdC4gR2V0IHN0YXJ0ZWQgVG9kYXkhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS82NDAvMzYwL3RlY2hcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiUHJvZHVjdFwiICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGYWxsIFNhbGUgQmVnaW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgyMDE3LCA5LCAxNSwgNiwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJBbGwgQ291cnNlIE1vZHVsZXMgYW5kIFRlc3QgR3VpZGVzIEhhbGYgT2ZmIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsOiBcImh0dHA6Ly9wbGFjZWltZy5jb20vNjQwLzM2MC90ZWNoXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBcIkFubm91bmNlbWVudFwiICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJQcm9FZGlmeSBTaXRlIElzIExpdmUhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgyMDE3LCA5LCAxNSwgNiwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJdCdzIEZpbmFsbHkgaGVyZSB0aGUgUHJvRWRpZnkgV2ViIEFwcC4gVGltZSB0byBTdGFydCBTdHVkeWluZyFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbDogXCJodHRwOi8vcGxhY2VpbWcuY29tLzY0MC8zNjAvdGVjaFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJQcm9kdWN0XCIgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNhdGVnb3JpZXM6IFtcIkFubm91bmNlbWVudFwiLCBcIkNvdXJzZVwiLCBcIlByb2R1Y3RcIl0sXG4gICAgICAgICAgICBpY29uQ2xhc3NlczogW1wicGUtaWNvbi1iZWxsXCIsIFwicGUtaWNvbi1jbG9zZVwiLCBcInBlLWljb24tZHJvcGRvd24tYXJyb3dcIl1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgY2F0ZWdvcnlNYXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXy56aXBPYmplY3QodGhpcy5ub3RpZmljYXRpb25DYXRlZ29yaWVzLCB0aGlzLmljb25DbGFzc2VzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAnZHJvcGRvd24nOiBEcm9wZG93bixcbiAgICAgICAgJ2Ryb3Bkb3duLW1lbnUtaXRlbSc6IERyb3Bkb3duTWVudUl0ZW0sXG4gICAgICAgICdub3RpZmljYXRpb24nOiBOb3RpZmljYXRpb25cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcblxuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkgeyAgICAgICAgXG4gICAgfVxufSJdfQ==
