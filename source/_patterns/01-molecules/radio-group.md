Component to manage a group of radio inputs. 
 
JS COMPONENT PROPERTIES:
___

* `v-model = selected`
  * Required property 
  * Must be a String or Number  
  * Stores the values emitted from the input of each radio within group 
  * Do not use v-model on radios ONLY on the radio-group component 
* `@change`
  * Event Fired when bound v-model changes    

___
BEM STRUCTURE: `radio-group`
___

* radio-group:
  * Container block that wraps the component.

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Used as the main content block where the child Radio components go.  
 
Size Modifiers: N/A 

Color Modifiers: N/A





