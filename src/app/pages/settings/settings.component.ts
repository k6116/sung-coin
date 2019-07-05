import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public blockchain;

  constructor(
    private blockchainService: BlockchainService
  ) {

    this.blockchain = this.blockchainService.blockchainInstance;
  }

  ngOnInit() {
  }

}
