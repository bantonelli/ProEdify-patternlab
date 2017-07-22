define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inputTemplate = '\n<div class="input" :class="modifierStyles">\n    <input \n        class="input__input"\n        :class="{\n            \'is-valid\': isValid,\n            \'is-invalid\': isInvalid\n        }" \n        v-bind="parentProps"\n        @keyup="changed"\n        @focus="handleFocus"\n        @blur="handleBlur"\n        ref="input"         \n    >\n    <div class="input__border"></div>\n    <slot name="icon"></slot>\n</div>\n';

    exports.default = {
        template: inputTemplate,
        name: 'input',
        props: {
            placeholder: {
                type: String,
                default: "Basic Text Input"
            },
            modifierStyles: {
                type: Array,
                default: null
            },
            parentProps: {
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
        methods: {
            changed: function changed(event) {
                var value = event.target.value;
                this.$emit('input', value);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC5qcyJdLCJuYW1lcyI6WyJpbnB1dFRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsInBhcmVudFByb3BzIiwiT2JqZWN0IiwiaXNWYWxpZCIsIkJvb2xlYW4iLCJpc0ludmFsaWQiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwidmFsdWUiLCJ0YXJnZXQiLCIkZW1pdCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlQmx1ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBTUEsNGJBQU47O3NCQW1CZTtBQUNYQyxrQkFBVUQsYUFEQztBQUVYRSxjQUFNLE9BRks7QUFHWEMsZUFBTztBQUNIQyx5QkFBYTtBQUNUQyxzQkFBTUMsTUFERztBQUVUQyx5QkFBUztBQUZBLGFBRFY7QUFLSEMsNEJBQWdCO0FBQ1pILHNCQUFNSSxLQURNO0FBRVpGLHlCQUFTO0FBRkcsYUFMYjtBQVNIRyx5QkFBYTtBQUNUTCxzQkFBTU07QUFERyxhQVRWO0FBWUhDLHFCQUFTO0FBQ0xQLHNCQUFNUSxPQUREO0FBRUxOLHlCQUFTO0FBRkosYUFaTjtBQWdCSE8sdUJBQVc7QUFDUFQsc0JBQU1RLE9BREM7QUFFUE4seUJBQVM7QUFGRjtBQWhCUixTQUhJO0FBd0JYUSxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsUUFBUUQsTUFBTUUsTUFBTixDQUFhRCxLQUF6QjtBQUNBLHFCQUFLRSxLQUFMLENBQVcsT0FBWCxFQUFvQkYsS0FBcEI7QUFDSCxhQUpJO0FBS0xHLHVCQUxLLHVCQUtPSixLQUxQLEVBS2M7QUFDZixxQkFBS0csS0FBTCxDQUFXLE9BQVgsRUFBb0JILEtBQXBCO0FBQ0gsYUFQSTtBQVFMSyxzQkFSSyxzQkFRTUwsS0FSTixFQVFhO0FBQ2Q7QUFDQSxxQkFBS0csS0FBTCxDQUFXLE1BQVgsRUFBbUJILEtBQW5CO0FBQ0g7QUFYSTtBQXhCRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlucHV0VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiaW5wdXRcIiA6Y2xhc3M9XCJtb2RpZmllclN0eWxlc1wiPlxuICAgIDxpbnB1dCBcbiAgICAgICAgY2xhc3M9XCJpbnB1dF9faW5wdXRcIlxuICAgICAgICA6Y2xhc3M9XCJ7XG4gICAgICAgICAgICAnaXMtdmFsaWQnOiBpc1ZhbGlkLFxuICAgICAgICAgICAgJ2lzLWludmFsaWQnOiBpc0ludmFsaWRcbiAgICAgICAgfVwiIFxuICAgICAgICB2LWJpbmQ9XCJwYXJlbnRQcm9wc1wiXG4gICAgICAgIEBrZXl1cD1cImNoYW5nZWRcIlxuICAgICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgICAgIHJlZj1cImlucHV0XCIgICAgICAgICBcbiAgICA+XG4gICAgPGRpdiBjbGFzcz1cImlucHV0X19ib3JkZXJcIj48L2Rpdj5cbiAgICA8c2xvdCBuYW1lPVwiaWNvblwiPjwvc2xvdD5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiBpbnB1dFRlbXBsYXRlLFxuICAgIG5hbWU6ICdpbnB1dCcsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZywgXG4gICAgICAgICAgICBkZWZhdWx0OiBcIkJhc2ljIFRleHQgSW5wdXRcIlxuICAgICAgICB9LFxuICAgICAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnRQcm9wczoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgIH0sXG4gICAgICAgIGlzVmFsaWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpc0ludmFsaWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSk7ICAgIFxuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVGb2N1cyhldmVudCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnZm9jdXMnLCBldmVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZUJsdXIoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIGVtaXQgYSBub3JtYWwgYmx1ciBldmVudCBcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
