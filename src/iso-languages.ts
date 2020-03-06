export interface ISOLocale {
    name: string;
    language: string;
    language_local: string;
    location: string;
    tag: string;
    lcid: number;
    iso639_1: string;
    iso639_2: string;
}

export const SUBLANG_NEUTRAL = 0x00;
export const SUBLANG_DEFAULT = 0x01;
export const SORT_DEFAULT = 0x00;

export function MAKELANGID(primary: number, sub: number): number {
    return ((sub << 10) + PRIMARYLANGID(primary));
}

export function PRIMARYLANGID(langid: number): number {
    return (langid & 0x3FF);
}

export function SUBLANGID(langid: number): number {
    return (langid >> 10);
}

export function MAKELCID(langid: number, sortid: number): number {
    return ((sortid << 16) + langid);
}

export function LANGIDFROMLCID(lcid: number): number {
    return (lcid & 0x00FF);
}