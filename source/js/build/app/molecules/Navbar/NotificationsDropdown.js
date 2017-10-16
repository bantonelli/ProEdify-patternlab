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

    var notificationsDropdownTemplate = '\n<dropdown\n  :visible-arrow="false"\n  :icon-class="\'pe-icon-notifications\'"\n  :variation-class="\'dropdown--navbar\'"\n  :show-header="true"\n  :show-footer="true"\n  :popper-options="{placement: \'bottom\'}"\n> \n    <template slot="header">\n        <a href="#">Notifications</a>\n    </template>       \n    <dropdown-menu-item v-for="notification in notifications">\n        <notification\n            :notification="notification"\n            :category-map="categoryMap"\n            :has-category-icon="true"\n        >\n        </notification>\n    </dropdown-menu-item>\n    <template slot="footer">\n        <a href="#">See All</a>\n    </template>       \n</dropdown>\n';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTmF2YmFyL05vdGlmaWNhdGlvbnNEcm9wZG93bi5qcyJdLCJuYW1lcyI6WyJub3RpZmljYXRpb25zRHJvcGRvd25UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsIm5vdGlmaWNhdGlvbnMiLCJ0eXBlIiwiQXJyYXkiLCJkZWZhdWx0IiwidGl0bGUiLCJkYXRlIiwiRGF0ZSIsIm1lc3NhZ2UiLCJhdmF0YXIiLCJ0aHVtYm5haWwiLCJjYXRlZ29yeSIsImRhdGEiLCJub3RpZmljYXRpb25DYXRlZ29yaWVzIiwiaWNvbkNsYXNzZXMiLCJjb21wdXRlZCIsImNhdGVnb3J5TWFwIiwiXyIsInppcE9iamVjdCIsImNvbXBvbmVudHMiLCJtZXRob2RzIiwibW91bnRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLFFBQUlBLCtzQkFBSjs7c0JBMEJlO0FBQ1hDLGNBQU0sdUJBREs7O0FBR1hDLGtCQUFVRiw2QkFIQzs7QUFLWEcsdUJBQWUsdUJBTEo7O0FBT1hDLGVBQU87QUFDSEMsMkJBQWU7QUFDWEMsc0JBQU1DLEtBREs7QUFFWEMseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FDSDtBQUNJQywrQkFBTywrQkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyxvQ0FIYjtBQUlJQyxnQ0FBUSxvQ0FKWjtBQUtJQyxtQ0FBVyxrQ0FMZjtBQU1JQyxrQ0FBVTtBQU5kLHFCQURHLEVBU0g7QUFDSU4sK0JBQU8sc0NBRFg7QUFFSUMsOEJBQU0sSUFBSUMsSUFBSixDQUFTLElBQVQsRUFBZSxDQUFmLEVBQWtCLEVBQWxCLEVBQXNCLENBQXRCLEVBQXlCLEVBQXpCLENBRlY7QUFHSUMsaUNBQVMsdUVBSGI7QUFJSUUsbUNBQVcsa0NBSmY7QUFLSUMsa0NBQVU7QUFMZCxxQkFURyxFQWdCSDtBQUNJTiwrQkFBTyxrQkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyw4Q0FIYjtBQUlJRSxtQ0FBVyxrQ0FKZjtBQUtJQyxrQ0FBVTtBQUxkLHFCQWhCRyxFQXVCSDtBQUNJTiwrQkFBTyx3QkFEWDtBQUVJQyw4QkFBTSxJQUFJQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsRUFBeUIsRUFBekIsQ0FGVjtBQUdJQyxpQ0FBUyxpRUFIYjtBQUlJRSxtQ0FBVyxrQ0FKZjtBQUtJQyxrQ0FBVTtBQUxkLHFCQXZCRyxDQUFQO0FBK0JIO0FBbENVO0FBRFosU0FQSTtBQTZDWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHdDQUF3QixDQUFDLGNBQUQsRUFBaUIsUUFBakIsRUFBMkIsU0FBM0IsQ0FEckI7QUFFSEMsNkJBQWEsQ0FBQyxjQUFELEVBQWlCLGVBQWpCLEVBQWtDLHdCQUFsQztBQUZWLGFBQVA7QUFJSCxTQWxEVTtBQW1EWEMsa0JBQVU7QUFDTkMsdUJBRE0seUJBQ1E7QUFDVix1QkFBT0MsRUFBRUMsU0FBRixDQUFZLEtBQUtMLHNCQUFqQixFQUF5QyxLQUFLQyxXQUE5QyxDQUFQO0FBQ0g7QUFISyxTQW5EQztBQXdEWEssb0JBQVk7QUFDUiwwQ0FEUTtBQUVSLDREQUZRO0FBR1I7QUFIUSxTQXhERDtBQTZEWEMsaUJBQVMsRUE3REU7QUFnRVhDLGlCQUFTLG1CQUFZLENBQ3BCO0FBakVVLEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9OYXZiYXIvTm90aWZpY2F0aW9uc0Ryb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERyb3Bkb3duIGZyb20gJy4uLy4uL2F0b21zL0Ryb3Bkb3duL0Ryb3Bkb3duJzsgXG5pbXBvcnQgRHJvcGRvd25NZW51SXRlbSBmcm9tICcuLi8uLi9hdG9tcy9Ecm9wZG93bi9Ecm9wZG93bk1lbnVJdGVtJztcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi4vLi4vYXRvbXMvTm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbic7IFxuXG5sZXQgbm90aWZpY2F0aW9uc0Ryb3Bkb3duVGVtcGxhdGUgPSBgXG48ZHJvcGRvd25cbiAgOnZpc2libGUtYXJyb3c9XCJmYWxzZVwiXG4gIDppY29uLWNsYXNzPVwiJ3BlLWljb24tbm90aWZpY2F0aW9ucydcIlxuICA6dmFyaWF0aW9uLWNsYXNzPVwiJ2Ryb3Bkb3duLS1uYXZiYXInXCJcbiAgOnNob3ctaGVhZGVyPVwidHJ1ZVwiXG4gIDpzaG93LWZvb3Rlcj1cInRydWVcIlxuICA6cG9wcGVyLW9wdGlvbnM9XCJ7cGxhY2VtZW50OiAnYm90dG9tJ31cIlxuPiBcbiAgICA8dGVtcGxhdGUgc2xvdD1cImhlYWRlclwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiPk5vdGlmaWNhdGlvbnM8L2E+XG4gICAgPC90ZW1wbGF0ZT4gICAgICAgXG4gICAgPGRyb3Bkb3duLW1lbnUtaXRlbSB2LWZvcj1cIm5vdGlmaWNhdGlvbiBpbiBub3RpZmljYXRpb25zXCI+XG4gICAgICAgIDxub3RpZmljYXRpb25cbiAgICAgICAgICAgIDpub3RpZmljYXRpb249XCJub3RpZmljYXRpb25cIlxuICAgICAgICAgICAgOmNhdGVnb3J5LW1hcD1cImNhdGVnb3J5TWFwXCJcbiAgICAgICAgICAgIDpoYXMtY2F0ZWdvcnktaWNvbj1cInRydWVcIlxuICAgICAgICA+XG4gICAgICAgIDwvbm90aWZpY2F0aW9uPlxuICAgIDwvZHJvcGRvd24tbWVudS1pdGVtPlxuICAgIDx0ZW1wbGF0ZSBzbG90PVwiZm9vdGVyXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCI+U2VlIEFsbDwvYT5cbiAgICA8L3RlbXBsYXRlPiAgICAgICBcbjwvZHJvcGRvd24+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ05vdGlmaWNhdGlvbnNEcm9wZG93bicsXG5cbiAgICB0ZW1wbGF0ZTogbm90aWZpY2F0aW9uc0Ryb3Bkb3duVGVtcGxhdGUsXG5cbiAgICBjb21wb25lbnROYW1lOiAnTm90aWZpY2F0aW9uc0Ryb3Bkb3duJyxcbiAgICBcbiAgICBwcm9wczoge1xuICAgICAgICBub3RpZmljYXRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJIdW1hbiBBbmF0b215IENvdXJzZSBMYXVuY2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoMjAxNywgOSwgMTUsIDYsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUmVnaXN0ZXIgZm9yIHRoaXMgbmV3IGNvdXJzZSBzb29uIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiBcImh0dHA6Ly9wbGFjZWltZy5jb20vMTAwLzEwMC9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbDogXCJodHRwOi8vcGxhY2VpbWcuY29tLzY0MC8zNjAvdGVjaFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJDb3Vyc2VcIiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVEVBUyBWNiBQcmFjdGljZSBUZXN0cyBOb3cgQXZhaWxhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgyMDE3LCA5LCAxNSwgNiwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcmFjdGljZSB0ZXN0cyBub3cgdXBkYXRlZCB0byB0aGUgbmV3IFRFQVMgZm9ybWF0LiBHZXQgc3RhcnRlZCBUb2RheSFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbDogXCJodHRwOi8vcGxhY2VpbWcuY29tLzY0MC8zNjAvdGVjaFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJQcm9kdWN0XCIgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZhbGwgU2FsZSBCZWdpbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMTcsIDksIDE1LCA2LCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkFsbCBDb3Vyc2UgTW9kdWxlcyBhbmQgVGVzdCBHdWlkZXMgSGFsZiBPZmYhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS82NDAvMzYwL3RlY2hcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiQW5ub3VuY2VtZW50XCIgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlByb0VkaWZ5IFNpdGUgSXMgTGl2ZSFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMTcsIDksIDE1LCA2LCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkl0J3MgRmluYWxseSBoZXJlIHRoZSBQcm9FZGlmeSBXZWIgQXBwLiBUaW1lIHRvIFN0YXJ0IFN0dWR5aW5nIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsOiBcImh0dHA6Ly9wbGFjZWltZy5jb20vNjQwLzM2MC90ZWNoXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBcIlByb2R1Y3RcIiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uQ2F0ZWdvcmllczogW1wiQW5ub3VuY2VtZW50XCIsIFwiQ291cnNlXCIsIFwiUHJvZHVjdFwiXSxcbiAgICAgICAgICAgIGljb25DbGFzc2VzOiBbXCJwZS1pY29uLWJlbGxcIiwgXCJwZS1pY29uLWNsb3NlXCIsIFwicGUtaWNvbi1kcm9wZG93bi1hcnJvd1wiXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgICBjYXRlZ29yeU1hcCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnppcE9iamVjdCh0aGlzLm5vdGlmaWNhdGlvbkNhdGVnb3JpZXMsIHRoaXMuaWNvbkNsYXNzZXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdkcm9wZG93bic6IERyb3Bkb3duLFxuICAgICAgICAnZHJvcGRvd24tbWVudS1pdGVtJzogRHJvcGRvd25NZW51SXRlbSxcbiAgICAgICAgJ25vdGlmaWNhdGlvbic6IE5vdGlmaWNhdGlvblxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuXG4gICAgfSxcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7ICAgICAgICBcbiAgICB9XG59Il19
