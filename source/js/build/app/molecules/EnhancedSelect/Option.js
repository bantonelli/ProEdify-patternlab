define(['exports', '../../utils/mixins/emitter'], function (exports, _emitter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _emitter2 = _interopRequireDefault(_emitter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var optionTemplate = '\n<li\n  @mouseenter="hoverItem"\n  @click.stop="selectOptionClick"\n  class="select-dropdown__item select__option"\n  v-show="visible"\n  :class="{\n    \'selected\': itemSelected,\n    \'is-disabled\': disabled || groupDisabled || limitReached,\n    \'hover\': parent.hoverIndex === index\n  }">\n  <slot>\n    <span>{{ currentLabel }}</span>\n  </slot>\n  <div></div>\n</li>\n';

  exports.default = {
    mixins: [_emitter2.default],

    name: 'Option',

    template: optionTemplate,

    componentName: 'Option',

    props: {
      value: {
        required: true
      },
      label: [String, Number],
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data: function data() {
      return {
        index: -1,
        groupDisabled: false,
        visible: true,
        hitState: false
      };
    },


    computed: {
      currentLabel: function currentLabel() {
        return this.label || (typeof this.value === 'string' || typeof this.value === 'number' ? this.value : '');
      },
      currentValue: function currentValue() {
        return this.value || this.label || '';
      },
      parent: function parent() {
        var result = this.$parent;
        while (!result.isSelect) {
          result = result.$parent;
        }
        return result;
      },
      itemSelected: function itemSelected() {
        if (!this.parent.multiple) {
          return this.value === this.parent.value;
        } else {
          return this.parent.value.indexOf(this.value) > -1;
        }
      },
      limitReached: function limitReached() {
        if (this.parent.multiple) {
          return !this.itemSelected && this.parent.value.length >= this.parent.multipleLimit && this.parent.multipleLimit > 0;
        } else {
          return false;
        }
      }
    },

    watch: {
      currentLabel: function currentLabel() {
        if (!this.created && !this.parent.remote) this.dispatch('Select', 'setSelected');
      },
      value: function value() {
        if (!this.created && !this.parent.remote) this.dispatch('Select', 'setSelected');
      }
    },

    methods: {
      handleGroupDisabled: function handleGroupDisabled(val) {
        this.groupDisabled = val;
      },
      hoverItem: function hoverItem() {
        if (!this.disabled && !this.groupDisabled) {
          this.parent.hoverIndex = this.parent.options.indexOf(this);
        }
      },
      selectOptionClick: function selectOptionClick() {
        if (this.disabled !== true && this.groupDisabled !== true) {
          this.dispatch('Select', 'handleOptionClick', this);
        }
      },
      queryChange: function queryChange(query) {
        // query 里如果有正则中的特殊字符，需要先将这些字符转义
        var parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel) || this.created;
        if (!this.visible) {
          this.parent.filteredOptionsCount--;
        }
      },
      resetIndex: function resetIndex() {
        var _this = this;

        this.$nextTick(function () {
          _this.index = _this.parent.options.indexOf(_this);
        });
      }
    },

    created: function created() {
      this.parent.options.push(this);
      this.parent.cachedOptions.push(this);
      this.parent.optionsCount++;
      this.parent.filteredOptionsCount++;
      this.index = this.parent.options.indexOf(this);

      this.$on('queryChange', this.queryChange);
      this.$on('handleGroupDisabled', this.handleGroupDisabled);
      this.$on('resetIndex', this.resetIndex);
    },
    beforeDestroy: function beforeDestroy() {
      this.dispatch('Select', 'onOptionDestroy', this);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvT3B0aW9uLmpzIl0sIm5hbWVzIjpbIm9wdGlvblRlbXBsYXRlIiwibWl4aW5zIiwibmFtZSIsInRlbXBsYXRlIiwiY29tcG9uZW50TmFtZSIsInByb3BzIiwidmFsdWUiLCJyZXF1aXJlZCIsImxhYmVsIiwiU3RyaW5nIiwiTnVtYmVyIiwiY3JlYXRlZCIsIkJvb2xlYW4iLCJkaXNhYmxlZCIsInR5cGUiLCJkZWZhdWx0IiwiZGF0YSIsImluZGV4IiwiZ3JvdXBEaXNhYmxlZCIsInZpc2libGUiLCJoaXRTdGF0ZSIsImNvbXB1dGVkIiwiY3VycmVudExhYmVsIiwiY3VycmVudFZhbHVlIiwicGFyZW50IiwicmVzdWx0IiwiJHBhcmVudCIsImlzU2VsZWN0IiwiaXRlbVNlbGVjdGVkIiwibXVsdGlwbGUiLCJpbmRleE9mIiwibGltaXRSZWFjaGVkIiwibGVuZ3RoIiwibXVsdGlwbGVMaW1pdCIsIndhdGNoIiwicmVtb3RlIiwiZGlzcGF0Y2giLCJtZXRob2RzIiwiaGFuZGxlR3JvdXBEaXNhYmxlZCIsInZhbCIsImhvdmVySXRlbSIsImhvdmVySW5kZXgiLCJvcHRpb25zIiwic2VsZWN0T3B0aW9uQ2xpY2siLCJxdWVyeUNoYW5nZSIsInF1ZXJ5IiwicGFyc2VkUXVlcnkiLCJyZXBsYWNlIiwiUmVnRXhwIiwidGVzdCIsImZpbHRlcmVkT3B0aW9uc0NvdW50IiwicmVzZXRJbmRleCIsIiRuZXh0VGljayIsInB1c2giLCJjYWNoZWRPcHRpb25zIiwib3B0aW9uc0NvdW50IiwiJG9uIiwiYmVmb3JlRGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBSUEsOFlBQUo7O29CQWtCZTtBQUNiQyxZQUFRLG1CQURLOztBQUdiQyxVQUFNLFFBSE87O0FBS2JDLGNBQVVILGNBTEc7O0FBT2JJLG1CQUFlLFFBUEY7O0FBU2JDLFdBQU87QUFDTEMsYUFBTztBQUNMQyxrQkFBVTtBQURMLE9B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QXdCLGlCQUF4QixFQUEyQyxJQUEzQztBQUNEO0FBMUhZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9FbmhhbmNlZFNlbGVjdC9PcHRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9taXhpbnMvZW1pdHRlcic7XG5cbmxldCBvcHRpb25UZW1wbGF0ZSA9IGBcbjxsaVxuICBAbW91c2VlbnRlcj1cImhvdmVySXRlbVwiXG4gIEBjbGljay5zdG9wPVwic2VsZWN0T3B0aW9uQ2xpY2tcIlxuICBjbGFzcz1cInNlbGVjdC1kcm9wZG93bl9faXRlbSBzZWxlY3RfX29wdGlvblwiXG4gIHYtc2hvdz1cInZpc2libGVcIlxuICA6Y2xhc3M9XCJ7XG4gICAgJ3NlbGVjdGVkJzogaXRlbVNlbGVjdGVkLFxuICAgICdpcy1kaXNhYmxlZCc6IGRpc2FibGVkIHx8IGdyb3VwRGlzYWJsZWQgfHwgbGltaXRSZWFjaGVkLFxuICAgICdob3Zlcic6IHBhcmVudC5ob3ZlckluZGV4ID09PSBpbmRleFxuICB9XCI+XG4gIDxzbG90PlxuICAgIDxzcGFuPnt7IGN1cnJlbnRMYWJlbCB9fTwvc3Bhbj5cbiAgPC9zbG90PlxuICA8ZGl2PjwvZGl2PlxuPC9saT5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWl4aW5zOiBbRW1pdHRlcl0sXG5cbiAgbmFtZTogJ09wdGlvbicsXG5cbiAgdGVtcGxhdGU6IG9wdGlvblRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdPcHRpb24nLFxuXG4gIHByb3BzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgfSxcbiAgICBsYWJlbDogW1N0cmluZywgTnVtYmVyXSxcbiAgICBjcmVhdGVkOiBCb29sZWFuLFxuICAgIGRpc2FibGVkOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IC0xLFxuICAgICAgZ3JvdXBEaXNhYmxlZDogZmFsc2UsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgaGl0U3RhdGU6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGN1cnJlbnRMYWJlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhYmVsIHx8ICgodHlwZW9mIHRoaXMudmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0aGlzLnZhbHVlID09PSAnbnVtYmVyJykgPyB0aGlzLnZhbHVlIDogJycpO1xuICAgIH0sXG5cbiAgICBjdXJyZW50VmFsdWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCB0aGlzLmxhYmVsIHx8ICcnO1xuICAgIH0sXG5cbiAgICBwYXJlbnQoKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy4kcGFyZW50O1xuICAgICAgd2hpbGUgKCFyZXN1bHQuaXNTZWxlY3QpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LiRwYXJlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBpdGVtU2VsZWN0ZWQoKSB7XG4gICAgICBpZiAoIXRoaXMucGFyZW50Lm11bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB0aGlzLnBhcmVudC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC52YWx1ZS5pbmRleE9mKHRoaXMudmFsdWUpID4gLTE7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGxpbWl0UmVhY2hlZCgpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5tdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXRlbVNlbGVjdGVkICYmXG4gICAgICAgICAgdGhpcy5wYXJlbnQudmFsdWUubGVuZ3RoID49IHRoaXMucGFyZW50Lm11bHRpcGxlTGltaXQgJiZcbiAgICAgICAgICB0aGlzLnBhcmVudC5tdWx0aXBsZUxpbWl0ID4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjdXJyZW50TGFiZWwoKSB7XG4gICAgICBpZiAoIXRoaXMuY3JlYXRlZCAmJiAhdGhpcy5wYXJlbnQucmVtb3RlKSB0aGlzLmRpc3BhdGNoKCdTZWxlY3QnLCAnc2V0U2VsZWN0ZWQnKTtcbiAgICB9LFxuICAgIHZhbHVlKCkge1xuICAgICAgaWYgKCF0aGlzLmNyZWF0ZWQgJiYgIXRoaXMucGFyZW50LnJlbW90ZSkgdGhpcy5kaXNwYXRjaCgnU2VsZWN0JywgJ3NldFNlbGVjdGVkJyk7XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVHcm91cERpc2FibGVkKHZhbCkge1xuICAgICAgdGhpcy5ncm91cERpc2FibGVkID0gdmFsO1xuICAgIH0sXG5cbiAgICBob3Zlckl0ZW0oKSB7XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuZ3JvdXBEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnBhcmVudC5ob3ZlckluZGV4ID0gdGhpcy5wYXJlbnQub3B0aW9ucy5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZWxlY3RPcHRpb25DbGljaygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkICE9PSB0cnVlICYmIHRoaXMuZ3JvdXBEaXNhYmxlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdTZWxlY3QnLCAnaGFuZGxlT3B0aW9uQ2xpY2snLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcXVlcnlDaGFuZ2UocXVlcnkpIHtcbiAgICAgIC8vIHF1ZXJ5IOmHjOWmguaenOacieato+WImeS4reeahOeJueauiuWtl+espu+8jOmcgOimgeWFiOWwhui/meS6m+Wtl+espui9rOS5iVxuICAgICAgbGV0IHBhcnNlZFF1ZXJ5ID0gU3RyaW5nKHF1ZXJ5KS5yZXBsYWNlKC8oXFxefFxcKHxcXCl8XFxbfFxcXXxcXCR8XFwqfFxcK3xcXC58XFw/fFxcXFx8XFx7fFxcfXxcXHwpL2csICdcXFxcJDEnKTtcbiAgICAgIHRoaXMudmlzaWJsZSA9IG5ldyBSZWdFeHAocGFyc2VkUXVlcnksICdpJykudGVzdCh0aGlzLmN1cnJlbnRMYWJlbCkgfHwgdGhpcy5jcmVhdGVkO1xuICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuZmlsdGVyZWRPcHRpb25zQ291bnQtLTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRJbmRleCgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMucGFyZW50Lm9wdGlvbnMuaW5kZXhPZih0aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMucGFyZW50Lm9wdGlvbnMucHVzaCh0aGlzKTtcbiAgICB0aGlzLnBhcmVudC5jYWNoZWRPcHRpb25zLnB1c2godGhpcyk7XG4gICAgdGhpcy5wYXJlbnQub3B0aW9uc0NvdW50Kys7XG4gICAgdGhpcy5wYXJlbnQuZmlsdGVyZWRPcHRpb25zQ291bnQrKztcbiAgICB0aGlzLmluZGV4ID0gdGhpcy5wYXJlbnQub3B0aW9ucy5pbmRleE9mKHRoaXMpO1xuXG4gICAgdGhpcy4kb24oJ3F1ZXJ5Q2hhbmdlJywgdGhpcy5xdWVyeUNoYW5nZSk7XG4gICAgdGhpcy4kb24oJ2hhbmRsZUdyb3VwRGlzYWJsZWQnLCB0aGlzLmhhbmRsZUdyb3VwRGlzYWJsZWQpO1xuICAgIHRoaXMuJG9uKCdyZXNldEluZGV4JywgdGhpcy5yZXNldEluZGV4KTtcbiAgfSxcblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcGF0Y2goJ1NlbGVjdCcsICdvbk9wdGlvbkRlc3Ryb3knLCB0aGlzKTtcbiAgfVxufTtcblxuIl19
