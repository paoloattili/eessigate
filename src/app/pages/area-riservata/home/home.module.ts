import { ContentService } from "./../contenuti/service/content.service";
import { DocumentoService } from "./../spazio-lavoro/service/documento.service";
import { HomepageService } from "./service/homepage.service";
import { HttpClientXsrfModule } from "@angular/common/http";
import {NgModule} from "@angular/core";
import {HomeComponent} from "../../../pages/area-riservata/home/home.component";
import {SharedModule} from "../../../shared/shared.module";
import { HomeRouteModule } from "./route/home-route.module";
import { BreadcrumbResolver } from "../../../common/services/breadcrumb.resolver";
import { NgScrollbarModule } from 'ngx-scrollbar';


@NgModule({
  imports: [
    SharedModule,
    HomeRouteModule,
    NgScrollbarModule
  ],
  declarations: [HomeComponent],
  exports: [],
  providers: [
    HomepageService,
    DocumentoService,
    ContentService,
    BreadcrumbResolver
  ]
})
export class HomeModule {}
