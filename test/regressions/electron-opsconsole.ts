import * as os from 'os';
import * as path from 'path';
import {app, screen} from 'electron';
// import {Stats, MapFuncStat} from './type';
const microstats = require('microstats');

export class PcInfo {
    public static getFnScreenResolution(num: number): () => string {
        return () => PcInfo.getScreenResolution(num);
    }

    public static getScreenResolution(screenNum: number): string {
        if (screenNum > this.getNumOfDisplays()) {
            throw new Error(`StatLib: Screen #${screenNum} is not available`);
        }
        let size = screen.getAllDisplays()[screenNum - 1].size;
        return `${size.width} x ${size.height}`;
    }

    public static getPrimaryScreenScaleFactor(): number {
        return screen.getPrimaryDisplay().scaleFactor;
    }

    public static getNumOfDisplays(): number {
        return screen.getAllDisplays().length;
    }

    public static getTotalScreenResolution(): string {
        let minX = 0, minY = 0, maxXPlusW = 0, maxYPlusH = 0;
        screen.getAllDisplays().map((scr) => {
            minX = (minX < scr.bounds.x) ? minX : scr.bounds.x;
            minY = (minY < scr.bounds.y) ? minY : scr.bounds.y;
            maxXPlusW = (maxXPlusW >= (scr.bounds.x + scr.bounds.width)) ? maxXPlusW : (scr.bounds.x + scr.bounds.width);
            maxYPlusH = (maxYPlusH >= (scr.bounds.y + scr.bounds.height)) ? maxYPlusH : (scr.bounds.y + scr.bounds.height);
        });
        return `${maxXPlusW - minX} x ${maxYPlusH - minY}`;
    }

    public static getFreeDiskSpace(): Promise<number> {
        const isWin32 = os.platform() === 'win32';
        const root = isWin32 ? path.parse(app.getPath('appData')).root.replace('\\', '') : '/';
        return new Promise<number>((resolve, reject) => {
            const onDisk = (value: any) => {
                const dst = isWin32 ? value.filesystem : value.mount;
                if (dst !== root) {
                    return;
                }

                finish();
                resolve(value.free);
            };
            const onError = (error: Error) => {
                finish();
                reject(error);
            };
            const finish = () => {
                microstats.removeListener('disk', onDisk);
                microstats.removeListener('error', onError);
            };

            microstats.on('disk', onDisk);
            microstats.on('error', onError);
            microstats.start({ frequency: 'once'}, (error?: Error) => {
                if (error) {
                    finish();
                    reject(error);
                }
            });
        });
    }
}
