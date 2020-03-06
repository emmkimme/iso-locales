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
