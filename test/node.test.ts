
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
            const tagParts = iso_locales.tag.parse(locale.tag);
            if (locale.iso639) {
                expect(tagParts.language).to.equal(locale.iso639['1-alpha2']);
            }
            if (locale.iso3166 && tagParts.region) {
                expect(tagParts.region).to.equal(locale.iso3166['1-alpha2']);
            }
        }
    });
});

