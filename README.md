Testing Rust's native (non-emscripten) wasm target with browser FFI.

1. Install wasm target

	```sh
	rustup target add wasm32-unknown-unknown
	```

1. Install `wasm-gc`

	```sh
	cargo install --force --git 'https://github.com/alexcrichton/wasm-gc'
	```

1. Build

	```sh
	cargo build --release --target wasm32-unknown-unknown
	wasm-gc ./target/wasm32-unknown-unknown/release/wasm_test.wasm ./web/wasm_test.wasm
	```

1. Point a web server at `web/`

1. Open `index.html` in a browser.
