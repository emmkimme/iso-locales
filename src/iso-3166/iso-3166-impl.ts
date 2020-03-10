import * as m49 from '../m49/m49-impl';
import { isNumeric, padLeft } from '../numeric';

import { ISO3166Data } from './iso-3166';

interface ISO3166DepData {
    country_name_en: string;
    country_name_fr: string;
    alpha2: string;
    alpha3: string;
    number: string;
}

const trace = false;

let all: ISO3166Data[];
let all_index: any;

const fields = ['1-alpha2', '1-alpha3', '1-num3'];

function build() {
    if (all == null) {
        trace && console.time('ISO3166 db');
        all_index = {};
        const dep: ISO3166DepData[] = require('countries-code').allCountriesList();
        all = dep.map((depData) => {
            const isoData: ISO3166Data = {
                name_en: depData.country_name_en,
                '1-alpha2': depData.alpha2,
                '1-alpha3': depData.alpha3,
                '1-num3': depData['number']
            };
            const m49data = m49.find(isoData['1-num3']);
            if (m49data) {
                isoData['1-num3-m49'] = m49data;
            }
            for (let i = 0; i < fields.length; ++i) {
                const field = (isoData as any)[fields[i]];
                if (field) {
                    const value = field.toLowerCase();
                    if (value) {
                        if (trace) {
                            const previous_entry = all_index[value];
                            if (previous_entry && (isoData !== previous_entry)) {
                                trace && console.error(`ISO3166 ${isoData} conflicts with ${previous_entry}`);
                            }
                        }
                        all_index[value] = isoData;
                    }
                }
            }
            return isoData;
        });
        trace && console.timeEnd('ISO3166 db');
    }
}

export function getList(): ISO3166Data[] {
    build();
    return all;
}

export function find(data: string): ISO3166Data | null {
    build();
    let dataC: string;
    if (isNumeric(data)) {
        dataC = padLeft('000', data);
    }
    else {
        dataC = data.toLowerCase();
    }
    const isoData = all_index[dataC];
    return isoData;
}
