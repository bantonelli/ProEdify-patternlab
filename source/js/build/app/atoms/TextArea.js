define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textAreaTemplate = "\n<div class=\"text-area\" :class=\"classes\">\n    <div \n        class=\"text-area__input\" \n        ref=\"input\"\n        contenteditable=\"true\"\n        v-bind=\"parentProps\"\n        :data-value=\"currentValue\"\n        :style=\"styles\"\n        @paste.lazy=\"pasted\"\n        @cut.lazy=\"changed\"\n        @keyup=\"changed\"\n        @keydown.ctrl.alt.shift=\"changed\"\n        >\n        <span v-if=\"placeHolder\">{{placeHolder}}</span>\n    </div>\n    <div class=\"text-area__border\"></div>\n</div>\n";

    exports.default = {
        template: textAreaTemplate,
        props: {
            classes: {
                type: Object,
                default: function _default() {
                    return {
                        "text-area_color-invert": false
                    };
                }
            },
            parentProps: {
                type: Object
            },
            styles: {
                type: Object
            }
        },
        data: function data() {
            return {
                height: 40,
                observer: null,
                currentValue: ""
            };
        },
        computed: {
            placeHolder: function placeHolder() {
                if (this.currentValue !== "") {
                    return null;
                } else if (!this.parentProps || !this.parentProps.placeholder) {
                    return "This is a text area input";
                } else {
                    return this.parentProps.placeholder;
                }
            }
        },
        mounted: function mounted() {
            // create an observer instance
            var textArea = this.$el;
            var textAreaInput = textArea.getElementsByClassName("text-area__input")[0];
            textArea.style.height = textAreaInput.style.height;
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    textArea.style.height = textAreaInput.style.height;
                });
            });
            observer.observe(textAreaInput, { attributes: true, childList: true, characterData: true, subtree: true });
            this.observer = observer;
            // test case
            // setInterval(function(){
            //     textAreaInput.style.height = (Math.random() * 100) + "px";
            // }, 1000);
        },
        beforeDestroy: function beforeDestroy() {
            // to stop observing
            this.observer.disconnect();
        },
        methods: {
            changed: function changed(event) {
                this.currentValue = event.target.textContent;
                this.$emit('input', this.currentValue);
            },
            pasted: function pasted(e) {
                var target = e.target;
                var content = "";
                e.preventDefault();
                if (e.clipboardData) {
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    document.execCommand('insertText', false, content);
                } else if (window.clipboardData) {
                    content = window.clipboardData.getData('Text');
                    document.selection.createRange().pasteHTML(content);
                }
                this.currentValue = target.textContent;
                this.$emit('input', this.currentValue);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0QXJlYS5qcyJdLCJuYW1lcyI6WyJ0ZXh0QXJlYVRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImNsYXNzZXMiLCJ0eXBlIiwiT2JqZWN0IiwiZGVmYXVsdCIsInBhcmVudFByb3BzIiwic3R5bGVzIiwiZGF0YSIsImhlaWdodCIsIm9ic2VydmVyIiwiY3VycmVudFZhbHVlIiwiY29tcHV0ZWQiLCJwbGFjZUhvbGRlciIsInBsYWNlaG9sZGVyIiwibW91bnRlZCIsInRleHRBcmVhIiwiJGVsIiwidGV4dEFyZWFJbnB1dCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJzdHlsZSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJmb3JFYWNoIiwibXV0YXRpb24iLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImNoaWxkTGlzdCIsImNoYXJhY3RlckRhdGEiLCJzdWJ0cmVlIiwiYmVmb3JlRGVzdHJveSIsImRpc2Nvbm5lY3QiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwidGFyZ2V0IiwidGV4dENvbnRlbnQiLCIkZW1pdCIsInBhc3RlZCIsImUiLCJjb250ZW50IiwicHJldmVudERlZmF1bHQiLCJjbGlwYm9hcmREYXRhIiwib3JpZ2luYWxFdmVudCIsImdldERhdGEiLCJkb2N1bWVudCIsImV4ZWNDb21tYW5kIiwid2luZG93Iiwic2VsZWN0aW9uIiwiY3JlYXRlUmFuZ2UiLCJwYXN0ZUhUTUwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQU1BLDhoQkFBTjs7c0JBb0JlO0FBQ1hDLGtCQUFVRCxnQkFEQztBQUVYRSxlQUFPO0FBQ0hDLHFCQUFTO0FBQ0xDLHNCQUFNQyxNQUREO0FBRUxDLHlCQUFTLG9CQUFZO0FBQ2pCLDJCQUFPO0FBQ0gsa0RBQTBCO0FBRHZCLHFCQUFQO0FBR0g7QUFOSSxhQUROO0FBU0hDLHlCQUFhO0FBQ1RILHNCQUFNQztBQURHLGFBVFY7QUFZSEcsb0JBQVE7QUFDSkosc0JBQU1DO0FBREY7QUFaTCxTQUZJO0FBa0JYSSxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVEsRUFETDtBQUVIQywwQkFBVSxJQUZQO0FBR0hDLDhCQUFjO0FBSFgsYUFBUDtBQUtILFNBeEJVO0FBeUJYQyxrQkFBVTtBQUNOQyx5QkFBYSx1QkFBWTtBQUNyQixvQkFBSSxLQUFLRixZQUFMLEtBQXNCLEVBQTFCLEVBQThCO0FBQzFCLDJCQUFPLElBQVA7QUFDSCxpQkFGRCxNQUVPLElBQUksQ0FBQyxLQUFLTCxXQUFOLElBQXFCLENBQUMsS0FBS0EsV0FBTCxDQUFpQlEsV0FBM0MsRUFBd0Q7QUFDM0QsMkJBQU8sMkJBQVA7QUFDSCxpQkFGTSxNQUVBO0FBQ0gsMkJBQU8sS0FBS1IsV0FBTCxDQUFpQlEsV0FBeEI7QUFDSDtBQUNKO0FBVEssU0F6QkM7QUFvQ1hDLGlCQUFTLG1CQUFZO0FBQ2pCO0FBQ0EsZ0JBQUlDLFdBQVcsS0FBS0MsR0FBcEI7QUFDQSxnQkFBSUMsZ0JBQWdCRixTQUFTRyxzQkFBVCxDQUFnQyxrQkFBaEMsRUFBb0QsQ0FBcEQsQ0FBcEI7QUFDQUgscUJBQVNJLEtBQVQsQ0FBZVgsTUFBZixHQUF3QlMsY0FBY0UsS0FBZCxDQUFvQlgsTUFBNUM7QUFDQSxnQkFBSUMsV0FBVyxJQUFJVyxnQkFBSixDQUFxQixVQUFTQyxTQUFULEVBQW9CO0FBQ3BEQSwwQkFBVUMsT0FBVixDQUFrQixVQUFTQyxRQUFULEVBQW1CO0FBQ2pDUiw2QkFBU0ksS0FBVCxDQUFlWCxNQUFmLEdBQXdCUyxjQUFjRSxLQUFkLENBQW9CWCxNQUE1QztBQUNILGlCQUZEO0FBR0gsYUFKYyxDQUFmO0FBS0FDLHFCQUFTZSxPQUFULENBQWlCUCxhQUFqQixFQUFnQyxFQUFFUSxZQUFZLElBQWQsRUFBb0JDLFdBQVcsSUFBL0IsRUFBcUNDLGVBQWUsSUFBcEQsRUFBMERDLFNBQVMsSUFBbkUsRUFBaEM7QUFDQSxpQkFBS25CLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxTQXBEVTtBQXFEWG9CLHVCQUFlLHlCQUFZO0FBQ3ZCO0FBQ0EsaUJBQUtwQixRQUFMLENBQWNxQixVQUFkO0FBQ0gsU0F4RFU7QUF5RFhDLGlCQUFTO0FBQ0xDLHFCQUFTLGlCQUFVQyxLQUFWLEVBQWlCO0FBQ3RCLHFCQUFLdkIsWUFBTCxHQUFvQnVCLE1BQU1DLE1BQU4sQ0FBYUMsV0FBakM7QUFDQSxxQkFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0IsS0FBSzFCLFlBQXpCO0FBQ0gsYUFKSTtBQUtMMkIsb0JBQVEsZ0JBQVVDLENBQVYsRUFBYTtBQUNqQixvQkFBSUosU0FBU0ksRUFBRUosTUFBZjtBQUNBLG9CQUFJSyxVQUFVLEVBQWQ7QUFDQUQsa0JBQUVFLGNBQUY7QUFDQSxvQkFBSUYsRUFBRUcsYUFBTixFQUFxQjtBQUNqQkYsOEJBQVUsQ0FBQ0QsRUFBRUksYUFBRixJQUFtQkosQ0FBcEIsRUFBdUJHLGFBQXZCLENBQXFDRSxPQUFyQyxDQUE2QyxZQUE3QyxDQUFWO0FBQ0FDLDZCQUFTQyxXQUFULENBQXFCLFlBQXJCLEVBQW1DLEtBQW5DLEVBQTBDTixPQUExQztBQUNILGlCQUhELE1BSUssSUFBSU8sT0FBT0wsYUFBWCxFQUEwQjtBQUMzQkYsOEJBQVVPLE9BQU9MLGFBQVAsQ0FBcUJFLE9BQXJCLENBQTZCLE1BQTdCLENBQVY7QUFDQUMsNkJBQVNHLFNBQVQsQ0FBbUJDLFdBQW5CLEdBQWlDQyxTQUFqQyxDQUEyQ1YsT0FBM0M7QUFDSDtBQUNELHFCQUFLN0IsWUFBTCxHQUFvQndCLE9BQU9DLFdBQTNCO0FBQ0EscUJBQUtDLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUsxQixZQUF6QjtBQUNIO0FBbkJJO0FBekRFLEsiLCJmaWxlIjoiYXBwL2F0b21zL1RleHRBcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGV4dEFyZWFUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJ0ZXh0LWFyZWFcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGRpdiBcbiAgICAgICAgY2xhc3M9XCJ0ZXh0LWFyZWFfX2lucHV0XCIgXG4gICAgICAgIHJlZj1cImlucHV0XCJcbiAgICAgICAgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXG4gICAgICAgIHYtYmluZD1cInBhcmVudFByb3BzXCJcbiAgICAgICAgOmRhdGEtdmFsdWU9XCJjdXJyZW50VmFsdWVcIlxuICAgICAgICA6c3R5bGU9XCJzdHlsZXNcIlxuICAgICAgICBAcGFzdGUubGF6eT1cInBhc3RlZFwiXG4gICAgICAgIEBjdXQubGF6eT1cImNoYW5nZWRcIlxuICAgICAgICBAa2V5dXA9XCJjaGFuZ2VkXCJcbiAgICAgICAgQGtleWRvd24uY3RybC5hbHQuc2hpZnQ9XCJjaGFuZ2VkXCJcbiAgICAgICAgPlxuICAgICAgICA8c3BhbiB2LWlmPVwicGxhY2VIb2xkZXJcIj57e3BsYWNlSG9sZGVyfX08L3NwYW4+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInRleHQtYXJlYV9fYm9yZGVyXCI+PC9kaXY+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogdGV4dEFyZWFUZW1wbGF0ZSxcbiAgICBwcm9wczoge1xuICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0LWFyZWFfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50UHJvcHM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6IG51bGwsICAgICAgICAgICAgXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IFwiXCIgXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIHBsYWNlSG9sZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGFyZW50UHJvcHMgfHwgIXRoaXMucGFyZW50UHJvcHMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUaGlzIGlzIGEgdGV4dCBhcmVhIGlucHV0XCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFByb3BzLnBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZVxuICAgICAgICB2YXIgdGV4dEFyZWEgPSB0aGlzLiRlbDtcbiAgICAgICAgdmFyIHRleHRBcmVhSW5wdXQgPSB0ZXh0QXJlYS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1hcmVhX19pbnB1dFwiKVswXTtcbiAgICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gdGV4dEFyZWFJbnB1dC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICAgICAgICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSB0ZXh0QXJlYUlucHV0LnN0eWxlLmhlaWdodDtcbiAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGV4dEFyZWFJbnB1dCwgeyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGNoYXJhY3RlckRhdGE6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjsgICAgICAgIFxuICAgICAgICAvLyB0ZXN0IGNhc2VcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgIHRleHRBcmVhSW5wdXQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucmFuZG9tKCkgKiAxMDApICsgXCJweFwiO1xuICAgICAgICAvLyB9LCAxMDAwKTtcbiAgICB9LFxuICAgIGJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdG8gc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuY3VycmVudFZhbHVlKTsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3RlZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChlLmNsaXBib2FyZERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gKGUub3JpZ2luYWxFdmVudCB8fCBlKS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCBjb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHdpbmRvdy5jbGlwYm9hcmREYXRhKSB7XG4gICAgICAgICAgICAgICAgY29udGVudCA9IHdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoJ1RleHQnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS5wYXN0ZUhUTUwoY29udGVudCk7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufTsiXX0=
