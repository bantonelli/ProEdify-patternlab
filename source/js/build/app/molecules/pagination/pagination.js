define(['exports', './Pager', '../../atoms/Select'], function (exports, _Pager, _Select) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Pager2 = _interopRequireDefault(_Pager);

  var _Select2 = _interopRequireDefault(_Select);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    name: 'ElPagination',

    props: {
      pageSize: {
        type: Number,
        default: 10
      },

      // small: Boolean,

      total: Number,

      pageCount: Number,

      currentPage: {
        type: Number,
        default: 1
      },

      layout: {
        default: 'prev, pager, next, jumper, ->, total'
      },

      pageSizes: {
        type: Array,
        default: function _default() {
          return [10, 20, 30, 40, 50, 100];
        }
      }
    },

    data: function data() {
      return {
        internalCurrentPage: 1,
        internalPageSize: 0
      };
    },
    render: function render(h) {
      // make master template 
      var template = h(
        'div',
        { 'class': 'el-pagination' },
        []
      );

      // layout is either taken as a prop or is an empty string if not passed in 
      var layout = this.layout || '';
      if (!layout) return;

      // Create map of layout keys to respective markup 
      var TEMPLATE_MAP = {
        prev: h(
          'prev',
          null,
          []
        ),
        jumper: h(
          'jumper',
          null,
          []
        ),
        pager: h(
          'pager',
          {
            attrs: { currentPage: this.internalCurrentPage, pageCount: this.internalPageCount },
            on: {
              'change': this.handleCurrentChange
            }
          },
          []
        ),
        next: h(
          'next',
          null,
          []
        ),
        sizes: h(
          'sizes',
          {
            attrs: { pageSizes: this.pageSizes }
          },
          []
        ),
        slot: h(
          'my-slot',
          null,
          []
        ),
        total: h(
          'total',
          null,
          []
        )
      };

      // components = array of strings that correlate to keys in TEMPLATE_MAP 
      var components = layout.split(',').map(function (item) {
        return item.trim();
      });
      var rightWrapper = h(
        'div',
        { 'class': 'el-pagination__rightwrapper' },
        []
      );
      var haveRightWrapper = false;

      // if (this.small) {
      //   template.data.class += ' el-pagination--small';
      // }

      // Loop through components array 
      components.forEach(function (compo) {
        if (compo === '->') {
          haveRightWrapper = true;
          return;
        }

        if (!haveRightWrapper) {
          template.children.push(TEMPLATE_MAP[compo]);
        } else {
          rightWrapper.children.push(TEMPLATE_MAP[compo]);
        }
      });

      if (haveRightWrapper) {
        template.children.unshift(rightWrapper);
      }

      return template;
    },


    components: {
      MySlot: {
        render: function render(h) {
          return this.$parent.$slots.default ? this.$parent.$slots.default[0] : '';
        }
      },
      Prev: {
        render: function render(h) {
          return h(
            'button',
            {
              attrs: {
                type: 'button'
              },
              'class': ['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }],
              on: {
                'click': this.$parent.prev
              }
            },
            [h(
              'i',
              { 'class': 'el-icon el-icon-arrow-left' },
              []
            )]
          );
        }
      },

      Next: {
        render: function render(h) {
          return h(
            'button',
            {
              attrs: {
                type: 'button'
              },
              'class': ['btn-next', { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }],
              on: {
                'click': this.$parent.next
              }
            },
            [h(
              'i',
              { 'class': 'el-icon el-icon-arrow-right' },
              []
            )]
          );
        }
      },

      // Done Refactoring
      Sizes: {
        // mixins: [Locale],

        props: {
          pageSizes: Array
        },

        watch: {
          pageSizes: {
            immediate: true,
            handler: function handler(value) {
              if (Array.isArray(value)) {
                this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1 ? this.$parent.pageSize : this.pageSizes[0];
              }
            }
          }
        },

        render: function render(h) {
          return h(
            'pe-select',
            {
              attrs: {
                placeholdertext: this.$parent.internalPageSize,

                options: this.pageSizes
              },
              on: {
                'input': this.handleChange
              }
            },
            []
          );
        },


        components: {
          'pe-select': _Select2.default
        },

        methods: {
          handleChange: function handleChange(val) {
            if (val !== this.$parent.internalPageSize) {
              this.$parent.internalPageSize = val = parseInt(val, 10);
              this.$parent.$emit('size-change', val);
            }
          }
        }
      },

      // Done Refactoring 
      Jumper: {
        data: function data() {
          return {
            oldValue: null
          };
        },


        methods: {
          handleFocus: function handleFocus(event) {
            this.oldValue = event.target.value;
          },
          handleChange: function handleChange(_ref) {
            var target = _ref.target;

            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
            this.oldValue = null;
          }
        },

        render: function render(h) {
          // return (
          //   <span class="el-pagination__jump">
          //     { this.t('el.pagination.goto') }
          //     <input
          //       class="el-pagination__editor"
          //       type="number"
          //       min={ 1 }
          //       max={ this.internalPageCount }
          //       value={ this.$parent.internalCurrentPage }
          //       on-change={ this.handleChange }
          //       on-focus={ this.handleFocus }
          //       number/>
          //     { this.t('el.pagination.pageClassifier') }
          //   </span>
          // );
          return h(
            'span',
            { 'class': 'el-pagination__jump' },
            [h(
              'input',
              {
                'class': 'el-pagination__editor',
                attrs: { type: 'number',
                  min: 1,
                  max: this.internalPageCount,
                  value: this.$parent.internalCurrentPage,

                  number: true },
                on: {
                  'change': this.handleChange,
                  'focus': this.handleFocus
                }
              },
              []
            )]
          );
        }
      },

      // Done Refactoring 
      Total: {
        render: function render(h) {
          // return (
          //   typeof this.$parent.total === 'number'
          //     ? <span class="el-pagination__total">{ this.t('el.pagination.total', { total: this.$parent.total }) }</span>
          //     : ''
          // );
          return typeof this.$parent.total === 'number' ? h(
            'span',
            { 'class': 'el-pagination__total' },
            ['total: ', this.$parent.total]
          ) : '';
        }
      },

      Pager: _Pager2.default
    },

    methods: {
      handleCurrentChange: function handleCurrentChange(val) {
        // Method to handle the @change sent by pager 
        this.internalCurrentPage = this.getValidCurrentPage(val);
      },
      prev: function prev() {
        var newVal = this.internalCurrentPage - 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      next: function next() {
        var newVal = this.internalCurrentPage + 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      getValidCurrentPage: function getValidCurrentPage(value) {
        // Method to validate page number 

        // Value is value of newPage 
        value = parseInt(value, 10);

        // havePageCount = true if internalPageCount is a number 
        var havePageCount = typeof this.internalPageCount === 'number';

        var resetValue = void 0;
        if (!havePageCount) {
          if (isNaN(value) || value < 1) resetValue = 1;
        } else {

          // if we have page count 
          if (value < 1) {
            // reset value to 1 if desired page is less than 1
            resetValue = 1;
          } else if (value > this.internalPageCount) {
            // reset value to max number if desired page is greater than total pages.
            resetValue = this.internalPageCount;
          }
        }

        // handle edge cases 
        if (resetValue === undefined && isNaN(value)) {
          resetValue = 1;
        } else if (resetValue === 0) {
          resetValue = 1;
        }

        // return either the newPage value or the resetValue if newPage has errors 
        return resetValue === undefined ? value : resetValue;
      }
    },

    computed: {
      internalPageCount: function internalPageCount() {
        if (typeof this.total === 'number') {
          return Math.ceil(this.total / this.internalPageSize);
        } else if (typeof this.pageCount === 'number') {
          return this.pageCount;
        }
        return null;
      }
    },

    watch: {
      currentPage: {
        immediate: true,
        handler: function handler(val) {
          this.internalCurrentPage = val;
        }
      },

      pageSize: {
        immediate: true,
        handler: function handler(val) {
          this.internalPageSize = val;
        }
      },

      internalCurrentPage: function internalCurrentPage(newVal, oldVal) {
        var _this = this;

        newVal = parseInt(newVal, 10);

        /* istanbul ignore if */
        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = this.getValidCurrentPage(newVal);
        }

        if (newVal !== undefined) {
          this.$nextTick(function () {
            _this.internalCurrentPage = newVal;
            if (oldVal !== newVal) {
              _this.$emit('update:currentPage', newVal);
              _this.$emit('current-change', _this.internalCurrentPage);
            }
          });
        } else {
          this.$emit('update:currentPage', newVal);
          this.$emit('current-change', this.internalCurrentPage);
        }
      },
      internalPageCount: function internalPageCount(newVal) {
        /* istanbul ignore if */
        var oldPage = this.internalCurrentPage;
        if (newVal > 0 && oldPage === 0) {
          this.internalCurrentPage = 1;
        } else if (oldPage > newVal) {
          this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        }
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvUGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJwcm9wcyIsInBhZ2VTaXplIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJ0b3RhbCIsInBhZ2VDb3VudCIsImN1cnJlbnRQYWdlIiwibGF5b3V0IiwicGFnZVNpemVzIiwiQXJyYXkiLCJkYXRhIiwiaW50ZXJuYWxDdXJyZW50UGFnZSIsImludGVybmFsUGFnZVNpemUiLCJyZW5kZXIiLCJoIiwidGVtcGxhdGUiLCJURU1QTEFURV9NQVAiLCJwcmV2IiwianVtcGVyIiwicGFnZXIiLCJpbnRlcm5hbFBhZ2VDb3VudCIsImhhbmRsZUN1cnJlbnRDaGFuZ2UiLCJuZXh0Iiwic2l6ZXMiLCJzbG90IiwiY29tcG9uZW50cyIsInNwbGl0IiwibWFwIiwiaXRlbSIsInRyaW0iLCJyaWdodFdyYXBwZXIiLCJoYXZlUmlnaHRXcmFwcGVyIiwiZm9yRWFjaCIsImNvbXBvIiwiY2hpbGRyZW4iLCJwdXNoIiwidW5zaGlmdCIsIk15U2xvdCIsIiRwYXJlbnQiLCIkc2xvdHMiLCJQcmV2IiwiZGlzYWJsZWQiLCJOZXh0IiwiU2l6ZXMiLCJ3YXRjaCIsImltbWVkaWF0ZSIsImhhbmRsZXIiLCJ2YWx1ZSIsImlzQXJyYXkiLCJpbmRleE9mIiwiaGFuZGxlQ2hhbmdlIiwibWV0aG9kcyIsInZhbCIsInBhcnNlSW50IiwiJGVtaXQiLCJKdW1wZXIiLCJvbGRWYWx1ZSIsImhhbmRsZUZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJnZXRWYWxpZEN1cnJlbnRQYWdlIiwiVG90YWwiLCJQYWdlciIsIm5ld1ZhbCIsImhhdmVQYWdlQ291bnQiLCJyZXNldFZhbHVlIiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJjb21wdXRlZCIsIk1hdGgiLCJjZWlsIiwib2xkVmFsIiwiJG5leHRUaWNrIiwib2xkUGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBTWU7QUFDYkEs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O0FBdUNMUyx1QkF2Q0ssNkJBdUNhMkMsTUF2Q2IsRUF1Q3FCO0FBQ3hCO0FBQ0EsWUFBTVUsVUFBVSxLQUFLOUQsbUJBQXJCO0FBQ0EsWUFBSW9ELFNBQVMsQ0FBVCxJQUFjVSxZQUFZLENBQTlCLEVBQWlDO0FBQy9CLGVBQUs5RCxtQkFBTCxHQUEyQixDQUEzQjtBQUNELFNBRkQsTUFFTyxJQUFJOEQsVUFBVVYsTUFBZCxFQUFzQjtBQUMzQixlQUFLcEQsbUJBQUwsR0FBMkJvRCxXQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CQSxNQUE5QztBQUNEO0FBQ0Y7QUEvQ0k7QUF0VE0sRyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL1BhZ2luYXRpb24vUGFnaW5hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlciBmcm9tICcuL1BhZ2VyJztcbmltcG9ydCBTZWxlY3QgZnJvbSAnLi4vLi4vYXRvbXMvU2VsZWN0Jztcbi8vIGltcG9ydCBFbFNlbGVjdCBmcm9tICdlbGVtZW50LXVpL3BhY2thZ2VzL3NlbGVjdCc7XG4vLyBpbXBvcnQgRWxPcHRpb24gZnJvbSAnZWxlbWVudC11aS9wYWNrYWdlcy9vcHRpb24nO1xuLy8gaW1wb3J0IExvY2FsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9jYWxlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnRWxQYWdpbmF0aW9uJyxcblxuICBwcm9wczoge1xuICAgIHBhZ2VTaXplOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxMFxuICAgIH0sXG5cbiAgICAvLyBzbWFsbDogQm9vbGVhbixcblxuICAgIHRvdGFsOiBOdW1iZXIsXG5cbiAgICBwYWdlQ291bnQ6IE51bWJlcixcblxuICAgIGN1cnJlbnRQYWdlOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcblxuICAgIGxheW91dDoge1xuICAgICAgZGVmYXVsdDogJ3ByZXYsIHBhZ2VyLCBuZXh0LCBqdW1wZXIsIC0+LCB0b3RhbCdcbiAgICB9LFxuXG4gICAgcGFnZVNpemVzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiBbMTAsIDIwLCAzMCwgNDAsIDUwLCAxMDBdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbEN1cnJlbnRQYWdlOiAxLFxuICAgICAgaW50ZXJuYWxQYWdlU2l6ZTogMFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKGgpIHtcbiAgICAvLyBtYWtlIG1hc3RlciB0ZW1wbGF0ZSBcbiAgICBsZXQgdGVtcGxhdGUgPSA8ZGl2IGNsYXNzPSdlbC1wYWdpbmF0aW9uJz48L2Rpdj47XG5cbiAgICAvLyBsYXlvdXQgaXMgZWl0aGVyIHRha2VuIGFzIGEgcHJvcCBvciBpcyBhbiBlbXB0eSBzdHJpbmcgaWYgbm90IHBhc3NlZCBpbiBcbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmxheW91dCB8fCAnJztcbiAgICBpZiAoIWxheW91dCkgcmV0dXJuO1xuXG4gICAgLy8gQ3JlYXRlIG1hcCBvZiBsYXlvdXQga2V5cyB0byByZXNwZWN0aXZlIG1hcmt1cCBcbiAgICBjb25zdCBURU1QTEFURV9NQVAgPSB7XG4gICAgICBwcmV2OiA8cHJldj48L3ByZXY+LFxuICAgICAganVtcGVyOiA8anVtcGVyPjwvanVtcGVyPixcbiAgICAgIHBhZ2VyOiA8cGFnZXIgY3VycmVudFBhZ2U9eyB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgfSBwYWdlQ291bnQ9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH0gb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDdXJyZW50Q2hhbmdlIH0+PC9wYWdlcj4sXG4gICAgICBuZXh0OiA8bmV4dD48L25leHQ+LFxuICAgICAgc2l6ZXM6IDxzaXplcyBwYWdlU2l6ZXM9eyB0aGlzLnBhZ2VTaXplcyB9Pjwvc2l6ZXM+LFxuICAgICAgc2xvdDogPG15LXNsb3Q+PC9teS1zbG90PixcbiAgICAgIHRvdGFsOiA8dG90YWw+PC90b3RhbD5cbiAgICB9O1xuXG4gICAgLy8gY29tcG9uZW50cyA9IGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb3JyZWxhdGUgdG8ga2V5cyBpbiBURU1QTEFURV9NQVAgXG4gICAgY29uc3QgY29tcG9uZW50cyA9IGxheW91dC5zcGxpdCgnLCcpLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpO1xuICAgIGNvbnN0IHJpZ2h0V3JhcHBlciA9IDxkaXYgY2xhc3M9XCJlbC1wYWdpbmF0aW9uX19yaWdodHdyYXBwZXJcIj48L2Rpdj47XG4gICAgbGV0IGhhdmVSaWdodFdyYXBwZXIgPSBmYWxzZTtcblxuICAgIC8vIGlmICh0aGlzLnNtYWxsKSB7XG4gICAgLy8gICB0ZW1wbGF0ZS5kYXRhLmNsYXNzICs9ICcgZWwtcGFnaW5hdGlvbi0tc21hbGwnO1xuICAgIC8vIH1cblxuICAgIC8vIExvb3AgdGhyb3VnaCBjb21wb25lbnRzIGFycmF5IFxuICAgIGNvbXBvbmVudHMuZm9yRWFjaChjb21wbyA9PiB7XG4gICAgICBpZiAoY29tcG8gPT09ICctPicpIHtcbiAgICAgICAgaGF2ZVJpZ2h0V3JhcHBlciA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFoYXZlUmlnaHRXcmFwcGVyKSB7XG4gICAgICAgIHRlbXBsYXRlLmNoaWxkcmVuLnB1c2goVEVNUExBVEVfTUFQW2NvbXBvXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByaWdodFdyYXBwZXIuY2hpbGRyZW4ucHVzaChURU1QTEFURV9NQVBbY29tcG9dKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXZlUmlnaHRXcmFwcGVyKSB7XG4gICAgICB0ZW1wbGF0ZS5jaGlsZHJlbi51bnNoaWZ0KHJpZ2h0V3JhcHBlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9LFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICBNeVNsb3Q6IHtcbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy4kcGFyZW50LiRzbG90cy5kZWZhdWx0XG4gICAgICAgICAgPyB0aGlzLiRwYXJlbnQuJHNsb3RzLmRlZmF1bHRbMF1cbiAgICAgICAgICA6ICcnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcbiAgICBQcmV2OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9e1snYnRuLXByZXYnLCB7IGRpc2FibGVkOiB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSA8PSAxIH1dfVxuICAgICAgICAgICAgb24tY2xpY2s9eyB0aGlzLiRwYXJlbnQucHJldiB9PlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJlbC1pY29uIGVsLWljb24tYXJyb3ctbGVmdFwiPjwvaT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgTmV4dDoge1xuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPXtbXG4gICAgICAgICAgICAgICdidG4tbmV4dCcsXG4gICAgICAgICAgICAgIHsgZGlzYWJsZWQ6IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlID09PSB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlQ291bnQgfHwgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZUNvdW50ID09PSAwIH1cbiAgICAgICAgICAgIF19XG4gICAgICAgICAgICBvbi1jbGljaz17IHRoaXMuJHBhcmVudC5uZXh0IH0+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImVsLWljb24gZWwtaWNvbi1hcnJvdy1yaWdodFwiPjwvaT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRG9uZSBSZWZhY3RvcmluZ1xuICAgIFNpemVzOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICBwcm9wczoge1xuICAgICAgICBwYWdlU2l6ZXM6IEFycmF5XG4gICAgICB9LFxuXG4gICAgICB3YXRjaDoge1xuICAgICAgICBwYWdlU2l6ZXM6IHtcbiAgICAgICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICAgICAgaGFuZGxlcih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplID0gdmFsdWUuaW5kZXhPZih0aGlzLiRwYXJlbnQucGFnZVNpemUpID4gLTFcbiAgICAgICAgICAgICAgICA/IHRoaXMuJHBhcmVudC5wYWdlU2l6ZVxuICAgICAgICAgICAgICAgIDogdGhpcy5wYWdlU2l6ZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHBlLXNlbGVjdFxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcnRleHQ9IHsgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUgfVxuICAgICAgICAgICAgICBvbi1pbnB1dD17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgICAgb3B0aW9ucz17IHRoaXMucGFnZVNpemVzIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9wZS1zZWxlY3Q+XG4gICAgICAgICk7XG4gICAgICB9LFxuXG4gICAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdwZS1zZWxlY3QnOiBTZWxlY3RcbiAgICAgIH0sXG5cbiAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgaGFuZGxlQ2hhbmdlKHZhbCkge1xuICAgICAgICAgIGlmICh2YWwgIT09IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplKSB7XG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSA9IHZhbCA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50LiRlbWl0KCdzaXplLWNoYW5nZScsIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmcgXG4gICAgSnVtcGVyOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9sZFZhbHVlOiBudWxsXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICBtZXRob2RzOiB7XG4gICAgICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVDaGFuZ2UoeyB0YXJnZXQgfSkge1xuICAgICAgICAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy4kcGFyZW50LmdldFZhbGlkQ3VycmVudFBhZ2UodGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgLy8gcmV0dXJuIChcbiAgICAgICAgLy8gICA8c3BhbiBjbGFzcz1cImVsLXBhZ2luYXRpb25fX2p1bXBcIj5cbiAgICAgICAgLy8gICAgIHsgdGhpcy50KCdlbC5wYWdpbmF0aW9uLmdvdG8nKSB9XG4gICAgICAgIC8vICAgICA8aW5wdXRcbiAgICAgICAgLy8gICAgICAgY2xhc3M9XCJlbC1wYWdpbmF0aW9uX19lZGl0b3JcIlxuICAgICAgICAvLyAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgLy8gICAgICAgbWluPXsgMSB9XG4gICAgICAgIC8vICAgICAgIG1heD17IHRoaXMuaW50ZXJuYWxQYWdlQ291bnQgfVxuICAgICAgICAvLyAgICAgICB2YWx1ZT17IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIH1cbiAgICAgICAgLy8gICAgICAgb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDaGFuZ2UgfVxuICAgICAgICAvLyAgICAgICBvbi1mb2N1cz17IHRoaXMuaGFuZGxlRm9jdXMgfVxuICAgICAgICAvLyAgICAgICBudW1iZXIvPlxuICAgICAgICAvLyAgICAgeyB0aGlzLnQoJ2VsLnBhZ2luYXRpb24ucGFnZUNsYXNzaWZpZXInKSB9XG4gICAgICAgIC8vICAgPC9zcGFuPlxuICAgICAgICAvLyApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fanVtcFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fZWRpdG9yXCJcbiAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIG1pbj17IDEgfVxuICAgICAgICAgICAgICBtYXg9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH1cbiAgICAgICAgICAgICAgdmFsdWU9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSB9XG4gICAgICAgICAgICAgIG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgICAgb24tZm9jdXM9eyB0aGlzLmhhbmRsZUZvY3VzIH1cbiAgICAgICAgICAgICAgbnVtYmVyLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmcgXG4gICAgVG90YWw6IHtcbiAgICAgIC8vIG1peGluczogW0xvY2FsZV0sXG5cbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIC8vIHJldHVybiAoXG4gICAgICAgIC8vICAgdHlwZW9mIHRoaXMuJHBhcmVudC50b3RhbCA9PT0gJ251bWJlcidcbiAgICAgICAgLy8gICAgID8gPHNwYW4gY2xhc3M9XCJlbC1wYWdpbmF0aW9uX190b3RhbFwiPnsgdGhpcy50KCdlbC5wYWdpbmF0aW9uLnRvdGFsJywgeyB0b3RhbDogdGhpcy4kcGFyZW50LnRvdGFsIH0pIH08L3NwYW4+XG4gICAgICAgIC8vICAgICA6ICcnXG4gICAgICAgIC8vICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdHlwZW9mIHRoaXMuJHBhcmVudC50b3RhbCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8gPHNwYW4gY2xhc3M9XCJlbC1wYWdpbmF0aW9uX190b3RhbFwiPnRvdGFsOiB7IHRoaXMuJHBhcmVudC50b3RhbCB9PC9zcGFuPlxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBQYWdlclxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDdXJyZW50Q2hhbmdlKHZhbCkge1xuICAgICAgLy8gTWV0aG9kIHRvIGhhbmRsZSB0aGUgQGNoYW5nZSBzZW50IGJ5IHBhZ2VyIFxuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKHZhbCk7XG4gICAgfSxcblxuICAgIHByZXYoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgLSAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIG5leHQoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgKyAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIGdldFZhbGlkQ3VycmVudFBhZ2UodmFsdWUpIHtcbiAgICAgIC8vIE1ldGhvZCB0byB2YWxpZGF0ZSBwYWdlIG51bWJlciBcblxuICAgICAgLy8gVmFsdWUgaXMgdmFsdWUgb2YgbmV3UGFnZSBcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcblxuICAgICAgLy8gaGF2ZVBhZ2VDb3VudCA9IHRydWUgaWYgaW50ZXJuYWxQYWdlQ291bnQgaXMgYSBudW1iZXIgXG4gICAgICBjb25zdCBoYXZlUGFnZUNvdW50ID0gdHlwZW9mIHRoaXMuaW50ZXJuYWxQYWdlQ291bnQgPT09ICdudW1iZXInO1xuXG4gICAgICBsZXQgcmVzZXRWYWx1ZTtcbiAgICAgIGlmICghaGF2ZVBhZ2VDb3VudCkge1xuICAgICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlIDwgMSkgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgcGFnZSBjb3VudCBcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkge1xuICAgICAgICAgIC8vIHJlc2V0IHZhbHVlIHRvIDEgaWYgZGVzaXJlZCBwYWdlIGlzIGxlc3MgdGhhbiAxXG4gICAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiB0aGlzLmludGVybmFsUGFnZUNvdW50KSB7XG4gICAgICAgICAgLy8gcmVzZXQgdmFsdWUgdG8gbWF4IG51bWJlciBpZiBkZXNpcmVkIHBhZ2UgaXMgZ3JlYXRlciB0aGFuIHRvdGFsIHBhZ2VzLlxuICAgICAgICAgIHJlc2V0VmFsdWUgPSB0aGlzLmludGVybmFsUGFnZUNvdW50O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGhhbmRsZSBlZGdlIGNhc2VzIFxuICAgICAgaWYgKHJlc2V0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHJlc2V0VmFsdWUgPT09IDApIHtcbiAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiBlaXRoZXIgdGhlIG5ld1BhZ2UgdmFsdWUgb3IgdGhlIHJlc2V0VmFsdWUgaWYgbmV3UGFnZSBoYXMgZXJyb3JzIFxuICAgICAgcmV0dXJuIHJlc2V0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHZhbHVlIDogcmVzZXRWYWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpbnRlcm5hbFBhZ2VDb3VudCgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy50b3RhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnRvdGFsIC8gdGhpcy5pbnRlcm5hbFBhZ2VTaXplKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMucGFnZUNvdW50ID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdlQ291bnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjdXJyZW50UGFnZToge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlcih2YWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdmFsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwYWdlU2l6ZToge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlcih2YWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFBhZ2VTaXplID0gdmFsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnRlcm5hbEN1cnJlbnRQYWdlKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICBuZXdWYWwgPSBwYXJzZUludChuZXdWYWwsIDEwKTtcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXNOYU4obmV3VmFsKSkge1xuICAgICAgICBuZXdWYWwgPSBvbGRWYWwgfHwgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1ZhbCA9IHRoaXMuZ2V0VmFsaWRDdXJyZW50UGFnZShuZXdWYWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3VmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IG5ld1ZhbDtcbiAgICAgICAgICBpZiAob2xkVmFsICE9PSBuZXdWYWwpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjdXJyZW50UGFnZScsIG5ld1ZhbCk7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWNoYW5nZScsIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjdXJyZW50UGFnZScsIG5ld1ZhbCk7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2N1cnJlbnQtY2hhbmdlJywgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW50ZXJuYWxQYWdlQ291bnQobmV3VmFsKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGNvbnN0IG9sZFBhZ2UgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2U7XG4gICAgICBpZiAobmV3VmFsID4gMCAmJiBvbGRQYWdlID09PSAwKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKG9sZFBhZ2UgPiBuZXdWYWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gbmV3VmFsID09PSAwID8gMSA6IG5ld1ZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iXX0=
