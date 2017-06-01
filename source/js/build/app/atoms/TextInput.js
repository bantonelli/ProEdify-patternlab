define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var radioTemplate = '\n<div class="radio" :class="classes">\n    <input class="radio__input" type="radio" :id="id" :value="formvalue" @change="changed" :name="formname">\n    <div class="radio__fill"></div>\n    <label class="radio__label" :for="id">{{text}}</label>\n</div>\n';

    var textInputTemplate = '\n<div class="text-input" :class="classes">\n    <input type="text" class="text-input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>\n    <div class="text-input__border"></div>\n</div>\n';

    exports.default = {
        template: radioTemplate,
        // name: 'checkbox-component',
        props: ['placeholder', 'classes', 'formvalue'],
        methods: {
            changed: function changed(event) {
                var value = event.target.value;
                console.log("Value: ", value);
                this.$emit('input', value);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0SW5wdXQuanMiXSwibmFtZXMiOlsicmFkaW9UZW1wbGF0ZSIsInRleHRJbnB1dFRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJ2YWx1ZSIsInRhcmdldCIsImNvbnNvbGUiLCJsb2ciLCIkZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBTUEsaVJBQU47O0FBUUEsUUFBTUMsK09BQU47O3NCQU9lO0FBQ1hDLGtCQUFVRixhQURDO0FBRVg7QUFDQUcsZUFBTyxDQUFDLGFBQUQsRUFBZ0IsU0FBaEIsRUFBMkIsV0FBM0IsQ0FISTtBQUlYQyxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsUUFBUUQsTUFBTUUsTUFBTixDQUFhRCxLQUF6QjtBQUNBRSx3QkFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUJILEtBQXZCO0FBQ0EscUJBQUtJLEtBQUwsQ0FBVyxPQUFYLEVBQW9CSixLQUFwQjtBQUNIO0FBTEk7QUFKRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0SW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByYWRpb1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInJhZGlvXCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxpbnB1dCBjbGFzcz1cInJhZGlvX19pbnB1dFwiIHR5cGU9XCJyYWRpb1wiIDppZD1cImlkXCIgOnZhbHVlPVwiZm9ybXZhbHVlXCIgQGNoYW5nZT1cImNoYW5nZWRcIiA6bmFtZT1cImZvcm1uYW1lXCI+XG4gICAgPGRpdiBjbGFzcz1cInJhZGlvX19maWxsXCI+PC9kaXY+XG4gICAgPGxhYmVsIGNsYXNzPVwicmFkaW9fX2xhYmVsXCIgOmZvcj1cImlkXCI+XFx7e3RleHR9fTwvbGFiZWw+XG48L2Rpdj5cbmA7XG5cbmNvbnN0IHRleHRJbnB1dFRlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInRleHQtaW5wdXRcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0LWlucHV0X19pbnB1dFwiIEBrZXl1cD1cImNoYW5nZWRcIiA6cGxhY2Vob2xkZXI9XCJwbGFjZWhvbGRlclwiIHBhdHRlcm49XCIuezIsfVwiIHJlcXVpcmVkPlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWlucHV0X19ib3JkZXJcIj48L2Rpdj5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiByYWRpb1RlbXBsYXRlLFxuICAgIC8vIG5hbWU6ICdjaGVja2JveC1jb21wb25lbnQnLFxuICAgIHByb3BzOiBbJ3BsYWNlaG9sZGVyJywgJ2NsYXNzZXMnLCAnZm9ybXZhbHVlJ10sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFsdWU6IFwiLCB2YWx1ZSlcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpOyAgICBcbiAgICAgICAgfVxuICAgIH1cbn07Il19
