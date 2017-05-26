'use strict';

var checkboxTemplate = '\n<div class="checkbox" :class="classes">\n    <input class="checkbox__input" type="checkbox" :id="id" :value="formvalue" @change="changed">    \n    <label class="checkbox__label" :for="id"><span>{{text}}</span></label>\n</div>\n';
var checkboxComponent = {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWNrYm94LmpzIl0sIm5hbWVzIjpbImNoZWNrYm94VGVtcGxhdGUiLCJjaGVja2JveENvbXBvbmVudCIsInRlbXBsYXRlIiwicHJvcHMiLCJtZXRob2RzIiwiY2hhbmdlZCIsImV2ZW50IiwiaXNDaGVja2VkIiwidGFyZ2V0IiwiY2hlY2tlZCIsIiRlbWl0IiwiZm9ybXZhbHVlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLDJQQUFOO0FBTUEsSUFBTUMsb0JBQW9CO0FBQ3RCQyxjQUFVRixnQkFEWTtBQUV0QjtBQUNBRyxXQUFPLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxTQUFmLEVBQTBCLFdBQTFCLENBSGU7QUFJdEJDLGFBQVM7QUFDTEMsaUJBQVMsaUJBQVVDLEtBQVYsRUFBaUI7QUFDdEIsZ0JBQUlDLFlBQVlELE1BQU1FLE1BQU4sQ0FBYUMsT0FBN0I7QUFDQSxnQkFBSUYsU0FBSixFQUFlO0FBQ1gscUJBQUtHLEtBQUwsQ0FBVyxPQUFYLEVBQXFCLEtBQUtDLFNBQTFCO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUtELEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUtDLFNBQUwsR0FBaUIsR0FBckM7QUFDSDtBQUNKO0FBUkk7QUFKYSxDQUExQiIsImZpbGUiOiJjaGVja2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiY2hlY2tib3hcIiA6Y2xhc3M9XCJjbGFzc2VzXCI+XG4gICAgPGlucHV0IGNsYXNzPVwiY2hlY2tib3hfX2lucHV0XCIgdHlwZT1cImNoZWNrYm94XCIgOmlkPVwiaWRcIiA6dmFsdWU9XCJmb3JtdmFsdWVcIiBAY2hhbmdlPVwiY2hhbmdlZFwiPiAgICBcbiAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveF9fbGFiZWxcIiA6Zm9yPVwiaWRcIj48c3Bhbj5cXHt7dGV4dH19PC9zcGFuPjwvbGFiZWw+XG48L2Rpdj5cbmA7XG5jb25zdCBjaGVja2JveENvbXBvbmVudCA9IHtcbiAgICB0ZW1wbGF0ZTogY2hlY2tib3hUZW1wbGF0ZSxcbiAgICAvLyBuYW1lOiAnY2hlY2tib3gtY29tcG9uZW50JyxcbiAgICBwcm9wczogWyd0ZXh0JywgJ2lkJywgJ2NsYXNzZXMnLCAnZm9ybXZhbHVlJ10sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpc0NoZWNrZWQgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICh0aGlzLmZvcm12YWx1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuZm9ybXZhbHVlICsgXCIqXCIpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
