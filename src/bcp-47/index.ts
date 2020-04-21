import * as bcp47 from './bcp-47';
export * from './bcp-47';

const bc47_module = require('bcp-47');
const bcp47_parse: bcp47.Parse = bc47_module.parse;
const bcp47_stringify: bcp47.Format = bc47_module.stringify;
export { bcp47_parse as parse, bcp47_stringify as stringify, bcp47_stringify as format };

const bc47_normalize_module = require('bcp-47-normalize');
const bcp47_normalize: bcp47.Normalize = bc47_normalize_module;
export { bcp47_normalize as normalize };
