import * as CryptoJS from 'crypto-js';

export class CryptoUtils {

    public static encryptData(json: string){
        const encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(json), 'secret key 123').toString());

        return encryptInfo;
    }

    public static decryptData(cryptData: string){
        const deData = CryptoJS.AES.decrypt(decodeURIComponent(cryptData), 'secret key 123'); 
        const decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));

        return decryptedInfo;
    }
}
