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
  if (!rsaKeyPair) {
    await generateRSAKeyPair();
  }
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
}

export function getAESKey(): Uint8Array | null {
  return aesKey;
}

export function getSessionId(): string | null {
  return sessionId;
}
