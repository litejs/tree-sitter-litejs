; Inject JavaScript into %js blocks
((js_block
  (block_body) @injection.content)
  (#set! injection.language "javascript"))

; Inject CSS into %css blocks
((css_block
  (block_body) @injection.content)
  (#set! injection.language "css"))
