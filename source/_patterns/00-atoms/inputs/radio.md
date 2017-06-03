Basic radio button input.

--- 
Object Properties: 
* {{radio.label}} 
  * Text label associated with radio button input
* {{radio.ID}}
  * CSS #id for radio 
  * Used with label to provide check functionality 
* {{radio.class}}
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa
* {{radio.value}}
  * The value attached to the radio input 
  * This is what will be sent with the completed form

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

