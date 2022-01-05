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
	for(let element of elements){
        let domTextEditor = element.closest('[contenteditable]');
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
