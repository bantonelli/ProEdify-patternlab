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
        { 'class': 'pagination__rightwrapper' },
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
              'class': ['circle-button', { disabled: this.$parent.internalCurrentPage <= 1 }],
              on: {
                'click': this.$parent.prev
              }
            },
            [h(
              'span',
              { 'class': 'circle-button__text icon-arrow-left' },
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
              'class': ['circle-button', { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }],
              on: {
                'click': this.$parent.next
              }
            },
            [h(
              'span',
              { 'class': 'circle-button__text icon-arrow-right' },
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
            { 'class': 'pagination__jump' },
            [h(
              'input',
              {
                'class': 'pagination__jump-input',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJwcm9wcyIsInBhZ2VTaXplIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJ0b3RhbCIsInBhZ2VDb3VudCIsImN1cnJlbnRQYWdlIiwibGF5b3V0IiwicGFnZVNpemVzIiwiQXJyYXkiLCJkYXRhIiwiaW50ZXJuYWxDdXJyZW50UGFnZSIsImludGVybmFsUGFnZVNpemUiLCJyZW5kZXIiLCJoIiwidGVtcGxhdGUiLCJURU1QTEFURV9NQVAiLCJwcmV2IiwianVtcGVyIiwicGFnZXIiLCJpbnRlcm5hbFBhZ2VDb3VudCIsImhhbmRsZUN1cnJlbnRDaGFuZ2UiLCJuZXh0Iiwic2l6ZXMiLCJzbG90IiwiY29tcG9uZW50cyIsInNwbGl0IiwibWFwIiwiaXRlbSIsInRyaW0iLCJyaWdodFdyYXBwZXIiLCJoYXZlUmlnaHRXcmFwcGVyIiwiZm9yRWFjaCIsImNvbXBvIiwiY2hpbGRyZW4iLCJwdXNoIiwidW5zaGlmdCIsIk15U2xvdCIsIiRwYXJlbnQiLCIkc2xvdHMiLCJQcmV2IiwiZGlzYWJsZWQiLCJOZXh0IiwiU2l6ZXMiLCJ3YXRjaCIsImltbWVkaWF0ZSIsImhhbmRsZXIiLCJ2YWx1ZSIsImlzQXJyYXkiLCJpbmRleE9mIiwiaGFuZGxlQ2hhbmdlIiwibWV0aG9kcyIsInZhbCIsInBhcnNlSW50IiwiJGVtaXQiLCJKdW1wZXIiLCJvbGRWYWx1ZSIsImhhbmRsZUZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJnZXRWYWxpZEN1cnJlbnRQYWdlIiwiVG90YWwiLCJQYWdlciIsIm5ld1ZhbCIsImhhdmVQYWdlQ291bnQiLCJyZXNldFZhbHVlIiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJjb21wdXRlZCIsIk1hdGgiLCJjZWlsIiwib2xkVmFsIiwiJG5leHRUaWNrIiwib2xkUGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBTWU7QUFDYkEs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Q0k7QUF1Q0xTLHVCQXZDSyw2QkF1Q2EyQyxNQXZDYixFQXVDcUI7QUFDeEI7QUFDQSxZQUFNVSxVQUFVLEtBQUs5RCxtQkFBckI7QUFDQSxZQUFJb0QsU0FBUyxDQUFULElBQWNVLFlBQVksQ0FBOUIsRUFBaUM7QUFDL0IsZUFBSzlELG1CQUFMLEdBQTJCLENBQTNCO0FBQ0QsU0FGRCxNQUVPLElBQUk4RCxVQUFVVixNQUFkLEVBQXNCO0FBQzNCLGVBQUtwRCxtQkFBTCxHQUEyQm9ELFdBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUJBLE1BQTlDO0FBQ0Q7QUFDRjtBQS9DSTtBQXRUTSxHIiwiZmlsZSI6ImFwcC9tb2xlY3VsZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VyIGZyb20gJy4vUGFnZXInO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuLi8uLi9hdG9tcy9TZWxlY3QnO1xuLy8gaW1wb3J0IEVsU2VsZWN0IGZyb20gJ2VsZW1lbnQtdWkvcGFja2FnZXMvc2VsZWN0Jztcbi8vIGltcG9ydCBFbE9wdGlvbiBmcm9tICdlbGVtZW50LXVpL3BhY2thZ2VzL29wdGlvbic7XG4vLyBpbXBvcnQgTG9jYWxlIGZyb20gJy4uLy4uL21peGlucy9sb2NhbGUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdQYWdpbmF0aW9uJyxcblxuICBwcm9wczoge1xuICAgIHBhZ2VTaXplOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxMFxuICAgIH0sXG5cbiAgICAvLyBzbWFsbDogQm9vbGVhbixcblxuICAgIHRvdGFsOiBOdW1iZXIsXG5cbiAgICBwYWdlQ291bnQ6IE51bWJlcixcblxuICAgIGN1cnJlbnRQYWdlOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcblxuICAgIGxheW91dDoge1xuICAgICAgZGVmYXVsdDogJ3ByZXYsIHBhZ2VyLCBuZXh0LCBqdW1wZXIsIC0+LCB0b3RhbCdcbiAgICB9LFxuXG4gICAgcGFnZVNpemVzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiBbMTAsIDIwLCAzMCwgNDAsIDUwLCAxMDBdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbEN1cnJlbnRQYWdlOiAxLFxuICAgICAgaW50ZXJuYWxQYWdlU2l6ZTogMFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKGgpIHtcbiAgICAvLyBtYWtlIG1hc3RlciB0ZW1wbGF0ZSBcbiAgICBsZXQgdGVtcGxhdGUgPSA8ZGl2IGNsYXNzPSdwYWdpbmF0aW9uJz48L2Rpdj47XG5cbiAgICAvLyBsYXlvdXQgaXMgZWl0aGVyIHRha2VuIGFzIGEgcHJvcCBvciBpcyBhbiBlbXB0eSBzdHJpbmcgaWYgbm90IHBhc3NlZCBpbiBcbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmxheW91dCB8fCAnJztcbiAgICBpZiAoIWxheW91dCkgcmV0dXJuO1xuXG4gICAgLy8gQ3JlYXRlIG1hcCBvZiBsYXlvdXQga2V5cyB0byByZXNwZWN0aXZlIG1hcmt1cCBcbiAgICBjb25zdCBURU1QTEFURV9NQVAgPSB7XG4gICAgICBwcmV2OiA8cHJldj48L3ByZXY+LFxuICAgICAganVtcGVyOiA8anVtcGVyPjwvanVtcGVyPixcbiAgICAgIHBhZ2VyOiA8cGFnZXIgY3VycmVudFBhZ2U9eyB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgfSBwYWdlQ291bnQ9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH0gb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDdXJyZW50Q2hhbmdlIH0+PC9wYWdlcj4sXG4gICAgICBuZXh0OiA8bmV4dD48L25leHQ+LFxuICAgICAgc2l6ZXM6IDxzaXplcyBwYWdlU2l6ZXM9eyB0aGlzLnBhZ2VTaXplcyB9Pjwvc2l6ZXM+LFxuICAgICAgc2xvdDogPG15LXNsb3Q+PC9teS1zbG90PixcbiAgICAgIHRvdGFsOiA8dG90YWw+PC90b3RhbD5cbiAgICB9O1xuXG4gICAgLy8gY29tcG9uZW50cyA9IGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb3JyZWxhdGUgdG8ga2V5cyBpbiBURU1QTEFURV9NQVAgXG4gICAgY29uc3QgY29tcG9uZW50cyA9IGxheW91dC5zcGxpdCgnLCcpLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpO1xuICAgIGNvbnN0IHJpZ2h0V3JhcHBlciA9IDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uX19yaWdodHdyYXBwZXJcIj48L2Rpdj47XG4gICAgbGV0IGhhdmVSaWdodFdyYXBwZXIgPSBmYWxzZTtcblxuICAgIC8vIGlmICh0aGlzLnNtYWxsKSB7XG4gICAgLy8gICB0ZW1wbGF0ZS5kYXRhLmNsYXNzICs9ICcgZWwtcGFnaW5hdGlvbi0tc21hbGwnO1xuICAgIC8vIH1cblxuICAgIC8vIExvb3AgdGhyb3VnaCBjb21wb25lbnRzIGFycmF5IFxuICAgIGNvbXBvbmVudHMuZm9yRWFjaChjb21wbyA9PiB7XG4gICAgICBpZiAoY29tcG8gPT09ICctPicpIHtcbiAgICAgICAgaGF2ZVJpZ2h0V3JhcHBlciA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFoYXZlUmlnaHRXcmFwcGVyKSB7XG4gICAgICAgIHRlbXBsYXRlLmNoaWxkcmVuLnB1c2goVEVNUExBVEVfTUFQW2NvbXBvXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByaWdodFdyYXBwZXIuY2hpbGRyZW4ucHVzaChURU1QTEFURV9NQVBbY29tcG9dKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXZlUmlnaHRXcmFwcGVyKSB7XG4gICAgICB0ZW1wbGF0ZS5jaGlsZHJlbi51bnNoaWZ0KHJpZ2h0V3JhcHBlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9LFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICBNeVNsb3Q6IHtcbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy4kcGFyZW50LiRzbG90cy5kZWZhdWx0XG4gICAgICAgICAgPyB0aGlzLiRwYXJlbnQuJHNsb3RzLmRlZmF1bHRbMF1cbiAgICAgICAgICA6ICcnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcbiAgICBQcmV2OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9e1snY2lyY2xlLWJ1dHRvbicsIHsgZGlzYWJsZWQ6IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIDw9IDEgfV19XG4gICAgICAgICAgICBvbi1jbGljaz17IHRoaXMuJHBhcmVudC5wcmV2IH0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNpcmNsZS1idXR0b25fX3RleHQgaWNvbi1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBOZXh0OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9e1tcbiAgICAgICAgICAgICAgJ2NpcmNsZS1idXR0b24nLFxuICAgICAgICAgICAgICB7IGRpc2FibGVkOiB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSA9PT0gdGhpcy4kcGFyZW50LmludGVybmFsUGFnZUNvdW50IHx8IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VDb3VudCA9PT0gMCB9XG4gICAgICAgICAgICBdfVxuICAgICAgICAgICAgb24tY2xpY2s9eyB0aGlzLiRwYXJlbnQubmV4dCB9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaXJjbGUtYnV0dG9uX190ZXh0IGljb24tYXJyb3ctcmlnaHRcIj48L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmdcbiAgICBTaXplczoge1xuICAgICAgLy8gbWl4aW5zOiBbTG9jYWxlXSxcblxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgcGFnZVNpemVzOiBBcnJheVxuICAgICAgfSxcblxuICAgICAgd2F0Y2g6IHtcbiAgICAgICAgcGFnZVNpemVzOiB7XG4gICAgICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgICAgIGhhbmRsZXIodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSA9IHZhbHVlLmluZGV4T2YodGhpcy4kcGFyZW50LnBhZ2VTaXplKSA+IC0xXG4gICAgICAgICAgICAgICAgPyB0aGlzLiRwYXJlbnQucGFnZVNpemVcbiAgICAgICAgICAgICAgICA6IHRoaXMucGFnZVNpemVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxwZS1zZWxlY3RcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXJ0ZXh0PSB7IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplIH1cbiAgICAgICAgICAgICAgb24taW5wdXQ9eyB0aGlzLmhhbmRsZUNoYW5nZSB9XG4gICAgICAgICAgICAgIG9wdGlvbnM9eyB0aGlzLnBhZ2VTaXplcyB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvcGUtc2VsZWN0PlxuICAgICAgICApO1xuICAgICAgfSxcblxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAncGUtc2VsZWN0JzogU2VsZWN0XG4gICAgICB9LFxuXG4gICAgICBtZXRob2RzOiB7XG4gICAgICAgIGhhbmRsZUNoYW5nZSh2YWwpIHtcbiAgICAgICAgICBpZiAodmFsICE9PSB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUgPSB2YWwgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudC4kZW1pdCgnc2l6ZS1jaGFuZ2UnLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBEb25lIFJlZmFjdG9yaW5nIFxuICAgIEp1bXBlcjoge1xuICAgICAgLy8gbWl4aW5zOiBbTG9jYWxlXSxcblxuICAgICAgZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvbGRWYWx1ZTogbnVsbFxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgbWV0aG9kczoge1xuICAgICAgICBoYW5kbGVGb2N1cyhldmVudCkge1xuICAgICAgICAgIHRoaXMub2xkVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlQ2hhbmdlKHsgdGFyZ2V0IH0pIHtcbiAgICAgICAgICB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSA9IHRoaXMuJHBhcmVudC5nZXRWYWxpZEN1cnJlbnRQYWdlKHRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIC8vIHJldHVybiAoXG4gICAgICAgIC8vICAgPHNwYW4gY2xhc3M9XCJlbC1wYWdpbmF0aW9uX19qdW1wXCI+XG4gICAgICAgIC8vICAgICB7IHRoaXMudCgnZWwucGFnaW5hdGlvbi5nb3RvJykgfVxuICAgICAgICAvLyAgICAgPGlucHV0XG4gICAgICAgIC8vICAgICAgIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fZWRpdG9yXCJcbiAgICAgICAgLy8gICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgIC8vICAgICAgIG1pbj17IDEgfVxuICAgICAgICAvLyAgICAgICBtYXg9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH1cbiAgICAgICAgLy8gICAgICAgdmFsdWU9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSB9XG4gICAgICAgIC8vICAgICAgIG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgLy8gICAgICAgb24tZm9jdXM9eyB0aGlzLmhhbmRsZUZvY3VzIH1cbiAgICAgICAgLy8gICAgICAgbnVtYmVyLz5cbiAgICAgICAgLy8gICAgIHsgdGhpcy50KCdlbC5wYWdpbmF0aW9uLnBhZ2VDbGFzc2lmaWVyJykgfVxuICAgICAgICAvLyAgIDwvc3Bhbj5cbiAgICAgICAgLy8gKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhZ2luYXRpb25fX2p1bXBcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb25fX2p1bXAtaW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgbWluPXsgMSB9XG4gICAgICAgICAgICAgIG1heD17IHRoaXMuaW50ZXJuYWxQYWdlQ291bnQgfVxuICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIH1cbiAgICAgICAgICAgICAgb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDaGFuZ2UgfVxuICAgICAgICAgICAgICBvbi1mb2N1cz17IHRoaXMuaGFuZGxlRm9jdXMgfVxuICAgICAgICAgICAgICBudW1iZXIvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRG9uZSBSZWZhY3RvcmluZyBcbiAgICBUb3RhbDoge1xuICAgICAgLy8gbWl4aW5zOiBbTG9jYWxlXSxcblxuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgLy8gcmV0dXJuIChcbiAgICAgICAgLy8gICB0eXBlb2YgdGhpcy4kcGFyZW50LnRvdGFsID09PSAnbnVtYmVyJ1xuICAgICAgICAvLyAgICAgPyA8c3BhbiBjbGFzcz1cImVsLXBhZ2luYXRpb25fX3RvdGFsXCI+eyB0aGlzLnQoJ2VsLnBhZ2luYXRpb24udG90YWwnLCB7IHRvdGFsOiB0aGlzLiRwYXJlbnQudG90YWwgfSkgfTwvc3Bhbj5cbiAgICAgICAgLy8gICAgIDogJydcbiAgICAgICAgLy8gKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0eXBlb2YgdGhpcy4kcGFyZW50LnRvdGFsID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyA8c3BhbiBjbGFzcz1cInBhZ2luYXRpb25fX3RvdGFsXCI+dG90YWw6IHsgdGhpcy4kcGFyZW50LnRvdGFsIH08L3NwYW4+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFBhZ2VyXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUN1cnJlbnRDaGFuZ2UodmFsKSB7XG4gICAgICAvLyBNZXRob2QgdG8gaGFuZGxlIHRoZSBAY2hhbmdlIHNlbnQgYnkgcGFnZXIgXG4gICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLmdldFZhbGlkQ3VycmVudFBhZ2UodmFsKTtcbiAgICB9LFxuXG4gICAgcHJldigpIHtcbiAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSAtIDE7XG4gICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLmdldFZhbGlkQ3VycmVudFBhZ2UobmV3VmFsKTtcbiAgICB9LFxuXG4gICAgbmV4dCgpIHtcbiAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSArIDE7XG4gICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLmdldFZhbGlkQ3VycmVudFBhZ2UobmV3VmFsKTtcbiAgICB9LFxuXG4gICAgZ2V0VmFsaWRDdXJyZW50UGFnZSh2YWx1ZSkge1xuICAgICAgLy8gTWV0aG9kIHRvIHZhbGlkYXRlIHBhZ2UgbnVtYmVyIFxuXG4gICAgICAvLyBWYWx1ZSBpcyB2YWx1ZSBvZiBuZXdQYWdlIFxuICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuXG4gICAgICAvLyBoYXZlUGFnZUNvdW50ID0gdHJ1ZSBpZiBpbnRlcm5hbFBhZ2VDb3VudCBpcyBhIG51bWJlciBcbiAgICAgIGNvbnN0IGhhdmVQYWdlQ291bnQgPSB0eXBlb2YgdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCA9PT0gJ251bWJlcic7XG5cbiAgICAgIGxldCByZXNldFZhbHVlO1xuICAgICAgaWYgKCFoYXZlUGFnZUNvdW50KSB7XG4gICAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPCAxKSByZXNldFZhbHVlID0gMTtcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBwYWdlIGNvdW50IFxuICAgICAgICBpZiAodmFsdWUgPCAxKSB7XG4gICAgICAgICAgLy8gcmVzZXQgdmFsdWUgdG8gMSBpZiBkZXNpcmVkIHBhZ2UgaXMgbGVzcyB0aGFuIDFcbiAgICAgICAgICByZXNldFZhbHVlID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IHRoaXMuaW50ZXJuYWxQYWdlQ291bnQpIHtcbiAgICAgICAgICAvLyByZXNldCB2YWx1ZSB0byBtYXggbnVtYmVyIGlmIGRlc2lyZWQgcGFnZSBpcyBncmVhdGVyIHRoYW4gdG90YWwgcGFnZXMuXG4gICAgICAgICAgcmVzZXRWYWx1ZSA9IHRoaXMuaW50ZXJuYWxQYWdlQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaGFuZGxlIGVkZ2UgY2FzZXMgXG4gICAgICBpZiAocmVzZXRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIGlzTmFOKHZhbHVlKSkge1xuICAgICAgICByZXNldFZhbHVlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAocmVzZXRWYWx1ZSA9PT0gMCkge1xuICAgICAgICByZXNldFZhbHVlID0gMTtcbiAgICAgIH1cblxuICAgICAgLy8gcmV0dXJuIGVpdGhlciB0aGUgbmV3UGFnZSB2YWx1ZSBvciB0aGUgcmVzZXRWYWx1ZSBpZiBuZXdQYWdlIGhhcyBlcnJvcnMgXG4gICAgICByZXR1cm4gcmVzZXRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gdmFsdWUgOiByZXNldFZhbHVlO1xuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGludGVybmFsUGFnZUNvdW50KCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnRvdGFsID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWwgLyB0aGlzLmludGVybmFsUGFnZVNpemUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5wYWdlQ291bnQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VDb3VudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGN1cnJlbnRQYWdlOiB7XG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICBoYW5kbGVyKHZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSB2YWw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHBhZ2VTaXplOiB7XG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICBoYW5kbGVyKHZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsUGFnZVNpemUgPSB2YWw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGludGVybmFsQ3VycmVudFBhZ2UobmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgIG5ld1ZhbCA9IHBhcnNlSW50KG5ld1ZhbCwgMTApO1xuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChpc05hTihuZXdWYWwpKSB7XG4gICAgICAgIG5ld1ZhbCA9IG9sZFZhbCB8fCAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdWYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gbmV3VmFsO1xuICAgICAgICAgIGlmIChvbGRWYWwgIT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmN1cnJlbnRQYWdlJywgbmV3VmFsKTtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2N1cnJlbnQtY2hhbmdlJywgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmN1cnJlbnRQYWdlJywgbmV3VmFsKTtcbiAgICAgICAgdGhpcy4kZW1pdCgnY3VycmVudC1jaGFuZ2UnLCB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnRlcm5hbFBhZ2VDb3VudChuZXdWYWwpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgY29uc3Qgb2xkUGFnZSA9IHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZTtcbiAgICAgIGlmIChuZXdWYWwgPiAwICYmIG9sZFBhZ2UgPT09IDApIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAob2xkUGFnZSA+IG5ld1ZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSBuZXdWYWwgPT09IDAgPyAxIDogbmV3VmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
