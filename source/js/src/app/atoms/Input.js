const inputTemplate = `
<div class="input" :class="modifierStyles">
    <input 
        v-if="parentProps"
        class="input__input"
        :class="{
            'is-valid': isValid,
            'is-invalid': isInvalid
        }" 
        v-bind="parentProps"
        @keyup="changed"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="input"         
    >
    <input 
        v-else
        class="input__input"
        type="text"
        :placeholder="placeholder"
        :class="{
            'is-valid': isValid,
            'is-invalid': isInvalid
        }"         
        @keyup="changed"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="input"         
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
        modifierStyles: {
            type: Array, 
            default: null
        },
        parentProps: {
            type: Object,
            default: null
        },
        isValid: {
            type: Boolean,
            default: false
        },
        isInvalid: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        changed: function (event) {
            var value = event.target.value;
            this.$emit('input', value);    
        },
        handleFocus(event) {
            this.$emit('focus', event);
        },
        handleBlur(event) {
            // emit a normal blur event 
            this.$emit('blur', event);
        }
    }
};