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

    var searchInputTemplate = '\n    <pe-text-input\n        :classes="searchinput.class"\n        :placeholder="searchinput.placeHolder"\n        :type="searchinput.type"\n        v-model="Value"\n        >\n        <div class="input__icon icon-magnifying-glass" slot="icon"></div>\n    </pe-text-input>\n';

    exports.default = {
        template: searchInputTemplate,
        props: ['searchinput'],
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvU2VhcmNoRmllbGQuanMiXSwibmFtZXMiOlsic2VhcmNoSW5wdXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwicHJvcHMiLCJkYXRhIiwiVmFsdWUiLCJ3YXRjaCIsIm5ld1ZhbHVlIiwiJGVtaXQiLCJjb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxRQUFNQSwyU0FBTjs7c0JBV2U7QUFDWEMsa0JBQVVELG1CQURDO0FBRVhFLGVBQU8sQ0FBQyxhQUFELENBRkk7QUFHWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLHVCQUFPO0FBREosYUFBUDtBQUdILFNBUFU7QUFRWEMsZUFBTztBQUNIRCxtQkFBTyxlQUFVRSxRQUFWLEVBQW9CO0FBQ3ZCLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsUUFBcEI7QUFDSDtBQUhFLFNBUkk7QUFhWEUsb0JBQVk7QUFDUjtBQURRO0FBYkQsSyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL1NlYXJjaEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b21zL0lucHV0JztcblxuY29uc3Qgc2VhcmNoSW5wdXRUZW1wbGF0ZSA9IGBcbiAgICA8cGUtdGV4dC1pbnB1dFxuICAgICAgICA6Y2xhc3Nlcz1cInNlYXJjaGlucHV0LmNsYXNzXCJcbiAgICAgICAgOnBsYWNlaG9sZGVyPVwic2VhcmNoaW5wdXQucGxhY2VIb2xkZXJcIlxuICAgICAgICA6dHlwZT1cInNlYXJjaGlucHV0LnR5cGVcIlxuICAgICAgICB2LW1vZGVsPVwiVmFsdWVcIlxuICAgICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dF9faWNvbiBpY29uLW1hZ25pZnlpbmctZ2xhc3NcIiBzbG90PVwiaWNvblwiPjwvZGl2PlxuICAgIDwvcGUtdGV4dC1pbnB1dD5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0ZW1wbGF0ZTogc2VhcmNoSW5wdXRUZW1wbGF0ZSxcbiAgICBwcm9wczogWydzZWFyY2hpbnB1dCddLFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFZhbHVlOiBcIlwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICAgIFZhbHVlOiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdwZS10ZXh0LWlucHV0JzogSW5wdXRcbiAgICB9XG59Il19
