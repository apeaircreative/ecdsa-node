// src/core/encryption/index.ts
import CryptoJS from 'crypto-js';
import { config } from '../../config/config';

export class EncryptionService {
  private static readonly keyLength = 32; // 256 bits

  // Encrypt private key
  static encryptPrivateKey(privateKey: string): string {
    try {
      return CryptoJS.AES.encrypt(privateKey, config.encryptionKey).toString();
    } catch (error) {
      throw new Error('Failed to encrypt private key');
    }
  }

  // Decrypt private key
  static decryptPrivateKey(encryptedKey: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedKey, config.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Failed to decrypt private key');
    }
  }

  // Validate encryption key length
  static validateEncryptionKey(): boolean {
    return config.encryptionKey.length >= this.keyLength;
  }
}