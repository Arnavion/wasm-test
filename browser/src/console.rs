extern {
	#[link_name = "console_log"]
	fn extern_console_log(message_ptr: *const u8, message_len: usize);
}

pub fn log(message: &str) {
	unsafe {
		extern_console_log(message.as_ptr(), message.len());
	}
}
