import * as df_si from '../../lib';

export function information() {
    const promises: Promise<void>[] = [];

    console.log(`================================`);
    console.log(`INFORMATION`);

    promises.push(
        df_si.osInfoEx()
        .then((osInfoData) => {
            console.log(`Computer Name: ${osInfoData.hostname}`);
        })
    );

    promises.push(
        Promise.resolve()
        .then(() => {
            const timeData = df_si.time();
        // .then((timeData) => {
            console.log(`User Time Zone: (${timeData.timezone}) ${timeData.timezoneName}`);
            const now = Date.now();
            const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            console.log(`Local Time: ${dateTimeFormat.format(now)}`);
        })
    );

    promises.push(
        df_si.graphicsEx()
        .then((graphicExData) => {
            console.log(`Screens: ${graphicExData.displays.length}`);
            let screensDesc: string[] = [];
            for (let i = 0, l = graphicExData.displays.length; i < l; ++i) {
                const display = graphicExData.displays[i];
                let screenDesc = '';
                if (display.main) {
                    screenDesc += '(Main) ';
                }
                screenDesc += `${display.model}: ${display.resolutionx} x ${display.resolutiony}`;
                screensDesc.push(screenDesc);
            }
            console.log(`Screen Details: ${screensDesc.join(', ')}`);
        })
    );

    promises.push(
        df_si.system()
        .then((systemData) => {
            console.log(`Machine ID: ${systemData.uuid}`);
        })
    );

    return Promise.all(promises)
    .then(() => {});
}
