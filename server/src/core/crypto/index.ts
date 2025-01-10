import { ethers } from 'ethers';
import { CryptoError } from '../errors';
import logger from '../../utils/logger';

export class CryptoService {
  /**
   * Generate a new key pair
   * @returns {Object} Object containing private key and public address
   */
  static generateKeyPair() {
    try {
      const wallet = ethers.Wallet.createRandom();
      return {
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        address: wallet.address
      };
    } catch (error) {
      logger.error('Failed to generate key pair:', error);
      throw new CryptoError('Failed to generate key pair');
    }
  }

  /**
   * Sign a message with a private key
   */
  static async signMessage(message: string, privateKey: string): Promise<string> {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return await wallet.signMessage(message);
    } catch (error) {
      logger.error('Failed to sign message:', error);
      throw new CryptoError('Failed to sign message');
    }
  }

  /**
   * Verify a signed message
   */
  static verifyMessage(message: string, signature: string): string {
    try {
      return ethers.verifyMessage(message, signature);
    } catch (error) {
      logger.error('Failed to verify message:', error);
      throw new CryptoError('Failed to verify message');
    }
  }
}