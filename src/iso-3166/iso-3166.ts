import { UNM49Data } from '../m49/m49';

export interface ISO3166Data {
    name_en: string;
    '1-alpha2': string;    // ISO3166.1 alpha-2
    '1-alpha3': string;    // ISO3166.1 alpha-3
    '1-num3': string;      // ISO3166.1 numeric-3 M49
    '1-num3-m49'?: UNM49Data;
}
