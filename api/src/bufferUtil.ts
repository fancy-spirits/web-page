
export function jsonToBuffer(obj: any) {
    const elements: number[] = Object.keys(obj).map(key => obj[key]);
    const array = new Uint8Array(elements);
    const buffer = Buffer.from(array);
    return `\\x${buffer.toString("hex")}`;
}