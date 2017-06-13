const inputTemplate = `
<div class="input" :class="classes">
    <input 
        class="input__input" 
        autocorrect="off"
        :autocapitalize="capitalize" 
        :type="type" 
        :placeholder="placeholder"
        @keyup="changed" 
        pattern=".{2,}" required
    >
    <div class="input__border"></div>
    <slot name="icon"></slot>
</div>
`;

export default {
    template: inputTemplate,
    name: 'input',
    props: {
        placeholder: {
            type: String, 
            default: "Basic Text Input"
        },
        classes: {
            type: Object,
            default: {
                "input_color-invert": false
            }
        },
        type: {
            type: String,
            default: "text"
        },
        capitalize: {
            type: String,
            default: "off"
        }
    },
    methods: {
        changed: function (event) {
            var value = event.target.value;
            this.$emit('input', value);    
        }
    }
};