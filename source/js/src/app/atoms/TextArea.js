const textAreaTemplate = `
<div class="text-area" :class="classes">
    <div 
        class="text-area__input" 
        ref="input"
        contenteditable="true"
        v-bind="parentProps"
        :data-value="currentValue"
        :style="styles"
        @paste.lazy="pasted"
        @cut.lazy="changed"
        @keyup="changed"
        @keydown.ctrl.alt.shift="changed"
        >
        <span v-if="placeHolder">{{placeHolder}}</span>
    </div>
    <div class="text-area__border"></div>
</div>
`;

export default {
    template: textAreaTemplate,
    props: {
        classes: {
            type: Object,
            default: function () {
                return {
                    "text-area_color-invert": false
                };
            }
        },
        parentProps: {
            type: Object
        },
        styles: {
            type: Object
        }
    },
    data: function () {
        return {
            height: 40,
            observer: null,
            placeHolder: this.parentProps.placeholder,
            currentValue: "" 
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
            this.placeHolder = null;
            this.currentValue = event.target.textContent;
            this.$emit('input', this.currentValue);    
        },
        pasted: function (e) {
            var target = e.target;
            var content = "";
            e.preventDefault();
            if (e.clipboardData) {
                content = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, content);
            }
            else if (window.clipboardData) {
                content = window.clipboardData.getData('Text');
                document.selection.createRange().pasteHTML(content);
            }   
            this.currentValue = target.textContent;
            this.$emit('input', this.currentValue);
        }
    }
};