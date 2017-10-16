define(['exports', '../../utils/vue-popper', '../../utils/mixins/emitter'], function (exports, _vuePopper, _emitter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vuePopper2 = _interopRequireDefault(_vuePopper);

  var _emitter2 = _interopRequireDefault(_emitter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // This whole component is simply an implementation of the vue-popper mixin 

  var autocompleteSuggestionsTemplate = '\n<div\n  v-show="showPopper"\n  class="autocomplete-suggestions"\n  :class="{ \'is-loading\': parent.loading }"\n  :style="{ width: dropdownWidth }"\n>      \n    <ul class="autocomplete-suggestions__wrapper">\n      <template v-if="parent.loading">\n        <li><i class="icon-loading"></i></li>\n      </template>          \n      <template v-else v-for="(item, index) in suggestions">\n          <li\n            v-if="!parent.customItem"\n            class="autocomplete-suggestions__item"\n            @click="select(item)"\n          >\n            {{item[props.label]}}\n          </li>\n          <component\n            v-else\n            :class="{\'highlighted\': parent.highlightedIndex === index}"\n            @click="select(item)"\n            :is="parent.customItem"\n            :item="item"\n            :index="index">\n          </component>          \n      </template>\n    </ul>\n</div>\n';

  // import ElScrollbar from '../scrollbar';

  // Example CustomItem
  // const customTemplate = `
  //   <div>
  //     <span>{{ item.value }}</span>
  //     <span>{{ item.link }}</span>
  //   </div>
  // `;

  // const customComponent = {
  //   props: ['item', 'index'],
  //   template: customTemplate
  // }

  exports.default = {
    // components: { ElScrollbar },
    // components: {
    //   'item-link': customComponent
    // },
    mixins: [_vuePopper2.default, _emitter2.default],

    name: 'AutocompleteSuggestions',

    template: autocompleteSuggestionsTemplate,

    componentName: 'AutocompleteSuggestions',

    data: function data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },


    props: {
      props: Object,
      suggestions: Array,
      options: {
        default: function _default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    methods: {
      select: function select(item) {
        this.dispatch('Autocomplete', 'item-click', item);
      }
    },

    updated: function updated() {
      var _this = this;

      this.$nextTick(function (_) {
        _this.updatePopper();
      });
    },
    mounted: function mounted() {
      this.popperElm = this.$el;
      // this.referenceElm = this.$parent.$refs.inputField.$refs.inputComponent.$refs.input.$el;
      this.referenceElm = this.$parent.$refs.inputField.$refs.inputComponent.$el;
    },
    created: function created() {
      var _this2 = this;

      this.$on('visible', function (val, inputWidth) {
        // console.log("AUTOCOMPLETE SUGGEST: CALLED 'visible' HANDLER, VALUE: ", val, inputWidth);        
        _this2.dropdownWidth = inputWidth + 'px';
        _this2.showPopper = val;
      });
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zLmpzIl0sIm5hbWVzIjpbImF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zVGVtcGxhdGUiLCJtaXhpbnMiLCJuYW1lIiwidGVtcGxhdGUiLCJjb21wb25lbnROYW1lIiwiZGF0YSIsInBhcmVudCIsIiRwYXJlbnQiLCJkcm9wZG93bldpZHRoIiwicHJvcHMiLCJPYmplY3QiLCJzdWdnZXN0aW9ucyIsIkFycmF5Iiwib3B0aW9ucyIsImRlZmF1bHQiLCJmb3JjZUFic29sdXRlIiwiZ3B1QWNjZWxlcmF0aW9uIiwibWV0aG9kcyIsInNlbGVjdCIsIml0ZW0iLCJkaXNwYXRjaCIsInVwZGF0ZWQiLCIkbmV4dFRpY2siLCJ1cGRhdGVQb3BwZXIiLCJtb3VudGVkIiwicG9wcGVyRWxtIiwiJGVsIiwicmVmZXJlbmNlRWxtIiwiJHJlZnMiLCJpbnB1dEZpZWxkIiwiaW5wdXRDb21wb25lbnQiLCJjcmVhdGVkIiwiJG9uIiwidmFsIiwiaW5wdXRXaWR0aCIsInNob3dQb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBRUEsTUFBSUEsbzdCQUFKOztBQWdDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7b0JBRWU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxZQUFRLHdDQUxLOztBQU9iQyxVQUFNLHlCQVBPOztBQVNiQyxjQUFVSCwrQkFURzs7QUFXYkksbUJBQWUseUJBWEY7O0FBYWJDLFFBYmEsa0JBYU47QUFDTCxhQUFPO0FBQ0xDLGdCQUFRLEtBQUtDLE9BRFI7QUFFTEMsdUJBQWU7QUFGVixPQUFQO0FBSUQsS0FsQlk7OztBQW9CYkMsV0FBTztBQUNMQSxhQUFPQyxNQURGO0FBRUxDLG1CQUFhQyxLQUZSO0FBR0xDLGVBQVM7QUFDUEMsZUFETyxzQkFDRztBQUNSLGlCQUFPO0FBQ0xDLDJCQUFlLElBRFY7QUFFTEMsNkJBQWlCO0FBRlosV0FBUDtBQUlEO0FBTk07QUFISixLQXBCTTs7QUFpQ2JDLGFBQVM7QUFDUEMsWUFETyxrQkFDQUMsSUFEQSxFQUNNO0FBQ1gsYUFBS0MsUUFBTCxDQUFjLGNBQWQsRUFBOEIsWUFBOUIsRUFBNENELElBQTVDO0FBQ0Q7QUFITSxLQWpDSTs7QUF1Q2JFLFdBdkNhLHFCQXVDSDtBQUFBOztBQUNSLFdBQUtDLFNBQUwsQ0FBZSxhQUFLO0FBQ2xCLGNBQUtDLFlBQUw7QUFDRCxPQUZEO0FBR0QsS0EzQ1k7QUE2Q2JDLFdBN0NhLHFCQTZDSDtBQUNSLFdBQUtDLFNBQUwsR0FBaUIsS0FBS0MsR0FBdEI7QUFDQTtBQUNBLFdBQUtDLFlBQUwsR0FBb0IsS0FBS3BCLE9BQUwsQ0FBYXFCLEtBQWIsQ0FBbUJDLFVBQW5CLENBQThCRCxLQUE5QixDQUFvQ0UsY0FBcEMsQ0FBbURKLEdBQXZFO0FBQ0QsS0FqRFk7QUFtRGJLLFdBbkRhLHFCQW1ESDtBQUFBOztBQUNSLFdBQUtDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLFVBQUNDLEdBQUQsRUFBTUMsVUFBTixFQUFxQjtBQUN2QztBQUNBLGVBQUsxQixhQUFMLEdBQXFCMEIsYUFBYSxJQUFsQztBQUNBLGVBQUtDLFVBQUwsR0FBa0JGLEdBQWxCO0FBQ0QsT0FKRDtBQUtEO0FBekRZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9BdXRvY29tcGxldGUvQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9wcGVyIGZyb20gJy4uLy4uL3V0aWxzL3Z1ZS1wb3BwZXInO1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG4vLyBUaGlzIHdob2xlIGNvbXBvbmVudCBpcyBzaW1wbHkgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIHZ1ZS1wb3BwZXIgbWl4aW4gXG5cbmxldCBhdXRvY29tcGxldGVTdWdnZXN0aW9uc1RlbXBsYXRlID0gYFxuPGRpdlxuICB2LXNob3c9XCJzaG93UG9wcGVyXCJcbiAgY2xhc3M9XCJhdXRvY29tcGxldGUtc3VnZ2VzdGlvbnNcIlxuICA6Y2xhc3M9XCJ7ICdpcy1sb2FkaW5nJzogcGFyZW50LmxvYWRpbmcgfVwiXG4gIDpzdHlsZT1cInsgd2lkdGg6IGRyb3Bkb3duV2lkdGggfVwiXG4+ICAgICAgXG4gICAgPHVsIGNsYXNzPVwiYXV0b2NvbXBsZXRlLXN1Z2dlc3Rpb25zX193cmFwcGVyXCI+XG4gICAgICA8dGVtcGxhdGUgdi1pZj1cInBhcmVudC5sb2FkaW5nXCI+XG4gICAgICAgIDxsaT48aSBjbGFzcz1cImljb24tbG9hZGluZ1wiPjwvaT48L2xpPlxuICAgICAgPC90ZW1wbGF0ZT4gICAgICAgICAgXG4gICAgICA8dGVtcGxhdGUgdi1lbHNlIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBzdWdnZXN0aW9uc1wiPlxuICAgICAgICAgIDxsaVxuICAgICAgICAgICAgdi1pZj1cIiFwYXJlbnQuY3VzdG9tSXRlbVwiXG4gICAgICAgICAgICBjbGFzcz1cImF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uc19faXRlbVwiXG4gICAgICAgICAgICBAY2xpY2s9XCJzZWxlY3QoaXRlbSlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7aXRlbVtwcm9wcy5sYWJlbF19fVxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGNvbXBvbmVudFxuICAgICAgICAgICAgdi1lbHNlXG4gICAgICAgICAgICA6Y2xhc3M9XCJ7J2hpZ2hsaWdodGVkJzogcGFyZW50LmhpZ2hsaWdodGVkSW5kZXggPT09IGluZGV4fVwiXG4gICAgICAgICAgICBAY2xpY2s9XCJzZWxlY3QoaXRlbSlcIlxuICAgICAgICAgICAgOmlzPVwicGFyZW50LmN1c3RvbUl0ZW1cIlxuICAgICAgICAgICAgOml0ZW09XCJpdGVtXCJcbiAgICAgICAgICAgIDppbmRleD1cImluZGV4XCI+XG4gICAgICAgICAgPC9jb21wb25lbnQ+ICAgICAgICAgIFxuICAgICAgPC90ZW1wbGF0ZT5cbiAgICA8L3VsPlxuPC9kaXY+XG5gO1xuXG4vLyBpbXBvcnQgRWxTY3JvbGxiYXIgZnJvbSAnLi4vc2Nyb2xsYmFyJztcblxuLy8gRXhhbXBsZSBDdXN0b21JdGVtXG4vLyBjb25zdCBjdXN0b21UZW1wbGF0ZSA9IGBcbi8vICAgPGRpdj5cbi8vICAgICA8c3Bhbj57eyBpdGVtLnZhbHVlIH19PC9zcGFuPlxuLy8gICAgIDxzcGFuPnt7IGl0ZW0ubGluayB9fTwvc3Bhbj5cbi8vICAgPC9kaXY+XG4vLyBgO1xuXG4vLyBjb25zdCBjdXN0b21Db21wb25lbnQgPSB7XG4vLyAgIHByb3BzOiBbJ2l0ZW0nLCAnaW5kZXgnXSxcbi8vICAgdGVtcGxhdGU6IGN1c3RvbVRlbXBsYXRlXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gY29tcG9uZW50czogeyBFbFNjcm9sbGJhciB9LFxuICAvLyBjb21wb25lbnRzOiB7XG4gIC8vICAgJ2l0ZW0tbGluayc6IGN1c3RvbUNvbXBvbmVudFxuICAvLyB9LFxuICBtaXhpbnM6IFtQb3BwZXIsIEVtaXR0ZXJdLFxuXG4gIG5hbWU6ICdBdXRvY29tcGxldGVTdWdnZXN0aW9ucycsXG5cbiAgdGVtcGxhdGU6IGF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zVGVtcGxhdGUsXG5cbiAgY29tcG9uZW50TmFtZTogJ0F1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zJyxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwYXJlbnQ6IHRoaXMuJHBhcmVudCxcbiAgICAgIGRyb3Bkb3duV2lkdGg6ICcnXG4gICAgfTtcbiAgfSxcblxuICBwcm9wczoge1xuICAgIHByb3BzOiBPYmplY3QsXG4gICAgc3VnZ2VzdGlvbnM6IEFycmF5LFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZm9yY2VBYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgICBncHVBY2NlbGVyYXRpb246IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBzZWxlY3QoaXRlbSkge1xuICAgICAgdGhpcy5kaXNwYXRjaCgnQXV0b2NvbXBsZXRlJywgJ2l0ZW0tY2xpY2snLCBpdGVtKTtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlZCgpIHtcbiAgICB0aGlzLiRuZXh0VGljayhfID0+IHtcbiAgICAgIHRoaXMudXBkYXRlUG9wcGVyKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnBvcHBlckVsbSA9IHRoaXMuJGVsO1xuICAgIC8vIHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy4kcGFyZW50LiRyZWZzLmlucHV0RmllbGQuJHJlZnMuaW5wdXRDb21wb25lbnQuJHJlZnMuaW5wdXQuJGVsO1xuICAgIHRoaXMucmVmZXJlbmNlRWxtID0gdGhpcy4kcGFyZW50LiRyZWZzLmlucHV0RmllbGQuJHJlZnMuaW5wdXRDb21wb25lbnQuJGVsO1xuICB9LFxuXG4gIGNyZWF0ZWQoKSB7XG4gICAgdGhpcy4kb24oJ3Zpc2libGUnLCAodmFsLCBpbnB1dFdpZHRoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkFVVE9DT01QTEVURSBTVUdHRVNUOiBDQUxMRUQgJ3Zpc2libGUnIEhBTkRMRVIsIFZBTFVFOiBcIiwgdmFsLCBpbnB1dFdpZHRoKTsgICAgICAgIFxuICAgICAgdGhpcy5kcm9wZG93bldpZHRoID0gaW5wdXRXaWR0aCArICdweCc7XG4gICAgICB0aGlzLnNob3dQb3BwZXIgPSB2YWw7XG4gICAgfSk7XG4gIH1cbn07XG5cbiJdfQ==
