import { Injectable } from '@angular/core';
import { Blockchain } from '../models';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export interface IWalletKey {
  keyObj: any;
  publicKey: string;
  privateKey: string;
}

@Injectable()
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys: Array<IWalletKey> = [];

  constructor() {

    this.blockchainInstance.difficulty = 1;
    // this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

  getBlocks() {
    return this.blockchainInstance.chain;
  }

  addTransaction(tx: any) {
    this.blockchainInstance.addTransaction(tx);
  }

  getPendingTransactions() {
    return this.blockchainInstance.pendingTransactions;
  }

  minePendingTransactions() {
    this.blockchainInstance.minePendingTransactions(this.walletKeys[0].publicKey);
  }

  addressIsFromCurrentUser(address: string) {
    return address === this.walletKeys[0].publicKey;
  }

  private generateWalletKeys() {

    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex')
    });

  }

}
