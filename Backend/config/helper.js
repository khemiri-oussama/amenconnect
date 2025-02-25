// helpers.js (or inside your controller file)
const BANK_CODE = "12345";
const BRANCH_CODE = "67890";
const DOMICILIATION = "AMEN BANK - Agence Centrale"; // Modify as needed

/**
 * Compute modulo 97 on a large number represented as a string.
 * (This algorithm processes one digit at a time.)
 */
function mod97(numStr) {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97;
  }
  return remainder;
}

/**
 * Converts each character of the account number to a numeric string:
 * For letters, A -> 10, B -> 11, …, Z -> 35.
 */
function convertAccountNumber(accountNumber) {
  let converted = "";
  for (const char of accountNumber.toUpperCase()) {
    if (/[A-Z]/.test(char)) {
      // 'A'.charCodeAt(0) is 65 so 65 - 55 = 10, etc.
      converted += (char.charCodeAt(0) - 55).toString();
    } else {
      converted += char;
    }
  }
  return converted;
}

/**
 * Compute the 2-digit RIB key.
 * Formula: clé = 97 - ( (BANK_CODE + BRANCH_CODE + convertedAccountNumber) mod 97 )
 */
function computeRibKey(accountNumber) {
  const accountNumberConverted = convertAccountNumber(accountNumber);
  const combined = BANK_CODE + BRANCH_CODE + accountNumberConverted;
  const remainder = mod97(combined);
  let key = 97 - remainder;
  // If key equals 97, the result should be 00.
  if (key === 97) key = 0;
  return key.toString().padStart(2, "0");
}

/**
 * Generate the full RIB.
 * Format: [BANK_CODE][BRANCH_CODE][accountNumber][RIB_key]
 */
function generateRIB(accountNumber) {
  const ribKey = computeRibKey(accountNumber);
  return BANK_CODE + BRANCH_CODE + accountNumber + ribKey;
}

/**
 * (Optional) Generate an 11-character alphanumeric account number.
 * Adjust the algorithm as needed.
 */


module.exports = {
  generateRIB,
  DOMICILIATION,
};
