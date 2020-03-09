// https://tools.ietf.org/html/rfc4646
// https://tools.ietf.org/html/bcp47

// The syntax of the language tag in ABNF [RFC4234] is:

//    Language-Tag  = langtag
//                  / privateuse             ; private use tag
//                  / grandfathered          ; grandfathered registrations

//    langtag       = (language
//                     ["-" script]
//                     ["-" region]
//                     *("-" variant)
//                     *("-" extension)
//                     ["-" privateuse])

//    language      = (2*3ALPHA [ extlang ]) ; shortest ISO 639 code
//                  / 4ALPHA                 ; reserved for future use
//                  / 5*8ALPHA               ; registered language subtag

//    extlang       = *3("-" 3ALPHA)         ; reserved for future use

//    script        = 4ALPHA                 ; ISO 15924 code

//    region        = 2ALPHA                 ; ISO 3166 code
//                  / 3DIGIT                 ; UN M.49 code

//    variant       = 5*8alphanum            ; registered variants
//                  / (DIGIT 3alphanum)

//    extension     = singleton 1*("-" (2*8alphanum))

//    singleton     = %x41-57 / %x59-5A / %x61-77 / %x79-7A / DIGIT
//                  ; "a"-"w" / "y"-"z" / "A"-"W" / "Y"-"Z" / "0"-"9"
//                  ; Single letters: x/X is reserved for private use

//    privateuse    = ("x"/"X") 1*("-" (1*8alphanum))

//    grandfathered = 1*3ALPHA 1*2("-" (2*8alphanum))
//                    ; grandfathered registration
//                    ; Note: i is the only singleton
//                    ; that starts a grandfathered tag

//    alphanum      = (ALPHA / DIGIT)       ; letters and numbers
export interface BCP47Data {
    language: string;
    extendedLanguageSubtags?: string[];
    script?: string;
    region?: string;
    variants?: string[];
    extensions?: object[];
    privateuse?: string[];
    irregular?: string;
    regular?: string;
}
