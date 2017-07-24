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
                  placeholder: this.$parent.internalPageSize,

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9vcmdhbmlzbXMvUGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJwcm9wcyIsInBhZ2VTaXplIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJ0b3RhbCIsInBhZ2VDb3VudCIsImN1cnJlbnRQYWdlIiwibGF5b3V0IiwicGFnZVNpemVzIiwiQXJyYXkiLCJkYXRhIiwiaW50ZXJuYWxDdXJyZW50UGFnZSIsImludGVybmFsUGFnZVNpemUiLCJyZW5kZXIiLCJoIiwidGVtcGxhdGUiLCJURU1QTEFURV9NQVAiLCJwcmV2IiwianVtcGVyIiwicGFnZXIiLCJpbnRlcm5hbFBhZ2VDb3VudCIsImhhbmRsZUN1cnJlbnRDaGFuZ2UiLCJuZXh0Iiwic2l6ZXMiLCJzbG90IiwiY29tcG9uZW50cyIsInNwbGl0IiwibWFwIiwiaXRlbSIsInRyaW0iLCJ3cmFwcGVyIiwiaGF2ZVdyYXBwZXIiLCJmb3JFYWNoIiwiY29tcG8iLCJjaGlsZHJlbiIsInB1c2giLCJ1bnNoaWZ0IiwiTXlTbG90IiwiJHBhcmVudCIsIiRzbG90cyIsIlByZXYiLCJOZXh0IiwiU2l6ZXMiLCJ3YXRjaCIsImltbWVkaWF0ZSIsImhhbmRsZXIiLCJ2YWx1ZSIsImlzQXJyYXkiLCJpbmRleE9mIiwiaGFuZGxlQ2hhbmdlIiwibWV0aG9kcyIsInZhbCIsInBhcnNlSW50IiwiJGVtaXQiLCJKdW1wZXIiLCJvbGRWYWx1ZSIsImhhbmRsZUZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJnZXRWYWxpZEN1cnJlbnRQYWdlIiwiVG90YWwiLCJQYWdlciIsIm5ld1ZhbCIsImhhdmVQYWdlQ291bnQiLCJyZXNldFZhbHVlIiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJjb21wdXRlZCIsIk1hdGgiLCJjZWlsIiwib2xkVmFsIiwiJG5leHRUaWNrIiwib2xkUGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFPZTtBQUNiQSxVQUFNLFlBRE87O0FBR2JDLFdBQU87QUFDTEMsZ0JBQVU7QUFDUkMsY0FBTUMsTUFERTtBQUVSQyxpQkFBUztBQUZELE9BREw7O0FBTUw7O0FBRUFDLGFBQU9GLE1BUkY7O0FBVUxHLGlCQUFXSCxNQVZOOztBQVlMSSxtQkFBYTtBQUNYTCxjQUFNQyxNQURLO0FBRVhDLGlCQUFTO0FBRkUsT0FaUjs7QUFpQkxJLGNBQVE7QUFDTkosaUJBQVM7QUFESCxPQWpCSDs7QUFxQkxLLGlCQUFXO0FBQ1RQLGNBQU1RLEtBREc7QUFFVE4sZUFGUyxzQkFFQztBQUNSLGlCQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixHQUFyQixDQUFQO0FBQ0Q7QUFKUTtBQXJCTixLQUhNOztBQWdDYk8sUUFoQ2Esa0JBZ0NOO0FBQ0wsYUFBTztBQUNMQyw2QkFBcUIsQ0FEaEI7QUFFTEMsMEJBQWtCO0FBRmIsT0FBUDtBQUlELEtBckNZO0FBdUNiQyxVQXZDYSxrQkF1Q05DLENBdkNNLEVBdUNIO0FBQ1I7QUFDQSxVQUFJQyxXQUFXO0FBQUE7QUFBQSxVQUFLLFNBQU0sWUFBWDtBQUFBO0FBQUEsT0FBZjs7QUFFQTtBQUNBLFVBQU1SLFNBQVMsS0FBS0EsTUFBTCxJQUFlLEVBQTlCO0FBQ0EsVUFBSSxDQUFDQSxNQUFMLEVBQWE7O0FBRWI7QUFDQSxVQUFNUyxlQUFlO0FBQ25CQyxjQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FEYTtBQUVuQkMsZ0JBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUZXO0FBR25CQyxlQUFPO0FBQUE7QUFBQTtBQUFBLHFCQUFPLG1CQUFpQixDQUFDLGtCQUFELENBQXhCLEVBQThDLGFBQWMsS0FBS1IsbUJBQWpFLEVBQXVGLFdBQVksS0FBS1MsaUJBQXhHO0FBQUE7QUFBQSx3QkFBd0ksS0FBS0M7QUFBN0k7QUFBQTtBQUFBO0FBQUEsU0FIWTtBQUluQkMsY0FBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBSmE7QUFLbkJDLGVBQU87QUFBQTtBQUFBO0FBQUEscUJBQU8sV0FBWSxLQUFLZixTQUF4QjtBQUFBO0FBQUE7QUFBQSxTQUxZO0FBTW5CZ0IsY0FBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBTmE7QUFPbkJwQixlQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFQWSxPQUFyQjs7QUFVQTtBQUNBLFVBQU1xQixhQUFhbEIsT0FBT21CLEtBQVAsQ0FBYSxHQUFiLEVBQWtCQyxHQUFsQixDQUFzQixVQUFDQyxJQUFEO0FBQUEsZUFBVUEsS0FBS0MsSUFBTCxFQUFWO0FBQUEsT0FBdEIsQ0FBbkI7QUFDQSxVQUFNQyxVQUFVO0FBQUE7QUFBQSxVQUFLLFNBQU0scUJBQVg7QUFBQTtBQUFBLE9BQWhCO0FBQ0EsVUFBSUMsY0FBYyxLQUFsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQU4saUJBQVdPLE9BQVgsQ0FBbUIsaUJBQVM7QUFDMUIsWUFBSUMsVUFBVSxJQUFkLEVBQW9CO0FBQ2xCRix3QkFBYyxJQUFkO0FBQ0E7QUFDRDs7QUFFRCxZQUFJLENBQUNBLFdBQUwsRUFBa0I7QUFDaEJoQixtQkFBU21CLFFBQVQsQ0FBa0JDLElBQWxCLENBQXVCbkIsYUFBYWlCLEtBQWIsQ0FBdkI7QUFDRCxTQUZELE1BRU87QUFDTEgsa0JBQVFJLFFBQVIsQ0FBaUJDLElBQWpCLENBQXNCbkIsYUFBYWlCLEtBQWIsQ0FBdEI7QUFDRDtBQUNGLE9BWEQ7O0FBYUEsVUFBSUYsV0FBSixFQUFpQjtBQUNmaEIsaUJBQVNtQixRQUFULENBQWtCRSxPQUFsQixDQUEwQk4sT0FBMUI7QUFDRDs7QUFFRCxhQUFPZixRQUFQO0FBQ0QsS0F0Rlk7OztBQXdGYlUsZ0JBQVk7QUFDVlksY0FBUTtBQUNOeEIsY0FETSxrQkFDQ0MsQ0FERCxFQUNJO0FBQ1IsaUJBQ0UsS0FBS3dCLE9BQUwsQ0FBYUMsTUFBYixDQUFvQnBDLE9BQXBCLEdBQ0UsS0FBS21DLE9BQUwsQ0FBYUMsTUFBYixDQUFvQnBDLE9BQXBCLENBQTRCLENBQTVCLENBREYsR0FFRSxFQUhKO0FBS0Q7QUFQSyxPQURFO0FBVVZxQyxZQUFNO0FBQ0ozQixjQURJLGtCQUNHQyxDQURILEVBQ007QUFDUixpQkFDRTtBQUFBO0FBQUEsY0FBSyxTQUFNLGtCQUFYO0FBQUEsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUNFLHdCQUFLO0FBRFA7QUFFRSx5QkFBTyxDQUFDLGVBQUQsRUFBa0IsRUFBRSxlQUFlLEtBQUt3QixPQUFMLENBQWEzQixtQkFBYixJQUFvQyxDQUFyRCxFQUFsQixDQUZUO0FBQUE7QUFBQSwyQkFHYSxLQUFLMkIsT0FBTCxDQUFhckI7QUFIMUI7QUFBQTtBQUFBLGVBSUU7QUFBQTtBQUFBLGtCQUFNLFNBQU0scUNBQVo7QUFBQTtBQUFBLGVBSkY7QUFBQSxhQURGO0FBQUEsV0FERjtBQVVEO0FBWkcsT0FWSTs7QUF5QlZ3QixZQUFNO0FBQ0o1QixjQURJLGtCQUNHQyxDQURILEVBQ007QUFDUixpQkFDRTtBQUFBO0FBQUEsY0FBSyxTQUFNLGtCQUFYO0FBQUEsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUNFLHdCQUFLO0FBRFA7QUFFRSx5QkFBTztBQUNMO0FBQ0EsK0JBRkssRUFHTCxFQUFFLGVBQWUsS0FBS3dCLE9BQUwsQ0FBYTNCLG1CQUFiLEtBQXFDLEtBQUsyQixPQUFMLENBQWFsQixpQkFBbEQsSUFBdUUsS0FBS2tCLE9BQUwsQ0FBYWxCLGlCQUFiLEtBQW1DLENBQTNILEVBSEssQ0FGVDtBQUFBO0FBQUEsMkJBT2EsS0FBS2tCLE9BQUwsQ0FBYWhCO0FBUDFCO0FBQUE7QUFBQSxlQVFFO0FBQUE7QUFBQSxrQkFBTSxTQUFNLHNDQUFaO0FBQUE7QUFBQSxlQVJGO0FBQUEsYUFERjtBQUFBLFdBREY7QUFjRDtBQWhCRyxPQXpCSTs7QUE0Q1Y7QUFDQW9CLGFBQU87QUFDTDs7QUFFQTNDLGVBQU87QUFDTFMscUJBQVdDO0FBRE4sU0FIRjs7QUFPTGtDLGVBQU87QUFDTG5DLHFCQUFXO0FBQ1RvQyx1QkFBVyxJQURGO0FBRVRDLG1CQUZTLG1CQUVEQyxLQUZDLEVBRU07QUFDYixrQkFBSXJDLE1BQU1zQyxPQUFOLENBQWNELEtBQWQsQ0FBSixFQUEwQjtBQUN4QixxQkFBS1IsT0FBTCxDQUFhMUIsZ0JBQWIsR0FBZ0NrQyxNQUFNRSxPQUFOLENBQWMsS0FBS1YsT0FBTCxDQUFhdEMsUUFBM0IsSUFBdUMsQ0FBQyxDQUF4QyxHQUM1QixLQUFLc0MsT0FBTCxDQUFhdEMsUUFEZSxHQUU1QixLQUFLUSxTQUFMLENBQWUsQ0FBZixDQUZKO0FBR0Q7QUFDRjtBQVJRO0FBRE4sU0FQRjs7QUFvQkxLLGNBcEJLLGtCQW9CRUMsQ0FwQkYsRUFvQks7QUFDUixpQkFDRTtBQUFBO0FBQUEsY0FBSyxTQUFNLG1CQUFYO0FBQUEsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUNFLCtCQUFlLEtBQUt3QixPQUFMLENBQWExQixnQkFEOUI7O0FBR0UsMkJBQVUsS0FBS0o7QUFIakI7QUFBQTtBQUFBLDJCQUVhLEtBQUt5QztBQUZsQjtBQUFBO0FBQUE7QUFBQSxhQURGO0FBQUEsV0FERjtBQVVELFNBL0JJOzs7QUFpQ0x4QixvQkFBWTtBQUNWO0FBRFUsU0FqQ1A7O0FBcUNMeUIsaUJBQVM7QUFDUEQsc0JBRE8sd0JBQ01FLEdBRE4sRUFDVztBQUNoQixnQkFBSUEsUUFBUSxLQUFLYixPQUFMLENBQWExQixnQkFBekIsRUFBMkM7QUFDekMsbUJBQUswQixPQUFMLENBQWExQixnQkFBYixHQUFnQ3VDLE1BQU1DLFNBQVNELEdBQVQsRUFBYyxFQUFkLENBQXRDO0FBQ0EsbUJBQUtiLE9BQUwsQ0FBYWUsS0FBYixDQUFtQixhQUFuQixFQUFrQ0YsR0FBbEM7QUFDRDtBQUNGO0FBTk07QUFyQ0osT0E3Q0c7O0FBNEZWO0FBQ0FHLGNBQVE7QUFHTjVDLFlBSE0sa0JBR0M7QUFDTCxpQkFBTztBQUNMNkMsc0JBQVU7QUFETCxXQUFQO0FBR0QsU0FQSzs7O0FBU05MLGlCQUFTO0FBQ1BNLHFCQURPLHVCQUNLQyxLQURMLEVBQ1k7QUFDakIsaUJBQUtGLFFBQUwsR0FBZ0JFLE1BQU1DLE1BQU4sQ0FBYVosS0FBN0I7QUFDRCxXQUhNO0FBU1BHLHNCQVRPLHdCQVNNSCxLQVROLEVBU2E7QUFDaEIsaUJBQUtSLE9BQUwsQ0FBYTNCLG1CQUFiLEdBQW1DLEtBQUsyQixPQUFMLENBQWFxQixtQkFBYixDQUFpQ2IsS0FBakMsQ0FBbkM7QUFDQSxpQkFBS1MsUUFBTCxHQUFnQixJQUFoQjtBQUNIO0FBWk0sU0FUSDs7QUF3Qk45QixvQkFBWTtBQUNWO0FBRFUsU0F4Qk47O0FBNEJOWixjQTVCTSxrQkE0QkNDLENBNUJELEVBNEJJO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFDSTtBQUFBO0FBQUEsY0FBSyxTQUFNLGtCQUFYO0FBQUEsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUNFLHVCQUFNLENBRFI7QUFFRSx1QkFBTSxLQUFLd0IsT0FBTCxDQUFhbEIsaUJBRnJCO0FBR0UseUJBQVEsS0FBS2tCLE9BQUwsQ0FBYTNCO0FBSHZCO0FBQUE7QUFBQSw0QkFJYyxLQUFLc0MsWUFKbkI7QUFBQSwyQkFLYSxLQUFLTztBQUxsQjtBQUFBO0FBQUE7QUFBQSxhQURGO0FBQUEsV0FESjtBQVlEO0FBckVLLE9BN0ZFOztBQXFLVjtBQUNBSSxhQUFPO0FBR0wvQyxjQUhLLGtCQUdFQyxDQUhGLEVBR0s7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQ0UsT0FBTyxLQUFLd0IsT0FBTCxDQUFhbEMsS0FBcEIsS0FBOEIsUUFBOUIsR0FDSTtBQUFBO0FBQUEsY0FBTSxTQUFNLG1CQUFaO0FBQUEsd0JBQXlDLEtBQUtrQyxPQUFMLENBQWFsQyxLQUF0RDtBQUFBLFdBREosR0FFSSxFQUhOO0FBS0Q7QUFkSSxPQXRLRzs7QUF1TFZ5RDtBQXZMVSxLQXhGQzs7QUFrUmJYLGFBQVM7QUFDUDdCLHlCQURPLCtCQUNhOEIsR0FEYixFQUNrQjtBQUN2QjtBQUNBLGFBQUt4QyxtQkFBTCxHQUEyQixLQUFLZ0QsbUJBQUwsQ0FBeUJSLEdBQXpCLENBQTNCO0FBQ0QsT0FKTTtBQU1QbEMsVUFOTyxrQkFNQTtBQUNMLFlBQU02QyxTQUFTLEtBQUtuRCxtQkFBTCxHQUEyQixDQUExQztBQUNBLGFBQUtBLG1CQUFMLEdBQTJCLEtBQUtnRCxtQkFBTCxDQUF5QkcsTUFBekIsQ0FBM0I7QUFDRCxPQVRNO0FBV1B4QyxVQVhPLGtCQVdBO0FBQ0wsWUFBTXdDLFNBQVMsS0FBS25ELG1CQUFMLEdBQTJCLENBQTFDO0FBQ0EsYUFBS0EsbUJBQUwsR0FBMkIsS0FBS2dELG1CQUFMLENBQXlCRyxNQUF6QixDQUEzQjtBQUNELE9BZE07QUFnQlBILHlCQWhCTywrQkFnQmFiLEtBaEJiLEVBZ0JvQjtBQUN6Qjs7QUFFQTtBQUNBQSxnQkFBUU0sU0FBU04sS0FBVCxFQUFnQixFQUFoQixDQUFSOztBQUVBO0FBQ0EsWUFBTWlCLGdCQUFnQixPQUFPLEtBQUszQyxpQkFBWixLQUFrQyxRQUF4RDs7QUFFQSxZQUFJNEMsbUJBQUo7QUFDQSxZQUFJLENBQUNELGFBQUwsRUFBb0I7QUFDbEIsY0FBSUUsTUFBTW5CLEtBQU4sS0FBZ0JBLFFBQVEsQ0FBNUIsRUFBK0JrQixhQUFhLENBQWI7QUFDaEMsU0FGRCxNQUVPOztBQUVMO0FBQ0EsY0FBSWxCLFFBQVEsQ0FBWixFQUFlO0FBQ2I7QUFDQWtCLHlCQUFhLENBQWI7QUFDRCxXQUhELE1BR08sSUFBSWxCLFFBQVEsS0FBSzFCLGlCQUFqQixFQUFvQztBQUN6QztBQUNBNEMseUJBQWEsS0FBSzVDLGlCQUFsQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFJNEMsZUFBZUUsU0FBZixJQUE0QkQsTUFBTW5CLEtBQU4sQ0FBaEMsRUFBOEM7QUFDNUNrQix1QkFBYSxDQUFiO0FBQ0QsU0FGRCxNQUVPLElBQUlBLGVBQWUsQ0FBbkIsRUFBc0I7QUFDM0JBLHVCQUFhLENBQWI7QUFDRDs7QUFFRDtBQUNBLGVBQU9BLGVBQWVFLFNBQWYsR0FBMkJwQixLQUEzQixHQUFtQ2tCLFVBQTFDO0FBQ0Q7QUFqRE0sS0FsUkk7O0FBc1ViRyxjQUFVO0FBQ1IvQyx1QkFEUSwrQkFDWTtBQUNsQixZQUFJLE9BQU8sS0FBS2hCLEtBQVosS0FBc0IsUUFBMUIsRUFBb0M7QUFDbEMsaUJBQU9nRSxLQUFLQyxJQUFMLENBQVUsS0FBS2pFLEtBQUwsR0FBYSxLQUFLUSxnQkFBNUIsQ0FBUDtBQUNELFNBRkQsTUFFTyxJQUFJLE9BQU8sS0FBS1AsU0FBWixLQUEwQixRQUE5QixFQUF3QztBQUM3QyxpQkFBTyxLQUFLQSxTQUFaO0FBQ0Q7QUFDRCxlQUFPLElBQVA7QUFDRDtBQVJPLEtBdFVHOztBQWlWYnNDLFdBQU87QUFDTHJDLG1CQUFhO0FBQ1hzQyxtQkFBVyxJQURBO0FBRVhDLGVBRlcsbUJBRUhNLEdBRkcsRUFFRTtBQUNYLGVBQUt4QyxtQkFBTCxHQUEyQndDLEdBQTNCO0FBQ0Q7QUFKVSxPQURSOztBQVFMbkQsZ0JBQVU7QUFDUjRDLG1CQUFXLElBREg7QUFFUkMsZUFGUSxtQkFFQU0sR0FGQSxFQUVLO0FBQ1gsZUFBS3ZDLGdCQUFMLEdBQXdCdUMsR0FBeEI7QUFDRDtBQUpPLE9BUkw7O0FBZUx4Qyx5QkFmSywrQkFlZW1ELE1BZmYsRUFldUJRLE1BZnZCLEVBZStCO0FBQUE7O0FBQ2xDUixpQkFBU1YsU0FBU1UsTUFBVCxFQUFpQixFQUFqQixDQUFUOztBQUVBO0FBQ0EsWUFBSUcsTUFBTUgsTUFBTixDQUFKLEVBQW1CO0FBQ2pCQSxtQkFBU1EsVUFBVSxDQUFuQjtBQUNELFNBRkQsTUFFTztBQUNMUixtQkFBUyxLQUFLSCxtQkFBTCxDQUF5QkcsTUFBekIsQ0FBVDtBQUNEOztBQUVELFlBQUlBLFdBQVdJLFNBQWYsRUFBMEI7QUFDeEIsZUFBS0ssU0FBTCxDQUFlLFlBQU07QUFDbkIsa0JBQUs1RCxtQkFBTCxHQUEyQm1ELE1BQTNCO0FBQ0EsZ0JBQUlRLFdBQVdSLE1BQWYsRUFBdUI7QUFDckIsb0JBQUtULEtBQUwsQ0FBVyxvQkFBWCxFQUFpQ1MsTUFBakM7QUFDQSxvQkFBS1QsS0FBTCxDQUFXLGdCQUFYLEVBQTZCLE1BQUsxQyxtQkFBbEM7QUFDRDtBQUNGLFdBTkQ7QUFPRCxTQVJELE1BUU87QUFDTCxlQUFLMEMsS0FBTCxDQUFXLG9CQUFYLEVBQWlDUyxNQUFqQztBQUNBLGVBQUtULEtBQUwsQ0FBVyxnQkFBWCxFQUE2QixLQUFLMUMsbUJBQWxDO0FBQ0Q7QUFDRixPQXJDSTtBQXVDTFMsdUJBdkNLLDZCQXVDYTBDLE1BdkNiLEVBdUNxQjtBQUN4QjtBQUNBLFlBQU1VLFVBQVUsS0FBSzdELG1CQUFyQjtBQUNBLFlBQUltRCxTQUFTLENBQVQsSUFBY1UsWUFBWSxDQUE5QixFQUFpQztBQUMvQixlQUFLN0QsbUJBQUwsR0FBMkIsQ0FBM0I7QUFDRCxTQUZELE1BRU8sSUFBSTZELFVBQVVWLE1BQWQsRUFBc0I7QUFDM0IsZUFBS25ELG1CQUFMLEdBQTJCbUQsV0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQkEsTUFBOUM7QUFDRDtBQUNGO0FBL0NJO0FBalZNLEciLCJmaWxlIjoiYXBwL29yZ2FuaXNtcy9QYWdpbmF0aW9uL1BhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFnZXIgZnJvbSAnLi9QYWdlcic7XG5pbXBvcnQgU2VsZWN0IGZyb20gJy4uLy4uL2F0b21zL1NlbGVjdCc7XG5pbXBvcnQgSW5wdXROdW1iZXIgZnJvbSAnLi4vLi4vbW9sZWN1bGVzL0lucHV0TnVtYmVyL0lucHV0TnVtYmVyJztcbi8vIGltcG9ydCBFbFNlbGVjdCBmcm9tICdlbGVtZW50LXVpL3BhY2thZ2VzL3NlbGVjdCc7XG4vLyBpbXBvcnQgRWxPcHRpb24gZnJvbSAnZWxlbWVudC11aS9wYWNrYWdlcy9vcHRpb24nO1xuLy8gaW1wb3J0IExvY2FsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9jYWxlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnUGFnaW5hdGlvbicsXG5cbiAgcHJvcHM6IHtcbiAgICBwYWdlU2l6ZToge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMTBcbiAgICB9LFxuXG4gICAgLy8gc21hbGw6IEJvb2xlYW4sXG5cbiAgICB0b3RhbDogTnVtYmVyLFxuXG4gICAgcGFnZUNvdW50OiBOdW1iZXIsXG5cbiAgICBjdXJyZW50UGFnZToge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMVxuICAgIH0sXG5cbiAgICBsYXlvdXQ6IHtcbiAgICAgIGRlZmF1bHQ6ICdwcmV2LCBwYWdlciwgbmV4dCwganVtcGVyLCAtPiwgdG90YWwnXG4gICAgfSxcblxuICAgIHBhZ2VTaXplczoge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0KCkge1xuICAgICAgICByZXR1cm4gWzEwLCAyMCwgMzAsIDQwLCA1MCwgMTAwXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW50ZXJuYWxDdXJyZW50UGFnZTogMSxcbiAgICAgIGludGVybmFsUGFnZVNpemU6IDBcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcihoKSB7XG4gICAgLy8gbWFrZSBtYXN0ZXIgdGVtcGxhdGUgXG4gICAgbGV0IHRlbXBsYXRlID0gPGRpdiBjbGFzcz0ncGFnaW5hdGlvbic+PC9kaXY+O1xuXG4gICAgLy8gbGF5b3V0IGlzIGVpdGhlciB0YWtlbiBhcyBhIHByb3Agb3IgaXMgYW4gZW1wdHkgc3RyaW5nIGlmIG5vdCBwYXNzZWQgaW4gXG4gICAgY29uc3QgbGF5b3V0ID0gdGhpcy5sYXlvdXQgfHwgJyc7XG4gICAgaWYgKCFsYXlvdXQpIHJldHVybjtcblxuICAgIC8vIENyZWF0ZSBtYXAgb2YgbGF5b3V0IGtleXMgdG8gcmVzcGVjdGl2ZSBtYXJrdXAgXG4gICAgY29uc3QgVEVNUExBVEVfTUFQID0ge1xuICAgICAgcHJldjogPHByZXY+PC9wcmV2PixcbiAgICAgIGp1bXBlcjogPGp1bXBlcj48L2p1bXBlcj4sXG4gICAgICBwYWdlcjogPHBhZ2VyIG1vZGlmaWVyLXN0eWxlcz17W1wicGFnZXJfc2l6ZS1zbWFsbFwiXX0gY3VycmVudFBhZ2U9eyB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgfSBwYWdlQ291bnQ9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH0gb24tY2hhbmdlPXsgdGhpcy5oYW5kbGVDdXJyZW50Q2hhbmdlIH0+PC9wYWdlcj4sXG4gICAgICBuZXh0OiA8bmV4dD48L25leHQ+LFxuICAgICAgc2l6ZXM6IDxzaXplcyBwYWdlU2l6ZXM9eyB0aGlzLnBhZ2VTaXplcyB9Pjwvc2l6ZXM+LFxuICAgICAgc2xvdDogPG15LXNsb3Q+PC9teS1zbG90PixcbiAgICAgIHRvdGFsOiA8dG90YWw+PC90b3RhbD5cbiAgICB9O1xuXG4gICAgLy8gY29tcG9uZW50cyA9IGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb3JyZWxhdGUgdG8ga2V5cyBpbiBURU1QTEFURV9NQVAgXG4gICAgY29uc3QgY29tcG9uZW50cyA9IGxheW91dC5zcGxpdCgnLCcpLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpO1xuICAgIGNvbnN0IHdyYXBwZXIgPSA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbl9fd3JhcHBlclwiPjwvZGl2PjtcbiAgICBsZXQgaGF2ZVdyYXBwZXIgPSBmYWxzZTtcblxuICAgIC8vIGlmICh0aGlzLnNtYWxsKSB7XG4gICAgLy8gICB0ZW1wbGF0ZS5kYXRhLmNsYXNzICs9ICcgZWwtcGFnaW5hdGlvbi0tc21hbGwnO1xuICAgIC8vIH1cblxuICAgIC8vIExvb3AgdGhyb3VnaCBjb21wb25lbnRzIGFycmF5IFxuICAgIGNvbXBvbmVudHMuZm9yRWFjaChjb21wbyA9PiB7XG4gICAgICBpZiAoY29tcG8gPT09ICctPicpIHtcbiAgICAgICAgaGF2ZVdyYXBwZXIgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghaGF2ZVdyYXBwZXIpIHtcbiAgICAgICAgdGVtcGxhdGUuY2hpbGRyZW4ucHVzaChURU1QTEFURV9NQVBbY29tcG9dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXIuY2hpbGRyZW4ucHVzaChURU1QTEFURV9NQVBbY29tcG9dKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXZlV3JhcHBlcikge1xuICAgICAgdGVtcGxhdGUuY2hpbGRyZW4udW5zaGlmdCh3cmFwcGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuICAgIE15U2xvdDoge1xuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGlzLiRwYXJlbnQuJHNsb3RzLmRlZmF1bHRcbiAgICAgICAgICA/IHRoaXMuJHBhcmVudC4kc2xvdHMuZGVmYXVsdFswXVxuICAgICAgICAgIDogJydcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFByZXY6IHtcbiAgICAgIHJlbmRlcihoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2luYXRpb25fX3ByZXZcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPXtbJ2NpcmNsZS1idXR0b24nLCB7ICdpcy1kaXNhYmxlZCc6IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIDw9IDEgfV19XG4gICAgICAgICAgICAgIG9uLWNsaWNrPXsgdGhpcy4kcGFyZW50LnByZXYgfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaXJjbGUtYnV0dG9uX190ZXh0IGljb24tYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBOZXh0OiB7XG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uX19uZXh0XCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz17W1xuICAgICAgICAgICAgICAgIC8vICdjaXJjbGUtYnV0dG9uIGNpcmNsZS1idXR0b25fc2l6ZS1zbWFsbCcsXG4gICAgICAgICAgICAgICAgJ2NpcmNsZS1idXR0b24nLFxuICAgICAgICAgICAgICAgIHsgJ2lzLWRpc2FibGVkJzogdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgPT09IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VDb3VudCB8fCB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlQ291bnQgPT09IDAgfVxuICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICBvbi1jbGljaz17IHRoaXMuJHBhcmVudC5uZXh0IH0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2lyY2xlLWJ1dHRvbl9fdGV4dCBpY29uLWFycm93LXJpZ2h0XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmdcbiAgICBTaXplczoge1xuICAgICAgLy8gbWl4aW5zOiBbTG9jYWxlXSxcblxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgcGFnZVNpemVzOiBBcnJheVxuICAgICAgfSxcblxuICAgICAgd2F0Y2g6IHtcbiAgICAgICAgcGFnZVNpemVzOiB7XG4gICAgICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgICAgIGhhbmRsZXIodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSA9IHZhbHVlLmluZGV4T2YodGhpcy4kcGFyZW50LnBhZ2VTaXplKSA+IC0xXG4gICAgICAgICAgICAgICAgPyB0aGlzLiRwYXJlbnQucGFnZVNpemVcbiAgICAgICAgICAgICAgICA6IHRoaXMucGFnZVNpemVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVuZGVyKGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbl9fc2l6ZXNcIj5cbiAgICAgICAgICAgIDxzZWxlY3QtY29tcG9uZW50XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSB7IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplIH1cbiAgICAgICAgICAgICAgb24taW5wdXQ9eyB0aGlzLmhhbmRsZUNoYW5nZSB9XG4gICAgICAgICAgICAgIG9wdGlvbnM9eyB0aGlzLnBhZ2VTaXplcyB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvc2VsZWN0LWNvbXBvbmVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH0sXG5cbiAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3NlbGVjdC1jb21wb25lbnQnOiBTZWxlY3RcbiAgICAgIH0sXG5cbiAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgaGFuZGxlQ2hhbmdlKHZhbCkge1xuICAgICAgICAgIGlmICh2YWwgIT09IHRoaXMuJHBhcmVudC5pbnRlcm5hbFBhZ2VTaXplKSB7XG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQuaW50ZXJuYWxQYWdlU2l6ZSA9IHZhbCA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50LiRlbWl0KCdzaXplLWNoYW5nZScsIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERvbmUgUmVmYWN0b3JpbmcgXG4gICAgSnVtcGVyOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9sZFZhbHVlOiBudWxsXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICBtZXRob2RzOiB7XG4gICAgICAgIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBoYW5kbGVDaGFuZ2UoeyB0YXJnZXQgfSkge1xuICAgICAgICAvLyAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy4kcGFyZW50LmdldFZhbGlkQ3VycmVudFBhZ2UodGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgLy8gICB0aGlzLm9sZFZhbHVlID0gbnVsbDtcbiAgICAgICAgLy8gfVxuICAgICAgICBoYW5kbGVDaGFuZ2UodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlID0gdGhpcy4kcGFyZW50LmdldFZhbGlkQ3VycmVudFBhZ2UodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ2lucHV0LW51bWJlcic6IElucHV0TnVtYmVyXG4gICAgICB9LFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICAvLyByZXR1cm4gKFxuICAgICAgICAvLyAgIDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fanVtcFwiPlxuICAgICAgICAvLyAgICAgeyB0aGlzLnQoJ2VsLnBhZ2luYXRpb24uZ290bycpIH1cbiAgICAgICAgLy8gICAgIDxpbnB1dFxuICAgICAgICAvLyAgICAgICBjbGFzcz1cImVsLXBhZ2luYXRpb25fX2VkaXRvclwiXG4gICAgICAgIC8vICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAvLyAgICAgICBtaW49eyAxIH1cbiAgICAgICAgLy8gICAgICAgbWF4PXsgdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCB9XG4gICAgICAgIC8vICAgICAgIHZhbHVlPXsgdGhpcy4kcGFyZW50LmludGVybmFsQ3VycmVudFBhZ2UgfVxuICAgICAgICAvLyAgICAgICBvbi1jaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZSB9XG4gICAgICAgIC8vICAgICAgIG9uLWZvY3VzPXsgdGhpcy5oYW5kbGVGb2N1cyB9XG4gICAgICAgIC8vICAgICAgIG51bWJlci8+XG4gICAgICAgIC8vICAgICB7IHRoaXMudCgnZWwucGFnaW5hdGlvbi5wYWdlQ2xhc3NpZmllcicpIH1cbiAgICAgICAgLy8gICA8L3NwYW4+XG4gICAgICAgIC8vICk7XG4gICAgICAgIC8vIHJldHVybiAoXG4gICAgICAgIC8vICAgPHNwYW4gY2xhc3M9XCJwYWdpbmF0aW9uX19qdW1wXCI+XG4gICAgICAgIC8vICAgICA8aW5wdXRcbiAgICAgICAgLy8gICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uX19qdW1wLWlucHV0XCJcbiAgICAgICAgLy8gICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgIC8vICAgICAgIG1pbj17IDEgfVxuICAgICAgICAvLyAgICAgICBtYXg9eyB0aGlzLmludGVybmFsUGFnZUNvdW50IH1cbiAgICAgICAgLy8gICAgICAgdmFsdWU9eyB0aGlzLiRwYXJlbnQuaW50ZXJuYWxDdXJyZW50UGFnZSB9XG4gICAgICAgIC8vICAgICAgIG9uLWNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgLy8gICAgICAgb24tZm9jdXM9eyB0aGlzLmhhbmRsZUZvY3VzIH1cbiAgICAgICAgLy8gICAgICAgbnVtYmVyLz5cbiAgICAgICAgLy8gICA8L3NwYW4+XG4gICAgICAgIC8vICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbl9fanVtcFwiPlxuICAgICAgICAgICAgICA8aW5wdXQtbnVtYmVyXG4gICAgICAgICAgICAgICAgbWluPXsgMSB9XG4gICAgICAgICAgICAgICAgbWF4PXsgdGhpcy4kcGFyZW50LmludGVybmFsUGFnZUNvdW50IH1cbiAgICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuJHBhcmVudC5pbnRlcm5hbEN1cnJlbnRQYWdlIH1cbiAgICAgICAgICAgICAgICBvbi1jaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZSB9XG4gICAgICAgICAgICAgICAgb24tZm9jdXM9eyB0aGlzLmhhbmRsZUZvY3VzIH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2lucHV0LW51bWJlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBEb25lIFJlZmFjdG9yaW5nIFxuICAgIFRvdGFsOiB7XG4gICAgICAvLyBtaXhpbnM6IFtMb2NhbGVdLFxuXG4gICAgICByZW5kZXIoaCkge1xuICAgICAgICAvLyByZXR1cm4gKFxuICAgICAgICAvLyAgIHR5cGVvZiB0aGlzLiRwYXJlbnQudG90YWwgPT09ICdudW1iZXInXG4gICAgICAgIC8vICAgICA/IDxzcGFuIGNsYXNzPVwiZWwtcGFnaW5hdGlvbl9fdG90YWxcIj57IHRoaXMudCgnZWwucGFnaW5hdGlvbi50b3RhbCcsIHsgdG90YWw6IHRoaXMuJHBhcmVudC50b3RhbCB9KSB9PC9zcGFuPlxuICAgICAgICAvLyAgICAgOiAnJ1xuICAgICAgICAvLyApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHR5cGVvZiB0aGlzLiRwYXJlbnQudG90YWwgPT09ICdudW1iZXInXG4gICAgICAgICAgICA/IDxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbl9fdG90YWxcIj50b3RhbDogeyB0aGlzLiRwYXJlbnQudG90YWwgfTwvc3Bhbj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgUGFnZXJcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ3VycmVudENoYW5nZSh2YWwpIHtcbiAgICAgIC8vIE1ldGhvZCB0byBoYW5kbGUgdGhlIEBjaGFuZ2Ugc2VudCBieSBwYWdlciBcbiAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IHRoaXMuZ2V0VmFsaWRDdXJyZW50UGFnZSh2YWwpO1xuICAgIH0sXG5cbiAgICBwcmV2KCkge1xuICAgICAgY29uc3QgbmV3VmFsID0gdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlIC0gMTtcbiAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IHRoaXMuZ2V0VmFsaWRDdXJyZW50UGFnZShuZXdWYWwpO1xuICAgIH0sXG5cbiAgICBuZXh0KCkge1xuICAgICAgY29uc3QgbmV3VmFsID0gdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlICsgMTtcbiAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IHRoaXMuZ2V0VmFsaWRDdXJyZW50UGFnZShuZXdWYWwpO1xuICAgIH0sXG5cbiAgICBnZXRWYWxpZEN1cnJlbnRQYWdlKHZhbHVlKSB7XG4gICAgICAvLyBNZXRob2QgdG8gdmFsaWRhdGUgcGFnZSBudW1iZXIgXG5cbiAgICAgIC8vIFZhbHVlIGlzIHZhbHVlIG9mIG5ld1BhZ2UgXG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cbiAgICAgIC8vIGhhdmVQYWdlQ291bnQgPSB0cnVlIGlmIGludGVybmFsUGFnZUNvdW50IGlzIGEgbnVtYmVyIFxuICAgICAgY29uc3QgaGF2ZVBhZ2VDb3VudCA9IHR5cGVvZiB0aGlzLmludGVybmFsUGFnZUNvdW50ID09PSAnbnVtYmVyJztcblxuICAgICAgbGV0IHJlc2V0VmFsdWU7XG4gICAgICBpZiAoIWhhdmVQYWdlQ291bnQpIHtcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA8IDEpIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIHBhZ2UgY291bnQgXG4gICAgICAgIGlmICh2YWx1ZSA8IDEpIHtcbiAgICAgICAgICAvLyByZXNldCB2YWx1ZSB0byAxIGlmIGRlc2lyZWQgcGFnZSBpcyBsZXNzIHRoYW4gMVxuICAgICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5pbnRlcm5hbFBhZ2VDb3VudCkge1xuICAgICAgICAgIC8vIHJlc2V0IHZhbHVlIHRvIG1heCBudW1iZXIgaWYgZGVzaXJlZCBwYWdlIGlzIGdyZWF0ZXIgdGhhbiB0b3RhbCBwYWdlcy5cbiAgICAgICAgICByZXNldFZhbHVlID0gdGhpcy5pbnRlcm5hbFBhZ2VDb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBoYW5kbGUgZWRnZSBjYXNlcyBcbiAgICAgIGlmIChyZXNldFZhbHVlID09PSB1bmRlZmluZWQgJiYgaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfSBlbHNlIGlmIChyZXNldFZhbHVlID09PSAwKSB7XG4gICAgICAgIHJlc2V0VmFsdWUgPSAxO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gZWl0aGVyIHRoZSBuZXdQYWdlIHZhbHVlIG9yIHRoZSByZXNldFZhbHVlIGlmIG5ld1BhZ2UgaGFzIGVycm9ycyBcbiAgICAgIHJldHVybiByZXNldFZhbHVlID09PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHJlc2V0VmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaW50ZXJuYWxQYWdlQ291bnQoKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMudG90YWwgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy50b3RhbCAvIHRoaXMuaW50ZXJuYWxQYWdlU2l6ZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnBhZ2VDb3VudCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZUNvdW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgY3VycmVudFBhZ2U6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIodmFsKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IHZhbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcGFnZVNpemU6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIodmFsKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxQYWdlU2l6ZSA9IHZhbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW50ZXJuYWxDdXJyZW50UGFnZShuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgbmV3VmFsID0gcGFyc2VJbnQobmV3VmFsLCAxMCk7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGlzTmFOKG5ld1ZhbCkpIHtcbiAgICAgICAgbmV3VmFsID0gb2xkVmFsIHx8IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdWYWwgPSB0aGlzLmdldFZhbGlkQ3VycmVudFBhZ2UobmV3VmFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5ld1ZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSBuZXdWYWw7XG4gICAgICAgICAgaWYgKG9sZFZhbCAhPT0gbmV3VmFsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6Y3VycmVudFBhZ2UnLCBuZXdWYWwpO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnY3VycmVudC1jaGFuZ2UnLCB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6Y3VycmVudFBhZ2UnLCBuZXdWYWwpO1xuICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWNoYW5nZScsIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGludGVybmFsUGFnZUNvdW50KG5ld1ZhbCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBjb25zdCBvbGRQYWdlID0gdGhpcy5pbnRlcm5hbEN1cnJlbnRQYWdlO1xuICAgICAgaWYgKG5ld1ZhbCA+IDAgJiYgb2xkUGFnZSA9PT0gMCkge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudFBhZ2UgPSAxO1xuICAgICAgfSBlbHNlIGlmIChvbGRQYWdlID4gbmV3VmFsKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxDdXJyZW50UGFnZSA9IG5ld1ZhbCA9PT0gMCA/IDEgOiBuZXdWYWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIl19
