import { ISOLocale } from './iso-locales';
import { getLocales } from './iso-locales-db';

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

export function findByLanguage(text: string): ISOLocale | null {
    return find('language', text);
}

export function findByLanguageLocal(text: string): ISOLocale | null {
    return find('language_local', text);
}

export function findByRegion(text: string): ISOLocale | null {
    return find('region', text);
}

export function findByTag(text: string): ISOLocale | null {
    return find('tag', text);
}

export function findByLCID(id: number): ISOLocale | null {
    return find('lcid', id);
}

// export function getByISO639_alpha2(text: string): ISOLocale | null {
//     return find('iso639_alpha2', text);
// }

// export function getByISO639_alpha3(text: string): ISOLocale | null {
//     return find('iso639_alpha3', text);
// }

// export function getByISO3166_alpha2(text: string): ISOLocale | null {
//     return find('iso3166_alpha2', text);
// }

// export function getByISO3166_alpha3(text: string): ISOLocale | null {
//     return find('iso3166_alpha3', text);
// }

// export function getByISO3166_numeric(id: number): ISOLocale | null {
//     return find('iso3166_numeric', id);
// }

