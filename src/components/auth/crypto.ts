import { Buffer } from 'buffer';

const DEFAULT_KEY = "¡Éåè££µ¡";

/**
 * Encrypt (C# Latin-1 compatible)
 */
export function decrypt(mWORD: string, mKEY = DEFAULT_KEY) {

  // Convert string → byte array (Latin-1 semantics)
  const wordBytes = [];
  for (let i = 0; i < mWORD.length; i++) {
    wordBytes.push(mWORD.charCodeAt(i) & 0xff);
    
  }

  const keyBytes = [];
  for (let i = 0; i < mKEY.length; i++) {
    keyBytes.push(mKEY.charCodeAt(i) & 0xff);

  }

  const cipherBytes = [];
  let KK = 0;

  // Reverse loop (JJ = len-1 → 0)
  for (let JJ = wordBytes.length - 1; JJ >= 0; JJ--) {
    if (KK >= keyBytes.length) KK = 0;
    
    const x = (wordBytes[JJ] + keyBytes[KK]) & 0xff;
    // const x = (wordBytes[JJ] + keyBytes[KK]);

    cipherBytes.push(x);

    KK++;
  }

  // Base64 encode (same as Convert.ToBase64String)
  return Buffer.from(cipherBytes).toString('base64');
}
