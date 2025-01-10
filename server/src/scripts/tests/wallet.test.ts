// src/scripts/tests/wallet.test.ts
import { CryptoService } from '../../core/crypto';
import { WalletService } from '../../core/wallet';
import { ConsoleUtils as console } from '../utils/console';
import { FormatUtils as format } from '../utils/format';
import { WalletUtils as wallet } from '../utils/wallet';
import { EncryptionService } from '../../core/encryption';
import { getAddress } from 'ethers';

export async function walletTest() {
  try {
    process.stdout.write('\x1Bc'); // Clear console
    console.printSection('ECDSA Wallet Test');

    await console.loading('Creating wallets');
    const walletService = new WalletService();
    const wallet1 = await walletService.createWallet();
    const wallet2 = await walletService.createWallet();

    console.printSection('Wallet Details');
    wallet.printDetails('Wallet One', wallet1.address);
    console.log();
    wallet.printDetails('Wallet Two', wallet2.address);
    console.printDivider();

    const normalizedWallet1Address = getAddress(wallet1.address);
    (WalletService as any).balances[normalizedWallet1Address] = 100;
    await console.loading('Setting initial balances');

    console.printSection('Initial State');
    wallet.printDetails('Wallet One', normalizedWallet1Address, WalletService.getBalance(normalizedWallet1Address));
    console.log();
    wallet.printDetails('Wallet Two', wallet2.address, WalletService.getBalance(wallet2.address));
    console.printDivider();

    const amount = "50";
    const message = `\x19Ethereum Signed Message:\n${normalizedWallet1Address.length}${normalizedWallet1Address}${wallet2.address}${amount}`;
    await console.loading('Signing transaction');

    const decryptedPrivateKey = await EncryptionService.decryptPrivateKey(wallet1.privateKey);
    const signature = await CryptoService.signMessage(message, decryptedPrivateKey);

    console.printSection('Transaction Details');
    console.log(`Transfer: ${amount} ETH from ${normalizedWallet1Address} to ${wallet2.address}`);
    console.log(`Signature: ${signature}`);
    console.printDivider();

    await console.loading('Processing transaction');
    WalletService.sendAmount(normalizedWallet1Address, wallet2.address, amount, signature);

    console.printSection('Final State');
    wallet.printDetails('Wallet One', normalizedWallet1Address, WalletService.getBalance(normalizedWallet1Address));
    console.log();
    wallet.printDetails('Wallet Two', wallet2.address, WalletService.getBalance(wallet2.address));
    console.printDivider();

    await console.loading('Completing test', 500);
    console.printSection('Test Complete ✅');

  } catch (error: any) {
    console.printSection('Error ❌');
    console.log('Error Details:');
    console.log(`  Type:    ${error.name || 'Unknown Error'}`);
    console.log(`  Message: ${error.message || String(error)}`);
    console.printDivider();
  }
}