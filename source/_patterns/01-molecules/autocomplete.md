Autocompleting search input field.
 
JS COMPONENT PROPERTIES & EVENTS: 
___

* `v-model = state`
  * Required property 
  * String on parent component   
  * Stores the values emitted from the input  
* `:fetch-suggestions = querySearch(queryString, cb)`
  * Required property
  * Should be a function (NOTE: queryString and cb args are passed automatically) 
  * This function should filter results based on input and then pass filtered results to cb().   
* `@select`
  * Handler Required  
  * Event fired upon selecting an autocomplete-suggestion item 
* `:placeholder`  
  * Placeholder text for the autocomplete      
* `icon = icon-magnifying-glass`
  * Class for the icon to be shown in the autocomplete field 
* `:on-icon-click`
  * Hook Function when clicking on the input icon 
* `:trigger-on-focus`
  * Boolean value (default: true)
  * Determines whether autocomplete suggestions show on-focus 
* `:custom-item`
  * String of a component name you wish to use for suggestion-items
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings 
* `:disabled`
  * Boolean to disable the input
  * Will apply .is-disabled class if true 

___
BEM STRUCTURE (autocomplete): `autocomplete`
BEM STRUCTURE (suggestions): `autocomplete-suggestions`, `&__wrapper`, `&__item`
___

* autocomplete:
  * Container block for the input portion of the component.
  * Wraps the input-field  

* autocomplete-suggestions:
  * Container block for the suggestions portion of the component.
  * Implemented via popper.js 
  * Separate node from the autocomplete input 

* autocomplete-suggestions__wrapper: 
  * The `<ul>` wrapper for the list of suggestions 

* autocomplete-suggestions__item 
  * The `<li>` tag for each suggestion 
  * Will not be rendered if a custom-item component is passed

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* `<slot name="prepend">`:
  * Used for attaching prepended info to the input-field  
  * Is styled via the `.input-field__prepend` class 
* `<slot name="append">`:
  * Used for attaching appended info to the input-field  
  * Is styled via the `.input-field__append` class 
* custom-item: 
  * If passed this prop will override default markup for each suggestion item. 
 
Size Modifiers: N/A 

Color Modifiers: N/A





