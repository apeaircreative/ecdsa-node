import { CryptoService } from '../crypto';
import { WalletError } from '../errors';
import logger from '../../utils/logger';

type Balance = {
  [address: string]: number;
};

export class WalletService {
  private static balances: Balance = {};

  /**
   * Create a new wallet
   */
  static createWallet() {
    try {
      const { privateKey, publicKey, address } = CryptoService.generateKeyPair();
      this.balances[address] = 0;
      
      logger.info(`Created new wallet with address: ${address}`);
      return { privateKey, publicKey, address };
    } catch (error) {
      logger.error('Failed to create wallet:', error);
      throw new WalletError('Failed to create wallet');
    }
  }

  /**
   * Get wallet balance
   */
  static getBalance(address: string): number {
    return this.balances[address] || 0;
  }

  /**
   * Send amount from one address to another
   */
  static sendAmount(
    sender: string,
    recipient: string,
    amount: number,
    signature: string
  ): boolean {
    try {
      // Verify the sender has enough funds
      if (this.balances[sender] < amount) {
        throw new WalletError('Insufficient funds');
      }

      // Verify the signature
      const message = `${sender}${recipient}${amount}`;
      const recoveredAddress = CryptoService.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== sender.toLowerCase()) {
        throw new WalletError('Invalid signature');
      }

      // Process the transfer
      this.balances[sender] -= amount;
      this.balances[recipient] = (this.balances[recipient] || 0) + amount;

      logger.info(`Transferred ${amount} from ${sender} to ${recipient}`);
      return true;
    } catch (error) {
      logger.error('Transfer failed:', error);
      throw error;
    }
  }
}