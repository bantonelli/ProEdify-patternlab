Input Field. (Wrapper that adds more functionality to TextArea and Input) 
 
JS COMPONENT PROPERTIES & EVENTS: 
___

* `v-model = value`
  * Required property 
  * String on parent component   
  * Stores the values emitted from the input
* `:type=textarea`
  * Same as the 'type' attribute of native `<input>`
  * Only difference is that 'textarea' is also acceptible.  
* `:placeholder`
  * Placeholder text for the input 
  * Must be a string 
* `:maxlength=10` 
  * Maximum number of chars user can input   
  * Defaults to no limit.
  * Doesn't work with type=textarea
* `:minlength=2` 
  * Minimum number of chars user can input   
  * Defaults to no minimum.
  * Doesn't work with type=textarea
* `:icon=iconClass`
  * String of icon class to put into icon slot 
* `on-icon-click=someFunction`
  * Hook function
  * Triggered when clicking on the input icon 
* `autosize`
  * Boolean to enable automatic resizing of text area as user types.
  * NOTE: Resize will occur when new line is started.
* `:rows=2`
  * Number of rows to render textarea with 
  * Only works when type=textarea 
  * NOTE: content-editable TextArea implementation will not work with this feature.  
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings
  * Use existing TextArea or Input modifiers 
* `:readonly, :name, :max, :min, :step, :autofocus, :form`
  * Bindings to their respective native HTML attributes
* `@change`
  * Event Fired when input value changes  
* `@focus`
  * Event Fired when input is focused/clicked into  
* `@blure`
  * Event Fired when user clicks off of input  
* `@click`
  * Event Fired when icon inside input is clicked.  

___
BEM STRUCTURE: 
* `input-field`
* `input-field--appended` / `input-field--prepended`   
  * `input-field__prepend`
  * `input-field__append`

Text area structure:
* `text-area-field`   
___

* input-field:
  * Container block that wraps the component if type != textarea
  * Contains Input component and its BEM structure

* text-area-field: 
  * Container block that wraps the component if type == textarea
  * Contains TextArea component and its BEM structure 

* input-field__prepend: 
  * Element rendered inside `input-field` if using the prepend `<slot>`  

* input-field__append: 
  * Element rendered inside `input-field` if using the append `<slot>`

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* `<slot name="prepend">`:
  * Slot where prepended information is rendered.
  * Only usable when type != textarea   

* `<slot name="append">`:
  * Slot where appended information is rendered.
  * Only usable when type != textarea
 
Size Modifiers: Use the same as TextArea / Input Component(s) 

Color Modifiers: Use the same as TextArea / Input Component(s) 

Variations: `input-field--appended`, `input-field--prepended`





