import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {NgModule} from "@angular/core";
import {VisualizzaNewsletterComponent} from "./visualizza-newsletter/visualizza-newsletter.component";
import {SharedModule} from "../../../shared/shared.module";
import {NewsletterRoutingModule} from "./router/newsletter-routing.module";
import {DetailNewsletterComponent} from "./detail-newsletter/detail-newsletter.component";
import {NewsletterService} from "./service/newsletter.service";
import { InviaNewsletterComponent } from './invia-newsletter/invia-newsletter.component';
import {
  RicercaNewsletterComponent,
  RicercaNewsletterParameters
} from './ricerca-newsletter/ricerca-newsletter.component';
import { DualListBoxComponent } from "src/app/common/components/dual-list-box/dual-list-box.component";
import { SortPipe } from "src/app/utils/sort.pipe";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MY_FORMATS } from "src/app/utils/constants";
import { NewsletterResolver } from './router/newsletter.resolver';
import { PrevieNewsletterComponent } from './invia-newsletter/previe-newsletter/previe-newsletter.component';

@NgModule({
  imports: [
    SharedModule,
    NewsletterRoutingModule
  ],
  declarations: [
    VisualizzaNewsletterComponent,
    DetailNewsletterComponent,
    InviaNewsletterComponent,
    RicercaNewsletterComponent,
    DualListBoxComponent,
    SortPipe,
    PrevieNewsletterComponent
  ],
  providers: [
    NewsletterService,
    NewsletterResolver,
    RicercaNewsletterParameters,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class NewsletterModule {
  constructor() {
    console.warn("NEWSLETTER MODULE CONSTRUCTOR");
  }
}
