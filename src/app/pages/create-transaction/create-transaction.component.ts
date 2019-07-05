import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Transaction } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent implements OnInit {

  public newTx = new Transaction(null, null, null);
  public walletKey;

  constructor(
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.newTx = new Transaction(null, null, null);
    this.walletKey = this.blockchainService.walletKeys[0];
  }

  ngOnInit() {
  }

  createTransaction() {

    const newTx = this.newTx;

    // Set the FROM address and sign the transaction
    newTx.fromAddress = this.walletKey.publicKey;
    newTx.signTransaction(this.walletKey.keyObj);

    try {
      this.blockchainService.addTransaction(this.newTx);
    } catch (e) {
      alert(e);
      return;
    }

    this.router.navigate(['/new/transaction/pending', { addedTx: true }]);
    this.newTx = new Transaction(null, null, null);
  }

}
