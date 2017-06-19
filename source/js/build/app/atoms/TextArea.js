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
                placeHolder: this.parentProps.placeholder,
                currentValue: ""
            };
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
                this.placeHolder = null;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0QXJlYS5qcyJdLCJuYW1lcyI6WyJ0ZXh0QXJlYVRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImNsYXNzZXMiLCJ0eXBlIiwiT2JqZWN0IiwiZGVmYXVsdCIsInBhcmVudFByb3BzIiwic3R5bGVzIiwiZGF0YSIsImhlaWdodCIsIm9ic2VydmVyIiwicGxhY2VIb2xkZXIiLCJwbGFjZWhvbGRlciIsImN1cnJlbnRWYWx1ZSIsIm1vdW50ZWQiLCJ0ZXh0QXJlYSIsIiRlbCIsInRleHRBcmVhSW5wdXQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3R5bGUiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwiZm9yRWFjaCIsIm11dGF0aW9uIiwib2JzZXJ2ZSIsImF0dHJpYnV0ZXMiLCJjaGlsZExpc3QiLCJjaGFyYWN0ZXJEYXRhIiwic3VidHJlZSIsImJlZm9yZURlc3Ryb3kiLCJkaXNjb25uZWN0IiwibWV0aG9kcyIsImNoYW5nZWQiLCJldmVudCIsInRhcmdldCIsInRleHRDb250ZW50IiwiJGVtaXQiLCJwYXN0ZWQiLCJlIiwiY29udGVudCIsInByZXZlbnREZWZhdWx0IiwiY2xpcGJvYXJkRGF0YSIsIm9yaWdpbmFsRXZlbnQiLCJnZXREYXRhIiwiZG9jdW1lbnQiLCJleGVjQ29tbWFuZCIsIndpbmRvdyIsInNlbGVjdGlvbiIsImNyZWF0ZVJhbmdlIiwicGFzdGVIVE1MIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSw4aEJBQU47O3NCQW9CZTtBQUNYQyxrQkFBVUQsZ0JBREM7QUFFWEUsZUFBTztBQUNIQyxxQkFBUztBQUNMQyxzQkFBTUMsTUFERDtBQUVMQyx5QkFBUyxvQkFBWTtBQUNqQiwyQkFBTztBQUNILGtEQUEwQjtBQUR2QixxQkFBUDtBQUdIO0FBTkksYUFETjtBQVNIQyx5QkFBYTtBQUNUSCxzQkFBTUM7QUFERyxhQVRWO0FBWUhHLG9CQUFRO0FBQ0pKLHNCQUFNQztBQURGO0FBWkwsU0FGSTtBQWtCWEksY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHdCQUFRLEVBREw7QUFFSEMsMEJBQVUsSUFGUDtBQUdIQyw2QkFBYSxLQUFLTCxXQUFMLENBQWlCTSxXQUgzQjtBQUlIQyw4QkFBYztBQUpYLGFBQVA7QUFNSCxTQXpCVTtBQTBCWEMsaUJBQVMsbUJBQVk7QUFDakI7QUFDQSxnQkFBSUMsV0FBVyxLQUFLQyxHQUFwQjtBQUNBLGdCQUFJQyxnQkFBZ0JGLFNBQVNHLHNCQUFULENBQWdDLGtCQUFoQyxFQUFvRCxDQUFwRCxDQUFwQjtBQUNBSCxxQkFBU0ksS0FBVCxDQUFlVixNQUFmLEdBQXdCUSxjQUFjRSxLQUFkLENBQW9CVixNQUE1QztBQUNBLGdCQUFJQyxXQUFXLElBQUlVLGdCQUFKLENBQXFCLFVBQVNDLFNBQVQsRUFBb0I7QUFDcERBLDBCQUFVQyxPQUFWLENBQWtCLFVBQVNDLFFBQVQsRUFBbUI7QUFDakNSLDZCQUFTSSxLQUFULENBQWVWLE1BQWYsR0FBd0JRLGNBQWNFLEtBQWQsQ0FBb0JWLE1BQTVDO0FBQ0gsaUJBRkQ7QUFHSCxhQUpjLENBQWY7QUFLQUMscUJBQVNjLE9BQVQsQ0FBaUJQLGFBQWpCLEVBQWdDLEVBQUVRLFlBQVksSUFBZCxFQUFvQkMsV0FBVyxJQUEvQixFQUFxQ0MsZUFBZSxJQUFwRCxFQUEwREMsU0FBUyxJQUFuRSxFQUFoQztBQUNBLGlCQUFLbEIsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILFNBMUNVO0FBMkNYbUIsdUJBQWUseUJBQVk7QUFDdkI7QUFDQSxpQkFBS25CLFFBQUwsQ0FBY29CLFVBQWQ7QUFDSCxTQTlDVTtBQStDWEMsaUJBQVM7QUFDTEMscUJBQVMsaUJBQVVDLEtBQVYsRUFBaUI7QUFDdEIscUJBQUt0QixXQUFMLEdBQW1CLElBQW5CO0FBQ0EscUJBQUtFLFlBQUwsR0FBb0JvQixNQUFNQyxNQUFOLENBQWFDLFdBQWpDO0FBQ0EscUJBQUtDLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUt2QixZQUF6QjtBQUNILGFBTEk7QUFNTHdCLG9CQUFRLGdCQUFVQyxDQUFWLEVBQWE7QUFDakIsb0JBQUlKLFNBQVNJLEVBQUVKLE1BQWY7QUFDQSxvQkFBSUssVUFBVSxFQUFkO0FBQ0FELGtCQUFFRSxjQUFGO0FBQ0Esb0JBQUlGLEVBQUVHLGFBQU4sRUFBcUI7QUFDakJGLDhCQUFVLENBQUNELEVBQUVJLGFBQUYsSUFBbUJKLENBQXBCLEVBQXVCRyxhQUF2QixDQUFxQ0UsT0FBckMsQ0FBNkMsWUFBN0MsQ0FBVjtBQUNBQyw2QkFBU0MsV0FBVCxDQUFxQixZQUFyQixFQUFtQyxLQUFuQyxFQUEwQ04sT0FBMUM7QUFDSCxpQkFIRCxNQUlLLElBQUlPLE9BQU9MLGFBQVgsRUFBMEI7QUFDM0JGLDhCQUFVTyxPQUFPTCxhQUFQLENBQXFCRSxPQUFyQixDQUE2QixNQUE3QixDQUFWO0FBQ0FDLDZCQUFTRyxTQUFULENBQW1CQyxXQUFuQixHQUFpQ0MsU0FBakMsQ0FBMkNWLE9BQTNDO0FBQ0g7QUFDRCxxQkFBSzFCLFlBQUwsR0FBb0JxQixPQUFPQyxXQUEzQjtBQUNBLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQixLQUFLdkIsWUFBekI7QUFDSDtBQXBCSTtBQS9DRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0QXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRleHRBcmVhVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwidGV4dC1hcmVhXCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxkaXYgXG4gICAgICAgIGNsYXNzPVwidGV4dC1hcmVhX19pbnB1dFwiIFxuICAgICAgICByZWY9XCJpbnB1dFwiXG4gICAgICAgIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIlxuICAgICAgICB2LWJpbmQ9XCJwYXJlbnRQcm9wc1wiXG4gICAgICAgIDpkYXRhLXZhbHVlPVwiY3VycmVudFZhbHVlXCJcbiAgICAgICAgOnN0eWxlPVwic3R5bGVzXCJcbiAgICAgICAgQHBhc3RlLmxhenk9XCJwYXN0ZWRcIlxuICAgICAgICBAY3V0Lmxhenk9XCJjaGFuZ2VkXCJcbiAgICAgICAgQGtleXVwPVwiY2hhbmdlZFwiXG4gICAgICAgIEBrZXlkb3duLmN0cmwuYWx0LnNoaWZ0PVwiY2hhbmdlZFwiXG4gICAgICAgID5cbiAgICAgICAgPHNwYW4gdi1pZj1cInBsYWNlSG9sZGVyXCI+e3twbGFjZUhvbGRlcn19PC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWFyZWFfX2JvcmRlclwiPjwvZGl2PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IHRleHRBcmVhVGVtcGxhdGUsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dC1hcmVhX2NvbG9yLWludmVydFwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHBhcmVudFByb3BzOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgIG9ic2VydmVyOiBudWxsLFxuICAgICAgICAgICAgcGxhY2VIb2xkZXI6IHRoaXMucGFyZW50UHJvcHMucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IFwiXCIgXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlXG4gICAgICAgIHZhciB0ZXh0QXJlYSA9IHRoaXMuJGVsO1xuICAgICAgICB2YXIgdGV4dEFyZWFJbnB1dCA9IHRleHRBcmVhLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0ZXh0LWFyZWFfX2lucHV0XCIpWzBdO1xuICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSB0ZXh0QXJlYUlucHV0LnN0eWxlLmhlaWdodDtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG4gICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbikge1xuICAgICAgICAgICAgICAgIHRleHRBcmVhLnN0eWxlLmhlaWdodCA9IHRleHRBcmVhSW5wdXQuc3R5bGUuaGVpZ2h0O1xuICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0QXJlYUlucHV0LCB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSwgY2hhcmFjdGVyRGF0YTogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG9ic2VydmVyOyAgICAgICAgXG4gICAgICAgIC8vIHRlc3QgY2FzZVxuICAgICAgICAvLyBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgdGV4dEFyZWFJbnB1dC5zdHlsZS5oZWlnaHQgPSAoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyBcInB4XCI7XG4gICAgICAgIC8vIH0sIDEwMDApO1xuICAgIH0sXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0byBzdG9wIG9ic2VydmluZ1xuICAgICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBsYWNlSG9sZGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmN1cnJlbnRWYWx1ZSk7ICAgIFxuICAgICAgICB9LFxuICAgICAgICBwYXN0ZWQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoZS5jbGlwYm9hcmREYXRhKSB7XG4gICAgICAgICAgICAgICAgY29udGVudCA9IChlLm9yaWdpbmFsRXZlbnQgfHwgZSkuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh3aW5kb3cuY2xpcGJvYXJkRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0Jyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkucGFzdGVIVE1MKGNvbnRlbnQpO1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn07Il19
