define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var textInputTemplate = '\n<div class="text-input" :class="classes">\n    <input type="text" class="text-input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>\n    <div class="text-input__border"></div>\n</div>\n';

    exports.default = {
        template: textInputTemplate,
        // name: 'checkbox-component',
        props: ['placeholder', 'classes'],
        methods: {
            changed: function changed(event) {
                var value = event.target.value;
                console.log("Value: ", value);
                this.$emit('input', value);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UZXh0SW5wdXQuanMiXSwibmFtZXMiOlsidGV4dElucHV0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInByb3BzIiwibWV0aG9kcyIsImNoYW5nZWQiLCJldmVudCIsInZhbHVlIiwidGFyZ2V0IiwiY29uc29sZSIsImxvZyIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSwrT0FBTjs7c0JBT2U7QUFDWEMsa0JBQVVELGlCQURDO0FBRVg7QUFDQUUsZUFBTyxDQUFDLGFBQUQsRUFBZ0IsU0FBaEIsQ0FISTtBQUlYQyxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsUUFBUUQsTUFBTUUsTUFBTixDQUFhRCxLQUF6QjtBQUNBRSx3QkFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUJILEtBQXZCO0FBQ0EscUJBQUtJLEtBQUwsQ0FBVyxPQUFYLEVBQW9CSixLQUFwQjtBQUNIO0FBTEk7QUFKRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9UZXh0SW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0ZXh0SW5wdXRUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJ0ZXh0LWlucHV0XCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dC1pbnB1dF9faW5wdXRcIiBAa2V5dXA9XCJjaGFuZ2VkXCIgOnBsYWNlaG9sZGVyPVwicGxhY2Vob2xkZXJcIiBwYXR0ZXJuPVwiLnsyLH1cIiByZXF1aXJlZD5cbiAgICA8ZGl2IGNsYXNzPVwidGV4dC1pbnB1dF9fYm9yZGVyXCI+PC9kaXY+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogdGV4dElucHV0VGVtcGxhdGUsXG4gICAgLy8gbmFtZTogJ2NoZWNrYm94LWNvbXBvbmVudCcsXG4gICAgcHJvcHM6IFsncGxhY2Vob2xkZXInLCAnY2xhc3NlcyddLFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhbHVlOiBcIiwgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7ICAgIFxuICAgICAgICB9XG4gICAgfVxufTsiXX0=
