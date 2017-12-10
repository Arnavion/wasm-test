extern {
	#[link_name = "release"]
	fn extern_release(handle: i32);
}

#[derive(Debug)]
#[repr(C)]
pub struct Handle(i32);

impl Handle {
	pub fn to_native(&self) -> i32 {
		self.0
	}
}

impl ::std::convert::TryFrom<i32> for Handle {
	type Error = ();

	fn try_from(value: i32) -> Result<Self, Self::Error> {
		if value == 0 {
			Err(())
		}
		else {
			Ok(Handle(value))
		}
	}
}

impl Drop for Handle {
	fn drop(&mut self) {
		unsafe {
			::core::extern_release(self.0);
		}
	}
}
