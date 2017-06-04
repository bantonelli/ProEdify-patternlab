define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textAreaTemplate = '\n<div class="text-area" :class="classes">\n    <div \n        class="text-area__input" \n        @keyup="changed"\n        contenteditable="true"\n        cols="30"\n        rows="10"\n        >\n        <span v-if="placeHolder">{{placeHolder}}</span>\n    </div>\n    <div class="text-area__border"></div>\n</div>\n';

    exports.default = {
        template: textAreaTemplate,
        // name: 'checkbox-component',
        props: ['placeholder', 'classes'],
        data: function data() {
            return {
                height: 40,
                observer: null,
                placeHolder: this.placeholder
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
                var value = event.target.innerHTML;
                this.placeHolder = null;
                this.$emit('input', value);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0QXJlYS5qcyJdLCJuYW1lcyI6WyJ0ZXh0QXJlYVRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsImRhdGEiLCJoZWlnaHQiLCJvYnNlcnZlciIsInBsYWNlSG9sZGVyIiwicGxhY2Vob2xkZXIiLCJtb3VudGVkIiwidGV4dEFyZWEiLCIkZWwiLCJ0ZXh0QXJlYUlucHV0IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInN0eWxlIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsImZvckVhY2giLCJtdXRhdGlvbiIsIm9ic2VydmUiLCJhdHRyaWJ1dGVzIiwiY2hpbGRMaXN0IiwiY2hhcmFjdGVyRGF0YSIsInN1YnRyZWUiLCJiZWZvcmVEZXN0cm95IiwiZGlzY29ubmVjdCIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJ2YWx1ZSIsInRhcmdldCIsImlubmVySFRNTCIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSxrVkFBTjs7c0JBZWU7QUFDWEMsa0JBQVVELGdCQURDO0FBRVg7QUFDQUUsZUFBTyxDQUFDLGFBQUQsRUFBZ0IsU0FBaEIsQ0FISTtBQUlYQyxjQUFNLGdCQUFZO0FBQ2QsbUJBQU87QUFDSEMsd0JBQVEsRUFETDtBQUVIQywwQkFBVSxJQUZQO0FBR0hDLDZCQUFhLEtBQUtDO0FBSGYsYUFBUDtBQUtILFNBVlU7QUFXWEMsaUJBQVMsbUJBQVk7QUFDakI7QUFDQSxnQkFBSUMsV0FBVyxLQUFLQyxHQUFwQjtBQUNBLGdCQUFJQyxnQkFBZ0JGLFNBQVNHLHNCQUFULENBQWdDLGtCQUFoQyxFQUFvRCxDQUFwRCxDQUFwQjtBQUNBSCxxQkFBU0ksS0FBVCxDQUFlVCxNQUFmLEdBQXdCTyxjQUFjRSxLQUFkLENBQW9CVCxNQUE1QztBQUNBLGdCQUFJQyxXQUFXLElBQUlTLGdCQUFKLENBQXFCLFVBQVNDLFNBQVQsRUFBb0I7QUFDcERBLDBCQUFVQyxPQUFWLENBQWtCLFVBQVNDLFFBQVQsRUFBbUI7QUFDakNSLDZCQUFTSSxLQUFULENBQWVULE1BQWYsR0FBd0JPLGNBQWNFLEtBQWQsQ0FBb0JULE1BQTVDO0FBQ0gsaUJBRkQ7QUFHSCxhQUpjLENBQWY7QUFLQUMscUJBQVNhLE9BQVQsQ0FBaUJQLGFBQWpCLEVBQWdDLEVBQUVRLFlBQVksSUFBZCxFQUFvQkMsV0FBVyxJQUEvQixFQUFxQ0MsZUFBZSxJQUFwRCxFQUEwREMsU0FBUyxJQUFuRSxFQUFoQztBQUNBLGlCQUFLakIsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILFNBM0JVO0FBNEJYa0IsdUJBQWUseUJBQVk7QUFDdkI7QUFDQSxpQkFBS2xCLFFBQUwsQ0FBY21CLFVBQWQ7QUFDSCxTQS9CVTtBQWdDWEMsaUJBQVM7QUFDTEMscUJBQVMsaUJBQVVDLEtBQVYsRUFBaUI7QUFDdEIsb0JBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUMsU0FBekI7QUFDQSxxQkFBS3hCLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxxQkFBS3lCLEtBQUwsQ0FBVyxPQUFYLEVBQW9CSCxLQUFwQjtBQUNIO0FBTEk7QUFoQ0UsSyIsImZpbGUiOiJhcHAvYXRvbXMvVGV4dEFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0ZXh0QXJlYVRlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInRleHQtYXJlYVwiIDpjbGFzcz1cImNsYXNzZXNcIj5cbiAgICA8ZGl2IFxuICAgICAgICBjbGFzcz1cInRleHQtYXJlYV9faW5wdXRcIiBcbiAgICAgICAgQGtleXVwPVwiY2hhbmdlZFwiXG4gICAgICAgIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIlxuICAgICAgICBjb2xzPVwiMzBcIlxuICAgICAgICByb3dzPVwiMTBcIlxuICAgICAgICA+XG4gICAgICAgIDxzcGFuIHYtaWY9XCJwbGFjZUhvbGRlclwiPnt7cGxhY2VIb2xkZXJ9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwidGV4dC1hcmVhX19ib3JkZXJcIj48L2Rpdj5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiB0ZXh0QXJlYVRlbXBsYXRlLFxuICAgIC8vIG5hbWU6ICdjaGVja2JveC1jb21wb25lbnQnLFxuICAgIHByb3BzOiBbJ3BsYWNlaG9sZGVyJywgJ2NsYXNzZXMnXSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6IG51bGwsXG4gICAgICAgICAgICBwbGFjZUhvbGRlcjogdGhpcy5wbGFjZWhvbGRlciBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2VcbiAgICAgICAgdmFyIHRleHRBcmVhID0gdGhpcy4kZWw7XG4gICAgICAgIHZhciB0ZXh0QXJlYUlucHV0ID0gdGV4dEFyZWEuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtYXJlYV9faW5wdXRcIilbMF07XG4gICAgICAgIHRleHRBcmVhLnN0eWxlLmhlaWdodCA9IHRleHRBcmVhSW5wdXQuc3R5bGUuaGVpZ2h0O1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG11dGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gdGV4dEFyZWFJbnB1dC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRleHRBcmVhSW5wdXQsIHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7ICAgICAgICBcbiAgICAgICAgLy8gdGVzdCBjYXNlXG4gICAgICAgIC8vIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICB0ZXh0QXJlYUlucHV0LnN0eWxlLmhlaWdodCA9IChNYXRoLnJhbmRvbSgpICogMTAwKSArIFwicHhcIjtcbiAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgfSxcbiAgICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGV2ZW50LnRhcmdldC5pbm5lckhUTUw7XG4gICAgICAgICAgICB0aGlzLnBsYWNlSG9sZGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpOyAgICBcbiAgICAgICAgfVxuICAgIH1cbn07Il19
