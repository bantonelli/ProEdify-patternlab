define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inputTemplate = "\n<div class=\"input\" :class=\"classes\">\n    <input \n        class=\"input__input\" \n        autocorrect=\"off\"\n        :autocapitalize=\"capitalize\" \n        :type=\"type\" \n        :placeholder=\"placeholder\"\n        @keyup=\"changed\" \n        pattern=\".{2,}\" required\n    >\n    <div class=\"input__border\"></div>\n    <slot name=\"icon\"></slot>\n</div>\n";

    exports.default = {
        template: inputTemplate,
        name: 'input',
        props: {
            placeholder: {
                type: String,
                default: "Basic Text Input"
            },
            classes: {
                type: Object,
                default: {
                    "input_color-invert": false
                }
            },
            type: {
                type: String,
                default: "text"
            },
            capitalize: {
                type: String,
                default: "off"
            }
        },
        methods: {
            changed: function changed(event) {
                var value = event.target.value;
                this.$emit('input', value);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC5qcyJdLCJuYW1lcyI6WyJpbnB1dFRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwiY2xhc3NlcyIsIk9iamVjdCIsImNhcGl0YWxpemUiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwidmFsdWUiLCJ0YXJnZXQiLCIkZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBTUEsMllBQU47O3NCQWdCZTtBQUNYQyxrQkFBVUQsYUFEQztBQUVYRSxjQUFNLE9BRks7QUFHWEMsZUFBTztBQUNIQyx5QkFBYTtBQUNUQyxzQkFBTUMsTUFERztBQUVUQyx5QkFBUztBQUZBLGFBRFY7QUFLSEMscUJBQVM7QUFDTEgsc0JBQU1JLE1BREQ7QUFFTEYseUJBQVM7QUFDTCwwQ0FBc0I7QUFEakI7QUFGSixhQUxOO0FBV0hGLGtCQUFNO0FBQ0ZBLHNCQUFNQyxNQURKO0FBRUZDLHlCQUFTO0FBRlAsYUFYSDtBQWVIRyx3QkFBWTtBQUNSTCxzQkFBTUMsTUFERTtBQUVSQyx5QkFBUztBQUZEO0FBZlQsU0FISTtBQXVCWEksaUJBQVM7QUFDTEMscUJBQVMsaUJBQVVDLEtBQVYsRUFBaUI7QUFDdEIsb0JBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUQsS0FBekI7QUFDQSxxQkFBS0UsS0FBTCxDQUFXLE9BQVgsRUFBb0JGLEtBQXBCO0FBQ0g7QUFKSTtBQXZCRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlucHV0VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiaW5wdXRcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGlucHV0IFxuICAgICAgICBjbGFzcz1cImlucHV0X19pbnB1dFwiIFxuICAgICAgICBhdXRvY29ycmVjdD1cIm9mZlwiXG4gICAgICAgIDphdXRvY2FwaXRhbGl6ZT1cImNhcGl0YWxpemVcIiBcbiAgICAgICAgOnR5cGU9XCJ0eXBlXCIgXG4gICAgICAgIDpwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgQGtleXVwPVwiY2hhbmdlZFwiIFxuICAgICAgICBwYXR0ZXJuPVwiLnsyLH1cIiByZXF1aXJlZFxuICAgID5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXRfX2JvcmRlclwiPjwvZGl2PlxuICAgIDxzbG90IG5hbWU9XCJpY29uXCI+PC9zbG90PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IGlucHV0VGVtcGxhdGUsXG4gICAgbmFtZTogJ2lucHV0JyxcbiAgICBwcm9wczoge1xuICAgICAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLCBcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiQmFzaWMgVGV4dCBJbnB1dFwiXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBcImlucHV0X2NvbG9yLWludmVydFwiOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcInRleHRcIlxuICAgICAgICB9LFxuICAgICAgICBjYXBpdGFsaXplOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcIm9mZlwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTsgICAgXG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
