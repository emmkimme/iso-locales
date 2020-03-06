
const convert = require('convert-units');
import { expect } from 'chai';
import * as os from 'os';

import * as si from '../lib';

import { PcInfo } from './regressions/node-opsconsole';


function pourcent_diff(a: number, b: number) {
    if (a > b) {
        return ((a - b) / b) * 100;
    }
    else {
        return ((b - a) / a) * 100;
    }
}

describe('regressions node', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it ('getCpusSpeed', () => {
        return si.cpu()
        .then((siInfo) => {
            const originalValue = PcInfo.getCpusSpeed();
            const newValue = convert(Number(siInfo.speed)).from('GHz').to('MHz');
            expect(pourcent_diff(newValue, originalValue)).lt(1);
        });
    });

    it ('getFreeMemory', () => {
        return si.mem()
        .then((siInfo) => {
            let originalValue = PcInfo.getFreeMemory();
            const newValue = convert(Number(siInfo.free)).from('B').to('MB');
            expect(pourcent_diff(newValue, originalValue)).lt(1);
        });
    });

    it ('getTotalMemory', () => {
        return si.mem()
        .then((siInfo) => {
            let originalValue = PcInfo.getTotalMemory();
            const newValue = convert(Number(siInfo.total)).from('B').to('MB');
            expect(pourcent_diff(newValue, originalValue)).lt(1);
        });
    });

    it ('getNumOfCpus', () => {
        return si.cpu()
        .then((siInfo) => {
            return PcInfo.getNumOfCpus()
            .then((originalValue) => {
                expect(siInfo.physicalCores).to.equal(originalValue);
            });
        });
    });

    it ('getNumOfNetworkInterfaces', () => {
        return si.networkInterfaces()
        .then((siInfo) => {
            const originalValue = PcInfo.getNumOfNetworkInterfaces();
            const newValue = siInfo.filter(inter => {
                return (inter.internal === false) && (inter.ip4 && inter.ip4.length);
            });
            expect(newValue.length).to.equal(originalValue);
        });
    });

    it ('getUserName', () => {
        return si.users()
        .then((siInfo) => {
            const originalValue = PcInfo.getUserName();
            const osUserName = os.userInfo().username;
            const currentUser = siInfo.find((u) => {
                return u.user.toLowerCase() === osUserName.toLowerCase();
            });
            expect(currentUser.user.toLowerCase()).to.equal(originalValue.toLowerCase());
        });
    });

    it ('getHostName', () => {
        return si.osInfoEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getHostName();
            expect(siInfo.hostname).to.equal(originalValue);
        });
    });

    it ('getOsVersion', () => {
        return si.osInfoEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getOsVersion();
            expect(siInfo.release).to.equal(originalValue);
        });
    });

    it ('getOsPlatform', () => {
        return si.osInfoEx()
        .then((siInfo) => {
            const originalValue = PcInfo.getOsPlatform();
            expect(siInfo.platform).to.equal(originalValue);
        });
    });

    it ('getLanguageOS', () => {
        return si.osInfoEx()
        .then((siInfo) => {
            return PcInfo.getLanguageOS()
            .then((originalValue) => {
                const newValue = `${siInfo.locale.language} (${siInfo.locale.location})`;
                expect(newValue).to.equal(originalValue);
            });
        });
    });

    it ('getMachineRun', () => {
        return si.system()
        .then((siInfo) => {
            return PcInfo.getMachineRun()
            .then((originalValue) => {
                const REGEX = new RegExp('/VM/i');
                const newValue = REGEX.test(siInfo.model.toString());
                expect(newValue).to.equal(originalValue);
            });
        });
    });

});

