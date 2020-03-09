import { ISO15924Data } from './iso-15924';

const trace = true;

let all: ISO15924Data[];
let all_index: any;

const fields = ['code'];

function build() {
    if (all == null) {
        trace && console.time('ISO15924 db');
        all_index = {};
        all = require('iso-15924');
        for (let i = 0, l = all.length; i < l ; ++i) {
            const isoData = all[i];
        // all = dep.map((depData) => {
            // const isoData: ISO15924Data = {
            //     name: depData.name,
            //     alias: depData.pva,
            //     'alpha4': depData.code,
            //     'num3': Number(depData.numeric)
            // };
            for (let i = 0; i < fields.length; ++i) {
                const field = (isoData as any)[fields[i]];
                if (field) {
                    const value = field.toLowerCase();
                    if (trace) {
                        const previous_entry = all_index[value];
                        if (previous_entry && (isoData !== previous_entry)) {
                            console.error(`ISO15924 ${isoData} conflicts with ${previous_entry}`);
                        }
                    }
                    all_index[value] = isoData;
                }
            }
            // return isoData;
        // });
        }
        trace && console.timeEnd('ISO15924 db');
    }
}

export function getList(): ISO15924Data[] {
    build();
    return all;
}

export function find(data: string): ISO15924Data | null {
    build();
    const dataLC = data.toLowerCase();
    const isoData = all_index[dataLC];
    return isoData;
}
