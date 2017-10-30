import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PackagesViewComponent } from "./packages-view.component";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import {RemarkDirectivesModule} from "../../../helpers/directives/index";

@NgModule({
    declarations: [PackagesViewComponent],
    imports     : [BrowserModule, FileUploadModule, RemarkDirectivesModule],
    exports     : [PackagesViewComponent]
})

export class PackagesViewModule {}
