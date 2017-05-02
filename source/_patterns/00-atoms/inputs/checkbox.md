Basic checkbox input.

--- 
Variables: 
* {{checkbox.checkboxLabel}} 
* {{checkbox.checkboxID}}
* {{checkbox.checkboxSizeClass}}
* {{checkbox.checkboxColorClass}}

Content Blocks: N/A

--- 
BEM STRUCTURE: `checkbox`, `checkbox__input`, `checkbox__label`

Size Modifiers: `checkbox_size-small`, `checkbox_size-large` 

Color Modifiers: `checkbox_color-invert`

---

checkbox:
  * Container block that wraps the component.

checkbox__input:
  * Native checkbox input. 
  * Not displayed.

checkbox__label:
  * The visible checkbox. 
  * Provides both the check (::before) and the box (::after)
  * Also provides the Text label using a nested <span> 


