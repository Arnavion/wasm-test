import { readStringFromModule } from "./api.core.js";

/**
 * @param {WebAssembly.Memory} memory
 */
export function imports(memory) {
	return {
		/**
		 * @param {number} messagePtr
		 * @param {number} messageLen
		 */
		console_log(messagePtr, messageLen) {
			const message = readStringFromModule(memory, messagePtr, messageLen);

			console.log(message);
		},
	};
};
