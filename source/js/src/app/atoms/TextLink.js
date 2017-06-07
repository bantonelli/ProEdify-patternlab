const textLinkTemplate = `
<div class="text-link" :class="classes" @mouseleave="mouseOut" @mouseenter="mouseEnter">
    <a :href="linkurl" class="text-link__link">
        <slot>Text Link</slot>
    </a>
    <div class="text-link__border" v-if="showborder"></div>
</div>
`;

const UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();
	
	_this.className +=  " "+className; 
	
	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

export default {
    template: textLinkTemplate,
    props: ['linkurl', 'showborder', 'classes'],
    data: function () {
        return {
            originalColor: null
        }
    },
    methods: {
        mouseEnter: function (event) {
            var textLink = event.target;
            var textLinkBorderBeforeColor = window.getComputedStyle(
                textLink.querySelector(".text-link__border"), ':before'
            ).borderColor;            
            this.originalColor = textLinkBorderBeforeColor;
            console.log("ENTER COLOR: ", this.originalColor);
        },
        mouseOut: function (event) {            
            var textLink = event.target;
            var textLinkBorder = textLink.querySelector(".text-link__border"); 
            textLinkBorder.pseudoStyle("before", "border-color", this.originalColor);
            textLinkBorder.pseudoStyle("after", "border-color", this.originalColor);
            var leaveColor = window.getComputedStyle(
                textLink.querySelector(".text-link__border"), ':before'
            ).borderColor;
            console.log("LEAVE COLOR: ", leaveColor);            
        }
    }
};