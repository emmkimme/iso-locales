// https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f?redirectedfrom=MSDN
// https://docs.microsoft.com/en-us/windows/win32/intl/language-identifier-constants-and-strings
// This name is based on RFC 4646.
// It is a combination of
// an ISO 639 two-letter lowercase culture code associated with a language and
// an ISO 3166 two-letter uppercase subculture code associated with a country or region.
const windows_locales = require('windows-locale');

// https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
const iso639_locales = require('iso639-codes');
const iso639bis_locales = require('langs').all();

import { ISOLocale } from './iso-languages';

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

interface ISO639Locale {
    name: string;
    names: string[];
    'iso639-1': string;
    'iso639-2': string;
}

const all: ISOLocale[] = [];

export function getLocales(): ISOLocale[] {
    if (all.length === 0) {
        const windows_locale_keys = Object.keys(windows_locales);
        const iso639_locale_keys = Object.keys(iso639_locales);

        for (let i = 0, l = windows_locale_keys.length; i < l; ++i) {
            const windows_locale: WindowLocale = windows_locales[windows_locale_keys[i]];
            const locale: ISOLocale = {
                name: windows_locale.language,
                language: windows_locale.language,
                language_local: windows_locale.language,
                location: windows_locale.location,
                tag: windows_locale.tag,
                lcid: windows_locale.id,
                iso639_1: null,
                iso639_2: null,
            };

            // Complete with ISO639 info
            const iso639_key = iso639_locale_keys.find(name => name.toLowerCase() === windows_locale.language.toLowerCase());
            if (iso639_key) {
                const iso639_locale: ISO639Locale = iso639_locales[iso639_key];
                locale.iso639_1 = iso639_locale['iso639-1'];
                locale.iso639_2 = iso639_locale['iso639-2'];

                // Complete with local name of the locale
                const iso639bis_locale: ISO639bisLocale = iso639bis_locales.find((iso639bis_entry: any) => {
                    return iso639bis_entry['2T'] && (iso639bis_entry['2T'].toLowerCase() === locale.iso639_2);
                });
                if (iso639bis_locale) {
                    locale.language_local = iso639bis_locale.local;
                }
            }
            all.push(locale);
        }
    }
    return all;
}

function isString(test: any): test is string {
    return typeof test === 'string';
}

function isNumber(test: any): test is number {
    return typeof test === 'number';
}

function find<T>(key: keyof ISOLocale, data: T): ISOLocale | null {
    const all = getLocales();
    if (isString(data)) {
        return all.find(e => {
            const value = e[key];
            return (isString(value) && (value.toLowerCase() === data.toLowerCase()));
        });
    }
    else if (isNumber(data)) {
        return all.find(e => {
            const value = e[key];
            return (isNumber(value) && (value === data));
        });
    }
    return null;
}

export function findByName(text: string): ISOLocale | null {
    return find('name', text as keyof ISOLocale);
}

export function findByNameLocal(text: string): ISOLocale | null {
    return find('language', text);
}

export function findByLocation(text: string): ISOLocale | null {
    return find('location', text);
}

export function findByTag(text: string): ISOLocale | null {
    return find('tag', text);
}

export function findByLCID(id: number): ISOLocale | null {
    return find('lcid', id);
}

export function getByISO639_2(text: string): ISOLocale | null {
    return find('iso639_2', text);
}

export function getByISO639_1(text: string): ISOLocale | null {
    return find('iso639_1', text);
}

