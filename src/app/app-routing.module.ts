
import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeXelsComponent } from './exchange-xels/exchange-xels.component';
import { DepositComponent } from './deposit/deposit.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: ExchangeXelsComponent},
  { path: 'deposit', component: DepositComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },


];
export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);
