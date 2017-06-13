define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var pagerTemplate = '\n<ul @click="onPagerClick" class="el-pager">\n  <li\n    :class="{ active: currentPage === 1 }"\n    v-if="pageCount > 0"\n    class="number">1</li>\n  <li\n    class="el-icon more btn-quickprev"\n    :class="[quickprevIconClass]"\n    v-if="showPrevMore"\n    @mouseenter="quickprevIconClass = \'el-icon-d-arrow-left\'"\n    @mouseleave="quickprevIconClass = \'el-icon-more\'">\n  </li>\n  <li\n    v-for="pager in pagers"\n    :class="{ active: currentPage === pager }"\n    class="number">{{ pager }}</li>\n  <li\n    class="el-icon more btn-quicknext"\n    :class="[quicknextIconClass]"\n    v-if="showNextMore"\n    @mouseenter="quicknextIconClass = \'el-icon-d-arrow-right\'"\n    @mouseleave="quicknextIconClass = \'el-icon-more\'">\n  </li>\n  <li\n    :class="{ active: currentPage === pageCount }"\n    class="number"\n    v-if="pageCount > 1">{{ pageCount }}</li>\n</ul>\n';

  exports.default = {
    template: pagerTemplate,
    name: 'ElPager',
    props: {
      currentPage: Number,

      pageCount: Number
    },

    watch: {
      showPrevMore: function showPrevMore(val) {
        if (!val) this.quickprevIconClass = 'el-icon-more';
      },
      showNextMore: function showNextMore(val) {
        if (!val) this.quicknextIconClass = 'el-icon-more';
      }
    },

    methods: {
      onPagerClick: function onPagerClick(event) {
        var target = event.target;
        if (target.tagName === 'UL') {
          return;
        }

        var newPage = Number(event.target.textContent);
        var pageCount = this.pageCount;
        var currentPage = this.currentPage;

        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - 5;
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + 5;
          }
        }

        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }

          if (newPage > pageCount) {
            newPage = pageCount;
          }
        }

        if (newPage !== currentPage) {
          this.$emit('change', newPage);
        }
      }
    },

    computed: {
      pagers: function pagers() {
        var pagerCount = 7;

        var currentPage = Number(this.currentPage);
        var pageCount = Number(this.pageCount);

        var showPrevMore = false;
        var showNextMore = false;

        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - 2) {
            showPrevMore = true;
          }

          if (currentPage < pageCount - 2) {
            showNextMore = true;
          }
        }

        var array = [];

        if (showPrevMore && !showNextMore) {
          var startPage = pageCount - (pagerCount - 2);
          for (var i = startPage; i < pageCount; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (var _i = 2; _i < pagerCount; _i++) {
            array.push(_i);
          }
        } else if (showPrevMore && showNextMore) {
          var offset = Math.floor(pagerCount / 2) - 1;
          for (var _i2 = currentPage - offset; _i2 <= currentPage + offset; _i2++) {
            array.push(_i2);
          }
        } else {
          for (var _i3 = 2; _i3 < pageCount; _i3++) {
            array.push(_i3);
          }
        }

        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;

        return array;
      }
    },

    data: function data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 'el-icon-more',
        quickprevIconClass: 'el-icon-more'
      };
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvcGFnaW5hdGlvbi9wYWdlci5qcyJdLCJuYW1lcyI6WyJwYWdlclRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJjdXJyZW50UGFnZSIsIk51bWJlciIsInBhZ2VDb3VudCIsIndhdGNoIiwic2hvd1ByZXZNb3JlIiwidmFsIiwicXVpY2twcmV2SWNvbkNsYXNzIiwic2hvd05leHRNb3JlIiwicXVpY2tuZXh0SWNvbkNsYXNzIiwibWV0aG9kcyIsIm9uUGFnZXJDbGljayIsImV2ZW50IiwidGFyZ2V0IiwidGFnTmFtZSIsIm5ld1BhZ2UiLCJ0ZXh0Q29udGVudCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJpc05hTiIsIiRlbWl0IiwiY29tcHV0ZWQiLCJwYWdlcnMiLCJwYWdlckNvdW50IiwiYXJyYXkiLCJzdGFydFBhZ2UiLCJpIiwicHVzaCIsIm9mZnNldCIsIk1hdGgiLCJmbG9vciIsImRhdGEiLCJjdXJyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSxzNEJBQU47O29CQWdDZTtBQUNiQyxjQUFVRCxhQURHO0FBRWJFLFVBQU0sU0FGTztBQUdiQyxXQUFPO0FBQ0xDLG1CQUFhQyxNQURSOztBQUdMQyxpQkFBV0Q7QUFITixLQUhNOztBQVNiRSxXQUFPO0FBQ0xDLGtCQURLLHdCQUNRQyxHQURSLEVBQ2E7QUFDaEIsWUFBSSxDQUFDQSxHQUFMLEVBQVUsS0FBS0Msa0JBQUwsR0FBMEIsY0FBMUI7QUFDWCxPQUhJO0FBS0xDLGtCQUxLLHdCQUtRRixHQUxSLEVBS2E7QUFDaEIsWUFBSSxDQUFDQSxHQUFMLEVBQVUsS0FBS0csa0JBQUwsR0FBMEIsY0FBMUI7QUFDWDtBQVBJLEtBVE07O0FBbUJiQyxhQUFTO0FBQ1BDLGtCQURPLHdCQUNNQyxLQUROLEVBQ2E7QUFDbEIsWUFBTUMsU0FBU0QsTUFBTUMsTUFBckI7QUFDQSxZQUFJQSxPQUFPQyxPQUFQLEtBQW1CLElBQXZCLEVBQTZCO0FBQzNCO0FB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LGlCQUFTLElBREo7QUFFTDNCLHNCQUFjLEtBRlQ7QUFHTEcsc0JBQWMsS0FIVDtBQUlMQyw0QkFBb0IsY0FKZjtBQUtMRiw0QkFBb0I7QUFMZixPQUFQO0FBT0Q7QUFoSFksRyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL3BhZ2luYXRpb24vcGFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYWdlclRlbXBsYXRlID0gYFxuPHVsIEBjbGljaz1cIm9uUGFnZXJDbGlja1wiIGNsYXNzPVwiZWwtcGFnZXJcIj5cbiAgPGxpXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSAxIH1cIlxuICAgIHYtaWY9XCJwYWdlQ291bnQgPiAwXCJcbiAgICBjbGFzcz1cIm51bWJlclwiPjE8L2xpPlxuICA8bGlcbiAgICBjbGFzcz1cImVsLWljb24gbW9yZSBidG4tcXVpY2twcmV2XCJcbiAgICA6Y2xhc3M9XCJbcXVpY2twcmV2SWNvbkNsYXNzXVwiXG4gICAgdi1pZj1cInNob3dQcmV2TW9yZVwiXG4gICAgQG1vdXNlZW50ZXI9XCJxdWlja3ByZXZJY29uQ2xhc3MgPSAnZWwtaWNvbi1kLWFycm93LWxlZnQnXCJcbiAgICBAbW91c2VsZWF2ZT1cInF1aWNrcHJldkljb25DbGFzcyA9ICdlbC1pY29uLW1vcmUnXCI+XG4gIDwvbGk+XG4gIDxsaVxuICAgIHYtZm9yPVwicGFnZXIgaW4gcGFnZXJzXCJcbiAgICA6Y2xhc3M9XCJ7IGFjdGl2ZTogY3VycmVudFBhZ2UgPT09IHBhZ2VyIH1cIlxuICAgIGNsYXNzPVwibnVtYmVyXCI+e3sgcGFnZXIgfX08L2xpPlxuICA8bGlcbiAgICBjbGFzcz1cImVsLWljb24gbW9yZSBidG4tcXVpY2tuZXh0XCJcbiAgICA6Y2xhc3M9XCJbcXVpY2tuZXh0SWNvbkNsYXNzXVwiXG4gICAgdi1pZj1cInNob3dOZXh0TW9yZVwiXG4gICAgQG1vdXNlZW50ZXI9XCJxdWlja25leHRJY29uQ2xhc3MgPSAnZWwtaWNvbi1kLWFycm93LXJpZ2h0J1wiXG4gICAgQG1vdXNlbGVhdmU9XCJxdWlja25leHRJY29uQ2xhc3MgPSAnZWwtaWNvbi1tb3JlJ1wiPlxuICA8L2xpPlxuICA8bGlcbiAgICA6Y2xhc3M9XCJ7IGFjdGl2ZTogY3VycmVudFBhZ2UgPT09IHBhZ2VDb3VudCB9XCJcbiAgICBjbGFzcz1cIm51bWJlclwiXG4gICAgdi1pZj1cInBhZ2VDb3VudCA+IDFcIj57eyBwYWdlQ291bnQgfX08L2xpPlxuPC91bD5cbmA7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICB0ZW1wbGF0ZTogcGFnZXJUZW1wbGF0ZSxcbiAgbmFtZTogJ0VsUGFnZXInLFxuICBwcm9wczoge1xuICAgIGN1cnJlbnRQYWdlOiBOdW1iZXIsXG5cbiAgICBwYWdlQ291bnQ6IE51bWJlclxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgc2hvd1ByZXZNb3JlKHZhbCkge1xuICAgICAgaWYgKCF2YWwpIHRoaXMucXVpY2twcmV2SWNvbkNsYXNzID0gJ2VsLWljb24tbW9yZSc7XG4gICAgfSxcblxuICAgIHNob3dOZXh0TW9yZSh2YWwpIHtcbiAgICAgIGlmICghdmFsKSB0aGlzLnF1aWNrbmV4dEljb25DbGFzcyA9ICdlbC1pY29uLW1vcmUnO1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25QYWdlckNsaWNrKGV2ZW50KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09ICdVTCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3UGFnZSA9IE51bWJlcihldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xuICAgICAgY29uc3QgcGFnZUNvdW50ID0gdGhpcy5wYWdlQ291bnQ7XG4gICAgICBjb25zdCBjdXJyZW50UGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XG5cbiAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ21vcmUnKSAhPT0gLTEpIHtcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncXVpY2twcmV2JykgIT09IC0xKSB7XG4gICAgICAgICAgbmV3UGFnZSA9IGN1cnJlbnRQYWdlIC0gNTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3F1aWNrbmV4dCcpICE9PSAtMSkge1xuICAgICAgICAgIG5ld1BhZ2UgPSBjdXJyZW50UGFnZSArIDU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoIWlzTmFOKG5ld1BhZ2UpKSB7XG4gICAgICAgIGlmIChuZXdQYWdlIDwgMSkge1xuICAgICAgICAgIG5ld1BhZ2UgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1BhZ2UgPiBwYWdlQ291bnQpIHtcbiAgICAgICAgICBuZXdQYWdlID0gcGFnZUNvdW50O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdQYWdlICE9PSBjdXJyZW50UGFnZSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdQYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBwYWdlcnMoKSB7XG4gICAgICBjb25zdCBwYWdlckNvdW50ID0gNztcblxuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBOdW1iZXIodGhpcy5jdXJyZW50UGFnZSk7XG4gICAgICBjb25zdCBwYWdlQ291bnQgPSBOdW1iZXIodGhpcy5wYWdlQ291bnQpO1xuXG4gICAgICBsZXQgc2hvd1ByZXZNb3JlID0gZmFsc2U7XG4gICAgICBsZXQgc2hvd05leHRNb3JlID0gZmFsc2U7XG5cbiAgICAgIGlmIChwYWdlQ291bnQgPiBwYWdlckNvdW50KSB7XG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA+IHBhZ2VyQ291bnQgLSAyKSB7XG4gICAgICAgICAgc2hvd1ByZXZNb3JlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA8IHBhZ2VDb3VudCAtIDIpIHtcbiAgICAgICAgICBzaG93TmV4dE1vcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFycmF5ID0gW107XG5cbiAgICAgIGlmIChzaG93UHJldk1vcmUgJiYgIXNob3dOZXh0TW9yZSkge1xuICAgICAgICBjb25zdCBzdGFydFBhZ2UgPSBwYWdlQ291bnQgLSAocGFnZXJDb3VudCAtIDIpO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRQYWdlOyBpIDwgcGFnZUNvdW50OyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgcGFnZXJDb3VudDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IE1hdGguZmxvb3IocGFnZXJDb3VudCAvIDIpIC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGN1cnJlbnRQYWdlIC0gb2Zmc2V0IDsgaSA8PSBjdXJyZW50UGFnZSArIG9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBwYWdlQ291bnQ7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UHJldk1vcmUgPSBzaG93UHJldk1vcmU7XG4gICAgICB0aGlzLnNob3dOZXh0TW9yZSA9IHNob3dOZXh0TW9yZTtcblxuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBudWxsLFxuICAgICAgc2hvd1ByZXZNb3JlOiBmYWxzZSxcbiAgICAgIHNob3dOZXh0TW9yZTogZmFsc2UsXG4gICAgICBxdWlja25leHRJY29uQ2xhc3M6ICdlbC1pY29uLW1vcmUnLFxuICAgICAgcXVpY2twcmV2SWNvbkNsYXNzOiAnZWwtaWNvbi1tb3JlJ1xuICAgIH07XG4gIH1cbn07XG4iXX0=
