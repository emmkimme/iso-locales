import { ISO639Data } from './iso-639/iso-639';
import { ISO3166Data } from './iso-3166/iso-3166';
import { ISO15924Data } from './iso-15924/iso-15924';
import { BCP47Data } from './bcp-47/bcp-47';
import { LCIDParts } from './lcid/lcid';

export interface ISOLocale {
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
