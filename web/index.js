import { imports as consoleImports } from "./api.console.js";
import { imports as coreImports } from "./api.core.js";
import { imports as domImports } from "./api.dom.js";
import { getImportedMemoryDescriptor } from "./wasm.js";

async function run() {
	const response = await fetch("wasm_test.wasm");
	const buffer = await response.arrayBuffer();

	const module = await WebAssembly.compile(buffer);

	let importedMemoryDescriptor = getImportedMemoryDescriptor(new DataView(buffer));
	if (importedMemoryDescriptor === null) {
		throw new Error("did not find imported memory limits");
	}

	const memory = new WebAssembly.Memory(importedMemoryDescriptor);
	const imports = {
		env: {
			...consoleImports(memory),
			...coreImports(memory),
			...domImports(memory),
			memory,
		},
	};

	const { exports: { render } } = await WebAssembly.instantiate(module, imports);

	render();
}

if (document.readyState === "interactive" || document.readyState === "loaded") {
	run();
}
else {
	addEventListener("DOMContentLoaded", run, false);
}
