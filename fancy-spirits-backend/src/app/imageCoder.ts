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
    console.log("paramtype: ", typeof buffer, Object.keys(buffer));
    console.log("bufferType: ", typeof buffer.data);
    
    // const byteArray = new Uint8Array(buffer) as any;
    // // const imageB64 = base64.bytesToBase64(byteArray);
    // let imageB64_coded = "";
    
    // for (let i = 0; i < byteArray.data.length; i++) {
    //     imageB64_coded += String.fromCharCode(byteArray.data[i]);
    // }
    // console.log("Img64_coded: ", imageB64_coded);
    // const imageB64 =  window.btoa(imageB64_coded);
    // console.log("Img64: ", imageB64);
    return `data:image/jpeg;charset=utf-8;base64,${/* imageB64 */ null}`;
}