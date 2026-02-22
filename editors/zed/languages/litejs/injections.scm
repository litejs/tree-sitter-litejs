((js_block (block_body) @injection.content)
  (#set! injection.language "javascript"))

((css_block (block_body) @injection.content)
  (#set! injection.language "css"))

((selector) @injection.content
  (#set! injection.language "css"))

((binding_args) @injection.content
  (#set! injection.language "javascript"))
