import _ from 'lodash';
import moment from 'moment';

let notificationTemplate = `
<div class="notification">
    <template v-if="notification.avatar">
        <img class="notification__avatar" :src="notification.avatar">
    </template>    
    <div class="notification__info">
        <h6 class="notification__category">
            New {{notification.category}}:
            <span class="notification__title">{{notification.title}}</span>
        </h6>
        <p class="notification__message">{{notification.message}}</p>
        <p class="notification__date">{{relativeTime}}</p> 
    </div>
    <template v-if="!hasCategoryIcon">
        <img class="notification__thumbnail" :src="notification.thumbnail">
    </template>
    <template v-else>
        <div class="notification__icon" :class="iconClass"></div>
    </template>        
</div>
`;

export default {
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
            default: function () {
                return {
                    Announcement: "pe-icon-bell",
                    Course: "pe-icon-close",
                    Product: "pe-icon-dropdown-arrow"
                }
            }
        },        
        notification: {
            type: Object,
            default: function () {
                return {
                    title: "Notification Title",
                    date: new Date(2017, 9, 15, 6, 10),
                    message: "This is the main message of the notification",
                    avatar: "http://placeimg.com/100/100/people",
                    thumbnail: "http://placeimg.com/640/360/tech",                                 
                    categories: ["Announcement", "Course", "Product"],
                    category: "Announcement"                
                }
            }
        },
        iconClasses: {
            type: Array,
            default: function () {
                return ["pe-icon-bell", "pe-icon-close", "pe-icon-dropdown-arrow"];
            }
        }
    },
    data: function () {
        return {}
    },
    computed: {
        iconClass: function () {
            if (!this.hasCategoryIcon) {
                return;
            }             
            return this.categoryMap[this.notification.category];
        },
        relativeTime: function () {
            // Date(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS)
            // MONTH --> 0 based. 0 == january             
            return moment(this.notification.date).fromNow(); 
        }
    },
    methods: {
    },
    mounted: function () {        
    }
}

/* 
Use moment js to compute the relativeTime (.fromNow())

ICON 
"../../../../static/images/ProEdify-Logo_FINAL_WHITE.png"

_.zipObject(['a', 'b'], [1, 2]);
*/
