import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {PackageApi} from "../../../shared/sdk/services/custom/Package";
import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
import {LoopBackConfig} from "../../../shared/sdk/lb.config";
import {Package} from "../../../shared/sdk/models/Package";
import {PackageFile} from "../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'package-view',
    templateUrl: 'package-view.template.html'
})

export class PackageViewComponent implements AfterViewInit, OnDestroy{

  public package: Package;
  public packageID: string;


  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.packageID = params['id'];
        this.loadPackageData();
      }
    });

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadPackageData() {
    this.packageAPI.findById(this.packageID,{
      include: {
        versions: 'file'
      }
    })
      .subscribe((packageObject : Package) => {
        this.package = packageObject;
        console.log(this.package);
      });
  }

  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
    jQuery('body').addClass('app-packages');
  }

    ngOnDestroy() {
      jQuery('body').removeClass('app-packages');
      // jQuery('body').removeClass('page-aside-scroll');
      // jQuery('body').removeClass('page-aside-left');
    }
}
