import { LCIDParts, FormatFunction } from './lcid';

export function parse(lcid: number): LCIDParts {
    const lcidParts: LCIDParts = {
        language: LANGIDFROMLCID(lcid),
        primary: PRIMARYLANGID(lcid),
        sub: SUBLANGID(lcid),
        sort: SORTIDFROMLCID(lcid)
    };
    return lcidParts;
}

export const format: FormatFunction = (arg1: number | LCIDParts, arg2?: number, arg3?: number): number => {
    if (typeof arg1 === 'object') {
        const lcidParts = arg1 as LCIDParts;
        return MAKELCID(lcidParts.language, lcidParts.sort);
    }
    if ((typeof arg1 === 'number') && (typeof arg2 === 'number')) {
        if (typeof arg3 === 'number') {
            const primary = arg1;
            const sub = arg2;
            const sort = arg3;
            return MAKELCID(MAKELANGID(primary, sub), sort);
        }
        else {
            const language = arg1;
            const sort = arg2;
            return MAKELCID(language, sort);
        }
    }
    return -1;
};

export function MAKELANGID(primary: number, sub: number): number {
    return ((sub << 10) + PRIMARYLANGID(primary));
}

export function PRIMARYLANGID(langid: number): number {
    return (langid & 0b00001111111111);
}

export function SUBLANGID(langid: number): number {
    return (langid & 0b11110000000000) >> 10;
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