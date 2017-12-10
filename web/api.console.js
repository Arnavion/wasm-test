import { getString } from "./api.core.js";

/**
 * @param {WebAssembly.Memory} memory
 */
export function imports(memory) {
	return {
		/**
		 *  @param {number} messagePtr
		 *  @param {number} messageLen
		 */
		console_log(messagePtr, messageLen) {
			const message = getString(memory, messagePtr, messageLen);

			console.log(message);
		},
	};
};
