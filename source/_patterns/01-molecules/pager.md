Pagination element that displays page numbers dynamically.

JS COMPONENT PROPERTIES:
___

* `:current-page`
  * Number for the default starting page.  
* `:page-count`
  * Number that determines total number of pages   
* `@change`
  * Event emitted by pager when a page number is clicked  
  * Handler function is passed the Number value of the new page

___
BEM STRUCTURE: `pager`
___

* pager:
  * Container block that wraps the component.    

___
SLOTS, VARIATIONS, MODIFIERS:
___

Content Blocks: N/A

Size Modifiers: `pager_size-small`, `pager_size-large` 

Color Modifiers: `pager_color-invert`