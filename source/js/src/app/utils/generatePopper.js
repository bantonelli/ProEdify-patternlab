export default function generatePopperOnLoad(reference, popper) {
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
        classNames: [ 'popper' ],
        attributes: [],
        parent: window.document.body,
        content: '',
        contentType: 'text',
        arrowTagName: 'div',
        arrowClassNames: [ 'popper__arrow' ],
        arrowAttributes: [ 'x-arrow']
    };
    config = Object.assign({}, defaultConfig, config);

    var d = window.document;

    var popper = d.createElement(config.tagName);
    addClassNames(popper, config.classNames);
    addAttributes(popper, config.attributes);
    if (config.contentType === 'node') {
        popper.appendChild(config.content.jquery ? config.content[0] : config.content);
    }else if (config.contentType === 'html') {
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
    classNames.forEach(function(className) {
        element.classList.add(className);
    });
}

function addAttributes(element, attributes) {
    attributes.forEach(function(attribute) {
        element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
    });
}