define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var selectTemplate = '\n<div @click="toggleSelect" class="select" :class="[isActiveClass, classes]">\n    <span class="select__placeholder">{{ selectedOption }}</span>\n    <ul class="select__options">\n        <li class="select__option" v-for="option in options" @click="selectOption($event, option)">{{option}}</li>\n    </ul>\n</div>\n';

    // <select class="select__input">
    //     <option value="" disabled selected>\{{placeholder}}</option>
    //     <option value="1" v-for="option in options">\{{option}}</option>
    // </select>

    exports.default = {
        template: selectTemplate,
        props: ['placeholdertext', 'options', 'classes'],
        data: function data() {
            return {
                selectedOption: this.placeholdertext,
                isActiveClass: {
                    'is-active': false
                }
            };
        },
        methods: {
            toggleSelect: function toggleSelect() {
                var active = this.isActiveClass['is-active'];
                if (active) {
                    this.isActiveClass['is-active'] = false;
                } else {
                    this.isActiveClass['is-active'] = true;
                }
            },
            selectOption: function selectOption(event, option) {
                // console.log('Event: ', event);
                // console.log('Option: ', option);
                this.selectedOption = option;
                this.$emit('input', this.selectedOption);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9TZWxlY3QuanMiXSwibmFtZXMiOlsic2VsZWN0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInByb3BzIiwiZGF0YSIsInNlbGVjdGVkT3B0aW9uIiwicGxhY2Vob2xkZXJ0ZXh0IiwiaXNBY3RpdmVDbGFzcyIsIm1ldGhvZHMiLCJ0b2dnbGVTZWxlY3QiLCJhY3RpdmUiLCJzZWxlY3RPcHRpb24iLCJldmVudCIsIm9wdGlvbiIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFNQSwrVUFBTjs7QUFTQTtBQUNBO0FBQ0E7QUFDQTs7c0JBRWU7QUFDWEMsa0JBQVVELGNBREM7QUFFWEUsZUFBTyxDQUFDLGlCQUFELEVBQW9CLFNBQXBCLEVBQStCLFNBQS9CLENBRkk7QUFHWEMsY0FBTSxnQkFBWTtBQUNkLG1CQUFPO0FBQ0hDLGdDQUFnQixLQUFLQyxlQURsQjtBQUVIQywrQkFBZTtBQUNYLGlDQUFhO0FBREY7QUFGWixhQUFQO0FBTUgsU0FWVTtBQVdYQyxpQkFBUztBQUNMQywwQkFBYyx3QkFBWTtBQUN0QixvQkFBSUMsU0FBUyxLQUFLSCxhQUFMLENBQW1CLFdBQW5CLENBQWI7QUFDQSxvQkFBSUcsTUFBSixFQUFZO0FBQ1IseUJBQUtILGFBQUwsQ0FBbUIsV0FBbkIsSUFBa0MsS0FBbEM7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUtBLGFBQUwsQ0FBbUIsV0FBbkIsSUFBa0MsSUFBbEM7QUFDSDtBQUNKLGFBUkk7QUFTTEksMEJBQWMsc0JBQVVDLEtBQVYsRUFBaUJDLE1BQWpCLEVBQXlCO0FBQ25DO0FBQ0E7QUFDQSxxQkFBS1IsY0FBTCxHQUFzQlEsTUFBdEI7QUFDQSxxQkFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0IsS0FBS1QsY0FBekI7QUFDSDtBQWRJO0FBWEUsSyIsImZpbGUiOiJhcHAvYXRvbXMvU2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2VsZWN0VGVtcGxhdGUgPSBgXG48ZGl2IEBjbGljaz1cInRvZ2dsZVNlbGVjdFwiIGNsYXNzPVwic2VsZWN0XCIgOmNsYXNzPVwiW2lzQWN0aXZlQ2xhc3MsIGNsYXNzZXNdXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJzZWxlY3RfX3BsYWNlaG9sZGVyXCI+XFx7eyBzZWxlY3RlZE9wdGlvbiB9fTwvc3Bhbj5cbiAgICA8dWwgY2xhc3M9XCJzZWxlY3RfX29wdGlvbnNcIj5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VsZWN0X19vcHRpb25cIiB2LWZvcj1cIm9wdGlvbiBpbiBvcHRpb25zXCIgQGNsaWNrPVwic2VsZWN0T3B0aW9uKCRldmVudCwgb3B0aW9uKVwiPlxce3tvcHRpb259fTwvbGk+XG4gICAgPC91bD5cbjwvZGl2PlxuYDtcblxuLy8gPHNlbGVjdCBjbGFzcz1cInNlbGVjdF9faW5wdXRcIj5cbi8vICAgICA8b3B0aW9uIHZhbHVlPVwiXCIgZGlzYWJsZWQgc2VsZWN0ZWQ+XFx7e3BsYWNlaG9sZGVyfX08L29wdGlvbj5cbi8vICAgICA8b3B0aW9uIHZhbHVlPVwiMVwiIHYtZm9yPVwib3B0aW9uIGluIG9wdGlvbnNcIj5cXHt7b3B0aW9ufX08L29wdGlvbj5cbi8vIDwvc2VsZWN0PlxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IHNlbGVjdFRlbXBsYXRlLFxuICAgIHByb3BzOiBbJ3BsYWNlaG9sZGVydGV4dCcsICdvcHRpb25zJywgJ2NsYXNzZXMnXSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbjogdGhpcy5wbGFjZWhvbGRlcnRleHQsXG4gICAgICAgICAgICBpc0FjdGl2ZUNsYXNzOiB7XG4gICAgICAgICAgICAgICAgJ2lzLWFjdGl2ZSc6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgdG9nZ2xlU2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlID0gdGhpcy5pc0FjdGl2ZUNsYXNzWydpcy1hY3RpdmUnXTtcbiAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlQ2xhc3NbJ2lzLWFjdGl2ZSddID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVDbGFzc1snaXMtYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RPcHRpb246IGZ1bmN0aW9uIChldmVudCwgb3B0aW9uKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnRXZlbnQ6ICcsIGV2ZW50KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdPcHRpb246ICcsIG9wdGlvbik7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uID0gb3B0aW9uO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLnNlbGVjdGVkT3B0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
