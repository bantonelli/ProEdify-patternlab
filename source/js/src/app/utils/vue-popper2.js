import Popper from 'popper.js';

function on(element, event, handler) {
    if (element && event && handler) {
        document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
}

function off(element, event, handler) {
    if (element && event) {
        document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)
    }
}

export default {
    props: {
        trigger: {
            type: String,
            default: 'hover',
            validator: value => ['click', 'hover'].indexOf(value) > -1
        },
        delayOnMouseOut: {
            type: Number,
            default: 10,
        },
        disabled: {
            type: Boolean,
            default: false
        },
        content: String,
        enterActiveClass: String,
        leaveActiveClass: String,
        boundariesSelector: String,
        reference: {},
        forceShow: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: false
        },
        visibleArrow: {
            type: Boolean,
            default: true
        },
        arrowClass: {
            type: String,
            default: 'popper__arrow'
        },
        transition: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            referenceElm: null,
            popperJS: null,
            showPopper: false,
            currentPlacement: '',
            popperOptions: {
                placement: 'bottom',
                gpuAcceleration: false
            }
        };
    },
    watch: {
        showPopper(value) {
            if (value) {
                this.$emit('show');
                this.updatePopper();
            } else {
                this.$emit('hide');
            }
        },
        forceShow: {
            handler(value) {
                this[value ? 'doShow' : 'doClose']();
            },
            immediate: true
        }
    },
    created() {
        this.popperOptions = Object.assign(this.popperOptions, this.options);
    },
    mounted() {
        //this.referenceElm = this.reference || this.$slots.reference[0].elm;
        //this.popper = this.$slots.default[0].elm;
        if (typeof this.$parent.$refs.reference.$el !== 'undefined') {
            this.referenceElm = this.$parent.$refs.reference.$el;    
        } else if (typeof this.$parent.$refs.reference !== 'undefined') {
            this.referenceElm = this.$parent.$refs.reference;                
        } else {
            this.referenceElm = this.reference;
        }

        this.popper = this.$el;

        switch (this.trigger) {
            case 'click':
                on(this.referenceElm, 'click', this.doToggle);
                on(document, 'click', this.handleDocumentClick);
                break;
            case 'hover':
                on(this.referenceElm, 'mouseover', this.onMouseOver);
                on(this.popper, 'mouseover', this.onMouseOver);
                on(this.referenceElm, 'mouseout', this.onMouseOut);
                on(this.popper, 'mouseout', this.onMouseOut);
                break;
        }
        this.createPopper();
    },
    methods: {
        doToggle() {
            if (!this.forceShow) {
                this.showPopper = !this.showPopper;
            }
        },
        doShow() {
            this.showPopper = true;
        },
        doClose() {
            this.showPopper = false;
        },
        doDestroy() {
            if (this.showPopper || !this.popperJS) {
                return;
            }
            this.popperJS.destroy();
            this.popperJS = null;
        },
        createPopper() {
            this.$nextTick(() => {
                if (this.visibleArrow) {
                    this.appendArrow(this.popper);
                }
                if (this.appendToBody) {
                    document.body.appendChild(this.popper.parentElement);
                }
                if (this.popperJS && this.popperJS.destroy) {
                    this.popperJS.destroy();
                }
                if (this.boundariesSelector) {
                    const boundariesElement = document.querySelector(this.boundariesSelector);
                    if (boundariesElement) {
                        this.popperOptions.modifiers = Object.assign({}, this.popperOptions.modifiers);
                        this.popperOptions.modifiers.preventOverflow = Object.assign({}, this.popperOptions.modifiers.preventOverflow);
                        this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
                    }
                }
                this.popperOptions.onCreate = () => {
                    this.$emit('created', this);
                    this.$nextTick(this.updatePopper);
                };
                this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
            });
        },
        destroyPopper() {
            off(this.referenceElm, 'click', this.doToggle);
            off(this.referenceElm, 'mouseup', this.doClose);
            off(this.referenceElm, 'mousedown', this.doShow);
            off(this.referenceElm, 'focus', this.doShow);
            off(this.referenceElm, 'blur', this.doClose);
            off(this.referenceElm, 'mouseout', this.onMouseOut);
            off(this.referenceElm, 'mouseover', this.onMouseOver);
            off(document, 'click', this.handleDocumentClick);
            this.popperJS = null;
        },
        appendArrow(element) {
            if (this.appended) {
                return;
            }
            this.appended = true;
            const arrow = document.createElement('div');
            arrow.setAttribute('x-arrow', '');
            arrow.className = this.arrowClass;
            element.appendChild(arrow);
        },
        updatePopper() {
            this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
        },
        onMouseOver() {
            this.showPopper = true;
            clearTimeout(this._timer);
        },
        onMouseOut() {
            this._timer = setTimeout(() => {
                this.showPopper = false;
            }, this.delayOnMouseOut);
        },
        handleDocumentClick(e) {
            if (!this.$el || !this.referenceElm ||
                this.$el.contains(e.target) ||
                this.referenceElm.contains(e.target) ||
                !this.popper || this.popper.contains(e.target) ||
                this.forceShow
            ) {
                return;
            }
            this.showPopper = false;
        }
    },
    destroyed() {
        this.destroyPopper();
    }
}