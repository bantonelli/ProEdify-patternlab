Basic text hyperlink link.

JS COMPONENT PROPERTIES:
___ 
* `:linkurl = {{link.linkUrl}}`
  * URL for the text link. 
* `:showborder = {{link.showBorder}}`
  * Boolean value to determine if link border should be rendered 
* `:classes = {{link.class}}`
  * An object of modifier/variation class names mapped to booleans
  * If class name is false it will not be applied and vice-versa

___
BEM STRUCTURE: `text-link`, `text-link__link`, `text-link__border`
___

* text-link:
  * Container block that wraps the component.

* text-link__link:
  * Native `<a>` tag. 
  * Contains the default slot which is used for text.

* text-link__border:
  * Provides the animated bottom border.

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks:
* VueJS SLOT: Default Slot (no name) for text to be passed. 

Color Modifiers: `text-link_bgcolor-dark`, `text-link_bgcolor-gray`


