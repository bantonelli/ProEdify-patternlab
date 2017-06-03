const selectTemplate = `
<div @click="toggleSelect" class="select" :class="[isActiveClass, classes]">
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

export default {
    template: selectTemplate,
    props: ['placeholdertext', 'options', 'classes'],
    data: function () {
        return {
            selectedOption: this.placeholdertext,
            isActiveClass: {
                'is-active': false
            },
            isChosenClass: {
                'is-chosen': false
            }
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
            if (this.selectedOption !== this.placeholdertext) {
                this.isChosenClass['is-chosen'] = true;
            }
            this.selectedOption = option;
            this.$emit('input', this.selectedOption);
        }
    }
}