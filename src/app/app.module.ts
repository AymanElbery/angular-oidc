import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingBarModule } from "@ngx-loading-bar/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { SamplePage3Component } from "./components/sample-page3/sample-page3.component";
import { AuthConfigModule } from './auth/auth-config.module';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
@NgModule({
  declarations: [
    AppComponent, 
    SamplePage3Component,
    UnauthorizedComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    ReactiveFormsModule, 
    AppRoutingModule, 
    RouterModule, 
    SharedModule, 
    OverlayModule, 
    LoadingBarModule, 
    BrowserAnimationsModule, 
    HttpClientModule,
    AuthConfigModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {

}
