const pagerTemplate = `
<ul @click="onPagerClick" class="pager" :class="modifierStyles">
  <li
    :class="{ active: currentPage === 1 }"
    v-if="pageCount > 0"
    class="circle-button">
    <span class="circle-button__text">1</span>
  </li>
  <li
    class="circle-button more quickprev"    
    v-if="showPrevMore"
    @mouseenter="quickprevIconClass = 'fa-icon-angle-double-left'"
    @mouseleave="quickprevIconClass = 'fa-icon-ellipsis-h'">
    <span class="circle-button__text" :class="[quickprevIconClass]"></span>
  </li>
  <li
    v-for="pager in pagers"
    :class="{ active: currentPage === pager }"
    class="circle-button">
    <span class="circle-button__text">{{ pager }}</span>
  </li>
  <li
    class="circle-button more quicknext"
    v-if="showNextMore"
    @mouseenter="quicknextIconClass = 'fa-icon-angle-double-right'"
    @mouseleave="quicknextIconClass = 'fa-icon-ellipsis-h'">
    <span class="circle-button__text" :class="[quicknextIconClass]"></span>
  </li>
  <li
    :class="{ active: currentPage === pageCount }"
    class="circle-button"
    v-if="pageCount > 1">
    <span class="circle-button__text">{{ pageCount }}</span>
    </li>
</ul>
`;


export default {
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
    showPrevMore(val) {
      if (!val) this.quickprevIconClass = 'fa-icon-angle-double-left';
    },

    showNextMore(val) {
      if (!val) this.quicknextIconClass = 'fa-icon-angle-double-right';
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
      const lastPageInSet = this.pagers[this.pagers.length - 1];
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
    pagers() {
      const pagerCount = 4;

      const currentPage = Number(this.currentPage);
      const totalPages = Number(this.pageCount);

      let showPrevMore = false;
      let showNextMore = false;

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

      const array = [];

      if (showPrevMore && !showNextMore) {
        const startPage = totalPages - (pagerCount - 2);
        for (let i = startPage; i < totalPages; i++) {
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
        for (let i = 2; i < totalPages; i++) {
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
      quicknextIconClass: 'fa-icon-ellipsis-h',
      quickprevIconClass: 'fa-icon-ellipsis-h'
    };
  }
};
