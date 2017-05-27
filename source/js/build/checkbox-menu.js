"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _checkbox = require("./checkbox");

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkboxMenuTemplate = "\n<div>\n    <pe-checkbox\n    v-for=\"checkbox in checkboxes\"\n    :text='checkbox.label'\n    :id='checkbox.ID'\n    :classes='checkbox.class'\n    :formvalue='checkbox.value'\n    v-model=\"checked\"></pe-checkbox>\n    {{totalChecked}}\n</div>\n";

exports.default = {
    data: {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWNrYm94LW1lbnUuanMiXSwibmFtZXMiOlsiY2hlY2tib3hNZW51VGVtcGxhdGUiLCJkYXRhIiwiY2hlY2tib3hlcyIsImNoZWNrZWQiLCJ0b3RhbENoZWNrZWQiLCJ3YXRjaCIsInZhbCIsIm5ld1ZhbCIsImNoYXJBdCIsImxlbmd0aCIsInN1YnN0cmluZyIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInB1c2giLCJjb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsbVJBQU47O2tCQWFlO0FBQ1hDLFVBQU07QUFDRkMsb0JBQVksQ0FDUjtBQUNJLGtCQUFNLGFBRFY7QUFFSSxxQkFBUyxPQUZiO0FBR0kscUJBQVM7QUFDVCx3Q0FBd0IsS0FEZjtBQUVULHVDQUF1QixLQUZkO0FBR1QsdUNBQXVCLElBSGQ7QUFJVCx3Q0FBd0IsS0FKZjtBQUtULHlDQUF5QjtBQUxoQixhQUhiO0FBVUkscUJBQVM7QUFWYixTQURRLEVBYVI7QUFDSSxrQkFBTSxjQURWO0FBRUkscUJBQVMsUUFGYjtBQUdJLHFCQUFTO0FBQ1Qsd0NBQXdCLEtBRGY7QUFFVCx1Q0FBdUIsS0FGZDtBQUdULHVDQUF1QixJQUhkO0FBSVQsd0NBQXdCLEtBSmY7QUFLVCx5Q0FBeUI7QUFMaEIsYUFIYjtBQVVJLHFCQUFTO0FBVmIsU0FiUSxFQXlCUjtBQUNJLGtCQUFNLGFBRFY7QUFFSSxxQkFBUyxPQUZiO0FBR0kscUJBQVM7QUFDVCx3Q0FBd0IsS0FEZjtBQUVULHVDQUF1QixLQUZkO0FBR1QsdUNBQXVCLElBSGQ7QUFJVCx3Q0FBd0IsS0FKZjtBQUtULHlDQUF5QjtBQUxoQixhQUhiO0FBVUkscUJBQVM7QUFWYixTQXpCUSxDQURWO0FBdUNGQyxpQkFBUyxFQXZDUDtBQXdDRkMsc0JBQWM7QUF4Q1osS0FESztBQTJDWEMsV0FBTztBQUNIRixpQkFBUyxpQkFBVUcsR0FBVixFQUFlO0FBQ3BCLGdCQUFJQyxTQUFTLEVBQWI7QUFDQSxnQkFBSUQsSUFBSUUsTUFBSixDQUFXRixJQUFJRyxNQUFKLEdBQVcsQ0FBdEIsS0FBNEIsR0FBaEMsRUFBcUM7QUFDakNGLHlCQUFTRCxJQUFJSSxTQUFKLENBQWMsQ0FBZCxFQUFpQkosSUFBSUcsTUFBSixHQUFhLENBQTlCLENBQVQ7QUFDQSxvQkFBSUUsUUFBUSxLQUFLUCxZQUFMLENBQWtCUSxPQUFsQixDQUEwQkwsTUFBMUIsQ0FBWjtBQUNBLG9CQUFJSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNaLHlCQUFLUCxZQUFMLENBQWtCUyxNQUFsQixDQUF5QkYsS0FBekIsRUFBZ0MsQ0FBaEM7QUFDSDtBQUNKLGFBTkQsTUFNTztBQUNILHFCQUFLUCxZQUFMLENBQWtCVSxJQUFsQixDQUF1QlIsR0FBdkI7QUFDSDtBQUNKO0FBWkUsS0EzQ0k7QUF5RFhTLGdCQUFZO0FBQ1I7QUFEUTtBQXpERCxDIiwiZmlsZSI6ImNoZWNrYm94LW1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2hlY2tib3hDb21wb25lbnQgZnJvbSAnLi9jaGVja2JveCc7XG5cbmNvbnN0IGNoZWNrYm94TWVudVRlbXBsYXRlID0gYFxuPGRpdj5cbiAgICA8cGUtY2hlY2tib3hcbiAgICB2LWZvcj1cImNoZWNrYm94IGluIGNoZWNrYm94ZXNcIlxuICAgIDp0ZXh0PSdjaGVja2JveC5sYWJlbCdcbiAgICA6aWQ9J2NoZWNrYm94LklEJ1xuICAgIDpjbGFzc2VzPSdjaGVja2JveC5jbGFzcydcbiAgICA6Zm9ybXZhbHVlPSdjaGVja2JveC52YWx1ZSdcbiAgICB2LW1vZGVsPVwiY2hlY2tlZFwiPjwvcGUtY2hlY2tib3g+XG4gICAgXFx7e3RvdGFsQ2hlY2tlZH19XG48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBkYXRhOiB7XG4gICAgICAgIGNoZWNrYm94ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIklEXCI6IFwiZmlyc3QtY2hlY2tcIixcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiRmlyc3RcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IHtcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUteHNtYWxsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS1zbWFsbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUtbGFyZ2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUteGxhcmdlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiRmlyc3QgT3B0aW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJJRFwiOiBcInNlY29uZC1jaGVja1wiLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJTZWNvbmRcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IHtcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUteHNtYWxsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS1zbWFsbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUtbGFyZ2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImNoZWNrYm94X3NpemUteGxhcmdlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfY29sb3ItaW52ZXJ0XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiU2Vjb25kIE9wdGlvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiSURcIjogXCJ0aGlyZC1jaGVja1wiLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJUaGlyZFwiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjoge1xuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14c21hbGxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJjaGVja2JveF9zaXplLXNtYWxsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS1sYXJnZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiY2hlY2tib3hfc2l6ZS14bGFyZ2VcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJjaGVja2JveF9jb2xvci1pbnZlcnRcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJUaGlyZCBPcHRpb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBjaGVja2VkOiBbXSxcbiAgICAgICAgdG90YWxDaGVja2VkOiBbXVxuICAgIH0sXG4gICAgd2F0Y2g6IHtcbiAgICAgICAgY2hlY2tlZDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodmFsLmNoYXJBdCh2YWwubGVuZ3RoLTEpID09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsID0gdmFsLnN1YnN0cmluZygwLCB2YWwubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy50b3RhbENoZWNrZWQuaW5kZXhPZihuZXdWYWwpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsQ2hlY2tlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbENoZWNrZWQucHVzaCh2YWwpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3BlLWNoZWNrYm94JzogQ2hlY2tib3hDb21wb25lbnRcbiAgICB9XG59OyJdfQ==
