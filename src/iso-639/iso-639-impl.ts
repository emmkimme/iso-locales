import { ISO639Data } from './iso-639';

interface ISO639DepData {
    name: string;
    local: string;
    '1': string;
    '2': string;
    '2T': string;
    '2B': string;
    '3': string;
}

const trace = false;

let all: ISO639Data[];
let all_index: any;

const fields = ['1-alpha2', '2-alpha3', '2T-alpha3', '2B-alpha3', '3-alpha3'];

function build() {
    if (all == null) {
        trace && console.time('ISO639 db');
        all_index = {};
        const dep: ISO639DepData[] = require('langs').all();
        all = dep.map((depData) => {
            const isoData: ISO639Data = {
                name: depData.name,
                name_local: depData.local,
                '1-alpha2': depData['1'],
                '2-alpha3': depData['2'],
                '2T-alpha3': (depData['2T'] !== depData['2']) ? depData['2T'] : undefined,
                '2B-alpha3': (depData['2B'] !== depData['2']) ? depData['2B'] : undefined,
                '3-alpha3': depData['3']
            };

            for (let i = 0; i < fields.length; ++i) {
                const field = (isoData as any)[fields[i]];
                if (field) {
                    const value = field.toLowerCase();
                    if (value) {
                        if (trace) {
                            const previous_entry = all_index[value];
                            if (previous_entry && (isoData !== previous_entry)) {
                                trace && console.error(`ISO639 ${isoData} conflicts with ${previous_entry}`);
                            }
                        }
                        all_index[value] = isoData;
                    }
                }
            }
            return isoData;
        });
        trace && console.timeEnd('ISO639 db');
    }
}

export function getList(): ISO639Data[] {
    build();
    return all;
}

export function find(data: string): ISO639Data | null {
    build();
    const dataLC = data.toLowerCase();
    const isoData = all_index[dataLC];
    return isoData;
}
