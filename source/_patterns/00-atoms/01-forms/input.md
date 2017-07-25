Basic text input.

JS COMPONENT PROPERTIES & EVENTS:
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
BEM STRUCTURE: `input`, `input__input`, `input__border`
___

* input:
  * Container block that wraps the component.

* input__input:
  * Native text input. 
  * Normal styling stripped
  * Use ::placeholder as placeholder text 
  * Use :valid state for post input styling  

* input__border:
  * The visible bottom border for the input. 
  * Border expands and changes color on input's :active/:focus states
  * It stays in expanded/colored state after user inputs text 

* input__icon:
  * Put this class, and an icon class, on the element going inside of the `icon` slot.
   
___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* VueJS SLOT: `icon` , CLASS: `input__icon`

Size Modifiers: N/A 
 
Color Modifiers: `input_color-invert`