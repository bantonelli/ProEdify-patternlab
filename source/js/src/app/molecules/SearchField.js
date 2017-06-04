import Input from '../atoms/Input';

const searchInputTemplate = `
    <pe-text-input
        :classes="searchinput.class"
        :placeholder="searchinput.placeHolder"
        :type="searchinput.type"
        v-model="Value"
        >
        <div class="input__icon icon-magnifying-glass" slot="icon"></div>
    </pe-text-input>
`;

export default {
    template: searchInputTemplate,
    props: ['searchinput'],
    data: function () {
        return {
            Value: ""
        }
    },
    watch: {
        Value: function (newValue) {
            this.$emit('input', newValue);
        }
    },
    components: {
        'pe-text-input': Input
    }
}