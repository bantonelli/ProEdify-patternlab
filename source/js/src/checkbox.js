const checkboxTemplate = `
<div class="checkbox" :class="classes">
    <input class="checkbox__input" type="checkbox" :id="id" :value="formvalue" @change="changed">    
    <label class="checkbox__label" :for="id"><span>\{{text}}</span></label>
</div>
`;
const checkboxComponent = {
    template: checkboxTemplate,
    // name: 'checkbox-component',
    props: ['text', 'id', 'classes', 'formvalue'],
    methods: {
        changed: function (event) {
            var isChecked = event.target.checked;
            if (isChecked) {
                this.$emit('input', (this.formvalue));
            } else {            
                this.$emit('input', this.formvalue + "*");
            }              
        }
    }
};