Enhanced Select Input. (More features than the simple select.) 
 
JS COMPONENT PROPERTIES & EVENTS (SELECT): 
___

* `v-model = selectValue`
  * Required property 
  * Can be Array or String on parent component   
  * Stores the values emitted from the input
  * Use String for single-select and Array with multiple-select
* `:placeholder`
  * Placeholder text for the input 
  * Must be a string
* `:no-match-text`
  * Text shown when no data matches the filtering query 
* `:no-data-text`
  * Text shown when there is no options 
* `default-first-option`
  * Enables enter key to select first matching option. 
  * Use with `filterable` or `remote` 
* `multiple`
  * Boolean Option to make the select become a multiple-select
  * Multiple-select allows user to select multiple options 
  * When an option is selected it is added to the list of Tags selected   
* `:multiple-limit=2` 
  * Maximum number of options user can select in multiple-select mode 
  * No limit when set to 0. 
* `clearable` 
  * Boolean to enable resetting/clearing the selected option
  * Only works in single-select mode 
* `allow-create`
  * Boolean to enable creation of new options/Tags by user 
  * Only usable when multiple and filterable are true 
* `filterable`
  * Boolean to enable filtering through options via keyboard input
* `:filter-method=filterFunction`
  * Custom filter method when filterable is true 
* `remote`
  * Boolean to enable loading options from server 
* `:remote-method=remoteFunction`
  * Custom remote search method 
* `:loading-text`
  * Text shown while loading from server
* `:loading=isLoading`
  * Boolean binding to change the state of the input to `loading`
  * When true the select shows `loading-text` 
* `:modifier-styles`
  * An array of modifier/variation classes 
  * Class names must be strings 
* `:disabled`
  * Boolean to disable the input
  * Will apply .is-disabled class if true 
* `:name`
  * Binding to native HTML 'name' attribute
* `@change`
  * Event Fired when bound v-model changes 
* `@visible-change`
  * Event Fired when dropdown appears/disappears 
* `@remove-tag`
  * Event Fired when tag is removed in multiple mode
* `@clear`
  * Event Fired when clear icon is clicked when `clearable` 

JS COMPONENT PROPERTIES & EVENTS (OPTION): 
___

* `:value=item.value`
  * Value of the option 
* `:label=item.label`
  * Label of option, same as value if omitted 
* `:disabled=item.isDisabled`
  * Boolean to disable the option. 

___
BEM STRUCTURE: 
* `select` 
  * `&__tags`, `&__tags-text` 
  * `&__filter-input` 
  * `&__input`

Non-grouped options:
* `&__dropdown`, `&__options` 
  * `&__option`
  * `&__empty`

Grouped options:
* `&__dropdown`, `&__options`, `&__group`, `&__group-title`, `&__group-options` 
  * `&__option`
  * `&__empty`
___

* select:
  * Container block that wraps the component.

* select__tags:
  * Container `<div>` for list of tags  
  * Also contains `select__tags-text` & `select__filter-input`

* select__tags-text:
  * `<span>` that wraps tag text 
  * Allows for context-specific styling of Tag component text

* select__filter-input: 
  * Basic `<input>` that normally wouldn't have any visible styling of its own.
  * Only intended for keyboard input when select is filterable
  * Only rendered when filterable and multiple are true

* select__input: 
  * InputField component used within the EnhancedSelect component
  * Responsible for displaying the placeholder and icon. 
  * Also displays selected option when in single-select mode.   
  * This BEM class is used for context-specific styling of this input-field

* select__dropdown:
  * The visible wrapper for the dropdown list. 

* select__options: 
  * `<ul>` that acts as the total list of options.
  * Rendered inside select__dropdown

* select__option: 
  * `<li>` tags inside of select__options

* select__group: 
  * `<ul>` wrapper for an OptionGroup 

* select__group-title:
  * `<li>` that provides styling for the OptionGroup's title text

* select__group-options:
  * `<ul>` that starts the OptionGroup's list of Options 

* select__empty: 
  * `<p>` inside of select__dropdown
  * Applies styles to loading-text, no-match-text, and no-data-text  

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: 
* Default `<slot>`:
  * Slot for where Option components are rendered.  
  * Renders each Option passed inside of select__options
 
Size Modifiers: N/A 

Color Modifiers: N/A





