define(['exports', 'async-validator', '../../utils/mixins/emitter'], function (exports, _asyncValidator, _emitter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

  var _emitter2 = _interopRequireDefault(_emitter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var formItemTemplate = '\n<div class="form-item" :class="{\n  \'is-error\': validateState === \'error\',\n  \'is-validating\': validateState === \'validating\',\n  \'is-required\': isRequired || required\n}">\n  <label :for="prop" class="form-item__label" v-bind:style="labelStyle" v-if="label">\n    <slot name="label">{{label + form.labelSuffix}}</slot>\n  </label>\n  <div class="form-item__content" v-bind:style="contentStyle">\n    <!-- The input item slots in here -->\n    <slot></slot>\n    <!-- The validation error message -->\n    <div class="form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage">{{validateMessage}}</div>\n  </div>\n</div>\n';

  function noop() {}

  function getPropByPath(obj, path) {
    // obj == model (the object that contains all form-item props)
    // path == the string of the prop to validate 
    var tempObj = obj;

    // convert indexes to properties: object[index] --> object.index
    // Replace all alphanumeric characters between brackets 
    // with a period preceding the same chars ($1)          
    path = path.replace(/\[(\w+)\]/g, '.$1');

    // Remove leading period: .stuff --> stuff
    path = path.replace(/^\./, '');

    // Create new array 
    // Each index of this array is a piece of path string 
    // when path is split at each period  
    var keyArr = path.split('.');
    var i = 0;

    for (var len = keyArr.length; i < len - 1; ++i) {
      var key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        throw new Error('please transfer a valid prop path to form item!');
      }
    }
    return {
      o: tempObj,
      k: keyArr[i],
      v: tempObj[keyArr[i]]
    };
  }

  exports.default = {
    name: 'FormItem',

    template: formItemTemplate,

    componentName: 'FormItem',

    mixins: [_emitter2.default],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      error: function error(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      },
      validateStatus: function validateStatus(value) {
        this.validateState = value;
      }
    },
    computed: {
      labelStyle: function labelStyle() {
        var ret = {};
        if (this.form.labelPosition === 'top') return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.width = labelWidth;
        }
        return ret;
      },
      contentStyle: function contentStyle() {
        var ret = {};
        if (this.form.labelPosition === 'top' || this.form.inline) return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.marginLeft = labelWidth;
        }
        return ret;
      },
      form: function form() {
        var parent = this.$parent;
        while (parent.$options.componentName !== 'Form') {
          parent = parent.$parent;
        }
        return parent;
      },

      // Value used to validate against. 
      fieldValue: {
        cache: false,
        get: function get() {
          // When field value is accessed the model used here is just an alias of the parent's model. 
          var model = this.form.model;

          // If no parent and no prop property return nothing.
          // this.prop is used when there is validation            
          if (!model || !this.prop) {
            return;
          }

          // prop is the dataProp from the Vue form that should be validated by the form-item
          // set path to be this prop. (Example: "name")   
          var path = this.prop;

          // If path has a colon replace it with a . 
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }

          // Pass model (the object that contains all form-item props)
          // Pass path (the string of the prop to validate)           
          return getPropByPath(model, path).v;
        }
      }
    },
    data: function data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isRequired: false
      };
    },

    methods: {
      validate: function validate(trigger) {
        var _this = this;

        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        var rules = this.getFilteredRule(trigger);
        if (!rules || rules.length === 0) {
          callback();
          return true;
        }

        this.validateState = 'validating';

        var descriptor = {};
        descriptor[this.prop] = rules;

        var validator = new _asyncValidator2.default(descriptor);
        var model = {};

        model[this.prop] = this.fieldValue;

        validator.validate(model, { firstFields: true }, function (errors, fields) {
          _this.validateState = !errors ? 'success' : 'error';
          _this.validateMessage = errors ? errors[0].message : '';

          callback(_this.validateMessage);
        });
      },
      resetField: function resetField() {
        this.validateState = '';
        this.validateMessage = '';

        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        var prop = getPropByPath(model, path);

        if (Array.isArray(value)) {
          this.validateDisabled = true;
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          this.validateDisabled = true;
          prop.o[prop.k] = this.initialValue;
        }
      },
      getRules: function getRules() {
        var formRules = this.form.rules;
        var selfRuels = this.rules;

        formRules = formRules ? formRules[this.prop] : [];

        return [].concat(selfRuels || formRules || []);
      },
      getFilteredRule: function getFilteredRule(trigger) {
        var rules = this.getRules();

        return rules.filter(function (rule) {
          return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
        });
      },
      onFieldBlur: function onFieldBlur() {
        this.validate('blur');
      },
      onFieldChange: function onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }

        this.validate('change');
      }
    },
    mounted: function mounted() {
      var _this2 = this;

      if (this.prop) {
        this.dispatch('Form', 'form.addField', [this]);

        var initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        var rules = this.getRules();

        if (rules.length) {
          rules.every(function (rule) {
            if (rule.required) {
              _this2.isRequired = true;
              return false;
            }
          });
          this.$on('form.blur', this.onFieldBlur);
          this.$on('form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.dispatch('Form', 'form.removeField', [this]);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9vcmdhbmlzbXMvRm9ybS9Gb3JtSXRlbS5qcyJdLCJuYW1lcyI6WyJmb3JtSXRlbVRlbXBsYXRlIiwibm9vcCIsImdldFByb3BCeVBhdGgiLCJvYmoiLCJwYXRoIiwidGVtcE9iaiIsInJlcGxhY2UiLCJrZXlBcnIiLCJzcGxpdCIsImkiLCJsZW4iLCJsZW5ndGgiLCJrZXkiLCJFcnJvciIsIm8iLCJrIiwidiIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudE5hbWUiLCJtaXhpbnMiLCJwcm9wcyIsImxhYmVsIiwiU3RyaW5nIiwibGFiZWxXaWR0aCIsInByb3AiLCJyZXF1aXJlZCIsIkJvb2xlYW4iLCJydWxlcyIsIk9iamVjdCIsIkFycmF5IiwiZXJyb3IiLCJ2YWxpZGF0ZVN0YXR1cyIsInNob3dNZXNzYWdlIiwidHlwZSIsImRlZmF1bHQiLCJ3YXRjaCIsInZhbHVlIiwidmFsaWRhdGVNZXNzYWdlIiwidmFsaWRhdGVTdGF0ZSIsImNvbXB1dGVkIiwibGFiZWxTdHlsZSIsInJldCIsImZvcm0iLCJsYWJlbFBvc2l0aW9uIiwid2lkdGgiLCJjb250ZW50U3R5bGUiLCJpbmxpbmUiLCJtYXJnaW5MZWZ0IiwicGFyZW50IiwiJHBhcmVudCIsIiRvcHRpb25zIiwiZmllbGRWYWx1ZSIsImNhY2hlIiwiZ2V0IiwibW9kZWwiLCJpbmRleE9mIiwiZGF0YSIsInZhbGlkYXRlRGlzYWJsZWQiLCJ2YWxpZGF0b3IiLCJpc1JlcXVpcmVkIiwibWV0aG9kcyIsInZhbGlkYXRlIiwidHJpZ2dlciIsImNhbGxiYWNrIiwiZ2V0RmlsdGVyZWRSdWxlIiwiZGVzY3JpcHRvciIsImZpcnN0RmllbGRzIiwiZXJyb3JzIiwiZmllbGRzIiwibWVzc2FnZSIsInJlc2V0RmllbGQiLCJpc0FycmF5IiwiY29uY2F0IiwiaW5pdGlhbFZhbHVlIiwiZ2V0UnVsZXMiLCJmb3JtUnVsZXMiLCJzZWxmUnVlbHMiLCJmaWx0ZXIiLCJydWxlIiwib25GaWVsZEJsdXIiLCJvbkZpZWxkQ2hhbmdlIiwibW91bnRlZCIsImRpc3BhdGNoIiwiZGVmaW5lUHJvcGVydHkiLCJldmVyeSIsIiRvbiIsImJlZm9yZURlc3Ryb3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBSUEsNHFCQUFKOztBQWtCQSxXQUFTQyxJQUFULEdBQWdCLENBQUU7O0FBRWxCLFdBQVNDLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQTRCQyxJQUE1QixFQUFrQztBQUNoQztBQUNBO0FBQ0EsUUFBSUMsVUFBVUYsR0FBZDs7QUFFQTtBQUNFO0FBQ0E7QUFDRkMsV0FBT0EsS0FBS0UsT0FBTCxDQUFhLFlBQWIsRUFBMkIsS0FBM0IsQ0FBUDs7QUFFQTtBQUNBRixXQUFPQSxLQUFLRSxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQixDQUFQOztBQUVBO0FBQ0E7QUFDRTtBQUNGLFFBQUlDLFNBQVNILEtBQUtJLEtBQUwsQ0FBVyxHQUFYLENBQWI7QUFDQSxRQUFJQyxJQUFJLENBQVI7O0FBRUEsU0FBSyxJQUFJQyxNQUFNSCxPQUFPSSxNQUF0QixFQUE4QkYsSUFBSUMsTUFBTSxDQUF4QyxFQUEyQyxFQUFFRCxDQUE3QyxFQUFnRDtBQUM5QyxVQUFJRyxNQUFNTCxPQUFPRSxDQUFQLENBQVY7QUFDQSxVQUFJRyxPQUFPUCxPQUFYLEVBQW9CO0FBQ2xCQSxrQkFBVUEsUUFBUU8sR0FBUixDQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxJQUFJQyxLQUFKLENBQVUsaURBQVYsQ0FBTjtBQUNEO0FBQ0Y7QUFDRCxXQUFPO0FBQ0xDLFNBQUdULE9BREU7QUFFTFUsU0FBR1IsT0FBT0UsQ0FBUCxDQUZFO0FBR0xPLFNBQUdYLFFBQVFFLE9BQU9FLENBQVAsQ0FBUjtBQUhFLEtBQVA7QUFLRDs7b0JBRWM7QUFDYlEsVUFBTSxVQURPOztBQUdiQyxjQUFVbEIsZ0JBSEc7O0FBS2JtQixtQkFBZSxVQUxGOztBQU9iQyxZQUFRLG1CQVBLOztBQVNiQyxXQUFPO0FBQ0xDLGFBQU9DLE1BREY7QUFFTEMsa0JB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MEQsUUFBTCxDQUFjLE1BQWQsRUFBc0IsZUFBdEIsRUFBdUMsQ0FBQyxJQUFELENBQXZDOztBQUVBLFlBQUlULGVBQWUsS0FBS3RCLFVBQXhCO0FBQ0EsWUFBSXRCLE1BQU0wQyxPQUFOLENBQWNFLFlBQWQsQ0FBSixFQUFpQztBQUMvQkEseUJBQWUsR0FBR0QsTUFBSCxDQUFVQyxZQUFWLENBQWY7QUFDRDtBQUNEN0MsZUFBT3VELGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsY0FBNUIsRUFBNEM7QUFDMUMvQyxpQkFBT3FDO0FBRG1DLFNBQTVDOztBQUlBLFlBQUk5QyxRQUFRLEtBQUsrQyxRQUFMLEVBQVo7O0FBRUEsWUFBSS9DLE1BQU1qQixNQUFWLEVBQWtCO0FBQ2hCaUIsZ0JBQU15RCxLQUFOLENBQVksZ0JBQVE7QUFDbEIsZ0JBQUlOLEtBQUtyRCxRQUFULEVBQW1CO0FBQ2pCLHFCQUFLa0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLHFCQUFPLEtBQVA7QUFDRDtBQUNGLFdBTEQ7QUFNQSxlQUFLMEIsR0FBTCxDQUFTLFdBQVQsRUFBc0IsS0FBS04sV0FBM0I7QUFDQSxlQUFLTSxHQUFMLENBQVMsYUFBVCxFQUF3QixLQUFLTCxhQUE3QjtBQUNEO0FBQ0Y7QUFDRixLQXZNWTtBQXdNYk0saUJBeE1hLDJCQXdNRztBQUNkLFdBQUtKLFFBQUwsQ0FBYyxNQUFkLEVBQXNCLGtCQUF0QixFQUEwQyxDQUFDLElBQUQsQ0FBMUM7QUFDRDtBQTFNWSxHIiwiZmlsZSI6ImFwcC9vcmdhbmlzbXMvRm9ybS9Gb3JtSXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3luY1ZhbGlkYXRvciBmcm9tICdhc3luYy12YWxpZGF0b3InO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvbWl4aW5zL2VtaXR0ZXInO1xuXG5sZXQgZm9ybUl0ZW1UZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJmb3JtLWl0ZW1cIiA6Y2xhc3M9XCJ7XG4gICdpcy1lcnJvcic6IHZhbGlkYXRlU3RhdGUgPT09ICdlcnJvcicsXG4gICdpcy12YWxpZGF0aW5nJzogdmFsaWRhdGVTdGF0ZSA9PT0gJ3ZhbGlkYXRpbmcnLFxuICAnaXMtcmVxdWlyZWQnOiBpc1JlcXVpcmVkIHx8IHJlcXVpcmVkXG59XCI+XG4gIDxsYWJlbCA6Zm9yPVwicHJvcFwiIGNsYXNzPVwiZm9ybS1pdGVtX19sYWJlbFwiIHYtYmluZDpzdHlsZT1cImxhYmVsU3R5bGVcIiB2LWlmPVwibGFiZWxcIj5cbiAgICA8c2xvdCBuYW1lPVwibGFiZWxcIj57e2xhYmVsICsgZm9ybS5sYWJlbFN1ZmZpeH19PC9zbG90PlxuICA8L2xhYmVsPlxuICA8ZGl2IGNsYXNzPVwiZm9ybS1pdGVtX19jb250ZW50XCIgdi1iaW5kOnN0eWxlPVwiY29udGVudFN0eWxlXCI+XG4gICAgPCEtLSBUaGUgaW5wdXQgaXRlbSBzbG90cyBpbiBoZXJlIC0tPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgICA8IS0tIFRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2UgLS0+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0taXRlbV9fZXJyb3JcIiB2LWlmPVwidmFsaWRhdGVTdGF0ZSA9PT0gJ2Vycm9yJyAmJiBzaG93TWVzc2FnZSAmJiBmb3JtLnNob3dNZXNzYWdlXCI+e3t2YWxpZGF0ZU1lc3NhZ2V9fTwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmZ1bmN0aW9uIGdldFByb3BCeVBhdGgob2JqLCBwYXRoKSB7XG4gIC8vIG9iaiA9PSBtb2RlbCAodGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCBmb3JtLWl0ZW0gcHJvcHMpXG4gIC8vIHBhdGggPT0gdGhlIHN0cmluZyBvZiB0aGUgcHJvcCB0byB2YWxpZGF0ZSBcbiAgbGV0IHRlbXBPYmogPSBvYmo7XG5cbiAgLy8gY29udmVydCBpbmRleGVzIHRvIHByb3BlcnRpZXM6IG9iamVjdFtpbmRleF0gLS0+IG9iamVjdC5pbmRleFxuICAgIC8vIFJlcGxhY2UgYWxsIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGJldHdlZW4gYnJhY2tldHMgXG4gICAgLy8gd2l0aCBhIHBlcmlvZCBwcmVjZWRpbmcgdGhlIHNhbWUgY2hhcnMgKCQxKSAgICAgICAgICBcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csICcuJDEnKTtcblxuICAvLyBSZW1vdmUgbGVhZGluZyBwZXJpb2Q6IC5zdHVmZiAtLT4gc3R1ZmZcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLi8sICcnKTtcblxuICAvLyBDcmVhdGUgbmV3IGFycmF5IFxuICAvLyBFYWNoIGluZGV4IG9mIHRoaXMgYXJyYXkgaXMgYSBwaWVjZSBvZiBwYXRoIHN0cmluZyBcbiAgICAvLyB3aGVuIHBhdGggaXMgc3BsaXQgYXQgZWFjaCBwZXJpb2QgIFxuICBsZXQga2V5QXJyID0gcGF0aC5zcGxpdCgnLicpO1xuICBsZXQgaSA9IDA7XG5cbiAgZm9yIChsZXQgbGVuID0ga2V5QXJyLmxlbmd0aDsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgIGxldCBrZXkgPSBrZXlBcnJbaV07XG4gICAgaWYgKGtleSBpbiB0ZW1wT2JqKSB7XG4gICAgICB0ZW1wT2JqID0gdGVtcE9ialtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSB0cmFuc2ZlciBhIHZhbGlkIHByb3AgcGF0aCB0byBmb3JtIGl0ZW0hJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbzogdGVtcE9iaixcbiAgICBrOiBrZXlBcnJbaV0sXG4gICAgdjogdGVtcE9ialtrZXlBcnJbaV1dXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0Zvcm1JdGVtJyxcblxuICB0ZW1wbGF0ZTogZm9ybUl0ZW1UZW1wbGF0ZSxcblxuICBjb21wb25lbnROYW1lOiAnRm9ybUl0ZW0nLFxuXG4gIG1peGluczogW2VtaXR0ZXJdLFxuXG4gIHByb3BzOiB7XG4gICAgbGFiZWw6IFN0cmluZyxcbiAgICBsYWJlbFdpZHRoOiBTdHJpbmcsXG4gICAgcHJvcDogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiBCb29sZWFuLFxuICAgIHJ1bGVzOiBbT2JqZWN0LCBBcnJheV0sXG4gICAgZXJyb3I6IFN0cmluZyxcbiAgICB2YWxpZGF0ZVN0YXR1czogU3RyaW5nLFxuICAgIHNob3dNZXNzYWdlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICAvLyBFcnJvciBtZXNzYWdlIHRvIHNob3cgZm9yIHRoZSBmb3JtIGl0ZW1cbiAgICAgIC8vIFVwZGF0ZXMgdmFsaWRhdGVNZXNzYWdlXG4gICAgLy8gKioqIE5PVEhJTkcgVE8gQ0hBTkdFXG4gICAgZXJyb3IodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVNZXNzYWdlID0gdmFsdWU7XG4gICAgICB0aGlzLnZhbGlkYXRlU3RhdGUgPSB2YWx1ZSA/ICdlcnJvcicgOiAnJztcbiAgICB9LFxuICAgIC8vICoqKiBOT1RISU5HIFRPIENIQU5HRSAgICAgIFxuICAgIHZhbGlkYXRlU3RhdHVzKHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlU3RhdGUgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgLy8gU2V0cyB1cCB0aGUgbGFiZWwgc3R5bGUgZm9yIHRoZSBmb3JtIGl0ZW0gZHluYW1pY2FsbHkgKGZvcm0taXRlbV9fbGFiZWwpXG4gICAgLy8gKioqIE5PVEhJTkcgVE8gQ0hBTkdFICAgXG4gICAgbGFiZWxTdHlsZSgpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGlmICh0aGlzLmZvcm0ubGFiZWxQb3NpdGlvbiA9PT0gJ3RvcCcpIHJldHVybiByZXQ7XG4gICAgICB2YXIgbGFiZWxXaWR0aCA9IHRoaXMubGFiZWxXaWR0aCB8fCB0aGlzLmZvcm0ubGFiZWxXaWR0aDtcbiAgICAgIGlmIChsYWJlbFdpZHRoKSB7XG4gICAgICAgIHJldC53aWR0aCA9IGxhYmVsV2lkdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBTZXRzIHVwIHRoZSBzdHlsZSBmb3IgdGhlIGlucHV0IHdyYXBwZXIuIChmb3JtLWl0ZW1fX2NvbnRlbnQpIFxuICAgIGNvbnRlbnRTdHlsZSgpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGlmICh0aGlzLmZvcm0ubGFiZWxQb3NpdGlvbiA9PT0gJ3RvcCcgfHwgdGhpcy5mb3JtLmlubGluZSkgcmV0dXJuIHJldDtcbiAgICAgIHZhciBsYWJlbFdpZHRoID0gdGhpcy5sYWJlbFdpZHRoIHx8IHRoaXMuZm9ybS5sYWJlbFdpZHRoO1xuICAgICAgaWYgKGxhYmVsV2lkdGgpIHtcbiAgICAgICAgcmV0Lm1hcmdpbkxlZnQgPSBsYWJlbFdpZHRoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIC8vIENvbXB1dGVkIHByb3AgdGhhdCByZXR1cm5zIHBhcmVudCBGb3JtIGNvbXBvbmVudC4gIFxuICAgIGZvcm0oKSB7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcy4kcGFyZW50O1xuICAgICAgd2hpbGUgKHBhcmVudC4kb3B0aW9ucy5jb21wb25lbnROYW1lICE9PSAnRm9ybScpIHtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50O1xuICAgIH0sXG4gICAgLy8gVmFsdWUgdXNlZCB0byB2YWxpZGF0ZSBhZ2FpbnN0LiBcbiAgICBmaWVsZFZhbHVlOiB7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBnZXQoKSB7XG4gICAgICAgIC8vIFdoZW4gZmllbGQgdmFsdWUgaXMgYWNjZXNzZWQgdGhlIG1vZGVsIHVzZWQgaGVyZSBpcyBqdXN0IGFuIGFsaWFzIG9mIHRoZSBwYXJlbnQncyBtb2RlbC4gXG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuZm9ybS5tb2RlbDtcblxuICAgICAgICAvLyBJZiBubyBwYXJlbnQgYW5kIG5vIHByb3AgcHJvcGVydHkgcmV0dXJuIG5vdGhpbmcuXG4gICAgICAgIC8vIHRoaXMucHJvcCBpcyB1c2VkIHdoZW4gdGhlcmUgaXMgdmFsaWRhdGlvbiAgICAgICAgICAgIFxuICAgICAgICBpZiAoIW1vZGVsIHx8ICF0aGlzLnByb3ApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gcHJvcCBpcyB0aGUgZGF0YVByb3AgZnJvbSB0aGUgVnVlIGZvcm0gdGhhdCBzaG91bGQgYmUgdmFsaWRhdGVkIGJ5IHRoZSBmb3JtLWl0ZW1cbiAgICAgICAgLy8gc2V0IHBhdGggdG8gYmUgdGhpcyBwcm9wLiAoRXhhbXBsZTogXCJuYW1lXCIpICAgXG4gICAgICAgIHZhciBwYXRoID0gdGhpcy5wcm9wO1xuXG4gICAgICAgIC8vIElmIHBhdGggaGFzIGEgY29sb24gcmVwbGFjZSBpdCB3aXRoIGEgLiBcbiAgICAgICAgaWYgKHBhdGguaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoLzovLCAnLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFzcyBtb2RlbCAodGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCBmb3JtLWl0ZW0gcHJvcHMpXG4gICAgICAgIC8vIFBhc3MgcGF0aCAodGhlIHN0cmluZyBvZiB0aGUgcHJvcCB0byB2YWxpZGF0ZSkgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gZ2V0UHJvcEJ5UGF0aChtb2RlbCwgcGF0aCkudjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRlU3RhdGU6ICcnLFxuICAgICAgdmFsaWRhdGVNZXNzYWdlOiAnJyxcbiAgICAgIHZhbGlkYXRlRGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgdmFsaWRhdG9yOiB7fSxcbiAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHZhbGlkYXRlKHRyaWdnZXIsIGNhbGxiYWNrID0gbm9vcCkge1xuICAgICAgdmFyIHJ1bGVzID0gdGhpcy5nZXRGaWx0ZXJlZFJ1bGUodHJpZ2dlcik7XG4gICAgICBpZiAoIXJ1bGVzIHx8IHJ1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52YWxpZGF0ZVN0YXRlID0gJ3ZhbGlkYXRpbmcnO1xuXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHt9O1xuICAgICAgZGVzY3JpcHRvclt0aGlzLnByb3BdID0gcnVsZXM7XG5cbiAgICAgIHZhciB2YWxpZGF0b3IgPSBuZXcgQXN5bmNWYWxpZGF0b3IoZGVzY3JpcHRvcik7XG4gICAgICB2YXIgbW9kZWwgPSB7fTtcblxuICAgICAgbW9kZWxbdGhpcy5wcm9wXSA9IHRoaXMuZmllbGRWYWx1ZTtcblxuICAgICAgdmFsaWRhdG9yLnZhbGlkYXRlKG1vZGVsLCB7IGZpcnN0RmllbGRzOiB0cnVlIH0sIChlcnJvcnMsIGZpZWxkcykgPT4ge1xuICAgICAgICB0aGlzLnZhbGlkYXRlU3RhdGUgPSAhZXJyb3JzID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJztcbiAgICAgICAgdGhpcy52YWxpZGF0ZU1lc3NhZ2UgPSBlcnJvcnMgPyBlcnJvcnNbMF0ubWVzc2FnZSA6ICcnO1xuXG4gICAgICAgIGNhbGxiYWNrKHRoaXMudmFsaWRhdGVNZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzZXRGaWVsZCgpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVTdGF0ZSA9ICcnO1xuICAgICAgdGhpcy52YWxpZGF0ZU1lc3NhZ2UgPSAnJztcblxuICAgICAgbGV0IG1vZGVsID0gdGhpcy5mb3JtLm1vZGVsO1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5maWVsZFZhbHVlO1xuICAgICAgbGV0IHBhdGggPSB0aGlzLnByb3A7XG4gICAgICBpZiAocGF0aC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoLzovLCAnLicpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcHJvcCA9IGdldFByb3BCeVBhdGgobW9kZWwsIHBhdGgpO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZURpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcHJvcC5vW3Byb3Aua10gPSBbXS5jb25jYXQodGhpcy5pbml0aWFsVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZURpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcHJvcC5vW3Byb3Aua10gPSB0aGlzLmluaXRpYWxWYWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFJ1bGVzKCkge1xuICAgICAgdmFyIGZvcm1SdWxlcyA9IHRoaXMuZm9ybS5ydWxlcztcbiAgICAgIHZhciBzZWxmUnVlbHMgPSB0aGlzLnJ1bGVzO1xuXG4gICAgICBmb3JtUnVsZXMgPSBmb3JtUnVsZXMgPyBmb3JtUnVsZXNbdGhpcy5wcm9wXSA6IFtdO1xuXG4gICAgICByZXR1cm4gW10uY29uY2F0KHNlbGZSdWVscyB8fCBmb3JtUnVsZXMgfHwgW10pO1xuICAgIH0sXG4gICAgZ2V0RmlsdGVyZWRSdWxlKHRyaWdnZXIpIHtcbiAgICAgIHZhciBydWxlcyA9IHRoaXMuZ2V0UnVsZXMoKTtcblxuICAgICAgcmV0dXJuIHJ1bGVzLmZpbHRlcihydWxlID0+IHtcbiAgICAgICAgcmV0dXJuICFydWxlLnRyaWdnZXIgfHwgcnVsZS50cmlnZ2VyLmluZGV4T2YodHJpZ2dlcikgIT09IC0xO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkZpZWxkQmx1cigpIHtcbiAgICAgIHRoaXMudmFsaWRhdGUoJ2JsdXInKTtcbiAgICB9LFxuICAgIG9uRmllbGRDaGFuZ2UoKSB7XG4gICAgICBpZiAodGhpcy52YWxpZGF0ZURpc2FibGVkKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsaWRhdGUoJ2NoYW5nZScpO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICBpZiAodGhpcy5wcm9wKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoKCdGb3JtJywgJ2Zvcm0uYWRkRmllbGQnLCBbdGhpc10pO1xuXG4gICAgICBsZXQgaW5pdGlhbFZhbHVlID0gdGhpcy5maWVsZFZhbHVlO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5pdGlhbFZhbHVlKSkge1xuICAgICAgICBpbml0aWFsVmFsdWUgPSBbXS5jb25jYXQoaW5pdGlhbFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaW5pdGlhbFZhbHVlJywge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFZhbHVlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHJ1bGVzID0gdGhpcy5nZXRSdWxlcygpO1xuXG4gICAgICBpZiAocnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJ1bGVzLmV2ZXJ5KHJ1bGUgPT4ge1xuICAgICAgICAgIGlmIChydWxlLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmlzUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJG9uKCdmb3JtLmJsdXInLCB0aGlzLm9uRmllbGRCbHVyKTtcbiAgICAgICAgdGhpcy4kb24oJ2Zvcm0uY2hhbmdlJywgdGhpcy5vbkZpZWxkQ2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXNwYXRjaCgnRm9ybScsICdmb3JtLnJlbW92ZUZpZWxkJywgW3RoaXNdKTtcbiAgfVxufTtcbiJdfQ==
