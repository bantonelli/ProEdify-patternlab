define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = generatePopperOnLoad;
    function generatePopperOnLoad(reference, popper) {
        // if the popper variable is a configuration object, parse it to generate an HTMLElement
        // generate a default popper if is not defined
        var isNotDefined = typeof popper === 'undefined' || popper === null;
        var isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';
        if (isNotDefined || isConfig) {
            popper = parse(isConfig ? popper : {});
        }
    }

    function parse(config) {
        var defaultConfig = {
            tagName: 'div',
            classNames: ['popper'],
            attributes: [],
            parent: window.document.body,
            content: '',
            contentType: 'text',
            arrowTagName: 'div',
            arrowClassNames: ['popper__arrow'],
            arrowAttributes: ['x-arrow']
        };
        config = Object.assign({}, defaultConfig, config);

        var d = window.document;

        var popper = d.createElement(config.tagName);
        addClassNames(popper, config.classNames);
        addAttributes(popper, config.attributes);
        if (config.contentType === 'node') {
            popper.appendChild(config.content.jquery ? config.content[0] : config.content);
        } else if (config.contentType === 'html') {
            popper.innerHTML = config.content;
        } else {
            popper.textContent = config.content;
        }

        if (config.arrowTagName) {
            var arrow = d.createElement(config.arrowTagName);
            addClassNames(arrow, config.arrowClassNames);
            addAttributes(arrow, config.arrowAttributes);
            popper.appendChild(arrow);
        }

        var parent = config.parent.jquery ? config.parent[0] : config.parent;

        // if the given parent is a string, use it to match an element
        // if more than one element is matched, the first one will be used as parent
        // if no elements are matched, the script will throw an error
        if (typeof parent === 'string') {
            parent = d.querySelectorAll(config.parent);
            if (parent.length > 1) {
                console.warn('WARNING: the given `parent` query(' + config.parent + ') matched more than one element, the first one will be used');
            }
            if (parent.length === 0) {
                throw 'ERROR: the given `parent` doesn\'t exists!';
            }
            parent = parent[0];
        }
        // if the given parent is a DOM nodes list or an array of nodes with more than one element,
        // the first one will be used as parent
        if (parent.length > 1 && parent instanceof Element === false) {
            console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
            parent = parent[0];
        }

        // append the generated popper to its parent
        parent.appendChild(popper);

        return popper;
    }

    function addClassNames(element, classNames) {
        classNames.forEach(function (className) {
            element.classList.add(className);
        });
    }

    function addAttributes(element, attributes) {
        attributes.forEach(function (attribute) {
            element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
        });
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9nZW5lcmF0ZVBvcHBlci5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZVBvcHBlck9uTG9hZCIsInJlZmVyZW5jZSIsInBvcHBlciIsImlzTm90RGVmaW5lZCIsImlzQ29uZmlnIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwicGFyc2UiLCJjb25maWciLCJkZWZhdWx0Q29uZmlnIiwidGFnTmFtZSIsImNsYXNzTmFtZXMiLCJhdHRyaWJ1dGVzIiwicGFyZW50Iiwid2luZG93IiwiZG9jdW1lbnQiLCJib2R5IiwiY29udGVudCIsImNvbnRlbnRUeXBlIiwiYXJyb3dUYWdOYW1lIiwiYXJyb3dDbGFzc05hbWVzIiwiYXJyb3dBdHRyaWJ1dGVzIiwiYXNzaWduIiwiZCIsImNyZWF0ZUVsZW1lbnQiLCJhZGRDbGFzc05hbWVzIiwiYWRkQXR0cmlidXRlcyIsImFwcGVuZENoaWxkIiwianF1ZXJ5IiwiaW5uZXJIVE1MIiwidGV4dENvbnRlbnQiLCJhcnJvdyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJjb25zb2xlIiwid2FybiIsIkVsZW1lbnQiLCJlbGVtZW50IiwiZm9yRWFjaCIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInNwbGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBQXdCQSxvQjtBQUFULGFBQVNBLG9CQUFULENBQThCQyxTQUE5QixFQUF5Q0MsTUFBekMsRUFBaUQ7QUFDNUQ7QUFDQTtBQUNBLFlBQUlDLGVBQWUsT0FBT0QsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsV0FBVyxJQUEvRDtBQUNBLFlBQUlFLFdBQVdGLFVBQVVHLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQk4sTUFBL0IsTUFBMkMsaUJBQXBFO0FBQ0EsWUFBSUMsZ0JBQWdCQyxRQUFwQixFQUE4QjtBQUMxQkYscUJBQVNPLE1BQU1MLFdBQVdG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QUFTYixhQUFULENBQXVCVyxPQUF2QixFQUFnQ3pCLFVBQWhDLEVBQTRDO0FBQ3hDQSxtQkFBVzBCLE9BQVgsQ0FBbUIsVUFBU0ksU0FBVCxFQUFvQjtBQUNuQ0wsb0JBQVFNLFlBQVIsQ0FBcUJELFVBQVVFLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBckIsRUFBOENGLFVBQVVFLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsS0FBMkIsRUFBekU7QUFDSCxTQUZEO0FBR0giLCJmaWxlIjoiYXBwL3V0aWxzL2dlbmVyYXRlUG9wcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVQb3BwZXJPbkxvYWQocmVmZXJlbmNlLCBwb3BwZXIpIHtcbiAgICAvLyBpZiB0aGUgcG9wcGVyIHZhcmlhYmxlIGlzIGEgY29uZmlndXJhdGlvbiBvYmplY3QsIHBhcnNlIGl0IHRvIGdlbmVyYXRlIGFuIEhUTUxFbGVtZW50XG4gICAgLy8gZ2VuZXJhdGUgYSBkZWZhdWx0IHBvcHBlciBpZiBpcyBub3QgZGVmaW5lZFxuICAgIHZhciBpc05vdERlZmluZWQgPSB0eXBlb2YgcG9wcGVyID09PSAndW5kZWZpbmVkJyB8fCBwb3BwZXIgPT09IG51bGw7XG4gICAgdmFyIGlzQ29uZmlnID0gcG9wcGVyICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwb3BwZXIpID09PSAnW29iamVjdCBPYmplY3RdJztcbiAgICBpZiAoaXNOb3REZWZpbmVkIHx8IGlzQ29uZmlnKSB7XG4gICAgICAgIHBvcHBlciA9IHBhcnNlKGlzQ29uZmlnID8gcG9wcGVyIDoge30pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2UoY29uZmlnKSB7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgIHRhZ05hbWU6ICdkaXYnLFxuICAgICAgICBjbGFzc05hbWVzOiBbICdwb3BwZXInIF0sXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxuICAgICAgICBwYXJlbnQ6IHdpbmRvdy5kb2N1bWVudC5ib2R5LFxuICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgY29udGVudFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgYXJyb3dUYWdOYW1lOiAnZGl2JyxcbiAgICAgICAgYXJyb3dDbGFzc05hbWVzOiBbICdwb3BwZXJfX2Fycm93JyBdLFxuICAgICAgICBhcnJvd0F0dHJpYnV0ZXM6IFsgJ3gtYXJyb3cnXVxuICAgIH07XG4gICAgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcblxuICAgIHZhciBkID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHBvcHBlciA9IGQuY3JlYXRlRWxlbWVudChjb25maWcudGFnTmFtZSk7XG4gICAgYWRkQ2xhc3NOYW1lcyhwb3BwZXIsIGNvbmZpZy5jbGFzc05hbWVzKTtcbiAgICBhZGRBdHRyaWJ1dGVzKHBvcHBlciwgY29uZmlnLmF0dHJpYnV0ZXMpO1xuICAgIGlmIChjb25maWcuY29udGVudFR5cGUgPT09ICdub2RlJykge1xuICAgICAgICBwb3BwZXIuYXBwZW5kQ2hpbGQoY29uZmlnLmNvbnRlbnQuanF1ZXJ5ID8gY29uZmlnLmNvbnRlbnRbMF0gOiBjb25maWcuY29udGVudCk7XG4gICAgfWVsc2UgaWYgKGNvbmZpZy5jb250ZW50VHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgIHBvcHBlci5pbm5lckhUTUwgPSBjb25maWcuY29udGVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwb3BwZXIudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudDtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmFycm93VGFnTmFtZSkge1xuICAgICAgICB2YXIgYXJyb3cgPSBkLmNyZWF0ZUVsZW1lbnQoY29uZmlnLmFycm93VGFnTmFtZSk7XG4gICAgICAgIGFkZENsYXNzTmFtZXMoYXJyb3csIGNvbmZpZy5hcnJvd0NsYXNzTmFtZXMpO1xuICAgICAgICBhZGRBdHRyaWJ1dGVzKGFycm93LCBjb25maWcuYXJyb3dBdHRyaWJ1dGVzKTtcbiAgICAgICAgcG9wcGVyLmFwcGVuZENoaWxkKGFycm93KTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50ID0gY29uZmlnLnBhcmVudC5qcXVlcnkgPyBjb25maWcucGFyZW50WzBdIDogY29uZmlnLnBhcmVudDtcblxuICAgIC8vIGlmIHRoZSBnaXZlbiBwYXJlbnQgaXMgYSBzdHJpbmcsIHVzZSBpdCB0byBtYXRjaCBhbiBlbGVtZW50XG4gICAgLy8gaWYgbW9yZSB0aGFuIG9uZSBlbGVtZW50IGlzIG1hdGNoZWQsIHRoZSBmaXJzdCBvbmUgd2lsbCBiZSB1c2VkIGFzIHBhcmVudFxuICAgIC8vIGlmIG5vIGVsZW1lbnRzIGFyZSBtYXRjaGVkLCB0aGUgc2NyaXB0IHdpbGwgdGhyb3cgYW4gZXJyb3JcbiAgICBpZiAodHlwZW9mIHBhcmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50ID0gZC5xdWVyeVNlbGVjdG9yQWxsKGNvbmZpZy5wYXJlbnQpO1xuICAgICAgICBpZiAocGFyZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogdGhlIGdpdmVuIGBwYXJlbnRgIHF1ZXJ5KCcgKyBjb25maWcucGFyZW50ICsgJykgbWF0Y2hlZCBtb3JlIHRoYW4gb25lIGVsZW1lbnQsIHRoZSBmaXJzdCBvbmUgd2lsbCBiZSB1c2VkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogdGhlIGdpdmVuIGBwYXJlbnRgIGRvZXNuXFwndCBleGlzdHMhJztcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQgPSBwYXJlbnRbMF07XG4gICAgfVxuICAgIC8vIGlmIHRoZSBnaXZlbiBwYXJlbnQgaXMgYSBET00gbm9kZXMgbGlzdCBvciBhbiBhcnJheSBvZiBub2RlcyB3aXRoIG1vcmUgdGhhbiBvbmUgZWxlbWVudCxcbiAgICAvLyB0aGUgZmlyc3Qgb25lIHdpbGwgYmUgdXNlZCBhcyBwYXJlbnRcbiAgICBpZiAocGFyZW50Lmxlbmd0aCA+IDEgJiYgcGFyZW50IGluc3RhbmNlb2YgRWxlbWVudCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiB5b3UgaGF2ZSBwYXNzZWQgYXMgcGFyZW50IGEgbGlzdCBvZiBlbGVtZW50cywgdGhlIGZpcnN0IG9uZSB3aWxsIGJlIHVzZWQnKTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50WzBdO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCB0aGUgZ2VuZXJhdGVkIHBvcHBlciB0byBpdHMgcGFyZW50XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHBvcHBlcik7XG5cbiAgICByZXR1cm4gcG9wcGVyO1xufVxuXG5mdW5jdGlvbiBhZGRDbGFzc05hbWVzKGVsZW1lbnQsIGNsYXNzTmFtZXMpIHtcbiAgICBjbGFzc05hbWVzLmZvckVhY2goZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5zcGxpdCgnOicpWzBdLCBhdHRyaWJ1dGUuc3BsaXQoJzonKVsxXSB8fCAnJyk7XG4gICAgfSk7XG59Il19
