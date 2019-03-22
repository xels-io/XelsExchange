import { Component, OnInit, OnDestroy, Input,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { XelsService } from '../shared/xels.service';
import { SendCoinBuilding } from '../shared/models/xchange';
import { WalletInfo } from '../shared/models/walletInfo';
import { FeeEstimation } from '../shared/models/FeeEstimate';


import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-exchange-xels',
  templateUrl: './exchange-xels.component.html',
  styleUrls: ['./exchange-xels.component.css']
})
export class ExchangeXelsComponent implements OnInit {

  //@Input() address: string;
  @Output() messageEvent = new EventEmitter<any>();
  public sendForm: FormGroup;

  public hasOpReturn: boolean;
  public coinUnit: string;
  public isSending = false;
  public estimatedFee = 0;

  public totalBalance = 0;
  public apiError: string;
  public firstTitle: string;
  public secondTitle: string;
  public opReturnAmount = 1000;
  private transactionHex: string;
  private responseMessage: any;
  public ethWallet: any;
  public walletAddress: any;
  private ethPvtkey: any;
  private transaction: SendCoinBuilding;
  private walletBalanceSubscription: Subscription;
  sendFormErrors = {
    'xels_address': '',
    'deposit_eth': '',
    'receive_xels': '',
    'eth_address': '',
  };

  sendValidationMessages = {
    'xels_address': {
      'required': 'An address is required.',
      'minlength': 'An address is at least 26 characters long.'
    },
    'deposit_eth': {
      'required': 'An amount of Etherum is required.',
      'pattern': 'Enter a valid Etherum amount. Only positive numbers and no more than 8 decimals are allowed.',
      'min': 'The amount has to be more or equal to 0.00001 Xels.',
      'max': 'The total transaction amount exceeds your available balance.'
    },
    'receive_xels': {
      'required': 'An amount of Xels is required.'
    },
    'eth_address': {
      'required': 'An address is required.'
    }
  };


  constructor( private apiService: XelsService, private formBuilder: FormBuilder, private router: Router) {
    this.sendForm = formBuilder.group({
      name: ['', Validators.required]
  });
    // this.buildSendForm();
   }

  ngOnInit() {

    this.initXelsForm();
    this.startSubscriptions();
    this.ethAddress();
  }
  ethAddress() {
    this.ethWallet = this.apiService.getEThWalletAddress().subscribe( (response: any) => {
      this.walletAddress = response.public;
      this.ethPvtkey = response.private;
    });
  }
  initXelsForm() {
    this.sendForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      'deposit_eth': [null, Validators.compose([Validators.required,  Validators.pattern(/^([0-9]+)?(\.[0-9]{0,8})?$/), Validators.min(0.00001), (control: AbstractControl) => Validators.max((this.totalBalance - this.estimatedFee) / 100000000)(control)])],
      // tslint:disable-next-line:max-line-length
      'receive_xels': [null, Validators.compose([Validators.required , Validators.pattern(/^([0-9]+)?(\.[0-9]{0,8})?$/), Validators.min(0.00001)])],
      'xels_address': [null , Validators.compose([Validators.required, Validators.minLength(26)]) ],
      "fee": ["medium", Validators.required]
    });

    this.sendForm.valueChanges.pipe(debounceTime(300))
      .subscribe(data => this.onSendValueChanged(data));
  }
  get f() { return this.sendForm.controls; }

  private getWalletBalance() {
    const walletInfo = new WalletInfo(this.apiService.getWalletName());
    this.walletBalanceSubscription = this.apiService.getWalletBalance(walletInfo)
      .subscribe(
        response =>  {
            const balanceResponse = response.InnerMsg;
            // TO DO - add account feature instead of using first entry in array
            this.totalBalance = balanceResponse.balances[0].amountConfirmed + balanceResponse.balances[0].amountUnconfirmed;
        },
        error => {
          if (error.statusCode === 0) {
            this.cancelSubscriptions();
          } else if (error.statusCode >= 400) {
            if (!error.InnerMsg[0].message) {
              this.cancelSubscriptions();
              this.startSubscriptions();
            }
          }
        }
      );
  }

updateXels(eth) {
    this.sendForm.get('receive_xels').setValue(eth.target.value);
  }
onSubmit() {
    this.isSending = true;
    this.buildTransaction();
}

onSendValueChanged(data?: any) {
  if (!this.sendForm) { return; }
  const form = this.sendForm;
// tslint:disable-next-line: forinn
  for (const field in this.sendFormErrors) {
    this.sendFormErrors[field] = '';
    const control = form.get(field);
    if (control && control.dirty && !control.valid) {
      const messages = this.sendValidationMessages[field];
      // tslint:disable-next-line:forin
      for (const key in control.errors) {
        this.sendFormErrors[field] += messages[key] + ' ';
      }
    }
  }
  this.apiError = '';
  if (this.sendForm.get('xels_address').valid && this.sendForm.get('deposit_eth').valid) {
    this.estimateFee();
  }
}

public estimateFee() {
  const transaction = new FeeEstimation(
    this.apiService.getWalletName(),
    'account 0',
    this.sendForm.get('xels_address').value.trim(),
    this.sendForm.get('deposit_eth').value,
    this.sendForm.get('fee').value,
    true
  );
  this.apiService.estimateFee(transaction)
    .subscribe(
      response => {
        this.estimatedFee = response.InnerMsg;
      },
      error => {
        this.apiError = error.InnerMsg[0].message;
      }
    );
}

  public buildTransaction() {
    this.transaction = new SendCoinBuilding(
      this.apiService.getWalletName(),
      'account 0',
      '123',
      this.sendForm.get('deposit_eth').value,
      this.sendForm.get('receive_xels').value,
      this.sendForm.get('xels_address').value,
      this.estimatedFee / 100000000,
      true,
    );
    this.apiService
      .buildTransaction(this.transaction)
      .subscribe(
        response => {
          this.estimatedFee = response.InnerMsg.fee;
          this.transactionHex = response.InnerMsg.hex;
          if (this.isSending) {
            this.hasOpReturn = false;

            const obj = {
            'hex': this.transactionHex ,
            'ethAmount' :  this.sendForm.get('deposit_eth').value,
            'xelsAmount' :  this.sendForm.get('receive_xels').value,
            'xelsAddress' : this.sendForm.get('xels_address').value,
            'wallet' : this.walletAddress,
            'pvt': this.ethPvtkey
            }
            console.log(obj);
            this.router.navigate(['/deposit'], {queryParams: obj, skipLocationChange: true });
           // this.sendTransaction(this.transactionHex);

        //    this.router.navigateByData({
        //     url: ["/deposit"],
        //     data: obj, //data
        // });
          }
        },
        error => {
          this.isSending = false;
          this.apiError = error.InnerMsg[0].message;
        }
      );
  }
   // convenience getter for easy access to form fields
  // public send() {
  //   this.isSending = true;
  //   this.buildTransaction();
  // }


  private cancelSubscriptions() {
    if (this.walletBalanceSubscription) {
      this.walletBalanceSubscription.unsubscribe();
    }
  }

  private startSubscriptions() {
    this.getWalletBalance();
  }
}
