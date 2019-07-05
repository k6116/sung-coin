import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.css']
})
export class WalletBalanceComponent implements OnInit {

  public walletAddress = '';
  public balance = 0;
  public transactions = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private blockchainService: BlockchainService
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params) => {

      this.walletAddress = params['address'];

      const blockchain = this.blockchainService.blockchainInstance;
      this.balance = blockchain.getBalanceOfAddress(this.walletAddress);
      this.transactions = blockchain.getAllTransactionsForWallet(this.walletAddress);

    });

  }

}
