define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var selectTemplate = '\n<div @click="toggleSelect" class="select" :class="[isActiveClass, classes]">\n    <span class="select__placeholder" :class="isChosenClass">{{ selectedOption }}</span>\n    <div class="select__border"></div>\n    <ul class="select__options">\n        <li class="select__option" v-for="option in options" @click="selectOption($event, option)">{{option}}\n            <div></div>\n        </li>\n    </ul>\n</div>\n';

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
                },
                isChosenClass: {
                    'is-chosen': false
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
                if (this.selectedOption !== this.placeholdertext) {
                    this.isChosenClass['is-chosen'] = true;
                }
                this.selectedOption = option;
                this.$emit('input', this.selectedOption);
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9TZWxlY3QuanMiXSwibmFtZXMiOlsic2VsZWN0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInByb3BzIiwiZGF0YSIsInNlbGVjdGVkT3B0aW9uIiwicGxhY2Vob2xkZXJ0ZXh0IiwiaXNBY3RpdmVDbGFzcyIsImlzQ2hvc2VuQ2xhc3MiLCJtZXRob2RzIiwidG9nZ2xlU2VsZWN0IiwiYWN0aXZlIiwic2VsZWN0T3B0aW9uIiwiZXZlbnQiLCJvcHRpb24iLCIkZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBTUEsaWJBQU47O0FBWUE7QUFDQTtBQUNBO0FBQ0E7O3NCQUVlO0FBQ1hDLGtCQUFVRCxjQURDO0FBRVhFLGVBQU8sQ0FBQyxpQkFBRCxFQUFvQixTQUFwQixFQUErQixTQUEvQixDQUZJO0FBR1hDLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQyxnQ0FBZ0IsS0FBS0MsZUFEbEI7QUFFSEMsK0JBQWU7QUFDWCxpQ0FBYTtBQURGLGlCQUZaO0FBS0hDLCtCQUFlO0FBQ1gsaUNBQWE7QUFERjtBQUxaLGFBQVA7QUFTSCxTQWJVO0FBY1hDLGlCQUFTO0FBQ0xDLDBCQUFjLHdCQUFZO0FBQ3RCLG9CQUFJQyxTQUFTLEtBQUtKLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBYjtBQUNBLG9CQUFJSSxNQUFKLEVBQVk7QUFDUix5QkFBS0osYUFBTCxDQUFtQixXQUFuQixJQUFrQyxLQUFsQztBQUNILGlCQUZELE1BRU87QUFDSCx5QkFBS0EsYUFBTCxDQUFtQixXQUFuQixJQUFrQyxJQUFsQztBQUNIO0FBQ0osYUFSSTtBQVNMSywwQkFBYyxzQkFBVUMsS0FBVixFQUFpQkMsTUFBakIsRUFBeUI7QUFDbkMsb0JBQUksS0FBS1QsY0FBTCxLQUF3QixLQUFLQyxlQUFqQyxFQUFrRDtBQUM5Qyx5QkFBS0UsYUFBTCxDQUFtQixXQUFuQixJQUFrQyxJQUFsQztBQUNIO0FBQ0QscUJBQUtILGNBQUwsR0FBc0JTLE1BQXRCO0FBQ0EscUJBQUtDLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUtWLGNBQXpCO0FBQ0g7QUFmSTtBQWRFLEsiLCJmaWxlIjoiYXBwL2F0b21zL1NlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNlbGVjdFRlbXBsYXRlID0gYFxuPGRpdiBAY2xpY2s9XCJ0b2dnbGVTZWxlY3RcIiBjbGFzcz1cInNlbGVjdFwiIDpjbGFzcz1cIltpc0FjdGl2ZUNsYXNzLCBjbGFzc2VzXVwiPlxuICAgIDxzcGFuIGNsYXNzPVwic2VsZWN0X19wbGFjZWhvbGRlclwiIDpjbGFzcz1cImlzQ2hvc2VuQ2xhc3NcIj5cXHt7IHNlbGVjdGVkT3B0aW9uIH19PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RfX2JvcmRlclwiPjwvZGl2PlxuICAgIDx1bCBjbGFzcz1cInNlbGVjdF9fb3B0aW9uc1wiPlxuICAgICAgICA8bGkgY2xhc3M9XCJzZWxlY3RfX29wdGlvblwiIHYtZm9yPVwib3B0aW9uIGluIG9wdGlvbnNcIiBAY2xpY2s9XCJzZWxlY3RPcHRpb24oJGV2ZW50LCBvcHRpb24pXCI+XFx7e29wdGlvbn19XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICA8L2xpPlxuICAgIDwvdWw+XG48L2Rpdj5cbmA7XG5cbi8vIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3RfX2lucHV0XCI+XG4vLyAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIGRpc2FibGVkIHNlbGVjdGVkPlxce3twbGFjZWhvbGRlcn19PC9vcHRpb24+XG4vLyAgICAgPG9wdGlvbiB2YWx1ZT1cIjFcIiB2LWZvcj1cIm9wdGlvbiBpbiBvcHRpb25zXCI+XFx7e29wdGlvbn19PC9vcHRpb24+XG4vLyA8L3NlbGVjdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHRlbXBsYXRlOiBzZWxlY3RUZW1wbGF0ZSxcbiAgICBwcm9wczogWydwbGFjZWhvbGRlcnRleHQnLCAnb3B0aW9ucycsICdjbGFzc2VzJ10sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb246IHRoaXMucGxhY2Vob2xkZXJ0ZXh0LFxuICAgICAgICAgICAgaXNBY3RpdmVDbGFzczoge1xuICAgICAgICAgICAgICAgICdpcy1hY3RpdmUnOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQ2hvc2VuQ2xhc3M6IHtcbiAgICAgICAgICAgICAgICAnaXMtY2hvc2VuJzogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICB0b2dnbGVTZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLmlzQWN0aXZlQ2xhc3NbJ2lzLWFjdGl2ZSddO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVDbGFzc1snaXMtYWN0aXZlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUNsYXNzWydpcy1hY3RpdmUnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdE9wdGlvbjogZnVuY3Rpb24gKGV2ZW50LCBvcHRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT3B0aW9uICE9PSB0aGlzLnBsYWNlaG9sZGVydGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDaG9zZW5DbGFzc1snaXMtY2hvc2VuJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5zZWxlY3RlZE9wdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59Il19
