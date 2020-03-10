export function isNumeric(n: any): boolean {
    if (typeof n === 'number') {
        return true;
    }
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function padLeft(paddingValue: string, value: any): string {
    return (paddingValue + value.toString()).slice(-paddingValue.length);
}
