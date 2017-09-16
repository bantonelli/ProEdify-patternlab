define(['exports', '../../utils/vue-popper2'], function (exports, _vuePopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vuePopper2 = _interopRequireDefault(_vuePopper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var selectDropdownTemplate = '\n<div\n  class="select__dropdown"\n  :class="[{ \'is-multiple\': $parent.multiple }, popperClass]"\n  :style="{ minWidth: minWidth }">\n  <slot></slot>\n</div>\n'; // import Popper from '../../utils/vue-popper';
  exports.default = {
    name: 'SelectDropdown',

    template: selectDropdownTemplate,

    componentName: 'SelectDropdown',

    mixins: [_vuePopper2.default],

    data: function data() {
      return {
        minWidth: ''
      };
    },


    // Need for new popper 
    computed: {
      popperClass: function popperClass() {
        return this.$parent.popperClass;
      }
    },

    // Need for new popper
    watch: {
      '$parent.inputWidth': function $parentInputWidth() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
      }
    },

    mounted: function mounted() {
      var _this = this;

      // this.referenceElm = this.$parent.$refs.reference.$el;
      // this.$parent.popperElm = this.popperElm = this.$el;
      // console.log("Reference Element Mounted", this.$parent.$refs);
      // this.referenceElm = this.$parent.$refs.reference.$el; OLD vue-popper     
      // this.$parent.popperElm = this.popperElm = this.$el; OLD vue-popper


      // updatePopper event comes from Enhanced Select
      this.$on('updatePopper', function () {
        if (_this.$parent.visible) _this.updatePopper();
      });

      // destroyPopper event comes from Enhanced Select
      this.$on('destroyPopper', this.doDestroy());
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvU2VsZWN0RHJvcGRvd24uanMiXSwibmFtZXMiOlsic2VsZWN0RHJvcGRvd25UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJkYXRhIiwibWluV2lkdGgiLCJjb21wdXRlZCIsInBvcHBlckNsYXNzIiwiJHBhcmVudCIsIndhdGNoIiwiJGVsIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwid2lkdGgiLCJtb3VudGVkIiwiJG9uIiwidmlzaWJsZSIsInVwZGF0ZVBvcHBlciIsImRvRGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBSUEsNkxBQUosQyxDQUhBO29CQVllO0FBQ2JDLFVBQU0sZ0JBRE87O0FBR2JDLGNBQVVGLHNCQUhHOztBQUtiRyxtQkFBZSxnQkFMRjs7QUFPYkMsWUFBUSxxQkFQSzs7QUFVYkMsUUFWYSxrQkFVTjtBQUNMLGFBQU87QUFDTEMsa0JBQVU7QUFETCxPQUFQO0FBR0QsS0FkWTs7O0FBZ0JiO0FBQ0FDLGNBQVU7QUFDUkMsaUJBRFEseUJBQ007QUFDWixlQUFPLEtBQUtDLE9BQUwsQ0FBYUQsV0FBcEI7QUFDRDtBQUhPLEtBakJHOztBQXVCYjtBQUNBRSxXQUFPO0FBQ0wsMEJBREssK0JBQ2tCO0FBQ3JCLGFBQUtKLFFBQUwsR0FBZ0IsS0FBS0csT0FBTCxDQUFhRSxHQUFiLENBQWlCQyxxQkFBakIsR0FBeUNDLEtBQXpDLEdBQWlELElBQWpFO0FBQ0Q7QUFISSxLQXhCTTs7QUE4QmJDLFdBOUJhLHFCQThCSDtBQUFBOztBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsV0FBS0MsR0FBTCxDQUFTLGNBQVQsRUFBeUIsWUFBTTtBQUM3QixZQUFJLE1BQUtOLE9BQUwsQ0FBYU8sT0FBakIsRUFBMEIsTUFBS0MsWUFBTDtBQUMzQixPQUZEOztBQUlBO0FBQ0EsV0FBS0YsR0FBTCxDQUFTLGVBQVQsRUFBMEIsS0FBS0csU0FBTCxFQUExQjtBQUNEO0FBN0NZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9FbmhhbmNlZFNlbGVjdC9TZWxlY3REcm9wZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBQb3BwZXIgZnJvbSAnLi4vLi4vdXRpbHMvdnVlLXBvcHBlcic7XG5pbXBvcnQgUG9wcGVyIGZyb20gJy4uLy4uL3V0aWxzL3Z1ZS1wb3BwZXIyJztcblxubGV0IHNlbGVjdERyb3Bkb3duVGVtcGxhdGUgPSBgXG48ZGl2XG4gIGNsYXNzPVwic2VsZWN0X19kcm9wZG93blwiXG4gIDpjbGFzcz1cIlt7ICdpcy1tdWx0aXBsZSc6ICRwYXJlbnQubXVsdGlwbGUgfSwgcG9wcGVyQ2xhc3NdXCJcbiAgOnN0eWxlPVwieyBtaW5XaWR0aDogbWluV2lkdGggfVwiPlxuICA8c2xvdD48L3Nsb3Q+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ1NlbGVjdERyb3Bkb3duJyxcblxuICB0ZW1wbGF0ZTogc2VsZWN0RHJvcGRvd25UZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnU2VsZWN0RHJvcGRvd24nLFxuXG4gIG1peGluczogW1BvcHBlcl0sXG5cbiAgLy8gTmVlZCBmb3IgbmV3IHBvcHBlclxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtaW5XaWR0aDogJydcbiAgICB9O1xuICB9LFxuXG4gIC8vIE5lZWQgZm9yIG5ldyBwb3BwZXIgXG4gIGNvbXB1dGVkOiB7XG4gICAgcG9wcGVyQ2xhc3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LnBvcHBlckNsYXNzO1xuICAgIH1cbiAgfSxcblxuICAvLyBOZWVkIGZvciBuZXcgcG9wcGVyXG4gIHdhdGNoOiB7XG4gICAgJyRwYXJlbnQuaW5wdXRXaWR0aCcoKSB7XG4gICAgICB0aGlzLm1pbldpZHRoID0gdGhpcy4kcGFyZW50LiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArICdweCc7XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRwYXJlbnQuJHJlZnMucmVmZXJlbmNlLiRlbDtcbiAgICAvLyB0aGlzLiRwYXJlbnQucG9wcGVyRWxtID0gdGhpcy5wb3BwZXJFbG0gPSB0aGlzLiRlbDtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlJlZmVyZW5jZSBFbGVtZW50IE1vdW50ZWRcIiwgdGhpcy4kcGFyZW50LiRyZWZzKTtcbiAgICAvLyB0aGlzLnJlZmVyZW5jZUVsbSA9IHRoaXMuJHBhcmVudC4kcmVmcy5yZWZlcmVuY2UuJGVsOyBPTEQgdnVlLXBvcHBlciAgICAgXG4gICAgLy8gdGhpcy4kcGFyZW50LnBvcHBlckVsbSA9IHRoaXMucG9wcGVyRWxtID0gdGhpcy4kZWw7IE9MRCB2dWUtcG9wcGVyXG5cblxuICAgIC8vIHVwZGF0ZVBvcHBlciBldmVudCBjb21lcyBmcm9tIEVuaGFuY2VkIFNlbGVjdFxuICAgIHRoaXMuJG9uKCd1cGRhdGVQb3BwZXInLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy4kcGFyZW50LnZpc2libGUpIHRoaXMudXBkYXRlUG9wcGVyKCk7XG4gICAgfSk7XG5cbiAgICAvLyBkZXN0cm95UG9wcGVyIGV2ZW50IGNvbWVzIGZyb20gRW5oYW5jZWQgU2VsZWN0XG4gICAgdGhpcy4kb24oJ2Rlc3Ryb3lQb3BwZXInLCB0aGlzLmRvRGVzdHJveSgpKTtcbiAgfVxufTtcbiJdfQ==
