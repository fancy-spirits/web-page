import * as base64 from "byte-base64";

export function toBuffer(base64: string) {
    const decodedString = window.atob(base64.split(",")[1]);
    const buffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        buffer[i] = decodedString.charCodeAt(i);
    }
    return buffer;
}

export function toBase64(buffer: Uint8Array | ArrayBuffer) {
    const byteArray = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    const imageB64 = base64.bytesToBase64(byteArray);
    return `data:image/jpeg;charset=utf-8;base64,${imageB64}`;
}