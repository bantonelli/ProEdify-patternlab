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

  var autocompleteSuggestionsTemplate = '\n<!--<transition name="el-zoom-in-top" @after-leave="doDestroy">-->\n<!-- This whole component is simply an implementation of the vue-popper mixin --> \n  <div\n    v-show="showPopper"\n    class="autocomplete-suggestions"\n    :class="{ \'is-loading\': parent.loading }"\n    :style="{ width: dropdownWidth }"\n  >\n    <!--<el-scrollbar\n      tag="ul"\n      wrap-class="el-autocomplete-suggestion__wrap"\n      view-class="el-autocomplete-suggestion__list"\n    >-->        \n      <ul class="autocomplete-suggestions__wrapper">\n        <template v-if="parent.loading">\n          <li><i class="icon-loading"></i></li>\n        </template>          \n        <template v-else v-for="(item, index) in suggestions">\n            <li\n              v-if="!parent.customItem"\n              class="autocomplete-suggestions__item"\n              @click="select(item)"\n            >\n              {{item[props.label]}}\n            </li>\n            <component\n              v-else\n              :class="{\'highlighted\': parent.highlightedIndex === index}"\n              @click="select(item)"\n              :is="parent.customItem"\n              :item="item"\n              :index="index">\n            </component>          \n        </template>\n      </ul>\n    <!--</el-scrollbar>-->\n  </div>\n<!--</transition>-->\n';

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
        console.log("AUTOCOMPLETE SUGGEST: CALLED 'visible' HANDLER, VALUE: ", val, inputWidth);
        _this2.dropdownWidth = inputWidth + 'px';
        _this2.showPopper = val;
      });
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvQXV0b2NvbXBsZXRlL0F1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zLmpzIl0sIm5hbWVzIjpbImF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zVGVtcGxhdGUiLCJtaXhpbnMiLCJuYW1lIiwidGVtcGxhdGUiLCJjb21wb25lbnROYW1lIiwiZGF0YSIsInBhcmVudCIsIiRwYXJlbnQiLCJkcm9wZG93bldpZHRoIiwicHJvcHMiLCJPYmplY3QiLCJzdWdnZXN0aW9ucyIsIkFycmF5Iiwib3B0aW9ucyIsImRlZmF1bHQiLCJmb3JjZUFic29sdXRlIiwiZ3B1QWNjZWxlcmF0aW9uIiwibWV0aG9kcyIsInNlbGVjdCIsIml0ZW0iLCJkaXNwYXRjaCIsInVwZGF0ZWQiLCIkbmV4dFRpY2siLCJ1cGRhdGVQb3BwZXIiLCJtb3VudGVkIiwicG9wcGVyRWxtIiwiJGVsIiwicmVmZXJlbmNlRWxtIiwiJHJlZnMiLCJpbnB1dEZpZWxkIiwiaW5wdXRDb21wb25lbnQiLCJjcmVhdGVkIiwiJG9uIiwidmFsIiwiaW5wdXRXaWR0aCIsImNvbnNvbGUiLCJsb2ciLCJzaG93UG9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQUlBLHExQ0FBSjs7QUF5Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O29CQUVlO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsWUFBUSx3Q0FMSzs7QUFPYkMsVUFBTSx5QkFQTzs7QUFTYkMsY0FBVUgsK0JBVEc7O0FBV2JJLG1CQUFlLHlCQVhGOztBQWFiQyxRQWJhLGtCQWFOO0FBQ0wsYUFBTztBQUNMQyxnQkFBUSxLQUFLQyxPQURSO0FBRUxDLHVCQUFlO0FBRlYsT0FBUDtBQUlELEtBbEJZOzs7QUFvQmJDLFdBQU87QUFDTEEsYUFBT0MsTUFERjtBQUVMQyxtQkFBYUMsS0FGUjtBQUdMQyxlQUFTO0FBQ1BDLGVBRE8sc0JBQ0c7QUFDUixpQkFBTztBQUNMQywyQkFBZSxJQURWO0FBRUxDLDZCQUFpQjtBQUZaLFdBQVA7QUFJRDtBQU5NO0FBSEosS0FwQk07O0FBaUNiQyxhQUFTO0FBQ1BDLFlBRE8sa0JBQ0FDLElBREEsRUFDTTtBQUNYLGFBQUtDLFFBQUwsQ0FBYyxjQUFkLEVBQThCLFlBQTlCLEVBQTRDRCxJQUE1QztBQUNEO0FBSE0sS0FqQ0k7O0FBdUNiRSxXQXZDYSxxQkF1Q0g7QUFBQTs7QUFDUixXQUFLQyxTQUFMLENBQWUsYUFBSztBQUNsQixjQUFLQyxZQUFMO0FBQ0QsT0FGRDtBQUdELEtBM0NZO0FBNkNiQyxXQTdDYSxxQkE2Q0g7QUFDUixXQUFLQyxTQUFMLEdBQWlCLEtBQUtDLEdBQXRCO0FBQ0E7QUFDQSxXQUFLQyxZQUFMLEdBQW9CLEtBQUtwQixPQUFMLENBQWFxQixLQUFiLENBQW1CQyxVQUFuQixDQUE4QkQsS0FBOUIsQ0FBb0NFLGNBQXBDLENBQW1ESixHQUF2RTtBQUNELEtBakRZO0FBbURiSyxXQW5EYSxxQkFtREg7QUFBQTs7QUFDUixXQUFLQyxHQUFMLENBQVMsU0FBVCxFQUFvQixVQUFDQyxHQUFELEVBQU1DLFVBQU4sRUFBcUI7QUFDdkNDLGdCQUFRQyxHQUFSLENBQVkseURBQVosRUFBdUVILEdBQXZFLEVBQTRFQyxVQUE1RTtBQUNBLGVBQUsxQixhQUFMLEdBQXFCMEIsYUFBYSxJQUFsQztBQUNBLGVBQUtHLFVBQUwsR0FBa0JKLEdBQWxCO0FBQ0QsT0FKRDtBQUtEO0FBekRZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9BdXRvY29tcGxldGUvQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9wcGVyIGZyb20gJy4uLy4uL3V0aWxzL3Z1ZS1wb3BwZXInO1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNUZW1wbGF0ZSA9IGBcbjwhLS08dHJhbnNpdGlvbiBuYW1lPVwiZWwtem9vbS1pbi10b3BcIiBAYWZ0ZXItbGVhdmU9XCJkb0Rlc3Ryb3lcIj4tLT5cbjwhLS0gVGhpcyB3aG9sZSBjb21wb25lbnQgaXMgc2ltcGx5IGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSB2dWUtcG9wcGVyIG1peGluIC0tPiBcbiAgPGRpdlxuICAgIHYtc2hvdz1cInNob3dQb3BwZXJcIlxuICAgIGNsYXNzPVwiYXV0b2NvbXBsZXRlLXN1Z2dlc3Rpb25zXCJcbiAgICA6Y2xhc3M9XCJ7ICdpcy1sb2FkaW5nJzogcGFyZW50LmxvYWRpbmcgfVwiXG4gICAgOnN0eWxlPVwieyB3aWR0aDogZHJvcGRvd25XaWR0aCB9XCJcbiAgPlxuICAgIDwhLS08ZWwtc2Nyb2xsYmFyXG4gICAgICB0YWc9XCJ1bFwiXG4gICAgICB3cmFwLWNsYXNzPVwiZWwtYXV0b2NvbXBsZXRlLXN1Z2dlc3Rpb25fX3dyYXBcIlxuICAgICAgdmlldy1jbGFzcz1cImVsLWF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uX19saXN0XCJcbiAgICA+LS0+ICAgICAgICBcbiAgICAgIDx1bCBjbGFzcz1cImF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uc19fd3JhcHBlclwiPlxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInBhcmVudC5sb2FkaW5nXCI+XG4gICAgICAgICAgPGxpPjxpIGNsYXNzPVwiaWNvbi1sb2FkaW5nXCI+PC9pPjwvbGk+XG4gICAgICAgIDwvdGVtcGxhdGU+ICAgICAgICAgIFxuICAgICAgICA8dGVtcGxhdGUgdi1lbHNlIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBzdWdnZXN0aW9uc1wiPlxuICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgIHYtaWY9XCIhcGFyZW50LmN1c3RvbUl0ZW1cIlxuICAgICAgICAgICAgICBjbGFzcz1cImF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uc19faXRlbVwiXG4gICAgICAgICAgICAgIEBjbGljaz1cInNlbGVjdChpdGVtKVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt7aXRlbVtwcm9wcy5sYWJlbF19fVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxjb21wb25lbnRcbiAgICAgICAgICAgICAgdi1lbHNlXG4gICAgICAgICAgICAgIDpjbGFzcz1cInsnaGlnaGxpZ2h0ZWQnOiBwYXJlbnQuaGlnaGxpZ2h0ZWRJbmRleCA9PT0gaW5kZXh9XCJcbiAgICAgICAgICAgICAgQGNsaWNrPVwic2VsZWN0KGl0ZW0pXCJcbiAgICAgICAgICAgICAgOmlzPVwicGFyZW50LmN1c3RvbUl0ZW1cIlxuICAgICAgICAgICAgICA6aXRlbT1cIml0ZW1cIlxuICAgICAgICAgICAgICA6aW5kZXg9XCJpbmRleFwiPlxuICAgICAgICAgICAgPC9jb21wb25lbnQ+ICAgICAgICAgIFxuICAgICAgICA8L3RlbXBsYXRlPlxuICAgICAgPC91bD5cbiAgICA8IS0tPC9lbC1zY3JvbGxiYXI+LS0+XG4gIDwvZGl2PlxuPCEtLTwvdHJhbnNpdGlvbj4tLT5cbmA7XG5cbi8vIGltcG9ydCBFbFNjcm9sbGJhciBmcm9tICcuLi9zY3JvbGxiYXInO1xuXG4vLyBFeGFtcGxlIEN1c3RvbUl0ZW1cbi8vIGNvbnN0IGN1c3RvbVRlbXBsYXRlID0gYFxuLy8gICA8ZGl2PlxuLy8gICAgIDxzcGFuPnt7IGl0ZW0udmFsdWUgfX08L3NwYW4+XG4vLyAgICAgPHNwYW4+e3sgaXRlbS5saW5rIH19PC9zcGFuPlxuLy8gICA8L2Rpdj5cbi8vIGA7XG5cbi8vIGNvbnN0IGN1c3RvbUNvbXBvbmVudCA9IHtcbi8vICAgcHJvcHM6IFsnaXRlbScsICdpbmRleCddLFxuLy8gICB0ZW1wbGF0ZTogY3VzdG9tVGVtcGxhdGVcbi8vIH1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBjb21wb25lbnRzOiB7IEVsU2Nyb2xsYmFyIH0sXG4gIC8vIGNvbXBvbmVudHM6IHtcbiAgLy8gICAnaXRlbS1saW5rJzogY3VzdG9tQ29tcG9uZW50XG4gIC8vIH0sXG4gIG1peGluczogW1BvcHBlciwgRW1pdHRlcl0sXG5cbiAgbmFtZTogJ0F1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zJyxcblxuICB0ZW1wbGF0ZTogYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNUZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnQXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnMnLFxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmVudDogdGhpcy4kcGFyZW50LFxuICAgICAgZHJvcGRvd25XaWR0aDogJydcbiAgICB9O1xuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgcHJvcHM6IE9iamVjdCxcbiAgICBzdWdnZXN0aW9uczogQXJyYXksXG4gICAgb3B0aW9uczoge1xuICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmb3JjZUFic29sdXRlOiB0cnVlLFxuICAgICAgICAgIGdwdUFjY2VsZXJhdGlvbjogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHNlbGVjdChpdGVtKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoKCdBdXRvY29tcGxldGUnLCAnaXRlbS1jbGljaycsIGl0ZW0pO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIHRoaXMuJG5leHRUaWNrKF8gPT4ge1xuICAgICAgdGhpcy51cGRhdGVQb3BwZXIoKTtcbiAgICB9KTtcbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMucG9wcGVyRWxtID0gdGhpcy4kZWw7XG4gICAgLy8gdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRwYXJlbnQuJHJlZnMuaW5wdXRGaWVsZC4kcmVmcy5pbnB1dENvbXBvbmVudC4kcmVmcy5pbnB1dC4kZWw7XG4gICAgdGhpcy5yZWZlcmVuY2VFbG0gPSB0aGlzLiRwYXJlbnQuJHJlZnMuaW5wdXRGaWVsZC4kcmVmcy5pbnB1dENvbXBvbmVudC4kZWw7XG4gIH0sXG5cbiAgY3JlYXRlZCgpIHtcbiAgICB0aGlzLiRvbigndmlzaWJsZScsICh2YWwsIGlucHV0V2lkdGgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQVVUT0NPTVBMRVRFIFNVR0dFU1Q6IENBTExFRCAndmlzaWJsZScgSEFORExFUiwgVkFMVUU6IFwiLCB2YWwsIGlucHV0V2lkdGgpOyAgICAgICAgXG4gICAgICB0aGlzLmRyb3Bkb3duV2lkdGggPSBpbnB1dFdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuc2hvd1BvcHBlciA9IHZhbDtcbiAgICB9KTtcbiAgfVxufTtcblxuIl19
