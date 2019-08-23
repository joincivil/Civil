export const alg = { name: "AES-CBC", length: 256 };
export const authAlg = {
  name: "ECDSA",
  hash: { name: "SHA-256" },
  namedCurve: "P-256",
};

export interface EncryptedData {
  iv: string; // initialization vector
  ciphertext: string; // encrypted data
}

export async function encrypt(plaintext: string, key: CryptoKey): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = await crypto.subtle.encrypt({ ...alg, iv }, key, encoded);

  return {
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(ciphertext),
  };
}

export async function decrypt(data: EncryptedData, key: CryptoKey): Promise<string> {
  const ciphertextBuffer = base64ToArrayBuffer(data.ciphertext);
  const iv = base64ToArrayBuffer(data.iv);

  const plaintextBuffer = await crypto.subtle.decrypt({ ...alg, iv }, key, ciphertextBuffer);

  const decoder = new TextDecoder();
  return decoder.decode(plaintextBuffer);
}

export async function sign(message: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(message);
  const signatureBuffer = await crypto.subtle.sign(authAlg, key, encoded);

  return arrayBufferToBase64(signatureBuffer);
}

export async function verify(message: string, signature: string, key: CryptoKey): Promise<boolean> {
  const encoder = new TextEncoder();
  const messageEncoded = encoder.encode(message);

  const signatureBuffer = base64ToArrayBuffer(signature);
  return crypto.subtle.verify(authAlg, key, signatureBuffer, messageEncoded);
}

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(alg, true, ["encrypt", "decrypt"]);
}

export async function generateAuthKey(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(authAlg, true, ["sign", "verify"]);
}

export async function generateECDHKey(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
}

export async function derivePartnerKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<any> {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: publicKey },
    privateKey,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

export async function publicKeyToString(keyPair: CryptoKeyPair): Promise<string> {
  const data = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  return arrayBufferToBase64(data);
}

export async function publicKeyFromString(pub: string, isECDH: boolean): Promise<CryptoKey> {
  const arr = base64ToArrayBuffer(pub);

  const pubAlg = isECDH ? { name: "ECDH", namedCurve: "P-256", hash: { name: "SHA-256" } } : authAlg;
  try {
    const res = await crypto.subtle.importKey("spki", arr, pubAlg, true, isECDH ? [] : ["verify"]);

    return res;
  } catch (err) {
    console.error("error publicKeyFromString", err);
    throw err;
  }
}
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // @ts-ignore
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
