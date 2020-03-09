export interface ISO639Data {
    name: string;
    name_local: string;
    '1-alpha2': string;    // ISO639.1 alpha-2
    '2-alpha3': string;    // ISO639.2 alpha-3
    '2T-alpha3'?: string;   // ISO639.2 alpha-3 Terminology
    '2B-alpha3'?: string;   // ISO639.2 alpha-3 Bibliographic
    '3-alpha3': string;    // ISO639.3 alpha-3 (OBSOLETE)
}
