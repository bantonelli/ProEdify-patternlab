define(['exports', './Input/Input', '../utils/dom', 'throttle-debounce/debounce'], function (exports, _Input, _dom, _debounce) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Input2 = _interopRequireDefault(_Input);

    var _debounce2 = _interopRequireDefault(_debounce);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var inputNumberTemplate = ' \n<div class="el-input-number"\n  :class="[\n    size ? \'el-input-number--\' + size : \'\',\n    { \'is-disabled\': disabled },\n    { \'is-without-controls\': !controls}\n  ]"\n>\n  <span\n    v-if="controls"\n    class="el-input-number__decrease"\n    :class="{\'is-disabled\': minDisabled}"\n    v-repeat-click="decrease"\n  >\n    <i class="el-icon-minus"></i>\n  </span>\n  <span\n    v-if="controls"\n    class="el-input-number__increase"\n    :class="{\'is-disabled\': maxDisabled}"\n    v-repeat-click="increase"\n  >\n    <i class="el-icon-plus"></i>\n  </span>\n  <pe-input\n    :value="currentValue"\n    @keydown.up.native.prevent="increase"\n    @keydown.down.native.prevent="decrease"\n    @blur="handleBlur"\n    @input="debounceHandleInput"\n    :disabled="disabled"\n    :size="size"\n    :max="max"\n    :min="min"\n    ref="input"\n  >\n      <template slot="prepend" v-if="$slots.prepend">\n        <slot name="prepend"></slot>\n      </template>\n      <template slot="append" v-if="$slots.append">\n        <slot name="append"></slot>\n      </template> \n  </el-input>\n</div>\n';

    exports.default = {
        name: 'InputNumber',
        directives: {
            repeatClick: {
                bind: function bind(el, binding, vnode) {
                    var interval = null;
                    var startTime = void 0;
                    var handler = function handler() {
                        return vnode.context[binding.expression].apply();
                    };
                    var clear = function clear() {
                        if (new Date() - startTime < 100) {
                            handler();
                        }
                        clearInterval(interval);
                        interval = null;
                    };

                    (0, _dom.on)(el, 'mousedown', function () {
                        startTime = new Date();
                        (0, _dom.once)(document, 'mouseup', clear);
                        clearInterval(interval);
                        interval = setInterval(handler, 100);
                    });
                }
            }
        },
        components: {
            'pe-input': _Input2.default
        },
        props: {
            step: {
                type: Number,
                default: 1
            },
            max: {
                type: Number,
                default: Infinity
            },
            min: {
                type: Number,
                default: -Infinity
            },
            value: {
                default: 0
            },
            disabled: Boolean,
            size: String,
            controls: {
                type: Boolean,
                default: true
            },
            debounce: {
                type: Number,
                default: 300
            }
        },
        data: function data() {
            return {
                currentValue: 0
            };
        },

        watch: {
            value: {
                immediate: true,
                handler: function handler(value) {
                    var newVal = Number(value);
                    if (isNaN(newVal)) return;
                    if (newVal >= this.max) newVal = this.max;
                    if (newVal <= this.min) newVal = this.min;
                    this.currentValue = newVal;
                    this.$emit('input', newVal);
                }
            }
        },
        computed: {
            minDisabled: function minDisabled() {
                return this._decrease(this.value, this.step) < this.min;
            },
            maxDisabled: function maxDisabled() {
                return this._increase(this.value, this.step) > this.max;
            },
            precision: function precision() {
                var value = this.value,
                    step = this.step,
                    getPrecision = this.getPrecision;

                return Math.max(getPrecision(value), getPrecision(step));
            }
        },
        methods: {
            toPrecision: function toPrecision(num, precision) {
                if (precision === undefined) precision = this.precision;
                return parseFloat(parseFloat(Number(num).toFixed(precision)));
            },
            getPrecision: function getPrecision(value) {
                var valueString = value.toString();
                var dotPosition = valueString.indexOf('.');
                var precision = 0;
                if (dotPosition !== -1) {
                    precision = valueString.length - dotPosition - 1;
                }
                return precision;
            },
            _increase: function _increase(val, step) {
                if (typeof val !== 'number') return this.currentValue;

                var precisionFactor = Math.pow(10, this.precision);

                return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
            },
            _decrease: function _decrease(val, step) {
                if (typeof val !== 'number') return this.currentValue;

                var precisionFactor = Math.pow(10, this.precision);

                return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
            },
            increase: function increase() {
                if (this.disabled || this.maxDisabled) return;
                var value = this.value || 0;
                var newVal = this._increase(value, this.step);
                if (newVal > this.max) return;
                this.setCurrentValue(newVal);
            },
            decrease: function decrease() {
                if (this.disabled || this.minDisabled) return;
                var value = this.value || 0;
                var newVal = this._decrease(value, this.step);
                if (newVal < this.min) return;
                this.setCurrentValue(newVal);
            },
            handleBlur: function handleBlur() {
                this.$refs.input.setCurrentValue(this.currentValue);
            },
            setCurrentValue: function setCurrentValue(newVal) {
                var oldVal = this.currentValue;
                if (newVal >= this.max) newVal = this.max;
                if (newVal <= this.min) newVal = this.min;
                if (oldVal === newVal) {
                    this.$refs.input.setCurrentValue(this.currentValue);
                    return;
                }
                this.$emit('change', newVal, oldVal);
                this.$emit('input', newVal);
                this.currentValue = newVal;
            },
            handleInput: function handleInput(value) {
                if (value === '') {
                    return;
                }
                var newVal = Number(value);
                if (!isNaN(newVal)) {
                    this.setCurrentValue(newVal);
                } else {
                    this.$refs.input.setCurrentValue(this.currentValue);
                }
            }
        },
        created: function created() {
            var _this = this;

            this.debounceHandleInput = (0, _debounce2.default)(this.debounce, function (value) {
                _this.handleInput(value);
            });
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dE51bWJlci5qcyJdLCJuYW1lcyI6WyJpbnB1dE51bWJlclRlbXBsYXRlIiwibmFtZSIsImRpcmVjdGl2ZXMiLCJyZXBlYXRDbGljayIsImJpbmQiLCJlbCIsImJpbmRpbmciLCJ2bm9kZSIsImludGVydmFsIiwic3RhcnRUaW1lIiwiaGFuZGxlciIsImNvbnRleHQiLCJleHByZXNzaW9uIiwiYXBwbHkiLCJjbGVhciIsIkRhdGUiLCJjbGVhckludGVydmFsIiwiZG9jdW1lbnQiLCJzZXRJbnRlcnZhbCIsImNvbXBvbmVudHMiLCJwcm9wcyIsInN0ZXAiLCJ0eXBlIiwiTnVtYmVyIiwiZGVmYXVsdCIsIm1heCIsIkluZmluaXR5IiwibWluIiwidmFsdWUiLCJkaXNhYmxlZCIsIkJvb2xlYW4iLCJzaXplIiwiU3RyaW5nIiwiY29udHJvbHMiLCJkZWJvdW5jZSIsImRhdGEiLCJjdXJyZW50VmFsdWUiLCJ3YXRjaCIsImltbWVkaWF0ZSIsIm5ld1ZhbCIsImlzTmFOIiwiJGVtaXQiLCJjb21wdXRlZCIsIm1pbkRpc2FibGVkIiwiX2RlY3JlYXNlIiwibWF4RGlzYWJsZWQiLCJfaW5jcmVhc2UiLCJwcmVjaXNpb24iLCJnZXRQcmVjaXNpb24iLCJNYXRoIiwibWV0aG9kcyIsInRvUHJlY2lzaW9uIiwibnVtIiwidW5kZWZpbmVkIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJ2YWx1ZVN0cmluZyIsInRvU3RyaW5nIiwiZG90UG9zaXRpb24iLCJpbmRleE9mIiwibGVuZ3RoIiwidmFsIiwicHJlY2lzaW9uRmFjdG9yIiwicG93IiwiaW5jcmVhc2UiLCJzZXRDdXJyZW50VmFsdWUiLCJkZWNyZWFzZSIsImhhbmRsZUJsdXIiLCIkcmVmcyIsImlucHV0Iiwib2xkVmFsIiwiaGFuZGxlSW5wdXQiLCJjcmVhdGVkIiwiZGVib3VuY2VIYW5kbGVJbnB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFNQSx1bUNBQU47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QUFkO0FBQ3hCLG9CQUFJMkMsV0FBVy9CLE1BQWYsRUFBdUI7QUFDbkIseUJBQUs2QixLQUFMLENBQVdDLEtBQVgsQ0FBaUJKLGVBQWpCLENBQWlDLEtBQUs3QixZQUF0QztBQUNBO0FBQ0g7QUFDRCxxQkFBS0ssS0FBTCxDQUFXLFFBQVgsRUFBcUJGLE1BQXJCLEVBQTZCK0IsTUFBN0I7QUFDQSxxQkFBSzdCLEtBQUwsQ0FBVyxPQUFYLEVBQW9CRixNQUFwQjtBQUNBLHFCQUFLSCxZQUFMLEdBQW9CRyxNQUFwQjtBQUNILGFBeERJO0FBeURMZ0MsdUJBekRLLHVCQXlETzNDLEtBekRQLEVBeURjO0FBQ2Ysb0JBQUlBLFVBQVUsRUFBZCxFQUFrQjtBQUNkO0FBQ0g7QUFDRCxvQkFBTVcsU0FBU2hCLE9BQU9LLEtBQVAsQ0FBZjtBQUNBLG9CQUFJLENBQUNZLE1BQU1ELE1BQU4sQ0FBTCxFQUFvQjtBQUNoQix5QkFBSzBCLGVBQUwsQ0FBcUIxQixNQUFyQjtBQUNILGlCQUZELE1BRU87QUFDSCx5QkFBSzZCLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQkosZUFBakIsQ0FBaUMsS0FBSzdCLFlBQXRDO0FBQ0g7QUFDSjtBQW5FSSxTQXJGRTtBQTBKWG9DLGVBMUpXLHFCQTBKRDtBQUFBOztBQUNOLGlCQUFLQyxtQkFBTCxHQUEyQix3QkFBUyxLQUFLdkMsUUFBZCxFQUF3QixpQkFBUztBQUN4RCxzQkFBS3FDLFdBQUwsQ0FBaUIzQyxLQUFqQjtBQUNILGFBRjBCLENBQTNCO0FBR0g7QUE5SlUsSyIsImZpbGUiOiJhcHAvYXRvbXMvSW5wdXROdW1iZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpbnB1dE51bWJlclRlbXBsYXRlID0gYCBcbjxkaXYgY2xhc3M9XCJlbC1pbnB1dC1udW1iZXJcIlxuICA6Y2xhc3M9XCJbXG4gICAgc2l6ZSA/ICdlbC1pbnB1dC1udW1iZXItLScgKyBzaXplIDogJycsXG4gICAgeyAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZCB9LFxuICAgIHsgJ2lzLXdpdGhvdXQtY29udHJvbHMnOiAhY29udHJvbHN9XG4gIF1cIlxuPlxuICA8c3BhblxuICAgIHYtaWY9XCJjb250cm9sc1wiXG4gICAgY2xhc3M9XCJlbC1pbnB1dC1udW1iZXJfX2RlY3JlYXNlXCJcbiAgICA6Y2xhc3M9XCJ7J2lzLWRpc2FibGVkJzogbWluRGlzYWJsZWR9XCJcbiAgICB2LXJlcGVhdC1jbGljaz1cImRlY3JlYXNlXCJcbiAgPlxuICAgIDxpIGNsYXNzPVwiZWwtaWNvbi1taW51c1wiPjwvaT5cbiAgPC9zcGFuPlxuICA8c3BhblxuICAgIHYtaWY9XCJjb250cm9sc1wiXG4gICAgY2xhc3M9XCJlbC1pbnB1dC1udW1iZXJfX2luY3JlYXNlXCJcbiAgICA6Y2xhc3M9XCJ7J2lzLWRpc2FibGVkJzogbWF4RGlzYWJsZWR9XCJcbiAgICB2LXJlcGVhdC1jbGljaz1cImluY3JlYXNlXCJcbiAgPlxuICAgIDxpIGNsYXNzPVwiZWwtaWNvbi1wbHVzXCI+PC9pPlxuICA8L3NwYW4+XG4gIDxwZS1pbnB1dFxuICAgIDp2YWx1ZT1cImN1cnJlbnRWYWx1ZVwiXG4gICAgQGtleWRvd24udXAubmF0aXZlLnByZXZlbnQ9XCJpbmNyZWFzZVwiXG4gICAgQGtleWRvd24uZG93bi5uYXRpdmUucHJldmVudD1cImRlY3JlYXNlXCJcbiAgICBAYmx1cj1cImhhbmRsZUJsdXJcIlxuICAgIEBpbnB1dD1cImRlYm91bmNlSGFuZGxlSW5wdXRcIlxuICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICA6c2l6ZT1cInNpemVcIlxuICAgIDptYXg9XCJtYXhcIlxuICAgIDptaW49XCJtaW5cIlxuICAgIHJlZj1cImlucHV0XCJcbiAgPlxuICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwcmVwZW5kXCIgdi1pZj1cIiRzbG90cy5wcmVwZW5kXCI+XG4gICAgICAgIDxzbG90IG5hbWU9XCJwcmVwZW5kXCI+PC9zbG90PlxuICAgICAgPC90ZW1wbGF0ZT5cbiAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgICAgPHNsb3QgbmFtZT1cImFwcGVuZFwiPjwvc2xvdD5cbiAgICAgIDwvdGVtcGxhdGU+IFxuICA8L2VsLWlucHV0PlxuPC9kaXY+XG5gO1xuXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi9JbnB1dC9JbnB1dCc7XG5pbXBvcnQgeyBvbmNlLCBvbiB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ0lucHV0TnVtYmVyJyxcbiAgICBkaXJlY3RpdmVzOiB7XG4gICAgICAgIHJlcGVhdENsaWNrOiB7XG4gICAgICAgICAgICBiaW5kKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4gdm5vZGUuY29udGV4dFtiaW5kaW5nLmV4cHJlc3Npb25dLmFwcGx5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXcgRGF0ZSgpIC0gc3RhcnRUaW1lIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgb24oZWwsICdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIG9uY2UoZG9jdW1lbnQsICdtb3VzZXVwJywgY2xlYXIpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChoYW5kbGVyLCAxMDApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdwZS1pbnB1dCc6IElucHV0XG4gICAgfSxcbiAgICBwcm9wczoge1xuICAgICAgICBzdGVwOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIG1heDoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogSW5maW5pdHlcbiAgICAgICAgfSxcbiAgICAgICAgbWluOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiAtSW5maW5pdHlcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgICAgIHNpemU6IFN0cmluZyxcbiAgICAgICAgY29udHJvbHM6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiAzMDBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTogMFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgd2F0Y2g6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZXIodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3VmFsID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4obmV3VmFsKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgPj0gdGhpcy5tYXgpIG5ld1ZhbCA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgPD0gdGhpcy5taW4pIG5ld1ZhbCA9IHRoaXMubWluO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gbmV3VmFsO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgbWluRGlzYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVjcmVhc2UodGhpcy52YWx1ZSwgdGhpcy5zdGVwKSA8IHRoaXMubWluO1xuICAgICAgICB9LFxuICAgICAgICBtYXhEaXNhYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmNyZWFzZSh0aGlzLnZhbHVlLCB0aGlzLnN0ZXApID4gdGhpcy5tYXg7XG4gICAgICAgIH0sXG4gICAgICAgIHByZWNpc2lvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsdWUsIHN0ZXAsIGdldFByZWNpc2lvbiB9ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChnZXRQcmVjaXNpb24odmFsdWUpLCBnZXRQcmVjaXNpb24oc3RlcCkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIHRvUHJlY2lzaW9uKG51bSwgcHJlY2lzaW9uKSB7XG4gICAgICAgICAgICBpZiAocHJlY2lzaW9uID09PSB1bmRlZmluZWQpIHByZWNpc2lvbiA9IHRoaXMucHJlY2lzaW9uO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQocGFyc2VGbG9hdChOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UHJlY2lzaW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZVN0cmluZyA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCBkb3RQb3NpdGlvbiA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgIGxldCBwcmVjaXNpb24gPSAwO1xuICAgICAgICAgICAgaWYgKGRvdFBvc2l0aW9uICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRvdFBvc2l0aW9uIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmVjaXNpb247XG4gICAgICAgIH0sXG4gICAgICAgIF9pbmNyZWFzZSh2YWwsIHN0ZXApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMuY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCBwcmVjaXNpb25GYWN0b3IgPSBNYXRoLnBvdygxMCwgdGhpcy5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b1ByZWNpc2lvbigocHJlY2lzaW9uRmFjdG9yICogdmFsICsgcHJlY2lzaW9uRmFjdG9yICogc3RlcCkgLyBwcmVjaXNpb25GYWN0b3IpO1xuICAgICAgICB9LFxuICAgICAgICBfZGVjcmVhc2UodmFsLCBzdGVwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ251bWJlcicpIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgcHJlY2lzaW9uRmFjdG9yID0gTWF0aC5wb3coMTAsIHRoaXMucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9QcmVjaXNpb24oKHByZWNpc2lvbkZhY3RvciAqIHZhbCAtIHByZWNpc2lvbkZhY3RvciAqIHN0ZXApIC8gcHJlY2lzaW9uRmFjdG9yKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLm1heERpc2FibGVkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWUgfHwgMDtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMuX2luY3JlYXNlKHZhbHVlLCB0aGlzLnN0ZXApO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbCA+IHRoaXMubWF4KSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRWYWx1ZShuZXdWYWwpO1xuICAgICAgICB9LFxuICAgICAgICBkZWNyZWFzZSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMubWluRGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZSB8fCAwO1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsID0gdGhpcy5fZGVjcmVhc2UodmFsdWUsIHRoaXMuc3RlcCk7XG4gICAgICAgICAgICBpZiAobmV3VmFsIDwgdGhpcy5taW4pIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKG5ld1ZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZUJsdXIoKSB7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnNldEN1cnJlbnRWYWx1ZSh0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEN1cnJlbnRWYWx1ZShuZXdWYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbCA9IHRoaXMuY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbCA+PSB0aGlzLm1heCkgbmV3VmFsID0gdGhpcy5tYXg7XG4gICAgICAgICAgICBpZiAobmV3VmFsIDw9IHRoaXMubWluKSBuZXdWYWwgPSB0aGlzLm1pbjtcbiAgICAgICAgICAgIGlmIChvbGRWYWwgPT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2V0Q3VycmVudFZhbHVlKHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdWYWwsIG9sZFZhbCk7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IG5ld1ZhbDtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlSW5wdXQodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdWYWwgPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYgKCFpc05hTihuZXdWYWwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWUobmV3VmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5pbnB1dC5zZXRDdXJyZW50VmFsdWUodGhpcy5jdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjcmVhdGVkKCkge1xuICAgICAgICB0aGlzLmRlYm91bmNlSGFuZGxlSW5wdXQgPSBkZWJvdW5jZSh0aGlzLmRlYm91bmNlLCB2YWx1ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUlucHV0KHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
