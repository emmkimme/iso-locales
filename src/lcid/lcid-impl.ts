import { LCIDParts } from './lcid';

export function parse(lcid: number): LCIDParts {
    const lcidParts: LCIDParts = {
        language: LANGIDFROMLCID(lcid),
        primary: PRIMARYLANGID(lcid),
        sub: SUBLANGID(lcid),
        sort: SORTIDFROMLCID(lcid)
    };
    return lcidParts;
}

export function MAKELANGID(primary: number, sub: number): number {
    return ((sub << 10) + PRIMARYLANGID(primary));
}

export function PRIMARYLANGID(langid: number): number {
    return (langid & 0b1111111111);
}

export function SUBLANGID(langid: number): number {
    return ((langid & ~0b1111111111) >> 10);
}

export function MAKELCID(langid: number, sortid: number): number {
    return (((sortid & 0x0F) << 16) + (langid & 0xFFFF));
}

export function LANGIDFROMLCID(lcid: number): number {
    return (lcid & 0xFFFF);
}

export function SORTIDFROMLCID(lcid: number): number {
    return ((lcid >> 16) & 0x0F);
}