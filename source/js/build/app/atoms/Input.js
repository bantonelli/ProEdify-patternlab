define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inputTemplate = '\n<div class="input" :class="modifierStyles">\n    <input \n        v-if="parentProps"\n        class="input__input"\n        :class="{\n            \'is-valid\': isValid,\n            \'is-invalid\': isInvalid\n        }" \n        v-bind="parentProps"\n        @keyup="changed"\n        @focus="handleFocus"\n        @blur="handleBlur"\n        ref="input"         \n    >\n    <input \n        v-else\n        class="input__input"\n        type="text"\n        :placeholder="placeholder"\n        :class="{\n            \'is-valid\': isValid,\n            \'is-invalid\': isInvalid\n        }"         \n        @keyup="changed"\n        @focus="handleFocus"\n        @blur="handleBlur"\n        ref="input"         \n    >\n    <div class="input__border"></div>\n    <slot name="icon"></slot>\n</div>\n';

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
                type: Object,
                default: null
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC5qcyJdLCJuYW1lcyI6WyJpbnB1dFRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsInBhcmVudFByb3BzIiwiT2JqZWN0IiwiaXNWYWxpZCIsIkJvb2xlYW4iLCJpc0ludmFsaWQiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwidmFsdWUiLCJ0YXJnZXQiLCIkZW1pdCIsImhhbmRsZUZvY3VzIiwiaGFuZGxlQmx1ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBTUEsd3pCQUFOOztzQkFrQ2U7QUFDWEMsa0JBQVVELGFBREM7QUFFWEUsY0FBTSxPQUZLO0FBR1hDLGVBQU87QUFDSEMseUJBQWE7QUFDVEMsc0JBQU1DLE1BREc7QUFFVEMseUJBQVM7QUFGQSxhQURWO0FBS0hDLDRCQUFnQjtBQUNaSCxzQkFBTUksS0FETTtBQUVaRix5QkFBUztBQUZHLGFBTGI7QUFTSEcseUJBQWE7QUFDVEwsc0JBQU1NLE1BREc7QUFFVEoseUJBQVM7QUFGQSxhQVRWO0FBYUhLLHFCQUFTO0FBQ0xQLHNCQUFNUSxPQUREO0FBRUxOLHlCQUFTO0FBRkosYUFiTjtBQWlCSE8sdUJBQVc7QUFDUFQsc0JBQU1RLE9BREM7QUFFUE4seUJBQVM7QUFGRjtBQWpCUixTQUhJO0FBeUJYUSxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsUUFBUUQsTUFBTUUsTUFBTixDQUFhRCxLQUF6QjtBQUNBLHFCQUFLRSxLQUFMLENBQVcsT0FBWCxFQUFvQkYsS0FBcEI7QUFDSCxhQUpJO0FBS0xHLHVCQUxLLHVCQUtPSixLQUxQLEVBS2M7QUFDZixxQkFBS0csS0FBTCxDQUFXLE9BQVgsRUFBb0JILEtBQXBCO0FBQ0gsYUFQSTtBQVFMSyxzQkFSSyxzQkFRTUwsS0FSTixFQVFhO0FBQ2Q7QUFDQSxxQkFBS0csS0FBTCxDQUFXLE1BQVgsRUFBbUJILEtBQW5CO0FBQ0g7QUFYSTtBQXpCRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlucHV0VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiaW5wdXRcIiA6Y2xhc3M9XCJtb2RpZmllclN0eWxlc1wiPlxuICAgIDxpbnB1dCBcbiAgICAgICAgdi1pZj1cInBhcmVudFByb3BzXCJcbiAgICAgICAgY2xhc3M9XCJpbnB1dF9faW5wdXRcIlxuICAgICAgICA6Y2xhc3M9XCJ7XG4gICAgICAgICAgICAnaXMtdmFsaWQnOiBpc1ZhbGlkLFxuICAgICAgICAgICAgJ2lzLWludmFsaWQnOiBpc0ludmFsaWRcbiAgICAgICAgfVwiIFxuICAgICAgICB2LWJpbmQ9XCJwYXJlbnRQcm9wc1wiXG4gICAgICAgIEBrZXl1cD1cImNoYW5nZWRcIlxuICAgICAgICBAZm9jdXM9XCJoYW5kbGVGb2N1c1wiXG4gICAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgICAgIHJlZj1cImlucHV0XCIgICAgICAgICBcbiAgICA+XG4gICAgPGlucHV0IFxuICAgICAgICB2LWVsc2VcbiAgICAgICAgY2xhc3M9XCJpbnB1dF9faW5wdXRcIlxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIDpwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgOmNsYXNzPVwie1xuICAgICAgICAgICAgJ2lzLXZhbGlkJzogaXNWYWxpZCxcbiAgICAgICAgICAgICdpcy1pbnZhbGlkJzogaXNJbnZhbGlkXG4gICAgICAgIH1cIiAgICAgICAgIFxuICAgICAgICBAa2V5dXA9XCJjaGFuZ2VkXCJcbiAgICAgICAgQGZvY3VzPVwiaGFuZGxlRm9jdXNcIlxuICAgICAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgICAgICByZWY9XCJpbnB1dFwiICAgICAgICAgXG4gICAgPlxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dF9fYm9yZGVyXCI+PC9kaXY+XG4gICAgPHNsb3QgbmFtZT1cImljb25cIj48L3Nsb3Q+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogaW5wdXRUZW1wbGF0ZSxcbiAgICBuYW1lOiAnaW5wdXQnLFxuICAgIHByb3BzOiB7XG4gICAgICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsIFxuICAgICAgICAgICAgZGVmYXVsdDogXCJCYXNpYyBUZXh0IElucHV0XCJcbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZpZXJTdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LCBcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50UHJvcHM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgaXNWYWxpZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGlzSW52YWxpZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdmb2N1cycsIGV2ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlQmx1cihldmVudCkge1xuICAgICAgICAgICAgLy8gZW1pdCBhIG5vcm1hbCBibHVyIGV2ZW50IFxuICAgICAgICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbn07Il19
