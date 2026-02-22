; Plugin directives
"%js" @keyword
"%css" @keyword
"%view" @keyword
"%el" @keyword
(plugin_keyword) @keyword

; View/element names
(view_directive
  name: (view_name) @type)
(view_directive
  parent: (view_parent) @type.builtin)
(el_directive
  name: (element_name) @type)
(el_directive
  params: (element_params) @variable.parameter)

; Bindings
(binding) @function
; Events
(event) @attribute

; Comments
(comment) @comment

; Selectors
(tag_name) @tag
(class_selector) @label
(id_selector) @constant
(attribute_selector) @string.special
(child_combinator) @operator
(text_content) @string

; Empty lines in blocks (error)
(block_empty_line) @error

; Raw text
(raw_text_line) @string
