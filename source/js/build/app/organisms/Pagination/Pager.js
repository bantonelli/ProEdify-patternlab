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
        // console.log("PAGERS: ", lastPageInSet);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9vcmdhbmlzbXMvUGFnaW5hdGlvbi9QYWdlci5qcyJdLCJuYW1lcyI6WyJwYWdlclRlbXBsYXRlIiwidGVtcGxhdGUiLCJuYW1lIiwicHJvcHMiLCJjdXJyZW50UGFnZSIsIk51bWJlciIsInBhZ2VDb3VudCIsIm1vZGlmaWVyU3R5bGVzIiwidHlwZSIsIkFycmF5IiwiZGVmYXVsdCIsIndhdGNoIiwic2hvd1ByZXZNb3JlIiwidmFsIiwicXVpY2twcmV2SWNvbkNsYXNzIiwic2hvd05leHRNb3JlIiwicXVpY2tuZXh0SWNvbkNsYXNzIiwibWV0aG9kcyIsIm9uUGFnZXJDbGljayIsImV2ZW50IiwidGFyZ2V0IiwidGFnTmFtZSIsIm5ld1BhZ2UiLCJ0ZXh0Q29udGVudCIsImxhc3RQYWdlSW5TZXQiLCJwYWdlcnMiLCJsZW5ndGgiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwiJGVtaXQiLCJjb21wdXRlZCIsInBhZ2VyQ291bnQiLCJ0b3RhbFBhZ2VzIiwiYXJyYXkiLCJzdGFydFBhZ2UiLCJpIiwicHVzaCIsIm9mZnNldCIsIk1hdGgiLCJmbG9vciIsImRhdGEiLCJjdXJyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSw2ckNBQU47O29CQXNDZTtBQUNiQyxjQUFVRCxhQURHO0FBRWJFLFVBQU0sT0FGTztBQUdiQyxXQUFPO0FBQ0xDLG1CQUFhQyxNQURSO0FBRUxDLGlCQUFXRCxNQUZOO0FBR0xFLHNCQUFnQjtBQUNkQyxjQUFNQyxLQURRO0FBRWRDLGlCQUFTO0FBRks7QUFIWCxLQUhNOztBQVliQyxXQUFPO0FBQ0xDLGtCQURLLHdCQUNRQyxHQURSLEVBQ2E7QUFDaEIsWUFBSSxDQUFDQSxHQUFMLEVBQVUsS0FBS0Msa0JBQUwsR0FBMEIsMkJBQTFCO0FBQ1gsT0FISTtBQUtMQyxrQkFMSyx3QkFLUUYsR0FMUixFQUthO0FBQ2hCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVLEtBQUtHLGtCQUFMLEdBQTBCLDRCQUExQjtBQUNYO0FBUEksS0FaTTs7QUFzQmJDLGFBQVM7QUFDUEMsa0JBRE8sd0JBQ01DLEtBRE4sRUFDYTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQU1DLFNBQVNELE1BQU1DLE1BQXJCO0FBQ0EsWUFBSUEsT0FBT0MsT0FBUCxLQUFtQixJQUF2QixFQUE2QjtBQUMzQjtBQUNEOztBQUVEO0FBQ0EsWUFBSUMsVUFBVWpCLE9BQU9jLE1BQU1DLE1BQU4sQ0FBYUcsV0FBcEIsQ0FBZDtBQUNBLFlBQU1qQixZQUFZLEtBQUtBLFNBQXZCO0FBQ0EsWUFBTUYsY0FBYyxLQUFLQSxXQUF6QjtBQUNBLFlBQU1vQixnQkFBZ0IsS0FBS0MsTUFBTCxDQUFZLEtBQUtBLE1BQUwsQ0FBWUMsTUFBWixHQUFxQixDQUFqQyxDQUF0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFJTixPQUFPTyxTQUFQLENBQWlCQyxPQUFqQixDQUF5QixNQUF6QixNQUFxQyxDQUFDLENBQTFDLEVBQTZDO0FBQzNDLGNBQUlSLE9BQU9PLFNBQVAsQ0FBaUJDLE9BQWpCLENBQXlCLFdBQXpCLE1BQTBDLENBQUMsQ0FBL0MsRUFBa0Q7QUFDaEQsZ0JBQUlKLGdCQUFnQnBCLFdBQWhCLElBQStCLENBQS9CLElBQW9Db0IsZ0JBQWdCLENBQWhCLElBQXFCbEIsU0FBN0QsRUFBd0U7QUFDdEVnQix3QkFBVUUsZ0JBQWdCLENBQTFCO0FBQ0QsYUFGRCxNQUVPO0FBQ0xGLHdCQUFVRSxnQkFBZ0IsQ0FBMUI7QUFDRDtBQUNGLFdBTkQsTUFNTyxJQUFJSixPQUFPTyxTQUFQLENBQWlCQyxPQUFqQixDQUF5QixXQUF6QixNQUEwQyxDQUFDLENBQS9DLEVBQWtEO0FBQ3ZETixzQkFBVUUsZ0JBQWdCLENBQTFCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDRSxZQUFJRixVQUFVLENBQWQsRUFBaUI7QUFDZkEsb0JBQVUsQ0FBVjtBQUNEOztBQUVELFlBQUlBLFVBQVVoQixTQUFkLEVBQXlCO0FBQ3ZCZ0Isb0JBQVVoQixTQUFWO0FBQ0Q7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJZ0IsWUFBWWxCLFdBQWhCLEVBQTZCO0FBQzNCLGVBQUt5QixLQUFMLENBQVcsUUFBWCxFQUFxQlAsT0FBckI7QUFDRDtBQUNGO0FBbERNLEtBdEJJOztBQTJFYlEsY0FBVTtBQUNSTCxZQURRLG9CQUNDO0FBQ1AsWUFBTU0sYUFBYSxDQUFuQjs7QUFFQSxZQUFNM0IsY0FBY0MsT0FBTyxLQUFLRCxXQUFaLENBQXBCO0FBQ0EsWUFBTTRCLGFBQWEzQixPQUFPLEtBQUtDLFNBQVosQ0FBbkI7O0FBRUEsWUFBSU0sZUFBZSxLQUFuQjtBQUNBLFlBQUlHLGVBQWUsS0FBbkI7O0FBRUEsWUFBSWlCLGFBQWFELFVBQWpCLEVBQTZCO0FBQzNCLGNBQUkzQixjQUFjMkIsYUFBYSxDQUEvQixFQUFrQztBQUNoQ25CLDJCQUFlLElBQWY7QUFDRDs7QUFFRCxjQUFJUixlQUFlLENBQW5CLEVBQXNCO0FBQ3BCUSwyQkFBZSxLQUFmO0FBQ0Q7O0FBRUQsY0FBSVIsY0FBYzRCLGFBQWEsQ0FBL0IsRUFBa0M7QUFDaENqQiwyQkFBZSxJQUFmO0FBQ0Q7QUFDRjs7QUFFRCxZQUFNa0IsUUFBUSxFQUFkOztBQUVBLFlBQUlyQixnQkFBZ0IsQ0FBQ0csWUFBckIsRUFBbUM7QUFDakMsY0FBTW1CLFlBQVlGLGNBQWNELGFBQWEsQ0FBM0IsQ0FBbEI7QUFDQSxlQUFLLElBQUlJLElBQUlELFNBQWIsRUFBd0JDLElBQUlILFVBQTVCLEVBQXdDRyxHQUF4QyxFQUE2QztBQUMzQ0Ysa0JBQU1HLElBQU4sQ0FBV0QsQ0FBWDtBQUNEO0FBQ0YsU0FMRCxNQUtPLElBQUksQ0FBQ3ZCLFlBQUQsSUFBaUJHLFlBQXJCLEVBQW1DO0FBQ3hDLGVBQUssSUFBSW9CLEtBQUksQ0FBYixFQUFnQkEsS0FBSUosVUFBcEIsRUFBZ0NJLElBQWhDLEVBQXFDO0FBQ25DRixrQkFBTUcsSUFBTixDQUFXRCxFQUFYO0FBQ0Q7QUFDRixTQUpNLE1BSUEsSUFBSXZCLGdCQUFnQkcsWUFBcEIsRUFBa0M7QUFDdkMsY0FBTXNCLFNBQVNDLEtBQUtDLEtBQUwsQ0FBV1IsYUFBYSxDQUF4QixJQUE2QixDQUE1QztBQUNBLGVBQUssSUFBSUksTUFBSS9CLGNBQWNpQyxNQUEzQixFQUFvQ0YsT0FBSy9CLGNBQWNpQyxNQUF2RCxFQUErREYsS0FBL0QsRUFBb0U7QUFDbEVGLGtCQUFNRyxJQUFOLENBQVdELEdBQVg7QUFDRDtBQUNGLFNBTE0sTUFLQTtBQUNMLGVBQUssSUFBSUEsTUFBSSxDQUFiLEVBQWdCQSxNQUFJSCxVQUFwQixFQUFnQ0csS0FBaEMsRUFBcUM7QUFDbkNGLGtCQUFNRyxJQUFOLENBQVdELEdBQVg7QUFDRDtBQUNGOztBQUVELGFBQUt2QixZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLGFBQUtHLFlBQUwsR0FBb0JBLFlBQXBCOztBQUVBLGVBQU9rQixLQUFQO0FBQ0Q7QUFsRE8sS0EzRUc7O0FBZ0liTyxRQWhJYSxrQkFnSU47QUFDTCxhQUFPO0FBQ0xDLGlCQUFTLElBREo7QUFFTDdCLHNCQUFjLEtBRlQ7QUFHTEcsc0JBQWMsS0FIVDtBQUlMQyw0QkFBb0Isb0JBSmY7QUFLTEYsNEJBQW9CO0FBTGYsT0FBUDtBQU9EO0FBeElZLEciLCJmaWxlIjoiYXBwL29yZ2FuaXNtcy9QYWdpbmF0aW9uL1BhZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGFnZXJUZW1wbGF0ZSA9IGBcbjx1bCBAY2xpY2s9XCJvblBhZ2VyQ2xpY2tcIiBjbGFzcz1cInBhZ2VyXCIgOmNsYXNzPVwibW9kaWZpZXJTdHlsZXNcIj5cbiAgPGxpXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSAxIH1cIlxuICAgIHYtaWY9XCJwYWdlQ291bnQgPiAwXCJcbiAgICBjbGFzcz1cImNpcmNsZS1idXR0b25cIj5cbiAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHRcIj4xPC9zcGFuPlxuICA8L2xpPlxuICA8bGlcbiAgICBjbGFzcz1cImNpcmNsZS1idXR0b24gbW9yZSBxdWlja3ByZXZcIiAgICBcbiAgICB2LWlmPVwic2hvd1ByZXZNb3JlXCJcbiAgICBAbW91c2VlbnRlcj1cInF1aWNrcHJldkljb25DbGFzcyA9ICdmYS1pY29uLWFuZ2xlLWRvdWJsZS1sZWZ0J1wiXG4gICAgQG1vdXNlbGVhdmU9XCJxdWlja3ByZXZJY29uQ2xhc3MgPSAnZmEtaWNvbi1lbGxpcHNpcy1oJ1wiPlxuICAgIDxzcGFuIGNsYXNzPVwiY2lyY2xlLWJ1dHRvbl9fdGV4dFwiIDpjbGFzcz1cIltxdWlja3ByZXZJY29uQ2xhc3NdXCI+PC9zcGFuPlxuICA8L2xpPlxuICA8bGlcbiAgICB2LWZvcj1cInBhZ2VyIGluIHBhZ2Vyc1wiXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSBwYWdlciB9XCJcbiAgICBjbGFzcz1cImNpcmNsZS1idXR0b25cIj5cbiAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHRcIj57eyBwYWdlciB9fTwvc3Bhbj5cbiAgPC9saT5cbiAgPGxpXG4gICAgY2xhc3M9XCJjaXJjbGUtYnV0dG9uIG1vcmUgcXVpY2tuZXh0XCJcbiAgICB2LWlmPVwic2hvd05leHRNb3JlXCJcbiAgICBAbW91c2VlbnRlcj1cInF1aWNrbmV4dEljb25DbGFzcyA9ICdmYS1pY29uLWFuZ2xlLWRvdWJsZS1yaWdodCdcIlxuICAgIEBtb3VzZWxlYXZlPVwicXVpY2tuZXh0SWNvbkNsYXNzID0gJ2ZhLWljb24tZWxsaXBzaXMtaCdcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHRcIiA6Y2xhc3M9XCJbcXVpY2tuZXh0SWNvbkNsYXNzXVwiPjwvc3Bhbj5cbiAgPC9saT5cbiAgPGxpXG4gICAgOmNsYXNzPVwieyBhY3RpdmU6IGN1cnJlbnRQYWdlID09PSBwYWdlQ291bnQgfVwiXG4gICAgY2xhc3M9XCJjaXJjbGUtYnV0dG9uXCJcbiAgICB2LWlmPVwicGFnZUNvdW50ID4gMVwiPlxuICAgIDxzcGFuIGNsYXNzPVwiY2lyY2xlLWJ1dHRvbl9fdGV4dFwiPnt7IHBhZ2VDb3VudCB9fTwvc3Bhbj5cbiAgICA8L2xpPlxuPC91bD5cbmA7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICB0ZW1wbGF0ZTogcGFnZXJUZW1wbGF0ZSxcbiAgbmFtZTogJ1BhZ2VyJyxcbiAgcHJvcHM6IHtcbiAgICBjdXJyZW50UGFnZTogTnVtYmVyLFxuICAgIHBhZ2VDb3VudDogTnVtYmVyLFxuICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSwgXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgc2hvd1ByZXZNb3JlKHZhbCkge1xuICAgICAgaWYgKCF2YWwpIHRoaXMucXVpY2twcmV2SWNvbkNsYXNzID0gJ2ZhLWljb24tYW5nbGUtZG91YmxlLWxlZnQnO1xuICAgIH0sXG5cbiAgICBzaG93TmV4dE1vcmUodmFsKSB7XG4gICAgICBpZiAoIXZhbCkgdGhpcy5xdWlja25leHRJY29uQ2xhc3MgPSAnZmEtaWNvbi1hbmdsZS1kb3VibGUtcmlnaHQnO1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25QYWdlckNsaWNrKGV2ZW50KSB7XG4gICAgICAvLyBNZXRob2QgZ2V0cyB0aGUgZGVzaXJlZCBuZXdQYWdlIG51bWJlciB2aWEgQGNsaWNrIFxuICAgICAgLy8gSWYgeW91IGNsaWNrIHRoZSAubW9yZSBhcnJvd3MgbmV3UGFnZSB3aWxsIGJlIDUgbW9yZSBvciBsZXNzICBcbiAgICAgIC8vIG90aGVyd2lzZSB0aGUgcGFnZSBjaGFuZ2UgbG9naWMgd2lsbCBiZSBoYW5kbGVkIGJ5IHBhcmVudCAgXG4gICAgICAvLyB2aWEgQGNoYW5nZSBldmVudC4gICAgXG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09ICdVTCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBHcmFiIHRoZSA8bGk+IG51bWJlciB0aGF0IHdhcyBjbGlja2VkIFxuICAgICAgbGV0IG5ld1BhZ2UgPSBOdW1iZXIoZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcbiAgICAgIGNvbnN0IHBhZ2VDb3VudCA9IHRoaXMucGFnZUNvdW50O1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xuICAgICAgY29uc3QgbGFzdFBhZ2VJblNldCA9IHRoaXMucGFnZXJzW3RoaXMucGFnZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJQQUdFUlM6IFwiLCBsYXN0UGFnZUluU2V0KTtcblxuICAgICAgLy8gSWYgdGhlIDxsaT4gdGhhdCB3YXMgY2xpY2tlZCBpcyBhIC5tb3JlIGRvdWJsZSBhcnJvdyBpY29uIFxuICAgICAgLy8gVGhlbiBhdXRvbWF0aWNhbGx5IGp1bXAgZml2ZSBwYWdlcyBsZXNzIG9yIG1vcmUuXG4gICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdtb3JlJykgIT09IC0xKSB7XG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3F1aWNrcHJldicpICE9PSAtMSkge1xuICAgICAgICAgIGlmIChsYXN0UGFnZUluU2V0IC0gY3VycmVudFBhZ2UgPD0gMSAmJiBsYXN0UGFnZUluU2V0ICsgMSA9PSBwYWdlQ291bnQpIHtcbiAgICAgICAgICAgIG5ld1BhZ2UgPSBsYXN0UGFnZUluU2V0IC0gMjsgICAgXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1BhZ2UgPSBsYXN0UGFnZUluU2V0IC0gMztcbiAgICAgICAgICB9ICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncXVpY2tuZXh0JykgIT09IC0xKSB7XG4gICAgICAgICAgbmV3UGFnZSA9IGxhc3RQYWdlSW5TZXQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrcyB0byBrZWVwIHRoZSBuZXcgYWN0aXZlIHBhZ2Ugd2l0aGluIGJvdW5kcyBcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgLy8gaWYgKCFpc05hTihuZXdQYWdlKSkge1xuICAgICAgICBpZiAobmV3UGFnZSA8IDEpIHtcbiAgICAgICAgICBuZXdQYWdlID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdQYWdlID4gcGFnZUNvdW50KSB7XG4gICAgICAgICAgbmV3UGFnZSA9IHBhZ2VDb3VudDtcbiAgICAgICAgfVxuICAgICAgLy8gfVxuXG4gICAgICAvLyBJZiB0aGUgbmV3IHBhZ2UgY2xpY2tlZCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb2cgcGFnZSBcbiAgICAgIC8vIGVtaXQgdGhlIEBjaGFuZ2UgZXZlbnQgdG8gdGhlIHBhcmVudCBjb21wb25lbnQuXG4gICAgICAvLyBQYWdpbmF0aW9uIGNvbXBvbmVudCB3aWxsIGhhbmRsZSB0aGlzIGNoYW5nZSBldmVudC4gIFxuICAgICAgaWYgKG5ld1BhZ2UgIT09IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIG5ld1BhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHBhZ2VycygpIHtcbiAgICAgIGNvbnN0IHBhZ2VyQ291bnQgPSA0O1xuXG4gICAgICBjb25zdCBjdXJyZW50UGFnZSA9IE51bWJlcih0aGlzLmN1cnJlbnRQYWdlKTtcbiAgICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBOdW1iZXIodGhpcy5wYWdlQ291bnQpO1xuXG4gICAgICBsZXQgc2hvd1ByZXZNb3JlID0gZmFsc2U7XG4gICAgICBsZXQgc2hvd05leHRNb3JlID0gZmFsc2U7XG5cbiAgICAgIGlmICh0b3RhbFBhZ2VzID4gcGFnZXJDb3VudCkge1xuICAgICAgICBpZiAoY3VycmVudFBhZ2UgPiBwYWdlckNvdW50IC0gMikge1xuICAgICAgICAgIHNob3dQcmV2TW9yZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFBhZ2UgPD0gMykge1xuICAgICAgICAgIHNob3dQcmV2TW9yZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlIDwgdG90YWxQYWdlcyAtIDIpIHtcbiAgICAgICAgICBzaG93TmV4dE1vcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFycmF5ID0gW107XG5cbiAgICAgIGlmIChzaG93UHJldk1vcmUgJiYgIXNob3dOZXh0TW9yZSkge1xuICAgICAgICBjb25zdCBzdGFydFBhZ2UgPSB0b3RhbFBhZ2VzIC0gKHBhZ2VyQ291bnQgLSAyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0UGFnZTsgaSA8IHRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXNob3dQcmV2TW9yZSAmJiBzaG93TmV4dE1vcmUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBwYWdlckNvdW50OyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNob3dQcmV2TW9yZSAmJiBzaG93TmV4dE1vcmUpIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5mbG9vcihwYWdlckNvdW50IC8gMikgLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gY3VycmVudFBhZ2UgLSBvZmZzZXQgOyBpIDw9IGN1cnJlbnRQYWdlICsgb2Zmc2V0OyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IHRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UHJldk1vcmUgPSBzaG93UHJldk1vcmU7XG4gICAgICB0aGlzLnNob3dOZXh0TW9yZSA9IHNob3dOZXh0TW9yZTtcblxuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBudWxsLFxuICAgICAgc2hvd1ByZXZNb3JlOiBmYWxzZSxcbiAgICAgIHNob3dOZXh0TW9yZTogZmFsc2UsXG4gICAgICBxdWlja25leHRJY29uQ2xhc3M6ICdmYS1pY29uLWVsbGlwc2lzLWgnLFxuICAgICAgcXVpY2twcmV2SWNvbkNsYXNzOiAnZmEtaWNvbi1lbGxpcHNpcy1oJ1xuICAgIH07XG4gIH1cbn07XG4iXX0=
