import * as base64 from "byte-base64";

export function toBuffer(base64: string) {
    const decodedString = window.atob(base64.split(",")[1]);
    const buffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        buffer[i] = decodedString.charCodeAt(i);
    }
    return buffer;
}

export function toBase64(buffer: ArrayBuffer) {
    console.log("buffertype: ", typeof buffer);
    const byteArray = new Uint8Array(buffer) as any;
    console.log("Bytearray: ", byteArray);
    // const imageB64 = base64.bytesToBase64(byteArray);
    let imageB64_coded = "";
    console.log("Buffer Lengths: ", /* buffer.length, */ buffer.byteLength);
    console.log("Bytearray Lengths: ", byteArray.length, byteArray.byteLength);
    
    for (let i = 0; i < byteArray.data.length; i++) {
        imageB64_coded += String.fromCharCode(byteArray.data[i]);
    }
    console.log("Img64_coded: ", imageB64_coded);
    const imageB64 =  window.btoa(imageB64_coded);
    console.log("Img64: ", imageB64);
    return `data:image/jpeg;charset=utf-8;base64,${imageB64}`;
}