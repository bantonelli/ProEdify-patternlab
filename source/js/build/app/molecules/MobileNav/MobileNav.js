define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var mobileNavTemplate = '\n<div id="mobile-nav" class="mobile-nav" :class="{\'is-open\': isOpen}"> \n    <template v-if="$router">\n        <div class="mobile-nav__button" @click="openMenu"> \n            <span :class="[isOpen ? closeIcon: menuIcon]"></span>\n        </div>\n        <div class="mobile-nav__bar" :class="{\'is-open\': isOpen}">\n            <div class="mobile-nav__menu">\n                <a class="mobile-nav__menu-heading" href="">Really Long Username</a>\n                <ul class="mobile-nav__menu-list"> \n                    <li class="mobile-nav__menu-item" v-for="link in links" :key="link.text">\n                        <router-link :to="link" class="mobile-nav__menu-link">{{ link.name }}</router-link>\n                    </li>                \n                </ul>\n            </div>\n        </div>\n        <slot></slot>\n    </template>\n    <template v-else>\n        <div class="mobile-nav__button" @click="openMenu"> \n        <span :class="[isOpen ? closeIcon: menuIcon]"></span>\n        </div>\n        <div class="mobile-nav__bar" :class="{\'is-open\': isOpen}">\n            <div class="mobile-nav__menu">\n                <a class="mobile-nav__menu-heading" href="">Really Long Username</a>\n                <ul class="mobile-nav__menu-list"> \n                    <li class="mobile-nav__menu-item" v-for="link in links" :key="link.text">\n                        <a :href="link.url" class="mobile-nav__menu-link">{{ link.text }}</a>\n                    </li>                \n                </ul>\n            </div>\n        </div>\n        <slot></slot>\n    </template>\n</div>\n';

    exports.default = {
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
                default: function _default() {
                    return [{ text: "Home", url: "#" }, { text: "Video Library", url: "#" }, { text: "Account Settings", url: "#" }, { text: "Profile", url: "#" }, { text: "Log Out", url: "#" }];
                }
            }
        },
        data: function data() {
            return {
                isOpen: false
            };
        },
        methods: {
            openMenu: function openMenu() {
                this.isOpen = !this.isOpen;
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTW9iaWxlTmF2L01vYmlsZU5hdi5qcyJdLCJuYW1lcyI6WyJtb2JpbGVOYXZUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImNsb3NlSWNvbiIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwibWVudUljb24iLCJsaW5rcyIsIkFycmF5IiwidGV4dCIsInVybCIsImRhdGEiLCJpc09wZW4iLCJtZXRob2RzIiwib3Blbk1lbnUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQUlBLDRsREFBSjs7c0JBc0NlO0FBQ1hDLGNBQU0sV0FESztBQUVYQyxrQkFBVUYsaUJBRkM7QUFHWEcsdUJBQWUsV0FISjtBQUlYQyxlQUFPO0FBQ0pDLHVCQUFXO0FBQ1BDLHNCQUFNQyxNQURDO0FBRVBDLHlCQUFTO0FBRkYsYUFEUDtBQUtKQyxzQkFBVTtBQUNOSCxzQkFBTUMsTUFEQTtBQUVOQyx5QkFBUztBQUZILGFBTE47QUFTSkUsbUJBQU87QUFDSEosc0JBQU1LLEtBREg7QUFFSEgseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FDRixFQUFDSSxNQUFNLE1BQVAsRUFBZUMsS0FBSyxHQUFwQixFQURFLEVBRUYsRUFBQ0QsTUFBTSxlQUFQLEVBQXdCQyxLQUFLLEdBQTdCLEVBRkUsRUFHRixFQUFDRCxNQUFNLGtCQUFQLEVBQTJCQyxLQUFLLEdBQWhDLEVBSEUsRUFJRixFQUFDRCxNQUFNLFNBQVAsRUFBa0JDLEtBQUssR0FBdkIsRUFKRSxFQUtGLEVBQUNELE1BQU0sU0FBUCxFQUFrQkMsS0FBSyxHQUF2QixFQUxFLENBQVA7QUFPSDtBQVZFO0FBVEgsU0FKSTtBQTBCWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHdCQUFRO0FBREwsYUFBUDtBQUdILFNBOUJVO0FBK0JYQyxpQkFBUztBQUNMQyxzQkFBVSxvQkFBWTtBQUNsQixxQkFBS0YsTUFBTCxHQUFjLENBQUMsS0FBS0EsTUFBcEI7QUFDSDtBQUhJO0FBL0JFLEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9Nb2JpbGVOYXYvTW9iaWxlTmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IG1vYmlsZU5hdlRlbXBsYXRlID0gYFxuPGRpdiBpZD1cIm1vYmlsZS1uYXZcIiBjbGFzcz1cIm1vYmlsZS1uYXZcIiA6Y2xhc3M9XCJ7J2lzLW9wZW4nOiBpc09wZW59XCI+IFxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwiJHJvdXRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9iaWxlLW5hdl9fYnV0dG9uXCIgQGNsaWNrPVwib3Blbk1lbnVcIj4gXG4gICAgICAgICAgICA8c3BhbiA6Y2xhc3M9XCJbaXNPcGVuID8gY2xvc2VJY29uOiBtZW51SWNvbl1cIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9iaWxlLW5hdl9fYmFyXCIgOmNsYXNzPVwieydpcy1vcGVuJzogaXNPcGVufVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnVcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtaGVhZGluZ1wiIGhyZWY9XCJcIj5SZWFsbHkgTG9uZyBVc2VybmFtZTwvYT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJtb2JpbGUtbmF2X19tZW51LWxpc3RcIj4gXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtaXRlbVwiIHYtZm9yPVwibGluayBpbiBsaW5rc1wiIDprZXk9XCJsaW5rLnRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJsaW5rXCIgY2xhc3M9XCJtb2JpbGUtbmF2X19tZW51LWxpbmtcIj57eyBsaW5rLm5hbWUgfX08L3JvdXRlci1saW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC90ZW1wbGF0ZT5cbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9iaWxlLW5hdl9fYnV0dG9uXCIgQGNsaWNrPVwib3Blbk1lbnVcIj4gXG4gICAgICAgIDxzcGFuIDpjbGFzcz1cIltpc09wZW4gPyBjbG9zZUljb246IG1lbnVJY29uXVwiPjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2JpbGUtbmF2X19iYXJcIiA6Y2xhc3M9XCJ7J2lzLW9wZW4nOiBpc09wZW59XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9iaWxlLW5hdl9fbWVudVwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9iaWxlLW5hdl9fbWVudS1oZWFkaW5nXCIgaHJlZj1cIlwiPlJlYWxseSBMb25nIFVzZXJuYW1lPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtbGlzdFwiPiBcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibW9iaWxlLW5hdl9fbWVudS1pdGVtXCIgdi1mb3I9XCJsaW5rIGluIGxpbmtzXCIgOmtleT1cImxpbmsudGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgOmhyZWY9XCJsaW5rLnVybFwiIGNsYXNzPVwibW9iaWxlLW5hdl9fbWVudS1saW5rXCI+e3sgbGluay50ZXh0IH19PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC90ZW1wbGF0ZT5cbjwvZGl2PlxuYDtcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ01vYmlsZU5hdicsXG4gICAgdGVtcGxhdGU6IG1vYmlsZU5hdlRlbXBsYXRlLFxuICAgIGNvbXBvbmVudE5hbWU6ICdNb2JpbGVOYXYnLFxuICAgIHByb3BzOiB7XG4gICAgICAgY2xvc2VJY29uOiB7XG4gICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgZGVmYXVsdDogJ3BlLWljb24tY2xvc2UnXG4gICAgICAgfSxcbiAgICAgICBtZW51SWNvbjoge1xuICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgIGRlZmF1bHQ6ICdwZS1pY29uLWhhbWJ1cmdlcidcbiAgICAgICB9LFxuICAgICAgIGxpbmtzOiB7XG4gICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJIb21lXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJWaWRlbyBMaWJyYXJ5XCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJBY2NvdW50IFNldHRpbmdzXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJQcm9maWxlXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJMb2cgT3V0XCIsIHVybDogXCIjXCJ9XG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzT3BlbjogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBvcGVuTWVudTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG4gICAgICAgIH1cbiAgICB9XG59XG4gXG4iXX0=
