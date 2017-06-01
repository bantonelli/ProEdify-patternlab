const textInputTemplate = `
<div class="text-input" :class="classes">
    <input type="text" class="text-input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>
    <div class="text-input__border"></div>
</div>
`;

export default {
    template: textInputTemplate,
    // name: 'checkbox-component',
    props: ['placeholder', 'classes'],
    methods: {
        changed: function (event) {
            var value = event.target.value;
            console.log("Value: ", value);
            this.$emit('input', value);    
        }
    }
};