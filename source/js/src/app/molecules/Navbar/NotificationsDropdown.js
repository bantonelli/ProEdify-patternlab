import Dropdown from '../../atoms/Dropdown/Dropdown'; 
import DropdownMenuItem from '../../atoms/Dropdown/DropdownMenuItem';
import Notification from '../../atoms/Notification/Notification'; 

let notificationsDropdownTemplate = `
<dropdown
  :visible-arrow="false"
  :icon-class="'pe-icon-notifications'"
  :variation-class="'dropdown--navbar'"
  :show-header="true"
  :show-footer="true"
  :popper-options="{placement: 'bottom'}"
> 
    <template slot="header">
        <a href="#">Notifications</a>
    </template>       
    <dropdown-menu-item v-for="notification in notifications">
        <notification
            :notification="notification"
            :category-map="categoryMap"
            :has-category-icon="true"
        >
        </notification>
    </dropdown-menu-item>
    <template slot="footer">
        <a href="#">See All</a>
    </template>       
</dropdown>
`;

export default {
    name: 'NotificationsDropdown',

    template: notificationsDropdownTemplate,

    componentName: 'NotificationsDropdown',
    
    props: {
        notifications: {
            type: Array,
            default: function () {
                return [
                    {
                        title: "Human Anatomy Course Launched",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "Register for this new course soon!",
                        avatar: "http://placeimg.com/100/100/people",
                        thumbnail: "http://placeimg.com/640/360/tech",                                                     
                        category: "Course"                
                    },
                    {
                        title: "TEAS V6 Practice Tests Now Available",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "Practice tests now updated to the new TEAS format. Get started Today!",
                        thumbnail: "http://placeimg.com/640/360/tech",                                                     
                        category: "Product"                
                    },
                    {
                        title: "Fall Sale Begins",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "All Course Modules and Test Guides Half Off!",
                        thumbnail: "http://placeimg.com/640/360/tech",                                                     
                        category: "Announcement"                
                    },
                    {
                        title: "ProEdify Site Is Live!",
                        date: new Date(2017, 9, 15, 6, 10),
                        message: "It's Finally here the ProEdify Web App. Time to Start Studying!",
                        thumbnail: "http://placeimg.com/640/360/tech",                                                     
                        category: "Product"                
                    }
                ]
            }
        }
    },
    data: function () {
        return {
            notificationCategories: ["Announcement", "Course", "Product"],
            iconClasses: ["pe-icon-bell", "pe-icon-close", "pe-icon-dropdown-arrow"]
        }
    },
    computed: {
        categoryMap() {
            return _.zipObject(this.notificationCategories, this.iconClasses);
        }
    },
    components: {
        'dropdown': Dropdown,
        'dropdown-menu-item': DropdownMenuItem,
        'notification': Notification
    },
    methods: {

    },
    mounted: function () {        
    }
}