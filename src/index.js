/*global CustomEvent*/
import action from '@cocreate/actions';
import text from '@cocreate/text';
import { queryElements } from '@cocreate/utils';

function remove(btn) {
    let elements = queryElements({ element: btn, prefix: 'remove' });
    if (elements === false)
        elements = [btn.closest('[render-clone]')];



    let attribute = btn.getAttribute('remove-attribute');
    let attributeValue = btn.getAttribute('remove-value');

    for (let element of elements) {
        let domTextEditor = element.closest('[contenteditable]');
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

action.init({
    name: "remove",
    endEvent: "remove",
    callback: (data) => {
        remove(data.element);
    }
});
