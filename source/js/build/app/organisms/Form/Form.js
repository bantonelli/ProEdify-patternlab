define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var formTemplate = '\n<form class="form" :class="[\n  labelPosition ? \'form_label-\' + labelPosition : \'\',\n  { \'el-form--inline\': inline }\n]">\n  <slot></slot>\n</form>\n';

  exports.default = {
    name: 'Form',

    template: formTemplate,

    componentName: 'Form',

    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      rules: function rules() {
        this.validate();
      }
    },
    data: function data() {
      return {
        fields: []
      };
    },
    created: function created() {
      var _this = this;

      this.$on('form.addField', function (field) {
        if (field) {
          _this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('form.removeField', function (field) {
        if (field.prop) {
          _this.fields.splice(_this.fields.indexOf(field), 1);
        }
      });
    },

    methods: {
      resetFields: function resetFields() {
        this.fields.forEach(function (field) {
          field.resetField();
        });
      },
      validate: function validate(callback) {
        var _this2 = this;

        var valid = true;
        var count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        this.fields.forEach(function (field, index) {
          field.validate('', function (errors) {
            if (errors) {
              valid = false;
            }
            if (typeof callback === 'function' && ++count === _this2.fields.length) {
              callback(valid);
            }
          });
        });
      },
      validateField: function validateField(prop, cb) {
        var field = this.fields.filter(function (field) {
          return field.prop === prop;
        })[0];
        if (!field) {
          throw new Error('must call validateField with valid prop string!');
        }

        field.validate('', cb);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9vcmdhbmlzbXMvRm9ybS9Gb3JtLmpzIl0sIm5hbWVzIjpbImZvcm1UZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJwcm9wcyIsIm1vZGVsIiwiT2JqZWN0IiwicnVsZXMiLCJsYWJlbFBvc2l0aW9uIiwiU3RyaW5nIiwibGFiZWxXaWR0aCIsImxhYmVsU3VmZml4IiwidHlwZSIsImRlZmF1bHQiLCJpbmxpbmUiLCJCb29sZWFuIiwic2hvd01lc3NhZ2UiLCJ3YXRjaCIsInZhbGlkYXRlIiwiZGF0YSIsImZpZWxkcyIsImNyZWF0ZWQiLCIkb24iLCJmaWVsZCIsInB1c2giLCJwcm9wIiwic3BsaWNlIiwiaW5kZXhPZiIsIm1ldGhvZHMiLCJyZXNldEZpZWxkcyIsImZvckVhY2giLCJyZXNldEZpZWxkIiwiY2FsbGJhY2siLCJ2YWxpZCIsImNvdW50IiwibGVuZ3RoIiwiaW5kZXgiLCJlcnJvcnMiLCJ2YWxpZGF0ZUZpZWxkIiwiY2IiLCJmaWx0ZXIiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBSUEsOEtBQUo7O29CQVNlO0FBQ2JDLFVBQU0sTUFETzs7QUFHYkMsY0FBVUYsWUFIRzs7QUFLYkcsbUJBQWUsTUFMRjs7QUFPYkMsV0FBTztBQUNMQyxhQUFPQyxNQURGO0FBRUxDLGFBQU9ELE1BRkY7QUFHTEUscUJBQWVDLE1BSFY7QUFJTEMsa0JBQVlELE1BSlA7QUFLTEUsbUJBQWE7QUFDWEMsY0FBTUgsTUFESztBQUVYSSxpQkFBUztBQUZFLE9BTFI7QUFTTEMsY0FBUUMsT0FUSDtBQVVMQyxtQkFBYTtBQUNYSixjQUFNRyxPQURLO0FBRVhGLGlCQUFTO0FBRkU7QUFWUixLQVBNO0FBc0JiSSxXQUFPO0FBQ0xWLFdBREssbUJBQ0c7QUFDTixhQUFLVyxRQUFMO0FBQ0Q7QUFISSxLQXRCTTtBQTJCYkMsUUEzQmEsa0JBMkJOO0FBQ0wsYUFBTztBQUNMQyxnQkFBUTtBQURILE9BQVA7QUFHRCxLQS9CWTtBQWdDYkMsV0FoQ2EscUJBZ0NIO0FBQUE7O0FBQ1IsV0FBS0MsR0FBTCxDQUFTLGVBQVQsRUFBMEIsVUFBQ0MsS0FBRCxFQUFXO0FBQ25DLFlBQUlBLEtBQUosRUFBVztBQUNULGdCQUFLSCxNQUFMLENBQVlJLElBQVosQ0FBaUJELEtBQWpCO0FBQ0Q7QUFDRixPQUpEO0FBS0E7QUFDQSxXQUFLRCxHQUFMLENBQVMsa0JBQVQsRUFBNkIsVUFBQ0MsS0FBRCxFQUFXO0FBQ3RDLFlBQUlBLE1BQU1FLElBQVYsRUFBZ0I7QUFDZCxnQkFBS0wsTUFBTCxDQUFZTSxNQUFaLENBQW1CLE1BQUtOLE1BQUwsQ0FBWU8sT0FBWixDQUFvQkosS0FBcEIsQ0FBbkIsRUFBK0MsQ0FBL0M7QUFDRDtBQUNGLE9BSkQ7QUFLRCxLQTVDWTs7QUE2Q2JLLGFBQVM7QUFDUEMsaUJBRE8seUJBQ087QUFDWixhQUFLVCxNQUFMLENBQVlVLE9BQVosQ0FBb0IsaUJBQVM7QUFDM0JQLGdCQUFNUSxVQUFOO0FBQ0QsU0FGRDtBQUdELE9BTE07QUFNUGIsY0FOTyxvQkFNRWMsUUFORixFQU1ZO0FBQUE7O0FBQ2pCLFlBQUlDLFFBQVEsSUFBWjtBQUNBLFlBQUlDLFFBQVEsQ0FBWjtBQUNBO0FBQ0EsWUFBSSxLQUFLZCxNQUFMLENBQVllLE1BQVosS0FBdUIsQ0FBdkIsSUFBNEJILFFBQWhDLEVBQTBDO0FBQ3hDQSxtQkFBUyxJQUFUO0FBQ0Q7QUFDRCxhQUFLWixNQUFMLENBQVlVLE9BQVosQ0FBb0IsVUFBQ1AsS0FBRCxFQUFRYSxLQUFSLEVBQWtCO0FBQ3BDYixnQkFBTUwsUUFBTixDQUFlLEVBQWYsRUFBbUIsa0JBQVU7QUFDM0IsZ0JBQUltQixNQUFKLEVBQVk7QUFDVkosc0JBQVEsS0FBUjtBQUNEO0FBQ0QsZ0JBQUksT0FBT0QsUUFBUCxLQUFvQixVQUFwQixJQUFrQyxFQUFFRSxLQUFGLEtBQVksT0FBS2QsTUFBTCxDQUFZZSxNQUE5RCxFQUFzRTtBQUNwRUgsdUJBQVNDLEtBQVQ7QUFDRDtBQUNGLFdBUEQ7QUFRRCxTQVREO0FBVUQsT0F2Qk07QUF3QlBLLG1CQXhCTyx5QkF3Qk9iLElBeEJQLEVBd0JhYyxFQXhCYixFQXdCaUI7QUFDdEIsWUFBSWhCLFFBQVEsS0FBS0gsTUFBTCxDQUFZb0IsTUFBWixDQUFtQjtBQUFBLGlCQUFTakIsTUFBTUUsSUFBTixLQUFlQSxJQUF4QjtBQUFBLFNBQW5CLEVBQWlELENBQWpELENBQVo7QUFDQSxZQUFJLENBQUNGLEtBQUwsRUFBWTtBQUFFLGdCQUFNLElBQUlrQixLQUFKLENBQVUsaURBQVYsQ0FBTjtBQUFxRTs7QUFFbkZsQixjQUFNTCxRQUFOLENBQWUsRUFBZixFQUFtQnFCLEVBQW5CO0FBQ0Q7QUE3Qk07QUE3Q0ksRyIsImZpbGUiOiJhcHAvb3JnYW5pc21zL0Zvcm0vRm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBmb3JtVGVtcGxhdGUgPSBgXG48Zm9ybSBjbGFzcz1cImZvcm1cIiA6Y2xhc3M9XCJbXG4gIGxhYmVsUG9zaXRpb24gPyAnZm9ybV9sYWJlbC0nICsgbGFiZWxQb3NpdGlvbiA6ICcnLFxuICB7ICdlbC1mb3JtLS1pbmxpbmUnOiBpbmxpbmUgfVxuXVwiPlxuICA8c2xvdD48L3Nsb3Q+XG48L2Zvcm0+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdGb3JtJyxcblxuICB0ZW1wbGF0ZTogZm9ybVRlbXBsYXRlLFxuXG4gIGNvbXBvbmVudE5hbWU6ICdGb3JtJyxcblxuICBwcm9wczoge1xuICAgIG1vZGVsOiBPYmplY3QsXG4gICAgcnVsZXM6IE9iamVjdCxcbiAgICBsYWJlbFBvc2l0aW9uOiBTdHJpbmcsXG4gICAgbGFiZWxXaWR0aDogU3RyaW5nLFxuICAgIGxhYmVsU3VmZml4OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIH0sXG4gICAgaW5saW5lOiBCb29sZWFuLFxuICAgIHNob3dNZXNzYWdlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBydWxlcygpIHtcbiAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICB9XG4gIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkczogW11cbiAgICB9O1xuICB9LFxuICBjcmVhdGVkKCkge1xuICAgIHRoaXMuJG9uKCdmb3JtLmFkZEZpZWxkJywgKGZpZWxkKSA9PiB7XG4gICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgdGhpcy5maWVsZHMucHVzaChmaWVsZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICB0aGlzLiRvbignZm9ybS5yZW1vdmVGaWVsZCcsIChmaWVsZCkgPT4ge1xuICAgICAgaWYgKGZpZWxkLnByb3ApIHtcbiAgICAgICAgdGhpcy5maWVsZHMuc3BsaWNlKHRoaXMuZmllbGRzLmluZGV4T2YoZmllbGQpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHJlc2V0RmllbGRzKCkge1xuICAgICAgdGhpcy5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGZpZWxkLnJlc2V0RmllbGQoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGUoY2FsbGJhY2spIHtcbiAgICAgIGxldCB2YWxpZCA9IHRydWU7XG4gICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgLy8g5aaC5p6c6ZyA6KaB6aqM6K+B55qEZmllbGRz5Li656m677yM6LCD55So6aqM6K+B5pe256uL5Yi76L+U5ZueY2FsbGJhY2tcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5sZW5ndGggPT09IDAgJiYgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKChmaWVsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgZmllbGQudmFsaWRhdGUoJycsIGVycm9ycyA9PiB7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiArK2NvdW50ID09PSB0aGlzLmZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHZhbGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUZpZWxkKHByb3AsIGNiKSB7XG4gICAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkcy5maWx0ZXIoZmllbGQgPT4gZmllbGQucHJvcCA9PT0gcHJvcClbMF07XG4gICAgICBpZiAoIWZpZWxkKSB7IHRocm93IG5ldyBFcnJvcignbXVzdCBjYWxsIHZhbGlkYXRlRmllbGQgd2l0aCB2YWxpZCBwcm9wIHN0cmluZyEnKTsgfVxuXG4gICAgICBmaWVsZC52YWxpZGF0ZSgnJywgY2IpO1xuICAgIH1cbiAgfVxufTsiXX0=
