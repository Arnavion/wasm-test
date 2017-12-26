/**
 * @param {DataView} view
 */
export function getImportedMemoryDescriptor(view) {
	let offset = 0;

	const magic = view.getUint32(offset, true);
	offset += 4;
	if (magic !== 0x6d736100) {
		throw new Error("uexpected magic");
	}

	const version = view.getUint32(offset, true);
	offset += 4;
	if (version !== 0x1) {
		throw new Error("unexpected version");
	}

	while (offset < view.byteLength) {
		const [sectionId, sectionIdLength] = parseVarUint(slice(view, offset, 1));
		offset += sectionIdLength;

		const [payloadLength, payloadLengthLength] = parseVarUint(slice(view, offset, 4));
		offset += payloadLengthLength;

		const sectionView = slice(view, offset, payloadLength);
		offset += payloadLength;

		if (sectionId !== 2) {
			continue;
		}

		const initial = getImportedMemoryDescriptorFromImportSection(sectionView);
		if (initial !== null) {
			return initial;
		}
	}

	return null;
}

/**
 * @param {DataView} view
 */
function getImportedMemoryDescriptorFromImportSection(view) {
	let offset = 0;

	const [numImportEntries, numImportEntriesLength] = parseVarUint(slice(view, offset, 4));
	offset += numImportEntriesLength;

	for (let i = 0; i < numImportEntries; i++) {
		const [moduleNameLength, moduleNameLengthLength] = parseVarUint(slice(view, offset, 4));
		offset += moduleNameLengthLength;

		offset += moduleNameLength;

		const [fieldNameLength, fieldNameLengthLength] = parseVarUint(slice(view, offset, 4));
		offset += fieldNameLengthLength;

		offset += fieldNameLength;

		const externalKind = view.getUint8(offset);
		offset += 1;

		switch (externalKind) {
			case 0:
				const [, functionTypeIndexLength] = parseVarUint(slice(view, offset, 4));
				offset += functionTypeIndexLength;
				continue;

			case 1:
				throw new Error("don't know how to parse tables");

			case 2:
				const [flags, flagsLength] = parseVarUint(slice(view, offset, 4));
				offset += flagsLength;

				switch (flags) {
					case 0:
					case 1:
						break;

					default:
						throw new Error("unexpected memory flag");
				}

				const [initial, initialLength] = parseVarUint(slice(view, offset, 4));
				offset += initialLength;

				/** @type {WebAssembly.MemoryDescriptor} */
				const result = { initial };
				if (flags === 1) {
					const [maximum, maximumLength] = parseVarUint(slice(view, offset, 4));
					offset += maximumLength;

					result.maximum = maximum;
				}
				return result;

			case 3:
				throw new Error("don't know how to parse globals");

			default:
				throw new Error("unexpected external kind");
		}
	}

	return null;
}

/**
 * @param {DataView} view
 * @param {number} byteOffset
 * @param {number} byteLength
 */
function slice(view, byteOffset, byteLength) {
	return new DataView(view.buffer, view.byteOffset + byteOffset, byteLength);
}

/**
 * @param {DataView} view
 * @returns {[number, number]}
 */
function parseVarUint(view) {
	let offset = 0;
	let result = 0;
	let shift = 0;

	for (; ;) {
		const byte = view.getUint8(offset);
		offset += 1;

		result |= ((byte & 0x7f) << shift);

		if ((byte & 0x80) === 0) {
			break;
		}

		shift += 7;
	}

	return [result, offset];
}
