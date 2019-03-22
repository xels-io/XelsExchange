import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders , HttpParams , HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { environment } from '../../environments/environment';
import * as socketIo from 'socket.io-client';
import { catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import { SendCoinBuilding } from './models/xchange';
import { FeeEstimation } from './models/FeeEstimate';
@Injectable({
  providedIn: 'root'
})
export class XelsService {

  public baseApiUrl = environment.baseUrl;
  public GetApiURL = this.baseApiUrl + '/GetAPIResponse';
  public PostApiURL = this.baseApiUrl + '/PostAPIResponse';
  public socket;
  public xelsApiUrl;
  private apiPort;

  constructor(private http: HttpClient, private router: Router) {
    this.socket = socketIo(this.baseApiUrl);
   }

  public wallet = environment.walletName;
  public account = environment.account;

  getWalletName() {
    return this.wallet;
  }
  getEThWalletAddress() {
    return this.http.get<any>(this.baseApiUrl + '/getEthWallet');
  }

 /**
   * Get wallet balance info from the API.
   */
  getWalletBalance(wallet: any ): Observable<any> {
    const prm: any = new HttpParams().set('URL', '/api/wallet/balance')
    .set('walletName', this.wallet)
    .set('accountName', this.account);
    return this.http.get<any>(this.GetApiURL, {params: prm});
  }
    /**
   * Estimate the fee of a transaction
   */
  estimateFee(data: FeeEstimation): Observable<any> {

    let params = new HttpParams()
      .set('URL', '/api/wallet/estimate-txfee')
      .set('walletName', data.walletName)
      .set('accountName', data.accountName)
      .set('recipients[0][destinationAddress]', data.recipients[0].destinationAddress)
      .set('recipients[0][amount]', data.recipients[0].amount)
      .set('feeType', data.feeType)
      .set('allowUnconfirmed', "true");
      return this.http.get<any>(this.GetApiURL, {params: params});
  }
   /**
   * Build a transaction
   */
  buildTransaction(data: any): Observable<any> {
    console.log(data);
    const pram = {
      URL : '/api/wallet/build-transaction',
      walletName : data.walletName,
      accountName : data.accountName,
      password :  data.password,
      // feeAmount : data.feeAmount,
      feeType : 'medium',
      recipients:[{
        amount: data.recipients[0].amount,
        destinationAddress: data.recipients[0].destinationAddress } ],
      allowUnconfirmed: true,
      shuffleOutputs: false
    }
    return this.http.post(this.PostApiURL, pram);
  }
  // //save
  // saveTrans (data: any): Observable<any> {
  //   return this.http.post(this.PostApiURL, prm);
  // }
    /**
   * Send transaction
   */
  sendTransaction(data: any): Observable<any> {
    const prm = {
      URL: '/api/wallet/send-transaction',
      hex: data.hex
    }
   //console.log(data);
    return this.http.post(this.PostApiURL, prm);
  }

  private handleHttpError(error: HttpErrorResponse, silent?: boolean) {
    if (error.status === 0) {
      if(!silent) {
       // this.modalService.openModal(null, null);
        this.router.navigate(['app']);
      }
    } else if (error.status >= 400) {
      if (!error.error.errors[0].message) {
        console.log(error);
      }
      else {
       // this.modalService.openModal(null, error.error.errors[0].message);
      }
    }
    return throwError(error);
  }
}
