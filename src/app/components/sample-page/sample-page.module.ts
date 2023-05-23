import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamplePageRoutingModule } from './sample-page-routing.module';
import { SamplePage1Component } from './sample-page1/sample-page1.component';
import { SamplePage2Component } from './sample-page2/sample-page2.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SamplePage1Component,
    SamplePage2Component
  ],
  imports: [
    CommonModule,
    SamplePageRoutingModule,
    SharedModule
  ]
})
export class SamplePageModule { }
