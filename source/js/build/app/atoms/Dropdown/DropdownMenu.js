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

  var dropdownMenuTemplate = '\n<div class="dropdown__menu" @click="menuClick">\n    <slot></slot>    \n</div>\n'; // import Popper from '../../utils/vue-popper';
  exports.default = {
    name: 'DropdownMenu',

    template: dropdownMenuTemplate,

    componentName: 'DropdownMenu',

    mixins: [_vuePopper2.default],

    data: function data() {
      return {};
    },


    computed: {},

    watch: {},

    methods: {
      menuClick: function menuClick(e) {
        if (this.$parent.triggerReferenceOnly) {
          this.stopProp(e);
        }
      },
      stopProp: function stopProp(e) {
        console.log("STOP PROP");
        e.stopPropagation();
      }
    },

    mounted: function mounted() {
      // this.referenceElm = this.$parent.$refs.reference.$el;
      // this.$parent.popperElm = this.popperElm = this.$el;
      // console.log("Reference Element Mounted", this.$parent.$refs);
      // this.referenceElm = this.$parent.$refs.reference.$el; OLD vue-popper     
      // this.$parent.popperElm = this.popperElm = this.$el; OLD vue-popper


      // // updatePopper event comes from Enhanced Select
      // this.$on('updatePopper', this.updatePopper());

      // // destroyPopper event comes from Enhanced Select
      // this.$on('destroyPopper', this.doDestroy());

      // console.log(this.$parent);
    },
    beforeDestroy: function beforeDestroy() {
      console.log("DROPDOWN MENU DESTROYED");
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9Ecm9wZG93bi9Ecm9wZG93bk1lbnUuanMiXSwibmFtZXMiOlsiZHJvcGRvd25NZW51VGVtcGxhdGUiLCJuYW1lIiwidGVtcGxhdGUiLCJjb21wb25lbnROYW1lIiwibWl4aW5zIiwiZGF0YSIsImNvbXB1dGVkIiwid2F0Y2giLCJtZXRob2RzIiwibWVudUNsaWNrIiwiZSIsIiRwYXJlbnQiLCJ0cmlnZ2VyUmVmZXJlbmNlT25seSIsInN0b3BQcm9wIiwiY29uc29sZSIsImxvZyIsInN0b3BQcm9wYWdhdGlvbiIsIm1vdW50ZWQiLCJiZWZvcmVEZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFJQSwyR0FBSixDLENBSEE7b0JBU2U7QUFDYkMsVUFBTSxjQURPOztBQUdiQyxjQUFVRixvQkFIRzs7QUFLYkcsbUJBQWUsY0FMRjs7QUFPYkMsWUFBUSxxQkFQSzs7QUFTYkMsUUFUYSxrQkFTTjtBQUNMLGFBQU8sRUFBUDtBQUVELEtBWlk7OztBQWNiQyxjQUFVLEVBZEc7O0FBaUJiQyxXQUFPLEVBakJNOztBQW9CYkMsYUFBUztBQUNQQyxlQURPLHFCQUNHQyxDQURILEVBQ007QUFDVCxZQUFJLEtBQUtDLE9BQUwsQ0FBYUMsb0JBQWpCLEVBQXVDO0FBQ25DLGVBQUtDLFFBQUwsQ0FBY0gsQ0FBZDtBQUNIO0FBQ0osT0FMTTtBQU1QRyxjQU5PLG9CQU1FSCxDQU5GLEVBTUs7QUFDVkksZ0JBQVFDLEdBQVIsQ0FBWSxXQUFaO0FBQ0FMLFVBQUVNLGVBQUY7QUFDRDtBQVRNLEtBcEJJOztBQWdDYkMsV0FoQ2EscUJBZ0NIO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0QsS0EvQ1k7QUFpRGJDLGlCQWpEYSwyQkFpREc7QUFDZEosY0FBUUMsR0FBUixDQUFZLHlCQUFaO0FBQ0Q7QUFuRFksRyIsImZpbGUiOiJhcHAvYXRvbXMvRHJvcGRvd24vRHJvcGRvd25NZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFBvcHBlciBmcm9tICcuLi8uLi91dGlscy92dWUtcG9wcGVyJztcbmltcG9ydCBQb3BwZXIgZnJvbSAnLi4vLi4vdXRpbHMvdnVlLXBvcHBlcjInO1xuXG5sZXQgZHJvcGRvd25NZW51VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwiZHJvcGRvd25fX21lbnVcIiBAY2xpY2s9XCJtZW51Q2xpY2tcIj5cbiAgICA8c2xvdD48L3Nsb3Q+ICAgIFxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdEcm9wZG93bk1lbnUnLFxuXG4gIHRlbXBsYXRlOiBkcm9wZG93bk1lbnVUZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnRHJvcGRvd25NZW51JyxcblxuICBtaXhpbnM6IFtQb3BwZXJdLFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgbWVudUNsaWNrKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuJHBhcmVudC50cmlnZ2VyUmVmZXJlbmNlT25seSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wUHJvcChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RvcFByb3AoZSkge1xuICAgICAgY29uc29sZS5sb2coXCJTVE9QIFBST1BcIik7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIC8vIHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy4kcGFyZW50LiRyZWZzLnJlZmVyZW5jZS4kZWw7XG4gICAgLy8gdGhpcy4kcGFyZW50LnBvcHBlckVsbSA9IHRoaXMucG9wcGVyRWxtID0gdGhpcy4kZWw7XG4gICAgLy8gY29uc29sZS5sb2coXCJSZWZlcmVuY2UgRWxlbWVudCBNb3VudGVkXCIsIHRoaXMuJHBhcmVudC4kcmVmcyk7XG4gICAgLy8gdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRwYXJlbnQuJHJlZnMucmVmZXJlbmNlLiRlbDsgT0xEIHZ1ZS1wb3BwZXIgICAgIFxuICAgIC8vIHRoaXMuJHBhcmVudC5wb3BwZXJFbG0gPSB0aGlzLnBvcHBlckVsbSA9IHRoaXMuJGVsOyBPTEQgdnVlLXBvcHBlclxuXG5cbiAgICAvLyAvLyB1cGRhdGVQb3BwZXIgZXZlbnQgY29tZXMgZnJvbSBFbmhhbmNlZCBTZWxlY3RcbiAgICAvLyB0aGlzLiRvbigndXBkYXRlUG9wcGVyJywgdGhpcy51cGRhdGVQb3BwZXIoKSk7XG5cbiAgICAvLyAvLyBkZXN0cm95UG9wcGVyIGV2ZW50IGNvbWVzIGZyb20gRW5oYW5jZWQgU2VsZWN0XG4gICAgLy8gdGhpcy4kb24oJ2Rlc3Ryb3lQb3BwZXInLCB0aGlzLmRvRGVzdHJveSgpKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJHBhcmVudCk7XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkRST1BET1dOIE1FTlUgREVTVFJPWUVEXCIpO1xuICB9XG59O1xuIl19
