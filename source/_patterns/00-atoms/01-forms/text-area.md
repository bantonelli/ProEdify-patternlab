Basic text area input.

JS COMPONENT PROPERTIES
___

* `:placeholder = {{textArea.placeHolder}}`
  * The placeholder text for input  
* `:classes = {{textArea.class}}`
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa  
* `v-model = valueString`
  * Empty String declared on the parent Vue instance   
  * Stores the value emitted from the input


BEM STRUCTURE: `text-area`, `text-area__input`, `text-area__border`
___

* text-area:
  * Container block that wraps the component.   

* text-area__input:
  * resizable and contenteditable `<div>` that acts as the text-area input 

* text-area__border:
  * Provides the color-changing/growing border animation. 


SLOTS, VARIATIONS, MODIFIERS
___

Content Blocks: N/A

Size Modifiers: N/A 

Color Modifiers: `text-area_color-invert`