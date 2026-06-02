import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeModule } from "./home/home.module";
import { RouterLink  } from '@angular/router';
import { loaderInterceptor } from './core/Interceptor/loader.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { credentialsInterceptor } from './core/Interceptor/credentials.interceptor';
import { AboutComponent } from './about/about.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BestSellersComponent,
    FavoriteComponent,
    HelpCenterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    RouterLink,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide:    TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:       [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      closeButton:       true,
      positionClass:     'toast-bottom-right',
      countDuplicates:   true,
      timeOut:           2500,
      extendedTimeOut:   1500,
      progressBar:       true,
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      newestOnTop:       true,
      tapToDismiss:      true,
      maxOpened:         5,
      autoDismiss:       false,
      enableHtml:        false,
    }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: credentialsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: loaderInterceptor,      multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
