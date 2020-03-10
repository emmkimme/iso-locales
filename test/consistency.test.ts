
import { expect } from 'chai';

import * as iso_locales from '../lib';

describe('check consistency', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('check tag', () => {
        const all_locales = iso_locales.getLocales();
        for (let i = 0, l = all_locales.length; i < l; ++i) {
            const locale = all_locales[i];
            // console.log(locale);
            const bcp47 = iso_locales.bcp47.parse(locale.tag, { forgiving: true });
            expect(locale.tag_bcp47.language).to.equal(bcp47.language);
            expect(locale.tag_bcp47.script).to.equal(bcp47.script);
            expect(locale.tag_bcp47.region).to.equal(bcp47.region);
            if (locale.language_iso639) {
                expect(bcp47.language).to.equal(locale.language_iso639['1-alpha2']);
            }
            if (bcp47.script) {
                if (locale.script_iso15924) {
                    expect(bcp47.script).to.equal(locale.script_iso15924.code);
                }
            }
            if (bcp47.region) {
                if (locale.region_iso3166) {
                    expect(bcp47.region).to.equal(locale.region_iso3166['1-alpha2']);
                }
            }
        }
    });

    it ('check lcid', () => {
        const all_locales = iso_locales.getLocales();
        for (let i = 0, l = all_locales.length; i < l; ++i) {
            const locale = all_locales[i];
            // console.log(locale);
            const lcidParts = iso_locales.lcid.parse(locale.lcid);
            expect(locale.lcid_parts.primary).to.equal(lcidParts.primary);
            expect(locale.lcid_parts.sub).to.equal(lcidParts.sub);
            expect(locale.lcid_parts.sort).to.equal(lcidParts.sort);

            expect(locale.lcid_parts.language).to.equal(iso_locales.lcid.LANGIDFROMLCID(locale.lcid));
            expect(locale.lcid_parts.primary).to.equal(iso_locales.lcid.PRIMARYLANGID(locale.lcid));
            expect(locale.lcid_parts.sub).to.equal(iso_locales.lcid.SUBLANGID(locale.lcid));
            expect(locale.lcid_parts.sort).to.equal(iso_locales.lcid.SORTIDFROMLCID(locale.lcid));

            const lcid = iso_locales.lcid.format(lcidParts);
            expect(lcid).to.equal(locale.lcid);
        }
    });
});

