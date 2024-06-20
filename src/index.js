/*global CustomEvent*/
import Observer from '@cocreate/observer';
import Actions from '@cocreate/actions';
import text from '@cocreate/text';
import { queryElements } from '@cocreate/utils';

function remove(btn) {
    // TODO: if target is a contenteditable element we can use the activeSelection as the target
    let elements = []
    let toolbar = btn.closest('toolbar, .toolbar');
    if (toolbar) {
        if (toolbar.toolbar.target)
            elements.push(toolbar.toolbar.target);
    } else {
        elements = queryElements({ element: btn, prefix: 'remove' });
        if (elements === false)
            elements = [btn.closest('[render-clone]') || btn];

    }

    let attribute = btn.getAttribute('remove-attribute');
    let attributeValue = btn.getAttribute('remove-value');

    for (let element of elements) {
        let domTextEditor = element.closest('[contenteditable]');
        if (!domTextEditor.htmlString) {
            domTextEditor = domTextEditor.closest('[contenteditable]');
        }

        if (attribute) {
            if (attributeValue) {
                switch (attribute) {
                    case 'class':
                        if (domTextEditor)
                            text.removeClass({
                                domTextEditor,
                                target: element,
                                className: attributeValue
                            });
                        else
                            element.classList.remove(attributeValue);
                        break;
                    case 'style':
                        if (domTextEditor)
                            text.removeStyle({
                                domTextEditor,
                                target: element,
                                property: attributeValue
                            });
                        else
                            element.style.removeProperty(attributeValue);
                        break;
                    default:
                        if (domTextEditor)
                            text.setAttribute({
                                domTextEditor,
                                target: element,
                                name: attribute
                            });
                        else
                            element.setAttribute(attribute, '');
                }
            }
            else {
                if (domTextEditor)
                    text.removeAttribute({
                        domTextEditor,
                        target: element,
                        name: attribute
                    });
                else
                    element.removeAttribute(attribute);
            }
        }
        else {
            if (domTextEditor)
                text.removeElement({
                    domTextEditor,
                    target: element
                });
            else
                element.remove();
        }
    }
    document.dispatchEvent(new CustomEvent('remove', { detail: {} }));
}

Observer.init({
    name: 'CoCreateRemove',
    observe: ['addedNodes'],
    target: '[remove-timeout]',
    callback: function (mutation) {
        let timeout = mutation.target.getAttribute('remove-timeout');
        if (timeout >= 0) {
            setTimeout(function () {
                remove(mutation.target);
            }, timeout);
        }
    }
});

Observer.init({
    name: 'CoCreateElementsAttributes',
    observe: ['attributes'],
    attributeName: ['remove-timeout'],
    callback: function (mutation) {
        let timeout = mutation.target.getAttribute('remove-timeout');
        if (timeout >= 0) {
            setTimeout(function () {
                remove(mutation.target);
            }, timeout);
        }
    }
});

Actions.init({
    name: "remove",
    endEvent: "remove",
    callback: (data) => {
        remove(data.element);
    }
});
