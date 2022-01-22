/*global CustomEvent*/
import action from '@cocreate/actions';
// import toolbar from '@cocreate/toolbar';
import text from '@cocreate/text';


// function  removeElement(btn) {
// 	let element = btn.closest('toolbar, .toolbar');
// 	let targetElement = element.toolbar.target;
// 	let domTextEditor = targetElement.ownerDocument.documentElement;

// 	text.removeElement({
// 		domTextEditor,
// 		target: targetElement
// 	});
	
// 	toolbar.hide(element);
	
// 	document.dispatchEvent(new CustomEvent('removeElement', {
// 		detail: {}
// 	}));
// }

// action.init({
// 	action: "removeElement",
// 	endEvent: "removeElement",
// 	callback: (btn, data) => {
// 		removeElement(btn);
// 	}
// });

function  remove(btn) {
	let elements;
	let selector  = btn.getAttribute('remove-target');
	if (selector)
		elements = document.querySelectorAll(selector);
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
				if (attribute == 'class'){
					if (domTextEditor)
						text.removeClass({
			        		domTextEditor,
			        		target: element,
			        		className: attributeValue
			        	});
			        else
			        	element.classList.remove(attributeValue);
				}
				if (attribute == 'style'){
					if (domTextEditor)
						text.removeStyle({
			        		domTextEditor,
			        		target: element,
			        		property: attributeValue
			        	});
			        else
			        	element.style.removeProperty(attributeValue);
				}
				if (domTextEditor)
					text.setAttribute({
		        		domTextEditor,
		        		target: element,
		        		name: attribute
		        	});
		        else
		        	element.setAttribute(attribute, '');
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
        if (domTextEditor)
        	text.removeElement({
        		domTextEditor,
        		target: element
        	});
	    else
	        element.remove();
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
