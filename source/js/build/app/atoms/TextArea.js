define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var textAreaTemplate = "\n<div class=\"text-area\" :class=\"modifierStyles\">\n    <div \n        class=\"text-area__input\"\n        :class=\"{\n            'is-valid': isValid,\n            'is-invalid': isInvalid\n        }\"  \n        ref=\"input\"\n        contenteditable=\"true\"\n        v-bind=\"parentProps\"\n        :style=\"styles\"\n        @paste.lazy=\"pasted\"\n        @cut.lazy=\"changed\"\n        @keyup=\"changed\"\n        @keydown.ctrl.alt.shift=\"changed\"\n        @focus=\"handleFocus\"\n        @blur=\"handleBlur\" \n        >        \n    </div>\n    <span class=\"text-area__placeholder\" v-if=\"placeHolder\">{{placeHolder}}</span>\n    <div class=\"text-area__border\"></div>\n</div>\n";

    exports.default = {
        template: textAreaTemplate,
        props: {
            parentProps: {
                type: Object
            },
            modifierStyles: {
                type: Array,
                default: null
            },
            styles: {
                type: Object
            },
            isValid: {
                type: Boolean,
                default: false
            },
            isInvalid: {
                type: Boolean,
                default: false
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
                console.log(_typeof(this.currentValue));
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
            },
            handleFocus: function handleFocus(event) {
                this.$emit('focus', event);
            },
            handleBlur: function handleBlur(event) {
                // emit a normal blur event 
                this.$emit('blur', event);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0QXJlYS5qcyJdLCJuYW1lcyI6WyJ0ZXh0QXJlYVRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsInBhcmVudFByb3BzIiwidHlwZSIsIk9iamVjdCIsIm1vZGlmaWVyU3R5bGVzIiwiQXJyYXkiLCJkZWZhdWx0Iiwic3R5bGVzIiwiaXNWYWxpZCIsIkJvb2xlYW4iLCJpc0ludmFsaWQiLCJkYXRhIiwiaGVpZ2h0Iiwib2JzZXJ2ZXIiLCJjdXJyZW50VmFsdWUiLCJjb21wdXRlZCIsInBsYWNlSG9sZGVyIiwicGxhY2Vob2xkZXIiLCJtb3VudGVkIiwidGV4dEFyZWEiLCIkZWwiLCJ0ZXh0QXJlYUlucHV0IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInN0eWxlIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsImZvckVhY2giLCJtdXRhdGlvbiIsIm9ic2VydmUiLCJhdHRyaWJ1dGVzIiwiY2hpbGRMaXN0IiwiY2hhcmFjdGVyRGF0YSIsInN1YnRyZWUiLCJiZWZvcmVEZXN0cm95IiwiZGlzY29ubmVjdCIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJ0YXJnZXQiLCJ0ZXh0Q29udGVudCIsImNvbnNvbGUiLCJsb2ciLCIkZW1pdCIsInBhc3RlZCIsImUiLCJjb250ZW50IiwicHJldmVudERlZmF1bHQiLCJjbGlwYm9hcmREYXRhIiwib3JpZ2luYWxFdmVudCIsImdldERhdGEiLCJkb2N1bWVudCIsImV4ZWNDb21tYW5kIiwid2luZG93Iiwic2VsZWN0aW9uIiwiY3JlYXRlUmFuZ2UiLCJwYXN0ZUhUTUwiLCJoYW5kbGVGb2N1cyIsImhhbmRsZUJsdXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFNQSw0c0JBQU47O3NCQXlCZTtBQUNYQyxrQkFBVUQsZ0JBREM7QUFFWEUsZUFBTztBQUNIQyx5QkFBYTtBQUNUQyxzQkFBTUM7QUFERyxhQURWO0FBSUhDLDRCQUFnQjtBQUNaRixzQkFBTUcs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LE9BQVgsRUFBb0IsS0FBSzVCLFlBQXpCO0FBQ0gsYUFwQkk7QUFxQkwwQyx1QkFyQkssdUJBcUJPbkIsS0FyQlAsRUFxQmM7QUFDZixxQkFBS0ssS0FBTCxDQUFXLE9BQVgsRUFBb0JMLEtBQXBCO0FBQ0gsYUF2Qkk7QUF3QkxvQixzQkF4Qkssc0JBd0JNcEIsS0F4Qk4sRUF3QmE7QUFDZDtBQUNBLHFCQUFLSyxLQUFMLENBQVcsTUFBWCxFQUFtQkwsS0FBbkI7QUFDSDtBQTNCSTtBQS9ERSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0QXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRleHRBcmVhVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwidGV4dC1hcmVhXCIgOmNsYXNzPVwibW9kaWZpZXJTdHlsZXNcIj5cbiAgICA8ZGl2IFxuICAgICAgICBjbGFzcz1cInRleHQtYXJlYV9faW5wdXRcIlxuICAgICAgICA6Y2xhc3M9XCJ7XG4gICAgICAgICAgICAnaXMtdmFsaWQnOiBpc1ZhbGlkLFxuICAgICAgICAgICAgJ2lzLWludmFsaWQnOiBpc0ludmFsaWRcbiAgICAgICAgfVwiICBcbiAgICAgICAgcmVmPVwiaW5wdXRcIlxuICAgICAgICBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJcbiAgICAgICAgdi1iaW5kPVwicGFyZW50UHJvcHNcIlxuICAgICAgICA6c3R5bGU9XCJzdHlsZXNcIlxuICAgICAgICBAcGFzdGUubGF6eT1cInBhc3RlZFwiXG4gICAgICAgIEBjdXQubGF6eT1cImNoYW5nZWRcIlxuICAgICAgICBAa2V5dXA9XCJjaGFuZ2VkXCJcbiAgICAgICAgQGtleWRvd24uY3RybC5hbHQuc2hpZnQ9XCJjaGFuZ2VkXCJcbiAgICAgICAgQGZvY3VzPVwiaGFuZGxlRm9jdXNcIlxuICAgICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIiBcbiAgICAgICAgPiAgICAgICAgXG4gICAgPC9kaXY+XG4gICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWFyZWFfX3BsYWNlaG9sZGVyXCIgdi1pZj1cInBsYWNlSG9sZGVyXCI+e3twbGFjZUhvbGRlcn19PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWFyZWFfX2JvcmRlclwiPjwvZGl2PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IHRleHRBcmVhVGVtcGxhdGUsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgcGFyZW50UHJvcHM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICBpc1ZhbGlkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaXNJbnZhbGlkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgIG9ic2VydmVyOiBudWxsLCAgICAgICAgICAgIFxuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBcIlwiIFxuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgICBwbGFjZUhvbGRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50UHJvcHMgJiYgdGhpcy5wYXJlbnRQcm9wcy5wbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRQcm9wcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJUaGlzIGlzIGEgdGV4dCBhcmVhIGlucHV0XCI7ICAgIFxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2VcbiAgICAgICAgdmFyIHRleHRBcmVhID0gdGhpcy4kZWw7XG4gICAgICAgIHZhciB0ZXh0QXJlYUlucHV0ID0gdGV4dEFyZWEuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtYXJlYV9faW5wdXRcIilbMF07XG4gICAgICAgIHRleHRBcmVhLnN0eWxlLmhlaWdodCA9IHRleHRBcmVhSW5wdXQuc3R5bGUuaGVpZ2h0O1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG11dGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gdGV4dEFyZWFJbnB1dC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRleHRBcmVhSW5wdXQsIHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7ICAgICAgICBcbiAgICAgICAgLy8gdGVzdCBjYXNlXG4gICAgICAgIC8vIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICB0ZXh0QXJlYUlucHV0LnN0eWxlLmhlaWdodCA9IChNYXRoLnJhbmRvbSgpICogMTAwKSArIFwicHhcIjtcbiAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgfSxcbiAgICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgICAgY29uc29sZS5sb2codHlwZW9mIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5jdXJyZW50VmFsdWUpOyAgICBcbiAgICAgICAgfSxcbiAgICAgICAgcGFzdGVkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKGUuY2xpcGJvYXJkRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAoZS5vcmlnaW5hbEV2ZW50IHx8IGUpLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAod2luZG93LmNsaXBib2FyZERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnBhc3RlSFRNTChjb250ZW50KTtcbiAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gdGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdmb2N1cycsIGV2ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlQmx1cihldmVudCkge1xuICAgICAgICAgICAgLy8gZW1pdCBhIG5vcm1hbCBibHVyIGV2ZW50IFxuICAgICAgICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=
