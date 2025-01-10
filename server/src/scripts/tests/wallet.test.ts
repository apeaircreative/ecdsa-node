// src/scripts/tests/wallet.test.ts
import { CryptoService } from '../../core/crypto';
import { WalletService } from '../../core/wallet';
import { ConsoleUtils as console } from '../utils/console';
import { FormatUtils as format } from '../utils/format';
import { WalletUtils as wallet } from '../utils/wallet';

export async function walletTest() {
  try {
    process.stdout.write('\x1Bc'); // Clear console
    console.printSection('ECDSA Wallet Test');

    // 1. Create wallets
    await console.loading('Creating wallets');
    const wallet1 = WalletService.createWallet();
    const wallet2 = WalletService.createWallet();
    
    console.printSection('Wallet Details');
    wallet.printDetails('Wallet One', wallet1.address);
    console.log();
    wallet.printDetails('Wallet Two', wallet2.address);
    console.printDivider();

    // 2. Initialize balance
    (WalletService as any).balances[wallet1.address] = 100;
    await console.loading('Setting initial balances');
    
    console.printSection('Initial State');
    wallet.printDetails('Wallet One', wallet1.address, WalletService.getBalance(wallet1.address));
    console.log();
    wallet.printDetails('Wallet Two', wallet2.address, WalletService.getBalance(wallet2.address));
    console.printDivider();

    // 3. Execute transfer
    const amount = 50;
    const message = `${wallet1.address}${wallet2.address}${amount}`;
    await console.loading('Signing transaction');
    const signature = await CryptoService.signMessage(message, wallet1.privateKey);

    console.printSection('Transaction Details');
    console.log('Transfer:');
    console.log(`  From:   ${format.shortAddress(wallet1.address)}`);
    console.log(`  To:     ${format.shortAddress(wallet2.address)}`);
    console.log(`  Amount: ${format.eth(amount)}`);
    console.printDivider();

    await console.loading('Processing transaction');
    WalletService.sendAmount(wallet1.address, wallet2.address, amount, signature);

    console.printSection('Final State');
    wallet.printDetails('Wallet One', wallet1.address, WalletService.getBalance(wallet1.address));
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