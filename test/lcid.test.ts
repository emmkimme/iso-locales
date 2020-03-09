
import { expect } from 'chai';

import * as iso_locales from '../lib';

describe('lcid', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('fallback to a correct tag', () => {
        const sillytag = 'en-FR';  // seen on a MAC !!
        let locale = iso_locales.findByTag(sillytag);
        if (locale == null) {
            const tag_bcp47 = iso_locales.bcp47.parse(sillytag, { forgiving: true });
            locale = iso_locales.findByTag(tag_bcp47.language);
            if (locale == null) {
                locale = iso_locales.findByTag('en-US');
            }
            else {
                const langid = iso_locales.lcid.LANGIDFROMLCID(locale.lcid);
                const primarylangid = iso_locales.lcid.PRIMARYLANGID(langid);
                const defaultlandid = iso_locales.lcid.MAKELANGID(primarylangid, iso_locales.lcid.SUBLANG_DEFAULT);
                const defaultlcid = iso_locales.lcid.MAKELCID(defaultlandid, iso_locales.lcid.SORT_DEFAULT);
                locale = iso_locales.findByLCID(defaultlcid);
            }
        }
        expect(locale.tag === 'en-GB');
    });

    it ('parse lcid', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        expect(lcidParts.language === iso_locales.lcid.LANGIDFROMLCID(locale.lcid));
        expect(lcidParts.primary === iso_locales.lcid.PRIMARYLANGID(locale.lcid));
        expect(lcidParts.sub === iso_locales.lcid.SUBLANGID(locale.lcid));
        expect(lcidParts.sort === iso_locales.lcid.SORTIDFROMLCID(locale.lcid));
    });

    it ('format lcid', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        const lcid = iso_locales.lcid.format(lcidParts.primary, lcidParts.sub, lcidParts.sort);
        expect(lcid === locale.lcid);
    });
});

