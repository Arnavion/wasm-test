/** @type {Map<number, any>} */ const objects = new Map();
let lastHandle = 0;

/**
 * @param {any} object
 */
export function allocate(object) {
	objects.set(++lastHandle, object);
	return lastHandle;
}

/**
 * @param {number} handle
 */
export function get(handle) {
	return objects.get(handle);
}

/**
 * @param {number} handle
 */
export function release(handle) {
	objects.delete(handle);
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {number} ptr
 * @param {number} len
 */
export function readStringFromModule(memory, ptr, len) {
	const decoder = new TextDecoder("utf-8");
	return decoder.decode(new Uint8Array(memory.buffer, ptr, len));
}

/**
 * @param {WebAssembly.Memory} memory
 */
export function imports(memory) {
	return {
		core_release: release,
	};
}
