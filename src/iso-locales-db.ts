// https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f?redirectedfrom=MSDN
// https://docs.microsoft.com/en-us/windows/win32/intl/language-identifier-constants-and-strings
// This name is based on RFC 4646.
// It is a combination of
// an ISO 639 two-letter lowercase culture code associated with a language and
// an ISO 3166 two-letter uppercase subculture code associated with a country or region.
const windows_locales = require('windows-locale');

// https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
const iso639_locales: ISO639bisLocale[] = require('langs').all();

const iso3166 = require('countries-code');

import { ISOLocale } from './iso-locales';

import * as rfc4646_tag from './tag';

interface WindowLocale {
    language: string;
    location: string;
    id: number;
    tag: string;
    version: string;
}

interface ISO639bisLocale {
    name: string;
    local: string;
    '1': string;
    '2': string;
    '2T': string;
    '2B': string;
    '3': string;
}

// interface ISO639Locale {
//     name: string;
//     names: string[];
//     'iso639-1': string;
//     'iso639-2': string;
// }

interface ISO3166Locale {
    country_name_en: string;
    country_name_fr: string;
    alpha2: string;
    alpha3: string;
    number: string;
}

const trace = true;

const all: ISOLocale[] = [];

export function getLocales(): ISOLocale[] {
    if (all.length === 0) {
        const windows_locale_keys = Object.keys(windows_locales);
        const iso3166_locales: ISO3166Locale[] = iso3166.allCountriesList();

        for (let i = 0, l = windows_locale_keys.length; i < l; ++i) {
            const windows_locale: WindowLocale = windows_locales[windows_locale_keys[i]];
            const locale: ISOLocale = {
                name: windows_locale.language,
                language: windows_locale.language,
                language_local: windows_locale.language,
                region: windows_locale.location,
                tag: windows_locale.tag,
                lcid: windows_locale.id
            };
            const tagParts = rfc4646_tag.parse(locale.tag);

            // Complete with ISO639 info
            const iso639_locale: ISO639bisLocale = iso639_locales.find((iso639_entry: any) => {
                // From the shorter to longer
                return (iso639_entry['1'] && (iso639_entry['1'].toLowerCase() === tagParts.language))
                      || (iso639_entry['2'] && (iso639_entry['2'].toLowerCase() === tagParts.language))
                      || (iso639_entry['2T'] && (iso639_entry['2T'].toLowerCase() === tagParts.language));
            });
            if (iso639_locale) {
                locale.language_local = iso639_locale.local;
                locale.iso639 = {
                    '1-alpha2': iso639_locale['1'],
                    '2-alpha3': iso639_locale['2'],
                    '2T-alpha3': iso639_locale['2T'],
                    '2B-alpha3': iso639_locale['2B']
                };
                locale.language_local = iso639_locale.local;
            }
            else {
                trace && console.error(`${locale.tag} (${locale.language}) - no ISO639 entry !!`);
            }
            // Complete with ISO3166 info
            if (tagParts.region) {
                const iso3166_locale = iso3166_locales.find(iso3166_entry => iso3166_entry.alpha2.toLowerCase() === tagParts.region.toLowerCase());
                if (iso3166_locale) {
                    locale.iso3166 = {
                        '1-alpha2': iso3166_locale.alpha2,
                        '1-alpha3': iso3166_locale.alpha3,
                        '1-num3': Number(iso3166_locale.number)
                    };
                    // if (trace && (locale.location !== iso3166_locale.country_name_en)) {
                    //     console.error(`${locale.tag} - ${locale.location} !== ${iso3166_locale.country_name_en}`);
                    // }
                }
                else {
                    trace && console.error(`${locale.tag} (${locale.language}) - no ISO3166 entry !!`);
                }
            }
            all.push(locale);
        }
    }
    return all;
}
