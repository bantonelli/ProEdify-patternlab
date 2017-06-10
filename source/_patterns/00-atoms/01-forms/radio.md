Basic radio button input.

--- 
JS Component Properties:
* :text = {{radio.label}} 
  * Text label associated with radio button input
* :id = {{radio.ID}}
  * CSS #id for radio 
  * Used with label to provide check functionality 
* :classes = {{radio.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa
* :formvalue = {{radio.value}}
  * The value attached to the radio input 
  * This is what will be sent with the completed form
* formname = "formName"
  * String passed to component  
  * Sets the name="" property of the radio button 
  * Pass this same string to other radio buttons in the form 
* v-model = selectedArray
  * Array on the parent Vue instance   
  * Stores the value emitted from the input
  
---
Content Blocks: N/A

--- 
BEM STRUCTURE: `radio`, `radio__input`, `radio__fill`, `radio__label`

Size Modifiers: `radio_size-xsmall`, `radio_size-small`, `radio_size-large`, `radio_size-xlarge` 

Color Modifiers: `radio_color-invert`

---

radio:
  * Container block that wraps the component.

radio__input:
  * Native radio button input. 
  * Not displayed.

radio__fill:
  * The visible radio button. 
  * Provides the border and the green fill.

radio__label:
  * The text label. 

