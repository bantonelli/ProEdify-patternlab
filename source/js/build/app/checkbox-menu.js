define(["exports", "./atoms/checkbox"], function (exports, _checkbox) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _checkbox2 = _interopRequireDefault(_checkbox);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var checkboxMenuTemplate = "\n<div>\n    <pe-checkbox\n    v-for=\"checkbox in checkboxes\"\n    :text='checkbox.label'\n    :id='checkbox.ID'\n    :classes='checkbox.class'\n    :formvalue='checkbox.value'\n    v-model=\"checked\"></pe-checkbox>\n    {{totalChecked}}\n</div>\n";

    exports.default = {
        template: checkboxMenuTemplate,
        data: function data() {
            return {
                checkboxes: [{
                    "ID": "first-check",
                    "label": "First",
                    "class": {
                        "checkbox_size-xsmall": false,
                        "checkbox_size-small": false,
                        "checkbox_size-large": true,
                        "checkbox_size-xlarge": false,
                        "checkbox_color-invert": false
                    },
                    "value": "First Option"
                }, {
                    "ID": "second-check",
                    "label": "Second",
                    "class": {
                        "checkbox_size-xsmall": false,
                        "checkbox_size-small": false,
                        "checkbox_size-large": true,
                        "checkbox_size-xlarge": false,
                        "checkbox_color-invert": false
                    },
                    "value": "Second Option"
                }, {
                    "ID": "third-check",
                    "label": "Third",
                    "class": {
                        "checkbox_size-xsmall": false,
                        "checkbox_size-small": false,
                        "checkbox_size-large": true,
                        "checkbox_size-xlarge": false,
                        "checkbox_color-invert": false
                    },
                    "value": "Third Option"
                }],
                checked: [],
                totalChecked: []
            };
        },
        watch: {
            checked: function checked(val) {
                var newVal = "";
                if (val.charAt(val.length - 1) == "*") {
                    newVal = val.substring(0, val.length - 1);
                    var index = this.totalChecked.indexOf(newVal);
                    if (index > -1) {
                        this.totalChecked.splice(index, 1);
                    }
                } else {
                    this.totalChecked.push(val);
                }
            }
        },
        components: {
            'pe-checkbox': _checkbox2.default
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9jaGVja2JveC1tZW51LmpzIl0sIm5hbWVzIjpbImNoZWNrYm94TWVudVRlbXBsYXRlIiwidGVtcGxhdGUiLCJkYXRhIiwiY2hlY2tib3hlcyIsImNoZWNrZWQiLCJ0b3RhbENoZWNrZWQiLCJ3YXRjaCIsInZhbCIsIm5ld1ZhbCIsImNoYXJBdCIsImxlbmd0aCIsInN1YnN0cmluZyIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInB1c2giLCJjb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxRQUFNQSxtUkFBTjs7c0JBYWU7QUFDWEMsa0JBQVVELG9CQURDO0FBRVhFLGNBQU0sZ0JBQVk7QUFDZCxtQkFBTztBQUNIQyw0QkFBWSxDQUNSO0FBQ0ksMEJBQU0sYUFEVjtBQUVJLDZCQUFTLE9BRmI7QUFHSSw2QkFBUztBQUNULGdEQUF3QixLQURmO0FBRVQsK0NBQXVCLEtBRmQ7QUFHVCwrQ0FBdUIsSUFIZDtBQUlULGdEQUF3QixLQUpmO0FBS1QsaURBQXlCO0FBTGhCLHFCQUhiO0FBVUksNkJBQVM7QUFWYixpQkFEUSxFQWFSO0FBQ0ksMEJBQU0sY0FEVjtBQUVJLDZCQUFTLFFBRmI7QUFHSSw2QkFBUztBQUNULGdEQUF3QixLQURmO0FBRVQsK0NBQXVCLEtBRmQ7QUFHVCwrQ0FBdUIsSUFIZDtBQUlULGdEQUF3QixLQUpmO0FBS1QsaURBQXlCO0FBTGhCLHFCQUhiO0FBVUksNkJBQVM7QUFWYixpQkFiUSxFQXlCUjtBQUNJLDBCQUFNLGFBRFY7QUFFSSw2QkFBUyxPQUZiO0FBR0ksNkJBQVM7QUFDVCxnREFBd0IsS0FEZjtBQUVULCtDQUF1QixLQUZkO0FBR1QsK0NBQXVCLElBSGQ7QUFJVCxnREFBd0IsS0FKZjtBQUtULGlEQUF5QjtBQUxoQixxQkFIYjtBQVVJLDZCQUFTO0FBVmIsaUJBekJRLENBRFQ7QUF1Q0hDLHlCQUFTLEVBdkNOO0FBd0NIQyw4QkFBYztBQXhDWCxhQUFQO0FBMENILFNBN0NVO0FBOENYQyxlQUFPO0FBQ0hGLHFCQUFTLGlCQUFVRyxHQUFWLEVBQWU7QUFDcEIsb0JBQUlDLFNBQVMsRUFBYjtBQUNBLG9CQUFJRCxJQUFJRSxNQUFKLENBQVdGLElBQUlHLE1BQUosR0FBVyxDQUF0QixLQUE0QixHQUFoQyxFQUFxQztBQUNqQ0YsNkJBQVNELElBQUlJLFNBQUosQ0FBYyxDQUFkLEVBQWlCSixJQUFJRyxNQUFKLEdBQWEsQ0FBOUIsQ0FBVDtBQUNBLHdCQUFJRSxRQUFRLEtBQUtQLFlBQUwsQ0FBa0JRLE9BQWxCLENBQTBCTCxNQUExQixDQUFaO0FBQ0Esd0JBQUlJLFFBQVEsQ0FBQyxDQUFiLEVBQWdCO0FBQ1osNkJBQUtQLFlBQUwsQ0FBa0JTLE1BQWxCLENBQXlCRixLQUF6QixFQUFnQyxDQUFoQztBQUNIO0FBQ0osaUJBTkQsTUFNTztBQUNILHlCQUFLUCxZQUFMLENBQWtCVSxJQUFsQixDQUF1QlIsR0FBdkI7QUFDSDtBQUNKO0FBWkUsU0E5Q0k7QUE0RFhTLG9CQUFZO0FBQ1I7QUFEUTtBQTVERCxLIiwiZmlsZSI6ImFwcC9jaGVja2JveC1tZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENoZWNrYm94Q29tcG9uZW50IGZyb20gJy4vYXRvbXMvY2hlY2tib3gnO1xuXG5jb25zdCBjaGVja2JveE1lbnVUZW1wbGF0ZSA9IGBcbjxkaXY+XG4gICAgPHBlLWNoZWNrYm94XG4gICAgdi1mb3I9XCJjaGVja2JveCBpbiBjaGVja2JveGVzXCJcbiAgICA6dGV4dD0nY2hlY2tib3gubGFiZWwnXG4gICAgOmlkPSdjaGVja2JveC5JRCdcbiAgICA6Y2xhc3Nlcz0nY2hlY2tib3guY2xhc3MnXG4gICAgOmZvcm12YWx1ZT0nY2hlY2tib3gudmFsdWUnXG4gICAgdi1tb2RlbD1cImNoZWNrZWRcIj48L3BlLWNoZWNrYm94PlxuICAgIFxce3t0b3RhbENoZWNrZWR9fVxuPC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGU6IGNoZWNrYm94TWVudVRlbXBsYXRlLFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoZWNrYm94ZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiSURcIjogXCJmaXJzdC1jaGVja1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiRmlyc3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14c21hbGxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS1zbWFsbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLWxhcmdlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14bGFyZ2VcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJGaXJzdCBPcHRpb25cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIklEXCI6IFwic2Vjb25kLWNoZWNrXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJTZWNvbmRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14c21hbGxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS1zbWFsbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLWxhcmdlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14bGFyZ2VcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJTZWNvbmQgT3B0aW9uXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJJRFwiOiBcInRoaXJkLWNoZWNrXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJUaGlyZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLXhzbWFsbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLXNtYWxsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUtbGFyZ2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLXhsYXJnZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2JveF9jb2xvci1pbnZlcnRcIjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIlRoaXJkIE9wdGlvblwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IFtdLFxuICAgICAgICAgICAgdG90YWxDaGVja2VkOiBbXVxuICAgICAgICB9XG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgICBjaGVja2VkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gXCJcIjtcbiAgICAgICAgICAgIGlmICh2YWwuY2hhckF0KHZhbC5sZW5ndGgtMSkgPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSB2YWwuc3Vic3RyaW5nKDAsIHZhbC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnRvdGFsQ2hlY2tlZC5pbmRleE9mKG5ld1ZhbCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxDaGVja2VkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsQ2hlY2tlZC5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAncGUtY2hlY2tib3gnOiBDaGVja2JveENvbXBvbmVudFxuICAgIH1cbn07Il19
