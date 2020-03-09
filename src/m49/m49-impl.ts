import { UNM49Data } from './m49';
export { UNM49Data };

const trace = true;

let all: UNM49Data[];
let all_index: any;

const fields = ['code'];

function build() {
    if (all == null) {
        all_index = {};
        all = require('un-m49');
        for (let i = 0, l = all.length; i < l ; ++i) {
            const isoData = all[i];
        // all = dep.map((depData) => {
            // const isoData: UNM49Data = {
            //     name: depData.name,
            //     alias: depData.pva,
            //     'alpha4': depData.code,
            //     'num3': Number(depData.numeric)
            // };
            for (let i = 0; i < fields.length; ++i) {
                const value = (isoData as any)[fields[i]];
                if (value) {
                    if (trace) {
                        const previous_entry = all_index[value];
                        if (previous_entry && (isoData !== previous_entry)) {
                            console.error(`M49 ${isoData} conflicts with ${previous_entry}`);
                        }
                    }
                    all_index[value] = isoData;
                }
            }
            // return isoData;
        // });
        }
    }

}

export function getCollection(): UNM49Data[] {
    build();
    return all;
}

export function find(data: string): UNM49Data | null {
    build();
    const dataLC = data.toLowerCase();
    const isoData = all_index[dataLC];
    return isoData;
}
