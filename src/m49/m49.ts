export enum UNM49Type {
    Global = 0,         // example: 001 World
    Region = 1,         // example: 002 Africa
    Subregion = 2,      // example: 202 Sub-Saharan Africa)
    Intermediate = 3,   // region (example: 017 Middle Africa)
    Country = 4,        // or area (example: 024 Angola)
}

export interface UNM49Data {
    type: UNM49Type;    // Type
    code: string;       // num3 ISO 15924 code
    parent?: string;    // Property Value Alias
}
