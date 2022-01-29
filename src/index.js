/*global CustomEvent*/
import action from '@cocreate/actions';
import text from '@cocreate/text';


function  remove(btn) {
	let elements;
	let selector  = btn.getAttribute('remove-target');
	let targetDocument = document;

	if (selector) {
		if(selector.indexOf(';') !== -1) {
			let [documentSelector, targetSelector] = selector.split(';');
			let frame = document.querySelector(documentSelector);
			if (frame) {
			 	targetDocument = frame.contentDocument;
				if (targetSelector)
				 	elements = targetDocument.querySelectorAll(targetSelector);
				else
					elements = [targetDocument.clickedElement];
			}
		}
		else
			elements = targetDocument.querySelectorAll(selector);
	}
	else {
		selector = btn.getAttribute('remove-closest');
		if (selector)
			elements = [btn.closest(selector)];
		else
			elements = [btn.closest('[templateid]')];
	}
	let attribute = btn.getAttribute('remove-attribute');
	let attributeValue = btn.getAttribute('remove-value');

	for(let element of elements){
        let domTextEditor = element.closest('[contenteditable]');
		if (attribute){
			if (attributeValue) {
				switch(attribute) {
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
	document.dispatchEvent(new CustomEvent('removeElement', {detail: {}}));
}

action.init({
	action: "remove",
	endEvent: "remove",
	callback: (btn, data) => {
		remove(btn);
	}
});
