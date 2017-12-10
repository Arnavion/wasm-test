extern {
	#[link_name = "dom_createElement"]
	fn extern_dom_createElement(tag_name_ptr: *const u8, tag_name_len: usize) -> i32;

	#[link_name = "dom_document"]
	fn extern_dom_document() -> i32;

	#[link_name = "dom_element_appendChild"]
	fn extern_dom_node_appendChild(parent_node_handle: i32, new_child_node_handle: i32);

	#[link_name = "dom_element_querySelector"]
	fn extern_dom_querySelector(node_handle: i32, selector_ptr: *const u8, selector_len: usize) -> i32;

	#[link_name = "dom_element_setInnerHTML"]
	fn extern_dom_node_setInnerHTML(node_handle: i32, inner_html_ptr: *const u8, inner_html_len: usize);

	#[link_name = "dom_element_setInnerText"]
	fn extern_dom_node_setInnerText(node_handle: i32, inner_text_ptr: *const u8, inner_text_len: usize);
}

pub fn create_element(tag_name: &str) -> Result<Element, ()> {
	unsafe {
		Ok(Element(::std::convert::TryInto::try_into(extern_dom_createElement(tag_name.as_ptr(), tag_name.len()))?))
	}
}

pub fn document() -> Result<Element, ()> {
	unsafe {
		Ok(Element(::std::convert::TryInto::try_into(extern_dom_document())?))
	}
}

#[derive(Debug)]
pub struct Element(::Handle);

impl Element {
	pub fn append_child(&self, new_child: &Element) {
		unsafe {
			extern_dom_node_appendChild(self.0.to_native(), new_child.0.to_native());
		}
	}

	pub fn query_selector(&self, selector: &str) -> Result<Element, ()> {
		unsafe {
			let node_handle = extern_dom_querySelector(self.0.to_native(), selector.as_ptr(), selector.len());
			Ok(Element(::std::convert::TryInto::try_into(node_handle)?))
		}
	}

	pub fn set_inner_html(&self, inner_html: &str) {
		unsafe {
			extern_dom_node_setInnerHTML(self.0.to_native(), inner_html.as_ptr(), inner_html.len());
		}
	}

	pub fn set_inner_text(&self, inner_text: &str) {
		unsafe {
			extern_dom_node_setInnerText(self.0.to_native(), inner_text.as_ptr(), inner_text.len());
		}
	}
}
