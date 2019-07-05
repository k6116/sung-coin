import SHA256 = require('crypto-js/SHA256');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export class Block {

  timestamp: any;
  transactions: any;  // contains transaction type data like 'amount'
  previousHash: string;
  hash: string;

  // When mining, a miner cannot alter any of the variables in a block.
  // That means when a block is being mined, it would be calculating the same hash over and over.
  // The nonce variable was introduced to solve this problem.
  // The miner will increment the nonce variable on each hash calculation.
  // Any change to the hash calculation will output a completely different hash every time.
  nonce = 0;

  constructor(timestamp: any, transactions: any, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty: number) {

    // The "difficulty" is a variable that will control how difficult it is to mine a block
    // As computing power increases, miners will be able to iterate through hash permutations more quickly
    // By increasing the difficulty, a larger part of the hash has to match what is mined, which means more permutations required.

    // This while loop just mimics one way a block can be mined
    // In this example, the requirement is that all blocks mined need to start with some number of 0s.
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash);

  }

  hasValidTransactions() {

    // Loops through every transaction to ensure each one is valid

    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }

}

export class Blockchain {

  chain: any;
  difficulty = 4; // Increase the difficulty to make mining harder
  pendingTransactions = [];
  miningReward = 100;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // The genesis block is the first block in a blockchain. Does not contain a 'previous hash' for this reason.
  createGenesisBlock() {
    return new Block(Date.now(), { amount: 0 });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress: string) {

    // Once a block is mined, the add the reward to the transactions
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!', block);
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  // Add a new transaction to the queue
  addTransaction(transaction: any) {

    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must has a valid from and to address!');
    }

    if (!transaction.isValid) {
      throw new Error('Cannot add invalid transaction to the chain');
    }

    this.pendingTransactions.push(transaction);
  }

  // To retreive the balance of an address (wallet), the address is checked in all the blockchains
  // and then the amount is added or subtracted based on if the address being checked is for "From" or "To" purposes
  getBalanceOfAddress(address: string) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {

        if (trans.fromAddress === address) {
          balance -= Number(trans.amount);
        }

        if (trans.toAddress === address) {
          balance += Number(trans.amount);
        }

      }
    }

    return balance;
  }

 // Returns a list of all transactions that happened
 // to and from the given wallet address.
  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    return txs;
  }

  // Check if the blockchain has been tampered with
  isChainValid() {

    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {

      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if any of the blocks in the chain are invalid
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      // Check if the hash of the current block is what it should be
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if the previous hash of the current block matches the hash of the previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

    }

    return true;

  }

}

export class Transaction {

  fromAddress: string;
  toAddress: string;
  amount: number;
  signature: string;
  timestamp: any;

  constructor(fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  // Signing a key is the act of verifying a public key
  // For example, if I want you to send me secret data, I need to send you my public key.
  //  But how can you know that when I send you my public key,
  //   it wasn't intercepted by someone else and you won't be sending data to them instead
  //  If we both have a third person that we trust and have a secure channel with them, we can ask that person to sign my public key
  //  So when you receive my public key signed by that third person, you know it is my public key
  signTransaction(signingKey: any) {

    // You can only spend coins from the address you have the private key for
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    // The signing is embedded into the hash
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  isValid() {

    // This takes care of the mining reward case
    if (this.fromAddress === null) { return true; }

    // This checks for a signature
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction!');
    }

    // This creates a public key from the fromAddress so we can verify
    //  that the signature for this publicKey is what it's supposed to be.
    // This is because in the signTransaction function, we embed the signature based on the calculateHash function
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);

  }

}
