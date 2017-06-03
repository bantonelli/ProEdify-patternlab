import CheckboxComponent from './atoms/Checkbox';

const checkboxMenuTemplate = `
<div>
    <pe-checkbox
    v-for="checkbox in checkboxes"
    :text='checkbox.label'
    :id='checkbox.ID'
    :classes='checkbox.class'
    :formvalue='checkbox.value'
    v-model="checked"></pe-checkbox>
    \{{totalChecked}}
</div>
`;

export default {
    template: checkboxMenuTemplate,
    data: function () {
        return {
            checkboxes: [
                {
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
                },
                {
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
                },
                {
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
                }
            ],
            checked: [],
            totalChecked: []
        }
    },
    watch: {
        checked: function (val) {
            var newVal = "";
            if (val.charAt(val.length-1) == "*") {
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
        'pe-checkbox': CheckboxComponent
    }
};