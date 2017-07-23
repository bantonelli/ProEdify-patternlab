define(['exports', '../../utils/vue-popper'], function (exports, _vuePopper) {
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

  var selectDropdownTemplate = '\n<div\n  class="select__dropdown"\n  :class="[{ \'is-multiple\': $parent.multiple }, popperClass]"\n  :style="{ minWidth: minWidth }">\n  <slot></slot>\n</div>\n';

  exports.default = {
    name: 'SelectDropdown',

    template: selectDropdownTemplate,

    componentName: 'SelectDropdown',

    mixins: [_vuePopper2.default],

    props: {
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default: function _default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    data: function data() {
      return {
        minWidth: ''
      };
    },


    computed: {
      popperClass: function popperClass() {
        return this.$parent.popperClass;
      }
    },

    watch: {
      '$parent.inputWidth': function $parentInputWidth() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
      }
    },

    mounted: function mounted() {
      var _this = this;

      // this.referenceElm = this.$parent.$refs.reference.$el;
      // this.$parent.popperElm = this.popperElm = this.$el;
      console.log("Reference Element Mounted", this.$parent.$refs);
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;

      this.$on('updatePopper', function () {
        if (_this.$parent.visible) _this.updatePopper();
      });
      this.$on('destroyPopper', this.destroyPopper);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvU2VsZWN0RHJvcGRvd24uanMiXSwibmFtZXMiOlsic2VsZWN0RHJvcGRvd25UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsInBsYWNlbWVudCIsImRlZmF1bHQiLCJib3VuZGFyaWVzUGFkZGluZyIsInBvcHBlck9wdGlvbnMiLCJmb3JjZUFic29sdXRlIiwiZ3B1QWNjZWxlcmF0aW9uIiwiZGF0YSIsIm1pbldpZHRoIiwiY29tcHV0ZWQiLCJwb3BwZXJDbGFzcyIsIiRwYXJlbnQiLCJ3YXRjaCIsIiRlbCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndpZHRoIiwibW91bnRlZCIsImNvbnNvbGUiLCJsb2ciLCIkcmVmcyIsInJlZmVyZW5jZUVsbSIsInJlZmVyZW5jZSIsInBvcHBlckVsbSIsIiRvbiIsInZpc2libGUiLCJ1cGRhdGVQb3BwZXIiLCJkZXN0cm95UG9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSw2TEFBSjs7b0JBU2U7QUFDYkMsVUFBTSxnQkFETzs7QUFHYkMsY0FBVUYsc0JBSEc7O0FBS2JHLG1CQUFlLGdCQUxGOztBQU9iQyxZQUFRLHFCQVBLOztBQVNiQyxXQUFPO0FBQ0xDLGlCQUFXO0FBQ1RDLGlCQUFTO0FBREEsT0FETjs7QUFLTEMseUJBQW1CO0FBQ2pCRCxpQkFBUztBQURRLE9BTGQ7O0FBU0xFLHFCQUFlO0FBQ2JGLGVBRGEsc0JBQ0g7QUFDUixpQkFBTztBQUNMRywyQkFBZSxJQURWO0FBRUxDLDZCQUFpQjtBQUZaLFdBQVA7QUFJRDtBQU5ZO0FBVFYsS0FUTTs7QUE0QmJDLFFBNUJhLGtCQTRCTjtBQUNMLGFBQU87QUFDTEMsa0JBQVU7QUFETCxPQUFQO0FBR0QsS0FoQ1k7OztBQWtDYkMsY0FBVTtBQUNSQyxpQkFEUSx5QkFDTTtBQUNaLGVBQU8sS0FBS0MsT0FBTCxDQUFhRCxXQUFwQjtBQUNEO0FBSE8sS0FsQ0c7O0FBd0NiRSxXQUFPO0FBQ0wsMEJBREssK0JBQ2tCO0FBQ3JCLGFBQUtKLFFBQUwsR0FBZ0IsS0FBS0csT0FBTCxDQUFhRSxHQUFiLENBQWlCQyxxQkFBakIsR0FBeUNDLEtBQXpDLEdBQWlELElBQWpFO0FBQ0Q7QUFISSxLQXhDTTs7QUE4Q2JDLFdBOUNhLHFCQThDSDtBQUFBOztBQUNSO0FBQ0E7QUFDQUMsY0FBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDLEtBQUtQLE9BQUwsQ0FBYVEsS0FBdEQ7QUFDQSxXQUFLQyxZQUFMLEdBQW9CLEtBQUtULE9BQUwsQ0FBYVEsS0FBYixDQUFtQkUsU0FBbkIsQ0FBNkJSLEdBQWpEO0FBQ0EsV0FBS0YsT0FBTCxDQUFhVyxTQUFiLEdBQXlCLEtBQUtBLFNBQUwsR0FBaUIsS0FBS1QsR0FBL0M7O0FBRUEsV0FBS1UsR0FBTCxDQUFTLGNBQVQsRUFBeUIsWUFBTTtBQUM3QixZQUFJLE1BQUtaLE9BQUwsQ0FBYWEsT0FBakIsRUFBMEIsTUFBS0MsWUFBTDtBQUMzQixPQUZEO0FBR0EsV0FBS0YsR0FBTCxDQUFTLGVBQVQsRUFBMEIsS0FBS0csYUFBL0I7QUFDRDtBQXpEWSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvU2VsZWN0RHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9wcGVyIGZyb20gJy4uLy4uL3V0aWxzL3Z1ZS1wb3BwZXInO1xuXG5sZXQgc2VsZWN0RHJvcGRvd25UZW1wbGF0ZSA9IGBcbjxkaXZcbiAgY2xhc3M9XCJzZWxlY3RfX2Ryb3Bkb3duXCJcbiAgOmNsYXNzPVwiW3sgJ2lzLW11bHRpcGxlJzogJHBhcmVudC5tdWx0aXBsZSB9LCBwb3BwZXJDbGFzc11cIlxuICA6c3R5bGU9XCJ7IG1pbldpZHRoOiBtaW5XaWR0aCB9XCI+XG4gIDxzbG90Pjwvc2xvdD5cbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnU2VsZWN0RHJvcGRvd24nLFxuXG4gIHRlbXBsYXRlOiBzZWxlY3REcm9wZG93blRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdTZWxlY3REcm9wZG93bicsXG5cbiAgbWl4aW5zOiBbUG9wcGVyXSxcblxuICBwcm9wczoge1xuICAgIHBsYWNlbWVudDoge1xuICAgICAgZGVmYXVsdDogJ2JvdHRvbS1zdGFydCdcbiAgICB9LFxuXG4gICAgYm91bmRhcmllc1BhZGRpbmc6IHtcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG4gICAgcG9wcGVyT3B0aW9uczoge1xuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmb3JjZUFic29sdXRlOiB0cnVlLFxuICAgICAgICAgIGdwdUFjY2VsZXJhdGlvbjogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWluV2lkdGg6ICcnXG4gICAgfTtcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHBvcHBlckNsYXNzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC5wb3BwZXJDbGFzcztcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAnJHBhcmVudC5pbnB1dFdpZHRoJygpIHtcbiAgICAgIHRoaXMubWluV2lkdGggPSB0aGlzLiRwYXJlbnQuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgJ3B4JztcbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZCgpIHtcbiAgICAvLyB0aGlzLnJlZmVyZW5jZUVsbSA9IHRoaXMuJHBhcmVudC4kcmVmcy5yZWZlcmVuY2UuJGVsO1xuICAgIC8vIHRoaXMuJHBhcmVudC5wb3BwZXJFbG0gPSB0aGlzLnBvcHBlckVsbSA9IHRoaXMuJGVsO1xuICAgIGNvbnNvbGUubG9nKFwiUmVmZXJlbmNlIEVsZW1lbnQgTW91bnRlZFwiLCB0aGlzLiRwYXJlbnQuJHJlZnMpO1xuICAgIHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy4kcGFyZW50LiRyZWZzLnJlZmVyZW5jZS4kZWw7ICAgICAgXG4gICAgdGhpcy4kcGFyZW50LnBvcHBlckVsbSA9IHRoaXMucG9wcGVyRWxtID0gdGhpcy4kZWw7XG5cbiAgICB0aGlzLiRvbigndXBkYXRlUG9wcGVyJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuJHBhcmVudC52aXNpYmxlKSB0aGlzLnVwZGF0ZVBvcHBlcigpO1xuICAgIH0pO1xuICAgIHRoaXMuJG9uKCdkZXN0cm95UG9wcGVyJywgdGhpcy5kZXN0cm95UG9wcGVyKTtcbiAgfVxufTtcbiJdfQ==
