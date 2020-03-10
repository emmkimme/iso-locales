import { ISOLocale } from './iso-locales';
import { getLocales } from './iso-locales-db';

export function filter(callbackfn: (value: ISOLocale, index: number, array: ISOLocale[]) => unknown, thisArg?: any): ISOLocale[] {
    const all = getLocales();
    return all.filter(callbackfn, thisArg);
}

export function findByLanguage(text: string): ISOLocale[] {
    return filter(isoLocale => isoLocale.language === text);
}

export function findByLanguageLocal(text: string): ISOLocale[] {
    return filter(isoLocale => isoLocale.language_local === text);
}

export function findByRegion(text: string): ISOLocale[] {
    return filter(isoLocale => isoLocale.region === text);
}

export function findByScript(text: string): ISOLocale[] {
    return filter(isoLocale => isoLocale.script === text);
}

export function findByTag(text: string): ISOLocale[] {
    return filter(isoLocale => isoLocale.tag === text);
}

export function findByLCID(lcid: number): ISOLocale[] {
    return filter(isoLocale => isoLocale.lcid === lcid);
}
