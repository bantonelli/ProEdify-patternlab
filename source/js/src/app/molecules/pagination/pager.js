const pagerTemplate = `
<ul @click="onPagerClick" class="el-pager">
  <li
    :class="{ active: currentPage === 1 }"
    v-if="pageCount > 0"
    class="number">1</li>
  <li
    class="el-icon more btn-quickprev"
    :class="[quickprevIconClass]"
    v-if="showPrevMore"
    @mouseenter="quickprevIconClass = 'el-icon-d-arrow-left'"
    @mouseleave="quickprevIconClass = 'el-icon-more'">
  </li>
  <li
    v-for="pager in pagers"
    :class="{ active: currentPage === pager }"
    class="number">{{ pager }}</li>
  <li
    class="el-icon more btn-quicknext"
    :class="[quicknextIconClass]"
    v-if="showNextMore"
    @mouseenter="quicknextIconClass = 'el-icon-d-arrow-right'"
    @mouseleave="quicknextIconClass = 'el-icon-more'">
  </li>
  <li
    :class="{ active: currentPage === pageCount }"
    class="number"
    v-if="pageCount > 1">{{ pageCount }}</li>
</ul>
`;


export default {
  template: pagerTemplate,
  name: 'ElPager',
  props: {
    currentPage: Number,

    pageCount: Number
  },

  watch: {
    showPrevMore(val) {
      if (!val) this.quickprevIconClass = 'el-icon-more';
    },

    showNextMore(val) {
      if (!val) this.quicknextIconClass = 'el-icon-more';
    }
  },

  methods: {
    onPagerClick(event) {
      // Method gets the desired newPage number via @click 
      // If you click the .more arrows newPage will be 5 more or less  
      // otherwise the page change logic will be handled by parent  
      // via @change event.    
      const target = event.target;
      if (target.tagName === 'UL') {
        return;
      }

      // Grab the <li> number that was clicked 
      let newPage = Number(event.target.textContent);
      const pageCount = this.pageCount;
      const currentPage = this.currentPage;
 
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
    pagers() {
      const pagerCount = 7;

      const currentPage = Number(this.currentPage);
      const pageCount = Number(this.pageCount);

      let showPrevMore = false;
      let showNextMore = false;

      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - 2) {
          showPrevMore = true;
        }

        if (currentPage < pageCount - 2) {
          showNextMore = true;
        }
      }

      const array = [];

      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }

      this.showPrevMore = showPrevMore;
      this.showNextMore = showNextMore;

      return array;
    }
  },

  data() {
    return {
      current: null,
      showPrevMore: false,
      showNextMore: false,
      quicknextIconClass: 'el-icon-more',
      quickprevIconClass: 'el-icon-more'
    };
  }
};