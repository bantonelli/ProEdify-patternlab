const selectTemplate = `
<div @click="toggleSelect" class="select" :class="classes">
    <span class="select__placeholder" :class="isChosenClass">\{{ selectedOption }}</span>
    <div class="select__border"></div>
    <ul class="select__options">
        <li class="select__option" v-for="option in options" @click="selectOption($event, option)">\{{option}}
            <div></div>
        </li>
    </ul>
</div>
`;

// <select class="select__input">
//     <option value="" disabled selected>\{{placeholder}}</option>
//     <option value="1" v-for="option in options">\{{option}}</option>
// </select>

import _ from 'lodash';

export default {
    template: selectTemplate,
    props: {
        placeholder: { 
            default: "Basic Select Input"
        },
        options: {
            type: Array,
            default: [
                'Option 1',
                'Option 2',
                'Option 3'
            ]
        },
        modifierStyles: {
            type: Array, 
            default: null
        }
    },
    data: function () {
        return {
            selectedOption: this.placeholder,
            isActiveClass: {
                'is-active': false
            },
            isChosenClass: {
                'is-chosen': false
            }
        }
    },
    computed: {
        classes: function () {
            return _.concat(this.modifierStyles, this.isActiveClass);
        }
    },
    methods: {
        toggleSelect: function () {
            var active = this.isActiveClass['is-active'];
            if (active) {
                this.isActiveClass['is-active'] = false;
            } else {
                this.isActiveClass['is-active'] = true;
            }
        },
        selectOption: function (event, option) {
            if (this.selectedOption !== this.placeholder) {
                this.isChosenClass['is-chosen'] = true;
            }
            this.selectedOption = option;
            this.$emit('input', this.selectedOption);
        }
    }
}