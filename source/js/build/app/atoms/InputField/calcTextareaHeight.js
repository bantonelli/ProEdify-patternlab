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
    hiddenTextarea.value = targetNode.getAttribute("value") || targetNode.value || targetNode.placeholder || '';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hdG9tcy9JbnB1dEZpZWxkL2NhbGNUZXh0YXJlYUhlaWdodC5qcyJdLCJuYW1lcyI6WyJjYWxjVGV4dGFyZWFIZWlnaHQiLCJoaWRkZW5UZXh0YXJlYSIsIkhJRERFTl9TVFlMRSIsIkNPTlRFWFRfU1RZTEUiLCJjYWxjdWxhdGVOb2RlU3R5bGluZyIsIm5vZGUiLCJzdHlsZSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJib3hTaXppbmciLCJnZXRQcm9wZXJ0eVZhbHVlIiwicGFkZGluZ1NpemUiLCJwYXJzZUZsb2F0IiwiYm9yZGVyU2l6ZSIsImNvbnRleHRTdHlsZSIsIm1hcCIsIm5hbWUiLCJqb2luIiwidGFyZ2V0Tm9kZSIsIm1pblJvd3MiLCJtYXhSb3dzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwic2V0QXR0cmlidXRlIiwidmFsdWUiLCJnZXRBdHRyaWJ1dGUiLCJwbGFjZWhvbGRlciIsImhlaWdodCIsInNjcm9sbEhlaWdodCIsInNpbmdsZVJvd0hlaWdodCIsIm1pbkhlaWdodCIsIk1hdGgiLCJtYXgiLCJtYXhIZWlnaHQiLCJtaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFzRHdCQSxrQjtBQXREeEIsTUFBSUMsdUJBQUo7O0FBRUEsTUFBTUMsb05BQU47O0FBVUEsTUFBTUMsZ0JBQWdCLENBQ3BCLGdCQURvQixFQUVwQixhQUZvQixFQUdwQixhQUhvQixFQUlwQixnQkFKb0IsRUFLcEIsYUFMb0IsRUFNcEIsYUFOb0IsRUFPcEIsV0FQb0IsRUFRcEIsZ0JBUm9CLEVBU3BCLGdCQVRvQixFQVVwQixPQVZvQixFQVdwQixhQVhvQixFQVlwQixjQVpvQixFQWFwQixlQWJvQixFQWNwQixjQWRvQixFQWVwQixZQWZvQixDQUF0Qjs7QUFtQkE7QUFDQSxXQUFTQyxvQkFBVCxDQUE4QkMsSUFBOUIsRUFBb0M7QUFDbEMsUUFBTUMsUUFBUUMsT0FBT0MsZ0JBQVAsQ0FBd0JILElBQXhCLENBQWQ7O0FBRUEsUUFBTUksWUFBWUgsTUFBTUksZ0JBQU4sQ0FBdUIsWUFBdkIsQ0FBbEI7O0FBRUEsUUFBTUMsY0FDSkMsV0FBV04sTUFBTUksZ0JBQU4sQ0FBdUIsZ0JBQXZCLENBQVgsSUFDQUUsV0FBV04sTUFBTUksZ0JBQU4sQ0FBdUIsYUFBdkIsQ0FBWCxDQUZGOztBQUtBLFFBQU1HLGFBQ0pELFdBQVdOLE1BQU1JLGdCQUFOLENBQXVCLHFCQUF2QixDQUFYLElBQ0FFLFdBQVdOLE1BQU1JLGdCQUFOLENBQXVCLGtCQUF2QixDQUFYLENBRkY7O0FBS0EsUUFBTUksZUFBZVgsY0FDbEJZLEdBRGtCLENBQ2Q7QUFBQSxhQUFXQyxJQUFYLFNBQW1CVixNQUFNSSxnQkFBTixDQUF1Qk0sSUFBdkIsQ0FBbkI7QUFBQSxLQURjLEVBRWxCQyxJQUZrQixDQUViLEdBRmEsQ0FBckI7O0FBSUEsV0FBTyxFQUFFSCwwQkFBRixFQUFnQkgsd0JBQWhCLEVBQTZCRSxzQkFBN0IsRUFBeUNKLG9CQUF6QyxFQUFQO0FBQ0Q7O0FBRWMsV0FBU1Qsa0JBQVQsQ0FDYmtCLFVBRGEsRUFJYjtBQUFBLFFBRkFDLE9BRUEsdUVBRlUsSUFFVjtBQUFBLFFBREFDLE9BQ0EsdUVBRFUsSUFDVjs7O0FBRUE7QUFDQSxRQUFJLENBQUNuQixjQUFMLEVBQXFCO0FBQ25CQSx1QkFBaUJvQixTQUFTQyxhQUFULENBQXVCLFVBQXZCLENBQWpCO0FBQ0FELGVBQVNFLElBQVQsQ0FBY0MsV0FBZCxDQUEwQnZCLGNBQTFCO0FBQ0Q7O0FBTkQsZ0NBYUlHLHFCQUFxQmMsVUFBckIsQ0FiSjtBQUFBLFFBU0VQLFdBVEYseUJBU0VBLFdBVEY7QUFBQSxRQVVFRSxVQVZGLHlCQVVFQSxVQVZGO0FBQUEsUUFXRUosU0FYRix5QkFXRUEsU0FYRjtBQUFBLFFBWUVLLFlBWkYseUJBWUVBLFlBWkY7O0FBZUE7QUFDQWIsbUJBQWV3QixZQUFmLENBQTRCLE9BQTVCLEVBQXdDWCxZQUF4QyxTQUF3RFosWUFBeEQ7O0FBRUE7QUFDQTtBQUNBRCxtQkFBZXlCLEtBQWYsR0FBdUJSLFdBQVdTLFlBQVgsQ0FBd0IsT0FBeEIsS0FBb0NULFdBQVdRLEtBQS9DLElBQXdEUixXQUFXVSxXQUFuRSxJQUFrRixFQUF6Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFJQyxTQUFTNUIsZUFBZTZCLFlBQTVCOztBQUVBLFFBQUlyQixjQUFjLFlBQWxCLEVBQWdDO0FBQzlCb0IsZUFBU0EsU0FBU2hCLFVBQWxCO0FBQ0QsS0FGRCxNQUVPLElBQUlKLGNBQWMsYUFBbEIsRUFBaUM7QUFDdENvQixlQUFTQSxTQUFTbEIsV0FBbEI7QUFDRDs7QUFFRDtBQUNBVixtQkFBZXlCLEtBQWYsR0FBdUIsRUFBdkI7QUFDQSxRQUFJSyxrQkFBa0I5QixlQUFlNkIsWUFBZixHQUE4Qm5CLFdBQXBEOztBQUVBLFFBQUlRLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsVUFBSWEsWUFBWUQsa0JBQWtCWixPQUFsQztBQUNBLFVBQUlWLGNBQWMsWUFBbEIsRUFBZ0M7QUFDOUJ1QixvQkFBWUEsWUFBWXJCLFdBQVosR0FBMEJFLFVBQXRDO0FBQ0Q7QUFDRGdCLGVBQVNJLEtBQUtDLEdBQUwsQ0FBU0YsU0FBVCxFQUFvQkgsTUFBcEIsQ0FBVDtBQUNEO0FBQ0QsUUFBSVQsWUFBWSxJQUFoQixFQUFzQjtBQUNwQixVQUFJZSxZQUFZSixrQkFBa0JYLE9BQWxDO0FBQ0EsVUFBSVgsY0FBYyxZQUFsQixFQUFnQztBQUM5QjBCLG9CQUFZQSxZQUFZeEIsV0FBWixHQUEwQkUsVUFBdEM7QUFDRDtBQUNEZ0IsZUFBU0ksS0FBS0csR0FBTCxDQUFTRCxTQUFULEVBQW9CTixNQUFwQixDQUFUO0FBQ0Q7O0FBRUQsV0FBTyxFQUFFQSxRQUFRQSxTQUFTLElBQW5CLEVBQVA7QUFDRDs7QUFFRCIsImZpbGUiOiJhcHAvYXRvbXMvSW5wdXRGaWVsZC9jYWxjVGV4dGFyZWFIZWlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaGlkZGVuVGV4dGFyZWE7XG5cbmNvbnN0IEhJRERFTl9TVFlMRSA9IGBcbiAgaGVpZ2h0OjAgIWltcG9ydGFudDtcbiAgdmlzaWJpbGl0eTpoaWRkZW4gIWltcG9ydGFudDtcbiAgb3ZlcmZsb3c6aGlkZGVuICFpbXBvcnRhbnQ7XG4gIHBvc2l0aW9uOmFic29sdXRlICFpbXBvcnRhbnQ7XG4gIHotaW5kZXg6LTEwMDAgIWltcG9ydGFudDtcbiAgdG9wOjAgIWltcG9ydGFudDtcbiAgcmlnaHQ6MCAhaW1wb3J0YW50XG5gO1xuXG5jb25zdCBDT05URVhUX1NUWUxFID0gW1xuICAnbGV0dGVyLXNwYWNpbmcnLFxuICAnbGluZS1oZWlnaHQnLFxuICAncGFkZGluZy10b3AnLFxuICAncGFkZGluZy1ib3R0b20nLFxuICAnZm9udC1mYW1pbHknLFxuICAnZm9udC13ZWlnaHQnLFxuICAnZm9udC1zaXplJyxcbiAgJ3RleHQtcmVuZGVyaW5nJyxcbiAgJ3RleHQtdHJhbnNmb3JtJyxcbiAgJ3dpZHRoJyxcbiAgJ3RleHQtaW5kZW50JyxcbiAgJ3BhZGRpbmctbGVmdCcsXG4gICdwYWRkaW5nLXJpZ2h0JyxcbiAgJ2JvcmRlci13aWR0aCcsXG4gICdib3gtc2l6aW5nJ1xuXTtcblxuXG4vLyBnZXQgSFRNTCBub2RlIHN0eWxpbmcgZm9yIGJvcmRlciwgYm94LXNpemluZywgYW5kIHBhZGRpbmcgXG5mdW5jdGlvbiBjYWxjdWxhdGVOb2RlU3R5bGluZyhub2RlKSB7XG4gIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cbiAgY29uc3QgYm94U2l6aW5nID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYm94LXNpemluZycpO1xuXG4gIGNvbnN0IHBhZGRpbmdTaXplID0gKFxuICAgIHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1ib3R0b20nKSkgK1xuICAgIHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSlcbiAgKTtcblxuICBjb25zdCBib3JkZXJTaXplID0gKFxuICAgIHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYm9yZGVyLWJvdHRvbS13aWR0aCcpKSArXG4gICAgcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdib3JkZXItdG9wLXdpZHRoJykpXG4gICk7XG5cbiAgY29uc3QgY29udGV4dFN0eWxlID0gQ09OVEVYVF9TVFlMRVxuICAgIC5tYXAobmFtZSA9PiBgJHtuYW1lfToke3N0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSl9YClcbiAgICAuam9pbignOycpO1xuXG4gIHJldHVybiB7IGNvbnRleHRTdHlsZSwgcGFkZGluZ1NpemUsIGJvcmRlclNpemUsIGJveFNpemluZyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYWxjVGV4dGFyZWFIZWlnaHQoXG4gIHRhcmdldE5vZGUsXG4gIG1pblJvd3MgPSBudWxsLFxuICBtYXhSb3dzID0gbnVsbFxuKSB7XG5cbiAgLy8gY3JlYXRlIGEgbmV3IHRleHQgYXJlYSAodGhlIGhpZGRlbiB0ZXh0YXJlYSkgYW5kIGFwcGVuZCBpdCB0byBET00uIFxuICBpZiAoIWhpZGRlblRleHRhcmVhKSB7XG4gICAgaGlkZGVuVGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaGlkZGVuVGV4dGFyZWEpO1xuICB9XG5cbiAgbGV0IHtcbiAgICBwYWRkaW5nU2l6ZSxcbiAgICBib3JkZXJTaXplLFxuICAgIGJveFNpemluZyxcbiAgICBjb250ZXh0U3R5bGVcbiAgfSA9IGNhbGN1bGF0ZU5vZGVTdHlsaW5nKHRhcmdldE5vZGUpO1xuXG4gIC8vIFNldCBzdHlsZXMgdG8gaGlkZSB0aGUgYXBwZW5kZWQgdGV4dGFyZWEgXG4gIGhpZGRlblRleHRhcmVhLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgJHtjb250ZXh0U3R5bGV9OyR7SElEREVOX1NUWUxFfWApO1xuICBcbiAgLy8gU2V0IHRoZSBoaWRkZW5UZXh0YXJlYSB0byBoYXZlIHRoZSB2YWx1ZSBvZiB0aGUgcmVhbCB0ZXh0YXJlYVxuICAvLyBPTEQgQ09ERTpoaWRkZW5UZXh0YXJlYS52YWx1ZSA9IHRhcmdldE5vZGUudmFsdWUgfHwgdGFyZ2V0Tm9kZS5wbGFjZWhvbGRlciB8fCAnJztcbiAgaGlkZGVuVGV4dGFyZWEudmFsdWUgPSB0YXJnZXROb2RlLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IHRhcmdldE5vZGUudmFsdWUgfHwgdGFyZ2V0Tm9kZS5wbGFjZWhvbGRlciB8fCAnJztcblxuICAvLyBVc2UgdGhlIHNjcm9sbEhlaWdodCBvZiB0aGUgaGlkZGVuIHRleHRhcmVhIFxuICAvLyB0byBmaW5kIHRoZSBjYWxjdWxhdGVkIGhlaWdodCBvZiB0aGUgcmVhbCB0ZXh0YXJlYSBcbiAgLy8gQ2hhbmdlIHRoaXMgbG9naWMgdG8gaW5zdGVhZCBnZXQgdGhlIGZvbnQtc2l6ZSBhbmQgbGluZS1oZWlnaHQgb2YgXG4gIGxldCBoZWlnaHQgPSBoaWRkZW5UZXh0YXJlYS5zY3JvbGxIZWlnaHQ7XG5cbiAgaWYgKGJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0ICsgYm9yZGVyU2l6ZTtcbiAgfSBlbHNlIGlmIChib3hTaXppbmcgPT09ICdjb250ZW50LWJveCcpIHtcbiAgICBoZWlnaHQgPSBoZWlnaHQgLSBwYWRkaW5nU2l6ZTtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGhlaWdodCBvZiBhIHNpbmdsZSByb3cgXG4gIGhpZGRlblRleHRhcmVhLnZhbHVlID0gJyc7XG4gIGxldCBzaW5nbGVSb3dIZWlnaHQgPSBoaWRkZW5UZXh0YXJlYS5zY3JvbGxIZWlnaHQgLSBwYWRkaW5nU2l6ZTtcbiAgXG4gIGlmIChtaW5Sb3dzICE9PSBudWxsKSB7XG4gICAgbGV0IG1pbkhlaWdodCA9IHNpbmdsZVJvd0hlaWdodCAqIG1pblJvd3M7XG4gICAgaWYgKGJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICBtaW5IZWlnaHQgPSBtaW5IZWlnaHQgKyBwYWRkaW5nU2l6ZSArIGJvcmRlclNpemU7XG4gICAgfVxuICAgIGhlaWdodCA9IE1hdGgubWF4KG1pbkhlaWdodCwgaGVpZ2h0KTtcbiAgfVxuICBpZiAobWF4Um93cyAhPT0gbnVsbCkge1xuICAgIGxldCBtYXhIZWlnaHQgPSBzaW5nbGVSb3dIZWlnaHQgKiBtYXhSb3dzO1xuICAgIGlmIChib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgbWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgcGFkZGluZ1NpemUgKyBib3JkZXJTaXplO1xuICAgIH1cbiAgICBoZWlnaHQgPSBNYXRoLm1pbihtYXhIZWlnaHQsIGhlaWdodCk7XG4gIH1cblxuICByZXR1cm4geyBoZWlnaHQ6IGhlaWdodCArICdweCd9O1xufTtcblxuLy8gRE9ORSBSRUZBQ1RPUklORyAiXX0=
