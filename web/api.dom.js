import { allocate, get, readStringFromModule } from "./api.core.js";

/**
 * @param {WebAssembly.Memory} memory
 */
export function imports(memory) {
	return {
		/**
		 * @param {number} tagNamePtr
		 * @param {number} tagNameLen
		 */
		dom_createElement(tagNamePtr, tagNameLen) {
			const tagName = readStringFromModule(memory, tagNamePtr, tagNameLen);

			return allocate(document.createElement(tagName));
		},

		/**
		 */
		dom_document() {
			return allocate(document);
		},

		/**
		 * @param {number} parentNodeHandle
		 * @param {number} newChildNodeHandle
		 */
		dom_element_appendChild(parentNodeHandle, newChildNodeHandle) {
			/** @type {HTMLElement} */ const parentNode = get(parentNodeHandle);
			/** @type {HTMLElement} */ const childNode = get(newChildNodeHandle);

			parentNode.appendChild(childNode);
		},

		/**
		 * @param {number} nodeHandle
		 * @param {number} selectorPtr
		 * @param {number} selectorLen
		 */
		dom_element_querySelector(nodeHandle, selectorPtr, selectorLen) {
			/** @type {HTMLElement} */ const node = get(nodeHandle);
			const selector = readStringFromModule(memory, selectorPtr, selectorLen);

			const result = node.querySelector(selector);
			if (result === null) {
				return 0;
			}
			else {
				return allocate(result);
			}
		},

		/**
		 * @param {number} nodeHandle
		 * @param {number} innerTextPtr
		 * @param {number} innerTextLen
		 */
		dom_element_setInnerHTML(nodeHandle, innerTextPtr, innerTextLen) {
			/** @type {HTMLElement} */ const node = get(nodeHandle);
			const innerHTML = readStringFromModule(memory, innerTextPtr, innerTextLen);

			node.innerHTML = innerHTML;
		},

		/**
		 * @param {number} nodeHandle
		 * @param {number} innerTextPtr
		 * @param {number} innerTextLen
		 */
		dom_element_setInnerText(nodeHandle, innerTextPtr, innerTextLen) {
			/** @type {HTMLElement} */ const node = get(nodeHandle);
			const innerText = readStringFromModule(memory, innerTextPtr, innerTextLen);

			node.innerText = innerText;
		},
	};
}
