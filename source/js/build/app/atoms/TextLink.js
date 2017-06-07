define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textLinkTemplate = '\n<div class="text-link" :class="classes" @mouseleave="mouseOut" @mouseenter="mouseEnter">\n    <a :href="linkurl" class="text-link__link">\n        <slot>Text Link</slot>\n    </a>\n    <div class="text-link__border" v-if="showborder"></div>\n</div>\n';

    var UID = {
        _current: 0,
        getNew: function getNew() {
            this._current++;
            return this._current;
        }
    };

    HTMLElement.prototype.pseudoStyle = function (element, prop, value) {
        var _this = this;
        var _sheetId = "pseudoStyles";
        var _head = document.head || document.getElementsByTagName('head')[0];
        var _sheet = document.getElementById(_sheetId) || document.createElement('style');
        _sheet.id = _sheetId;
        var className = "pseudoStyle" + UID.getNew();

        _this.className += " " + className;

        _sheet.innerHTML += " ." + className + ":" + element + "{" + prop + ":" + value + "}";
        _head.appendChild(_sheet);
        return this;
    };

    exports.default = {
        template: textLinkTemplate,
        props: ['linkurl', 'showborder', 'classes'],
        data: function data() {
            return {
                originalColor: null
            };
        },
        methods: {
            mouseEnter: function mouseEnter(event) {
                var textLink = event.target;
                var textLinkBorderBeforeColor = window.getComputedStyle(textLink.querySelector(".text-link__border"), ':before').borderColor;
                this.originalColor = textLinkBorderBeforeColor;
                console.log("ENTER COLOR: ", this.originalColor);
            },
            mouseOut: function mouseOut(event) {
                var textLink = event.target;
                var textLinkBorder = textLink.querySelector(".text-link__border");
                textLinkBorder.pseudoStyle("before", "border-color", this.originalColor);
                textLinkBorder.pseudoStyle("after", "border-color", this.originalColor);
                var leaveColor = window.getComputedStyle(textLink.querySelector(".text-link__border"), ':before').borderColor;
                console.log("LEAVE COLOR: ", leaveColor);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0TGluay5qcyJdLCJuYW1lcyI6WyJ0ZXh0TGlua1RlbXBsYXRlIiwiVUlEIiwiX2N1cnJlbnQiLCJnZXROZXciLCJIVE1MRWxlbWVudCIsInByb3RvdHlwZSIsInBzZXVkb1N0eWxlIiwiZWxlbWVudCIsInByb3AiLCJ2YWx1ZSIsIl90aGlzIiwiX3NoZWV0SWQiLCJfaGVhZCIsImRvY3VtZW50IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiX3NoZWV0IiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwicHJvcHMiLCJkYXRhIiwib3JpZ2luYWxDb2xvciIsIm1ldGhvZHMiLCJtb3VzZUVudGVyIiwiZXZlbnQiLCJ0ZXh0TGluayIsInRhcmdldCIsInRleHRMaW5rQm9yZGVyQmVmb3JlQ29sb3IiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwicXVlcnlTZWxlY3RvciIsImJvcmRlckNvbG9yIiwiY29uc29sZSIsImxvZyIsIm1vdXNlT3V0IiwidGV4dExpbmtCb3JkZXIiLCJsZWF2ZUNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSxpUkFBTjs7QUFTQSxRQUFNQyxNQUFNO0FBQ1hDLGtCQUFVLENBREM7QUFFWEMsZ0JBQVEsa0JBQVU7QUFDakIsaUJBQUtELFFBQUw7QUFDQSxtQkFBTyxLQUFLQSxRQUFaO0FBQ0E7QUFMVSxLQUFaOztBQVFBRSxnQkFBWUMsU0FBWixDQUFzQkMsV0FBdEIsR0FBb0MsVUFBU0MsT0FBVCxFQUFpQkMsSUFBakIsRUFBc0JDLEtBQXRCLEVBQTRCO0FBQy9ELFlBQUlDLFFBQVEsSUFBWjtBQUNBLFlBQUlDLFdBQVcsY0FBZjtBQUNBLFlBQUlDLFFBQVFDLFNBQVNDLElBQVQsSUFBaUJELFNBQVNFLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLENBQTdCO0FBQ0EsWUFBSUMsU0FBU0gsU0FBU0ksY0FBVCxDQUF3Qk4sUUFBeEIsS0FBcUNFLFNBQVNLLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBbEQ7QUFDQUYsZUFBT0csRUFBUCxHQUFZUixRQUFaO0FBQ0EsWUFBSVMsWUFBWSxnQkFBZ0JuQixJQUFJRSxNQUFKLEVBQWhDOztBQUVBTyxjQUFNVSxTQUFOLElBQW9CLE1BQUlBLFNBQXhCOztBQUVBSixlQUFPSyxTQUFQLElBQW9CLE9BQUtELFNBQUwsR0FBZSxHQUFmLEdBQW1CYixPQUFuQixHQUEyQixHQUEzQixHQUErQkMsSUFBL0IsR0FBb0MsR0FBcEMsR0FBd0NDLEtBQXhDLEdBQThDLEdBQWxFO0FBQ0FHLGNBQU1VLFdBQU4sQ0FBa0JOLE1BQWxCO0FBQ0EsZUFBTyxJQUFQO0FBQ0EsS0FiRDs7c0JBZWU7QUFDWE8sa0JBQVV2QixnQkFEQztBQUVYd0IsZUFBTyxDQUFDLFNBQUQsRUFBWSxZQUFaLEVBQTBCLFNBQTFCLENBRkk7QUFHWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLCtCQUFlO0FBRFosYUFBUDtBQUdILFNBUFU7QUFRWEMsaUJBQVM7QUFDTEMsd0JBQVksb0JBQVVDLEtBQVYsRUFBaUI7QUFDekIsb0JBQUlDLFdBQVdELE1BQU1FLE1BQXJCO0FBQ0Esb0JBQUlDLDRCQUE0QkMsT0FBT0MsZ0JBQVAsQ0FDNUJKLFNBQVNLLGFBQVQsQ0FBdUIsb0JBQXZCLENBRDRCLEVBQ2tCLFNBRGxCLEVBRTlCQyxXQUZGO0FBR0EscUJBQUtWLGFBQUwsR0FBcUJNLHlCQUFyQjtBQUNBSyx3QkFBUUMsR0FBUixDQUFZLGVBQVosRUFBNkIsS0FBS1osYUFBbEM7QUFDSCxhQVJJO0FBU0xhLHNCQUFVLGtCQUFVVixLQUFWLEVBQWlCO0FBQ3ZCLG9CQUFJQyxXQUFXRCxNQUFNRSxNQUFyQjtBQUNBLG9CQUFJUyxpQkFBaUJWLFNBQVNLLGFBQVQsQ0FBdUIsb0JBQXZCLENBQXJCO0FBQ0FLLCtCQUFlbEMsV0FBZixDQUEyQixRQUEzQixFQUFxQyxjQUFyQyxFQUFxRCxLQUFLb0IsYUFBMUQ7QUFDQWMsK0JBQWVsQyxXQUFmLENBQTJCLE9BQTNCLEVBQW9DLGNBQXBDLEVBQW9ELEtBQUtvQixhQUF6RDtBQUNBLG9CQUFJZSxhQUFhUixPQUFPQyxnQkFBUCxDQUNiSixTQUFTSyxhQUFULENBQXVCLG9CQUF2QixDQURhLEVBQ2lDLFNBRGpDLEVBRWZDLFdBRkY7QUFHQUMsd0JBQVFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCRyxVQUE3QjtBQUNIO0FBbEJJO0FBUkUsSyIsImZpbGUiOiJhcHAvYXRvbXMvVGV4dExpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0ZXh0TGlua1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInRleHQtbGlua1wiIDpjbGFzcz1cImNsYXNzZXNcIiBAbW91c2VsZWF2ZT1cIm1vdXNlT3V0XCIgQG1vdXNlZW50ZXI9XCJtb3VzZUVudGVyXCI+XG4gICAgPGEgOmhyZWY9XCJsaW5rdXJsXCIgY2xhc3M9XCJ0ZXh0LWxpbmtfX2xpbmtcIj5cbiAgICAgICAgPHNsb3Q+VGV4dCBMaW5rPC9zbG90PlxuICAgIDwvYT5cbiAgICA8ZGl2IGNsYXNzPVwidGV4dC1saW5rX19ib3JkZXJcIiB2LWlmPVwic2hvd2JvcmRlclwiPjwvZGl2PlxuPC9kaXY+XG5gO1xuXG5jb25zdCBVSUQgPSB7XG5cdF9jdXJyZW50OiAwLFxuXHRnZXROZXc6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5fY3VycmVudCsrO1xuXHRcdHJldHVybiB0aGlzLl9jdXJyZW50O1xuXHR9XG59O1xuXG5IVE1MRWxlbWVudC5wcm90b3R5cGUucHNldWRvU3R5bGUgPSBmdW5jdGlvbihlbGVtZW50LHByb3AsdmFsdWUpe1xuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgX3NoZWV0SWQgPSBcInBzZXVkb1N0eWxlc1wiO1xuXHR2YXIgX2hlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG5cdHZhciBfc2hlZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChfc2hlZXRJZCkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblx0X3NoZWV0LmlkID0gX3NoZWV0SWQ7XG5cdHZhciBjbGFzc05hbWUgPSBcInBzZXVkb1N0eWxlXCIgKyBVSUQuZ2V0TmV3KCk7XG5cdFxuXHRfdGhpcy5jbGFzc05hbWUgKz0gIFwiIFwiK2NsYXNzTmFtZTsgXG5cdFxuXHRfc2hlZXQuaW5uZXJIVE1MICs9IFwiIC5cIitjbGFzc05hbWUrXCI6XCIrZWxlbWVudCtcIntcIitwcm9wK1wiOlwiK3ZhbHVlK1wifVwiO1xuXHRfaGVhZC5hcHBlbmRDaGlsZChfc2hlZXQpO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogdGV4dExpbmtUZW1wbGF0ZSxcbiAgICBwcm9wczogWydsaW5rdXJsJywgJ3Nob3dib3JkZXInLCAnY2xhc3NlcyddLFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9yaWdpbmFsQ29sb3I6IG51bGxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBtb3VzZUVudGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0TGluayA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHZhciB0ZXh0TGlua0JvcmRlckJlZm9yZUNvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoXG4gICAgICAgICAgICAgICAgdGV4dExpbmsucXVlcnlTZWxlY3RvcihcIi50ZXh0LWxpbmtfX2JvcmRlclwiKSwgJzpiZWZvcmUnXG4gICAgICAgICAgICApLmJvcmRlckNvbG9yOyAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbENvbG9yID0gdGV4dExpbmtCb3JkZXJCZWZvcmVDb2xvcjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRU5URVIgQ09MT1I6IFwiLCB0aGlzLm9yaWdpbmFsQ29sb3IpO1xuICAgICAgICB9LFxuICAgICAgICBtb3VzZU91dDogZnVuY3Rpb24gKGV2ZW50KSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGV4dExpbmsgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB2YXIgdGV4dExpbmtCb3JkZXIgPSB0ZXh0TGluay5xdWVyeVNlbGVjdG9yKFwiLnRleHQtbGlua19fYm9yZGVyXCIpOyBcbiAgICAgICAgICAgIHRleHRMaW5rQm9yZGVyLnBzZXVkb1N0eWxlKFwiYmVmb3JlXCIsIFwiYm9yZGVyLWNvbG9yXCIsIHRoaXMub3JpZ2luYWxDb2xvcik7XG4gICAgICAgICAgICB0ZXh0TGlua0JvcmRlci5wc2V1ZG9TdHlsZShcImFmdGVyXCIsIFwiYm9yZGVyLWNvbG9yXCIsIHRoaXMub3JpZ2luYWxDb2xvcik7XG4gICAgICAgICAgICB2YXIgbGVhdmVDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICAgICAgICAgICAgICAgIHRleHRMaW5rLnF1ZXJ5U2VsZWN0b3IoXCIudGV4dC1saW5rX19ib3JkZXJcIiksICc6YmVmb3JlJ1xuICAgICAgICAgICAgKS5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTEVBVkUgQ09MT1I6IFwiLCBsZWF2ZUNvbG9yKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbn07Il19
