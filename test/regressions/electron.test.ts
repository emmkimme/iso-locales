// const convert = require('convert-units');
import { expect } from 'chai';
import * as os from 'os';
import * as path from 'path';
import { app } from 'electron';

import * as si from '../../lib';

import { PcInfo } from './electron-opsconsole';

function pourcent_diff(a: number, b: number) {
    if (a > b) {
        return ((a - b) / b) * 100;
    }
    else {
        return ((b - a) / a) * 100;
    }
}

describe('regressions electron', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('getNumOfDisplays (si)', () => {
        return si.graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getNumOfDisplays();
            expect(siInfo.displays.length).to.equal(originalValue);
        });
    });


    it ('getNumOfDisplays (electron)', () => {
        return si.electron_graphicsEx()
        .then((siInfo) => {
            let originalValue = PcInfo.getNumOfDisplays();
            expect(siInfo.displays.length).to.equal(originalValue);
        });
    });

    it ('getTotalScreenResolution (si)', () => {
        return si.graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getTotalScreenResolution();
            expect(`${siInfo.resolutionx - siInfo.positionx} x ${siInfo.resolutiony - siInfo.positiony}`).to.equal(originalValue);
        });
    });


    it ('getTotalScreenResolution (electron)', () => {
        return si.electron_graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getTotalScreenResolution();
            expect(`${siInfo.resolutionx - siInfo.positionx} x ${siInfo.resolutiony - siInfo.positiony}`).to.equal(originalValue);
        });
    });

    it ('getScreenResolution', () => {
        return si.graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getNumOfDisplays();
            expect(siInfo.displays.length).to.equal(originalValue);

            for (let i = 0; i < originalValue; ++i) {
                let originalSize = PcInfo.getScreenResolution(i + 1);
                const display = siInfo.displays[i];
                expect(`${display.currentResX} x ${display.currentResY}`).to.equal(originalSize);
            }
        });
    });

    it ('getPrimaryScreenScaleFactor NOT WORKKING (si)', () => {
        return si.graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getPrimaryScreenScaleFactor();
            const display = siInfo.displays.find((display) => display.main);
            // Does not work with SI !!!
            expect(display.scaleFactor).not.equal(originalValue);
        });
    });

    it ('getPrimaryScreenScaleFactor (electron)', () => {
        return si.electron_graphicsEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getPrimaryScreenScaleFactor();
            const display = siInfo.displays.find((display) => display.main);
            expect(display.scaleFactor).to.equal(originalValue);
        });
    });

    it ('getFreeDiskSpace', () => {
        const isWin32 = os.platform() === 'win32';
        const root = isWin32 ? path.parse(app.getPath('appData')).root.replace('\\', '') : '/';
        return si.fsSize()
        .then((siInfo) => {
            return PcInfo.getFreeDiskSpace()
            .then((originalValue) => {
                let newValue: number;
                for (let i = 0, l = siInfo.length; i < l; ++i) {
                    const fsMount = siInfo[i];
                    if (fsMount.mount === root) {
                        newValue = fsMount.size - fsMount.used;
                        break;
                    }
                }
                expect(pourcent_diff(newValue, originalValue)).lt(1);
            });
        });
    });
});

