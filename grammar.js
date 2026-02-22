/// <reference types="tree-sitter-cli/dsl" />

function indented_block($, keyword) {
	return seq(
		keyword,
		optional($._space),
		/\n/,
		repeat1(choice($.block_body, $.block_empty_line)),
	)
}

module.exports = grammar({
	name: "litejs",

	externals: $ => [
		$.block_body,
		$.block_empty_line,
	],

	extras: $ => [],

	rules: {
		source_file: $ => repeat($._item),

		_item: $ => choice(
			$.js_block,
			$.css_block,
			$.plugin_line,
			$.comment,
			$.template_line,
			$._newline,
		),

		_newline: $ => /\n/,
		_space: $ => /[ \t]+/,
		_rest: $ => /[^\n]+/,

		js_block: $ => prec.dynamic(1, indented_block($, "%js")),
		css_block: $ => prec.dynamic(1, indented_block($, "%css")),

		plugin_line: $ => seq(
			optional($._space),
			choice($.plugin_name, alias("%js", $.plugin_name), alias("%css", $.plugin_name)),
			optional(seq(optional($._space), $._rest)),
			/\n/,
		),

		plugin_name: $ => /%[a-z]+/,

		comment: $ => seq(
			optional($._space),
			choice("//", "/"),
			optional($._rest),
			/\n/,
		),

		template_line: $ => seq(
			optional($._space),
			choice(
				seq($.selector, optional(seq($._space, choice(
					$._binding_list,
					alias($._rest, $.text_content),
				)))),
				$._binding_list,
				$.raw_text,
			),
			/\n/,
		),

		_binding_list: $ => repeat1(seq(
			choice($.binding, $.event),
			optional($.binding_args),
		)),

		selector: $ => /([^ \t\n;@\[]|\[[^\]\n]*\])+([ \t]*>[ \t]*([^ \t\n;@\[]|\[[^\]\n]*\])+)*/,

		binding: $ => token(prec(1, /;[a-zA-Z$]\w*[!:]?/)),
		event: $ => token(prec(1, /@[a-zA-Z]\w*[!:]?/)),
		binding_args: $ => token(prec(-1, /[^;@\n]+/)),
		raw_text: $ => seq(choice("= ", "\\ "), optional(alias($._rest, $.text_content))),
	},
})
