import { imports as consoleImports } from "./api.console.js";
import { imports as coreImports } from "./api.core.js";
import { imports as domImports } from "./api.dom.js";

async function run() {
	const response = await fetch("wasm_test.wasm");
	const module = await WebAssembly.compileStreaming(response);
	const memory = new WebAssembly.Memory({
		initial: 0, // No JS API to get the initial size of an imported memory. Let it fail and parse it from the error message.
	});
	const imports = {
		env: {
			...consoleImports(memory),
			...coreImports,
			...domImports(memory),
			memory,
		},
	};
	for (let i = 0; i < 2; i++) {
		try {
			const { exports: { run } } = await WebAssembly.instantiate(module, imports);
			run();
			break;
		}
		catch (ex) {
			if (i !== 0) {
				throw ex;
			}

			if (!(ex instanceof WebAssembly.LinkError)) {
				throw ex;
			}

			const matches = ex.message.match(/is smaller than initial (\d+), got 0/);
			if (matches !== null) {
				memory.grow(parseInt(matches[1]));
			}
		}
	}
}

if (document.readyState === "interactive" || document.readyState === "loaded") {
	run();
}
else {
	addEventListener("DOMContentLoaded", run, false);
}
