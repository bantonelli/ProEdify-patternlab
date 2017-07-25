const textLinkTemplate = `
<div class="text-link" :class="modifierStyles">
    <a :href="linkurl" class="text-link__link">
        <slot>Text Link</slot>
    </a>
    <div class="text-link__border" v-if="showborder"></div>
</div>
`;

export default {
    template: textLinkTemplate,
    props: {
        linkurl: {
            type: String
        },
        showborder: {
            type: Boolean,
            default: true
        },
        modifierStyles: {
            type: Array,
            default: null 
        }
    },
    data: function () {
        return {
            originalColor: null
        }
    }
    // methods: {
    //     mouseEnter: function (event) {
    //         var textLink = event.target;
    //         var textLinkBorderBeforeColor = window.getComputedStyle(
    //             textLink.querySelector(".text-link__border"), ':before'
    //         ).borderColor;            
    //         this.originalColor = textLinkBorderBeforeColor;
    //         console.log("ENTER COLOR: ", this.originalColor);
    //     },
    //     mouseOut: function (event) {            
    //         var textLink = event.target;
    //         var textLinkBorder = textLink.querySelector(".text-link__border"); 
    //         var leaveColor = window.getComputedStyle(
    //             textLink.querySelector(".text-link__border"), ':before'
    //         ).borderColor;
    //         console.log("LEAVE COLOR: ", leaveColor);            
    //     }
    // }
};