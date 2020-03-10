export * from './bcp-47';

const bcp47_parse = require('bcp-47').parse;
const bcp47_stringify = require('bcp-47').stringify;
const bcp47_warning = require('bcp-47').warning;
export { bcp47_parse as parse, bcp47_stringify as stringify, bcp47_stringify as format, bcp47_warning as warning };
