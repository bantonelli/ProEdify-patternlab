define(['exports', 'lodash', '../../utils/mixins/emitter', '../../utils/clickoutside', './DropdownMenu'], function (exports, _lodash, _emitter, _clickoutside, _DropdownMenu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _emitter2 = _interopRequireDefault(_emitter);

  var _clickoutside2 = _interopRequireDefault(_clickoutside);

  var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var dropdownTemplate = '\n<div \n  :class="classes"  \n  v-clickoutside="handleClose"\n  > \n    <template v-if="label">\n      <div \n        class="dropdown__label"\n        ref="reference"       \n      >\n          {{ label }}\n      </div> \n    </template>\n    <template v-else>\n      <div \n        class="dropdown__label"\n        :class="iconClass"\n        ref="reference"       \n      >\n      </div> \n    </template> \n    <dropdown-menu \n      @show="handleOpen"\n      @hide="handleClose"      \n      v-show="visible"\n      :trigger="trigger"\n      :visible-arrow="visibleArrow"\n      :arrow-class="arrowClass"\n      :boundaries-selector="boundariesSelector"\n      :options="popperOptions"\n    >\n        <div v-if="showHeader" class="dropdown__menu-header">\n            <slot name="header">\n                Header\n            </slot>\n        </div>        \n        <ul class="dropdown__menu-list">\n            <slot></slot>                                \n        </ul>\n        <div v-if="showFooter" class="dropdown__menu-footer">\n            <slot name="footer">\n                Footer\n            </slot>\n        </div>     \n    </dropdown-menu>        \n</div>\n';

  exports.default = {
    mixins: [_emitter2.default],

    name: 'Dropdown',

    template: dropdownTemplate,

    componentName: 'Dropdown',

    directives: { Clickoutside: _clickoutside2.default },

    components: {
      'dropdown-menu': _DropdownMenu2.default
    },

    props: {
      trigger: {
        type: String,
        default: 'click',
        validator: function validator(value) {
          return ['click', 'hover'].indexOf(value) > -1;
        }
      },
      triggerReferenceOnly: {
        type: Boolean,
        default: true
      },
      visibleArrow: {
        type: Boolean,
        default: true
      },
      arrowClass: {
        type: String,
        default: 'dropdown__menu-arrow'
      },
      boundariesSelector: String,
      popperOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      label: {
        type: String,
        default: null
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: true
      },
      modifierStyles: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      variationClass: {
        type: String,
        default: "dropdown"
      },
      iconClass: {
        type: String,
        default: "pe-icon-dropdown-arrow"
      }
    },

    data: function data() {
      return {
        visible: false
      };
    },


    computed: {
      classes: function classes() {
        var result = void 0;
        // If there is a label provided put the iconClass on classes 
        if (this.label) {
          result = [this.variationClass, this.iconClass];
          return _lodash2.default.concat(result, this.modifierStyles);
        } else {
          // Otherwise put iconClass on the dropdown__label element;        
          result = [this.variationClass];
          return _lodash2.default.concat(result, this.modifierStyles);
        }
      }
    },

    watch: {
      visible: function visible(val) {
        // If visible is set to false         
        if (!val) {}
        // Destroy Popper  
        // this.broadcast('DropdownMenu', 'destroyPopper');

        // If is visible 
        else {}
          // Broadcast updatePopper event 
          // this.broadcast('DropdownMenu', 'updatePopper');

          // this.$emit('visible-change', val);
      }
    },

    methods: {
      handleClose: function handleClose() {
        // console.log("CALLED Clickoutside"); >> WORKED
        this.visible = false;
      },
      handleOpen: function handleOpen() {
        this.visible = true;
      }
    },

    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {
      if (this.$el) {
        this.broadcast('DropdownMenu', 'destroyPopper');
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9Ecm9wZG93bi9Ecm9wZG93bi5qcyJdLCJuYW1lcyI6WyJkcm9wZG93blRlbXBsYXRlIiwibWl4aW5zIiwibmFtZSIsInRlbXBsYXRlIiwiY29tcG9uZW50TmFtZSIsImRpcmVjdGl2ZXMiLCJDbGlja291dHNpZGUiLCJjb21wb25lbnRzIiwicHJvcHMiLCJ0cmlnZ2VyIiwidHlwZSIsIlN0cmluZyIsImRlZmF1bHQiLCJ2YWxpZGF0b3IiLCJpbmRleE9mIiwidmFsdWUiLCJ0cmlnZ2VyUmVmZXJlbmNlT25seSIsIkJvb2xlYW4iLCJ2aXNpYmxlQXJyb3ciLCJhcnJvd0NsYXNzIiwiYm91bmRhcmllc1NlbGVjdG9yIiwicG9wcGVyT3B0aW9ucyIsIk9iamVjdCIsImxhYmVsIiwic2hvd0hlYWRlciIsInNob3dGb290ZXIiLCJtb2RpZmllclN0eWxlcyIsIkFycmF5IiwidmFyaWF0aW9uQ2xhc3MiLCJpY29uQ2xhc3MiLCJkYXRhIiwidmlzaWJsZSIsImNvbXB1dGVkIiwiY2xhc3NlcyIsInJlc3VsdCIsImNvbmNhdCIsIndhdGNoIiwidmFsIiwibWV0aG9kcyIsImhhbmRsZUNsb3NlIiwiaGFuZGxlT3BlbiIsIm1vdW50ZWQiLCJiZWZvcmVEZXN0cm95IiwiJGVsIiwiYnJvYWRjYXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxNQUFJQSxtckNBQUo7O29CQWdEZTtBQUNiQyxZQUFRLG1CQURLOztBQUdiQyxVQUFNLFVBSE87O0FBS2JDLGNBQVVILGdCQUxHOztBQU9iSSxtQkFBZSxVQVBGOztBQVNiQyxnQkFBWSxFQUFFQyxvQ0FBRixFQVRDOztBQVdiQyxnQkFBWTtBQUNWO0FBRFUsS0FYQzs7QUFlYkMsV0FBTztBQUNIQyxlQUFTO0FBQ0xDLGNBQU1DLE1BREQ7QUFFTEMsaUJBQVMsT0FGSjtBQUdMQyxtQkFBVztBQUFBLGlCQUFTLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUJDLE9BQW5CLENBQTJCQyxLQUEzQixJQUFvQyxDQUFDLENBQTlDO0FBQUE7QUFITixPQUROO0FBTUhDLDRCQUFzQjtBQUNwQk4sY0FBTU8sT0FEYztBQUVwQkwsaUJBQVM7QUFGVyxPQU5uQjtBQVVITSxvQkFBYztBQUNWUixjQUFNTyxPQURJO0FBRVZMLGlCQUFTO0FBRkMsT0FWWDtBQWNITyxrQkFBWTtBQUNSVCxjQUFNQyxNQURFO0FBRVJDLGlCQUFTO0FBRkQsT0FkVDtBQWtCSFEsMEJBQW9CVCxNQWxCakI7QUFtQkhVLHFCQUFlO0FBQ2JYLGNBQU1ZLE1BRE87QUFFYlYsaUJBQVMsb0JBQVk7QUFDbkIsaUJBQU8sRUFBUDtBQUNEO0FBSlksT0FuQlo7QUF5QkhXLGFBQU87QUFDTGIsY0FBTUMsTUFERDtBQUVMQyxpQkFBUztBQUZKLE9BekJKO0FBNkJIWSxrQkFBWTtBQUNWZCxjQUFNTyxPQURJO0FBRVZMLGlCQUFTO0FBRkMsT0E3QlQ7QUFpQ0hhLGtCQUFZO0FBQ1ZmLGNBQU1PLE9BREk7QUFFVkwsaUJBQVM7QUFGQyxPQWpDVDtBQXFDSGMsc0JBQWdCO0FBQ2RoQixjQUFNaUIsS0FEUTtBQUVkZixpQkFBUyxvQkFBWTtBQUNuQixpQkFBTyxFQUFQO0FBQ0Q7QUFKYSxPQXJDYjtBQTJDSGdCLHNCQUFnQjtBQUNkbEIsY0FBTUMsTUFEUTtBQUVkQyxpQkFBUztBQUZLLE9BM0NiO0FBK0NIaUIsaUJBQVc7QUFDVG5CLGNBQU1DLE1BREc7QUFFVEMsaUJBQVM7QUFGQTtBQS9DUixLQWZNOztBQW9FYmtCLFFBcEVhLGtCQW9FTjtBQUNMLGFBQU87QUFDTEMsaUJBQVM7QUFESixPQUFQO0FBR0QsS0F4RVk7OztBQTBFYkMsY0FBVTtBQUNSQyxlQUFTLG1CQUFZO0FBQ25CLFlBQUlDLGVBQUo7QUFDQTtBQUNBLFlBQUksS0FBS1gsS0FBVCxFQUFnQjtBQUNaVyxtQkFBUyxDQUFDLEtBQUtOLGNBQU4sRUFBc0IsS0FBS0MsU0FBM0IsQ0FBVDtBQUNBLGlCQUFPLGlCQUFFTSxNQUFGLENBQVNELE1BQVQsRUFBaUIsS0FBS1IsY0FBdEIsQ0FBUDtBQUNILFNBSEQsTUFHTztBQUNMO0FBQ0VRLG1CQUFTLENBQUMsS0FBS04sY0FBTixDQUFUO0FBQ0EsaUJBQU8saUJBQUVPLE1BQUYsQ0FBU0QsTUFBVCxFQUFpQixLQUFLUixjQUF0QixDQUFQO0FBQ0g7QUFDRjtBQVpPLEtBMUVHOztBQXlGYlUsV0FBTztBQUNMTCxhQURLLG1CQUNHTSxHQURILEVBQ1E7QUFDWDtBQUNBLFlBQUksQ0FBQ0EsR0FBTCxFQUFVLENBR1Q7QUFGQztBQUNBOztBQUVGO0FBSkEsYUFLSyxDQUdKO0FBRkM7QUFDQTs7QUFFRjtBQUNEO0FBYkksS0F6Rk07O0FBeUdiQyxhQUFTO0FBQ1BDLGlCQURPLHlCQUNPO0FBQ1o7QUFDQSxhQUFLUixPQUFMLEdBQWUsS0FBZjtBQUNELE9BSk07QUFLUFMsZ0JBTE8sd0JBS007QUFDWCxhQUFLVCxPQUFMLEdBQWUsSUFBZjtBQUNEO0FBUE0sS0F6R0k7O0FBbUhiVSxXQW5IYSxxQkFtSEgsQ0FDVCxDQXBIWTtBQXNIYkMsaUJBdEhhLDJCQXNIRztBQUNkLFVBQUksS0FBS0MsR0FBVCxFQUFjO0FBQ1osYUFBS0MsU0FBTCxDQUFlLGNBQWYsRUFBK0IsZUFBL0I7QUFDRDtBQUNGO0FBMUhZLEciLCJmaWxlIjoiYXBwL2F0b21zL0Ryb3Bkb3duL0Ryb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcbmltcG9ydCBDbGlja291dHNpZGUgZnJvbSAnLi4vLi4vdXRpbHMvY2xpY2tvdXRzaWRlJztcbmltcG9ydCBEcm9wZG93bk1lbnUgZnJvbSAnLi9Ecm9wZG93bk1lbnUnO1xuXG5sZXQgZHJvcGRvd25UZW1wbGF0ZSA9IGBcbjxkaXYgXG4gIDpjbGFzcz1cImNsYXNzZXNcIiAgXG4gIHYtY2xpY2tvdXRzaWRlPVwiaGFuZGxlQ2xvc2VcIlxuICA+IFxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwibGFiZWxcIj5cbiAgICAgIDxkaXYgXG4gICAgICAgIGNsYXNzPVwiZHJvcGRvd25fX2xhYmVsXCJcbiAgICAgICAgcmVmPVwicmVmZXJlbmNlXCIgICAgICAgXG4gICAgICA+XG4gICAgICAgICAge3sgbGFiZWwgfX1cbiAgICAgIDwvZGl2PiBcbiAgICA8L3RlbXBsYXRlPlxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XG4gICAgICA8ZGl2IFxuICAgICAgICBjbGFzcz1cImRyb3Bkb3duX19sYWJlbFwiXG4gICAgICAgIDpjbGFzcz1cImljb25DbGFzc1wiXG4gICAgICAgIHJlZj1cInJlZmVyZW5jZVwiICAgICAgIFxuICAgICAgPlxuICAgICAgPC9kaXY+IFxuICAgIDwvdGVtcGxhdGU+IFxuICAgIDxkcm9wZG93bi1tZW51IFxuICAgICAgQHNob3c9XCJoYW5kbGVPcGVuXCJcbiAgICAgIEBoaWRlPVwiaGFuZGxlQ2xvc2VcIiAgICAgIFxuICAgICAgdi1zaG93PVwidmlzaWJsZVwiXG4gICAgICA6dHJpZ2dlcj1cInRyaWdnZXJcIlxuICAgICAgOnZpc2libGUtYXJyb3c9XCJ2aXNpYmxlQXJyb3dcIlxuICAgICAgOmFycm93LWNsYXNzPVwiYXJyb3dDbGFzc1wiXG4gICAgICA6Ym91bmRhcmllcy1zZWxlY3Rvcj1cImJvdW5kYXJpZXNTZWxlY3RvclwiXG4gICAgICA6b3B0aW9ucz1cInBvcHBlck9wdGlvbnNcIlxuICAgID5cbiAgICAgICAgPGRpdiB2LWlmPVwic2hvd0hlYWRlclwiIGNsYXNzPVwiZHJvcGRvd25fX21lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8c2xvdCBuYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgSGVhZGVyXG4gICAgICAgICAgICA8L3Nsb3Q+XG4gICAgICAgIDwvZGl2PiAgICAgICAgXG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duX19tZW51LWxpc3RcIj5cbiAgICAgICAgICAgIDxzbG90Pjwvc2xvdD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICA8L3VsPlxuICAgICAgICA8ZGl2IHYtaWY9XCJzaG93Rm9vdGVyXCIgY2xhc3M9XCJkcm9wZG93bl9fbWVudS1mb290ZXJcIj5cbiAgICAgICAgICAgIDxzbG90IG5hbWU9XCJmb290ZXJcIj5cbiAgICAgICAgICAgICAgICBGb290ZXJcbiAgICAgICAgICAgIDwvc2xvdD5cbiAgICAgICAgPC9kaXY+ICAgICBcbiAgICA8L2Ryb3Bkb3duLW1lbnU+ICAgICAgICBcbjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtaXhpbnM6IFtFbWl0dGVyXSxcblxuICBuYW1lOiAnRHJvcGRvd24nLFxuXG4gIHRlbXBsYXRlOiBkcm9wZG93blRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdEcm9wZG93bicsXG5cbiAgZGlyZWN0aXZlczogeyBDbGlja291dHNpZGUgfSwgIFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICAnZHJvcGRvd24tbWVudSc6IERyb3Bkb3duTWVudVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjbGljaycsXG4gICAgICAgICAgdmFsaWRhdG9yOiB2YWx1ZSA9PiBbJ2NsaWNrJywgJ2hvdmVyJ10uaW5kZXhPZih2YWx1ZSkgPiAtMVxuICAgICAgfSxcbiAgICAgIHRyaWdnZXJSZWZlcmVuY2VPbmx5OiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB2aXNpYmxlQXJyb3c6IHtcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcnJvd0NsYXNzOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgIGRlZmF1bHQ6ICdkcm9wZG93bl9fbWVudS1hcnJvdydcbiAgICAgIH0sXG4gICAgICBib3VuZGFyaWVzU2VsZWN0b3I6IFN0cmluZywgICAgICBcbiAgICAgIHBvcHBlck9wdGlvbnM6IHtcbiAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbGFiZWw6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLCBcbiAgICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgfSxcbiAgICAgIHNob3dIZWFkZXI6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHNob3dGb290ZXI6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgfSwgXG4gICAgICBtb2RpZmllclN0eWxlczoge1xuICAgICAgICB0eXBlOiBBcnJheSwgXG4gICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2YXJpYXRpb25DbGFzczoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGRlZmF1bHQ6IFwiZHJvcGRvd25cIiAgICAgICAgXG4gICAgICB9LFxuICAgICAgaWNvbkNsYXNzOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgZGVmYXVsdDogXCJwZS1pY29uLWRyb3Bkb3duLWFycm93XCJcbiAgICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYSBsYWJlbCBwcm92aWRlZCBwdXQgdGhlIGljb25DbGFzcyBvbiBjbGFzc2VzIFxuICAgICAgaWYgKHRoaXMubGFiZWwpIHtcbiAgICAgICAgICByZXN1bHQgPSBbdGhpcy52YXJpYXRpb25DbGFzcywgdGhpcy5pY29uQ2xhc3NdO1xuICAgICAgICAgIHJldHVybiBfLmNvbmNhdChyZXN1bHQsIHRoaXMubW9kaWZpZXJTdHlsZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHB1dCBpY29uQ2xhc3Mgb24gdGhlIGRyb3Bkb3duX19sYWJlbCBlbGVtZW50OyAgICAgICAgXG4gICAgICAgICAgcmVzdWx0ID0gW3RoaXMudmFyaWF0aW9uQ2xhc3NdO1xuICAgICAgICAgIHJldHVybiBfLmNvbmNhdChyZXN1bHQsIHRoaXMubW9kaWZpZXJTdHlsZXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHZpc2libGUodmFsKSB7XG4gICAgICAvLyBJZiB2aXNpYmxlIGlzIHNldCB0byBmYWxzZSAgICAgICAgIFxuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgLy8gRGVzdHJveSBQb3BwZXIgIFxuICAgICAgICAvLyB0aGlzLmJyb2FkY2FzdCgnRHJvcGRvd25NZW51JywgJ2Rlc3Ryb3lQb3BwZXInKTtcbiAgICAgIH0gXG4gICAgICAvLyBJZiBpcyB2aXNpYmxlIFxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIEJyb2FkY2FzdCB1cGRhdGVQb3BwZXIgZXZlbnQgXG4gICAgICAgIC8vIHRoaXMuYnJvYWRjYXN0KCdEcm9wZG93bk1lbnUnLCAndXBkYXRlUG9wcGVyJyk7XG4gICAgICB9ICAgICAgXG4gICAgICAvLyB0aGlzLiRlbWl0KCd2aXNpYmxlLWNoYW5nZScsIHZhbCk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ0FMTEVEIENsaWNrb3V0c2lkZVwiKTsgPj4gV09SS0VEXG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuICAgIGhhbmRsZU9wZW4oKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICB0aGlzLmJyb2FkY2FzdCgnRHJvcGRvd25NZW51JywgJ2Rlc3Ryb3lQb3BwZXInKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qXG5QTEFOOiBcbkRyb3Bkb3duIC0gUGFyZW50IGNvbXBvbmVudFxuICAgIC0gQ29udGFpbnMgXCJyZWZlcmVuY2VcIiAtLS0+IERPTkVcbiAgICAtIFVzZXMgdGhlIERyb3Bkb3duIG1lbnUgLS0tPiBET05FIFxuICAgIC0gRGV0ZXJtaW5lcyB2YXJpYXRpb25DbGFzcyBhbmQgbW9kaWZpZXJTdHlsZXMgLS0tPiBET05FXG4gICAgLSBEZXRlcm1pbmVzIGljb25DbGFzcyAtLS0+IERPTkUgIFxuICAgIC0gRGV0ZXJtaW5lcyB0cmlnZ2VyIGNsaWNrLCBob3Zlciwgb3IgdXNlIHJlZmVyZW5jZSBhcyB0cmlnZ2VyIC0tLSBET05FXG4gICAgLSBEZXRlcm1pbmVzIGRyb3Bkb3duIGxhYmVsIHRleHQgIFxuICAgIC0gRHluYW1pY2FsbHkgbG9hZHMgY29tcG9uZW50IGludG8gbWVudSA8c2xvdD5cbiAgICBcbkRyb3Bkb3duIE1lbnUgLSBDaGlsZCAgICAgXG4gICAgLSBNYWtlIGVhY2ggZHJvcGRvd24gbWVudS1pdGVtIGJlIHNpbWlsYXIgdG8gZm9ybS1pdGVtIFxuICAgICAgd2hlcmUgZWFjaCBpdGVtIGNhbiBiZSBhIGRpZmZlcmVudCBjbGFzcyBvZiBjb21wb25lbnQuXG4gICAgLSBTaG91bGQgYmUgYWJsZSB0byBoYXZlIGEgY3VzdG9tIGhlYWRlciBhbmQgZm9vdGVyIGFzIHdlbGxcbiAgICAgIC0gTWFrZSBzbG90cyBmb3IgaGVhZGVyIGFuZCBmb290ZXIgdGhhdCBjYW4gYmUgcGFzc2VkIGluLiBcblxuRHJvcGRvd24gTWVudSBJdGVtIC0gQ2hpbGQgXG4gICAgLSA8bGk+IHdyYXBwZXIgXG4gICAgLSBEZWZhdWx0IHNsb3Qgd2lsbCBiZSB3aGVyZSBjb250ZW50IGlzIHBhc3NlZCBpbnRvIFxuICAgIC0gQ2hlY2sgdG8gc2VlIGlmIGl0IGlzIGRlc3Ryb3llZCB3aGVuIHBhcmVudCBcbiAgICAgIG1lbnUgaXMgZGVzdHJveWVkLiAtLT4gRE9ORSBEZXN0cm95ZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAtIEdlbmVyYWxseSBPbmx5IGhhdmUgdG8gbWFudWFsbHkgZGVzdHJveSBpZiB5b3UgYXJlIFxuICAgICAgICBtYW51YWxseSBtb3VudGluZyB0aGUgY29tcG9uZW50LiBPdGhlcndpc2UgVnVlIHdpbGwgXG4gICAgICAgIGhhbmRsZSBpdC4gXG4gICAgICAgIC0gT2sgaWYgbmVpdGhlciBhcmUgZGVzdHJveWVkIFxuICAgICAgICAtIE5vdCBPayBpZiBtZW51IGlzIGRlc3Ryb3llZCBidXQgaXRlbXMgYXJlbid0ICAgICAgIFxuXG5cbjxkcm9wZG93bj5cbiAgPGRyb3Bkb3duLW1lbnUtaXRlbT5cbiAgICA8c29tZS1jb21wb25lbnQ+PC9zb21lLWNvbXBvbmVudD5cbiAgPC9kcm9wZG93bi1tZW51LWl0ZW0+XG48L2Ryb3Bkb3duPlxuXG4gKi8iXX0=
