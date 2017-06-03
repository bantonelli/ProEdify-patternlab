define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var radioTemplate = '\n<div class="radio" :class="classes">\n    <input class="radio__input" type="radio" :id="id" :value="formvalue" @change="changed" :name="formname">\n    <div class="radio__fill"></div>\n    <label class="radio__label" :for="id">{{text}}</label>\n</div>\n';

    exports.default = {
        template: radioTemplate,
        // name: 'checkbox-component',
        props: ['text', 'id', 'classes', 'formvalue', 'formname'],
        methods: {
            changed: function changed(event) {
                var isChecked = event.target.checked;
                if (isChecked) {
                    this.$emit('input', this.formvalue);
                } else {
                    this.$emit('input', null);
                }
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9SYWRpby5qcyJdLCJuYW1lcyI6WyJyYWRpb1RlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJpc0NoZWNrZWQiLCJ0YXJnZXQiLCJjaGVja2VkIiwiJGVtaXQiLCJmb3JtdmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQU1BLGlSQUFOOztzQkFRZTtBQUNYQyxrQkFBVUQsYUFEQztBQUVYO0FBQ0FFLGVBQU8sQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEIsV0FBMUIsRUFBdUMsVUFBdkMsQ0FISTtBQUlYQyxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsWUFBWUQsTUFBTUUsTUFBTixDQUFhQyxPQUE3QjtBQUNBLG9CQUFJRixTQUFKLEVBQWU7QUFDWCx5QkFBS0csS0FBTCxDQUFXLE9BQVgsRUFBcUIsS0FBS0MsU0FBMUI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUtELEtBQUwsQ0FBVyxPQUFYLEVBQW9CLElBQXBCO0FBQ0g7QUFDSjtBQVJJO0FBSkUsSyIsImZpbGUiOiJhcHAvYXRvbXMvUmFkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByYWRpb1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInJhZGlvXCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxpbnB1dCBjbGFzcz1cInJhZGlvX19pbnB1dFwiIHR5cGU9XCJyYWRpb1wiIDppZD1cImlkXCIgOnZhbHVlPVwiZm9ybXZhbHVlXCIgQGNoYW5nZT1cImNoYW5nZWRcIiA6bmFtZT1cImZvcm1uYW1lXCI+XG4gICAgPGRpdiBjbGFzcz1cInJhZGlvX19maWxsXCI+PC9kaXY+XG4gICAgPGxhYmVsIGNsYXNzPVwicmFkaW9fX2xhYmVsXCIgOmZvcj1cImlkXCI+XFx7e3RleHR9fTwvbGFiZWw+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogcmFkaW9UZW1wbGF0ZSxcbiAgICAvLyBuYW1lOiAnY2hlY2tib3gtY29tcG9uZW50JyxcbiAgICBwcm9wczogWyd0ZXh0JywgJ2lkJywgJ2NsYXNzZXMnLCAnZm9ybXZhbHVlJywgJ2Zvcm1uYW1lJ10sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpc0NoZWNrZWQgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICh0aGlzLmZvcm12YWx1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG51bGwpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG59O1xuIl19
