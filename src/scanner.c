#include "tree_sitter/parser.h"

enum TokenType {
	BLOCK_BODY,
	BLOCK_EMPTY_LINE,
};

void *tree_sitter_litejs_external_scanner_create(void) {
	return NULL;
}

void tree_sitter_litejs_external_scanner_destroy(void *payload) {
}

unsigned tree_sitter_litejs_external_scanner_serialize(void *payload, char *buffer) {
	return 0;
}

void tree_sitter_litejs_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
}

/*
 * Scan tokens for %js/%css indented blocks.
 *
 * BLOCK_BODY: consecutive indented lines (stops at empty line or col 0).
 * BLOCK_EMPTY_LINE: a single empty line within a block (highlighted as error).
 */
bool tree_sitter_litejs_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
	if (lexer->get_column(lexer) != 0) {
		return false;
	}

	int32_t c = lexer->lookahead;

	/* Empty line token — matches \n at column 0 inside a block */
	if (valid_symbols[BLOCK_EMPTY_LINE] && c == '\n') {
		lexer->advance(lexer, false);
		lexer->result_symbol = BLOCK_EMPTY_LINE;
		return true;
	}

	if (!valid_symbols[BLOCK_BODY]) {
		return false;
	}

	/* Block body must start with whitespace */
	if (c != '\t' && c != ' ') {
		return false;
	}

	bool has_content = false;

	for (;;) {
		c = lexer->lookahead;

		if (c == 0 || c == '\n') {
			/* EOF or empty line — end this chunk */
			break;
		}

		if (c != '\t' && c != ' ') {
			/* Non-whitespace at column 0 — block is over */
			break;
		}

		/* Indented line — consume entire line */
		has_content = true;
		while (lexer->lookahead != '\n' && lexer->lookahead != 0) {
			lexer->advance(lexer, false);
		}
		if (lexer->lookahead == '\n') {
			lexer->advance(lexer, false);
		}
	}

	if (has_content) {
		lexer->result_symbol = BLOCK_BODY;
		return true;
	}

	return false;
}
