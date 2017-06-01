const radioTemplate = `
<div class="radio" :class="classes">
    <input class="radio__input" type="radio" :id="id" :value="formvalue" @change="changed" :name="formname">
    <div class="radio__fill"></div>
    <label class="radio__label" :for="id">\{{text}}</label>
</div>
`;

export default {
    template: radioTemplate,
    // name: 'checkbox-component',
    props: ['text', 'id', 'classes', 'formvalue', 'formname'],
    methods: {
        changed: function (event) {
            var isChecked = event.target.checked;
            if (isChecked) {
                this.$emit('input', (this.formvalue));
            } else {            
                this.$emit('input', null);
            }              
        }
    }
};