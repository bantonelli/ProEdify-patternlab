define(['exports', '../atoms/Input'], function (exports, _Input) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Input2 = _interopRequireDefault(_Input);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var emailInputTemplate = '\n    <pe-text-input\n        :classes="emailinput.class"\n        :placeholder="emailinput.placeHolder"\n        :type="emailinput.type"\n        v-model="Value"\n        >        \n    </pe-text-input>\n';

    var templateSlot = '<div class="input__icon icon-magnifying-glass" slot="icon"></div>';

    exports.default = {
        template: emailInputTemplate,
        props: ['emailinput'],
        data: function data() {
            return {
                Value: ""
            };
        },
        watch: {
            Value: function Value(newValue) {
                this.$emit('input', newValue);
            }
        },
        components: {
            'pe-text-input': _Input2.default
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW1haWxGaWVsZC5qcyJdLCJuYW1lcyI6WyJlbWFpbElucHV0VGVtcGxhdGUiLCJ0ZW1wbGF0ZVNsb3QiLCJ0ZW1wbGF0ZSIsInByb3BzIiwiZGF0YSIsIlZhbHVlIiwid2F0Y2giLCJuZXdWYWx1ZSIsIiRlbWl0IiwiY29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsUUFBTUEsb09BQU47O0FBVUEsUUFBTUMsa0ZBQU47O3NCQUVlO0FBQ1hDLGtCQUFVRixrQkFEQztBQUVYRyxlQUFPLENBQUMsWUFBRCxDQUZJO0FBR1hDLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQyx1QkFBTztBQURKLGFBQVA7QUFHSCxTQVBVO0FBUVhDLGVBQU87QUFDSEQsbUJBQU8sZUFBVUUsUUFBVixFQUFvQjtBQUN2QixxQkFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0JELFFBQXBCO0FBQ0g7QUFIRSxTQVJJO0FBYVhFLG9CQUFZO0FBQ1I7QUFEUTtBQWJELEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9FbWFpbEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b21zL0lucHV0JztcblxuY29uc3QgZW1haWxJbnB1dFRlbXBsYXRlID0gYFxuICAgIDxwZS10ZXh0LWlucHV0XG4gICAgICAgIDpjbGFzc2VzPVwiZW1haWxpbnB1dC5jbGFzc1wiXG4gICAgICAgIDpwbGFjZWhvbGRlcj1cImVtYWlsaW5wdXQucGxhY2VIb2xkZXJcIlxuICAgICAgICA6dHlwZT1cImVtYWlsaW5wdXQudHlwZVwiXG4gICAgICAgIHYtbW9kZWw9XCJWYWx1ZVwiXG4gICAgICAgID4gICAgICAgIFxuICAgIDwvcGUtdGV4dC1pbnB1dD5cbmA7XG5cbmNvbnN0IHRlbXBsYXRlU2xvdCA9IGA8ZGl2IGNsYXNzPVwiaW5wdXRfX2ljb24gaWNvbi1tYWduaWZ5aW5nLWdsYXNzXCIgc2xvdD1cImljb25cIj48L2Rpdj5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IGVtYWlsSW5wdXRUZW1wbGF0ZSxcbiAgICBwcm9wczogWydlbWFpbGlucHV0J10sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgVmFsdWU6IFwiXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgd2F0Y2g6IHtcbiAgICAgICAgVmFsdWU6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3BlLXRleHQtaW5wdXQnOiBJbnB1dFxuICAgIH1cbn0iXX0=
