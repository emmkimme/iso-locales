import { ISOLocale } from './iso-locales';
import { getLocales } from './iso-locales-db';

export function find(predicate: (value: ISOLocale, index: number, obj: ISOLocale[]) => unknown, thisArg?: any): ISOLocale | undefined {
    const all = getLocales();
    return all.find(predicate, thisArg);
}

export function findByLanguage(text: string): ISOLocale | undefined {
    return find(isoLocale => isoLocale.language === text);
}

export function findByLanguageLocal(text: string): ISOLocale | undefined {
    return find(isoLocale => isoLocale.language_local === text);
}

export function findByRegion(text: string): ISOLocale | undefined {
    return find(isoLocale => isoLocale.region === text);
}

export function findByScript(text: string): ISOLocale | undefined {
    return find(isoLocale => isoLocale.script === text);
}

export function findByTag(text: string, ignorecase?: boolean): ISOLocale | undefined {
    if (ignorecase === false) {
        return find(isoLocale => isoLocale.tag === text);
    }
    else {
        text = text.toLowerCase();
        return find(isoLocale => isoLocale.tag.toLowerCase() === text);
    }
}

export function findByLCID(lcid: number): ISOLocale | undefined {
    return find(isoLocale => isoLocale.lcid === lcid);
}
