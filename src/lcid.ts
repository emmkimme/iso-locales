// https://docs.microsoft.com/en-us/windows/win32/intl/language-identifiers
// https://docs.microsoft.com/en-us/windows/win32/intl/locale-identifiers

//  A language ID is a 16 bit value which is the combination of a
//  primary language ID and a secondary language ID.
// The bits are allocated as follows:

//       +-----------------------+-------------------------+
//       |     Sublanguage ID    |   Primary Language ID   |
//       +-----------------------+-------------------------+
//        15                   10 9                       0   bit

//  A locale ID (LCID) is a 32 bit value which is the combination of a
//  language ID, a sort ID, and a reserved area.
// The bits are allocated as follows:

//       +-------------+---------+-------------------------+
//       |   Reserved  | Sort ID |      Language ID        |
//       +-------------+---------+-------------------------+
//        31         20 19     16 15                      0   bit

export interface LCIDParts {
    language: number;
    primary: number;
    sub: number;
    sort: number;
}

export function parse(lcid: number): LCIDParts {
    const lcidParts: LCIDParts = {
        language: LANGIDFROMLCID(lcid),
        primary: PRIMARYLANGID(lcid),
        sub: SUBLANGID(lcid),
        sort: SORTIDFROMLCID(lcid)
    };
    return lcidParts;
}

export const SUBLANG_NEUTRAL = 0x00;
export const SUBLANG_DEFAULT = 0x01;
export const SORT_DEFAULT = 0x00;

export function MAKELANGID(primary: number, sub: number): number {
    return ((sub << 10) + PRIMARYLANGID(primary));
}

export function PRIMARYLANGID(langid: number): number {
    return (langid & 0b0000001111111111);
}

export function SUBLANGID(langid: number): number {
    return ((langid & ~0b0000001111111111) >> 10);
}

export function MAKELCID(langid: number, sortid: number): number {
    return (((sortid & 0x0F) << 16) + (langid & 0xFF));
}

export function LANGIDFROMLCID(lcid: number): number {
    return (lcid & 0x00FF);
}

export function SORTIDFROMLCID(lcid: number): number {
    return ((lcid >> 16) & 0x0F);
}