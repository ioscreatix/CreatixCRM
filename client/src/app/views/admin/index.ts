import {NgModule} from "@angular/core";
import { FormsModule }   from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {PackagesViewModule} from "./packages/index";


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PackagesViewModule
  ],
  exports: [
  ],
})

export class AdminDashboardViewsModule {
}
