# iso-languages
Helpers for manipuling ISO locales
- RFC4646
- ISO639.1
- ISO639.2
- ISO3166.1

# Installation
```Batchfile
npm install iso-locales
```

# Dependencies
* https://github.com/nirvana-flame/countries-code
* https://github.com/adlawson/langs.js
* https://github.com/TiagoDanin/Windows-Locale
* http://nodejs.org/

# ISO Locale
This library manages a collection of ISOLocale/s built from 3 differents sources (see dependencies)
```ts
export interface ISOLocale {
    name: string;
    language: string;
    language_local: string;
    region?: string;
    tag: string;               // RFC 4646 =  lowercase(ISO639 shortest code)[-uppercase(ISO3166.1-alpha2)]
    lcid: number;
    iso639?: {
        '1-alpha2': string,    // ISO639.1 alpha-2
        '2-alpha3': string,    // ISO639.2 alpha-3
        '2T-alpha3': string,   // ISO639.2 alpha-3 Terminology
        '2B-alpha3': string,   // ISO639.2 alpha-3 Bibliographic
    };
    iso3166?: {
        '1-alpha2': string;    // ISO3166.1 alpha-2
        '1-alpha3': string;    // ISO3166.1 alpha-3
        '1-num3': number;      // ISO3166.1 numeric-3 M49
    };
}

// return all locales
function getLocales(): ISOLocale[];
```

You can look at a locale using any kind of these fields as parameter.

```ts
function findByName(text: string): ISOLocale | null;
function findByNameLocal(text: string): ISOLocale | null;
function findByRegion(text: string): ISOLocale | null;
function findByTag(text: string): ISOLocale | null;
function findByLCID(id: number): ISOLocale | null;
...
```

# Tag (RFC4646)

```
<ISO-639>[-<ISO-15924>][-<ISO-3166>]
```

```ts
export interface TagParts {
    language: string;   // [ISO-639] language code
    script?: string;    // [ISO-15924] script tag
    region?: string;    // [ISO-3166] country/region
}

function parse(tag: string): TagParts;
``` 

# LCID (RFC5646)

A language ID is a 16 bit value which is the combination of a
primary language ID and a secondary language ID.
The bits are allocated as follows:
```
      +-----------------------+-------------------------+
      |     Sublanguage ID    |   Primary Language ID   |
      +-----------------------+-------------------------+
       15                   10 9                       0   bit
```

A locale ID (LCID) is a 32 bit value which is the combination of a
language ID, a sort ID, and a reserved area.
The bits are allocated as follows:
```
      +-------------+---------+-------------------------+
      |   Reserved  | Sort ID |      Language ID        |
      +-------------+---------+-------------------------+
       31         20 19     16 15                      0   bit
```

```ts
export interface LCIDParts {
    language: number;
    primary: number;
    sub: number;
    sort: number;
}

function parse(lcid: number): LCIDParts;
```




# MIT License

Copyright (c) 2020 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.