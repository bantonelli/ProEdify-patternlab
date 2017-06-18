define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var pagerTemplate = '\n<ul @click="onPagerClick" class="pager" :class="modifierStyles">\n  <li\n    :class="{ active: currentPage === 1 }"\n    v-if="pageCount > 0"\n    class="circle-button">\n    <span class="circle-button__text">1</span>\n  </li>\n  <li\n    class="circle-button more quickprev"    \n    v-if="showPrevMore"\n    @mouseenter="quickprevIconClass = \'fa-icon-angle-double-left\'"\n    @mouseleave="quickprevIconClass = \'fa-icon-ellipsis-h\'">\n    <span class="circle-button__text" :class="[quickprevIconClass]"></span>\n  </li>\n  <li\n    v-for="pager in pagers"\n    :class="{ active: currentPage === pager }"\n    class="circle-button">\n    <span class="circle-button__text">{{ pager }}</span>\n  </li>\n  <li\n    class="circle-button more quicknext"\n    v-if="showNextMore"\n    @mouseenter="quicknextIconClass = \'fa-icon-angle-double-right\'"\n    @mouseleave="quicknextIconClass = \'fa-icon-ellipsis-h\'">\n    <span class="circle-button__text" :class="[quicknextIconClass]"></span>\n  </li>\n  <li\n    :class="{ active: currentPage === pageCount }"\n    class="circle-button"\n    v-if="pageCount > 1">\n    <span class="circle-button__text">{{ pageCount }}</span>\n    </li>\n</ul>\n';

  exports.default = {
    template: pagerTemplate,
    name: 'Pager',
    props: {
      currentPage: Number,
      pageCount: Number,
      modifierStyles: {
        type: Array,
        default: null
      }
    },

    watch: {
      showPrevMore: function showPrevMore(val) {
        if (!val) this.quickprevIconClass = 'fa-icon-angle-double-left';
      },
      showNextMore: function showNextMore(val) {
        if (!val) this.quicknextIconClass = 'fa-icon-angle-double-right';
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
        var lastPageInSet = this.pagers[this.pagers.length - 1];
        console.log("PAGERS: ", lastPageInSet);

        // If the <li> that was clicked is a .more double arrow icon 
        // Then automatically jump five pages less or more.
        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            if (lastPageInSet - currentPage <= 1 && lastPageInSet + 1 == pageCount) {
              newPage = lastPageInSet - 2;
            } else {
              newPage = lastPageInSet - 3;
            }
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = lastPageInSet + 1;
          }
        }

        // Checks to keep the new active page within bounds 
        /* istanbul ignore if */
        // if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }

        if (newPage > pageCount) {
          newPage = pageCount;
        }
        // }

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
        var pagerCount = 4;

        var currentPage = Number(this.currentPage);
        var totalPages = Number(this.pageCount);

        var showPrevMore = false;
        var showNextMore = false;

        if (totalPages > pagerCount) {
          if (currentPage > pagerCount - 2) {
            showPrevMore = true;
          }

          if (currentPage <= 3) {
            showPrevMore = false;
          }

          if (currentPage < totalPages - 2) {
            showNextMore = true;
          }
        }

        var array = [];

        if (showPrevMore && !showNextMore) {
          var startPage = totalPages - (pagerCount - 2);
          for (var i = startPage; i < totalPages; i++) {
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
          for (var _i3 = 2; _i3 < totalPages; _i3++) {
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
        quicknextIconClass: 'fa-icon-ellipsis-h',
        quickprevIconClass: 'fa-icon-ellipsis-h'
      };
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvUGFnaW5hdGlvbi9QYWdlci5qcyJdLCJuYW1lcyI6WyJwYWdlclRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJjdXJyZW50UGFnZSIsIk51bWJlciIsInBhZ2VDb3VudCIsIm1vZGlmaWVyU3R5bGVzIiwidHlwZSIsIkFycmF5IiwiZGVmYXVsdCIsIndhdGNoIiwic2hvd1ByZXZNb3JlIiwidmFsIiwicXVpY2twcmV2SWNvbkNsYXNzIiwic2hvd05leHRNb3JlIiwicXVpY2tuZXh0SWNvbkNsYXNzIiwibWV0aG9kcyIsIm9uUGFnZXJDbGljayIsImV2ZW50IiwidGFyZ2V0IiwidGFnTmFtZSIsIm5ld1BhZ2UiLCJ0ZXh0Q29udGVudCIsImxhc3RQYWdlSW5TZXQiLCJwYWdlcnMiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIiRlbWl0IiwiY29tcHV0ZWQiLCJwYWdlckNvdW50IiwidG90YWxQYWdlcyIsImFycmF5Iiwic3RhcnRQYWdlIiwiaSIsInB1c2giLCJvZmZzZXQiLCJNYXRoIiwiZmxvb3IiLCJkYXRhIiwiY3VycmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTUEsNnJDQUFOOztvQkFzQ2U7QUFDYkMsY0FBVUQsYUFERztBQUViRSxVQUFNLE9BRk87QUFHYkMsV0FBTztBQUNMQyxtQkFBYUMsTUFEUjtBQUVMQyxpQkFBV0QsTUFGTjtBQUdMRSxzQkFBZ0I7QUFDZEMsY0FBTUMsS0FEUTtBQUVkQyxpQkFBUztBQUZLO0FBSFgsS0FITTs7QUFZYkMsV0FBTztBQUNMQyxrQkFESyx3QkFDUUMsR0FEUixFQUNhO0FBQ2hCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVLEtBQUtDLGtCQUFMLEdBQTBCLDJCQUExQjtBQUNYLE9BSEk7QUFLTEMsa0JBTEssd0JBS1FGLEdBTFIsRUFLYTtBQUNoQixZQUFJLENBQUNBLEdBQUwsRUFBVSxLQUFLRyxrQkFBTCxHQUEwQiw0QkFBMUI7QUFDWDtBQVBJLEtBWk07O0FBc0JiQyxhQUFTO0FBQ1BDLGtCQURPLHdCQUNNQyxLQUROLEVBQ2E7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNQyxTQUFTRCxNQUFNQyxNQUFyQjtBQUNBLFlBQUlBLE9BQU9DLE9BQVAsS0FBbUIsSUFBdkIsRUFBNkI7QUFDM0I7QUFDRDs7QUFFRDtBQUNBLFlBQUlDLFVBQVVqQixPQUFPYyxNQUFNQyxNQUFOLENBQWFHLFdBQXBCLENBQWQ7QUFDQSxZQUFNakIsWUFBWSxLQUFLQSxTQUF2QjtBQUNBLFlBQU1GLGNBQWMsS0FBS0EsV0FBekI7QUFDQSxZQUFNb0IsZ0JBQWdCLEtBQUtDLE1BQUwsQ0FBWSxLQUFLQSxNQUFMLENBQVlDLE1BQVosR0FBcUIsQ0FBakMsQ0FBdEI7QUFDQUMsZ0JBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCSixhQUF4Qjs7QUFFQTtBQUNBO0FBQ0EsWUFBSUosT0FBT1MsU0FBUCxDQUFpQkMsT0FBakIsQ0FBeUIsTUFBekIsTUFBcUMsQ0FBQyxDQUExQyxFQUE2QztBQUMzQyxjQUFJVixPQUFPUyxTQUFQLENBQWlCQyxPQUFqQixDQUF5QixXQUF6QixNQUEwQyxDQUFDLENBQS9DLEVBQWtEO0FBQ2hELGdCQUFJTixnQkFBZ0JwQixXQUFoQixJQUErQixDQUEvQixJQUFvQ29CLGdCQUFnQixDQUFoQixJQUFxQmxCLFNBQTdELEVBQXdFO0FBQ3RFZ0Isd0JBQVVFLGdCQUFnQixDQUExQjtBQUNELGFBRkQsTUFFTztBQUNMRix3QkFBVUUsZ0JBQWdCLENBQTFCO0FBQ0Q7QUFDRixXQU5ELE1BTU8sSUFBSUosT0FBT1MsU0FBUCxDQUFpQkMsT0FBakIsQ0FBeUIsV0FBekIsTUFBMEMsQ0FBQyxDQUEvQyxFQUFrRDtBQUN2RFIsc0JBQVVFLGdCQUFnQixDQUExQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBQ0UsWUFBSUYsVUFBVSxDQUFkLEVBQWlCO0FBQ2ZBLG9CQUFVLENBQVY7QUFDRDs7QUFFRCxZQUFJQSxVQUFVaEIsU0FBZCxFQUF5QjtBQUN2QmdCLG9CQUFVaEIsU0FBVjtBQUNEO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSWdCLFlBQVlsQixXQUFoQixFQUE2QjtBQUMzQixlQUFLMkIsS0FBTCxDQUFXLFFBQVgsRUFBcUJULE9BQXJCO0FBQ0Q7QUFDRjtBQWxETSxLQXRCSTs7QUEyRWJVLGNBQVU7QUFDUlAsWUFEUSxvQkFDQztBQUNQLFlBQU1RLGFBQWEsQ0FBbkI7O0FBRUEsWUFBTTdCLGNBQWNDLE9BQU8sS0FBS0QsV0FBWixDQUFwQjtBQUNBLFlBQU04QixhQUFhN0IsT0FBTyxLQUFLQyxTQUFaLENBQW5COztBQUVBLFlBQUlNLGVBQWUsS0FBbkI7QUFDQSxZQUFJRyxlQUFlLEtBQW5COztBQUVBLFlBQUltQixhQUFhRCxVQUFqQixFQUE2QjtBQUMzQixjQUFJN0IsY0FBYzZCLGFBQWEsQ0FBL0IsRUFBa0M7QUFDaENyQiwyQkFBZSxJQUFmO0FBQ0Q7O0FBRUQsY0FBSVIsZUFBZSxDQUFuQixFQUFzQjtBQUNwQlEsMkJBQWUsS0FBZjtBQUNEOztBQUVELGNBQUlSLGNBQWM4QixhQUFhLENBQS9CLEVBQWtDO0FBQ2hDbkIsMkJBQWUsSUFBZjtBQUNEO0FBQ0Y7O0FBRUQsWUFBTW9CLFFBQVEsRUFBZDs7QUFFQSxZQUFJdkIsZ0JBQWdCLENBQUNHLFlBQXJCLEVBQW1DO0FBQ2pDLGNBQU1xQixZQUFZRixjQUFjRCxhQUFhLENBQTNCLENBQWxCO0FBQ0EsZUFBSyxJQUFJSSxJQUFJRCxTQUFiLEVBQXdCQyxJQUFJSCxVQUE1QixFQUF3Q0csR0FBeEMsRUFBNkM7QUFDM0NGLGtCQUFNRyxJQUFOLENBQVdELENBQVg7QUFDRDtBQUNGLFNBTEQsTUFLTyxJQUFJLENBQUN6QixZQUFELElBQWlCRyxZQUFyQixFQUFtQztBQUN4QyxlQUFLLElBQUlzQixLQUFJLENBQWIsRUFBZ0JBLEtBQUlKLFVBQXBCLEVBQWdDSSxJQUFoQyxFQUFxQztBQUNuQ0Ysa0JBQU1HLElBQU4sQ0FBV0QsRUFBWDtBQUNEO0FBQ0YsU0FKTSxNQUlBLElBQUl6QixnQkFBZ0JHLFlBQXBCLEVBQWtDO0FBQ3ZDLGNBQU13QixTQUFTQyxLQUFLQyxLQUFMLENBQVdSLGFBQWEsQ0FBeEIsSUFBNkIsQ0FBNUM7QUFDQSxlQUFLLElBQUlJLE1BQUlqQyxjQUFjbUMsTUFBM0IsRUFBb0NGLE9BQUtqQyxjQUFjbUMsTUFBdkQsRUFBK0RGLEtBQS9ELEVBQW9FO0FBQ2xFRixrQkFBTUcsSUFBTixDQUFXRCxHQUFYO0FBQ0Q7QUFDRixTQUxNLE1BS0E7QUFDTCxlQUFLLElBQUlBLE1BQUksQ0FBYixFQUFnQkEsTUFBSUgsVUFBcEIsRUFBZ0NHLEtBQWhDLEVBQXFDO0FBQ25DRixrQkFBTUcsSUFBTixDQUFXRCxHQUFYO0FBQ0Q7QUFDRjs7QUFFRCxhQUFLekIsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxhQUFLRyxZQUFMLEdBQW9CQSxZQUFwQjs7QUFFQSxlQUFPb0IsS0FBUDtBQUNEO0FBbERPLEtBM0VHOztBQWdJYk8sUUFoSWEsa0JBZ0lOO0FBQ0wsYUFBTztBQUNMQyxpQkFBUyxJQURKO0FBRUwvQixzQkFBYyxLQUZUO0FBR0xHLHNCQUFjLEtBSFQ7QUFJTEMsNEJBQW9CLG9CQUpmO0FBS0xGLDRCQUFvQjtBQUxmLE9BQVA7QUFPRDtBQXhJWSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvUGFnaW5hdGlvbi9QYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBhZ2VyVGVtcGxhdGUgPSBgXG48dWwgQGNsaWNrPVwib25QYWdlckNsaWNrXCIgY2xhc3M9XCJwYWdlclwiIDpjbGFzcz1cIm1vZGlmaWVyU3R5bGVzXCI+XG4gIDxsaVxuICAgIDpjbGFzcz1cInsgYWN0aXZlOiBjdXJyZW50UGFnZSA9PT0gMSB9XCJcbiAgICB2LWlmPVwicGFnZUNvdW50ID4gMFwiXG4gICAgY2xhc3M9XCJjaXJjbGUtYnV0dG9uXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaXJjbGUtYnV0dG9uX190ZXh0XCI+MTwvc3Bhbj5cbiAgPC9saT5cbiAgPGxpXG4gICAgY2xhc3M9XCJjaXJjbGUtYnV0dG9uIG1vcmUgcXVpY2twcmV2XCIgICAgXG4gICAgdi1pZj1cInNob3dQcmV2TW9yZVwiXG4gICAgQG1vdXNlZW50ZXI9XCJxdWlja3ByZXZJY29uQ2xhc3MgPSAnZmEtaWNvbi1hbmdsZS1kb3VibGUtbGVmdCdcIlxuICAgIEBtb3VzZWxlYXZlPVwicXVpY2twcmV2SWNvbkNsYXNzID0gJ2ZhLWljb24tZWxsaXBzaXMtaCdcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHRcIiA6Y2xhc3M9XCJbcXVpY2twcmV2SWNvbkNsYXNzXVwiPjwvc3Bhbj5cbiAgPC9saT5cbiAgPGxpXG4gICAgdi1mb3I9XCJwYWdlciBpbiBwYWdlcnNcIlxuICAgIDpjbGFzcz1cInsgYWN0aXZlOiBjdXJyZW50UGFnZSA9PT0gcGFnZXIgfVwiXG4gICAgY2xhc3M9XCJjaXJjbGUtYnV0dG9uXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaXJjbGUtYnV0dG9uX190ZXh0XCI+e3sgcGFnZXIgfX08L3NwYW4+XG4gIDwvbGk+XG4gIDxsaVxuICAgIGNsYXNzPVwiY2lyY2xlLWJ1dHRvbiBtb3JlIHF1aWNrbmV4dFwiXG4gICAgdi1pZj1cInNob3dOZXh0TW9yZVwiXG4gICAgQG1vdXNlZW50ZXI9XCJxdWlja25leHRJY29uQ2xhc3MgPSAnZmEtaWNvbi1hbmdsZS1kb3VibGUtcmlnaHQnXCJcbiAgICBAbW91c2VsZWF2ZT1cInF1aWNrbmV4dEljb25DbGFzcyA9ICdmYS1pY29uLWVsbGlwc2lzLWgnXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaXJjbGUtYnV0dG9uX190ZXh0XCIgOmNsYXNzPVwiW3F1aWNrbmV4dEljb25DbGFzc11cIj48L3NwYW4+XG4gIDwvbGk+XG4gIDxsaVxuICAgIDpjbGFzcz1cInsgYWN0aXZlOiBjdXJyZW50UGFnZSA9PT0gcGFnZUNvdW50IH1cIlxuICAgIGNsYXNzPVwiY2lyY2xlLWJ1dHRvblwiXG4gICAgdi1pZj1cInBhZ2VDb3VudCA+IDFcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHRcIj57eyBwYWdlQ291bnQgfX08L3NwYW4+XG4gICAgPC9saT5cbjwvdWw+XG5gO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVtcGxhdGU6IHBhZ2VyVGVtcGxhdGUsXG4gIG5hbWU6ICdQYWdlcicsXG4gIHByb3BzOiB7XG4gICAgY3VycmVudFBhZ2U6IE51bWJlcixcbiAgICBwYWdlQ291bnQ6IE51bWJlcixcbiAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHNob3dQcmV2TW9yZSh2YWwpIHtcbiAgICAgIGlmICghdmFsKSB0aGlzLnF1aWNrcHJldkljb25DbGFzcyA9ICdmYS1pY29uLWFuZ2xlLWRvdWJsZS1sZWZ0JztcbiAgICB9LFxuXG4gICAgc2hvd05leHRNb3JlKHZhbCkge1xuICAgICAgaWYgKCF2YWwpIHRoaXMucXVpY2tuZXh0SWNvbkNsYXNzID0gJ2ZhLWljb24tYW5nbGUtZG91YmxlLXJpZ2h0JztcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uUGFnZXJDbGljayhldmVudCkge1xuICAgICAgLy8gTWV0aG9kIGdldHMgdGhlIGRlc2lyZWQgbmV3UGFnZSBudW1iZXIgdmlhIEBjbGljayBcbiAgICAgIC8vIElmIHlvdSBjbGljayB0aGUgLm1vcmUgYXJyb3dzIG5ld1BhZ2Ugd2lsbCBiZSA1IG1vcmUgb3IgbGVzcyAgXG4gICAgICAvLyBvdGhlcndpc2UgdGhlIHBhZ2UgY2hhbmdlIGxvZ2ljIHdpbGwgYmUgaGFuZGxlZCBieSBwYXJlbnQgIFxuICAgICAgLy8gdmlhIEBjaGFuZ2UgZXZlbnQuICAgIFxuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgaWYgKHRhcmdldC50YWdOYW1lID09PSAnVUwnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gR3JhYiB0aGUgPGxpPiBudW1iZXIgdGhhdCB3YXMgY2xpY2tlZCBcbiAgICAgIGxldCBuZXdQYWdlID0gTnVtYmVyKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCk7XG4gICAgICBjb25zdCBwYWdlQ291bnQgPSB0aGlzLnBhZ2VDb3VudDtcbiAgICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcbiAgICAgIGNvbnN0IGxhc3RQYWdlSW5TZXQgPSB0aGlzLnBhZ2Vyc1t0aGlzLnBhZ2Vycy5sZW5ndGggLSAxXTtcbiAgICAgIGNvbnNvbGUubG9nKFwiUEFHRVJTOiBcIiwgbGFzdFBhZ2VJblNldCk7XG5cbiAgICAgIC8vIElmIHRoZSA8bGk+IHRoYXQgd2FzIGNsaWNrZWQgaXMgYSAubW9yZSBkb3VibGUgYXJyb3cgaWNvbiBcbiAgICAgIC8vIFRoZW4gYXV0b21hdGljYWxseSBqdW1wIGZpdmUgcGFnZXMgbGVzcyBvciBtb3JlLlxuICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignbW9yZScpICE9PSAtMSkge1xuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdxdWlja3ByZXYnKSAhPT0gLTEpIHtcbiAgICAgICAgICBpZiAobGFzdFBhZ2VJblNldCAtIGN1cnJlbnRQYWdlIDw9IDEgJiYgbGFzdFBhZ2VJblNldCArIDEgPT0gcGFnZUNvdW50KSB7XG4gICAgICAgICAgICBuZXdQYWdlID0gbGFzdFBhZ2VJblNldCAtIDI7ICAgIFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdQYWdlID0gbGFzdFBhZ2VJblNldCAtIDM7XG4gICAgICAgICAgfSAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3F1aWNrbmV4dCcpICE9PSAtMSkge1xuICAgICAgICAgIG5ld1BhZ2UgPSBsYXN0UGFnZUluU2V0ICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVja3MgdG8ga2VlcCB0aGUgbmV3IGFjdGl2ZSBwYWdlIHdpdGhpbiBib3VuZHMgXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIC8vIGlmICghaXNOYU4obmV3UGFnZSkpIHtcbiAgICAgICAgaWYgKG5ld1BhZ2UgPCAxKSB7XG4gICAgICAgICAgbmV3UGFnZSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3UGFnZSA+IHBhZ2VDb3VudCkge1xuICAgICAgICAgIG5ld1BhZ2UgPSBwYWdlQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgLy8gSWYgdGhlIG5ldyBwYWdlIGNsaWNrZWQgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9nIHBhZ2UgXG4gICAgICAvLyBlbWl0IHRoZSBAY2hhbmdlIGV2ZW50IHRvIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICAgICAgLy8gUGFnaW5hdGlvbiBjb21wb25lbnQgd2lsbCBoYW5kbGUgdGhpcyBjaGFuZ2UgZXZlbnQuICBcbiAgICAgIGlmIChuZXdQYWdlICE9PSBjdXJyZW50UGFnZSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdQYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBwYWdlcnMoKSB7XG4gICAgICBjb25zdCBwYWdlckNvdW50ID0gNDtcblxuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBOdW1iZXIodGhpcy5jdXJyZW50UGFnZSk7XG4gICAgICBjb25zdCB0b3RhbFBhZ2VzID0gTnVtYmVyKHRoaXMucGFnZUNvdW50KTtcblxuICAgICAgbGV0IHNob3dQcmV2TW9yZSA9IGZhbHNlO1xuICAgICAgbGV0IHNob3dOZXh0TW9yZSA9IGZhbHNlO1xuXG4gICAgICBpZiAodG90YWxQYWdlcyA+IHBhZ2VyQ291bnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlID4gcGFnZXJDb3VudCAtIDIpIHtcbiAgICAgICAgICBzaG93UHJldk1vcmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlIDw9IDMpIHtcbiAgICAgICAgICBzaG93UHJldk1vcmUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA8IHRvdGFsUGFnZXMgLSAyKSB7XG4gICAgICAgICAgc2hvd05leHRNb3JlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhcnJheSA9IFtdO1xuXG4gICAgICBpZiAoc2hvd1ByZXZNb3JlICYmICFzaG93TmV4dE1vcmUpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQYWdlID0gdG90YWxQYWdlcyAtIChwYWdlckNvdW50IC0gMik7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydFBhZ2U7IGkgPCB0b3RhbFBhZ2VzOyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgcGFnZXJDb3VudDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaG93UHJldk1vcmUgJiYgc2hvd05leHRNb3JlKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IE1hdGguZmxvb3IocGFnZXJDb3VudCAvIDIpIC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGN1cnJlbnRQYWdlIC0gb2Zmc2V0IDsgaSA8PSBjdXJyZW50UGFnZSArIG9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCB0b3RhbFBhZ2VzOyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1ByZXZNb3JlID0gc2hvd1ByZXZNb3JlO1xuICAgICAgdGhpcy5zaG93TmV4dE1vcmUgPSBzaG93TmV4dE1vcmU7XG5cbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogbnVsbCxcbiAgICAgIHNob3dQcmV2TW9yZTogZmFsc2UsXG4gICAgICBzaG93TmV4dE1vcmU6IGZhbHNlLFxuICAgICAgcXVpY2tuZXh0SWNvbkNsYXNzOiAnZmEtaWNvbi1lbGxpcHNpcy1oJyxcbiAgICAgIHF1aWNrcHJldkljb25DbGFzczogJ2ZhLWljb24tZWxsaXBzaXMtaCdcbiAgICB9O1xuICB9XG59O1xuIl19
