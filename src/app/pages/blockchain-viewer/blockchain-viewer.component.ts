import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.css']
})
export class BlockchainViewerComponent implements OnInit {

  public blocks = [];
  public selectedBlock = null;

  constructor(
    private blockchainService: BlockchainService
  ) {

    this.blocks = this.blockchainService.getBlocks();
    this.selectedBlock = this.blocks[0];

  }

  ngOnInit() {
  }

  showTransactions(block: any) {
    this.selectedBlock = block;
  }

}
