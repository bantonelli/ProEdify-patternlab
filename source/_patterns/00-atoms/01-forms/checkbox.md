Basic checkbox input.
 
JS COMPONENT PROPERTIES:
___

* `v-model = checked`
  * Required property 
  * Can be Array, Boolean, or String on parent component   
  * Stores the values emitted from the input
  * Use Boolean or String for single checkbox and array with checkbox group
* `:id = {{checkbox.ID}}`
  * Required property 
  * CSS #id for checkbox
  * Used with label to provide scheck functionality 
* `:label = {{checkbox.label}}`
  * Required property for checkbox-group usage   
  * Text label & value associated with checkbox in a checkbox-group 
  * If a label prop is passed it is treated as the value of the checkbox
  * If `<slot>` is used instead of `:label` the checkbox value will be Boolean
* `:true-label`
  * Value of checkbox when it is checked
  * Use this prop in combination with `:false-label`
* `:false-label`
  * Value of checkbox when it is NOT checked
  * Use this prop in combination with `:true-label`
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings 
* `:disabled`
  * Boolean to disable the checkbox
  * Will apply .is-disabled class if true 
* `:indeterminate`, `:name`, `:checked`
  * Bindings to their respective native HTML attributes

___
BEM STRUCTURE: `checkbox`, `checkbox__input`, `checkbox__label`
___

* checkbox:
  * Container block that wraps the component.

* checkbox__input:
  * Native checkbox input. 
  * Not displayed.

* checkbox__label:
  * The visible checkbox. 
  * Provides both the check (::before) and the box (::after)
  * Also provides the Text label using a nested `<span>` 

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Used as text label in single-checkbox scenario 
  * Use this instead of `:label` when you want checkbox value to be Boolean instead of String.
 
Size Modifiers: `checkbox_size-small`, `checkbox_size-large` 

Color Modifiers: `checkbox_color-invert`





