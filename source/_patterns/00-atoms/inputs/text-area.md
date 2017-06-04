Basic text area input.

--- 
Object Properties: 
* {{textArea.placeHolder}}
  * The placeholder text for input  
* {{textArea.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa  

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
