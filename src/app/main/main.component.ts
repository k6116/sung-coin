import { Component, OnInit } from '@angular/core';
import { Block, Blockchain, Transaction } from './models';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

declare var require: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  paulCoin: Blockchain;

  constructor(
  ) { }

  ngOnInit() {

    const myKey = ec.keyFromPrivate('391ae1d81d22ff1ca2335ca245f85800a83c5b4378d4d5d272d301c1d9f3b42f');
    const myWalletAddress = myKey.getPublic('hex');

    this.paulCoin = new Blockchain();

    const tx1 = new Transaction(myWalletAddress, 'some public key', 10);
    tx1.signTransaction(myKey);

    this.paulCoin.addTransaction(tx1);

    // this.paulCoin.createTransaction(new Transaction('address1', 'address2', 100));
    // this.paulCoin.createTransaction(new Transaction('address2', 'address1', 50));

    console.log('\n Starting the miner...');
    this.paulCoin.minePendingTransactions(myWalletAddress);

    console.log('\n Balance of Paul is: ', this.paulCoin.getBalanceOfAddress(myWalletAddress));
    console.log('Is chain valid?', this.paulCoin.isChainValid());

    // tamper attempt
    this.paulCoin.chain[1].transactions[0].amount = 1;

    console.log('Is chain valid?', this.paulCoin.isChainValid());


    // console.log('\n Starting the miner again...');
    // this.paulCoin.minePendingTransactions('pauls-address');

    // console.log('\n Balance of Paul is: ', this.paulCoin.getBalanceOfAddress('pauls-address'));

    // console.log('Mining block 1...');
    // this.paulCoin.addBlock(new Block('2019-07-03', { amount: 4 }));

    // console.log('Mining block 2...');
    // this.paulCoin.addBlock(new Block('2019-07-04', { amount: 10 }));

    // Tampering attempt
    // console.log('is blockchain valid? ' + this.paulCoin.isChainValid());
    // this.paulCoin.chain[1].data.amount = 200;
    // this.paulCoin.chain[1].hash = this.paulCoin.chain[1].calculateHash();
    // console.log('is blockchain valid? ' + this.paulCoin.isChainValid());

    console.log(this.paulCoin);

  }

}
