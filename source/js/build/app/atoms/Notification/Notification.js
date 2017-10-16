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
                        category: "Announcement"
                    };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9Ob3RpZmljYXRpb24vTm90aWZpY2F0aW9uLmpzIl0sIm5hbWVzIjpbIm5vdGlmaWNhdGlvblRlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwiY29tcG9uZW50TmFtZSIsInByb3BzIiwiaGFzQ2F0ZWdvcnlJY29uIiwidHlwZSIsIkJvb2xlYW4iLCJkZWZhdWx0IiwiY2F0ZWdvcnlNYXAiLCJPYmplY3QiLCJBbm5vdW5jZW1lbnQiLCJDb3Vyc2UiLCJQcm9kdWN0Iiwibm90aWZpY2F0aW9uIiwidGl0bGUiLCJkYXRlIiwiRGF0ZSIsIm1lc3NhZ2UiLCJhdmF0YXIiLCJ0aHVtYm5haWwiLCJjYXRlZ29yeSIsImRhdGEiLCJjb21wdXRlZCIsImljb25DbGFzcyIsInJlbGF0aXZlVGltZSIsImZyb21Ob3ciLCJtZXRob2RzIiwibW91bnRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxRQUFJQSwweUJBQUo7O3NCQXNCZTtBQUNYQyxjQUFNLGNBREs7O0FBR1hDLGtCQUFVRixvQkFIQzs7QUFLWEcsdUJBQWUsY0FMSjs7QUFPWEMsZUFBTztBQUNIQyw2QkFBaUI7QUFDYkMsc0JBQU1DLE9BRE87QUFFYkMseUJBQVM7QUFGSSxhQURkO0FBS0hDLHlCQUFhO0FBQ1RILHNCQUFNSSxNQURHO0FBRVRGLHlCQUFTLG9CQUFZO0FBQ2pCLDJCQUFPO0FBQ0hHLHNDQUFjLGNBRFg7QUFFSEMsZ0NBQVEsZUFGTDtBQUdIQyxpQ0FBUztBQUhOLHFCQUFQO0FBS0g7QUFSUSxhQUxWO0FBZUhDLDBCQUFjO0FBQ1ZSLHNCQUFNSSxNQURJO0FBRVZGLHlCQUFTLG9CQUFZO0FBQ2pCLDJCQUFPO0FBQ0hPLCtCQUFPLG9CQURKO0FBRUhDLDhCQUFNLElBQUlDLElBQUosQ0FBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixFQUFsQixFQUFzQixDQUF0QixFQUF5QixFQUF6QixDQUZIO0FBR0hDLGlDQUFTLDhDQUhOO0FBSUhDLGdDQUFRLG9DQUpMO0FBS0hDLG1DQUFXLGtDQUxSO0FBTUhDLGtDQUFVO0FBTlAscUJBQVA7QUFRSDtBQVhTO0FBZlgsU0FQSTtBQW9DWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPLEVBQVA7QUFDSCxTQXRDVTtBQXVDWEMsa0JBQVU7QUFDTkMsdUJBQVcscUJBQVk7QUFDbkIsb0JBQUksQ0FBQyxLQUFLbkIsZUFBVixFQUEyQjtBQUN2QjtBQUNIO0FBQ0QsdUJBQU8sS0FBS0ksV0FBTCxDQUFpQixLQUFLSyxZQUFMLENBQWtCTyxRQUFuQyxDQUFQO0FBQ0gsYUFOSztBQU9OSSwwQkFBYyx3QkFBWTtBQUN0QjtBQUNBO0FBQ0EsdUJBQU8sc0JBQU8sS0FBS1gsWUFBTCxDQUFrQkUsSUFBekIsRUFBK0JVLE9BQS9CLEVBQVA7QUFDSDtBQVhLLFNBdkNDO0FBb0RYQyxpQkFBUyxFQXBERTtBQXNEWEMsaUJBQVMsbUJBQVksQ0FDcEI7QUF2RFUsSyIsImZpbGUiOiJhcHAvYXRvbXMvTm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmxldCBub3RpZmljYXRpb25UZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJub3RpZmljYXRpb25cIj5cbiAgICA8dGVtcGxhdGUgdi1pZj1cIm5vdGlmaWNhdGlvbi5hdmF0YXJcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cIm5vdGlmaWNhdGlvbl9fYXZhdGFyXCIgOnNyYz1cIm5vdGlmaWNhdGlvbi5hdmF0YXJcIj5cbiAgICA8L3RlbXBsYXRlPiAgICBcbiAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uX19pbmZvXCI+XG4gICAgICAgIDxoNiBjbGFzcz1cIm5vdGlmaWNhdGlvbl9fY2F0ZWdvcnlcIj5cbiAgICAgICAgICAgIE5ldyB7e25vdGlmaWNhdGlvbi5jYXRlZ29yeX19OlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJub3RpZmljYXRpb25fX3RpdGxlXCI+e3tub3RpZmljYXRpb24udGl0bGV9fTwvc3Bhbj5cbiAgICAgICAgPC9oNj5cbiAgICAgICAgPHAgY2xhc3M9XCJub3RpZmljYXRpb25fX21lc3NhZ2VcIj57e25vdGlmaWNhdGlvbi5tZXNzYWdlfX08L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibm90aWZpY2F0aW9uX19kYXRlXCI+e3tyZWxhdGl2ZVRpbWV9fTwvcD4gXG4gICAgPC9kaXY+XG4gICAgPHRlbXBsYXRlIHYtaWY9XCIhaGFzQ2F0ZWdvcnlJY29uXCI+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJub3RpZmljYXRpb25fX3RodW1ibmFpbFwiIDpzcmM9XCJub3RpZmljYXRpb24udGh1bWJuYWlsXCI+XG4gICAgPC90ZW1wbGF0ZT5cbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uX19pY29uXCIgOmNsYXNzPVwiaWNvbkNsYXNzXCI+PC9kaXY+XG4gICAgPC90ZW1wbGF0ZT4gICAgICAgIFxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ05vdGlmaWNhdGlvbicsXG5cbiAgICB0ZW1wbGF0ZTogbm90aWZpY2F0aW9uVGVtcGxhdGUsXG5cbiAgICBjb21wb25lbnROYW1lOiAnTm90aWZpY2F0aW9uJyxcbiAgICBcbiAgICBwcm9wczoge1xuICAgICAgICBoYXNDYXRlZ29yeUljb246IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGNhdGVnb3J5TWFwOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgQW5ub3VuY2VtZW50OiBcInBlLWljb24tYmVsbFwiLFxuICAgICAgICAgICAgICAgICAgICBDb3Vyc2U6IFwicGUtaWNvbi1jbG9zZVwiLFxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0OiBcInBlLWljb24tZHJvcGRvd24tYXJyb3dcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgICAgICAgIFxuICAgICAgICBub3RpZmljYXRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOb3RpZmljYXRpb24gVGl0bGVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoMjAxNywgOSwgMTUsIDYsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlzIHRoZSBtYWluIG1lc3NhZ2Ugb2YgdGhlIG5vdGlmaWNhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS8xMDAvMTAwL3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IFwiaHR0cDovL3BsYWNlaW1nLmNvbS82NDAvMzYwL3RlY2hcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJBbm5vdW5jZW1lbnRcIiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgICBpY29uQ2xhc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNDYXRlZ29yeUljb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9ICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2F0ZWdvcnlNYXBbdGhpcy5ub3RpZmljYXRpb24uY2F0ZWdvcnldO1xuICAgICAgICB9LFxuICAgICAgICByZWxhdGl2ZVRpbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIERhdGUoWUVBUiwgTU9OVEgsIERBVEUsIEhPVVJTLCBNSU5VVEVTLCBTRUNPTkRTKVxuICAgICAgICAgICAgLy8gTU9OVEggLS0+IDAgYmFzZWQuIDAgPT0gamFudWFyeSAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQodGhpcy5ub3RpZmljYXRpb24uZGF0ZSkuZnJvbU5vdygpOyBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkgeyAgICAgICAgXG4gICAgfVxufVxuXG4vKiBcblVzZSBtb21lbnQganMgdG8gY29tcHV0ZSB0aGUgcmVsYXRpdmVUaW1lICguZnJvbU5vdygpKVxuXG5JQ09OIFxuXCIuLi8uLi8uLi8uLi9zdGF0aWMvaW1hZ2VzL1Byb0VkaWZ5LUxvZ29fRklOQUxfV0hJVEUucG5nXCJcblxuXy56aXBPYmplY3QoWydhJywgJ2InXSwgWzEsIDJdKTtcbiovXG4iXX0=
