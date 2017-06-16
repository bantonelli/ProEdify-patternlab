import Pager from './Pager';
import Select from '../../atoms/Select';
// import ElSelect from 'element-ui/packages/select';
// import ElOption from 'element-ui/packages/option';
// import Locale from '../../mixins/locale';

export default {
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
    let template = <div class='el-pagination'></div>;

    // layout is either taken as a prop or is an empty string if not passed in 
    const layout = this.layout || '';
    if (!layout) return;

    // Create map of layout keys to respective markup 
    const TEMPLATE_MAP = {
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } on-change={ this.handleCurrentChange }></pager>,
      next: <next></next>,
      sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
      slot: <my-slot></my-slot>,
      total: <total></total>
    };

    // components = array of strings that correlate to keys in TEMPLATE_MAP 
    const components = layout.split(',').map((item) => item.trim());
    const rightWrapper = <div class="el-pagination__rightwrapper"></div>;
    let haveRightWrapper = false;

    // if (this.small) {
    //   template.data.class += ' el-pagination--small';
    // }

    // Loop through components array 
    components.forEach(compo => {
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
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }]}
            on-click={ this.$parent.prev }>
            <i class="el-icon el-icon-arrow-left"></i>
          </button>
        );
      }
    },

    Next: {
      render(h) {
        return (
          <button
            type="button"
            class={[
              'btn-next',
              { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            ]}
            on-click={ this.$parent.next }>
            <i class="el-icon el-icon-arrow-right"></i>
          </button>
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
            <pe-select
              placeholdertext= { this.$parent.internalPageSize }
              on-input={ this.handleChange }
              options={ this.pageSizes }              
            >
            </pe-select>
        );
      },

      components: {
        'pe-select': Select
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

        handleChange({ target }) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
          this.oldValue = null;
        }
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
        return (
          <span class="el-pagination__jump">
            <input
              class="el-pagination__editor"
              type="number"
              min={ 1 }
              max={ this.internalPageCount }
              value={ this.$parent.internalCurrentPage }
              on-change={ this.handleChange }
              on-focus={ this.handleFocus }
              number/>
          </span>
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
            ? <span class="el-pagination__total">total: { this.$parent.total }</span>
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
