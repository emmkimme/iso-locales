const convert = require('convert-units');

import * as df_si from '../../lib';

export function prerequisites() {
    const promises: Promise<void>[] = [];

    console.log(`================================`);
    console.log(`PREREQUISITES`);

    promises.push(
        df_si.osInfoEx()
        .then((osInfoData) => {
            console.log(`Operating System: ${osInfoData.distro}`);
            const servicePack = osInfoData.servicepack;
            if (servicePack && (servicePack !== '0') && (servicePack !== '0.0')) {
                console.log(`Service Pack: ${osInfoData.servicepack}`);
            }
            console.log(`Operating System Language: ${osInfoData.language.language}, ${osInfoData.language.location} (${osInfoData.language.tag})`);
        })
    );

    promises.push(
        df_si.cpu()
        .then((cpuData) => {
            let cpuDesc: string;
            if (cpuData.cores > 1) {
                cpuDesc = `${cpuData.manufacturer} ${cpuData.brand} (x${cpuData.cores})`;
            }
            else {
                cpuDesc = `${cpuData.manufacturer} ${cpuData.brand}`;
            }
            // console.log(`CPU Type: ${cpuDesc}`);
            console.log(`CPU Type: ${cpuData.manufacturer} Family ${cpuData.family} Model ${cpuData.model} Stepping ${cpuData.stepping}`);
            console.log(`CPU Description: ${cpuDesc}`);
            console.log(`CPU Vendor: ${cpuData.vendor}`);
            console.log(`CPU Speed: ${cpuData.speed} GHz`);
        })
    );

    promises.push(
        df_si.memEx()
        .then((memExData) => {
            const installedMem = convert(Number(memExData.installed)).from('B').to('GB').toFixed(1);
            const totalMem = convert(Number(memExData.total)).from('B').to('GB').toFixed(1);
            let memDesc = `${installedMem} GB`;
            if (installedMem !== totalMem) {
                memDesc += ` (${totalMem} GB usable)`;
            }
            console.log(`Installed Memory: ${memDesc}`);
        })
    );

    promises.push(
        df_si.graphicsEx()
        // df_si.electron_graphicsEx()
        .then((graphicExData) => {
            console.log(`Screen Resolution: ${graphicExData.resolutionx - graphicExData.positionx} x ${graphicExData.resolutiony - graphicExData.positiony}`);
            console.log(`Color Depth: ${graphicExData.pixelDepthMin} bits`);
        })
    );

    return Promise.all(promises)
    .then(() => {});
}
