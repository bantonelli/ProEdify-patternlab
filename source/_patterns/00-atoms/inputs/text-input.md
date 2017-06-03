Basic text input.

--- 
Object Properties: 
* {{textInput.placeHolder}} 
  * The placeholder text for input
* {{textInput.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa

Content Blocks: N/A

--- 
BEM STRUCTURE: `text-input`, `text-input__input`, `text-input__border`

Color Modifiers: `text-input_color-invert`

---

text-input:
  * Container block that wraps the component.

text-input__input:
  * Native text input. 
  * Normal styling stripped
  * Use ::placeholder as placeholder text 
  * Use :valid state for post input styling  

text-input__border:
  * The visible bottom border for the input. 
  * Border expands and changes color on input's :active/:focus states
  * It stays in expanded/colored state after user inputs text 