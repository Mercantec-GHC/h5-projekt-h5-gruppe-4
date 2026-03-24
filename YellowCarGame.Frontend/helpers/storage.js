import CryptoJS from "crypto-js";

// OBS: Gem evt. denne i .env og hent med process.env.NEXT_PUBLIC_STORAGE_KEY
const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY;

// Gem krypteret data i localStorage
export const gemKrypteret = (key, data) => {
    try {
        if (!SECRET_KEY) {
            localStorage.setItem(key, JSON.stringify(data));
            return;
        }
        const krypteret = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        localStorage.setItem(key, krypteret);
    } catch (err) {
        console.error("Fejl ved kryptering og lagring:", err);
    }
};

export const laesDekrypteret = (key) => {
    try {
        const krypteret = localStorage.getItem(key);
        if (!krypteret) return null;

        if (!SECRET_KEY) {
            return JSON.parse(krypteret);
        }

        const bytes = CryptoJS.AES.decrypt(krypteret, SECRET_KEY);
        const dekrypteret = bytes.toString(CryptoJS.enc.Utf8);
        return dekrypteret ? JSON.parse(dekrypteret) : null;
    } catch (err) {
        console.error("Fejl ved dekryptering:", err);
        return null;
    }
};


// Fjern data fra localStorage
export const fjernData = (key) => {
    localStorage.removeItem(key);
};
