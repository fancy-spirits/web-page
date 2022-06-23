
export function jsonToBuffer(obj: any) {
    const elements: number[] = Object.keys(obj).map(key => obj[key]);
    const buffer = new Uint8Array(elements);
    return buffer;
}