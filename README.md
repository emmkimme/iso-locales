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
* https://github.com/wooorm/un-m49
* https://github.com/wooorm/iso-15924
* http://nodejs.org/

# bcp-47 / RFC4646
* Ref: https://tools.ietf.org/html/bcp47, https://tools.ietf.org/html/rfc4646
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
* Lists: https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1, https://www.loc.gov/standards/iso639-2/php/code_list.php

# ISO15924 (Script)
* Ref: https://en.wikipedia.org/wiki/ISO_15924
* Dependency: https://github.com/wooorm/iso-15924
* Lists: https://unicode.org/iso15924/iso15924-codes.html

# ISO3166 (Region/Country)
* Wikipedia: https://en.wikipedia.org/wiki/ISO_3166
* Dependency: https://github.com/nirvana-flame/countries-code
* Lists: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

# UN M49 (Region/Country)
* Ref: https://unstats.un.org/unsd/methodology/m49/, https://en.wikipedia.org/wiki/UN_M49
* Dependency: https://github.com/wooorm/un-m49


# ISO Locale
This library manages a collection of ISOLocale/s built from 3 differents sources (see dependencies)
```ts
export interface ISOLocale {
    name: string;
    tag: string;
    bcp47?: BCP47Data;
    lcid: number;
    language: string;
    iso639?: ISO639Data;
    region?: string; 
    iso3166?: ISO3166Data;
    script?: string;
    iso15924?: ISO15924Data;
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