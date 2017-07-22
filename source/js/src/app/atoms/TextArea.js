const textAreaTemplate = `
<div class="text-area" :class="modifierStyles">
    <div 
        class="text-area__input"
        :class="{
            'is-valid': isValid,
            'is-invalid': isInvalid
        }"  
        ref="input"
        contenteditable="true"
        v-bind="parentProps"
        :style="styles"
        @paste.lazy="pasted"
        @cut.lazy="changed"
        @keyup="changed"
        @keydown.ctrl.alt.shift="changed"
        @focus="handleFocus"
        @blur="handleBlur" 
        >        
    </div>
    <span class="text-area__placeholder" v-if="placeHolder">{{placeHolder}}</span>
    <div class="text-area__border"></div>
</div>
`;

export default {
    template: textAreaTemplate,
    props: {
        parentProps: {
            type: Object
        },
        modifierStyles: {
            type: Array, 
            default: null
        },
        styles: {
            type: Object
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
    data: function () {
        return {
            height: 40,
            observer: null,            
            currentValue: "" 
        }
    },
    computed: {
        placeHolder: function () {
            if (this.currentValue === "") {
                if (this.parentProps && this.parentProps.placeholder) {
                    return this.parentProps.placeholder;
                } else {
                    return "This is a text area input";    
                }                                
            } else {
                return null;
            }
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
            this.currentValue = event.target.textContent;
            console.log(typeof this.currentValue);
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
