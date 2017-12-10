declare namespace WebAssembly {
	function compileStreaming(response: Response): Promise<Module>;
}
