export * from './bcp-47';

const bcp47_parse = require('bcp-47').parse;
const bcp47_stringify = require('bcp-47').stringify;
export { bcp47_parse as parse, bcp47_stringify as stringify };
