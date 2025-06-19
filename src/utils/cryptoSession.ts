let rsaKeyPair: CryptoKeyPair | null = null;
let aesKey: Uint8Array | null = null;
let sessionId: string | null = null;

export async function generateSessionId(): Promise<string> {
  sessionId = crypto.randomUUID();
  return sessionId;
}

export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  rsaKeyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return rsaKeyPair;
}

export async function exportPublicKey(): Promise<string> {
  if (!rsaKeyPair) throw new Error("RSA key pair not generated");

  const keyBuffer = await crypto.subtle.exportKey("spki", rsaKeyPair.publicKey);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));

  return `-----BEGIN PUBLIC KEY-----\n${chunkString(keyBase64, 64)}\n-----END PUBLIC KEY-----`;
}

function chunkString(str: string, size: number): string {
  return str.match(new RegExp(`.{1,${size}}`, 'g'))?.join('\n') ?? str;
}

export async function performHandshake(api: any): Promise<void> {
  await loadKeyPairFromStorage();
  if (!rsaKeyPair) await generateRSAKeyPair();
  if (!sessionId) {
    await generateSessionId();
  }
  localStorage.setItem('sessionId', sessionId!);
  const publicKeyPem = await exportPublicKey();
  const response = await api.post('/handshake', {
    publicKey: publicKeyPem,
    sessionId,
  });

  const encryptedKeyBase64 = response.aesKey;
  const encryptedKeyBuffer = Uint8Array.from(atob(encryptedKeyBase64), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    rsaKeyPair!.privateKey,
    encryptedKeyBuffer
  );

  aesKey = new Uint8Array(decrypted);
  storeAESKey(aesKey);
}

export function getAESKey(): Uint8Array | null {
  return aesKey;
}

export function getSessionId(): string | null {
  return sessionId;
}

export async function saveKeyPairToStorage() {
  if (!rsaKeyPair) return;

  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', rsaKeyPair.privateKey);
  const publicKeyBuffer = await crypto.subtle.exportKey('spki', rsaKeyPair.publicKey);

  localStorage.setItem('rsaPrivateKey', btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer))));
  localStorage.setItem('rsaPublicKey', btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer))));
}

export async function loadKeyPairFromStorage() {
  const privB64 = localStorage.getItem('rsaPrivateKey');
  const pubB64 = localStorage.getItem('rsaPublicKey');

  if (!privB64 || !pubB64) return null;

  const privBuffer = Uint8Array.from(atob(privB64), c => c.charCodeAt(0));
  const pubBuffer = Uint8Array.from(atob(pubB64), c => c.charCodeAt(0));

  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  );

  const publicKey = await crypto.subtle.importKey(
    'spki',
    pubBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );

  rsaKeyPair = { privateKey, publicKey };
  return rsaKeyPair;
}

function storeAESKey(aesKey: Uint8Array) {
  localStorage.setItem('aesKey', btoa(String.fromCharCode(...aesKey)));
}

function loadAESKey(): Uint8Array | null {
  const b64 = localStorage.getItem('aesKey');
  if (!b64) return null;
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export async function restoreCryptoState() {
  await loadKeyPairFromStorage();

  const storedAESKey = loadAESKey();
  if (storedAESKey) {
    aesKey = storedAESKey;
  }

  const storedSessionId = localStorage.getItem('sessionId');
  if (storedSessionId) {
    sessionId = storedSessionId;
  }
}
export function clearCryptoSession() {
  localStorage.removeItem('rsaPrivateKey');
  localStorage.removeItem('rsaPublicKey');
  localStorage.removeItem('aesKey');
  localStorage.removeItem('sessionId');
  localStorage.removeItem('user');

  rsaKeyPair = null;
  aesKey = null;
  sessionId = null;
}
