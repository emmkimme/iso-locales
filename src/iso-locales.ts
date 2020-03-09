import { ISO639Data } from './iso-639/iso-639';
import { ISO3166Data } from './iso-3166/iso-3166';
import { ISO15924Data } from './iso-15924/iso-15924';
import { BCP47Data } from './bcp-47/bcp-47';
import { LCIDParts } from './lcid';

export interface ISOLocale {
    name: string;

    lcid: number;
    lcid_parts: LCIDParts;

    tag: string;               // RFC 4646 =  lowercase(ISO639 shortest code)[-uppercase(ISO3166.1-alpha2)]
    tag_bcp47?: BCP47Data;

    language: string;
    language_iso639?: ISO639Data;

    region?: string;           // ISO3166.1 alpha-2
    region_iso3166?: ISO3166Data;

    script?: string;
    script_iso15924?: ISO15924Data;
}
