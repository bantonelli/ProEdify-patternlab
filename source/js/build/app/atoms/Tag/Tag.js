define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var tagTemplate = '\n<transition :name="closeTransition ? \'\' : \'el-zoom-in-center\'">\n  <span\n    class="tag"\n    :class="[modifierStyles, {\'is-hit\': hit}]">\n    <slot></slot>\n    <i class="tag__close icon-close"\n      v-if="closable"\n      @click="handleClose"></i>\n  </span>\n</transition>\n';

  exports.default = {
    name: 'Tag',

    template: tagTemplate,

    props: {
      closable: Boolean,
      closeTransition: Boolean,
      hit: Boolean,
      modifierStyles: {
        type: Array,
        default: null
      }
    },
    methods: {
      handleClose: function handleClose(event) {
        this.$emit('close', event);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UYWcvVGFnLmpzIl0sIm5hbWVzIjpbInRhZ1RlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwicHJvcHMiLCJjbG9zYWJsZSIsIkJvb2xlYW4iLCJjbG9zZVRyYW5zaXRpb24iLCJoaXQiLCJtb2RpZmllclN0eWxlcyIsInR5cGUiLCJBcnJheSIsImRlZmF1bHQiLCJtZXRob2RzIiwiaGFuZGxlQ2xvc2UiLCJldmVudCIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFJQSwrU0FBSjs7b0JBYWU7QUFDYkMsVUFBTSxLQURPOztBQUdiQyxjQUFVRixXQUhHOztBQUtiRyxXQUFPO0FBQ0xDLGdCQUFVQyxPQURMO0FBRUxDLHVCQUFpQkQsT0FGWjtBQUdMRSxXQUFLRixPQUhBO0FBSUxHLHNCQUFnQjtBQUNkQyxjQUFNQyxLQURRO0FBRWRDLGlCQUFTO0FBRks7QUFKWCxLQUxNO0FBY2JDLGFBQVM7QUFDUEMsaUJBRE8sdUJBQ0tDLEtBREwsRUFDWTtBQUNqQixhQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsS0FBcEI7QUFDRDtBQUhNO0FBZEksRyIsImZpbGUiOiJhcHAvYXRvbXMvVGFnL1RhZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCB0YWdUZW1wbGF0ZSA9IGBcbjx0cmFuc2l0aW9uIDpuYW1lPVwiY2xvc2VUcmFuc2l0aW9uID8gJycgOiAnZWwtem9vbS1pbi1jZW50ZXInXCI+XG4gIDxzcGFuXG4gICAgY2xhc3M9XCJ0YWdcIlxuICAgIDpjbGFzcz1cIlttb2RpZmllclN0eWxlcywgeydpcy1oaXQnOiBoaXR9XVwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgICA8aSBjbGFzcz1cInRhZ19fY2xvc2UgaWNvbi1jbG9zZVwiXG4gICAgICB2LWlmPVwiY2xvc2FibGVcIlxuICAgICAgQGNsaWNrPVwiaGFuZGxlQ2xvc2VcIj48L2k+XG4gIDwvc3Bhbj5cbjwvdHJhbnNpdGlvbj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ1RhZycsXG5cbiAgdGVtcGxhdGU6IHRhZ1RlbXBsYXRlLFxuXG4gIHByb3BzOiB7XG4gICAgY2xvc2FibGU6IEJvb2xlYW4sXG4gICAgY2xvc2VUcmFuc2l0aW9uOiBCb29sZWFuLFxuICAgIGhpdDogQm9vbGVhbixcbiAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlKGV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjbG9zZScsIGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG5cblxuIl19
