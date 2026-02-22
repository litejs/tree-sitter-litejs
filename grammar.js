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

	conflicts: $ => [
		[$.selector],
	],

	rules: {
		source_file: $ => repeat($._item),

		_item: $ => choice(
			$.js_block,
			$.css_block,
			$.view_directive,
			$.el_directive,
			$.plugin_directive,
			$.comment,
			$.binding_line,
			$.event_line,
			$.raw_text_line,
			$.template_line,
			$._newline,
		),

		_newline: $ => /\n/,
		_space: $ => /[ \t]+/,
		_rest: $ => /[^\n]+/,
		_word: $ => /\S+/,

		js_block: $ => indented_block($, "%js"),
		css_block: $ => indented_block($, "%css"),

		// %view name [parent]
		view_directive: $ => seq(
			"%view",
			$._space,
			field("name", alias($._word, $.view_name)),
			optional(seq($._space, field("parent", alias($._word, $.view_parent)))),
			optional($._rest),
			/\n/,
		),

		// %el name [params]
		el_directive: $ => seq(
			"%el",
			$._space,
			field("name", $.element_name),
			optional(seq($._space, field("params", alias($._rest, $.element_params)))),
			/\n/,
		),

		element_name: $ => /[A-Za-z][A-Za-z0-9_-]*/,

		// %def, %slot, %each, %svg, %start, %child
		plugin_directive: $ => seq(
			optional($._space),
			$.plugin_keyword,
			optional(seq(optional($._space), $._rest)),
			/\n/,
		),

		plugin_keyword: $ => choice("%def", "%slot", "%each", "%svg", "%start", "%child"),

		// Comments: /text or //text
		comment: $ => seq(
			optional($._space),
			choice("//", "/"),
			optional($._rest),
			/\n/,
		),

		// Binding lines: ;name[!:] args
		binding_line: $ => seq(
			optional($._space),
			$.binding,
			optional($._rest),
			/\n/,
		),

		binding: $ => /;[a-zA-Z$]\w*[!:]?/,

		// Event lines: @name[!:] args
		event_line: $ => seq(
			optional($._space),
			$.event,
			optional($._rest),
			/\n/,
		),

		event: $ => /@[a-zA-Z]\w*[!:]?/,

		// Raw text: = text or \ text
		raw_text_line: $ => seq(
			$._space,
			choice("= ", "\\ "),
			optional($._rest),
			/\n/,
		),

		// Template lines: selector with optional inline bindings/events/text
		template_line: $ => seq(
			optional($._space),
			$.selector,
			optional(seq(
				optional($._space),
				repeat1(choice(
					$.binding,
					$.event,
					$.text_content,
				)),
			)),
			/\n/,
		),

		// CSS-like selector: tag#id.class[attr=val] > child
		selector: $ => seq(
			$._selector_part,
			repeat(seq(
				optional($._space),
				$.child_combinator,
				optional($._space),
				$._selector_part,
			)),
		),

		_selector_part: $ => choice(
			seq(
				$.tag_name,
				repeat(choice(
					$.id_selector,
					$.class_selector,
					$.attribute_selector,
				)),
			),
			repeat1(choice(
				$.id_selector,
				$.class_selector,
				$.attribute_selector,
			)),
		),

		tag_name: $ => /[a-zA-Z][a-zA-Z0-9-]*/,
		id_selector: $ => /#[A-Za-z_-][A-Za-z0-9_-]*/,
		class_selector: $ => /\.[A-Za-z_-][A-Za-z0-9_-]*/,
		attribute_selector: $ => seq("[", /[^\]\n]*/, "]"),
		child_combinator: $ => ">",
		text_content: $ => /[^;@\n]+/,
	},
})
