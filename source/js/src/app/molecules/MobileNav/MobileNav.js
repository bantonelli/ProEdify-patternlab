let mobileNavTemplate = `
<div id="mobile-nav" class="mobile-nav" :class="{'is-open': isOpen}"> 
    <template v-if="$router">
        <div class="mobile-nav__button" @click="openMenu"> 
            <span :class="[isOpen ? closeIcon: menuIcon]"></span>
        </div>
        <div class="mobile-nav__bar" :class="{'is-open': isOpen}">
            <div class="mobile-nav__menu">
                <a class="mobile-nav__menu-heading" href="">Really Long Username</a>
                <ul class="mobile-nav__menu-list"> 
                    <li class="mobile-nav__menu-item" v-for="link in links" :key="link.text">
                        <router-link :to="link" class="mobile-nav__menu-link">{{ link.name }}</router-link>
                    </li>                
                </ul>
            </div>
        </div>
        <slot></slot>
    </template>
    <template v-else>
        <div class="mobile-nav__button" @click="openMenu"> 
        <span :class="[isOpen ? closeIcon: menuIcon]"></span>
        </div>
        <div class="mobile-nav__bar" :class="{'is-open': isOpen}">
            <div class="mobile-nav__menu">
                <a class="mobile-nav__menu-heading" href="">Really Long Username</a>
                <ul class="mobile-nav__menu-list"> 
                    <li class="mobile-nav__menu-item" v-for="link in links" :key="link.text">
                        <a :href="link.url" class="mobile-nav__menu-link">{{ link.text }}</a>
                    </li>                
                </ul>
            </div>
        </div>
        <slot></slot>
    </template>
</div>
`;


export default {
    name: 'MobileNav',
    template: mobileNavTemplate,
    componentName: 'MobileNav',
    props: {
       closeIcon: {
           type: String,
           default: 'pe-icon-close'
       },
       menuIcon: {
           type: String,
           default: 'pe-icon-hamburger'
       },
       links: {
           type: Array,
           default: function () {
               return [
                    {text: "Home", url: "#"},
                    {text: "Video Library", url: "#"},
                    {text: "Account Settings", url: "#"},
                    {text: "Profile", url: "#"},
                    {text: "Log Out", url: "#"}
                ];
           }
       }
    },
    data: function () {
        return {
            isOpen: false
        }
    },
    methods: {
        openMenu: function () {
            this.isOpen = !this.isOpen;
        }
    }
}
 
