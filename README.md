# iso-languages
Helpers for manipuling RFC4646 locales.
Purpose is to have for each locale, the ISO639, ISO3166, ISO15924 and m49 references associated.

# Installation
```Batchfile
npm install iso-locales
```

# ISO Locale
This library manages a collection of ISOLocale/s, completed with differents sources (see dependencies below).
The main index is coming from:
https://github.com/TiagoDanin/Windows-Locale


```ts
interface ISOLocale {
    tag: string;
    tag_bcp47?: BCP47Data;

    lcid: number;
    lcid_parts: LCIDParts;

    language: string;           // UI Friendly name (EN)
    language_local?: string;    // UI Native name
    language_iso639?: ISO639Data;

    region?: string;            // UI Friendly name (EN)
    region_iso3166?: ISO3166Data;

    script?: string;
    script_iso15924?: ISO15924Data;
}

// return all locales
function getLocales(): ISOLocale[];
```

You can search for a locale:

```ts
function findByLanguage(text: string): ISOLocale[];
function findByLanguageLocal(text: string): ISOLocale[];
function findByRegion(text: string): ISOLocale[];
function findByTag(text: string): ISOLocale | null;
function findByLCID(id: number): ISOLocale | null;
...
```

# RFC4646
* Ref: https://tools.ietf.org/html/rfc4646


# LCID (RFC5646 / RFC4646)
* Ref: https://docs.microsoft.com/en-us/windows/win32/intl/locale-identifiers
* Ref: https://docs.microsoft.com/en-us/windows/win32/intl/language-identifier-constants-and-strings
* Dependency: https://github.com/TiagoDanin/Windows-Locale
* List o codes: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f?redirectedfrom=MSDN

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
interface LCIDParts {
    language: number;
    primary: number;
    sub: number;
    sort: number;
}

const SUBLANG_NEUTRAL = 0x00;
const SUBLANG_DEFAULT = 0x01;
const SORT_DEFAULT = 0x00;

function parse(lcid: number): LCIDParts;

function format(lcidParts: LCIDParts): number;
function format(language: number, sort: number): number;
function format(primary: number, sub: number, sort: number): number;
```

# BCP-47
* Ref: https://tools.ietf.org/html/bcp47
* Dependency: https://github.com/wooorm/bcp-47

```
 langtag       = language
                 ["-" script]
                 ["-" region]
                 *("-" variant)
                 *("-" extension)
                 ["-" privateuse]
```

# ISO639 (Language)
* Ref: https://en.wikipedia.org/wiki/ISO_639
* Dependency: https://github.com/adlawson/langs.js
* Lists of codes: https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1, https://www.loc.gov/standards/iso639-2/php/code_list.php

```ts
interface ISO639Data {
    name: string;
    name_local: string;
    '1-alpha2': string;    // ISO639.1 alpha-2
    '2-alpha3': string;    // ISO639.2 alpha-3
    '2T-alpha3'?: string;   // ISO639.2 alpha-3 Terminology
    '2B-alpha3'?: string;   // ISO639.2 alpha-3 Bibliographic
    '3-alpha3': string;    // ISO639.3 alpha-3 (OBSOLETE)
}

function getList(): ISO639Data[];
function find(text: string): ISO639Data | null;
```

# ISO15924 (Script)
* Ref: https://en.wikipedia.org/wiki/ISO_15924
* Dependency: https://github.com/wooorm/iso-15924
* Lists: https://unicode.org/iso15924/iso15924-codes.html

```ts
interface ISO15924Data {
    name: string;       // Script name
    code: string;       // alpha4 ISO 15924 code
    numeric: string;    // num3 ISO 15924 code
    pva: string;        // Property Value Alias
    date: string;       // Date of addition
}

function getList(): ISO15924Data[];
function find(text: string): ISO15924Data | null;

```

# ISO3166 (Region/Country)
* Wikipedia: https://en.wikipedia.org/wiki/ISO_3166
* Dependency: https://github.com/nirvana-flame/countries-code
* List of code: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

```ts
interface ISO3166Data {
    name_en: string;
    '1-alpha2': string;    // ISO3166.1 alpha-2
    '1-alpha3': string;    // ISO3166.1 alpha-3
    '1-num3': number;      // ISO3166.1 numeric-3 M49
    '1-num3-m49'?: UNM49Data;
}

function getList(): ISO3166Data[];
function find(text: string): ISO3166Data | null;

```

# UN M49 (Region/Country)
* Ref: https://unstats.un.org/unsd/methodology/m49/, https://en.wikipedia.org/wiki/UN_M49
* Dependency: https://github.com/wooorm/un-m49

```ts
enum UNM49Type {
    Global = 0,     // (example: 001 World)
    Region = 1,     //  (example: 002 Africa)
    Subregion = 2,  //  (example: 202 Sub-Saharan Africa)
    Intermediate = 3, //  region (example: 017 Middle Africa)
    Country = 4,    //  or area (example: 024 Angola)
}

interface UNM49Data {
    type: UNM49Type;    // Script name
    code: string;       // num3 ISO 15924 code
    parent?: string;    // Property Value Alias
}

function getList(): ISO3166Data[];
function find(text: string): ISO3166Data | null;
```

# MIT License

Copyright (c) 2020 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.