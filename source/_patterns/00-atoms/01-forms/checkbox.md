Basic checkbox input.

--- 
JS Component Properties: 
* :text = {{checkbox.label}} 
  * Text label associated with checkbox input
* :id = {{checkbox.ID}}
  * CSS #id for checkbox
  * Used with label to provide scheck functionality 
* :classes = {{checkbox.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa
* :formvalue = {{checkbox.value}}
  * The value attached to the checkbox input 
  * This is what will be sent with the completed form
* v-model = checkedArray
  * Array on the parent Vue instance   
  * Stores the values emitted from the input

---
Content Blocks: N/A

--- 
BEM STRUCTURE: `checkbox`, `checkbox__input`, `checkbox__label`

Size Modifiers: `checkbox_size-small`, `checkbox_size-large` 

Color Modifiers: `checkbox_color-invert`

---

checkbox:
  * Container block that wraps the component.

checkbox__input:
  * Native checkbox input. 
  * Not displayed.

checkbox__label:
  * The visible checkbox. 
  * Provides both the check (::before) and the box (::after)
  * Also provides the Text label using a nested `<span>` 


