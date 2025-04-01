// helpers.js
const COUNTRY_CODE = "TN";
const BANK_CODE = "07";
const BRANCH_CODE = "006";
const DOMICILIATION = "AMEN BANK - Agence Centrale";

/**
 * Calcule le modulo 97 d'une grande chaîne numérique.
 */
function mod97(numStr) {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97;
  }
  return remainder;
}

/**
 * Convertit une chaîne en chaîne numérique en remplaçant les lettres (A -> 10, B -> 11, …).
 */
function convertToNumeric(str) {
  let converted = "";
  for (const char of str.toUpperCase()) {
    if (/[A-Z]/.test(char)) {
      converted += (char.charCodeAt(0) - 55).toString();
    } else {
      converted += char;
    }
  }
  return converted;
}

/**
 * Calcule le check digit (clé RIB) à 2 chiffres.
 * Formule : clé = 97 - ( (BANK_CODE + BRANCH_CODE + accountNumber) mod 97 )
 */
function computeInternalCheckDigit(accountNumber) {
  const combined = BANK_CODE + BRANCH_CODE + accountNumber;
  const remainder = mod97(combined);
  let key = 97 - remainder;
  if (key === 97) key = 0;
  return key.toString().padStart(2, "0");
}

/**
 * Calcule l'IBAN checksum (2 chiffres) à partir du BBAN complet.
 */
function computeIbanChecksum(accountNumber) {
  const checkDigit = computeInternalCheckDigit(accountNumber);
  const bban = BANK_CODE + BRANCH_CODE + accountNumber + checkDigit;
  const numericCountry = convertToNumeric(COUNTRY_CODE);
  const checkString = bban + numericCountry + "00";
  const remainder = mod97(checkString);
  const ibanChecksum = 98 - remainder;
  return ibanChecksum.toString().padStart(2, "0");
}

/**
 * Génère l'IBAN tunisien complet.
 * Format : [COUNTRY_CODE][IBAN_checksum][BANK_CODE][BRANCH_CODE][accountNumber][check digit]
 */
function generateIBAN(accountNumber) {
  // Le numéro de compte doit comporter 13 chiffres.
  if (!/^[0-9]{13}$/.test(accountNumber)) {
    throw new Error("Le numéro de compte doit contenir exactement 13 chiffres.");
  }
  const internalCheckDigit = computeInternalCheckDigit(accountNumber);
  const ibanChecksum = computeIbanChecksum(accountNumber);
  return `${COUNTRY_CODE}${ibanChecksum}${BANK_CODE}${BRANCH_CODE}${accountNumber}${internalCheckDigit}`;
}

// Pour rester compatible avec votre contrôleur, exportez generateRIB comme alias de generateIBAN.
const generateRIB = generateIBAN;

/**
 * (Optionnel) Génère un OTP à 6 chiffres.
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  generateRIB,
  generateIBAN,
  DOMICILIATION,
  generateOTP,
};
