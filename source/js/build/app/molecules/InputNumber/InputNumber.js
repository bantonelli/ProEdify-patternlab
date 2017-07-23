define(['exports', '../InputField/InputField', '../../utils/dom', 'throttle-debounce/debounce'], function (exports, _InputField, _dom, _debounce) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _InputField2 = _interopRequireDefault(_InputField);

    var _debounce2 = _interopRequireDefault(_debounce);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var inputNumberTemplate = '\n<div class="input-number"\n    :class="[\n        modifierStyles,\n        {\'focus\': focused},\n        { \'is-disabled\': disabled },\n        { \'is-without-controls\': !controls}\n    ]"\n    >\n    <span\n        v-if="controls"\n        class="input-number__decrease"\n        :class="{\'is-disabled\': minDisabled}"\n        v-repeat-click="decrease"\n    >\n        <i class="icon-minus"></i>\n    </span>\n    <span\n        v-if="controls"\n        class="input-number__increase"\n        :class="{\'is-disabled\': maxDisabled}"\n        v-repeat-click="increase"\n    >\n        <i class="icon-plus"></i>\n    </span>\n    <input-field\n        :value="currentValue"\n        @keydown.up.native.prevent="increase"\n        @keydown.down.native.prevent="decrease"\n        @blur="handleBlur"\n        @focus="handleFocus"\n        @input="debounceHandleInput"\n        :disabled="disabled"\n        :size="size"\n        :max="max"\n        :min="min"\n        ref="inputField"\n    >\n        <template slot="prepend" v-if="$slots.prepend">\n            <slot name="prepend"></slot>\n        </template>\n        <template slot="append" v-if="$slots.append">\n            <slot name="append"></slot>\n        </template> \n    </input-field>\n</div>\n';

    exports.default = {
        name: 'InputNumber',
        template: inputNumberTemplate,
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
            'input-field': _InputField2.default
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
            },
            modifierStyles: {
                type: Array,
                default: null
            }
        },
        data: function data() {
            return {
                currentValue: 0,
                focused: false
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
                this.$refs.inputField.setCurrentValue(this.currentValue);
                this.focused = false;
            },
            setCurrentValue: function setCurrentValue(newVal) {
                var oldVal = this.currentValue;
                if (newVal >= this.max) newVal = this.max;
                if (newVal <= this.min) newVal = this.min;
                if (oldVal === newVal) {
                    this.$refs.inputField.setCurrentValue(this.currentValue);
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
                    this.$refs.inputField.setCurrentValue(this.currentValue);
                }
            },
            handleFocus: function handleFocus() {
                this.focused = true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2xlY3VsZXMvSW5wdXROdW1iZXIvSW5wdXROdW1iZXIuanMiXSwibmFtZXMiOlsiaW5wdXROdW1iZXJUZW1wbGF0ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsImRpcmVjdGl2ZXMiLCJyZXBlYXRDbGljayIsImJpbmQiLCJlbCIsImJpbmRpbmciLCJ2bm9kZSIsImludGVydmFsIiwic3RhcnRUaW1lIiwiaGFuZGxlciIsImNvbnRleHQiLCJleHByZXNzaW9uIiwiYXBwbHkiLCJjbGVhciIsIkRhdGUiLCJjbGVhckludGVydmFsIiwiZG9jdW1lbnQiLCJzZXRJbnRlcnZhbCIsImNvbXBvbmVudHMiLCJwcm9wcyIsInN0ZXAiLCJ0eXBlIiwiTnVtYmVyIiwiZGVmYXVsdCIsIm1heCIsIkluZmluaXR5IiwibWluIiwidmFsdWUiLCJkaXNhYmxlZCIsIkJvb2xlYW4iLCJzaXplIiwiU3RyaW5nIiwiY29udHJvbHMiLCJkZWJvdW5jZSIsIm1vZGlmaWVyU3R5bGVzIiwiQXJyYXkiLCJkYXRhIiwiY3VycmVudFZhbHVlIiwiZm9jdXNlZCIsIndhdGNoIiwiaW1tZWRpYXRlIiwibmV3VmFsIiwiaXNOYU4iLCIkZW1pdCIsImNvbXB1dGVkIiwibWluRGlzYWJsZWQiLCJfZGVjcmVhc2UiLCJtYXhEaXNhYmxlZCIsIl9pbmNyZWFzZSIsInByZWNpc2lvbiIsImdldFByZWNpc2lvbiIsIk1hdGgiLCJtZXRob2RzIiwidG9QcmVjaXNpb24iLCJudW0iLCJ1bmRlZmluZWQiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsInZhbHVlU3RyaW5nIiwidG9TdHJpbmciLCJkb3RQb3NpdGlvbiIsImluZGV4T2YiLCJsZW5ndGgiLCJ2YWwiLCJwcmVjaXNpb25GYWN0b3IiLCJwb3ciLCJpbmNyZWFzZSIsInNldEN1cnJlbnRWYWx1ZSIsImRlY3JlYXNlIiwiaGFuZGxlQmx1ciIsIiRyZWZzIiwiaW5wdXRGaWVsZCIsIm9sZFZhbCIsImhhbmRsZUlucHV0IiwiaGFuZGxlRm9jdXMiLCJjcmVhdGVkIiwiZGVib3VuY2VIYW5kbGVJbnB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxRQUFJQSx5d0NBQUo7O3NCQWdEZTtBQUNYQyxjQUFNLGFBREs7QUFFWEMsa0JBQVVGLG1CQUZDO0FBR1hHLG9CQUFZO0FBQ1JDLHlCQUFhO0FBQ1RDLG9CQURTLGdCQUNKQyxFQURJLEVBQ0FDLE9BREEsRUFDU0MsS0FEVCxFQUNnQjtBQUNyQix3QkFBSUMsV0FBVyxJQUFmO0FBQ0Esd0JBQUlDLGtCQUFKO0FBQ0Esd0JBQU1DLFVBQVUsU0FBVkEsT0FBVTtBQUFBLCtCQUFNSCxNQUFNSSxPQUFOLENBQWNMLFFBQVFNLFVBQXRCLEVBQWtDQyxLQUFsQyxFQUFOO0FBQUEscUJBQWhCO0FBQ0Esd0JBQU1DLFFBQVEsU0FBUkEsS0FBUSxHQUFNO0FBQ2hCLDRCQUFJLElBQUlDLElBQUosS0FBYU4sU0FBYixHQUF5QixHQUE3QixFQUFrQztBQUM5QkM7QUFDSDtBQUNETSxzQ0FBY1IsUUFBZDtBQUNBQSxtQ0FBVyxJQUFYO0FBQ0gscUJBTkQ7O0FBUUEsaUNBQUdILEVBQUgsRUFBTyxXQUFQLEVBQW9CLFlBQU07QUFDdEJJLG9DQUFZLElBQUlNLElBQUosRUFBWjtBQUNBLHVDQUFLRSxRQUFMLEVBQWUsU0FBZixFQUEwQkgsS0FBMUI7QUFDQUUsc0NBQWNSLFFBQWQ7QUFDQUEsbUNBQVdVLFlBQVlSLE9BQVosRUFBcUIsR0FBckIsQ0FBWDtBQUNILHFCQUxEO0FBTUg7QUFuQlE7QUFETCxTQUhEO0FBMEJYUyxvQkFBWTtBQUNSO0FBRFEsU0ExQkQ7QUE2QlhDLGVBQU87QUFDSEMsa0JBQU07QUFDRkMsc0JBQU1DLE1BREo7QUFFRkMseUJBQVM7QUFGUCxhQURIO0FBS0hDLGlCQUFLO0FBQ0RILHNCQUFNQyxNQURMO0FBRURDLHlCQUFTRTtBQUZSLGFBTEY7QUFTSEMsaUJBQUs7QUFDREwsc0JBQU1DLE1BREw7QUFFREMseUJBQVMsQ0FBQ0U7QUFGVCxhQVRGO0FBYUhFLG1CQUFPO0FBQ0hKLHlCQUFTO0FBRE4sYUFiSjtBQWdCSEssc0JBQVVDLE9BaEJQO0FBaUJIQyxrQkFBTUMsTUFqQkg7QUFrQkhDLHNCQUFVO0FBQ05YLHNCQUFNUSxPQURBO0FBRU5OLHlCQUFTO0FBRkgsYUFsQlA7QUFzQkhVLHNCQUFVO0FBQ05aLHNCQUFNQyxNQURBO0FBRU5DLHlCQUFTO0FBRkgsYUF0QlA7QUEwQkhXLDRCQUFnQjtBQUNaYixzQkFBTWMsS0FETTtBQUVaWix5QkFBUztBQUZHO0FBMUJiLFNBN0JJO0FBNERYYSxZQTVEVyxrQkE0REo7QUFDSCxtQkFBTztBQUNIQyw4QkFBYyxDQURYO0FBRUhDLHlCQUFTO0FBRk4sYUFBUDtBQUlILFNBakVVOztBQWtFWEMsZUFBTztBQUNIWixtQkFBTztBQUNIYSwyQkFBVyxJQURSO0FBRUgvQix1QkFGRyxtQkFFS2tCLEtBRkwsRUFFWTtBQUNYLHdCQUFJYyxTQUFTbkIsT0FBT0ssS0FBUCxDQUFiO0FBQ0Esd0JBQUllLE1BQU1ELE1BQU4sQ0FBSixFQUFtQjtBQUNuQix3QkFBSUEsVUFBVSxLQUFLakIsR0FBbkIsRUFBd0JpQixTQUFTLEtBQUtqQixHQUFkO0FBQ3hCLHdCQUFJaUIsVUFBVSxLQUFLZixHQUFuQixFQUF3QmUsU0FBUyxLQUFLZixHQUFkO0FBQ3hCLHlCQUFLVyxZQUFMLEdBQW9CSSxNQUFwQjtBQUNBLHlCQUFLRSxLQUFMLENBQVcsT0FBWCxFQUFvQkYsTUFBcEI7QUFDSDtBQVRFO0FBREosU0FsRUk7QUErRVhHLGtCQUFVO0FBQ05DLHVCQURNLHlCQUNRO0FBQ1YsdUJBQU8sS0FBS0MsU0FBTCxDQUFlLEtBQUtuQixLQUFwQixFQUEyQixLQUFLUCxJQUFoQyxJQUF3QyxLQUFLTSxHQUFwRDtBQUNILGFBSEs7QUFJTnFCLHVCQUpNLHlCQUlRO0FBQ1YsdUJBQU8sS0FBS0MsU0FBTCxDQUFlLEtBQUtyQixLQUFwQixFQUEyQixLQUFLUCxJQUFoQyxJQUF3QyxLQUFLSSxHQUFwRDtBQUNILGFBTks7QUFPTnlCLHFCQVBNLHVCQU9NO0FBQUEsb0JBQ0F0QixLQURBLEdBQzhCLElBRDlCLENBQ0FBLEtBREE7QUFBQSxvQkFDT1AsSUFEUCxHQUM4QixJQUQ5QixDQUNPQSxJQURQO0FBQUEsb0JBQ2E4QixZQURiLEdBQzhCLElBRDlCLENBQ2FBLFlBRGI7O0FBRVIsdUJBQU9DLEtBQUszQixHQUFMLENBQVMwQixhQUFhdkIsS0FBYixDQUFULEVBQThCdUIsYUFBYTlCLElBQWIsQ0FBOUIsQ0FBUDtBQUNIO0FBVkssU0EvRUM7QUEyRlhnQyxpQkFBUztBQUNMQyx1QkFESyx1QkFDT0MsR0FEUCxFQUNZTCxTQURaLEVBQ3VCO0FBQ3hCLG9CQUFJQSxjQUFjTSxTQUFsQixFQUE2Qk4sWUFBWSxLQUFLQSxTQUFqQjtBQUM3Qix1QkFBT08sV0FBV0EsV0FBV2xDLE9BQU9nQyxHQUFQLEVBQVlHLE9BQVosQ0FBb0JSLFNBQXBCLENBQVgsQ0FBWCxDQUFQO0FBQ0gsYUFKSTtBQUtMQyx3QkFMSyx3QkFLUXZCLEtBTFIsRUFLZTtBQUNoQixvQkFBTStCLGNBQWMvQixNQUFNZ0MsUUFBTixFQUFwQjtBQUNBLG9CQUFNQyxjQUFjRixZQUFZRyxPQUFaLENBQW9CLEdBQXBCLENBQXBCO0FBQ0Esb0JBQUlaLFlBQVksQ0FBaEI7QUFDQSxvQkFBSVcsZ0JBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDcEJYLGdDQUFZUyxZQUFZSSxNQUFaLEdBQXFCRixXQUFyQixHQUFtQyxDQUEvQztBQUNIO0FBQ0QsdUJBQU9YLFNBQVA7QUFDSCxhQWJJO0FBY0xELHFCQWRLLHFCQWNLZSxHQWRMLEVBY1UzQyxJQWRWLEVBY2dCO0FBQ2pCLG9CQUFJLE9BQU8yQyxHQUFQLEtBQWUsUUFBbkIsRUFBNkIsT0FBTyxLQUFLMUIsWUFBWjs7QUFFN0Isb0JBQU0yQixrQkFBa0JiLEtBQUtjLEdBQUwsQ0FBUyxFQUFULEVBQWEsS0FBS2hCLFNBQWxCLENBQXhCOztBQUVBLHVCQUFPLEtBQUtJLFdBQUwsQ0FBaUIsQ0FBQ1csa0JBQWtCRCxHQUFsQixHQUF3QkMsa0JBQWtCNUMsSUFBM0MsSUFBbUQ0QyxlQUFwRSxDQUFQO0FBQ0gsYUFwQkk7QUFxQkxsQixxQkFyQksscUJBcUJLaUIsR0FyQkwsRUFxQlUzQyxJQXJCVixFQXFCZ0I7QUFDakIsb0JBQUksT0FBTzJDLEdBQVAsS0FBZSxRQUFuQixFQUE2QixPQUFPLEtBQUsxQixZQUFaOztBQUU3QixvQkFBTTJCLGtCQUFrQmIsS0FBS2MsR0FBTCxDQUFTLEVBQVQsRUFBYSxLQUFLaEIsU0FBbEIsQ0FBeEI7O0FBRUEsdUJBQU8sS0FBS0ksV0FBTCxDQUFpQixDQUFDVyxrQkFBa0JELEdBQWxCLEdBQXdCQyxrQkFBa0I1QyxJQUEzQyxJQUFtRDRDLGVBQXBFLENBQVA7QUFDSCxhQTNCSTtBQTRCTEUsb0JBNUJLLHNCQTRCTTtBQUNQLG9CQUFJLEtBQUt0QyxRQUFMLElBQWlCLEtBQUttQixXQUExQixFQUF1QztBQUN2QyxvQkFBTXBCLFFBQVEsS0FBS0EsS0FBTCxJQUFjLENBQTVCO0FBQ0Esb0JBQU1jLFNBQVMsS0FBS08sU0FBTCxDQUFlckIsS0FBZixFQUFzQixLQUFLUCxJQUEzQixDQUFmO0FBQ0Esb0JBQUlxQixTQUFTLEtBQUtqQixHQUFsQixFQUF1QjtBQUN2QixxQkFBSzJDLGVBQUwsQ0FBcUIxQixNQUFyQjtBQUNILGFBbENJO0FBbUNMMkIsb0JBbkNLLHNCQW1DTTtBQUNQLG9CQUFJLEtBQUt4QyxRQUFMLElBQWlCLEtBQUtpQixXQUExQixFQUF1QztBQUN2QyxvQkFBTWxCLFFBQVEsS0FBS0EsS0FBTCxJQUFjLENBQTVCO0FBQ0Esb0JBQU1jLFNBQVMsS0FBS0ssU0FBTCxDQUFlbkIsS0FBZixFQUFzQixLQUFLUCxJQUEzQixDQUFmO0FBQ0Esb0JBQUlxQixTQUFTLEtBQUtmLEdBQWxCLEVBQXVCO0FBQ3ZCLHFCQUFLeUMsZUFBTCxDQUFxQjFCLE1BQXJCO0FBQ0gsYUF6Q0k7QUEwQ0w0QixzQkExQ0ssd0JBMENRO0FBQ1QscUJBQUtDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkosZUFBdEIsQ0FBc0MsS0FBSzlCLFlBQTNDO0FBQ0EscUJBQUtDLE9BQUwsR0FBZSxLQUFmO0FBQ0gsYUE3Q0k7QUE4Q0w2QiwyQkE5Q0ssMkJBOENXMUIsTUE5Q1gsRUE4Q21CO0FBQ3BCLG9CQUFNK0IsU0FBUyxLQUFLbkMsWUFBcEI7QUFDQSxvQkFBSUksVUFBVSxLQUFLakIsR0FBbkIsRUFBd0JpQixTQUFTLEtBQUtqQixHQUFkO0FBQ3hCLG9CQUFJaUIsVUFBVSxLQUFLZixHQUFuQixFQUF3QmUsU0FBUyxLQUFLZixHQUFkO0FBQ3hCLG9CQUFJOEMsV0FBVy9CLE1BQWYsRUFBdUI7QUFDbkIseUJBQUs2QixLQUFMLENBQVdDLFVBQVgsQ0FBc0JKLGVBQXRCLENBQXNDLEtBQUs5QixZQUEzQztBQUNBO0FBQ0g7QUFDRCxxQkFBS00sS0FBTCxDQUFXLFFBQVgsRUFBcUJGLE1BQXJCLEVBQTZCK0IsTUFBN0I7QUFDQSxxQkFBSzdCLEtBQUwsQ0FBVyxPQUFYLEVBQW9CRixNQUFwQjtBQUNBLHFCQUFLSixZQUFMLEdBQW9CSSxNQUFwQjtBQUNILGFBekRJO0FBMERMZ0MsdUJBMURLLHVCQTBETzlDLEtBMURQLEVBMERjO0FBQ2Ysb0JBQUlBLFVBQVUsRUFBZCxFQUFrQjtBQUNkO0FBQ0g7QUFDRCxvQkFBTWMsU0FBU25CLE9BQU9LLEtBQVAsQ0FBZjtBQUNBLG9CQUFJLENBQUNlLE1BQU1ELE1BQU4sQ0FBTCxFQUFvQjtBQUNoQix5QkFBSzBCLGVBQUwsQ0FBcUIxQixNQUFyQjtBQUNILGlCQUZELE1BRU87QUFDSCx5QkFBSzZCLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkosZUFBdEIsQ0FBc0MsS0FBSzlCLFlBQTNDO0FBQ0g7QUFDSixhQXBFSTtBQXFFTHFDLHVCQXJFSyx5QkFxRVM7QUFDVixxQkFBS3BDLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUF2RUksU0EzRkU7QUFvS1hxQyxlQXBLVyxxQkFvS0Q7QUFBQTs7QUFDTixpQkFBS0MsbUJBQUwsR0FBMkIsd0JBQVMsS0FBSzNDLFFBQWQsRUFBd0IsaUJBQVM7QUFDeEQsc0JBQUt3QyxXQUFMLENBQWlCOUMsS0FBakI7QUFDSCxhQUYwQixDQUEzQjtBQUdIO0FBeEtVLEsiLCJmaWxlIjoiYXBwL21vbGVjdWxlcy9JbnB1dE51bWJlci9JbnB1dE51bWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dEZpZWxkIGZyb20gJy4uL0lucHV0RmllbGQvSW5wdXRGaWVsZCc7XG5pbXBvcnQgeyBvbmNlLCBvbiB9IGZyb20gJy4uLy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnO1xuXG5sZXQgaW5wdXROdW1iZXJUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJpbnB1dC1udW1iZXJcIlxuICAgIDpjbGFzcz1cIltcbiAgICAgICAgbW9kaWZpZXJTdHlsZXMsXG4gICAgICAgIHsnZm9jdXMnOiBmb2N1c2VkfSxcbiAgICAgICAgeyAnaXMtZGlzYWJsZWQnOiBkaXNhYmxlZCB9LFxuICAgICAgICB7ICdpcy13aXRob3V0LWNvbnRyb2xzJzogIWNvbnRyb2xzfVxuICAgIF1cIlxuICAgID5cbiAgICA8c3BhblxuICAgICAgICB2LWlmPVwiY29udHJvbHNcIlxuICAgICAgICBjbGFzcz1cImlucHV0LW51bWJlcl9fZGVjcmVhc2VcIlxuICAgICAgICA6Y2xhc3M9XCJ7J2lzLWRpc2FibGVkJzogbWluRGlzYWJsZWR9XCJcbiAgICAgICAgdi1yZXBlYXQtY2xpY2s9XCJkZWNyZWFzZVwiXG4gICAgPlxuICAgICAgICA8aSBjbGFzcz1cImljb24tbWludXNcIj48L2k+XG4gICAgPC9zcGFuPlxuICAgIDxzcGFuXG4gICAgICAgIHYtaWY9XCJjb250cm9sc1wiXG4gICAgICAgIGNsYXNzPVwiaW5wdXQtbnVtYmVyX19pbmNyZWFzZVwiXG4gICAgICAgIDpjbGFzcz1cInsnaXMtZGlzYWJsZWQnOiBtYXhEaXNhYmxlZH1cIlxuICAgICAgICB2LXJlcGVhdC1jbGljaz1cImluY3JlYXNlXCJcbiAgICA+XG4gICAgICAgIDxpIGNsYXNzPVwiaWNvbi1wbHVzXCI+PC9pPlxuICAgIDwvc3Bhbj5cbiAgICA8aW5wdXQtZmllbGRcbiAgICAgICAgOnZhbHVlPVwiY3VycmVudFZhbHVlXCJcbiAgICAgICAgQGtleWRvd24udXAubmF0aXZlLnByZXZlbnQ9XCJpbmNyZWFzZVwiXG4gICAgICAgIEBrZXlkb3duLmRvd24ubmF0aXZlLnByZXZlbnQ9XCJkZWNyZWFzZVwiXG4gICAgICAgIEBibHVyPVwiaGFuZGxlQmx1clwiXG4gICAgICAgIEBmb2N1cz1cImhhbmRsZUZvY3VzXCJcbiAgICAgICAgQGlucHV0PVwiZGVib3VuY2VIYW5kbGVJbnB1dFwiXG4gICAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgICAgOnNpemU9XCJzaXplXCJcbiAgICAgICAgOm1heD1cIm1heFwiXG4gICAgICAgIDptaW49XCJtaW5cIlxuICAgICAgICByZWY9XCJpbnB1dEZpZWxkXCJcbiAgICA+XG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicHJlcGVuZFwiIHYtaWY9XCIkc2xvdHMucHJlcGVuZFwiPlxuICAgICAgICAgICAgPHNsb3QgbmFtZT1cInByZXBlbmRcIj48L3Nsb3Q+XG4gICAgICAgIDwvdGVtcGxhdGU+XG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiYXBwZW5kXCIgdi1pZj1cIiRzbG90cy5hcHBlbmRcIj5cbiAgICAgICAgICAgIDxzbG90IG5hbWU9XCJhcHBlbmRcIj48L3Nsb3Q+XG4gICAgICAgIDwvdGVtcGxhdGU+IFxuICAgIDwvaW5wdXQtZmllbGQ+XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAnSW5wdXROdW1iZXInLFxuICAgIHRlbXBsYXRlOiBpbnB1dE51bWJlclRlbXBsYXRlLFxuICAgIGRpcmVjdGl2ZXM6IHtcbiAgICAgICAgcmVwZWF0Q2xpY2s6IHtcbiAgICAgICAgICAgIGJpbmQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGludGVydmFsID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiB2bm9kZS5jb250ZXh0W2JpbmRpbmcuZXhwcmVzc2lvbl0uYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ldyBEYXRlKCkgLSBzdGFydFRpbWUgPCAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBvbihlbCwgJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgb25jZShkb2N1bWVudCwgJ21vdXNldXAnLCBjbGVhcik7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGhhbmRsZXIsIDEwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ2lucHV0LWZpZWxkJzogSW5wdXRGaWVsZFxuICAgIH0sXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc3RlcDoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMVxuICAgICAgICB9LFxuICAgICAgICBtYXg6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IEluZmluaXR5XG4gICAgICAgIH0sXG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogLUluZmluaXR5XG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgICAgICBzaXplOiBTdHJpbmcsXG4gICAgICAgIGNvbnRyb2xzOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBkZWJvdW5jZToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMzAwXG4gICAgICAgIH0sXG4gICAgICAgIG1vZGlmaWVyU3R5bGVzOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSwgXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsIFxuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlOiAwLFxuICAgICAgICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICAgICAgICBoYW5kbGVyKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbCA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKG5ld1ZhbCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsID49IHRoaXMubWF4KSBuZXdWYWwgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsIDw9IHRoaXMubWluKSBuZXdWYWwgPSB0aGlzLm1pbjtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IG5ld1ZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIG1pbkRpc2FibGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlY3JlYXNlKHRoaXMudmFsdWUsIHRoaXMuc3RlcCkgPCB0aGlzLm1pbjtcbiAgICAgICAgfSxcbiAgICAgICAgbWF4RGlzYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5jcmVhc2UodGhpcy52YWx1ZSwgdGhpcy5zdGVwKSA+IHRoaXMubWF4O1xuICAgICAgICB9LFxuICAgICAgICBwcmVjaXNpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB7IHZhbHVlLCBzdGVwLCBnZXRQcmVjaXNpb24gfSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoZ2V0UHJlY2lzaW9uKHZhbHVlKSwgZ2V0UHJlY2lzaW9uKHN0ZXApKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICB0b1ByZWNpc2lvbihudW0sIHByZWNpc2lvbikge1xuICAgICAgICAgICAgaWYgKHByZWNpc2lvbiA9PT0gdW5kZWZpbmVkKSBwcmVjaXNpb24gPSB0aGlzLnByZWNpc2lvbjtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHBhcnNlRmxvYXQoTnVtYmVyKG51bSkudG9GaXhlZChwcmVjaXNpb24pKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFByZWNpc2lvbih2YWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVTdHJpbmcgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgZG90UG9zaXRpb24gPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gICAgICAgICAgICBsZXQgcHJlY2lzaW9uID0gMDtcbiAgICAgICAgICAgIGlmIChkb3RQb3NpdGlvbiAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkb3RQb3NpdGlvbiAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJlY2lzaW9uO1xuICAgICAgICB9LFxuICAgICAgICBfaW5jcmVhc2UodmFsLCBzdGVwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ251bWJlcicpIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgcHJlY2lzaW9uRmFjdG9yID0gTWF0aC5wb3coMTAsIHRoaXMucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9QcmVjaXNpb24oKHByZWNpc2lvbkZhY3RvciAqIHZhbCArIHByZWNpc2lvbkZhY3RvciAqIHN0ZXApIC8gcHJlY2lzaW9uRmFjdG9yKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2RlY3JlYXNlKHZhbCwgc3RlcCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICdudW1iZXInKSByZXR1cm4gdGhpcy5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHByZWNpc2lvbkZhY3RvciA9IE1hdGgucG93KDEwLCB0aGlzLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvUHJlY2lzaW9uKChwcmVjaXNpb25GYWN0b3IgKiB2YWwgLSBwcmVjaXNpb25GYWN0b3IgKiBzdGVwKSAvIHByZWNpc2lvbkZhY3Rvcik7XG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlYXNlKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5tYXhEaXNhYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlIHx8IDA7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLl9pbmNyZWFzZSh2YWx1ZSwgdGhpcy5zdGVwKTtcbiAgICAgICAgICAgIGlmIChuZXdWYWwgPiB0aGlzLm1heCkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWUobmV3VmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVjcmVhc2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLm1pbkRpc2FibGVkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWUgfHwgMDtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMuX2RlY3JlYXNlKHZhbHVlLCB0aGlzLnN0ZXApO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbCA8IHRoaXMubWluKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRWYWx1ZShuZXdWYWwpO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVCbHVyKCkge1xuICAgICAgICAgICAgdGhpcy4kcmVmcy5pbnB1dEZpZWxkLnNldEN1cnJlbnRWYWx1ZSh0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0Q3VycmVudFZhbHVlKG5ld1ZhbCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkVmFsID0gdGhpcy5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICBpZiAobmV3VmFsID49IHRoaXMubWF4KSBuZXdWYWwgPSB0aGlzLm1heDtcbiAgICAgICAgICAgIGlmIChuZXdWYWwgPD0gdGhpcy5taW4pIG5ld1ZhbCA9IHRoaXMubWluO1xuICAgICAgICAgICAgaWYgKG9sZFZhbCA9PT0gbmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5pbnB1dEZpZWxkLnNldEN1cnJlbnRWYWx1ZSh0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgbmV3VmFsLCBvbGRWYWwpO1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBuZXdWYWwpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBuZXdWYWw7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZUlucHV0KHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3VmFsID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4obmV3VmFsKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlKG5ld1ZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXRGaWVsZC5zZXRDdXJyZW50VmFsdWUodGhpcy5jdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVGb2N1cygpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRoaXMuZGVib3VuY2VIYW5kbGVJbnB1dCA9IGRlYm91bmNlKHRoaXMuZGVib3VuY2UsIHZhbHVlID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5wdXQodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cbiJdfQ==
