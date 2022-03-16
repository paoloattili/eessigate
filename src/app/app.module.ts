import { DomSanitizer } from "@angular/platform-browser";
import { MenuService } from "./common/services/menu.service";
import { DialogPreviewComponent } from "./common/components/dialog-preview/dialog-preview.component";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { CategoryService } from "./common/services/category.service";
import { Category } from "./model/tree";
import { LoginService } from "./common/services/login.service";
import { ConfappService } from "./common/services/confapp.service";
import { SpinnerService } from "./common/services/spinner.service";
import { ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SpinnerComponent } from './common/components/spinner/spinner.component';
import { HttpRequestInterceptor } from './utils/http-request-interceptor';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import {SharedModule} from "./shared/shared.module";
import { DirectivesModule } from "./common/directives/directives.module";
import { NotificheComponent } from "./common/components/notifiche/notifiche.component";
import { WebsocketNotifiche } from "./utils/websocket-notifiche";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    ToolbarComponent,
    FooterComponent,
    SidebarComponent,
    SpinnerComponent,
    BreadcrumbsComponent,
    AccessDeniedComponent,
    DialogPreviewComponent,
    NotificheComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    DirectivesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    MenuService,
    SpinnerService,
    LoginService,
    ConfappService,
    CategoryService,
    // WebsocketNotifiche,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
