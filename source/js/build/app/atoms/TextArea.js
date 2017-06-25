define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textAreaTemplate = "\n<div class=\"text-area\" :class=\"classes\">\n    <div \n        class=\"text-area__input\" \n        ref=\"input\"\n        contenteditable=\"true\"\n        v-bind=\"parentProps\"\n        :style=\"styles\"\n        @paste.lazy=\"pasted\"\n        @cut.lazy=\"changed\"\n        @keyup=\"changed\"\n        @keydown.ctrl.alt.shift=\"changed\"\n        >        \n    </div>\n    <span class=\"text-area__placeholder\" v-if=\"placeHolder\">{{placeHolder}}</span>\n    <div class=\"text-area__border\"></div>\n</div>\n";

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
                if (this.currentValue === "") {
                    if (this.parentProps && this.parentProps.placeholder) {
                        return this.parentProps.placeholder;
                    } else {
                        return "This is a text area input";
                    }
                } else {
                    return null;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0QXJlYS5qcyJdLCJuYW1lcyI6WyJ0ZXh0QXJlYVRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImNsYXNzZXMiLCJ0eXBlIiwiT2JqZWN0IiwiZGVmYXVsdCIsInBhcmVudFByb3BzIiwic3R5bGVzIiwiZGF0YSIsImhlaWdodCIsIm9ic2VydmVyIiwiY3VycmVudFZhbHVlIiwiY29tcHV0ZWQiLCJwbGFjZUhvbGRlciIsInBsYWNlaG9sZGVyIiwibW91bnRlZCIsInRleHRBcmVhIiwiJGVsIiwidGV4dEFyZWFJbnB1dCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJzdHlsZSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJmb3JFYWNoIiwibXV0YXRpb24iLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImNoaWxkTGlzdCIsImNoYXJhY3RlckRhdGEiLCJzdWJ0cmVlIiwiYmVmb3JlRGVzdHJveSIsImRpc2Nvbm5lY3QiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwidGFyZ2V0IiwidGV4dENvbnRlbnQiLCIkZW1pdCIsInBhc3RlZCIsImUiLCJjb250ZW50IiwicHJldmVudERlZmF1bHQiLCJjbGlwYm9hcmREYXRhIiwib3JpZ2luYWxFdmVudCIsImdldERhdGEiLCJkb2N1bWVudCIsImV4ZWNDb21tYW5kIiwid2luZG93Iiwic2VsZWN0aW9uIiwiY3JlYXRlUmFuZ2UiLCJwYXN0ZUhUTUwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQU1BLDZoQkFBTjs7c0JBbUJlO0FBQ1hDLGtCQUFVRCxnQkFEQztBQUVYRSxlQUFPO0FBQ0hDLHFCQUFTO0FBQ0xDLHNCQUFNQyxNQUREO0FBRUxDLHlCQUFTLG9CQUFZO0FBQ2pCLDJCQUFPO0FBQ0gsa0RBQTBCO0FBRHZCLHFCQUFQO0FBR0g7QUFOSSxhQUROO0FBU0hDLHlCQUFhO0FBQ1RILHNCQUFNQztBQURHLGFBVFY7QUFZSEcsb0JBQVE7QUFDSkosc0JBQU1DO0FBREY7QUFaTCxTQUZJO0FBa0JYSSxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVEsRUFETDtBQUVIQywwQkFBVSxJQUZQO0FBR0hDLDhCQUFjO0FBSFgsYUFBUDtBQUtILFNBeEJVO0FBeUJYQyxrQkFBVTtBQUNOQyx5QkFBYSx1QkFBWTtBQUNyQixvQkFBSSxLQUFLRixZQUFMLEtBQXNCLEVBQTFCLEVBQThCO0FBQzFCLHdCQUFJLEtBQUtMLFdBQUwsSUFBb0IsS0FBS0EsV0FBTCxDQUFpQlEsV0FBekMsRUFBc0Q7QUFDbEQsK0JBQU8sS0FBS1IsV0FBTCxDQUFpQlEsV0FBeEI7QUFDSCxxQkFGRCxNQUVPO0FBQ0gsK0JBQU8sMkJBQVA7QUFDSDtBQUNKLGlCQU5ELE1BTU87QUFDSCwyQkFBTyxJQUFQO0FBQ0g7QUFDSjtBQVhLLFNBekJDO0FBc0NYQyxpQkFBUyxtQkFBWTtBQUNqQjtBQUNBLGdCQUFJQyxXQUFXLEtBQUtDLEdBQXBCO0FBQ0EsZ0JBQUlDLGdCQUFnQkYsU0FBU0csc0JBQVQsQ0FBZ0Msa0JBQWhDLEVBQW9ELENBQXBELENBQXBCO0FBQ0FILHFCQUFTSSxLQUFULENBQWVYLE1BQWYsR0FBd0JTLGNBQWNFLEtBQWQsQ0FBb0JYLE1BQTVDO0FBQ0EsZ0JBQUlDLFdBQVcsSUFBSVcsZ0JBQUosQ0FBcUIsVUFBU0MsU0FBVCxFQUFvQjtBQUNwREEsMEJBQVVDLE9BQVYsQ0FBa0IsVUFBU0MsUUFBVCxFQUFtQjtBQUNqQ1IsNkJBQVNJLEtBQVQsQ0FBZVgsTUFBZixHQUF3QlMsY0FBY0UsS0FBZCxDQUFvQlgsTUFBNUM7QUFDSCxpQkFGRDtBQUdILGFBSmMsQ0FBZjtBQUtBQyxxQkFBU2UsT0FBVCxDQUFpQlAsYUFBakIsRUFBZ0MsRUFBRVEsWUFBWSxJQUFkLEVBQW9CQyxXQUFXLElBQS9CLEVBQXFDQyxlQUFlLElBQXBELEVBQTBEQyxTQUFTLElBQW5FLEVBQWhDO0FBQ0EsaUJBQUtuQixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsU0F0RFU7QUF1RFhvQix1QkFBZSx5QkFBWTtBQUN2QjtBQUNBLGlCQUFLcEIsUUFBTCxDQUFjcUIsVUFBZDtBQUNILFNBMURVO0FBMkRYQyxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixxQkFBS3ZCLFlBQUwsR0FBb0J1QixNQUFNQyxNQUFOLENBQWFDLFdBQWpDO0FBQ0EscUJBQUtDLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUsxQixZQUF6QjtBQUNILGFBSkk7QUFLTDJCLG9CQUFRLGdCQUFVQyxDQUFWLEVBQWE7QUFDakIsb0JBQUlKLFNBQVNJLEVBQUVKLE1BQWY7QUFDQSxvQkFBSUssVUFBVSxFQUFkO0FBQ0FELGtCQUFFRSxjQUFGO0FBQ0Esb0JBQUlGLEVBQUVHLGFBQU4sRUFBcUI7QUFDakJGLDhCQUFVLENBQUNELEVBQUVJLGFBQUYsSUFBbUJKLENBQXBCLEVBQXVCRyxhQUF2QixDQUFxQ0UsT0FBckMsQ0FBNkMsWUFBN0MsQ0FBVjtBQUNBQyw2QkFBU0MsV0FBVCxDQUFxQixZQUFyQixFQUFtQyxLQUFuQyxFQUEwQ04sT0FBMUM7QUFDSCxpQkFIRCxNQUlLLElBQUlPLE9BQU9MLGFBQVgsRUFBMEI7QUFDM0JGLDhCQUFVTyxPQUFPTCxhQUFQLENBQXFCRSxPQUFyQixDQUE2QixNQUE3QixDQUFWO0FBQ0FDLDZCQUFTRyxTQUFULENBQW1CQyxXQUFuQixHQUFpQ0MsU0FBakMsQ0FBMkNWLE9BQTNDO0FBQ0g7QUFDRCxxQkFBSzdCLFlBQUwsR0FBb0J3QixPQUFPQyxXQUEzQjtBQUNBLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQixLQUFLMUIsWUFBekI7QUFDSDtBQW5CSTtBQTNERSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0QXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRleHRBcmVhVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwidGV4dC1hcmVhXCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxkaXYgXG4gICAgICAgIGNsYXNzPVwidGV4dC1hcmVhX19pbnB1dFwiIFxuICAgICAgICByZWY9XCJpbnB1dFwiXG4gICAgICAgIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIlxuICAgICAgICB2LWJpbmQ9XCJwYXJlbnRQcm9wc1wiXG4gICAgICAgIDpzdHlsZT1cInN0eWxlc1wiXG4gICAgICAgIEBwYXN0ZS5sYXp5PVwicGFzdGVkXCJcbiAgICAgICAgQGN1dC5sYXp5PVwiY2hhbmdlZFwiXG4gICAgICAgIEBrZXl1cD1cImNoYW5nZWRcIlxuICAgICAgICBAa2V5ZG93bi5jdHJsLmFsdC5zaGlmdD1cImNoYW5nZWRcIlxuICAgICAgICA+ICAgICAgICBcbiAgICA8L2Rpdj5cbiAgICA8c3BhbiBjbGFzcz1cInRleHQtYXJlYV9fcGxhY2Vob2xkZXJcIiB2LWlmPVwicGxhY2VIb2xkZXJcIj57e3BsYWNlSG9sZGVyfX08L3NwYW4+XG4gICAgPGRpdiBjbGFzcz1cInRleHQtYXJlYV9fYm9yZGVyXCI+PC9kaXY+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogdGV4dEFyZWFUZW1wbGF0ZSxcbiAgICBwcm9wczoge1xuICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0LWFyZWFfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50UHJvcHM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6IG51bGwsICAgICAgICAgICAgXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IFwiXCIgXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIHBsYWNlSG9sZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJlbnRQcm9wcyAmJiB0aGlzLnBhcmVudFByb3BzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFByb3BzLnBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlRoaXMgaXMgYSB0ZXh0IGFyZWEgaW5wdXRcIjsgICAgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZVxuICAgICAgICB2YXIgdGV4dEFyZWEgPSB0aGlzLiRlbDtcbiAgICAgICAgdmFyIHRleHRBcmVhSW5wdXQgPSB0ZXh0QXJlYS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1hcmVhX19pbnB1dFwiKVswXTtcbiAgICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gdGV4dEFyZWFJbnB1dC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICAgICAgICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSB0ZXh0QXJlYUlucHV0LnN0eWxlLmhlaWdodDtcbiAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGV4dEFyZWFJbnB1dCwgeyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGNoYXJhY3RlckRhdGE6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjsgICAgICAgIFxuICAgICAgICAvLyB0ZXN0IGNhc2VcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgIHRleHRBcmVhSW5wdXQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucmFuZG9tKCkgKiAxMDApICsgXCJweFwiO1xuICAgICAgICAvLyB9LCAxMDAwKTtcbiAgICB9LFxuICAgIGJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdG8gc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuY3VycmVudFZhbHVlKTsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3RlZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChlLmNsaXBib2FyZERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gKGUub3JpZ2luYWxFdmVudCB8fCBlKS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCBjb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHdpbmRvdy5jbGlwYm9hcmREYXRhKSB7XG4gICAgICAgICAgICAgICAgY29udGVudCA9IHdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoJ1RleHQnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS5wYXN0ZUhUTUwoY29udGVudCk7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufTsiXX0=
