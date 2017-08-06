Numerical Input Field. (Limits input to integer numbers). 
 
JS COMPONENT PROPERTIES & EVENTS: 
___

* `v-model = value`
  * Required property 
  * Number on parent component   
  * Stores the values emitted from the input
* `:max=maxNumber`
  * Sets the maximum allowed value
* `:min=minNumber`
  * Sets the minimum allowed value
* `:step=incrementalStep`
  * Amount to increment/decrement by 
  * Only applicable when controls are active 
* `controls`
  * Boolean to enable input controls.   
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings
  * Can also use existing Input modifiers 
* `@change`
  * Event Fired when input value changes  

___
BEM STRUCTURE: 
* `input-number` 
  * `input-number__decrease`, `icon-minus`
  * `input-number__increase`, `icon-plus`
  * `input-field`
 
___

* input-number: 
  * Container block that wraps the component  
  * Contains InputField component and its BEM structure 

* input-number__decrease: 
  * `<span>` that wraps `.icon-minus`
  * Used to style and position the decrease button 

* input-number__increase: 
  * `<span>` that wraps `.icon-plus`
  * Used to style and position the increase button

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* ALL INPUT FIELD SLOTS (See pattern for more info) 
 
Size Modifiers: N/A 

Color Modifiers: N/A 

Variations: N/A 





