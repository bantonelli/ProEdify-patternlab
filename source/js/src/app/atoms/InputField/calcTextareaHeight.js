let hiddenTextarea;

const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];


// get HTML node styling for border, box-sizing, and padding 
function calculateNodeStyling(node) {
  const style = window.getComputedStyle(node);

  const boxSizing = style.getPropertyValue('box-sizing');

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  );

  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  );

  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return { contextStyle, paddingSize, borderSize, boxSizing };
}

export default function calcTextareaHeight(
  targetNode,
  minRows = null,
  maxRows = null
) {

  // create a new text area (the hidden textarea) and append it to DOM. 
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  let {
    paddingSize,
    borderSize,
    boxSizing,
    contextStyle
  } = calculateNodeStyling(targetNode);

  // Set styles to hide the appended textarea 
  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
  
  // Set the hiddenTextarea to have the value of the real textarea
  // OLD CODE:hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';
  hiddenTextarea.value = targetNode.getAttribute("data-value") || targetNode.value || targetNode.placeholder || '';

  // Use the scrollHeight of the hidden textarea 
  // to find the calculated height of the real textarea 
  // Change this logic to instead get the font-size and line-height of 
  let height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'border-box') {
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }

  // Find the height of a single row 
  hiddenTextarea.value = '';
  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
  
  if (minRows !== null) {
    let minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }
    height = Math.max(minHeight, height);
  }
  if (maxRows !== null) {
    let maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    height = Math.min(maxHeight, height);
  }

  return { height: height + 'px'};
};

// DONE REFACTORING 