import { CryptoService } from '../crypto';
import { EncryptionService } from '../encryption';
import { WalletError } from '../errors';
import logger from '../../utils/logger';
import { Wallet } from '../wallet/types';
import { parseUnits, getAddress } from 'ethers';

export class WalletService {
  private static balances: Record<string, number> = {};

  /**
   * Create a new wallet
   * @returns {Promise<Wallet>} The created wallet object
   */
  async createWallet(): Promise<Wallet> {
    try {
      const { privateKey, publicKey, address } = CryptoService.generateKeyPair();

      // Encrypt the private key for secure storage
      const encryptedPrivateKey = await EncryptionService.encryptPrivateKey(privateKey);

      // Create the wallet object
      const wallet: Wallet = { address, publicKey, privateKey: encryptedPrivateKey };

      // Logic to save the wallet (e.g., to a database) should be implemented here

      return wallet;
    } catch (error) {
      logger.error('Failed to create wallet:', error);
      throw new WalletError('Failed to create wallet');
    }
  }

  /**
   * Get wallet balance
   * @param address - The wallet address
   * @returns {number} The balance of the wallet
   */
  static getBalance(address: string): number {
    const normalizedAddress = getAddress(address);
    return this.balances[normalizedAddress] || 0;
  }

  /**
   * Send amount from one address to another
   * @param sender - The sender's address
   * @param recipient - The recipient's address
   * @param amount - The amount to send
   * @param signature - The transaction signature
   * @returns {boolean} Success status of the transaction
   */
  static sendAmount(
    sender: string,
    recipient: string,
    amount: string,
    signature: string
  ): boolean {
    try {
      const normalizedSender = getAddress(sender);
      const normalizedRecipient = getAddress(recipient);
      const amountInWei = parseUnits(amount, 'ether');

      if (this.balances[normalizedSender] < Number(amountInWei)) {
        throw new WalletError('Insufficient funds');
      }

      const message = `\x19Ethereum Signed Message:\n${normalizedSender.length}${normalizedSender}${normalizedRecipient}${amountInWei.toString()}`;
      const recoveredAddress = CryptoService.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== normalizedSender.toLowerCase()) {
        throw new WalletError('Invalid signature');
      }

      this.balances[normalizedSender] -= Number(amountInWei);
      this.balances[normalizedRecipient] = (this.balances[normalizedRecipient] || 0) + Number(amountInWei);

      return true;
    } catch (error) {
      logger.error('Failed to send amount:', error);
      throw new WalletError('Failed to send amount');
    }
  }
}