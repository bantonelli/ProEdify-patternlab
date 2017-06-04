const inputTemplate = `
<div class="input" :class="classes">
    <input :type="type" class="input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>
    <div class="input__border"></div>
    <slot name="icon"></slot>
</div>
`;

export default {
    template: inputTemplate,
    // name: 'checkbox-component',
    props: ['placeholder', 'classes', 'type'],
    methods: {
        changed: function (event) {
            var value = event.target.value;
            this.$emit('input', value);    
        }
    }
};