import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PackageViewComponent } from "./package-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
    declarations: [PackageViewComponent],
    imports     : [BrowserModule, RemarkDirectivesModule, RouterModule, MarkdownModule.forRoot()],
    exports     : [PackageViewComponent]
})

export class PackageViewModule {}
