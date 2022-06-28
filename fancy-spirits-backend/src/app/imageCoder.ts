import * as base64 from "byte-base64";

export function toBuffer(base64: string) {
    const decodedString = window.atob(base64.split(",")[1]);
    const buffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        buffer[i] = decodedString.charCodeAt(i);
    }
    return buffer;
}

export function toBase64(buffer: any) {
    const imageB64_coded = Object.keys(buffer.data).reduce((prev, curr) => prev + String.fromCharCode(buffer.data[curr]), "");
    console.log("Img64_coded: ", imageB64_coded);
    const imageB64 =  window.btoa(imageB64_coded);
    console.log("Img64: ", imageB64);
    return `data:image/png;charset=utf-8;base64,${imageB64}`;
}