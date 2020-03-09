
import { expect } from 'chai';

import * as iso_locales from '../lib';

describe('regressions node', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('check tag', () => {
        const all_locales = iso_locales.getLocales();
        for (let i = 0, l = all_locales.length; i < l; ++i) {
            const locale = all_locales[i];
            console.log(locale);
            const tagParts = iso_locales.bcp47.parse(locale.tag);
            if (locale.language_iso639) {
                expect(tagParts.language).to.equal(locale.language_iso639['1-alpha2']);
            }
            if (tagParts.script) {
                expect(locale.script_iso15924 != null);
                expect(tagParts.script).to.equal(locale.script_iso15924.code);
            }
            if (tagParts.region) {
                expect(locale.region_iso3166 != null);
                expect(tagParts.region).to.equal(locale.region_iso3166['1-alpha2']);
            }
        }
    });
});

