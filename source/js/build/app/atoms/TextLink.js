define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textLinkTemplate = '\n<div class="text-link" :class="classes">\n    <a :href="linkurl" class="text-link__link">\n        <slot>Text Link</slot>\n    </a>\n    <div class="text-link__border" v-if="showborder"></div>\n</div>\n';

    exports.default = {
        template: textLinkTemplate,
        props: ['linkurl', 'showborder', 'classes'],
        data: function data() {
            return {
                originalColor: null
            };
        }
        // methods: {
        //     mouseEnter: function (event) {
        //         var textLink = event.target;
        //         var textLinkBorderBeforeColor = window.getComputedStyle(
        //             textLink.querySelector(".text-link__border"), ':before'
        //         ).borderColor;            
        //         this.originalColor = textLinkBorderBeforeColor;
        //         console.log("ENTER COLOR: ", this.originalColor);
        //     },
        //     mouseOut: function (event) {            
        //         var textLink = event.target;
        //         var textLinkBorder = textLink.querySelector(".text-link__border"); 
        //         var leaveColor = window.getComputedStyle(
        //             textLink.querySelector(".text-link__border"), ':before'
        //         ).borderColor;
        //         console.log("LEAVE COLOR: ", leaveColor);            
        //     }
        // }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0TGluay5qcyJdLCJuYW1lcyI6WyJ0ZXh0TGlua1RlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImRhdGEiLCJvcmlnaW5hbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSxpT0FBTjs7c0JBU2U7QUFDWEMsa0JBQVVELGdCQURDO0FBRVhFLGVBQU8sQ0FBQyxTQUFELEVBQVksWUFBWixFQUEwQixTQUExQixDQUZJO0FBR1hDLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQywrQkFBZTtBQURaLGFBQVA7QUFHSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpCVyxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0TGluay5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRleHRMaW5rVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwidGV4dC1saW5rXCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxhIDpocmVmPVwibGlua3VybFwiIGNsYXNzPVwidGV4dC1saW5rX19saW5rXCI+XG4gICAgICAgIDxzbG90PlRleHQgTGluazwvc2xvdD5cbiAgICA8L2E+XG4gICAgPGRpdiBjbGFzcz1cInRleHQtbGlua19fYm9yZGVyXCIgdi1pZj1cInNob3dib3JkZXJcIj48L2Rpdj5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiB0ZXh0TGlua1RlbXBsYXRlLFxuICAgIHByb3BzOiBbJ2xpbmt1cmwnLCAnc2hvd2JvcmRlcicsICdjbGFzc2VzJ10sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3JpZ2luYWxDb2xvcjogbnVsbFxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG1ldGhvZHM6IHtcbiAgICAvLyAgICAgbW91c2VFbnRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gICAgICAgICB2YXIgdGV4dExpbmsgPSBldmVudC50YXJnZXQ7XG4gICAgLy8gICAgICAgICB2YXIgdGV4dExpbmtCb3JkZXJCZWZvcmVDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICAgIC8vICAgICAgICAgICAgIHRleHRMaW5rLnF1ZXJ5U2VsZWN0b3IoXCIudGV4dC1saW5rX19ib3JkZXJcIiksICc6YmVmb3JlJ1xuICAgIC8vICAgICAgICAgKS5ib3JkZXJDb2xvcjsgICAgICAgICAgICBcbiAgICAvLyAgICAgICAgIHRoaXMub3JpZ2luYWxDb2xvciA9IHRleHRMaW5rQm9yZGVyQmVmb3JlQ29sb3I7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkVOVEVSIENPTE9SOiBcIiwgdGhpcy5vcmlnaW5hbENvbG9yKTtcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uIChldmVudCkgeyAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgdmFyIHRleHRMaW5rID0gZXZlbnQudGFyZ2V0O1xuICAgIC8vICAgICAgICAgdmFyIHRleHRMaW5rQm9yZGVyID0gdGV4dExpbmsucXVlcnlTZWxlY3RvcihcIi50ZXh0LWxpbmtfX2JvcmRlclwiKTsgXG4gICAgLy8gICAgICAgICB2YXIgbGVhdmVDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICAgIC8vICAgICAgICAgICAgIHRleHRMaW5rLnF1ZXJ5U2VsZWN0b3IoXCIudGV4dC1saW5rX19ib3JkZXJcIiksICc6YmVmb3JlJ1xuICAgIC8vICAgICAgICAgKS5ib3JkZXJDb2xvcjtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiTEVBVkUgQ09MT1I6IFwiLCBsZWF2ZUNvbG9yKTsgICAgICAgICAgICBcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbn07Il19
