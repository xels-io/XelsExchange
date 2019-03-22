import { Component, OnInit } from '@angular/core';
import { XelsService } from '../shared/xels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionSending } from '../shared/models/transaction-sending';
import { UserService } from '../shared/service/user.service';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})

export class DepositComponent implements OnInit {
  hex: any;
  Eth: any;
  Xels: any;
  address: any;
  wallet: any;
  ethpvt: any;
  constructor(private apiService: XelsService, private usrService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.Eth = this.route.snapshot.queryParams.ethAmount;
    this.Xels = this.route.snapshot.queryParams.xelsAmount;
    this.hex = this.route.snapshot.queryParams.hex;
    this.address = this.route.snapshot.queryParams.xelsAddress;
    this.wallet = this.route.snapshot.queryParams.wallet;
    this.ethpvt = this.route.snapshot.queryParams.pvt;
    this.usrService.saveChangeXels(this.route.snapshot.queryParams).subscribe( response => {
        this.sendTransaction(this.hex);
    });

  }
  public sendTransaction(hex: string) {

    const transaction = new TransactionSending(hex);
    this.usrService
      .updateXelsChange(this.ethpvt)
      .subscribe( res => {
        this.apiService
        .sendTransaction(transaction)
        .subscribe(
          response => {
           // console.log(response);
           //this.activeModal.close('Close clicked');
           //this.openConfirmationModal();
          },
          error => {
           // console.log(error);
            //this.isSending = false;
           //this.apiError = error.InnerMsg[0].message;
          }
        );
      },
      error => {
      //console.log(error);
      //this.isSending = false;
     //this.apiError = error.InnerMsg[0].message;
    }
    );
    // this.apiService
    //   .sendTransaction(transaction)
    //   .subscribe(
    //     response => {
    //       console.log(response);

    //      //this.activeModal.close('Close clicked');
    //      //this.openConfirmationModal();
    //     },
    //     error => {
    //       console.log(error);
    //       //this.isSending = false;
    //      //this.apiError = error.InnerMsg[0].message;
    //     }
    //   );
  }
}
