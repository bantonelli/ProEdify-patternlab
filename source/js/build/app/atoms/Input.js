define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inputTemplate = '\n<div class="input" :class="classes">\n    <input :type="type" class="input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>\n    <div class="input__border"></div>\n    <slot name="icon"></slot>\n</div>\n';

    exports.default = {
        template: inputTemplate,
        // name: 'checkbox-component',
        props: ['placeholder', 'classes', 'type'],
        methods: {
            changed: function changed(event) {
                var value = event.target.value;
                this.$emit('input', value);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC5qcyJdLCJuYW1lcyI6WyJpbnB1dFRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJ2YWx1ZSIsInRhcmdldCIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSw0UEFBTjs7c0JBUWU7QUFDWEMsa0JBQVVELGFBREM7QUFFWDtBQUNBRSxlQUFPLENBQUMsYUFBRCxFQUFnQixTQUFoQixFQUEyQixNQUEzQixDQUhJO0FBSVhDLGlCQUFTO0FBQ0xDLHFCQUFTLGlCQUFVQyxLQUFWLEVBQWlCO0FBQ3RCLG9CQUFJQyxRQUFRRCxNQUFNRSxNQUFOLENBQWFELEtBQXpCO0FBQ0EscUJBQUtFLEtBQUwsQ0FBVyxPQUFYLEVBQW9CRixLQUFwQjtBQUNIO0FBSkk7QUFKRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlucHV0VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiaW5wdXRcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGlucHV0IDp0eXBlPVwidHlwZVwiIGNsYXNzPVwiaW5wdXRfX2lucHV0XCIgQGtleXVwPVwiY2hhbmdlZFwiIDpwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyXCIgcGF0dGVybj1cIi57Mix9XCIgcmVxdWlyZWQ+XG4gICAgPGRpdiBjbGFzcz1cImlucHV0X19ib3JkZXJcIj48L2Rpdj5cbiAgICA8c2xvdCBuYW1lPVwiaWNvblwiPjwvc2xvdD5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiBpbnB1dFRlbXBsYXRlLFxuICAgIC8vIG5hbWU6ICdjaGVja2JveC1jb21wb25lbnQnLFxuICAgIHByb3BzOiBbJ3BsYWNlaG9sZGVyJywgJ2NsYXNzZXMnLCAndHlwZSddLFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKTsgICAgXG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
