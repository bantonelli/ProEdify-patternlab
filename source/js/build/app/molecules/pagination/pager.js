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
        // Method gets the desired newPage number via @click 
        // If you click the .more arrows newPage will be 5 more or less  
        // otherwise the page change logic will be handled by parent  
        // via @change event.    
        var target = event.target;
        if (target.tagName === 'UL') {
          return;
        }

        // Grab the <li> number that was clicked 
        var newPage = Number(event.target.textContent);
        var pageCount = this.pageCount;
        var currentPage = this.currentPage;

        // If the <li> that was clicked is a .more double arrow icon 
        // Then automatically jump five pages less or more.
        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - 5;
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + 5;
          }
        }

        // Checks to keep the new active page within bounds 
        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }

          if (newPage > pageCount) {
            newPage = pageCount;
          }
        }

        // If the new page clicked is different from the og page 
        // emit the @change event to the parent component.
        // Pagination component will handle this change event.  
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvUGFnaW5hdGlvbi9QYWdlci5qcyJdLCJuYW1lcyI6WyJwYWdlclRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJjdXJyZW50UGFnZSIsIk51bWJlciIsInBhZ2VDb3VudCIsIndhdGNoIiwic2hvd1ByZXZNb3JlIiwidmFsIiwicXVpY2twcmV2SWNvbkNsYXNzIiwic2hvd05leHRNb3JlIiwicXVpY2tuZXh0SWNvbkNsYXNzIiwibWV0aG9kcyIsIm9uUGFnZXJDbGljayIsImV2ZW50IiwidGFyZ2V0IiwidGFnTmFtZSIsIm5ld1BhZ2UiLCJ0ZXh0Q29udGVudCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJpc05hTiIsIiRlbWl0IiwiY29tcHV0ZWQiLCJwYWdlcnMiLCJwYWdlckNvdW50IiwiYXJyYXkiLCJzdGFydFBhZ2UiLCJpIiwicHVzaCIsIm9mZnNldCIsIk1hdGgiLCJmbG9vciIsImRhdGEiLCJjdXJyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSxzNEJBQU47O29CQWdDZTtBQUNiQyxjQUFVRCxhQURHO0FBRWJFLFVBQU0sU0FGTztBQUdiQyxXQUFPO0FBQ0xDLG1CQUFhQyxNQURSOztBQUdMQyxpQkFBV0Q7QUFITixLQUhNOztBQVNiRSxXQUFPO0FBQ0xDLGtCQURLLHdCQUNRQyxHQURSLEVBQ2E7QUFDaEIsWUFBSSxDQUFDQSxHQUFMLEVBQVUsS0FBS0Msa0JBQUwsR0FBMEIsY0FBMUI7QUFDWCxPQUhJO0FBS0xDLGtCQUxLLHdCQUtRRixHQUxSLEVBS2E7QUFDaEIsWUFBSSxDQUFDQSxHQUFMLEVBQVUsS0FBS0csa0JBQUwsR0FBMEIsY0FBMUI7QUFDWDtBQVBJLEtBVE07O0FBbUJiQyxhQUFTO0FBQ1BDLGtCQURPLHdCQUNNQyxLQUROLEVBQ2E7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNQyxTQUFTRCxNQUFNQyxNQUFyQjtBQUNBLFlBQUlBLE9BQU9DLE9BQVAsS0FBbUIs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UDtBQUNEO0FBOUNPLEtBbEVHOztBQW1IYk8sUUFuSGEsa0JBbUhOO0FBQ0wsYUFBTztBQUNMQyxpQkFBUyxJQURKO0FBRUwzQixzQkFBYyxLQUZUO0FBR0xHLHNCQUFjLEtBSFQ7QUFJTEMsNEJBQW9CLGNBSmY7QUFLTEYsNEJBQW9CO0FBTGYsT0FBUDtBQU9EO0FBM0hZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9QYWdpbmF0aW9uL1BhZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGFnZXJUZW1wbGF0ZSA9IGBcbjx1bCBAY2xpY2s9XCJvblBhZ2VyQ2xpY2tcIiBjbGFzcz1cImVsLXBhZ2VyXCI+XG4gIDxsaVxuICAgIDpjbGFzcz1cInsgYWN0aXZlOiBjdXJyZW50UGFnZSA9PT0gMSB9XCJcbiAgICB2LWlmPVwicGFnZUNvdW50ID4gMFwiXG4gICAgY2xhc3M9XCJudW1iZXJcIj4xPC9saT5cbiAgPGxpXG4gICAgY2xhc3M9XCJlbC1pY29uIG1vcmUgYnRuLXF1aWNrcHJldlwiXG4gICAgOmNsYXNzPVwiW3F1aWNrcHJldkljb25DbGFzc11cIlxuICAgIHYtaWY9XCJzaG93UHJldk1vcmVcIlxuICAgIEBtb3VzZWVudGVyPVwicXVpY2twcmV2SWNvbkNsYXNzID0gJ2VsLWljb24tZC1hcnJvdy1sZWZ0J1wiXG4gICAgQG1vdXNlbGVhdmU9XCJxdWlja3ByZXZJY29uQ2xhc3MgPSAnZWwtaWNvbi1tb3JlJ1wiPlxuICA8L2xpPlxuICA8bGlcbiAgICB2LWZvcj1cInBhZ2VyIGluIHBhZ2Vyc1wiXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSBwYWdlciB9XCJcbiAgICBjbGFzcz1cIm51bWJlclwiPnt7IHBhZ2VyIH19PC9saT5cbiAgPGxpXG4gICAgY2xhc3M9XCJlbC1pY29uIG1vcmUgYnRuLXF1aWNrbmV4dFwiXG4gICAgOmNsYXNzPVwiW3F1aWNrbmV4dEljb25DbGFzc11cIlxuICAgIHYtaWY9XCJzaG93TmV4dE1vcmVcIlxuICAgIEBtb3VzZWVudGVyPVwicXVpY2tuZXh0SWNvbkNsYXNzID0gJ2VsLWljb24tZC1hcnJvdy1yaWdodCdcIlxuICAgIEBtb3VzZWxlYXZlPVwicXVpY2tuZXh0SWNvbkNsYXNzID0gJ2VsLWljb24tbW9yZSdcIj5cbiAgPC9saT5cbiAgPGxpXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSBwYWdlQ291bnQgfVwiXG4gICAgY2xhc3M9XCJudW1iZXJcIlxuICAgIHYtaWY9XCJwYWdlQ291bnQgPiAxXCI+e3sgcGFnZUNvdW50IH19PC9saT5cbjwvdWw+XG5gO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVtcGxhdGU6IHBhZ2VyVGVtcGxhdGUsXG4gIG5hbWU6ICdFbFBhZ2VyJyxcbiAgcHJvcHM6IHtcbiAgICBjdXJyZW50UGFnZTogTnVtYmVyLFxuXG4gICAgcGFnZUNvdW50OiBOdW1iZXJcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHNob3dQcmV2TW9yZSh2YWwpIHtcbiAgICAgIGlmICghdmFsKSB0aGlzLnF1aWNrcHJldkljb25DbGFzcyA9ICdlbC1pY29uLW1vcmUnO1xuICAgIH0sXG5cbiAgICBzaG93TmV4dE1vcmUodmFsKSB7XG4gICAgICBpZiAoIXZhbCkgdGhpcy5xdWlja25leHRJY29uQ2xhc3MgPSAnZWwtaWNvbi1tb3JlJztcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uUGFnZXJDbGljayhldmVudCkge1xuICAgICAgLy8gTWV0aG9kIGdldHMgdGhlIGRlc2lyZWQgbmV3UGFnZSBudW1iZXIgdmlhIEBjbGljayBcbiAgICAgIC8vIElmIHlvdSBjbGljayB0aGUgLm1vcmUgYXJyb3dzIG5ld1BhZ2Ugd2lsbCBiZSA1IG1vcmUgb3IgbGVzcyAgXG4gICAgICAvLyBvdGhlcndpc2UgdGhlIHBhZ2UgY2hhbmdlIGxvZ2ljIHdpbGwgYmUgaGFuZGxlZCBieSBwYXJlbnQgIFxuICAgICAgLy8gdmlhIEBjaGFuZ2UgZXZlbnQuICAgIFxuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgaWYgKHRhcmdldC50YWdOYW1lID09PSAnVUwnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gR3JhYiB0aGUgPGxpPiBudW1iZXIgdGhhdCB3YXMgY2xpY2tlZCBcbiAgICAgIGxldCBuZXdQYWdlID0gTnVtYmVyKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCk7XG4gICAgICBjb25zdCBwYWdlQ291bnQgPSB0aGlzLnBhZ2VDb3VudDtcbiAgICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcbiBcbiAgICAgIC8vIElmIHRoZSA8bGk+IHRoYXQgd2FzIGNsaWNrZWQgaXMgYSAubW9yZSBkb3VibGUgYXJyb3cgaWNvbiBcbiAgICAgIC8vIFRoZW4gYXV0b21hdGljYWxseSBqdW1wIGZpdmUgcGFnZXMgbGVzcyBvciBtb3JlLlxuICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignbW9yZScpICE9PSAtMSkge1xuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdxdWlja3ByZXYnKSAhPT0gLTEpIHtcbiAgICAgICAgICBuZXdQYWdlID0gY3VycmVudFBhZ2UgLSA1O1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncXVpY2tuZXh0JykgIT09IC0xKSB7XG4gICAgICAgICAgbmV3UGFnZSA9IGN1cnJlbnRQYWdlICsgNTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVja3MgdG8ga2VlcCB0aGUgbmV3IGFjdGl2ZSBwYWdlIHdpdGhpbiBib3VuZHMgXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmICghaXNOYU4obmV3UGFnZSkpIHtcbiAgICAgICAgaWYgKG5ld1BhZ2UgPCAxKSB7XG4gICAgICAgICAgbmV3UGFnZSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3UGFnZSA+IHBhZ2VDb3VudCkge1xuICAgICAgICAgIG5ld1BhZ2UgPSBwYWdlQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIG5ldyBwYWdlIGNsaWNrZWQgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9nIHBhZ2UgXG4gICAgICAvLyBlbWl0IHRoZSBAY2hhbmdlIGV2ZW50IHRvIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICAgICAgLy8gUGFnaW5hdGlvbiBjb21wb25lbnQgd2lsbCBoYW5kbGUgdGhpcyBjaGFuZ2UgZXZlbnQuICBcbiAgICAgIGlmIChuZXdQYWdlICE9PSBjdXJyZW50UGFnZSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdQYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBwYWdlcnMoKSB7XG4gICAgICBjb25zdCBwYWdlckNvdW50ID0gNztcblxuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBOdW1iZXIodGhpcy5jdXJyZW50UGFnZSk7XG4gICAgICBjb25zdCBwYWdlQ291bnQgPSBOdW1iZXIodGhpcy5wYWdlQ291bnQpO1xuXG4gICAgICBsZXQgc2hvd1ByZXZNb3JlID0gZmFsc2U7XG4gICAgICBsZXQgc2hvd05leHRNb3JlID0gZmFsc2U7XG5cbiAgICAgIGlmIChwYWdlQ291bnQgPiBwYWdlckNvdW50KSB7XG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA+IHBhZ2VyQ291bnQgLSAyKSB7XG4gICAgICAgICAgc2hvd1ByZXZNb3JlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA8IHBhZ2VDb3VudCAtIDIpIHtcbiAgICAgICAgICBzaG93TmV4dE1vcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFycmF5ID0gW107XG5cbiAgICAgIGlmIChzaG93UHJldk1vcmUgJiYgIXNob3dOZXh0TW9yZSkge1xuICAgICAgICBjb25zdCBzdGFydFBhZ2UgPSBwYWdlQ291bnQgLSAocGFnZXJDb3VudCAtIDIpO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRQYWdlOyBpIDwgcGFnZUNvdW50OyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgcGFnZXJDb3VudDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IE1hdGguZmxvb3IocGFnZXJDb3VudCAvIDIpIC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGN1cnJlbnRQYWdlIC0gb2Zmc2V0IDsgaSA8PSBjdXJyZW50UGFnZSArIG9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBwYWdlQ291bnQ7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UHJldk1vcmUgPSBzaG93UHJldk1vcmU7XG4gICAgICB0aGlzLnNob3dOZXh0TW9yZSA9IHNob3dOZXh0TW9yZTtcblxuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBudWxsLFxuICAgICAgc2hvd1ByZXZNb3JlOiBmYWxzZSxcbiAgICAgIHNob3dOZXh0TW9yZTogZmFsc2UsXG4gICAgICBxdWlja25leHRJY29uQ2xhc3M6ICdlbC1pY29uLW1vcmUnLFxuICAgICAgcXVpY2twcmV2SWNvbkNsYXNzOiAnZWwtaWNvbi1tb3JlJ1xuICAgIH07XG4gIH1cbn07XG4iXX0=
