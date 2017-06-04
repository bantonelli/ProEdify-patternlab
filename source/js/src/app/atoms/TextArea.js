const textAreaTemplate = `
<div class="text-area" :class="classes">
    <div 
        class="text-area__input" 
        @keyup="changed"
        contenteditable="true"
        cols="30"
        rows="10"
        >
        <span v-if="placeHolder">{{placeHolder}}</span>
    </div>
    <div class="text-area__border"></div>
</div>
`;

export default {
    template: textAreaTemplate,
    // name: 'checkbox-component',
    props: ['placeholder', 'classes'],
    data: function () {
        return {
            height: 40,
            observer: null,
            placeHolder: this.placeholder 
        }
    },
    mounted: function () {
        // create an observer instance
        var textArea = this.$el;
        var textAreaInput = textArea.getElementsByClassName("text-area__input")[0];
        textArea.style.height = textAreaInput.style.height;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                textArea.style.height = textAreaInput.style.height;
            });    
        });
        observer.observe(textAreaInput, { attributes: true, childList: true, characterData: true, subtree: true });
        this.observer = observer;        
        // test case
        // setInterval(function(){
        //     textAreaInput.style.height = (Math.random() * 100) + "px";
        // }, 1000);
    },
    beforeDestroy: function () {
        // to stop observing
        this.observer.disconnect();
    },
    methods: {
        changed: function (event) {
            var value = event.target.innerHTML;
            this.placeHolder = null;
            this.$emit('input', value);    
        }
    }
};