Basic radio button input.

JS COMPONENT PROPERTIES & EVENTS:
___

* `v-model = radio`
  * Required property 
  * Can be Number or String on parent component   
  * Stores the value emitted from the input
* `:id = {{radio.ID}}`
  * Required property 
  * CSS #id for radio 
  * Used with label to provide functionality 
* `:label = {{checkbox.label}}`
  * Required property
  * Sets the value & text label of the radio  
  * If `<slot>` is used it will override this prop as the radio's text label 
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings 
* `:disabled`
  * Boolean to disable the checkbox
  * Will apply .is-disabled class if true 
* `:name`
  * Binding to the native HTML `name` attribute

___
BEM STRUCTURE: `radio`, `radio__input`, `radio__fill`, `radio__label`
___

* radio:
  * Container block that wraps the component.

* radio__input:
  * Native radio button input. 
  * Not displayed.

* radio__fill:
  * The visible radio button. 
  * Provides the border and the green fill.

* radio__label:
  * The text label. 

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Can be used to override `:label` as text label
  * Use if you want `:label` to be used purely as a value    

Size Modifiers: `radio_size-xsmall`, `radio_size-small`, `radio_size-large`, `radio_size-xlarge` 

Color Modifiers: `radio_color-invert`