import Input from '../atoms/Input';

const emailInputTemplate = `
    <pe-text-input
        :classes="emailinput.class"
        :placeholder="emailinput.placeHolder"
        :type="emailinput.type"
        v-model="Value"
        >        
    </pe-text-input>
`;

const templateSlot = `<div class="input__icon icon-magnifying-glass" slot="icon"></div>`;

export default {
    template: emailInputTemplate,
    props: ['emailinput'],
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