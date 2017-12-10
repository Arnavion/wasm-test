#![feature(catch_expr, wasm_import_memory)]

#![wasm_import_memory]

extern crate browser;

#[no_mangle]
pub extern fn run() {
	let result = do catch {
		let document = browser::dom::document().map_err(|()| "couldn't get document")?;
		let div = document.query_selector("#output1").map_err(|()| "couldn't query #output1")?;
		let child = browser::dom::create_element("span").map_err(|()| "couldn't create span")?;
		child.set_inner_text("Hello WebAssembly");
		div.append_child(&child);

		let div = document.query_selector("#output2").map_err(|()| "couldn't query #output2")?;
		div.set_inner_html("<span>- Rust</span>");

		Ok(())
	};

	browser::console::log(match result {
		Ok(()) => "ok",
		Err(message) => message,
	})
}
