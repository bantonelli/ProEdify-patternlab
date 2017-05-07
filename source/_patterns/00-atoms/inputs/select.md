STATE CLASSES: 
1) put on the <li> tags
    --> cs-focus 
    --> cs-selected

2) put on the selEl (<div> created by JS)
    --> cs-active
        - If class is on <div> then isOpen == true;
        
DATA ATTRIBUTES:  
1) data-class attribute can be put on the options for icons 
   or added styling
2) data-link attribute can be put on the option(s) for 
   providing links to other pages. (links will open in new 
   tab if options are set to do so) 

MARKUP:
<div>
    <span class="cs-placeholder"> </span>
    <div class="cs-options">
        <ul>
            <li>
                
            </li>    
        </ul>    
    </div>    
</div> 





SIDE NOTES 
1) <select> passed to function provides: 
    * the class name for selEl.
    * the tabIndex 
    * the options for the selEl
        * the data-class classes for the options 
