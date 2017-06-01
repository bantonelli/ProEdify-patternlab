const radioTemplate = `
<div class="radio" :class="classes">
    <input class="radio__input" type="radio" :id="id" :value="formvalue" @change="changed" :name="formname">
    <div class="radio__fill"></div>
    <label class="radio__label" :for="id">\{{text}}</label>
</div>
`;

const textInputTemplate = `
<div class="text-input" :class="classes">
    <input type="text" class="text-input__input" @keyup="changed" :placeholder="placeholder" pattern=".{2,}" required>
    <div class="text-input__border"></div>
</div>
`;

export default {
    template: radioTemplate,
    // name: 'checkbox-component',
    props: ['placeholder', 'classes', 'formvalue'],
    methods: {
        changed: function (event) {
            var value = event.target.value;
            console.log("Value: ", value)
            this.$emit('input', value);    
        }
    }
};