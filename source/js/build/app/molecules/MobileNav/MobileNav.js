define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var mobileNavTemplate = '\n<div id="mobile-nav" class="mobile-nav" :class="{\'is-open\': isOpen}"> \n    <div class="mobile-nav__button" @click="openMenu"> \n        <span :class="[isOpen ? closeIcon: menuIcon]"></span>\n    </div>\n    <div class="mobile-nav__bar" :class="{\'is-open\': isOpen}">\n        <div class="mobile-nav__menu">\n            <a class="mobile-nav__menu-heading" href="">Really Long Username</a>\n            <ul class="mobile-nav__menu-list"> \n                <li class="mobile-nav__menu-item" v-for="link in links" :key="link.text">\n                    <a :href="link.url" class="mobile-nav__menu-link">{{ link.text }}</a>\n                </li>                \n            </ul>\n        </div>\n    </div>\n    <slot></slot>\n</div>\n';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvTW9iaWxlTmF2L01vYmlsZU5hdi5qcyJdLCJuYW1lcyI6WyJtb2JpbGVOYXZUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImNsb3NlSWNvbiIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwibWVudUljb24iLCJsaW5rcyIsIkFycmF5IiwidGV4dCIsInVybCIsImRhdGEiLCJpc09wZW4iLCJtZXRob2RzIiwib3Blbk1lbnUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQUlBLDB2QkFBSjs7c0JBb0JlO0FBQ1hDLGNBQU0sV0FESztBQUVYQyxrQkFBVUYsaUJBRkM7QUFHWEcsdUJBQWUsV0FISjtBQUlYQyxlQUFPO0FBQ0pDLHVCQUFXO0FBQ1BDLHNCQUFNQyxNQURDO0FBRVBDLHlCQUFTO0FBRkYsYUFEUDtBQUtKQyxzQkFBVTtBQUNOSCxzQkFBTUMsTUFEQTtBQUVOQyx5QkFBUztBQUZILGFBTE47QUFTSkUsbUJBQU87QUFDSEosc0JBQU1LLEtBREg7QUFFSEgseUJBQVMsb0JBQVk7QUFDakIsMkJBQU8sQ0FDRixFQUFDSSxNQUFNLE1BQVAsRUFBZUMsS0FBSyxHQUFwQixFQURFLEVBRUYsRUFBQ0QsTUFBTSxlQUFQLEVBQXdCQyxLQUFLLEdBQTdCLEVBRkUsRUFHRixFQUFDRCxNQUFNLGtCQUFQLEVBQTJCQyxLQUFLLEdBQWhDLEVBSEUsRUFJRixFQUFDRCxNQUFNLFNBQVAsRUFBa0JDLEtBQUssR0FBdkIsRUFKRSxFQUtGLEVBQUNELE1BQU0sU0FBUCxFQUFrQkMsS0FBSyxHQUF2QixFQUxFLENBQVA7QUFPSDtBQVZFO0FBVEgsU0FKSTtBQTBCWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHdCQUFRO0FBREwsYUFBUDtBQUdILFNBOUJVO0FBK0JYQyxpQkFBUztBQUNMQyxzQkFBVSxvQkFBWTtBQUNsQixxQkFBS0YsTUFBTCxHQUFjLENBQUMsS0FBS0EsTUFBcEI7QUFDSDtBQUhJO0FBL0JFLEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9Nb2JpbGVOYXYvTW9iaWxlTmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IG1vYmlsZU5hdlRlbXBsYXRlID0gYFxuPGRpdiBpZD1cIm1vYmlsZS1uYXZcIiBjbGFzcz1cIm1vYmlsZS1uYXZcIiA6Y2xhc3M9XCJ7J2lzLW9wZW4nOiBpc09wZW59XCI+IFxuICAgIDxkaXYgY2xhc3M9XCJtb2JpbGUtbmF2X19idXR0b25cIiBAY2xpY2s9XCJvcGVuTWVudVwiPiBcbiAgICAgICAgPHNwYW4gOmNsYXNzPVwiW2lzT3BlbiA/IGNsb3NlSWNvbjogbWVudUljb25dXCI+PC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtb2JpbGUtbmF2X19iYXJcIiA6Y2xhc3M9XCJ7J2lzLW9wZW4nOiBpc09wZW59XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2JpbGUtbmF2X19tZW51XCI+XG4gICAgICAgICAgICA8YSBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtaGVhZGluZ1wiIGhyZWY9XCJcIj5SZWFsbHkgTG9uZyBVc2VybmFtZTwvYT5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtbGlzdFwiPiBcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJtb2JpbGUtbmF2X19tZW51LWl0ZW1cIiB2LWZvcj1cImxpbmsgaW4gbGlua3NcIiA6a2V5PVwibGluay50ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIDpocmVmPVwibGluay51cmxcIiBjbGFzcz1cIm1vYmlsZS1uYXZfX21lbnUtbGlua1wiPnt7IGxpbmsudGV4dCB9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxzbG90Pjwvc2xvdD5cbjwvZGl2PlxuYDtcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ01vYmlsZU5hdicsXG4gICAgdGVtcGxhdGU6IG1vYmlsZU5hdlRlbXBsYXRlLFxuICAgIGNvbXBvbmVudE5hbWU6ICdNb2JpbGVOYXYnLFxuICAgIHByb3BzOiB7XG4gICAgICAgY2xvc2VJY29uOiB7XG4gICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgZGVmYXVsdDogJ3BlLWljb24tY2xvc2UnXG4gICAgICAgfSxcbiAgICAgICBtZW51SWNvbjoge1xuICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgIGRlZmF1bHQ6ICdwZS1pY29uLWhhbWJ1cmdlcidcbiAgICAgICB9LFxuICAgICAgIGxpbmtzOiB7XG4gICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJIb21lXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJWaWRlbyBMaWJyYXJ5XCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJBY2NvdW50IFNldHRpbmdzXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJQcm9maWxlXCIsIHVybDogXCIjXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJMb2cgT3V0XCIsIHVybDogXCIjXCJ9XG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgfVxuICAgICAgIH0gXG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgb3Blbk1lbnU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuICAgICAgICB9XG4gICAgfVxufVxuIFxuIl19
