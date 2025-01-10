export class WalletError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'WalletError';
    }
  }
  
  export class CryptoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CryptoError';
    }
  }
  
  export class TransactionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TransactionError';
    }
  }
  
  export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }