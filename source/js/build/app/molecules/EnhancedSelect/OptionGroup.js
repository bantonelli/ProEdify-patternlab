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

  var optionGroupTemplate = '\n<ul class="select__group">\n  <li class="select__group-title" v-show="visible">{{ label }}</li>\n  <li>\n    <ul class="select__group-options">\n      <slot></slot>\n    </ul>\n  </li>\n</ul>\n';

  exports.default = {
    mixins: [_emitter2.default],

    name: 'OptionGroup',

    template: optionGroupTemplate,

    componentName: 'OptionGroup',

    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data: function data() {
      return {
        visible: true
      };
    },


    watch: {
      disabled: function disabled(val) {
        this.broadcast('Option', 'handleGroupDisabled', val);
      }
    },

    methods: {
      queryChange: function queryChange() {
        this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(function (option) {
          return option.visible === true;
        });
      }
    },

    created: function created() {
      this.$on('queryChange', this.queryChange);
    },
    mounted: function mounted() {
      if (this.disabled) {
        this.broadcast('Option', 'handleGroupDisabled', this.disabled);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvRW5oYW5jZWRTZWxlY3QvT3B0aW9uR3JvdXAuanMiXSwibmFtZXMiOlsib3B0aW9uR3JvdXBUZW1wbGF0ZSIsIm1peGlucyIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsImxhYmVsIiwiU3RyaW5nIiwiZGlzYWJsZWQiLCJ0eXBlIiwiQm9vbGVhbiIsImRlZmF1bHQiLCJkYXRhIiwidmlzaWJsZSIsIndhdGNoIiwidmFsIiwiYnJvYWRjYXN0IiwibWV0aG9kcyIsInF1ZXJ5Q2hhbmdlIiwiJGNoaWxkcmVuIiwiQXJyYXkiLCJpc0FycmF5Iiwic29tZSIsIm9wdGlvbiIsImNyZWF0ZWQiLCIkb24iLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSwyTkFBSjs7b0JBV2U7QUFDYkMsWUFBUSxtQkFESzs7QUFHYkMsVUFBTSxhQUhPOztBQUtiQyxjQUFVSCxtQkFMRzs7QUFPYkksbUJBQWUsYUFQRjs7QUFTYkMsV0FBTztBQUNMQyxhQUFPQyxNQURGO0FBRUxDLGdCQUFVO0FBQ1JDLGNBQU1DLE9BREU7QUFFUkMsaUJBQVM7QUFGRDtBQUZMLEtBVE07O0FBaUJiQyxRQWpCYSxrQkFpQk47QUFDTCxhQUFPO0FBQ0xDLGlCQUFTO0FBREosT0FBUDtBQUdELEtBckJZOzs7QUF1QmJDLFdBQU87QUFDTE4sY0FESyxvQkFDSU8sR0FESixFQUNTO0FBQ1osYUFBS0MsU0FBTCxDQUFlLFFBQWYsRUFBeUIscUJBQXpCLEVBQWdERCxHQUFoRDtBQUNEO0FBSEksS0F2Qk07O0FBNkJiRSxhQUFTO0FBQ1BDLGlCQURPLHlCQUNPO0FBQ1osYUFBS0wsT0FBTCxHQUFlLEtBQUtNLFNBQUwsSUFDYkMsTUFBTUMsT0FBTixDQUFjLEtBQUtGLFNBQW5CLENBRGEsSUFFYixLQUFLQSxTQUFMLENBQWVHLElBQWYsQ0FBb0I7QUFBQSxpQkFBVUMsT0FBT1YsT0FBUCxLQUFtQixJQUE3QjtBQUFBLFNBQXBCLENBRkY7QUFHRDtBQUxNLEtBN0JJOztBQXFDYlcsV0FyQ2EscUJBcUNIO0FBQ1IsV0FBS0MsR0FBTCxDQUFTLGFBQVQsRUFBd0IsS0FBS1AsV0FBN0I7QUFDRCxLQXZDWTtBQXlDYlEsV0F6Q2EscUJBeUNIO0FBQ1IsVUFBSSxLQUFLbEIsUUFBVCxFQUFtQjtBQUNqQixhQUFLUSxTQUFMLENBQWUsUUFBZixFQUF5QixxQkFBekIsRUFBZ0QsS0FBS1IsUUFBckQ7QUFDRDtBQUNGO0FBN0NZLEciLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9FbmhhbmNlZFNlbGVjdC9PcHRpb25Hcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL21peGlucy9lbWl0dGVyJztcblxubGV0IG9wdGlvbkdyb3VwVGVtcGxhdGUgPSBgXG48dWwgY2xhc3M9XCJzZWxlY3RfX2dyb3VwXCI+XG4gIDxsaSBjbGFzcz1cInNlbGVjdF9fZ3JvdXAtdGl0bGVcIiB2LXNob3c9XCJ2aXNpYmxlXCI+e3sgbGFiZWwgfX08L2xpPlxuICA8bGk+XG4gICAgPHVsIGNsYXNzPVwic2VsZWN0X19ncm91cC1vcHRpb25zXCI+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC91bD5cbiAgPC9saT5cbjwvdWw+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1peGluczogW0VtaXR0ZXJdLFxuXG4gIG5hbWU6ICdPcHRpb25Hcm91cCcsXG5cbiAgdGVtcGxhdGU6IG9wdGlvbkdyb3VwVGVtcGxhdGUsXG5cbiAgY29tcG9uZW50TmFtZTogJ09wdGlvbkdyb3VwJyxcblxuICBwcm9wczoge1xuICAgIGxhYmVsOiBTdHJpbmcsXG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2aXNpYmxlOiB0cnVlXG4gICAgfTtcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGRpc2FibGVkKHZhbCkge1xuICAgICAgdGhpcy5icm9hZGNhc3QoJ09wdGlvbicsICdoYW5kbGVHcm91cERpc2FibGVkJywgdmFsKTtcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHF1ZXJ5Q2hhbmdlKCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy4kY2hpbGRyZW4gJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLiRjaGlsZHJlbikgJiZcbiAgICAgICAgdGhpcy4kY2hpbGRyZW4uc29tZShvcHRpb24gPT4gb3B0aW9uLnZpc2libGUgPT09IHRydWUpO1xuICAgIH1cbiAgfSxcblxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMuJG9uKCdxdWVyeUNoYW5nZScsIHRoaXMucXVlcnlDaGFuZ2UpO1xuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdPcHRpb24nLCAnaGFuZGxlR3JvdXBEaXNhYmxlZCcsIHRoaXMuZGlzYWJsZWQpO1xuICAgIH1cbiAgfVxufTtcblxuIl19
