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
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      closeTransition: Boolean,
      color: String,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9UYWcvVGFnLmpzIl0sIm5hbWVzIjpbInRhZ1RlbXBsYXRlIiwibmFtZSIsInRlbXBsYXRlIiwicHJvcHMiLCJ0ZXh0IiwiU3RyaW5nIiwiY2xvc2FibGUiLCJCb29sZWFuIiwidHlwZSIsImhpdCIsImNsb3NlVHJhbnNpdGlvbiIsImNvbG9yIiwibW9kaWZpZXJTdHlsZXMiLCJBcnJheSIsImRlZmF1bHQiLCJtZXRob2RzIiwiaGFuZGxlQ2xvc2UiLCJldmVudCIsIiRlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFJQSwrU0FBSjs7b0JBYWU7QUFDYkMsVUFBTSxLQURPOztBQUdiQyxjQUFVRixXQUhHOztBQUtiRyxXQUFPO0FBQ0xDLFlBQU1DLE1BREQ7QUFFTEMsZ0JBQVVDLE9BRkw7QUFHTEMsWUFBTUgsTUFIRDtBQUlMSSxXQUFLRixPQUpBO0FBS0xHLHVCQUFpQkgsT0FMWjtBQU1MSSxhQUFPTixNQU5GO0FBT0xPLHNCQUFnQjtBQUNkSixjQUFNSyxLQURRO0FBRWRDLGlCQUFTO0FBRks7QUFQWCxLQUxNO0FBaUJiQyxhQUFTO0FBQ1BDLGlCQURPLHVCQUNLQyxLQURMLEVBQ1k7QUFDakIsYUFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0JELEtBQXBCO0FBQ0Q7QUFITTtBQWpCSSxHIiwiZmlsZSI6ImFwcC9hdG9tcy9UYWcvVGFnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHRhZ1RlbXBsYXRlID0gYFxuPHRyYW5zaXRpb24gOm5hbWU9XCJjbG9zZVRyYW5zaXRpb24gPyAnJyA6ICdlbC16b29tLWluLWNlbnRlcidcIj5cbiAgPHNwYW5cbiAgICBjbGFzcz1cInRhZ1wiXG4gICAgOmNsYXNzPVwiW21vZGlmaWVyU3R5bGVzLCB7J2lzLWhpdCc6IGhpdH1dXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICAgIDxpIGNsYXNzPVwidGFnX19jbG9zZSBpY29uLWNsb3NlXCJcbiAgICAgIHYtaWY9XCJjbG9zYWJsZVwiXG4gICAgICBAY2xpY2s9XCJoYW5kbGVDbG9zZVwiPjwvaT5cbiAgPC9zcGFuPlxuPC90cmFuc2l0aW9uPlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnVGFnJyxcblxuICB0ZW1wbGF0ZTogdGFnVGVtcGxhdGUsXG5cbiAgcHJvcHM6IHtcbiAgICB0ZXh0OiBTdHJpbmcsXG4gICAgY2xvc2FibGU6IEJvb2xlYW4sXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGhpdDogQm9vbGVhbixcbiAgICBjbG9zZVRyYW5zaXRpb246IEJvb2xlYW4sXG4gICAgY29sb3I6IFN0cmluZyxcbiAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgdHlwZTogQXJyYXksIFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlKGV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjbG9zZScsIGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG5cblxuIl19
