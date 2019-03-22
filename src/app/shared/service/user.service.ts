import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { Observable, throwError} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public baseUserUrl =  environment.baseUserUrl;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get(`/users/` + id);
    }

    update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
    loginUser(data: any): Observable<any> {
      const prm = {

        email: data.email,
        password: data.password
      };
      return this.http.post(this.baseUserUrl + '/login', prm);
    }
    registerUser(data: any): Observable<any> {
      const prm = {
        username: data.username,
        email: data.email,
        password: data.password
      };
      return this.http.post(this.baseUserUrl + '/register', prm);
    }

    saveChangeXels(transaction: any): Observable<any> {
      const prm = {
        xelsAddress: transaction.xelsAddress,
        ethAddress: transaction.wallet,
        ethPvt: transaction.pvt,
        xelsAmount: transaction.xelsAmount,
        ethAmount: transaction.ethAmount,
        status: 0
      };
      return this.http.post(this.baseUserUrl + '/saveTransaction', prm);
    }

    updateXelsChange(transaction: any): Observable<any> {

      const prm = {
        ethPvt: transaction,
        status: 1
      };
      return this.http.post(this.baseUserUrl + '/updateTransaction', prm);
    }
}
