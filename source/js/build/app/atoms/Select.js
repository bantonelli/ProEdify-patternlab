define(['exports', 'lodash'], function (exports, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var selectTemplate = '\n<div @click="toggleSelect" class="select" :class="classes">\n    <span class="select__placeholder" :class="isChosenClass">{{ selectedOption }}</span>\n    <div class="select__border"></div>\n    <ul class="select__options">\n        <li class="select__option" v-for="option in options" @click="selectOption($event, option)">{{option}}\n            <div></div>\n        </li>\n    </ul>\n</div>\n';

    // <select class="select__input">
    //     <option value="" disabled selected>\{{placeholder}}</option>
    //     <option value="1" v-for="option in options">\{{option}}</option>
    // </select>

    exports.default = {
        template: selectTemplate,
        props: {
            placeholder: {
                default: "Basic Select Input"
            },
            options: {
                type: Array,
                default: ['Option 1', 'Option 2', 'Option 3']
            },
            modifierStyles: {
                type: Array,
                default: null
            }
        },
        data: function data() {
            return {
                selectedOption: this.placeholder,
                isActiveClass: {
                    'is-active': false
                },
                isChosenClass: {
                    'is-chosen': false
                }
            };
        },
        computed: {
            classes: function classes() {
                return _lodash2.default.concat(this.modifierStyles, this.isActiveClass);
            }
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
                if (this.selectedOption !== this.placeholder) {
                    this.isChosenClass['is-chosen'] = true;
                }
                this.selectedOption = option;
                this.$emit('input', this.selectedOption);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9TZWxlY3QuanMiXSwibmFtZXMiOlsic2VsZWN0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInByb3BzIiwicGxhY2Vob2xkZXIiLCJkZWZhdWx0Iiwib3B0aW9ucyIsInR5cGUiLCJBcnJheSIsIm1vZGlmaWVyU3R5bGVzIiwiZGF0YSIsInNlbGVjdGVkT3B0aW9uIiwiaXNBY3RpdmVDbGFzcyIsImlzQ2hvc2VuQ2xhc3MiLCJjb21wdXRlZCIsImNsYXNzZXMiLCJjb25jYXQiLCJtZXRob2RzIiwidG9nZ2xlU2VsZWN0IiwiYWN0aXZlIiwic2VsZWN0T3B0aW9uIiwiZXZlbnQiLCJvcHRpb24iLCIkZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBTUEsZ2FBQU47O0FBWUE7QUFDQTtBQUNBO0FBQ0E7O3NCQUllO0FBQ1hDLGtCQUFVRCxjQURDO0FBRVhFLGVBQU87QUFDSEMseUJBQWE7QUFDVEMseUJBQVM7QUFEQSxhQURWO0FBSUhDLHFCQUFTO0FBQ0xDLHNCQUFNQyxLQUREO0FBRUxILHlCQUFTLENBQ0wsVUFESyxFQUVMLFVBRkssRUFHTCxVQUhLO0FBRkosYUFKTjtBQVlISSw0QkFBZ0I7QUFDWkYsc0JBQU1DLEtBRE07QUFFWkgseUJBQVM7QUFGRztBQVpiLFNBRkk7QUFtQlhLLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQyxnQ0FBZ0IsS0FBS1AsV0FEbEI7QUFFSFEsK0JBQWU7QUFDWCxpQ0FBYTtBQURGLGlCQUZaO0FBS0hDLCtCQUFlO0FBQ1gsaUNBQWE7QUFERjtBQUxaLGFBQVA7QUFTSCxTQTdCVTtBQThCWEMsa0JBQVU7QUFDTkMscUJBQVMsbUJBQVk7QUFDakIsdUJBQU8saUJBQUVDLE1BQUYsQ0FBUyxLQUFLUCxjQUFkLEVBQThCLEtBQUtHLGFBQW5DLENBQVA7QUFDSDtBQUhLLFNBOUJDO0FBbUNYSyxpQkFBUztBQUNMQywwQkFBYyx3QkFBWTtBQUN0QixvQkFBSUMsU0FBUyxLQUFLUCxhQUFMLENBQW1CLFdBQW5CLENBQWI7QUFDQSxvQkFBSU8sTUFBSixFQUFZO0FBQ1IseUJBQUtQLGFBQUwsQ0FBbUIsV0FBbkIsSUFBa0MsS0FBbEM7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUtBLGFBQUwsQ0FBbUIsV0FBbkIsSUFBa0MsSUFBbEM7QUFDSDtBQUNKLGFBUkk7QUFTTFEsMEJBQWMsc0JBQVVDLEtBQVYsRUFBaUJDLE1BQWpCLEVBQXlCO0FBQ25DLG9CQUFJLEtBQUtYLGNBQUwsS0FBd0IsS0FBS1AsV0FBakMsRUFBOEM7QUFDMUMseUJBQUtTLGFBQUwsQ0FBbUIsV0FBbkIsSUFBa0MsSUFBbEM7QUFDSDtBQUNELHFCQUFLRixjQUFMLEdBQXNCVyxNQUF0QjtBQUNBLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQixLQUFLWixjQUF6QjtBQUNIO0FBZkk7QUFuQ0UsSyIsImZpbGUiOiJhcHAvYXRvbXMvU2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2VsZWN0VGVtcGxhdGUgPSBgXG48ZGl2IEBjbGljaz1cInRvZ2dsZVNlbGVjdFwiIGNsYXNzPVwic2VsZWN0XCIgOmNsYXNzPVwiY2xhc3Nlc1wiPlxuICAgIDxzcGFuIGNsYXNzPVwic2VsZWN0X19wbGFjZWhvbGRlclwiIDpjbGFzcz1cImlzQ2hvc2VuQ2xhc3NcIj5cXHt7IHNlbGVjdGVkT3B0aW9uIH19PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RfX2JvcmRlclwiPjwvZGl2PlxuICAgIDx1bCBjbGFzcz1cInNlbGVjdF9fb3B0aW9uc1wiPlxuICAgICAgICA8bGkgY2xhc3M9XCJzZWxlY3RfX29wdGlvblwiIHYtZm9yPVwib3B0aW9uIGluIG9wdGlvbnNcIiBAY2xpY2s9XCJzZWxlY3RPcHRpb24oJGV2ZW50LCBvcHRpb24pXCI+XFx7e29wdGlvbn19XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICA8L2xpPlxuICAgIDwvdWw+XG48L2Rpdj5cbmA7XG5cbi8vIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3RfX2lucHV0XCI+XG4vLyAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIGRpc2FibGVkIHNlbGVjdGVkPlxce3twbGFjZWhvbGRlcn19PC9vcHRpb24+XG4vLyAgICAgPG9wdGlvbiB2YWx1ZT1cIjFcIiB2LWZvcj1cIm9wdGlvbiBpbiBvcHRpb25zXCI+XFx7e29wdGlvbn19PC9vcHRpb24+XG4vLyA8L3NlbGVjdD5cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiBzZWxlY3RUZW1wbGF0ZSxcbiAgICBwcm9wczoge1xuICAgICAgICBwbGFjZWhvbGRlcjogeyBcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiQmFzaWMgU2VsZWN0IElucHV0XCJcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICBkZWZhdWx0OiBbXG4gICAgICAgICAgICAgICAgJ09wdGlvbiAxJyxcbiAgICAgICAgICAgICAgICAnT3B0aW9uIDInLFxuICAgICAgICAgICAgICAgICdPcHRpb24gMydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZpZXJTdHlsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LCBcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb246IHRoaXMucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICBpc0FjdGl2ZUNsYXNzOiB7XG4gICAgICAgICAgICAgICAgJ2lzLWFjdGl2ZSc6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNDaG9zZW5DbGFzczoge1xuICAgICAgICAgICAgICAgICdpcy1jaG9zZW4nOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgICBjbGFzc2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5jb25jYXQodGhpcy5tb2RpZmllclN0eWxlcywgdGhpcy5pc0FjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICB0b2dnbGVTZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLmlzQWN0aXZlQ2xhc3NbJ2lzLWFjdGl2ZSddO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVDbGFzc1snaXMtYWN0aXZlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUNsYXNzWydpcy1hY3RpdmUnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdE9wdGlvbjogZnVuY3Rpb24gKGV2ZW50LCBvcHRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT3B0aW9uICE9PSB0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Nob3NlbkNsYXNzWydpcy1jaG9zZW4nXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uID0gb3B0aW9uO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLnNlbGVjdGVkT3B0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
