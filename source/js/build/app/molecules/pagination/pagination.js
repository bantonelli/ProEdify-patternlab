define(['exports', './pager'], function (exports, _pager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pager2 = _interopRequireDefault(_pager);

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

      small: Boolean,

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
      var template = h(
        'div',
        { 'class': 'el-pagination' },
        []
      );
      var layout = this.layout || '';
      if (!layout) return;
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
      var components = layout.split(',').map(function (item) {
        return item.trim();
      });
      var rightWrapper = h(
        'div',
        { 'class': 'el-pagination__rightwrapper' },
        []
      );
      var haveRightWrapper = false;

      if (this.small) {
        template.data.class += ' el-pagination--small';
      }

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
          var _this = this;

          return h(
            'span',
            { 'class': 'el-pagination__sizes' },
            [h(
              'el-select',
              {
                attrs: {
                  value: this.$parent.internalPageSize
                },
                on: {
                  'input': this.handleChange
                }
              },
              [this.pageSizes.map(function (item) {
                return h(
                  'el-option',
                  {
                    attrs: {
                      value: item,
                      label: item + ' ' + _this.t('el.pagination.pagesize') }
                  },
                  []
                );
              })]
            )]
          );
        },


        // components: {
        //   ElSelect,
        //   ElOption
        // },

        methods: {
          handleChange: function handleChange(val) {
            if (val !== this.$parent.internalPageSize) {
              this.$parent.internalPageSize = val = parseInt(val, 10);
              this.$parent.$emit('size-change', val);
            }
          }
        }
      },

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
          return h(
            'span',
            { 'class': 'el-pagination__jump' },
            [this.t('el.pagination.goto'), h(
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
            ), this.t('el.pagination.pageClassifier')]
          );
        }
      },

      Total: {
        render: function render(h) {
          return typeof this.$parent.total === 'number' ? h(
            'span',
            { 'class': 'el-pagination__total' },
            [this.t('el.pagination.total', { total: this.$parent.total })]
          ) : '';
        }
      },

      Pager: _pager2.default
    },

    methods: {
      handleCurrentChange: function handleCurrentChange(val) {
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
        value = parseInt(value, 10);

        var havePageCount = typeof this.internalPageCount === 'number';

        var resetValue = void 0;
        if (!havePageCount) {
          if (isNaN(value) || value < 1) resetValue = 1;
        } else {
          if (value < 1) {
            resetValue = 1;
          } else if (value > this.internalPageCount) {
            resetValue = this.internalPageCount;
          }
        }

        if (resetValue === undefined && isNaN(value)) {
          resetValue = 1;
        } else if (resetValue === 0) {
          resetValue = 1;
        }

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
        var _this2 = this;

        newVal = parseInt(newVal, 10);

        /* istanbul ignore if */
        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = this.getValidCurrentPage(newVal);
        }

        if (newVal !== undefined) {
          this.$nextTick(function () {
            _this2.internalCurrentPage = newVal;
            if (oldVal !== newVal) {
              _this2.$emit('update:currentPage', newVal);
              _this2.$emit('current-change', _this2.internalCurrentPage);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJwcm9wcyIsInBhZ2VTaXplIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJzbWFsbCIsIkJvb2xlYW4iLCJ0b3RhbCIsInBhZ2VDb3VudCIsImN1cnJlbnRQYWdlIiwibGF5b3V0IiwicGFnZVNpemVzIiwiQXJyYXkiLCJkYXRhIiwiaW50ZXJuYWxDdXJyZW50UGFnZSIsImludGVybmFsUGFnZVNpemUiLCJyZW5kZXIiLCJoIiwidGVtcGxhdGUiLCJURU1QTEFURV9NQVAiLCJwcmV2IiwianVtcGVyIiwicGFnZXIiLCJpbnRlcm5hbFBhZ2VDb3VudCIsImhhbmRsZUN1cnJlbnRDaGFuZ2UiLCJuZXh0Iiwic2l6ZXMiLCJzbG90IiwiY29tcG9uZW50cyIsInNwbGl0IiwibWFwIiwiaXRlbSIsInRyaW0iLCJyaWdodFdyYXBwZXIiLCJoYXZlUmlnaHRXcmFwcGVyIiwiY2xhc3MiLCJmb3JFYWNoIiwiY29tcG8iLCJjaGlsZHJlbiIsInB1c2giLCJ1bnNoaWZ0IiwiTXlTbG90IiwiJHBhcmVudCIsIiRzbG90cyIsIlByZXYiLCJkaXNhYmxlZCIsIk5leHQiLCJTaXplcyIsIndhdGNoIiwiaW1tZWRpYXRlIiwiaGFuZGxlciIsInZhbHVlIiwiaXNBcnJheSIsImluZGV4T2YiLCJoYW5kbGVDaGFuZ2UiLCJ0IiwibWV0aG9kcyIsInZhbCIsInBhcnNlSW50IiwiJGVtaXQiLCJKdW1wZXIiLCJvbGRWYWx1ZSIsImhhbmRsZUZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJnZXRWYWxpZEN1cnJlbnRQYWdlIiwiVG90YWwiLCJQYWdlciIsIm5ld1ZhbCIsImhhdmVQYWdlQ291bnQiLCJyZXNldFZhbHVlIiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJjb21wdXRlZCIsIk1hdGgiLCJjZWlsIiwib2xkVmFsIiwiJG5leHRUaWNrIiwib2xkUGFnZSJdLCJtYXBwaW5ncyI6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S1QsS0FBTCxDQUFXLG9CQUFYLEVBQWlDUyxNQUFqQztBQUNBLHFCQUFLVCxLQUFMLENBQVcsZ0JBQVgsRUFBNkIsT0FBSzdDLG1CQUFsQztBQUNEO0FBQ0YsV0FORDtBQU9ELFNBUkQsTUFRTztBQUNMLGVBQUs2QyxLQUFMLENBQVcsb0JBQVgsRUFBaUNTLE1BQWpDO0FBQ0EsZUFBS1QsS0FBTCxDQUFXLGdCQUFYLEVBQTZCLEtBQUs3QyxtQkFBbEM7QUFDRDtBQUNGLE9BckNJO0FBdUNMUyx1QkF2Q0ssNkJBdUNhNkMsTUF2Q2IsRUF1Q3FCO0FBQ3hCO0FBQ0EsWUFBTVUsVUFBVSxLQUFLaEUsbUJBQXJCO0FBQ0EsWUFBSXNELFNBQVMsQ0FBVCxJQUFjVSxZQUFZLENBQTlCLEVBQWlDO0FBQy9CLGVBQUtoRSxtQkFBTCxHQUEyQixDQUEzQjtBQUNELFNBRkQsTUFFTyxJQUFJZ0UsVUFBVVYsTUFBZCxFQUFzQjtBQUMzQixlQUFLdEQsbUJBQUwsR0FBMkJzRCxXQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CQSxNQUE5QztBQUNEO0FBQ0Y7QUEvQ0k7QUF2Uk0sRyIsImZpbGUiOiJhcHAvbW9sZWN1bGVzL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlciBmcm9tICcuL3BhZ2VyJztcbi8vIGltcG9ydCBFbFNlbGVjdCBmcm9tICdlbGVtZW50LXVpL3BhY2thZ2VzL3NlbGVjdCc7XG4vLyBpbXBvcnQgRWxPcHRpb24gZnJvbSAnZWxlbWVudC11aS9wYWNrYWdlcy9vcHRpb24nO1xuLy8gaW1wb3J0IExvY2FsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9jYWxlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnRWxQYWdpbmF0aW9uJyxcblxuICBwcm9wczoge1xuICAgIHBhZ2VTaXplOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxMFxuICAgIH0sXG5cbiAgICBzbWFsbDogQm9vbGVhbixcblxuICAgIHRvdGFsOiBOdW1iZXIsXG5cbiAgICBwYWdlQ291bnQ6IE51bWJlcixcblxuICAgIGN1cnJlbnRQYWdlOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcblxuICAgIGxheW91dDoge1xuICAgICAgZGVmYXVsdDogJ3ByZXYsIHBhZ2VyLCBuZXh0LCBqdW1wZXIsIC0+LCB0b3RhbCdcbiAgICB9LFxuXG4gICAgcGFnZVNpemVzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiBbMTAsIDIwLCAzMCwgNDAsIDUwLCAxMDBdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbEN1cnJlbnRQYWdlOiAxLFxuICAgICAgaW50ZXJuYWxQYWdlU2l6ZTogMFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKGgpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSA8ZGl2IGNsYXNzPSdlbC1wYWdpbmF0aW9uJz48L2Rpdj47XG4gICAgY29uc3QgbGF5b3V0ID0gdGhpcy5sYXlvdXQgfHwgJyc7XG4gICAgaWYgKCFsYXlvdXQpIHJldHVybjtcbiAgICBjb25zdCBURU1QTEFURV9NQVAgPSB7XG4gICAgICBwcmV2OiA8cHJldj48L3ByZXY+LFxuICAgICAganVtcGVyOiA8anVtcGVyPjwvanVtcGVyPixcbiAgICAgIHBhZ2VyOiA8cGFnZXIgY3VycmVudFBhZ2U9eyB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgfSBwYWdlQ291bnQ9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH0gb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDdXJyZW50Q2hhbmdlIH0+PC9wYWdlcj4sXG4gICAgICBuZXh0OiA8bmV4dD48L25leHQ+LFxuICAgICAgc2l6ZXM6IDxzaXplcyBwYWdlU2l6ZXM9eyB0aGlzLnBhZ2VTaXplcyB9Pjwvc2l6ZXM+LFxuICAgICAgc2xvdDogPG15LXNsb3Q+PC9teS1zbG90PixcbiAgICAgIHRvdGFsOiA8dG90YWw+PC90b3RhbD5cbiAgICB9O1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBsYXlvdXQuc3BsaXQoJywnKS5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKTtcbiAgICBjb25zdCByaWdodFdyYXBwZXIgPSA8ZGl2IGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fcmlnaHR3cmFwcGVyXCI+PC9kaXY+O1xuICAgIGxldCBoYXZlUmlnaHRXcmFwcGVyID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5zbWFsbCkge1xuICAgICAgdGVtcGxhdGUuZGF0YS5jbGFzcyArPSAnIGVsLXBhZ2luYXRpb24tLXNtYWxsJztcbiAgICB9XG5cbiAgICBjb21wb25lbnRzLmZvckVhY2goY29tcG8gPT4ge1xuICAgICAgaWYgKGNvbXBvID09PSAnLT4nKSB7XG4gICAgICAgIGhhdmVSaWdodFdyYXBwZXIgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghaGF2ZVJpZ2h0V3JhcHBlcikge1xuICAgICAgICB0ZW1wbGF0ZS5jaGlsZHJlbi5wdXNoKFRFTVBMQVRFX01BUFtjb21wb10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmlnaHRXcmFwcGVyLmNoaWxkcmVuLnB1c2goVEVNUExBVEVfTUFQW2NvbXBvXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaGF2ZVJpZ2h0V3JhcHBlcikge1xuICAgICAgdGVtcGxhdGUuY2hpbGRyZW4udW5zaGlmdChyaWdodFdyYXBwZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfSxcblxuICBjb21wb25lbnRzOiB7XG4gICAgTXlTbG90OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuJHBhcmVudC4kc2xvdHMuZGVmYXVsdFxuICAgICAgICAgID8gdGhpcy4kcGFyZW50LiRzbG90cy5kZWZhdWx0WzBdXG4gICAgICAgICAgOiAnJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG4gICAgUHJldjoge1xuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPXtbJ2J0bi1wcmV2JywgeyBkaXNhYmxlZDogdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgPD0gMSB9XX1cbiAgICAgICAgICAgIG9uLWNsaWNrPXsgdGhpcy4kcGFyZW50LnByZXYgfT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZWwtaWNvbiBlbC1pY29uLWFycm93LWxlZnRcIj48L2k+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIE5leHQ6IHtcbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz17W1xuICAgICAgICAgICAgICAnYnRuLW5leHQnLFxuICAgICAgICAgICAgICB7IGRpc2FibGVkOiB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSA9PT0gdGhpcy4kcGFyZW50LmludGVybmFsUGFnZUNvdW50IHx8IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VDb3VudCA9PT0gMCB9XG4gICAgICAgICAgICBdfVxuICAgICAgICAgICAgb24tY2xpY2s9eyB0aGlzLiRwYXJlbnQubmV4dCB9PlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJlbC1pY29uIGVsLWljb24tYXJyb3ctcmlnaHRcIj48L2k+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFNpemVzOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICBwcm9wczoge1xuICAgICAgICBwYWdlU2l6ZXM6IEFycmF5XG4gICAgICB9LFxuXG4gICAgICB3YXRjaDoge1xuICAgICAgICBwYWdlU2l6ZXM6IHtcbiAgICAgICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICAgICAgaGFuZGxlcih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplID0gdmFsdWUuaW5kZXhPZih0aGlzLiRwYXJlbnQucGFnZVNpemUpID4gLTFcbiAgICAgICAgICAgICAgICA/IHRoaXMuJHBhcmVudC5wYWdlU2l6ZVxuICAgICAgICAgICAgICAgIDogdGhpcy5wYWdlU2l6ZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fc2l6ZXNcIj5cbiAgICAgICAgICAgIDxlbC1zZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSB9XG4gICAgICAgICAgICAgIG9uLWlucHV0PXsgdGhpcy5oYW5kbGVDaGFuZ2UgfT5cbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnZVNpemVzLm1hcChpdGVtID0+XG4gICAgICAgICAgICAgICAgICA8ZWwtb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXsgaXRlbSB9XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPXsgaXRlbSArICcgJyArIHRoaXMudCgnZWwucGFnaW5hdGlvbi5wYWdlc2l6ZScpIH0+XG4gICAgICAgICAgICAgICAgICA8L2VsLW9wdGlvbj5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZWwtc2VsZWN0PlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIGNvbXBvbmVudHM6IHtcbiAgICAgIC8vICAgRWxTZWxlY3QsXG4gICAgICAvLyAgIEVsT3B0aW9uXG4gICAgICAvLyB9LFxuXG4gICAgICBtZXRob2RzOiB7XG4gICAgICAgIGhhbmRsZUNoYW5nZSh2YWwpIHtcbiAgICAgICAgICBpZiAodmFsICE9PSB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZVNpemUgPSB2YWwgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudC4kZW1pdCgnc2l6ZS1jaGFuZ2UnLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBKdW1wZXI6IHtcbiAgICAgIC8vIG1peGluczogW0xvY2FsZV0sXG5cbiAgICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb2xkVmFsdWU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZUNoYW5nZSh7IHRhcmdldCB9KSB7XG4gICAgICAgICAgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgPSB0aGlzLiRwYXJlbnQuZ2V0VmFsaWRDdXJyZW50UGFnZSh0YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHRoaXMub2xkVmFsdWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fanVtcFwiPlxuICAgICAgICAgICAgeyB0aGlzLnQoJ2VsLnBhZ2luYXRpb24uZ290bycpIH1cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzcz1cImVsLXBhZ2luYXRpb25fX2VkaXRvclwiXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBtaW49eyAxIH1cbiAgICAgICAgICAgICAgbWF4PXsgdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCB9XG4gICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgfVxuICAgICAgICAgICAgICBvbi1jaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZSB9XG4gICAgICAgICAgICAgIG9uLWZvY3VzPXsgdGhpcy5oYW5kbGVGb2N1cyB9XG4gICAgICAgICAgICAgIG51bWJlci8+XG4gICAgICAgICAgICB7IHRoaXMudCgnZWwucGFnaW5hdGlvbi5wYWdlQ2xhc3NpZmllcicpIH1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFRvdGFsOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHR5cGVvZiB0aGlzLiRwYXJlbnQudG90YWwgPT09ICdudW1iZXInXG4gICAgICAgICAgICA/IDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fdG90YWxcIj57IHRoaXMudCgnZWwucGFnaW5hdGlvbi50b3RhbCcsIHsgdG90YWw6IHRoaXMuJHBhcmVudC50b3RhbCB9KSB9PC9zcGFuPlxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBQYWdlclxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDdXJyZW50Q2hhbmdlKHZhbCkge1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKHZhbCk7XG4gICAgfSxcblxuICAgIHByZXYoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgLSAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIG5leHQoKSB7XG4gICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgKyAxO1xuICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgfSxcblxuICAgIGdldFZhbGlkQ3VycmVudFBhZ2UodmFsdWUpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcblxuICAgICAgY29uc3QgaGF2ZVBhZ2VDb3VudCA9IHR5cGVvZiB0aGlzLmludGVybmFsUGFnZUNvdW50ID09PSAnbnVtYmVyJztcblxuICAgICAgbGV0IHJlc2V0VmFsdWU7XG4gICAgICBpZiAoIWhhdmVQYWdlQ291bnQpIHtcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA8IDEpIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkge1xuICAgICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCkge1xuICAgICAgICAgIHJlc2V0VmFsdWUgPSB0aGlzLmludGVybmFsUGFnZUNvdW50O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNldFZhbHVlID09PSB1bmRlZmluZWQgJiYgaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfSBlbHNlIGlmIChyZXNldFZhbHVlID09PSAwKSB7XG4gICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzZXRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gdmFsdWUgOiByZXNldFZhbHVlO1xuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGludGVybmFsUGFnZUNvdW50KCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnRvdGFsID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWwgLyB0aGlzLmludGVybmFsUGFnZVNpemUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5wYWdlQ291bnQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VDb3VudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGN1cnJlbnRQYWdlOiB7XG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICBoYW5kbGVyKHZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSB2YWw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHBhZ2VTaXplOiB7XG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICBoYW5kbGVyKHZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsUGFnZVNpemUgPSB2YWw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGludGVybmFsQ3VycmVudFBhZ2UobmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgIG5ld1ZhbCA9IHBhcnNlSW50KG5ld1ZhbCwgMTApO1xuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChpc05hTihuZXdWYWwpKSB7XG4gICAgICAgIG5ld1ZhbCA9IG9sZFZhbCB8fCAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsID0gdGhpcy5nZXRWYWxpZEN1cnJlbnRQYWdlKG5ld1ZhbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdWYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gbmV3VmFsO1xuICAgICAgICAgIGlmIChvbGRWYWwgIT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmN1cnJlbnRQYWdlJywgbmV3VmFsKTtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2N1cnJlbnQtY2hhbmdlJywgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmN1cnJlbnRQYWdlJywgbmV3VmFsKTtcbiAgICAgICAgdGhpcy4kZW1pdCgnY3VycmVudC1jaGFuZ2UnLCB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnRlcm5hbFBhZ2VDb3VudChuZXdWYWwpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgY29uc3Qgb2xkUGFnZSA9IHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZTtcbiAgICAgIGlmIChuZXdWYWwgPiAwICYmIG9sZFBhZ2UgPT09IDApIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAob2xkUGFnZSA+IG5ld1ZhbCkge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSBuZXdWYWwgPT09IDAgPyAxIDogbmV3VmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
