import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { HomeComponent } from './home.component';

import { HOME_ROUTE } from './home.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class HomeModule {}
