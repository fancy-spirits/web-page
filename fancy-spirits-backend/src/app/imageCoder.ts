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
    console.log("Buffer: ", buffer);
    
    const byteArray = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    console.log("Bytearray: ", byteArray);
    // const imageB64 = base64.bytesToBase64(byteArray);
    let imageB64_coded = "";
    console.log("Buffer Lengths: ", /* buffer.length, */ buffer.byteLength);
    console.log("Bytearray Lengths: ", byteArray.length, byteArray.byteLength);
    
    for (let i = 0; i < byteArray.length; i++) {
        imageB64_coded += byteArray[i];
        console.log(byteArray[i], String.fromCharCode(byteArray[i]));
        
    }
    console.log("Img64_coded: ", imageB64_coded);
    const imageB64 =  window.btoa(imageB64_coded);
    console.log("Img64: ", imageB64);
    return `data:image/jpeg;charset=utf-8;base64,${imageB64}`;
}