import * as os from 'os';
import * as utils from 'util';
import * as childProcess from 'child_process';
// import {Stats, MapFuncStat} from './type';
const exec = utils.promisify(childProcess.exec);
const KB = 1024;
const MB = KB * KB;
const GB = KB * KB * KB;
const platform = process.platform;
const darwin = (platform === 'darwin');
const windows = (platform === 'win32');
const linux = (platform === 'linux');
const archWin32 = os.arch() === 'x32';

// export function getMapFuncStat(): MapFuncStat {
//     return {
//         [Stats.CMPNAME]: PcInfo.getHostName,
//         [Stats.CPUCORES]: PcInfo.getNumOfCpus,
//         [Stats.MEMAVAIL]: PcInfo.getFreeMemory,
//         [Stats.INSTMEM]: PcInfo.getPhysicalMemory,
//         [Stats.WINUSER]: PcInfo.getUserName,
//         [Stats.CPUSPEED]: PcInfo.getCpusSpeed,
//         [Stats.PCNONIC]: PcInfo.getNumOfNetworkInterfaces,
//         [Stats.OSPLATFORM]: PcInfo.getOsPlatform,
//         [Stats.OSVERNO]: PcInfo.getOsVersion,
//         [Stats.BRSWRVER]: PcInfo.getVersionsChrome,
//         [Stats.OSLANGUAGE]: PcInfo.getLanguageOS,
//         [Stats.USERRIGHTS]: PcInfo.getUserLevel,
//         [Stats.VM]: PcInfo.getMachineRun,
//         [Stats.EXCBITVER]: PcInfo.getArchExcel
//     };
// }

export class PcInfo {
    public static getTotalMemory(): number {
        return os.totalmem() / MB;
    }
    public static getFreeMemory(): number {
        return os.freemem() / MB;
    }
    public static async getNumOfCpus(): Promise<Number> {
        let amount;
        if (linux) {
            const output = await exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l');
            amount = parseInt(output.stdout.trim(), 10);
          } else if (darwin) {
            const output = await exec('sysctl -n hw.physicalcpu_max');
            amount = parseInt(output.stdout.trim(), 10);
          } else if (windows) {
            const output = await exec('WMIC CPU Get NumberOfCores');
            amount = output.stdout.split(os.EOL)
              .map(function parse (line) { return parseInt(line); })
              .filter(function numbers (value) { return !isNaN(value); })
              .reduce(function add (sum, numbers) { return sum + numbers; }, 0);
          } else {
            const cores = os.cpus().filter(function (cpu, index) {
              const hasHyperthreading = cpu.model.includes('Intel');
              const isOdd = index % 2 === 1;
              return !hasHyperthreading || isOdd;
            });
            amount = cores.length;
        }
        return amount;
    }
    public static getPhysicalMemory(): number {
        return Math.round(os.totalmem() / GB);
    }
    public static getCpusSpeed(): number {
        // Max speed
        return Math.max(...os.cpus().map(aCpu => { return aCpu.speed; }));
    }
    public static getNumOfNetworkInterfaces(): number {
        let nics = os.networkInterfaces();
        let isNotInternal = (k: string) => {
            return nics[k].some((aObj => aObj.internal === false));
        };
        let isIPv4 = (k: string) => {
            return nics[k].some((aObj => aObj.family === 'IPv4'));
        };
        return Object.keys(nics).filter((k) => {
            return (isNotInternal(k) && isIPv4(k));
        }).length;
    }
    public static getUserName(): string {
        return os.userInfo({ encoding: 'utf8' }).username;
    }
    public static getHostName(): string {
        return os.hostname();
    }
    public static getOsVersion(): string {
        return os.release().toString();
    }
    public static getOsPlatform(): string {
        return os.platform().toString();
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    public static async getLanguageOS() {
        const { languageDarwin, languageWin } = PcInfo.commandLanguage();
        if (darwin) {
            const language = await exec(languageDarwin);
            const lang = language.stdout.split(',')[0].split('(')[1].split('"')[1].split('-')[0].toUpperCase();
            return lang === 'EN' ? 'English' : lang === 'SG' ? 'Singapore' : lang === 'TH' ? 'Thai' : lang === 'CN' ? 'Chinese' : lang === 'JP' ? 'Japanese' : '';
        } else if (windows) {
            const language = await exec(languageWin);
            return language.stdout.split(':')[1].split(';')[1].trim().toString();
        } else {
                  // not implements other OS
            return null;
        }
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    public static async getMachineRun(): Promise<Boolean> {
        const { machineLinux, REGEX, machineWin } = PcInfo.machineCommand();
        if (linux) {
            const data = await exec(machineLinux);
            return REGEX.test(data.stdout.toString());
        } else if (windows) {
            const data = await exec(machineWin);
            return REGEX.test(data.stdout.split('\n')[0].toString());
        } else {
            // not implements other OS and defaults check linux and Win32
            return false;
        }
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    public static getUserLevel(): string {
        return os.userInfo({ encoding: 'utf8' }).username;
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    public static async getArchExcel(): Promise<String> {
        const {macExcel, winExcel} = PcInfo.execExcel();
        if (darwin) {
            const data = await exec(macExcel);
            const result = data.stdout.split('\n')[6].split(': ')[1].toString();
            const valid = result === 'Yes';
            return valid ? '64' : '32';
        } else if (windows) {
            if (archWin32) {
                return '32';
            } else {
                const result = await exec(winExcel);
                return result.stdout.split('\n')[2].split(' x')[1].toString();
            }
        } else {
            // not implements other OS
            return null;
        }
    }
        // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    public static async getVersionsChrome(): Promise<String> {
        const {chromeWin, chromeDarwin} = PcInfo.chromeRegExp();
         if (darwin) {
            const data = await exec(chromeDarwin);
            const result = data.stdout.split(' ')[2].split('.')[0].toString();
            return result;
         } else if (windows) {
             const data = await exec(chromeWin);
             const result = data.stdout.split('\n')[2].split(' ')[12].split('.')[0].toString();
             return result;
         } else {
             return process.versions.v8;
         }
        }
// http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    private static chromeRegExp(): string | any {
        const chromeWin = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version';
        const chromeDarwin = '/Applications/"Google Chrome.app"/Contents/MacOS/"Google Chrome" --version';
        return {chromeWin, chromeDarwin};
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    private static execExcel(): string | any {
        const macExcel = 'system_profiler SPApplicationsDataType | grep "Excel:" -A 6';
        const winExcel = 'reg query HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration /v Platform';
        return { macExcel , winExcel };
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    private static machineCommand(): string | any {
        const REGEX = new RegExp('/VM/i');
        const machineWin = 'systeminfo | find "System Model"';
        const machineLinux = 'cat /sys/class/dmi/id/product_name';
        return { machineLinux, REGEX, machineWin };
    }
    // http://upg-jira.int.thomsonreuters.com/browse/SAP-4625
    private static commandLanguage(): string | any {
        const languageDarwin = 'defaults read -g AppleLanguages';
        const languageWin = 'systeminfo | find "System Locale"';
        return { languageDarwin, languageWin };
    }
}

