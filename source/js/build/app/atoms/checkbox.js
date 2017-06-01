define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var checkboxTemplate = '\n<div class="checkbox" :class="classes">\n    <input class="checkbox__input" type="checkbox" :id="id" :value="formvalue" @change="changed">    \n    <label class="checkbox__label" :for="id"><span>{{text}}</span></label>\n</div>\n';
    exports.default = {
        template: checkboxTemplate,
        // name: 'checkbox-component',
        props: ['text', 'id', 'classes', 'formvalue'],
        methods: {
            changed: function changed(event) {
                var isChecked = event.target.checked;
                if (isChecked) {
                    this.$emit('input', this.formvalue);
                } else {
                    this.$emit('input', this.formvalue + "*");
                }
            }
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9DaGVja2JveC5qcyJdLCJuYW1lcyI6WyJjaGVja2JveFRlbXBsYXRlIiwidGVtcGxhdGUiLCJwcm9wcyIsIm1ldGhvZHMiLCJjaGFuZ2VkIiwiZXZlbnQiLCJpc0NoZWNrZWQiLCJ0YXJnZXQiLCJjaGVja2VkIiwiJGVtaXQiLCJmb3JtdmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQU1BLDJQQUFOO3NCQU1lO0FBQ1hDLGtCQUFVRCxnQkFEQztBQUVYO0FBQ0FFLGVBQU8sQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEIsV0FBMUIsQ0FISTtBQUlYQyxpQkFBUztBQUNMQyxxQkFBUyxpQkFBVUMsS0FBVixFQUFpQjtBQUN0QixvQkFBSUMsWUFBWUQsTUFBTUUsTUFBTixDQUFhQyxPQUE3QjtBQUNBLG9CQUFJRixTQUFKLEVBQWU7QUFDWCx5QkFBS0csS0FBTCxDQUFXLE9BQVgsRUFBcUIsS0FBS0MsU0FBMUI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUtELEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUtDLFNBQUwsR0FBaUIsR0FBckM7QUFDSDtBQUNKO0FBUkk7QUFKRSxLIiwiZmlsZSI6ImFwcC9hdG9tcy9DaGVja2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiY2hlY2tib3hcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGlucHV0IGNsYXNzPVwiY2hlY2tib3hfX2lucHV0XCIgdHlwZT1cImNoZWNrYm94XCIgOmlkPVwiaWRcIiA6dmFsdWU9XCJmb3JtdmFsdWVcIiBAY2hhbmdlPVwiY2hhbmdlZFwiPiAgICBcbiAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveF9fbGFiZWxcIiA6Zm9yPVwiaWRcIj48c3Bhbj5cXHt7dGV4dH19PC9zcGFuPjwvbGFiZWw+XG48L2Rpdj5cbmA7XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IGNoZWNrYm94VGVtcGxhdGUsXG4gICAgLy8gbmFtZTogJ2NoZWNrYm94LWNvbXBvbmVudCcsXG4gICAgcHJvcHM6IFsndGV4dCcsICdpZCcsICdjbGFzc2VzJywgJ2Zvcm12YWx1ZSddLFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaXNDaGVja2VkID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICBpZiAoaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCAodGhpcy5mb3JtdmFsdWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmZvcm12YWx1ZSArIFwiKlwiKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfVxufTsiXX0=
