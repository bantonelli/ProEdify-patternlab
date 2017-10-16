define(['exports', 'lodash', 'moment'], function (exports, _lodash, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _lodash2 = _interopRequireDefault(_lodash);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var notificationTemplate = '\n<div class="notification">\n    <template v-if="notification.avatar">\n        <img class="notification__avatar" :src="notification.avatar">\n    </template>    \n    <div class="notification__info">\n        <h6 class="notification__category">\n            New {{notification.category}}:\n            <span class="notification__title">{{notification.title}}</span>\n        </h6>\n        <p class="notification__message">{{notification.message}}</p>\n        <p class="notification__date">{{relativeTime}}</p> \n    </div>\n    <template v-if="!hasCategoryIcon">\n        <img class="notification__thumbnail" :src="notification.thumbnail">\n    </template>\n    <template v-else>\n        <div class="notification__icon" :class="iconClass"></div>\n    </template>        \n</div>\n';

    exports.default = {
        name: 'Notification',

        template: notificationTemplate,

        componentName: 'Notification',

        props: {
            hasCategoryIcon: {
                type: Boolean,
                default: true
            },
            categoryMap: {
                type: Object,
                default: function _default() {
                    return {
                        Announcement: "pe-icon-bell",
                        Course: "pe-icon-close",
                        Product: "pe-icon-dropdown-arrow"
                    };
                }
            },
            notification: {
                type: Object,
                default: function _default() {
                    return {
                        title: "Notification Title",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "This is the main message of the notification",
                        avatar: "http://placeimg.com/100/100/people",
                        thumbnail: "http://placeimg.com/640/360/tech",
                        categories: ["Announcement", "Course", "Product"],
                        category: "Announcement"
                    };
                }
            },
            iconClasses: {
                type: Array,
                default: function _default() {
                    return ["pe-icon-bell", "pe-icon-close", "pe-icon-dropdown-arrow"];
                }
            }
        },
        data: function data() {
            return {};
        },
        computed: {
            iconClass: function iconClass() {
                if (!this.hasCategoryIcon) {
                    return;
                }
                return this.categoryMap[this.notification.category];
            },
            relativeTime: function relativeTime() {
                // Date(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS)
                // MONTH --> 0 based. 0 == january             
                return (0, _moment2.default)(this.notification.date).fromNow();
            }
        },
        methods: {},
        mounted: function mounted() {}
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9Ob3RpZmljYXRpb24vTm90aWZpY2F0aW9uLmpzIl0sIm5hbWVzIjpbIm5vdGlmaWNhdGlvblRlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwiY29tcG9uZW50TmFtZSIsInByb3BzIiwiaGFzQ2F0ZWdvcnlJY29uIiwidHlwZSIsIkJvb2xlYW4iLCJkZWZhdWx0IiwiY2F0ZWdvcnlNYXAiLCJPYmplY3QiLCJBbm5vdW5jZW1lbnQiLCJDb3Vyc2UiLCJQcm9kdWN0Iiwibm90aWZpY2F0aW9uIiwidGl0bGUiLCJkYXRlIiwiRGF0ZSIsIm1lc3NhZ2UiLCJhdmF0YXIiLCJ0aHVtYm5haWwiLCJjYXRlZ29yaWVzIiwiY2F0ZWdvcnkiLCJpY29uQ2xhc3NlcyIsIkFycmF5IiwiZGF0YSIsImNvbXB1dGVkIiwiaWNvbkNsYXNzIiwicmVsYXRpdmVUaW1lIiwiZnJvbU5vdyIsIm1ldGhvZHMiLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLFFBQUlBLDB5QkFBSjs7c0JBc0JlO0FBQ1hDLGNBQU0sY0FESzs7QUFHWEMsa0JBQVVGLG9CQUhDOztBQUtYRyx1QkFBZSxjQUxKOztBQU9YQyxlQUFPO0FBQ0hDLDZCQUFpQjtBQUNiQyxzQkFBTUMsT0FETztBQUViQyx5QkFBUztBQUZJLGFBRGQ7QUFLSEMseUJBQWE7QUFDVEgsc0JBQU1JLE1BREc7QUFFVEYseUJBQVMsb0JBQVk7QUFDakIsMkJBQU87QUFDSEcsc0NBQWMsY0FEWDtBQUVIQyxnQ0FBUSxlQUZMO0FBR0hDLGlDQUFTO0FBSE4scUJBQVA7QUFLSDtBQVJRLGFBTFY7QUFlSEMsMEJBQWM7QUFDVlIsc0JBQU1JLE1BREk7QUFFVkYseUJBQVMsb0JBQVk7QUFDakIsMkJBQU87QUFDSE8sK0JBQU8sb0JBREo7QUFFSEMsOEJBQU0sSUFBSUMsSUFBSixDQUFTLElBQVQsRUFBZSxDQUFmLEVBQWtCLEVBQWxCLEVBQXNCLENBQXRCLEVBQXlCLEVBQXpCLENBRkg7QUFHSEMsaUNBQVMsOENBSE47QUFJSEMsZ0NBQVEsb0NBSkw7QUFLSEMsbUNBQVcsa0NBTFI7QUFNSEMsb0NBQVksQ0FBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLFNBQTNCLENBTlQ7QUFPSEMsa0NBQVU7QUFQUCxxQkFBUDtBQVNIO0FBWlMsYUFmWDtBQTZCSEMseUJBQWE7QUFDVGpCLHNCQUFNa0IsS0FERztBQUVUaEIseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FBQyxjQUFELEVBQWlCLGVBQWpCLEVBQWtDLHdCQUFsQyxDQUFQO0FBQ0g7QUFKUTtBQTdCVixTQVBJO0FBMkNYaUIsY0FBTSxnQkFBWTtBQUNkLG1CQUFPLEVBQVA7QUFDSCxTQTdDVTtBQThDWEMsa0JBQVU7QUFDTkMsdUJBQVcscUJBQVk7QUFDbkIsb0JBQUksQ0FBQyxLQUFLdEIsZUFBVixFQUEyQjtBQUN2QjtBQUNIO0FBQ0QsdUJBQU8sS0FBS0ksV0FBTCxDQUFpQixLQUFLSyxZQUFMLENBQWtCUSxRQUFuQyxDQUFQO0FBQ0gsYUFOSztBQU9OTSwwQkFBYyx3QkFBWTtBQUN0QjtBQUNBO0FBQ0EsdUJBQU8sc0JBQU8sS0FBS2QsWUFBTCxDQUFrQkUsSUFBekIsRUFBK0JhLE9BQS9CLEVBQVA7QUFDSDtBQVhLLFNBOUNDO0FBMkRYQyxpQkFBUyxFQTNERTtBQTZEWEMsaUJBQVMsbUJBQVksQ0FDcEI7QUE5RFUsSyIsImZpbGUiOiJhcHAvYXRvbXMvTm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmxldCBub3RpZmljYXRpb25UZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJub3RpZmljYXRpb25cIj5cbiAgICA8dGVtcGxhdGUgdi1pZj1cIm5vdGlmaWNhdGlvbi5hdmF0YXJcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cIm5vdGlmaWNhdGlvbl9fYXZhdGFyXCIgOnNyYz1cIm5vdGlmaWNhdGlvbi5hdmF0YXJcIj5cbiAgICA8L3RlbXBsYXRlPiAgICBcbiAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uX19pbmZvXCI+XG4gICAgICAgIDxoNiBjbGFzcz1cIm5vdGlmaWNhdGlvbl9fY2F0ZWdvcnlcIj5cbiAgICAgICAgICAgIE5ldyB7e25vdGlmaWNhdGlvbi5jYXRlZ29yeX19OlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJub3RpZmljYXRpb25fX3RpdGxlXCI+e3tub3RpZmljYXRpb24udGl0bGV9fTwvc3Bhbj5cbiAgICAgICAgPC9oNj5cbiAgICAgICAgPHAgY2xhc3M9XCJub3RpZmljYXRpb25fX21lc3NhZ2VcIj57e25vdGlmaWNhdGlvbi5tZXNzYWdlfX08L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibm90aWZpY2F0aW9uX19kYXRlXCI+e3tyZWxhdGl2ZVRpbWV9fTwvcD4gXG4gICAgPC9kaXY+XG4gICAgPHRlbXBsYXRlIHYtaWY9XCIhaGFzQ2F0ZWdvcnlJY29uXCI+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJub3RpZmljYXRpb25fX3RodW1ibmFpbFwiIDpzcmM9XCJub3RpZmljYXRpb24udGh1bWJuYWlsXCI+XG4gICAgPC90ZW1wbGF0ZT5cbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uX19pY29uXCIgOmNsYXNzPVwiaWNvbkNsYXNzXCI+PC9kaXY+XG4gICAgPC90ZW1wbGF0ZT4gICAgICAgIFxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ05vdGlmaWNhdGlvbicsXG5cbiAgICB0ZW1wbGF0ZTogbm90aWZpY2F0aW9uVGVtcGxhdGUsXG5cbiAgICBjb21wb25lbnROYW1lOiAnTm90aWZpY2F0aW9uJyxcbiAgICBcbiAgICBwcm9wczoge1xuICAgICAgICBoYXNDYXRlZ29yeUljb246IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGNhdGVnb3J5TWFwOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgQW5ub3VuY2VtZW50OiBcInBlLWljb24tYmVsbFwiLFxuICAgICAgICAgICAgICAgICAgICBDb3Vyc2U6IFwicGUtaWNvbi1jbG9zZVwiLFxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0OiBcInBlLWljb24tZHJvcGRvd24tYXJyb3dcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgICAgICAgIFxuICAgICAgICBub3RpZmljYXRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOb3RpZmljYXRpb24gVGl0bGVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoMjAxNywgOSwgMTUsIDYsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlzIHRoZSBtYWluIG1lc3NhZ2Ugb2YgdGhlIG5vdGlmaWNhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS8xMDAvMTAwL3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS82NDAvMzYwL3RlY2hcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogW1wiQW5ub3VuY2VtZW50XCIsIFwiQ291cnNlXCIsIFwiUHJvZHVjdFwiXSxcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiQW5ub3VuY2VtZW50XCIgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpY29uQ2xhc3Nlczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcInBlLWljb24tYmVsbFwiLCBcInBlLWljb24tY2xvc2VcIiwgXCJwZS1pY29uLWRyb3Bkb3duLWFycm93XCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgaWNvbkNsYXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzQ2F0ZWdvcnlJY29uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhdGVnb3J5TWFwW3RoaXMubm90aWZpY2F0aW9uLmNhdGVnb3J5XTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVsYXRpdmVUaW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBEYXRlKFlFQVIsIE1PTlRILCBEQVRFLCBIT1VSUywgTUlOVVRFUywgU0VDT05EUylcbiAgICAgICAgICAgIC8vIE1PTlRIIC0tPiAwIGJhc2VkLiAwID09IGphbnVhcnkgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KHRoaXMubm90aWZpY2F0aW9uLmRhdGUpLmZyb21Ob3coKTsgXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICB9LFxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHsgICAgICAgIFxuICAgIH1cbn1cblxuLyogXG5Vc2UgbW9tZW50IGpzIHRvIGNvbXB1dGUgdGhlIHJlbGF0aXZlVGltZSAoLmZyb21Ob3coKSlcblxuSUNPTiBcblwiLi4vLi4vLi4vLi4vc3RhdGljL2ltYWdlcy9Qcm9FZGlmeS1Mb2dvX0ZJTkFMX1dISVRFLnBuZ1wiXG5cbl8uemlwT2JqZWN0KFsnYScsICdiJ10sIFsxLCAyXSk7XG4qL1xuIl19
