define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = calcTextareaHeight;
  var hiddenTextarea = void 0;

  var HIDDEN_STYLE = '\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n';

  var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];

  // get HTML node styling for border, box-sizing, and padding 
  function calculateNodeStyling(node) {
    var style = window.getComputedStyle(node);

    var boxSizing = style.getPropertyValue('box-sizing');

    var paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));

    var borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));

    var contextStyle = CONTEXT_STYLE.map(function (name) {
      return name + ':' + style.getPropertyValue(name);
    }).join(';');

    return { contextStyle: contextStyle, paddingSize: paddingSize, borderSize: borderSize, boxSizing: boxSizing };
  }

  function calcTextareaHeight(targetNode) {
    var minRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var maxRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


    // create a new text area (the hidden textarea) and append it to DOM. 
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement('textarea');
      document.body.appendChild(hiddenTextarea);
    }

    var _calculateNodeStyling = calculateNodeStyling(targetNode),
        paddingSize = _calculateNodeStyling.paddingSize,
        borderSize = _calculateNodeStyling.borderSize,
        boxSizing = _calculateNodeStyling.boxSizing,
        contextStyle = _calculateNodeStyling.contextStyle;

    // Set styles to hide the appended textarea 
    hiddenTextarea.setAttribute('style', contextStyle + ';' + HIDDEN_STYLE);

    // Set the hiddenTextarea to have the value of the real textarea
    // OLD CODE:hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';
    hiddenTextarea.value = targetNode.getAttribute("data-value") || targetNode.value || targetNode.placeholder || '';

    // Use the scrollHeight of the hidden textarea 
    // to find the calculated height of the real textarea 
    // Change this logic to instead get the font-size and line-height of 
    var height = hiddenTextarea.scrollHeight;

    if (boxSizing === 'border-box') {
      height = height + borderSize;
    } else if (boxSizing === 'content-box') {
      height = height - paddingSize;
    }

    // Find the height of a single row 
    hiddenTextarea.value = '';
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    if (minRows !== null) {
      var minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      var maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }

    return { height: height + 'px' };
  };

  // DONE REFACTORING 
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dC9jYWxjVGV4dGFyZWFIZWlnaHQuanMiXSwibmFtZXMiOlsiY2FsY1RleHRhcmVhSGVpZ2h0IiwiaGlkZGVuVGV4dGFyZWEiLCJISURERU5fU1RZTEUiLCJDT05URVhUX1NUWUxFIiwiY2FsY3VsYXRlTm9kZVN0eWxpbmciLCJub2RlIiwic3R5bGUiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwiYm94U2l6aW5nIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInBhZGRpbmdTaXplIiwicGFyc2VGbG9hdCIsImJvcmRlclNpemUiLCJjb250ZXh0U3R5bGUiLCJtYXAiLCJuYW1lIiwiam9pbiIsInRhcmdldE5vZGUiLCJtaW5Sb3dzIiwibWF4Um93cyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInNldEF0dHJpYnV0ZSIsInZhbHVlIiwiZ2V0QXR0cmlidXRlIiwicGxhY2Vob2xkZXIiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJzaW5nbGVSb3dIZWlnaHQiLCJtaW5IZWlnaHQiLCJNYXRoIiwibWF4IiwibWF4SGVpZ2h0IiwibWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBc0R3QkEsa0I7QUF0RHhCLE1BQUlDLHVCQUFKOztBQUVBLE1BQU1DLG9OQUFOOztBQVVBLE1BQU1DLGdCQUFnQixDQUNwQixnQkFEb0IsRUFFcEIsYUFGb0IsRUFHcEIsYUFIb0IsRUFJcEIsZ0JBSm9CLEVBS3BCLGFBTG9CLEVBTXBCLGFBTm9CLEVBT3BCLFdBUG9CLEVBUXBCLGdCQVJvQixFQVNwQixnQkFUb0IsRUFVcEIsT0FWb0IsRUFXcEIsYUFYb0IsRUFZcEIsY0Fab0IsRUFhcEIsZUFib0IsRUFjcEIsY0Fkb0IsRUFlcEIsWUFmb0IsQ0FBdEI7O0FBbUJBO0FBQ0EsV0FBU0Msb0JBQVQsQ0FBOEJDLElBQTlCLEVBQW9DO0FBQ2xDLFFBQU1DLFFBQVFDLE9BQU9DLGdCQUFQLENBQXdCSCxJQUF4QixDQUFkOztBQUVBLFFBQU1JLFlBQVlILE1BQU1JLGdCQUFOLENBQXVCLFlBQXZCLENBQWxCOztBQUVBLFFBQU1DLGNBQ0pDLFdBQVdOLE1BQU1JLGdCQUFOLENBQXVCLGdCQUF2QixDQUFYLElBQ0FFLFdBQVdOLE1BQU1JLGdCQUFOLENBQXVCLGFBQXZCLENBQVgsQ0FGRjs7QUFLQSxRQUFNRyxhQUNKRCxXQUFXTixNQUFNSSxnQkFBTixDQUF1QixxQkFBdkIsQ0FBWCxJQUNBRSxXQUFXTixNQUFNSSxnQkFBTixDQUF1QixrQkFBdkIsQ0FBWCxDQUZGOztBQUtBLFFBQU1JLGVBQWVYLGNBQ2xCWSxHQURrQixDQUNkO0FBQUEsYUFBV0MsSUFBWCxTQUFtQlYsTUFBTUksZ0JBQU4sQ0FBdUJNLElBQXZCLENBQW5CO0FBQUEsS0FEYyxFQUVsQkMsSUFGa0IsQ0FFYixHQUZhLENBQXJCOztBQUlBLFdBQU8sRUFBRUgsMEJBQUYsRUFBZ0JILHdCQUFoQixFQUE2QkUsc0JBQTdCLEVBQXlDSixvQkFBekMsRUFBUDtBQUNEOztBQUVjLFdBQVNULGtCQUFULENBQ2JrQixVQURhLEVBSWI7QUFBQSxRQUZBQyxPQUVBLHVFQUZVLElBRVY7QUFBQSxRQURBQyxPQUNBLHVFQURVLElBQ1Y7OztBQUVBO0FBQ0EsUUFBSSxDQUFDbkIsY0FBTCxFQUFxQjtBQUNuQkEsdUJBQWlCb0IsU0FBU0MsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRCxlQUFTRSxJQUFULENBQWNDLFdBQWQsQ0FBMEJ2QixjQUExQjtBQUNEOztBQU5ELGdDQWFJRyxxQkFBcUJjLFVBQXJCLENBYko7QUFBQSxRQVNFUCxXQVRGLHlCQVNFQSxXQVRGO0FBQUEsUUFVRUUsVUFWRix5QkFVRUEsVUFWRjtBQUFBLFFBV0VKLFNBWEYseUJBV0VBLFNBWEY7QUFBQSxRQVlFSyxZQVpGLHlCQVlFQSxZQVpGOztBQWVBO0FBQ0FiLG1CQUFld0IsWUFBZixDQUE0QixPQUE1QixFQUF3Q1gsWUFBeEMsU0FBd0RaLFlBQXhEOztBQUVBO0FBQ0E7QUFDQUQsbUJBQWV5QixLQUFmLEdBQXVCUixXQUFXUyxZQUFYLENBQXdCLFlBQXhCLEtBQXlDVCxXQUFXUSxLQUFwRCxJQUE2RFIsV0FBV1UsV0FBeEUsSUFBdUYsRUFBOUc7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBSUMsU0FBUzVCLGVBQWU2QixZQUE1Qjs7QUFFQSxRQUFJckIsY0FBYyxZQUFsQixFQUFnQztBQUM5Qm9CLGVBQVNBLFNBQVNoQixVQUFsQjtBQUNELEtBRkQsTUFFTyxJQUFJSixjQUFjLGFBQWxCLEVBQWlDO0FBQ3RDb0IsZUFBU0EsU0FBU2xCLFdBQWxCO0FBQ0Q7O0FBRUQ7QUFDQVYsbUJBQWV5QixLQUFmLEdBQXVCLEVBQXZCO0FBQ0EsUUFBSUssa0JBQWtCOUIsZUFBZTZCLFlBQWYsR0FBOEJuQixXQUFwRDs7QUFFQSxRQUFJUSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFVBQUlhLFlBQVlELGtCQUFrQlosT0FBbEM7QUFDQSxVQUFJVixjQUFjLFlBQWxCLEVBQWdDO0FBQzlCdUIsb0JBQVlBLFlBQVlyQixXQUFaLEdBQTBCRSxVQUF0QztBQUNEO0FBQ0RnQixlQUFTSSxLQUFLQyxHQUFMLENBQVNGLFNBQVQsRUFBb0JILE1BQXBCLENBQVQ7QUFDRDtBQUNELFFBQUlULFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsVUFBSWUsWUFBWUosa0JBQWtCWCxPQUFsQztBQUNBLFVBQUlYLGNBQWMsWUFBbEIsRUFBZ0M7QUFDOUIwQixvQkFBWUEsWUFBWXhCLFdBQVosR0FBMEJFLFVBQXRDO0FBQ0Q7QUFDRGdCLGVBQVNJLEtBQUtHLEdBQUwsQ0FBU0QsU0FBVCxFQUFvQk4sTUFBcEIsQ0FBVDtBQUNEOztBQUVELFdBQU8sRUFBRUEsUUFBUUEsU0FBUyxJQUFuQixFQUFQO0FBQ0Q7O0FBRUQiLCJmaWxlIjoiYXBwL2F0b21zL0lucHV0L2NhbGNUZXh0YXJlYUhlaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBoaWRkZW5UZXh0YXJlYTtcblxuY29uc3QgSElEREVOX1NUWUxFID0gYFxuICBoZWlnaHQ6MCAhaW1wb3J0YW50O1xuICB2aXNpYmlsaXR5OmhpZGRlbiAhaW1wb3J0YW50O1xuICBvdmVyZmxvdzpoaWRkZW4gIWltcG9ydGFudDtcbiAgcG9zaXRpb246YWJzb2x1dGUgIWltcG9ydGFudDtcbiAgei1pbmRleDotMTAwMCAhaW1wb3J0YW50O1xuICB0b3A6MCAhaW1wb3J0YW50O1xuICByaWdodDowICFpbXBvcnRhbnRcbmA7XG5cbmNvbnN0IENPTlRFWFRfU1RZTEUgPSBbXG4gICdsZXR0ZXItc3BhY2luZycsXG4gICdsaW5lLWhlaWdodCcsXG4gICdwYWRkaW5nLXRvcCcsXG4gICdwYWRkaW5nLWJvdHRvbScsXG4gICdmb250LWZhbWlseScsXG4gICdmb250LXdlaWdodCcsXG4gICdmb250LXNpemUnLFxuICAndGV4dC1yZW5kZXJpbmcnLFxuICAndGV4dC10cmFuc2Zvcm0nLFxuICAnd2lkdGgnLFxuICAndGV4dC1pbmRlbnQnLFxuICAncGFkZGluZy1sZWZ0JyxcbiAgJ3BhZGRpbmctcmlnaHQnLFxuICAnYm9yZGVyLXdpZHRoJyxcbiAgJ2JveC1zaXppbmcnXG5dO1xuXG5cbi8vIGdldCBIVE1MIG5vZGUgc3R5bGluZyBmb3IgYm9yZGVyLCBib3gtc2l6aW5nLCBhbmQgcGFkZGluZyBcbmZ1bmN0aW9uIGNhbGN1bGF0ZU5vZGVTdHlsaW5nKG5vZGUpIHtcbiAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblxuICBjb25zdCBib3hTaXppbmcgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdib3gtc2l6aW5nJyk7XG5cbiAgY29uc3QgcGFkZGluZ1NpemUgPSAoXG4gICAgcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpKSArXG4gICAgcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXRvcCcpKVxuICApO1xuXG4gIGNvbnN0IGJvcmRlclNpemUgPSAoXG4gICAgcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdib3JkZXItYm90dG9tLXdpZHRoJykpICtcbiAgICBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci10b3Atd2lkdGgnKSlcbiAgKTtcblxuICBjb25zdCBjb250ZXh0U3R5bGUgPSBDT05URVhUX1NUWUxFXG4gICAgLm1hcChuYW1lID0+IGAke25hbWV9OiR7c3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKX1gKVxuICAgIC5qb2luKCc7Jyk7XG5cbiAgcmV0dXJuIHsgY29udGV4dFN0eWxlLCBwYWRkaW5nU2l6ZSwgYm9yZGVyU2l6ZSwgYm94U2l6aW5nIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhbGNUZXh0YXJlYUhlaWdodChcbiAgdGFyZ2V0Tm9kZSxcbiAgbWluUm93cyA9IG51bGwsXG4gIG1heFJvd3MgPSBudWxsXG4pIHtcblxuICAvLyBjcmVhdGUgYSBuZXcgdGV4dCBhcmVhICh0aGUgaGlkZGVuIHRleHRhcmVhKSBhbmQgYXBwZW5kIGl0IHRvIERPTS4gXG4gIGlmICghaGlkZGVuVGV4dGFyZWEpIHtcbiAgICBoaWRkZW5UZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChoaWRkZW5UZXh0YXJlYSk7XG4gIH1cblxuICBsZXQge1xuICAgIHBhZGRpbmdTaXplLFxuICAgIGJvcmRlclNpemUsXG4gICAgYm94U2l6aW5nLFxuICAgIGNvbnRleHRTdHlsZVxuICB9ID0gY2FsY3VsYXRlTm9kZVN0eWxpbmcodGFyZ2V0Tm9kZSk7XG5cbiAgLy8gU2V0IHN0eWxlcyB0byBoaWRlIHRoZSBhcHBlbmRlZCB0ZXh0YXJlYSBcbiAgaGlkZGVuVGV4dGFyZWEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGAke2NvbnRleHRTdHlsZX07JHtISURERU5fU1RZTEV9YCk7XG4gIFxuICAvLyBTZXQgdGhlIGhpZGRlblRleHRhcmVhIHRvIGhhdmUgdGhlIHZhbHVlIG9mIHRoZSByZWFsIHRleHRhcmVhXG4gIC8vIE9MRCBDT0RFOmhpZGRlblRleHRhcmVhLnZhbHVlID0gdGFyZ2V0Tm9kZS52YWx1ZSB8fCB0YXJnZXROb2RlLnBsYWNlaG9sZGVyIHx8ICcnO1xuICBoaWRkZW5UZXh0YXJlYS52YWx1ZSA9IHRhcmdldE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiKSB8fCB0YXJnZXROb2RlLnZhbHVlIHx8IHRhcmdldE5vZGUucGxhY2Vob2xkZXIgfHwgJyc7XG5cbiAgLy8gVXNlIHRoZSBzY3JvbGxIZWlnaHQgb2YgdGhlIGhpZGRlbiB0ZXh0YXJlYSBcbiAgLy8gdG8gZmluZCB0aGUgY2FsY3VsYXRlZCBoZWlnaHQgb2YgdGhlIHJlYWwgdGV4dGFyZWEgXG4gIC8vIENoYW5nZSB0aGlzIGxvZ2ljIHRvIGluc3RlYWQgZ2V0IHRoZSBmb250LXNpemUgYW5kIGxpbmUtaGVpZ2h0IG9mIFxuICBsZXQgaGVpZ2h0ID0gaGlkZGVuVGV4dGFyZWEuc2Nyb2xsSGVpZ2h0O1xuXG4gIGlmIChib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgIGhlaWdodCA9IGhlaWdodCArIGJvcmRlclNpemU7XG4gIH0gZWxzZSBpZiAoYm94U2l6aW5nID09PSAnY29udGVudC1ib3gnKSB7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0IC0gcGFkZGluZ1NpemU7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBoZWlnaHQgb2YgYSBzaW5nbGUgcm93IFxuICBoaWRkZW5UZXh0YXJlYS52YWx1ZSA9ICcnO1xuICBsZXQgc2luZ2xlUm93SGVpZ2h0ID0gaGlkZGVuVGV4dGFyZWEuc2Nyb2xsSGVpZ2h0IC0gcGFkZGluZ1NpemU7XG4gIFxuICBpZiAobWluUm93cyAhPT0gbnVsbCkge1xuICAgIGxldCBtaW5IZWlnaHQgPSBzaW5nbGVSb3dIZWlnaHQgKiBtaW5Sb3dzO1xuICAgIGlmIChib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgbWluSGVpZ2h0ID0gbWluSGVpZ2h0ICsgcGFkZGluZ1NpemUgKyBib3JkZXJTaXplO1xuICAgIH1cbiAgICBoZWlnaHQgPSBNYXRoLm1heChtaW5IZWlnaHQsIGhlaWdodCk7XG4gIH1cbiAgaWYgKG1heFJvd3MgIT09IG51bGwpIHtcbiAgICBsZXQgbWF4SGVpZ2h0ID0gc2luZ2xlUm93SGVpZ2h0ICogbWF4Um93cztcbiAgICBpZiAoYm94U2l6aW5nID09PSAnYm9yZGVyLWJveCcpIHtcbiAgICAgIG1heEhlaWdodCA9IG1heEhlaWdodCArIHBhZGRpbmdTaXplICsgYm9yZGVyU2l6ZTtcbiAgICB9XG4gICAgaGVpZ2h0ID0gTWF0aC5taW4obWF4SGVpZ2h0LCBoZWlnaHQpO1xuICB9XG5cbiAgcmV0dXJuIHsgaGVpZ2h0OiBoZWlnaHQgKyAncHgnfTtcbn07XG5cbi8vIERPTkUgUkVGQUNUT1JJTkcgIl19
