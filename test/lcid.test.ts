
import { expect } from 'chai';

import * as iso_locales from '../lib';

describe('lcid', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('wrong case tag with ignorecase = default', () => {
        const wrongtag = 'en-us';
        const locale = iso_locales.findByTag(wrongtag);
        expect(locale.tag).to.equal('en-US');
    });

    it ('wrong case tag with ignorecase = true', () => {
        const wrongtag = 'en-us';
        const locale = iso_locales.findByTag(wrongtag, { ignorecase: true });
        expect(locale.tag).to.equal('en-US');
    });

    it ('wrong case tag with ignorecase = false', () => {
        const wrongtag = 'en-us';
        const locale = iso_locales.findByTag(wrongtag, { ignorecase: false });
        expect(locale).to.equal(undefined);
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
        expect(locale.tag).to.equal('en-US');
    });

    it ('parse lcid', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        expect(lcidParts.language).to.equal(iso_locales.lcid.LANGIDFROMLCID(locale.lcid));
        expect(lcidParts.primary).to.equal(iso_locales.lcid.PRIMARYLANGID(locale.lcid));
        expect(lcidParts.sub).to.equal(iso_locales.lcid.SUBLANGID(locale.lcid));
        expect(lcidParts.sort).to.equal(iso_locales.lcid.SORTIDFROMLCID(locale.lcid));
    });

    it ('format lcid - 3 args', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        const lcid = iso_locales.lcid.format(lcidParts.primary, lcidParts.sub, lcidParts.sort);
        expect(lcid).to.equal(locale.lcid);
    });

    it ('format lcid - 2 args', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        const lcid = iso_locales.lcid.format(lcidParts.language, lcidParts.sort);
        expect(lcid).to.equal(locale.lcid);
    });

    it ('format lcid - 1 arg', () => {
        let locale = iso_locales.findByTag('fr-FR');
        const lcidParts = iso_locales.lcid.parse(locale.lcid);
        const lcid = iso_locales.lcid.format(lcidParts);
        expect(lcid).to.equal(locale.lcid);
    });
});

