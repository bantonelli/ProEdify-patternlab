Component to manage a group of checkboxes. 
 
JS COMPONENT PROPERTIES:
___

* `v-model = checked`
  * Required property 
  * Must be an array   
  * Stores the values emitted from the input of each checkbox within group 
  * Do not use v-model on checkboxes ONLY on the checkbox-group component 
* `:min`
  * Sets the minimum number of checkboxes that must be checked   
  * Must be a Number  
* `:max`
  * Sets the maximum number of checkboxes that can be checked   
  * Must be a Number  
* `@change`
  * Event Fired when bound v-model changes 

___
BEM STRUCTURE: `checkbox-group`
___

* checkbox-group:
  * Container block that wraps the component.

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Used as the main content block where the child Checkbox components go.  
 
Size Modifiers: N/A 

Color Modifiers: N/A





