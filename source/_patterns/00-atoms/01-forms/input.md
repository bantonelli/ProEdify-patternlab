Basic text input.

--- 
JS Component Properties: 
* :placeholder = {{textInput.placeHolder}} 
  * The placeholder text for input
* :classes = {{textInput.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa
* v-model = valueString
  * Empty String declared on the parent Vue instance   
  * Stores the value emitted from the input

---
Content Blocks: 
* VueJS SLOT: `icon` , CLASS: `input__icon`

--- 
BEM STRUCTURE: `input`, `input__input`, `input__border`

Color Modifiers: `input_color-invert`

---
input:
  * Container block that wraps the component.

input__input:
  * Native text input. 
  * Normal styling stripped
  * Use ::placeholder as placeholder text 
  * Use :valid state for post input styling  

input__border:
  * The visible bottom border for the input. 
  * Border expands and changes color on input's :active/:focus states
  * It stays in expanded/colored state after user inputs text 

input__icon:
  * Put this class, and an icon class, on the element going inside of the `icon` slot.
   