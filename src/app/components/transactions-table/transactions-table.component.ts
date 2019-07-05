import { Component, OnInit, Input, transition } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css']
})
export class TransactionsTableComponent implements OnInit {

  @Input() public transactions = [];

  constructor(
    private blockchainService: BlockchainService
  ) { }

  ngOnInit() {
  }

}
