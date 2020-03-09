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

export function format(arg1: number | LCIDParts, arg2?: number, arg3?: number): number {
    if (typeof arg1 === 'object') {
        const lcidParts = arg1 as LCIDParts;
        return MAKELCID(lcidParts.language, lcidParts.sort);
    }
    if ((arguments.length === 2) && (typeof arg1 === 'number') && (typeof arg2 === 'number')) {
        const language = arg1 as number;
        const sort = arg2 as number;
        return MAKELCID(language, sort);
    }
    if ((arguments.length === 3) && (typeof arg1 === 'number') && (typeof arg2 === 'number') && (typeof arg3 === 'number')) {
        const primary = arg1 as number;
        const sub = arg2 as number;
        const sort = arg3 as number;
        return MAKELCID(MAKELANGID(primary, sub), sort);
    }
    return -1;
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