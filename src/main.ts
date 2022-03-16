import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ROUTER_CONFIGURATION } from '@angular/router';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

console.warn('Start app...');
if (environment.production) {
  enableProdMode();

  let passiCookie = document.cookie.indexOf('newSCCSP') > 0;
  if(!passiCookie) {
    console.warn('Sto facendo il redirect');

    let path = location.pathname.substring(location.pathname.indexOf('EESSIGateWEB/')+13,location.pathname.length)

    location.href = environment.baseUrl + '/gestione-utente/redirect'+ (path && path !== ''? '?path='+path : '');
  } else {
    bootstrap();
  }

} else {
  bootstrap();
}

function bootstrap() {
  localStorage.clear(); 

  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
}
