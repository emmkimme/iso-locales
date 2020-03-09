// https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f?redirectedfrom=MSDN
// https://docs.microsoft.com/en-us/windows/win32/intl/language-identifier-constants-and-strings
// This name is based on RFC 4646.
// It is a combination of
// an ISO 639 two-letter lowercase culture code associated with a language and
// an ISO 3166 two-letter uppercase subculture code associated with a country or region.
const windows_locales = require('windows-locale');

// https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
import * as iso639 from './iso-639';
import * as iso3166 from './iso-3166';
import * as iso15924 from './iso-15924';
import * as bcp47 from './bcp-47';
import * as lcid from './lcid';

import { ISOLocale } from './iso-locales';
import { BCP47Data } from 'bcp-47/bcp-47';

// import * as rfc4646_tag from './tag';

interface WindowLocale {
    language: string;
    location: string;
    id: number;
    tag: string;
    version: string;
}

const trace = true;

const all: ISOLocale[] = [];

export function getLocales(): ISOLocale[] {
    if (all.length === 0) {
        const windows_locale_keys = Object.keys(windows_locales);
        for (let i = 0, l = windows_locale_keys.length; i < l; ++i) {
            const windows_locale: WindowLocale = windows_locales[windows_locale_keys[i]];
            const locale: ISOLocale = {
                name: windows_locale.language,
                language: windows_locale.language,
                // language_local: windows_locale.language,
                region: windows_locale.location,
                tag: windows_locale.tag,
                lcid: windows_locale.id,
                lcid_parts: lcid.parse(windows_locale.id)
            };
            const bcp47Data = bcp47.parse(locale.tag, { forgiving: true }) as BCP47Data;

            // Complete with ISO639 info
            const iso639data = iso639.find(bcp47Data.language);
            if (iso639data) {
                // locale.language_local = iso639data.name_local;
                locale.language_iso639 = iso639data;
            }
            else {
                trace && console.error(`${locale.tag} (${bcp47Data.language}) - no ISO639 entry !!`);
            }
            // Complete with ISO15934 info
            if (bcp47Data.script) {
                const iso15924data = iso15924.find(bcp47Data.script);
                if (iso15924data) {
                    locale.script_iso15924 = iso15924data;
                    // if (trace && (locale.location !== iso3166_locale.country_name_en)) {
                    //     console.error(`${locale.tag} - ${locale.location} !== ${iso3166_locale.country_name_en}`);
                    // }
                }
                else {
                    trace && console.error(`${locale.tag} (${bcp47Data.script}) - no ISO15924 entry !!`);
                }
            }
            // Complete with ISO3166 info
            if (bcp47Data.region) {
                const iso3166data = iso3166.find(bcp47Data.region);
                if (iso3166data) {
                    locale.region_iso3166 = iso3166data;
                    // if (trace && (locale.location !== iso3166_locale.country_name_en)) {
                    //     console.error(`${locale.tag} - ${locale.location} !== ${iso3166_locale.country_name_en}`);
                    // }
                }
                else {
                    trace && console.error(`${locale.tag} (${bcp47Data.region}) - no ISO3166 entry !!`);
                }
            }
            all.push(locale);
        }
    }
    return all;
}
