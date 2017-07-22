<style lang="scss">
.pagination {
    /* display: table; */
    position: relative;
    white-space: normal;
    width: 100%;
    height: 100px;
    padding: 20px 0 20px 0;
    border-top: solid 2px #838383;
    border-bottom: solid 2px #838383;

    &__wrapper {
        /* display: table-row; */
        width: 100%;
        text-align: center;
        position: absolute;
        // Z-index puts the pagination above the rest of the page
        z-index: 1000;
        height: 60px;
    }

    &__sizes, &__jump, &__total, &__next, &__prev, .pager {
        display: inline-block;
        position: absolute;                  
    }

    &__wrapper, &__next, &__prev, .pager {
        top: 50%;
        transform: translateY(-50%);
    }

    &__sizes, &__jump {
        bottom: 50%;
        transform: translateY(50%);
    }

    &__next, &__prev {
        vertical-align: middle;
        z-index: 5;
        height: inherit;

        .circle-button {
          margin: 2px 0 0 0;
        }
    }

    &__sizes {
       min-width: 15%;
       left: 10%;
       z-index: 4;

       .select__border {
          border: none;          
       }

       .select__options .select__option {
          > div {
            width: 0%;
            transition: .15s all ease-in-out;
            transition-delay: 0.05s;
          }

          &:hover {
            > div {
                width: 80%;
            }
          }          
       }

       .select__placeholder {
          padding: 0.625rem 0.625rem 0.625rem 0.125rem;
       }

       .select__options .select__option {
          padding: 0.575rem 0.625rem 0.175rem 0.125rem;
       }      
    }

    &__prev {
      left: 0;
    }

    .pager {
        left: 0%;
        right: 0%;
        width: 100%;
        z-index: 3;
    }

    &__next {
      right: 0;      
    }    

    &__jump {
        vertical-align: middle;
        min-width: 100px;
        margin-bottom: -2px;
        right: 150px;
        z-index: 4;

        .input-number__decrease {
            left: 40%;
        }

        .input-number__decrease {
            right: 40%;
        }

        .input__input {
            text-align: center;
            bottom: 0;
        }

        .input__border {
          border: none;
        }
    }


    &__total {
        font-family: "cabinbold";
        color: #b6b6b6;
        right: 50px;
        width: 10%;
        // color: #3fc7a6;
    }
}


</style>

<script>
import Pager from './Pager';
import Select from '../../atoms/Select';
import InputNumber from '../../atoms/InputNumber.vue';
// import ElSelect from 'element-ui/packages/select';
// import ElOption from 'element-ui/packages/option';
// import Locale from '../../mixins/locale';

export default {
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
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    }
  },

  data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0
    };
  },

  render(h) {
    // make master template 
    let template = <div class='pagination'></div>;

    // layout is either taken as a prop or is an empty string if not passed in 
    const layout = this.layout || '';
    if (!layout) return;

    // Create map of layout keys to respective markup 
    const TEMPLATE_MAP = {
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager modifier-styles={["pager_size-small"]} currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } on-change={ this.handleCurrentChange }></pager>,
      next: <next></next>,
      sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
      slot: <my-slot></my-slot>,
      total: <total></total>
    };

    // components = array of strings that correlate to keys in TEMPLATE_MAP 
    const components = layout.split(',').map((item) => item.trim());
    const wrapper = <div class="pagination__wrapper"></div>;
    let haveWrapper = false;

    // if (this.small) {
    //   template.data.class += ' el-pagination--small';
    // }

    // Loop through components array 
    components.forEach(compo => {
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
      render(h) {
        return (
          this.$parent.$slots.default
          ? this.$parent.$slots.default[0]
          : ''
        );
      }
    },
    Prev: {
      render(h) {
        return (
          <div class="pagination__prev">
            <button
              type="button"
              class={['circle-button', { 'is-disabled': this.$parent.internalCurrentPage <= 1 }]}
              on-click={ this.$parent.prev }>
              <span class="circle-button__text icon-arrow-left"></span>
            </button>
          </div>
        );
      }
    },

    Next: {
      render(h) {
        return (
          <div class="pagination__next">
            <button
              type="button"
              class={[
                // 'circle-button circle-button_size-small',
                'circle-button',
                { 'is-disabled': this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
              ]}
              on-click={ this.$parent.next }>
              <span class="circle-button__text icon-arrow-right"></span>
            </button>
          </div>
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
          handler(value) {
            if (Array.isArray(value)) {
              this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1
                ? this.$parent.pageSize
                : this.pageSizes[0];
            }
          }
        }
      },

      render(h) {
        return (
          <div class="pagination__sizes">
            <select-component
              placeholdertext= { this.$parent.internalPageSize }
              on-input={ this.handleChange }
              options={ this.pageSizes }              
            >
            </select-component>
          </div>
        );
      },

      components: {
        'select-component': Select
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.$emit('size-change', val);
          }
        }
      }
    },

    // Done Refactoring 
    Jumper: {
      // mixins: [Locale],

      data() {
        return {
          oldValue: null
        };
      },

      methods: {
        handleFocus(event) {
          this.oldValue = event.target.value;
        },

        // handleChange({ target }) {
        //   this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
        //   this.oldValue = null;
        // }
        handleChange(value) {
            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
            this.oldValue = null;
        }
      },

      components: {
        'input-number': InputNumber
      },

      render(h) {
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
        return (
            <div class="pagination__jump">
              <input-number
                min={ 1 }
                max={ this.$parent.internalPageCount }
                value={ this.$parent.internalCurrentPage }
                on-change={ this.handleChange }
                on-focus={ this.handleFocus }
              >
              </input-number>
            </div>
        );
      }
    },

    // Done Refactoring 
    Total: {
      // mixins: [Locale],

      render(h) {
        // return (
        //   typeof this.$parent.total === 'number'
        //     ? <span class="el-pagination__total">{ this.t('el.pagination.total', { total: this.$parent.total }) }</span>
        //     : ''
        // );
        return (
          typeof this.$parent.total === 'number'
            ? <span class="pagination__total">total: { this.$parent.total }</span>
            : ''
        );
      }
    },

    Pager
  },

  methods: {
    handleCurrentChange(val) {
      // Method to handle the @change sent by pager 
      this.internalCurrentPage = this.getValidCurrentPage(val);
    },

    prev() {
      const newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
    },

    next() {
      const newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
    },

    getValidCurrentPage(value) {
      // Method to validate page number 

      // Value is value of newPage 
      value = parseInt(value, 10);

      // havePageCount = true if internalPageCount is a number 
      const havePageCount = typeof this.internalPageCount === 'number';

      let resetValue;
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
    internalPageCount() {
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
      handler(val) {
        this.internalCurrentPage = val;
      }
    },

    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = val;
      }
    },

    internalCurrentPage(newVal, oldVal) {
      newVal = parseInt(newVal, 10);

      /* istanbul ignore if */
      if (isNaN(newVal)) {
        newVal = oldVal || 1;
      } else {
        newVal = this.getValidCurrentPage(newVal);
      }

      if (newVal !== undefined) {
        this.$nextTick(() => {
          this.internalCurrentPage = newVal;
          if (oldVal !== newVal) {
            this.$emit('update:currentPage', newVal);
            this.$emit('current-change', this.internalCurrentPage);
          }
        });
      } else {
        this.$emit('update:currentPage', newVal);
        this.$emit('current-change', this.internalCurrentPage);
      }
    },

    internalPageCount(newVal) {
      /* istanbul ignore if */
      const oldPage = this.internalCurrentPage;
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1;
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal;
      }
    }
  }
};
</script>
