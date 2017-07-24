Basic text area input.

JS COMPONENT PROPERTIES:
___

* `v-model = valueString`
  * Required property
  * Empty String declared on the parent Vue instance   
  * Stores the value emitted from the input
* `:placeholder = {{textArea.placeHolder}}`
  * The placeholder text for input  
* `:is-valid`
  * Boolean value required for validation 
  * If true sets .is-valid class styles 
* `:is-invalid`
  * Boolean value required for validation 
  * If true sets .is-invalid class styles 
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings 
* `:parent-props = this.$props`
  * The parent Vue components own props    
  * Only required when used inside of input-field 

___
BEM STRUCTURE: `text-area`, `text-area__input`, `text-area__border`
___

* text-area:
  * Container block that wraps the component.   

* text-area__input:
  * resizable and contenteditable `<div>` that acts as the text-area input 

* text-area__border:
  * Provides the color-changing/growing border animation. 

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: N/A

Size Modifiers: N/A 

Color Modifiers: `text-area_color-invert`