define(['exports', './Pager', '../../atoms/Select', '../../molecules/InputNumber/InputNumber'], function (exports, _Pager, _Select, _InputNumber) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Pager2 = _interopRequireDefault(_Pager);

  var _Select2 = _interopRequireDefault(_Select);

  var _InputNumber2 = _interopRequireDefault(_InputNumber);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    name: 'Pagination',

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
        { 'class': 'pagination' },
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
            attrs: { 'modifier-styles': ["pager_size-small"], currentPage: this.internalCurrentPage, pageCount: this.internalPageCount },
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
      var wrapper = h(
        'div',
        { 'class': 'pagination__wrapper' },
        []
      );
      var haveWrapper = false;

      // if (this.small) {
      //   template.data.class += ' el-pagination--small';
      // }

      // Loop through components array 
      components.forEach(function (compo) {
        if (compo === '->') {
          haveWrapper = true;
          return;
        }

        if (!haveWrapper) {
          template.children.push(TEMPLATE_MAP[compo]);
        } else {
          wrapper.children.push(TEMPLATE_MAP[compo]);
        }
      });

      if (haveWrapper) {
        template.children.unshift(wrapper);
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
            'div',
            { 'class': 'pagination__prev' },
            [h(
              'button',
              {
                attrs: {
                  type: 'button'
                },
                'class': ['circle-button', { 'is-disabled': this.$parent.internalCurrentPage <= 1 }],
                on: {
                  'click': this.$parent.prev
                }
              },
              [h(
                'span',
                { 'class': 'circle-button__text icon-arrow-left' },
                []
              )]
            )]
          );
        }
      },

      Next: {
        render: function render(h) {
          return h(
            'div',
            { 'class': 'pagination__next' },
            [h(
              'button',
              {
                attrs: {
                  type: 'button'
                },
                'class': [
                // 'circle-button circle-button_size-small',
                'circle-button', { 'is-disabled': this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }],
                on: {
                  'click': this.$parent.next
                }
              },
              [h(
                'span',
                { 'class': 'circle-button__text icon-arrow-right' },
                []
              )]
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
            'div',
            { 'class': 'pagination__sizes' },
            [h(
              'select-component',
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
            )]
          );
        },


        components: {
          'select-component': _Select2.default
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
          handleChange: function handleChange(value) {
            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
            this.oldValue = null;
          }
        },

        components: {
          'input-number': _InputNumber2.default
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
          // return (
          //   <span class="pagination__jump">
          //     <input
          //       class="pagination__jump-input"
          //       type="number"
          //       min={ 1 }
          //       max={ this.internalPageCount }
          //       value={ this.$parent.internalCurrentPage }
          //       on-change={ this.handleChange }
          //       on-focus={ this.handleFocus }
          //       number/>
          //   </span>
          // );
          return h(
            'div',
            { 'class': 'pagination__jump' },
            [h(
              'input-number',
              {
                attrs: {
                  min: 1,
                  max: this.$parent.internalPageCount,
                  value: this.$parent.internalCurrentPage
                },
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
            { 'class': 'pagination__total' },
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9vcmdhbmlzbXMvUGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJwcm9wcyIsInBhZ2VTaXplIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJ0b3RhbCIsInBhZ2VDb3VudCIsImN1cnJlbnRQYWdlIiwibGF5b3V0IiwicGFnZVNpemVzIiwiQXJyYXkiLCJkYXRhIiwiaW50ZXJuYWxDdXJyZW50UGFnZSIsImludGVybmFsUGFnZVNpemUiLCJyZW5kZXIiLCJoIiwidGVtcGxhdGUiLCJURU1QTEFURV9NQVAiLCJwcmV2IiwianVtcGVyIiwicGFnZXIiLCJpbnRlcm5hbFBhZ2VDb3VudCIsImhhbmRsZUN1cnJlbnRDaGFuZ2UiLCJuZXh0Iiwic2l6ZXMiLCJzbG90IiwiY29tcG9uZW50cyIsInNwbGl0IiwibWFwIiwiaXRlbSIsInRyaW0iLCJ3cmFwcGVyIiwiaGF2ZVdyYXBwZXIiLCJmb3JFYWNoIiwiY29tcG8iLCJjaGlsZHJlbiIsInB1c2giLCJ1bnNoaWZ0IiwiTXlTbG90IiwiJHBhcmVudCIsIiRzbG90cyIsIlByZXYiLCJOZXh0IiwiU2l6ZXMiLCJ3YXRjaCIsImltbWVkaWF0ZSIsImhhbmRsZXIiLCJ2YWx1ZSIsImlzQXJyYXkiLCJpbmRleE9mIiwiaGFuZGxlQ2hhbmdlIiwibWV0aG9kcyIsInZhbCIsInBhcnNlSW50IiwiJGVtaXQiLCJKdW1wZXIiLCJvbGRWYWx1ZSIsImhhbmRsZUZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJnZXRWYWxpZEN1cnJlbnRQYWdlIiwiVG90YWwiLCJQYWdlciIsIm5ld1ZhbCIsImhhdmVQYWdlQ291bnQiLCJyZXNldFZhbHVlIiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJjb21wdXRlZCIsIk1hdGgiLCJjZWlsIiwib2xkVmFsIiwiJG5leHRUaWNrIiwib2xkUGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFPZTtBQUNiQSxVQUFNLFlBRE87O0FBR2JDLFdB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QWpDO0FBQ0Esb0JBQUtULEtBQUwsQ0FBVyxnQkFBWCxFQUE2QixNQUFLMUMsbUJBQWxDO0FBQ0Q7QUFDRixXQU5EO0FBT0QsU0FSRCxNQVFPO0FBQ0wsZUFBSzBDLEtBQUwsQ0FBVyxvQkFBWCxFQUFpQ1MsTUFBakM7QUFDQSxlQUFLVCxLQUFMLENBQVcsZ0JBQVgsRUFBNkIsS0FBSzFDLG1CQUFsQztBQUNEO0FBQ0YsT0FyQ0k7QUF1Q0xTLHVCQXZDSyw2QkF1Q2EwQyxNQXZDYixFQXVDcUI7QUFDeEI7QUFDQSxZQUFNVSxVQUFVLEtBQUs3RCxtQkFBckI7QUFDQSxZQUFJbUQsU0FBUyxDQUFULElBQWNVLFlBQVksQ0FBOUIsRUFBaUM7QUFDL0IsZUFBSzdELG1CQUFMLEdBQTJCLENBQTNCO0FBQ0QsU0FGRCxNQUVPLElBQUk2RCxVQUFVVixNQUFkLEVBQXNCO0FBQzNCLGVBQUtuRCxtQkFBTCxHQUEyQm1ELFdBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUJBLE1BQTlDO0FBQ0Q7QUFDRjtBQS9DSTtBQWpWTSxHIiwiZmlsZSI6ImFwcC9vcmdhbmlzbXMvUGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VyIGZyb20gJy4vUGFnZXInO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuLi8uLi9hdG9tcy9TZWxlY3QnO1xuaW1wb3J0IElucHV0TnVtYmVyIGZyb20gJy4uLy4uL21vbGVjdWxlcy9JbnB1dE51bWJlci9JbnB1dE51bWJlcic7XG4vLyBpbXBvcnQgRWxTZWxlY3QgZnJvbSAnZWxlbWVudC11aS9wYWNrYWdlcy9zZWxlY3QnO1xuLy8gaW1wb3J0IEVsT3B0aW9uIGZyb20gJ2VsZW1lbnQtdWkvcGFja2FnZXMvb3B0aW9uJztcbi8vIGltcG9ydCBMb2NhbGUgZnJvbSAnLi4vLi4vbWl4aW5zL2xvY2FsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ1BhZ2luYXRpb24nLFxuXG4gIHByb3BzOiB7XG4gICAgcGFnZVNpemU6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcblxuICAgIC8vIHNtYWxsOiBCb29sZWFuLFxuXG4gICAgdG90YWw6IE51bWJlcixcblxuICAgIHBhZ2VDb3VudDogTnVtYmVyLFxuXG4gICAgY3VycmVudFBhZ2U6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDFcbiAgICB9LFxuXG4gICAgbGF5b3V0OiB7XG4gICAgICBkZWZhdWx0OiAncHJldiwgcGFnZXIsIG5leHQsIGp1bXBlciwgLT4sIHRvdGFsJ1xuICAgIH0sXG5cbiAgICBwYWdlU2l6ZXM6IHtcbiAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIFsxMCwgMjAsIDMwLCA0MCwgNTAsIDEwMF07XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVybmFsQ3VycmVudFBhZ2U6IDEsXG4gICAgICBpbnRlcm5hbFBhZ2VTaXplOiAwXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXIoaCkge1xuICAgIC8vIG1ha2UgbWFzdGVyIHRlbXBsYXRlIFxuICAgIGxldCB0ZW1wbGF0ZSA9IDxkaXYgY2xhc3M9J3BhZ2luYXRpb24nPjwvZGl2PjtcblxuICAgIC8vIGxheW91dCBpcyBlaXRoZXIgdGFrZW4gYXMgYSBwcm9wIG9yIGlzIGFuIGVtcHR5IHN0cmluZyBpZiBub3QgcGFzc2VkIGluIFxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMubGF5b3V0IHx8ICcnO1xuICAgIGlmICghbGF5b3V0KSByZXR1cm47XG5cbiAgICAvLyBDcmVhdGUgbWFwIG9mIGxheW91dCBrZXlzIHRvIHJlc3BlY3RpdmUgbWFya3VwIFxuICAgIGNvbnN0IFRFTVBMQVRFX01BUCA9IHtcbiAgICAgIHByZXY6IDxwcmV2PjwvcHJldj4sXG4gICAgICBqdW1wZXI6IDxqdW1wZXI+PC9qdW1wZXI+LFxuICAgICAgcGFnZXI6IDxwYWdlciBtb2RpZmllci1zdHlsZXM9e1tcInBhZ2VyX3NpemUtc21hbGxcIl19IGN1cnJlbnRQYWdlPXsgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlIH0gcGFnZUNvdW50PXsgdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCB9IG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ3VycmVudENoYW5nZSB9PjwvcGFnZXI+LFxuICAgICAgbmV4dDogPG5leHQ+PC9uZXh0PixcbiAgICAgIHNpemVzOiA8c2l6ZXMgcGFnZVNpemVzPXsgdGhpcy5wYWdlU2l6ZXMgfT48L3NpemVzPixcbiAgICAgIHNsb3Q6IDxteS1zbG90PjwvbXktc2xvdD4sXG4gICAgICB0b3RhbDogPHRvdGFsPjwvdG90YWw+XG4gICAgfTtcblxuICAgIC8vIGNvbXBvbmVudHMgPSBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29ycmVsYXRlIHRvIGtleXMgaW4gVEVNUExBVEVfTUFQIFxuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBsYXlvdXQuc3BsaXQoJywnKS5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKTtcbiAgICBjb25zdCB3cmFwcGVyID0gPGRpdiBjbGFzcz1cInBhZ2luYXRpb25fX3dyYXBwZXJcIj48L2Rpdj47XG4gICAgbGV0IGhhdmVXcmFwcGVyID0gZmFsc2U7XG5cbiAgICAvLyBpZiAodGhpcy5zbWFsbCkge1xuICAgIC8vICAgdGVtcGxhdGUuZGF0YS5jbGFzcyArPSAnIGVsLXBhZ2luYXRpb24tLXNtYWxsJztcbiAgICAvLyB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggY29tcG9uZW50cyBhcnJheSBcbiAgICBjb21wb25lbnRzLmZvckVhY2goY29tcG8gPT4ge1xuICAgICAgaWYgKGNvbXBvID09PSAnLT4nKSB7XG4gICAgICAgIGhhdmVXcmFwcGVyID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWhhdmVXcmFwcGVyKSB7XG4gICAgICAgIHRlbXBsYXRlLmNoaWxkcmVuLnB1c2goVEVNUExBVEVfTUFQW2NvbXBvXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVyLmNoaWxkcmVuLnB1c2goVEVNUExBVEVfTUFQW2NvbXBvXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaGF2ZVdyYXBwZXIpIHtcbiAgICAgIHRlbXBsYXRlLmNoaWxkcmVuLnVuc2hpZnQod3JhcHBlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9LFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICBNeVNsb3Q6IHtcbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy4kcGFyZW50LiRzbG90cy5kZWZhdWx0XG4gICAgICAgICAgPyB0aGlzLiRwYXJlbnQuJHNsb3RzLmRlZmF1bHRbMF1cbiAgICAgICAgICA6ICcnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcbiAgICBQcmV2OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uX19wcmV2XCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz17WydjaXJjbGUtYnV0dG9uJywgeyAnaXMtZGlzYWJsZWQnOiB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSA8PSAxIH1dfVxuICAgICAgICAgICAgICBvbi1jbGljaz17IHRoaXMuJHBhcmVudC5wcmV2IH0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2lyY2xlLWJ1dHRvbl9fdGV4dCBpY29uLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgTmV4dDoge1xuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbl9fbmV4dFwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9e1tcbiAgICAgICAgICAgICAgICAvLyAnY2lyY2xlLWJ1dHRvbiBjaXJjbGUtYnV0dG9uX3NpemUtc21hbGwnLFxuICAgICAgICAgICAgICAgICdjaXJjbGUtYnV0dG9uJyxcbiAgICAgICAgICAgICAgICB7ICdpcy1kaXNhYmxlZCc6IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlID09PSB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlQ291bnQgfHwgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZUNvdW50ID09PSAwIH1cbiAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgb24tY2xpY2s9eyB0aGlzLiRwYXJlbnQubmV4dCB9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHQgaWNvbi1hcnJvdy1yaWdodFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBEb25lIFJlZmFjdG9yaW5nXG4gICAgU2l6ZXM6IHtcbiAgICAgIC8vIG1peGluczogW0xvY2FsZV0sXG5cbiAgICAgIHByb3BzOiB7XG4gICAgICAgIHBhZ2VTaXplczogQXJyYXlcbiAgICAgIH0sXG5cbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIHBhZ2VTaXplczoge1xuICAgICAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgICAgICBoYW5kbGVyKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUgPSB2YWx1ZS5pbmRleE9mKHRoaXMuJHBhcmVudC5wYWdlU2l6ZSkgPiAtMVxuICAgICAgICAgICAgICAgID8gdGhpcy4kcGFyZW50LnBhZ2VTaXplXG4gICAgICAgICAgICAgICAgOiB0aGlzLnBhZ2VTaXplc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2luYXRpb25fX3NpemVzXCI+XG4gICAgICAgICAgICA8c2VsZWN0LWNvbXBvbmVudFxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcnRleHQ9IHsgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUgfVxuICAgICAgICAgICAgICBvbi1pbnB1dD17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgICAgb3B0aW9ucz17IHRoaXMucGFnZVNpemVzIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9zZWxlY3QtY29tcG9uZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfSxcblxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAnc2VsZWN0LWNvbXBvbmVudCc6IFNlbGVjdFxuICAgICAgfSxcblxuICAgICAgbWV0aG9kczoge1xuICAgICAgICBoYW5kbGVDaGFuZ2UodmFsKSB7XG4gICAgICAgICAgaWYgKHZhbCAhPT0gdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplID0gdmFsID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQuJGVtaXQoJ3NpemUtY2hhbmdlJywgdmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRG9uZSBSZWZhY3RvcmluZyBcbiAgICBKdW1wZXI6IHtcbiAgICAgIC8vIG1peGluczogW0xvY2FsZV0sXG5cbiAgICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb2xkVmFsdWU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGhhbmRsZUNoYW5nZSh7IHRhcmdldCB9KSB7XG4gICAgICAgIC8vICAgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLiRwYXJlbnQuZ2V0VmFsaWRDdXJyZW50UGFnZSh0YXJnZXQudmFsdWUpO1xuICAgICAgICAvLyAgIHRoaXMub2xkVmFsdWUgPSBudWxsO1xuICAgICAgICAvLyB9XG4gICAgICAgIGhhbmRsZUNoYW5nZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLiRwYXJlbnQuZ2V0VmFsaWRDdXJyZW50UGFnZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAnaW5wdXQtbnVtYmVyJzogSW5wdXROdW1iZXJcbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIC8vIHJldHVybiAoXG4gICAgICAgIC8vICAgPHNwYW4gY2xhc3M9XCJlbC1wYWdpbmF0aW9uX19qdW1wXCI+XG4gICAgICAgIC8vICAgICB7IHRoaXMudCgnZWwucGFnaW5hdGlvbi5nb3RvJykgfVxuICAgICAgICAvLyAgICAgPGlucHV0XG4gICAgICAgIC8vICAgICAgIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fZWRpdG9yXCJcbiAgICAgICAgLy8gICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgIC8vICAgICAgIG1pbj17IDEgfVxuICAgICAgICAvLyAgICAgICBtYXg9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH1cbiAgICAgICAgLy8gICAgICAgdmFsdWU9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSB9XG4gICAgICAgIC8vICAgICAgIG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgLy8gICAgICAgb24tZm9jdXM9eyB0aGlzLmhhbmRsZUZvY3VzIH1cbiAgICAgICAgLy8gICAgICAgbnVtYmVyLz5cbiAgICAgICAgLy8gICAgIHsgdGhpcy50KCdlbC5wYWdpbmF0aW9uLnBhZ2VDbGFzc2lmaWVyJykgfVxuICAgICAgICAvLyAgIDwvc3Bhbj5cbiAgICAgICAgLy8gKTtcbiAgICAgICAgLy8gcmV0dXJuIChcbiAgICAgICAgLy8gICA8c3BhbiBjbGFzcz1cInBhZ2luYXRpb25fX2p1bXBcIj5cbiAgICAgICAgLy8gICAgIDxpbnB1dFxuICAgICAgICAvLyAgICAgICBjbGFzcz1cInBhZ2luYXRpb25fX2p1bXAtaW5wdXRcIlxuICAgICAgICAvLyAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgLy8gICAgICAgbWluPXsgMSB9XG4gICAgICAgIC8vICAgICAgIG1heD17IHRoaXMuaW50ZXJuYWxQYWdlQ291bnQgfVxuICAgICAgICAvLyAgICAgICB2YWx1ZT17IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIH1cbiAgICAgICAgLy8gICAgICAgb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDaGFuZ2UgfVxuICAgICAgICAvLyAgICAgICBvbi1mb2N1cz17IHRoaXMuaGFuZGxlRm9jdXMgfVxuICAgICAgICAvLyAgICAgICBudW1iZXIvPlxuICAgICAgICAvLyAgIDwvc3Bhbj5cbiAgICAgICAgLy8gKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uX19qdW1wXCI+XG4gICAgICAgICAgICAgIDxpbnB1dC1udW1iZXJcbiAgICAgICAgICAgICAgICBtaW49eyAxIH1cbiAgICAgICAgICAgICAgICBtYXg9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlQ291bnQgfVxuICAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgfVxuICAgICAgICAgICAgICAgIG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgICAgICBvbi1mb2N1cz17IHRoaXMuaGFuZGxlRm9jdXMgfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDwvaW5wdXQtbnVtYmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmcgXG4gICAgVG90YWw6IHtcbiAgICAgIC8vIG1peGluczogW0xvY2FsZV0sXG5cbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIC8vIHJldHVybiAoXG4gICAgICAgIC8vICAgdHlwZW9mIHRoaXMuJHBhcmVudC50b3RhbCA9PT0gJ251bWJlcidcbiAgICAgICAgLy8gICAgID8gPHNwYW4gY2xhc3M9XCJlbC1wYWdpbmF0aW9uX190b3RhbFwiPnsgdGhpcy50KCdlbC5wYWdpbmF0aW9uLnRvdGFsJywgeyB0b3RhbDogdGhpcy4kcGFyZW50LnRvdGFsIH0pIH08L3NwYW4+XG4gICAgICAgIC8vICAgICA6ICcnXG4gICAgICAgIC8vICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdHlwZW9mIHRoaXMuJHBhcmVudC50b3RhbCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8gPHNwYW4gY2xhc3M9XCJwYWdpbmF0aW9uX190b3RhbFwiPnRvdGFsOiB7IHRoaXMuJHBhcmVudC50b3RhbCB9PC9zcGFuPlxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBQYWdlclxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDdXJyZW50Q2hhbmdlKHZhbCkge1xuICAgICAgLy8gTWV0aG9kIHRvIGhhbmRsZSB0aGUgQGNoYW5nZSBzZW50IGJ5IHBhZ2VyIFxuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKHZhbCk7XG4gICAgfSxcblxuICAgIHByZXYoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgLSAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIG5leHQoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgKyAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIGdldFZhbGlkQ3VycmVudFBhZ2UodmFsdWUpIHtcbiAgICAgIC8vIE1ldGhvZCB0byB2YWxpZGF0ZSBwYWdlIG51bWJlciBcblxuICAgICAgLy8gVmFsdWUgaXMgdmFsdWUgb2YgbmV3UGFnZSBcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcblxuICAgICAgLy8gaGF2ZVBhZ2VDb3VudCA9IHRydWUgaWYgaW50ZXJuYWxQYWdlQ291bnQgaXMgYSBudW1iZXIgXG4gICAgICBjb25zdCBoYXZlUGFnZUNvdW50ID0gdHlwZW9mIHRoaXMuaW50ZXJuYWxQYWdlQ291bnQgPT09ICdudW1iZXInO1xuXG4gICAgICBsZXQgcmVzZXRWYWx1ZTtcbiAgICAgIGlmICghaGF2ZVBhZ2VDb3VudCkge1xuICAgICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlIDwgMSkgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgcGFnZSBjb3VudCBcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkge1xuICAgICAgICAgIC8vIHJlc2V0IHZhbHVlIHRvIDEgaWYgZGVzaXJlZCBwYWdlIGlzIGxlc3MgdGhhbiAxXG4gICAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiB0aGlzLmludGVybmFsUGFnZUNvdW50KSB7XG4gICAgICAgICAgLy8gcmVzZXQgdmFsdWUgdG8gbWF4IG51bWJlciBpZiBkZXNpcmVkIHBhZ2UgaXMgZ3JlYXRlciB0aGFuIHRvdGFsIHBhZ2VzLlxuICAgICAgICAgIHJlc2V0VmFsdWUgPSB0aGlzLmludGVybmFsUGFnZUNvdW50O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGhhbmRsZSBlZGdlIGNhc2VzIFxuICAgICAgaWYgKHJlc2V0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHJlc2V0VmFsdWUgPT09IDApIHtcbiAgICAgICAgcmVzZXRWYWx1ZSA9IDE7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiBlaXRoZXIgdGhlIG5ld1BhZ2UgdmFsdWUgb3IgdGhlIHJlc2V0VmFsdWUgaWYgbmV3UGFnZSBoYXMgZXJyb3JzIFxuICAgICAgcmV0dXJuIHJlc2V0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHZhbHVlIDogcmVzZXRWYWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpbnRlcm5hbFBhZ2VDb3VudCgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy50b3RhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnRvdGFsIC8gdGhpcy5pbnRlcm5hbFBhZ2VTaXplKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMucGFnZUNvdW50ID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdlQ291bnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjdXJyZW50UGFnZToge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlcih2YWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdmFsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwYWdlU2l6ZToge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlcih2YWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFBhZ2VTaXplID0gdmFsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnRlcm5hbEN1cnJlbnRQYWdlKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICBuZXdWYWwgPSBwYXJzZUludChuZXdWYWwsIDEwKTtcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXNOYU4obmV3VmFsKSkge1xuICAgICAgICBuZXdWYWwgPSBvbGRWYWwgfHwgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1ZhbCA9IHRoaXMuZ2V0VmFsaWRDdXJyZW50UGFnZShuZXdWYWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3VmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IG5ld1ZhbDtcbiAgICAgICAgICBpZiAob2xkVmFsICE9PSBuZXdWYWwpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjdXJyZW50UGFnZScsIG5ld1ZhbCk7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWNoYW5nZScsIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjdXJyZW50UGFnZScsIG5ld1ZhbCk7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2N1cnJlbnQtY2hhbmdlJywgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW50ZXJuYWxQYWdlQ291bnQobmV3VmFsKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGNvbnN0IG9sZFBhZ2UgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2U7XG4gICAgICBpZiAobmV3VmFsID4gMCAmJiBvbGRQYWdlID09PSAwKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKG9sZFBhZ2UgPiBuZXdWYWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gbmV3VmFsID09PSAwID8gMSA6IG5ld1ZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iXX0=
