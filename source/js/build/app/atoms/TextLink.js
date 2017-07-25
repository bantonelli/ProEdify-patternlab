define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textLinkTemplate = "\n<div class=\"text-link\" :class=\"modifierStyles\">\n    <a :href=\"linkurl\" class=\"text-link__link\">\n        <slot>Text Link</slot>\n    </a>\n    <div class=\"text-link__border\" v-if=\"showborder\"></div>\n</div>\n";

    exports.default = {
        template: textLinkTemplate,
        props: {
            linkurl: {
                type: String
            },
            showborder: {
                type: Boolean,
                default: true
            },
            modifierStyles: {
                type: Array,
                default: null
            }
        },
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0TGluay5qcyJdLCJuYW1lcyI6WyJ0ZXh0TGlua1RlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImxpbmt1cmwiLCJ0eXBlIiwiU3RyaW5nIiwic2hvd2JvcmRlciIsIkJvb2xlYW4iLCJkZWZhdWx0IiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsImRhdGEiLCJvcmlnaW5hbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSxvUEFBTjs7c0JBU2U7QUFDWEMsa0JBQVVELGdCQURDO0FBRVhFLGVBQU87QUFDSEMscUJBQVM7QUFDTEMsc0JBQU1DO0FBREQsYUFETjtBQUlIQyx3QkFBWTtBQUNSRixzQkFBTUcsT0FERTtBQUVSQyx5QkFBUztBQUZELGFBSlQ7QUFRSEMsNEJBQWdCO0FBQ1pMLHNCQUFNTSxLQURNO0FBRVpGLHlCQUFTO0FBRkc7QUFSYixTQUZJO0FBZVhHLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQywrQkFBZTtBQURaLGFBQVA7QUFHSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJDVyxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0TGluay5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRleHRMaW5rVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwidGV4dC1saW5rXCIgOmNsYXNzPVwibW9kaWZpZXJTdHlsZXNcIj5cbiAgICA8YSA6aHJlZj1cImxpbmt1cmxcIiBjbGFzcz1cInRleHQtbGlua19fbGlua1wiPlxuICAgICAgICA8c2xvdD5UZXh0IExpbms8L3Nsb3Q+XG4gICAgPC9hPlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWxpbmtfX2JvcmRlclwiIHYtaWY9XCJzaG93Ym9yZGVyXCI+PC9kaXY+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogdGV4dExpbmtUZW1wbGF0ZSxcbiAgICBwcm9wczoge1xuICAgICAgICBsaW5rdXJsOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd2JvcmRlcjoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZpZXJTdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3JpZ2luYWxDb2xvcjogbnVsbFxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG1ldGhvZHM6IHtcbiAgICAvLyAgICAgbW91c2VFbnRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gICAgICAgICB2YXIgdGV4dExpbmsgPSBldmVudC50YXJnZXQ7XG4gICAgLy8gICAgICAgICB2YXIgdGV4dExpbmtCb3JkZXJCZWZvcmVDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICAgIC8vICAgICAgICAgICAgIHRleHRMaW5rLnF1ZXJ5U2VsZWN0b3IoXCIudGV4dC1saW5rX19ib3JkZXJcIiksICc6YmVmb3JlJ1xuICAgIC8vICAgICAgICAgKS5ib3JkZXJDb2xvcjsgICAgICAgICAgICBcbiAgICAvLyAgICAgICAgIHRoaXMub3JpZ2luYWxDb2xvciA9IHRleHRMaW5rQm9yZGVyQmVmb3JlQ29sb3I7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkVOVEVSIENPTE9SOiBcIiwgdGhpcy5vcmlnaW5hbENvbG9yKTtcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uIChldmVudCkgeyAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgdmFyIHRleHRMaW5rID0gZXZlbnQudGFyZ2V0O1xuICAgIC8vICAgICAgICAgdmFyIHRleHRMaW5rQm9yZGVyID0gdGV4dExpbmsucXVlcnlTZWxlY3RvcihcIi50ZXh0LWxpbmtfX2JvcmRlclwiKTsgXG4gICAgLy8gICAgICAgICB2YXIgbGVhdmVDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICAgIC8vICAgICAgICAgICAgIHRleHRMaW5rLnF1ZXJ5U2VsZWN0b3IoXCIudGV4dC1saW5rX19ib3JkZXJcIiksICc6YmVmb3JlJ1xuICAgIC8vICAgICAgICAgKS5ib3JkZXJDb2xvcjtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiTEVBVkUgQ09MT1I6IFwiLCBsZWF2ZUNvbG9yKTsgICAgICAgICAgICBcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbn07Il19
