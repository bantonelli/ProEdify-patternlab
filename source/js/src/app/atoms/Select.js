const selectTemplate = `
<div @click="toggleSelect" class="select" :class="[isActiveClass, classes]">
    <span class="select__placeholder">\{{ selectedOption }}</span>
    <ul class="select__options">
        <li class="select__option" v-for="option in options" @click="selectOption($event, option)">\{{option}}</li>
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
            // console.log('Event: ', event);
            // console.log('Option: ', option);
            this.selectedOption = option;
            this.$emit('input', this.selectedOption);
        }
    }
}