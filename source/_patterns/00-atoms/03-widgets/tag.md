Basic Tag Component. 

JS COMPONENT PROPERTIES & EVENTS: 
___
 
* `:key = uniqueValue`
  * Required property for dynamic Tags   
  * You need to provide a unique identifier as the key 
  * Helps VueJS track each Tag node’s identity when adding and deleting Tags
* `:closable`
  * Boolean value 
  * Determines if close icon is used 
  * Determines if close event is fired
* `@close`
  * Event Fired if Tag is closable
  * Typically handler will remove the tag from array of available tags   
* `:closeTransition`
  * Boolean value 
  * Determines if Vue transition is used upon handling @close   
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings
* `:hit`
  * Boolean value 
  * Adds a .is-hit state class if true 
  * Can be used for special styling when Tag is "chosen", "selected", "hit", etc.   


___
BEM STRUCTURE: `tag`, `tag__close`
___

* tag:
  * Container block that wraps the component.   

* tag__close:
  * `<i>` tag for the close icon
  * Used if Tag is marked closable   

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Used to provide main content/text inside of the Tag 

Size Modifiers: N/A 

Color Modifiers: N/A