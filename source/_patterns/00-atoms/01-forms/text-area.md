Basic text area input.

--- 
JS Component Properties:
* :placeholder = {{textArea.placeHolder}}
  * The placeholder text for input  
* :classes = {{textArea.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa  
* v-model = valueString
  * Empty String declared on the parent Vue instance   
  * Stores the value emitted from the input

---
Content Blocks: N/A

--- 
BEM STRUCTURE: `text-area`, `text-area__input`, `text-area__border`

Size Modifiers: N/A 

Color Modifiers: `text-area_color-invert`

---

text-area:
  * Container block that wraps the component.   

text-area__input:
  * resizable and contenteditable `<div>` that acts as the text-area input 

text-area__border:
  * Provides the color-changing/growing border animation. 
