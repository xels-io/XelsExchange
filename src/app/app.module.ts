import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ExchangeXelsComponent } from './exchange-xels/exchange-xels.component';
import { NavbarComponent } from './navbar/navbar.component';
// import { AppRoutingModule } from './app-routing.module';
import { XelsService } from './shared/xels.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import modules from app
import { routingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { DepositComponent } from './deposit/deposit.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    ExchangeXelsComponent,
    NavbarComponent,
    FooterComponent,
    DepositComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    routingModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [XelsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
